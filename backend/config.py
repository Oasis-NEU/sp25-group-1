import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get MongoDB URI from environment variables
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/OasisDatabase")

# Create a MongoDB client connection
client = MongoClient(MONGO_URI)
db = client.get_database("OasisDatabase")
