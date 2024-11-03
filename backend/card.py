from flask import Flask, Blueprint, request, jsonify
from firebase import db, firebase_auth_required, firestore, add_to_bucket
from openai_api import describe_image, generate_image, describe_hex

card_routes = Blueprint('card_routes', __name__)

def lighten_hexcode(hex_color):
    factor = 0.45
    hex_color = hex_color.lstrip('#')
    
    # Convert hex color to RGB components
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)
    
    # Increase brightness by multiplying each component by (1 + factor)
    # Ensure it doesn't exceed 255 (maximum RGB value)
    r = min(int(r + (255 - r) * factor), 255)
    g = min(int(g + (255 - g) * factor), 255)
    b = min(int(b + (255 - b) * factor), 255)
    
    # Convert back to hex and format as a hex string
    return f'#{r:02x}{g:02x}{b:02x}'

@card_routes.route('/create_card', methods=['GET', 'POST'])
# @firebase_auth_required
def create_card():
    # retrieve the data
    data = request.get_json()
    card_data = data["card_data"]
    user_id = data["user_data"]

    # modify the card 
    card_data["user_id"] = user_id

    # find description of the original image
    orig_download_url = card_data["image_url"]
    response = describe_image(orig_download_url)

    card_data["species_name"] = response["species_name"]
    card_data["scientific_name"] = response["scientific_name"]
    card_data["facts"] = response["facts"]
    card_data["description"] = response["description"]
    card_data["rarity"] = response["rarity"]
    
    description = response["description"]

    # create a new styled image for the card and add to bucket
    generated_image_url = generate_image(description)
    card_download_url = add_to_bucket(generated_image_url, "card_images")
    card_data["card_image_url"] = card_download_url

    # keep track of the main color of the image
    hex_code = describe_hex(card_download_url)
    card_data["hex_code"] = lighten_hexcode(hex_code)

    # add the card to the list of documents
    card_ref = db.collection("cards").add(card_data) 
    card_id = card_ref[1].id
    
    # update the user document
    user_ref = db.collection("users").document(user_id)
    user_ref.update({
        "card_array": firestore.ArrayUnion([{"card_id": card_id, "is_owned": True}])
    })

    return jsonify({"message": "Card created and added to user's collection.", "card_data": card_data}), 201

@card_routes.route('/get_card', methods=['GET'])
def get_card():
    card_id = request.args["card_id"]
    card_ref = db.collection("cards").document(card_id)
    card_doc = card_ref.get()

    card_data = card_doc.to_dict()
    return jsonify({"card_data": card_data}), 200

@card_routes.route('/view_gallery', methods=['GET'])
def view_gallery():
    # retrieve user document
    
    user_id = request.args["user_id"]
    print("this is happening. searching user id of: "+user_id)
    user_ref = db.collection("users").document(user_id)
    user_doc = user_ref.get()

    user_data = user_doc.to_dict()
    user_cards = []

    # loop through user's cards and retrieve each card's details
    for card in user_data["card_array"]:
        card_id = card["card_id"]
        print("fount a card: "+card_id)
        card_doc = db.collection("cards").document(card_id).get()
        
        # append the card information in the array
        card_data = card_doc.to_dict()
        card_data["is_owned"] = card["is_owned"]
        card_data["card_id"] = card_id
        user_cards.append(card_data)

    return jsonify({"message": "Retrieved list of user cards", "cards": user_cards}), 200

@card_routes.route('/view_tradable_cards', methods=['GET'])
def view_tradable_cards():
    # retrieve user id
    user_id = request.args["user_id"]
    tradable_cards = []

    # identify all the cards the user could trade for (i.e. they do not own them)
    all_cards = db.collection("cards").get()
    for card_doc in all_cards:
        card_data = card_doc.to_dict()
        if card_data["user_id"] != user_id:
            tradable_cards.append(card_data)

    return jsonify({"message": "Retrieved list of tradable cards", "cards": tradable_cards}), 200

@card_routes.route('/view_all_cards', methods=['GET'])
def view_all_cards():
    all_cards = []

    # identify all the cards the user could trade for (i.e. they do not own them)
    cards_array = db.collection("cards").get()
    for card_doc in cards_array:
        card_data = card_doc.to_dict()
        all_cards.append(card_data)

    return jsonify({"message": "Retrieved list of all cards", "cards": all_cards}), 200
