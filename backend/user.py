from flask import Flask, Blueprint, request, jsonify

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/')
def home():
    return jsonify({'message': 'Hello world!'})