from flask import Flask, request, jsonify
from user import user_routes
from card import card_routes
from trade import trade_routes

app = Flask(__name__)

app.register_blueprint(user_routes, url_prefix='/user')
app.register_blueprint(card_routes, url_prefix='/card')
app.register_blueprint(trade_routes, url_prefix='/trade')

if __name__ == '__main__':
    app.run(debug=True)