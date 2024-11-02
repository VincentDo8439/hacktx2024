from flask import Flask, Blueprint, request, jsonify

trade_routes = Blueprint('trade_routes', __name__)

@trade_routes.route('/')
def home():
    return jsonify({'message': 'Hello world!'})