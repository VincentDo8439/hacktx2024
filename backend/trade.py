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

    return jsonify(user_trades)  # Return matched trades as JSON array