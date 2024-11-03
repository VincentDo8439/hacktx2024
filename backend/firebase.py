from flask import Flask, jsonify, request
import firebase_admin
from firebase_admin import credentials, firestore, auth, storage
import os
from dotenv import load_dotenv
from functools import wraps
import requests
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

# Access the API key and define the database
api_key = os.getenv("firebase_key")
cred = credentials.Certificate(api_key)
firebase_admin.initialize_app(cred, {'storageBucket': 'hacktx-9757b.firebasestorage.app'})

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

import uuid
import urllib.parse
from datetime import datetime
import requests

def add_to_bucket(image_url, directory):
    # Fetch the image from the provided URL
    response = requests.get(image_url)

    # Check if the request was successful
    if response.status_code != 200:
        raise Exception(f"Failed to fetch image: {response.status_code}")

    # Get the blob data
    blob_data = response.content
    name = f"{directory}/{datetime.now().isoformat()}.jpg"  # Add a file extension

    # Get a reference to the storage bucket
    blob = bucket.blob(name)

    # Upload the blob data to the storage bucket
    blob.upload_from_string(blob_data, content_type='image/jpeg')

    # Generate a UUID for the download token
    download_token = str(uuid.uuid4())

    # Set the metadata including the download token
    metadata = {"firebaseStorageDownloadTokens": download_token}
    blob.metadata = metadata

    # Update the blob's metadata on the server
    blob.patch()

    # Construct the download URL
    encoded_name = urllib.parse.quote(blob.name, safe='')
    download_url = f"https://firebasestorage.googleapis.com/v0/b/{bucket.name}/o/{encoded_name}?alt=media&token={download_token}"

    print(download_url)

    return download_url