from flask import request, jsonify, session, request, redirect, url_for
from config import db
from .user import user_bp
from models import * 
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os

load_dotenv()
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
@user_bp.route('/getAllUsers', methods=["GET"])
def get_all_posts():
    try:
        collection = db.users
        documents = list(collection.find({}, {"_id": 0}))
        return jsonify({"documents":documents, "success":True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Need to add JSONWEBTOKENS, need to add default profile picture and settings method
@user_bp.route("/create", methods=["POST", "GET"])
def create_user():
    if request.headers['Content-Type'] != 'application/json':
        return jsonify({"error": "Content-Type must be application/json", "success":False}), 400
    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON", "success":False}), 400
    try:

        hashed_password = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')

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
        return jsonify({"message":"User Creation Successful", "success":True, "token":str(user)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500