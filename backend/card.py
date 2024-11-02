from flask import Flask, Blueprint, request, jsonify

card_routes = Blueprint('card_routes', __name__)

@card_routes.route('/')
def home():
    return jsonify({'message': 'Hello world!'})