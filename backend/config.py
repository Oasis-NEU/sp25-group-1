# Imports
import os
from pymongo import MongoClient
import mongoengine as me
import cloudinary
import cloudinary.uploader
import cloudinary.api
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from authlib.integrations.flask_client import OAuth

# Load environment variables from .env file
load_dotenv()

# Get MongoDB URI from environment variables
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/OasisDatabase")

# JWT Secret Key
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

# Create the OAuth object
oauth = None

# Return frontend URL

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

def init_oauth(app):
    global oauth
    oauth = OAuth(app)
    oauth.register(
        name='google',
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_id=os.getenv("GOOGLE_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        client_kwargs={
            'scope': 'openid email profile'
        }
    )


# Cloudinary Info

cloudinary.config(
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key = os.getenv('CLOUDINARY_API_KEY'),
    api_secret = os.getenv('CLOUDINARY_API_SECRET')
)

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