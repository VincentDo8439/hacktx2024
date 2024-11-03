from flask import Flask, request, jsonify
from flask_cors import CORS
from user import user_routes
from card import card_routes
from trade import trade_routes

app = Flask(__name__)
CORS(app)

app.register_blueprint(user_routes, url_prefix='/user')
app.register_blueprint(card_routes, url_prefix='/card')
app.register_blueprint(trade_routes, url_prefix='/trade')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)