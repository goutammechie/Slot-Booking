from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)
client = MongoClient('mongodb://localhost:27017/')
db = client['slot-booking']


@app.route('/home')
def home():
    return "API is live!"

@app.route('/api/book', methods=['POST'])
def book_slot():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        # Save the booking data in the MongoDB collection
        db['bookings'].insert_one(data)
        return jsonify({"message": "Booking successful!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
