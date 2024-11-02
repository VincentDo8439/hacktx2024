from flask import Flask, Blueprint, request, jsonify
from firebase import db

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/create_user', methods=['POST'])
def create_user():
    data = request.get_json()  # Retrieve JSON data from the request
    user_email = data.get("email")

    if not user_email:
        return jsonify({"error": "Email is required"}), 400

    # Create a new document in 'users' collection
    doc_ref = db.collection('users').document()  # Automatically generates a new document ID
    doc_ref.set({
        "user_email": user_email,
        "card_array": []  # Set card_array as an empty array
    })

    return jsonify({"message": "User created successfully", "user_id": doc_ref.id}), 201