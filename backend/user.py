from flask import Flask, Blueprint, request, jsonify
from firebase import db

user_routes = Blueprint('user_routes', __name__)
@user_routes.route('/')
def home():
    # Retrieve all documents in the 'users' collection
    users_ref = db.collection('users')
    docs = users_ref.stream()

    # Store documents in a list
    users = []
    for doc in docs:
        user_data = doc.to_dict()
        user_data['id'] = doc.id  # Add document ID to data
        users.append(user_data)

    return jsonify(users)  # Return data as JSON response