from flask import Flask, Blueprint, request, jsonify
from firebase import db

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/create_user', methods=['POST'])
def create_user():
    data = request.get_json()  # Retrieve JSON data from the request
    user_email = data["email"]
    user_username = data["username"]

    if not user_email:
        return jsonify({"error": "Email is required"}), 400

    # Create a new document in 'users' collection
    doc_ref = db.collection('users').document()  # Automatically generates a new document ID
    doc_ref.set({
        "user_email": user_email,
        "username": user_username,
        "card_array": []  # Set card_array as an empty array
    })

    return jsonify({"message": "User created successfully", "user_id": doc_ref.id}), 201