from flask import Flask, request, jsonify
import os
import numpy as np
import cv2
from flask_cors import CORS
import tensorflow as tf
from collections import Counter
import pymongo
import bcrypt
import jwt
from bson import ObjectId
import datetime

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Secret key for JWT
app.config["SECRET_KEY"] = "MONGO_SECRET_NO_GUESS"

# MongoDB connection
import dns.resolver

MONGO_URI = "mongodb+srv://admin:admin@cluster0.8yqgk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Mock Database for testing when Atlas is unreachable
class MockCollection:
    def __init__(self):
        self.data = {}
    def find_one(self, query):
        username = query.get("username")
        if username and username in self.data:
            return self.data[username]
        # Handle ObjectId query if needed
        if "_id" in query:
            for user in self.data.values():
                if user["_id"] == query["_id"]: return user
        return None
    def insert_one(self, doc):
        doc["_id"] = ObjectId()
        self.data[doc["username"]] = doc
        class Result: 
            def __init__(self, id): self.inserted_id = id
        return Result(doc["_id"])
    def update_one(self, query, update):
        user = self.find_one(query)
        if user and "$push" in update:
            field = list(update["$push"].keys())[0]
            val = update["$push"][field]
            user.setdefault(field, []).append(val)
        if user and "$pull" in update:
            field = list(update["$pull"].keys())[0]
            val = update["$pull"][field]
            if val in user.get(field, []): user[field].remove(val)
    def find(self, query):
        return []

try:
    client = pymongo.MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # Check if we can actually reach the server
    client.admin.command('ping')
    db = client["emotion_db"]
    users_collection = db["users"]
    print("MongoDB connection successful!")
except Exception as e:
    print(f"FAILED to connect to MongoDB: {e}")
    print("Falling back to IN-MEMORY Mock DB for testing...")
    users_collection = MockCollection()

# Load the pre-trained model
MODEL_PATH = os.getenv("MODEL_PATH", "BasicRAF-DB794.h5")
trained_model = tf.keras.models.load_model(MODEL_PATH)

# Set up upload folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load Haar cascade for face detection
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

# Emotion labels
EMOTION_LABELS = ["Surprised", "Fear", "Disgusted", "Happy", "Sad", "Angry", "Neutral"]


def preprocess_image(image):
    """Preprocesses an image for model prediction."""
    img_resized = cv2.resize(image, (100, 100)) / 255.0  # Normalize
    return img_resized


@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "Hello, World!"})


# ----------------- USER AUTHENTICATION -----------------


def generate_jwt_token(user_id):
    """Generates a JWT token for authentication."""
    payload = {
        "user_id": str(user_id),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24),
    }
    token = jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")
    return token


def decode_jwt_token(token):
    """Decodes a JWT token and returns the payload."""
    try:
        payload = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return "Token expired"
    except jwt.InvalidTokenError:
        return "Invalid token"


@app.route("/signup", methods=["POST"])
def signup():
    """Handles user registration."""
    data = request.json
    username = data.get("email")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    # Check if user already exists
    if users_collection.find_one({"username": username}):
        return jsonify({"message": "Username already exists"}), 400

    # Hash password
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    # Save to database (with playlist)
    user_id = users_collection.insert_one(
        {"username": username, "password": hashed_password, "playlist": []}
    ).inserted_id
    token = generate_jwt_token(user_id)

    return jsonify({"message": "Signup successful", "token": token}), 201


@app.route("/login", methods=["POST"])
def login():
    """Handles user login."""
    data = request.json
    username = data.get("email")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    user = users_collection.find_one({"username": username})
    if not user or not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    token = generate_jwt_token(user["_id"])
    return jsonify({"message": "Login successful", "token": token , "email" : username}), 200


@app.route("/add_playlist", methods=["POST"])
def add_playlist():
    """Adds a song to the user's playlist."""
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"message": "Authorization token required"}), 401
    token = token.split(" ")[1]  # remove Bearer
    payload = decode_jwt_token(token)
    if isinstance(payload, str):
        return jsonify({"message": payload}), 401

    user_id = payload["user_id"]
    song_name = request.json.get("song_name")

    if not song_name:
        return jsonify({"message": "Song name is required"}), 400

    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "User not found"}), 404

    users_collection.update_one(
        {"_id": ObjectId(user_id)}, {"$push": {"playlist": song_name}}
    )

    return jsonify({"message": "Song added to playlist successfully"}), 200


@app.route("/get_playlist", methods=["GET"])
def get_playlist():
    """Retrieves the user's playlist."""
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"message": "Authorization token required"}), 401
    token = token.split(" ")[1]  # remove Bearer
    payload = decode_jwt_token(token)
    if isinstance(payload, str):
        return jsonify({"message": payload}), 401

    user_id = payload["user_id"]
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"playlist": user["playlist"]}), 200


@app.route("/remove_from_playlist", methods=["POST"])
def remove_from_playlist():
    """Removes a song from the user's playlist."""
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"message": "Authorization token required"}), 401
    token = token.split(" ")[1]  # remove Bearer
    payload = decode_jwt_token(token)
    if isinstance(payload, str):
        return jsonify({"message": payload}), 401

    user_id = payload["user_id"]
    song_name = request.json.get("song_name")

    if not song_name:
        return jsonify({"message": "Song name is required"}), 400

    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "User not found"}), 404

    users_collection.update_one(
        {"_id": ObjectId(user_id)}, {"$pull": {"playlist": song_name}}
    )

    return jsonify({"message": "Song removed from playlist successfully"}), 200


# ----------------- IMAGE PROCESSING -----------------


@app.route("/img", methods=["POST"])
def process_images():
    """Processes uploaded images and predicts emotions."""
    if "file" not in request.files:
        return jsonify({"message": "No files found"}), 400

    files = request.files.getlist("file")
    if not files:
        return jsonify({"message": "No files found"}), 400

    predicted_emotions = []

    for file in files:
        if file.filename == "":
            continue

        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), -1)
        faces = face_cascade.detectMultiScale(
            img, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
        )

        if len(faces) == 0:
            predicted_emotions.append("No face detected")
            continue

        for x, y, w, h in faces:
            face = img[y : y + h, x : x + w]
            resized_face = preprocess_image(face)
            predictions = trained_model.predict(np.expand_dims(resized_face, axis=0))
            predicted_class = np.argmax(predictions)
            predicted_emotions.append(EMOTION_LABELS[predicted_class])

    if not predicted_emotions:
        return jsonify({"message": "No faces detected in any of the images"}), 400

    # Find the most frequent emotion prediction
    most_common_emotion = Counter(predicted_emotions).most_common(1)[0][0]

    return (
        jsonify(
            {
                "message": "Image processing successful",
                "predicted_emotion": most_common_emotion,
            }
        ),
        200,
    )


if __name__ == "__main__":
    app.run(debug=True)
