from flask import Flask, jsonify, request
import firebase_admin
from firebase_admin import credentials, firestore, auth, storage
import os
from dotenv import load_dotenv
from functools import wraps
import requests
import datetime

# Load environment variables from .env file
load_dotenv()

# Access the API key and define the database
api_key = os.getenv("firebase_key")
cred = credentials.Certificate(api_key)
firebase_admin.initialize_app(cred, {'storageBucket': 'hacktx-9757b.appspot.com'})

bucket = storage.bucket()
db = firestore.client()

# Middleware function
def firebase_auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get the token from the request headers
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Authorization header missing"}), 401

        # Token should be in the format "Bearer <token>"
        id_token = auth_header.split(" ")[1] if " " in auth_header else None
        if not id_token:
            return jsonify({"error": "Invalid authorization format"}), 401

        try:
            # Verify the token
            decoded_token = auth.verify_id_token(id_token)
            request.user = decoded_token  # Attach user info to the request
        except Exception as e:
            # If token is invalid or expired
            return jsonify({"error": "Invalid or expired token"}), 401

        return f(*args, **kwargs)

    return decorated_function

# Adding an image to the storage bucket
def add_to_bucket(image_url, directory):

    # Fetch the image from the provided URL
    response = requests.get(image_url)

    # Get the blob data
    blob = response.content
    name = f"{directory}/{datetime.now().isoformat()}"

    # Get a reference to the storage bucket
    blob = bucket.blob(name)
    blob.upload_from_string(blob, content_type='image/jpeg')

    # Generate the download URL
    download_url = blob.public_url
    return download_url
