# Imports
from flask import request, jsonify, session, request, redirect, url_for
from config import db
from models import * 
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required
from flask import Blueprint

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
        documents = list(collection.find({}, {"_id": 0}))
        return jsonify({"documents":documents, "success":True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


"""
POST: /api/user/create

{
    "email": ""
    "password": ""
    "first_name": ""
    "last_name": ""
    "settings": {}
    "profile_picture": ""
    "role": ""
}

Creates a new user in the database
Returns a JWT of the user's ID
"""
@user_bp.route("/create", methods=["POST"])
def create_user():
    # Check to see if content-type is json
    if request.headers['Content-Type'] != 'application/json':
        return jsonify({"error": "Content-Type must be application/json", "success":False}), 400
    
    #Sets data from request
    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON", "success":False}), 400
    try:
        # Generates encrypted password using bcrypt
        hashed_password = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')

        #Create user using data
        user = User(
            email = data.get('email'),
            password = hashed_password,
            first_name = data.get('first_name'),
            last_name = data.get('last_name'),
            settings = data.get('settings'),
            profile_picture = data.get('profile_picture'),
            favorites = [],
            posts = [],
            role = data.get('role'),
            created_at = datetime.datetime.now(),
            updated_at = datetime.datetime.now()
            )
        user.save()

        #Create JWT token and return it
        token = create_access_token(identity=str(user.id))
        return jsonify({"message":"User Creation Successful", "success":True, "token":token}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        return jsonify({"error": "Invalid JSON", "success":False}), 400
    try:
        # Fetches email and password, fetches user from email
        email = data.get('email')
        password = data.get('password')
        user = User.objects(email=email).first()

        # Compare given and hashed password from database, if match, login
        if user and bcrypt.check_password_hash(user.password, password):
            token = create_access_token(identity=str(user.id))
            return jsonify({"message":"Login Successful", "success":True, "token":token}), 200
        else:
            return jsonify({"error": "Invalid Email or Password", "success":False}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500