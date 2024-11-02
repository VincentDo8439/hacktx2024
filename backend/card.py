from flask import Flask, Blueprint, request, jsonify
from firebase import db, firebase_auth_required, firestore

card_routes = Blueprint('card_routes', __name__)

@card_routes.route('/create_card', methods=['GET', 'POST'])
# @firebase_auth_required
def create_card():
    # retrieve the data
    data = request.get_json()
    card_data = data["card_data"]
    user_id = data["user_data"]

    # modify the card 
    card_data["user_id"] = user_id
    
    # create a new styled image for the card
    
    # keep track of the main color of the image

    # add the image to the bucket 

    # add the card to the list of documents
    card_ref = db.collection("cards").add(card_data) 
    card_id = card_ref[1].id
    
    # update the user document
    user_ref = db.collection("users").document(user_id)
    user_ref.update({
        "card_array": firestore.ArrayUnion([{"card_id": card_id, "is_owned": True}])
    })

    return jsonify({"message": "Card created and added to user's collection.", "card_id": card_id}), 201

@card_routes.route('/view_gallery', methods=['GET'])
def view_gallery():
    # retrieve user document
    user_id = request.args["user_id"]
    user_ref = db.collection("users").document(user_id)
    user_doc = user_ref.get()

    user_data = user_doc.to_dict()
    user_cards = []

    # loop through user's cards and retrieve each card's details
    for card in user_data["card_array"]:
        card_id = card["card_id"]
        card_doc = db.collection("cards").document(card_id).get()
        
        # append the card information in the array
        card_data = card_doc.to_dict()
        card_data["is_owned"] = card["is_owned"]
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
