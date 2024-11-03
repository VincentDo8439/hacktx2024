from flask import Flask, Blueprint, request, jsonify
from firebase import db

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/create_user', methods=['POST'])
def create_user():
    data = request.get_json()  # Retrieve JSON data from the request
    user_email = data["email"]
    user_username = data["username"]

    # Create a new document in 'users' collection
    doc_ref = db.collection('users').document()  # Automatically generates a new document ID
    doc_ref.set({
        "user_email": user_email,
        "username": user_username,
        "card_array": []  # Set card_array as an empty array
    })

    return jsonify({"message": "User created successfully", "user_id": doc_ref.id}), 201

@user_routes.route('/get_user', methods=['GET'])
def get_user():
    user_id = request.args["user_id"]
    user_ref = db.collection("users").document(user_id)
    user_doc = user_ref.get()
    return jsonify({"message": "Retrieved user information", "user_data": user_doc.to_dict()}), 200