import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Access the API key
api_key = os.getenv("firebase_key")

cred = credentials.Certificate(api_key)
firebase_admin.initialize_app(cred)

db = firestore.client()

def get_db():
    return db; 