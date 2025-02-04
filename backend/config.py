# Imports
import os
from pymongo import MongoClient
import mongoengine as me
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager

# Load environment variables from .env file
load_dotenv()

# Get MongoDB URI from environment variables
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/OasisDatabase")

# JWT Secret Key
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

# Create a MongoDB client connection
try:
    client = MongoClient(MONGO_URI)
    db = client.get_database("OasisDatabase")
    print("Connected to MongoDB")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    exit(1)

# Connect to MongoEngine using same MongoDB URI
try:
    me.connect("OasisDatabase", host=MONGO_URI)
    print("Connected MongoDB to MongoEngine")
except Exception as e:
    print(f"Error connecting MongoDB to MongoEngine: {e}")
    exit(1)