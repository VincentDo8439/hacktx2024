from flask import Flask, Blueprint, request, jsonify
from firebase import db

trade_routes = Blueprint('trade_routes', __name__)

@trade_routes.route('/create_trade', methods=['POST'])
def create_trade():
    data = request.get_json()  # Retrieve JSON data from the request

    # Extract the required fields from the request data
    card_id_one = data.get("card_id_one")
    card_id_two = data.get("card_id_two")
    user_id_one = data.get("user_id_one")
    user_id_two = data.get("user_id_two")

    # Validation to ensure all fields are provided
    if not all([card_id_one, card_id_two, user_id_one, user_id_two]):
        return jsonify({"error": "All fields (card_id_one, card_id_two, user_id_one, user_id_two) are required"}), 400

    # Create a new document in 'trades' collection
    trade_ref = db.collection('trades').document()  # Automatically generates a new document ID
    trade_ref.set({
        "card_id_one": card_id_one,
        "card_id_two": card_id_two,
        "user_id_one": user_id_one,
        "user_id_two": user_id_two,
        "set_active": True  # Sets set_active to true
    })

    return jsonify({"message": "Trade created successfully", "trade_id": trade_ref.id}), 201

@trade_routes.route('/update_trade_status', methods=['POST'])
def update_trade():
    data = request.get_json()  # Retrieve JSON data from the request
    trade_id = data.get("id")

    if not trade_id:
        return jsonify({"error": "Trade ID is required"}), 400

    # Reference to the specific document in the trades collection
    trade_ref = db.collection('trades').document(trade_id)

    # Check if the document exists
    if not trade_ref.get().exists:
        return jsonify({"error": "Trade not found"}), 404

    # Update the set_active field to false
    trade_ref.update({"set_active": False})

    return jsonify({"message": "Trade updated successfully", "trade_id": trade_id}), 200


@trade_routes.route('/get_user_trades', methods=['GET'])
def get_user_trades():
    user_id = request.args.get("id")  # Retrieve 'id' from query parameters

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    trades_ref = db.collection('trades')
    docs = trades_ref.stream()

    # Array to store matched documents
    user_trades = []

    # Iterate through each document and check if user_id_one or user_id_two matches
    for doc in docs:
        trade_data = doc.to_dict()
        if trade_data.get("user_id_one") == user_id or trade_data.get("user_id_two") == user_id:
            trade_data['id'] = doc.id  # Add document ID to data for reference
            user_trades.append(trade_data)

    return jsonify({"trades": user_trades}), 200  # Return matched trades as JSON array

# Not Tested
@trade_routes.route('/accept_trade', methods=['POST'])
def accept_trade():
    data = request.get_json()  # Retrieve JSON data from the request

    # Placeholder for retrieving necessary fields from the data
    document_id = data.get('id')  # Example field
    trade_ref = db.collection('trades').document(document_id)
    trade_doc = trade_ref.get()

    if not trade_doc.exists:
        return jsonify({"error": "Trade document not found"}), 404

    # Convert trade document to dictionary and get required fields
    trade_data = trade_doc.to_dict()
    user_id_one = trade_data.get("user_id_one")
    user_id_two = trade_data.get("user_id_two")
    card_id_one = trade_data.get("card_id_one")
    card_id_two = trade_data.get("card_id_two")

    # Step 1 - update user_one_id's card_array (add card_id_two)
    user_ref_one = db.collection('users').document(user_id_one)
    user_doc_one = user_ref_one.get()

    if not user_doc_one.exists:
        return jsonify({"error": "User document not found"}), 404

    # Get the user's card_array and update it with card_id_two
    user_data = user_doc_one.to_dict()
    card_array = user_data.get("card_array", [])  # Default to empty array if not present
    card_array.append(card_id_two)

    user_ref_one.update({"card_array": card_array})

    # Step 2 - update user_two_id's card_array (add card_id_two)
    user_ref_two = db.collection('users').document(user_id_two)
    user_doc_two = user_ref_two.get()

    if not user_doc_two.exists:
        return jsonify({"error": "User document not found"}), 404

    # Get the user's card_array and update it with card_id_two
    user_data_two = user_doc_two.to_dict()
    card_array = user_data_two.get("card_array", [])  # Default to empty array if not present
    card_array.append(card_id_one)

    user_ref_two.update({"card_array": card_array})

    # Step 3 - Update card_id_one to hold user_id_two
    card_ref = db.collection('cards').document(card_id_one)
    card_doc = card_ref.get()

    if not card_doc.exists:
        return jsonify({"error": "Card document not found"}), 404

    # Update the user_id in the card document to user_id_two
    card_ref.update({"user_id": user_id_two})

    # Step 4 - Update card_id_two to hold user_id_one
    card_ref_two = db.collection('cards').document(card_id_two)
    card_doc_two = card_ref_two.get()

    if not card_doc_two.exists:
        return jsonify({"error": "Card document not found"}), 404

    # Update the user_id in the card document to user_id_two
    card_ref_two.update({"user_id": user_id_one})

    # Step 5  - Update active status to false 
    trade_ref.update({"set_active": False})

    # Step 6 - Set user_id_one's card too false for the owned status 
    user_data_one = user_doc_one.to_dict()
    card_array = user_data_one.get("card_array", [])

    # Iterate through card_array to find and update the matching card
    for card in card_array:
        if card.get("card_id") == card_id_one:
            card["is_owned"] = False
            break

    # Update the user document with the modified card_array
    user_ref_one.update({"card_array": card_array})

    # Step 7 - Set user_id_two's card too false for the owned status 
    user_data_two = user_doc_two.to_dict()
    card_array = user_data_two.get("card_array", [])

    # Iterate through card_array to find and update the matching card
    for card in card_array:
        if card.get("card_id") == card_id_two:
            card["is_owned"] = False
            break

    # Update the user document with the modified card_array
    user_ref_two.update({"card_array": card_array})

    return "Success"