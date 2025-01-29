from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import traceback

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['slot-booking']
users_collection = db['users']  # User collection in MongoDB

def authenticate_user(email, password):
    user = users_collection.find_one({"email": email})
    if user and check_password_hash(user['password'], password):
        return True
    return False

def register_user(email, password):
    if users_collection.find_one({"email": email}):
        return False  # Email already exists

    hashed_password = generate_password_hash(password)
    users_collection.insert_one({"email": email, "password": hashed_password})
    return True

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400

    if authenticate_user(email, password):
        return jsonify({"success": True, "message": "Login successful"})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400

    if register_user(email, password):
        return jsonify({"success": True, "message": "Account created successfully"})
    else:
        return jsonify({"success": False, "message": "Email already registered"}), 409

@app.route('/google-login', methods=['POST'])
def google_login():
    try:
        data = request.get_json()
        if not data or "email" not in data:
            return jsonify({"success": False, "message": "Invalid request, email is required"}), 400
        
        email = data["email"]
        name = data["name"]
        
        user = users_collection.find_one({"email": email})
        if user:
            print(f"User {email} already exists in the database.")
        else:
            try:
                user_data = {
                    "email":email,
                    "google_login":True,
                    "name":name,
                    "phone_number":None,
                    "booking_history":None
                }
                result = users_collection.insert_one({"email": email})
                if not result.inserted_id or not users_collection.find_one({"email": email}):
                    return jsonify({"success": False, "message": "User insertion verification failed"}), 500
                print(f"Inserted new user {email}, Inserted ID: {result.inserted_id}")
            except Exception as e:
                print(f"Database Insertion Error: {str(e)}\n{traceback.format_exc()}")
                return jsonify({"success": False, "message": f"Database Insertion Error: {str(e)}"}), 500
        
        return jsonify({"success": True, "message": "Google login successful", "user": email})
    
    except Exception as e:
        print(f"Error during Google login: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"success": False, "message": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)
