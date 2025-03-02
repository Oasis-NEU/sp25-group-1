# Imports
from flask import request, jsonify, session, request, redirect, url_for
from config import db
from models import * 
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required
from flask import Blueprint
import random
import string
from bson.objectid import ObjectId, InvalidId
from datetime import timedelta


# Set up user blueprint at "/api/user"
user_bp = Blueprint('user', __name__, url_prefix="/api/user")

# Set up bcrypt instance
bcrypt = Bcrypt()

"""
/api/user/login
/api/user/create
/api/user/getInfo
/api/user/updateProfile
/api/user/getFavorites
/api/user/changeSettings
/api/user/deleteAccount
/api/user/saveToFavorite
/api/user/forgotPassword
/api/user/verifyEmail
/api/user/follow
/api/user/unfollow
/api/user/getFollowers
"""

"""
GET: /api/user/getAllUsers
Fetches all users from the database and returns them as a JSON response
"""
@user_bp.route('/getAllUsers', methods=["GET"])
def get_all_posts():
    try:
        collection = db.users
        # Finds with no filers and id removed
        documents = list(collection.find({}))
        for doc in documents:
            doc["_id"] = str(doc["_id"])
        return jsonify({"documents":documents, "success":True, "status":200})
    except Exception as e:
        return jsonify({"error": str(e), "status":500})


# Generates a random seed of length 15 for DiceBear profiles
def random_seed():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=15))

# Generates the actual image using the DiceBear API and random_seed function
def random_profile():
    try:
        seed = random_seed()
        return f'https://api.dicebear.com/9.x/shapes/png?seed={seed}&format=png'
    except Exception as e:
        print(f"Error: {e}")
        return "https://upload.wikimedia.org/wikipedia/commons/d/d2/Solid_white.png"

"""
POST: /api/user/create

{
    "email": ""
    "password": ""
    "user_name": ""
    "first_name": ""
    "last_name": ""
    "settings": {}
    "profile_picture": ""
    "role": ""
    "skills": []
    "experience_level": "Beginner" | "Intermediate" | "Expert"
    "interests": []
    "availability": "" SEE FULL LIST IN MODELS.PY
    "looking_for_collab": "Yes" | "No" | "Contact Me"
    "location": ""
}

Creates a new user in the database
Returns a JWT of the user's ID
"""
@user_bp.route("/create", methods=["POST"])
def create_user():
    # Check to see if content-type is json
    if request.headers['Content-Type'] != 'application/json':
        return jsonify({"error": "Content-Type must be application/json", "success":False, "status":400})
    
    #Sets data from request
    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON", "success":False, "status":400})
    
    try:
        # Test to see if user already exists
        collection = db.users
        existing_user = collection.find_one({"email": data.get("email")})
        if existing_user:
            return jsonify({"error": "Email already exists", "success":False, "status": 409})

        existing_user_name = collection.find_one({"user_name": data.get("user_name")})
        if existing_user_name:
            return jsonify({"error": "Username already exists", "success":False, "status": 409})

        # Generates encrypted password using bcrypt
        hashed_password = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')

        #Create user using data
        user = User(
            email = data.get('email'),
            password = hashed_password,
            user_name = data.get('user_name'),
            first_name = data.get('first_name'),
            last_name = data.get('last_name'),
            settings = data.get('settings'),
            profile_picture = random_profile(),
            favorites = [],
            posts = [],
            role = data.get('role'),
            skills = data.get('skills'),
            experience_level = data.get('experience_level'),
            interests = data.get('interests'),
            availability = data.get('availability'),
            looking_for_collab = data.get('looking_for_collab'),
            bio = "",
            location = data.get('location'),
            created_at = datetime.datetime.now(),
            updated_at = datetime.datetime.now()
            )
        user.save()

        #Create JWT token and return it
        token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=2))
        return jsonify({"message":"User Creation Successful", "success":True, "token":token, "status":200})
    except Exception as e:
        return jsonify({"error": str(e), "status":500})

"""
POST: /api/user/login

{
    "email": ""
    "password": ""
}

Checks if user exists and password is correct, logs them in
Returns a JWT of the user's ID
"""
@user_bp.route("/login", methods=["POST"])
def login():
    # Sets data from request
    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON", "success":False, "status":400})
    try:
        # Fetches email and password, fetches user from email
        email = data.get('email')
        password = data.get('password')
        user = User.objects(email=email).first()

        # Compare given and hashed password from database, if match, login
        if user and bcrypt.check_password_hash(user.password, password):
            token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=2))
            return jsonify({"message":"Login Successful", "success":True, "token":token, "status":200})
        else:
            return jsonify({"error": "Invalid Email or Password", "success":False, "status":401})
    except Exception as e:
        return jsonify({"error": str(e), "status":500})

"""
POST: /api/user/getProfileInformation
{
    "profileId": ""
}

Fetches the specific user information
Returns success, message, and data
"""
@user_bp.route('/getProfileInformation', methods=["POST"])
def get_profile_information():
    # Check to see if content-type is json
    if request.headers['Content-Type'] != 'application/json':
        return jsonify({"error": "Content-Type must be application/json", "success":False, "status":400})

    #Sets data from request
    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON", "success":False, "status": 400})

    try:
        # Try to convert the string profileId to an ObjectId type
        try:
            objID = ObjectId(data.get("profileId"))
        except InvalidId:
            return jsonify({"error": "Invalid ObjectId format", "success":False, "status": 400})

        profile = db.users.find_one({"_id": objID})

        if profile:
            profile["id"] = data.get("profileId")
            # Remove certain fields from the profile
            exclude = ["_id", "password", "updated_at", "favorites", "settings"]
            for field in exclude:
                profile.pop(field, None)

            return jsonify({"message":"Fetched profile successfully", "success":True, "profile":profile, "status":200})
        else:
            return jsonify({"message":"Error Fetching Profile/Does Not Exist", "success":False, "status":400})
    except Exception as e:
        return jsonify({"error": str(e), "status":500})