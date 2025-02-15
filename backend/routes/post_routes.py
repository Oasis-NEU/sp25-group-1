# Imports
from flask import request, jsonify
from config import db
from models import *
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint

# Set up post blueprint at "/api/posts"
post_bp = Blueprint('posts', __name__, url_prefix="/api/posts")

# https://docs.google.com/document/d/1QpBL0hMsuVgaeLUXRE9LmVfPSM9XT-BebozhfoxMap4/edit?tab=t.0  UPDATE AND USE THIS FOR ENDPOINT COMPLETION

"""
/api/posts/getAllPosts          DONE
/api/posts/createPostDesigner   DONE
/api/posts/createPostCoder      tbd
/api/posts/trending
/api/posts/likePost
/api/posts/deletePost
/api/posts/updatePost
/api/posts/getComments
/api/posts/makeComment
/api/posts/getPostsByUser
/api/posts/reportPost
"""

"""
GET: /api/posts/getAllPosts
Fetches all posts from the database and returns them as a JSON response
"""
@post_bp.route('/getAllPosts', methods=["GET"])
def get_all_posts():
    try:
        collection = db.posts
        # Finds with no filers and id removed
        documents = list(collection.find({}, {"_id": 0}))
        return jsonify({"documents":documents, "success":True, "status":200})
    except Exception as e:
        return jsonify({"error": str(e), "status":500})

"""
POST: /api/posts/createPostDesigner
JWT Required - PROTECTED ROUTE
{
    "title": ""
    "content": ""
    "images": ["", ""] # Optional
    "looking_for": ""
}

Creates a new post in the database
Returns success message and post ID
"""
@post_bp.route('/createPostDesigner', methods=["POST", "GET"])
@jwt_required
def create_post_designer():
    # Check to see if content-type is json
    if request.headers['Content-Type'] != 'application/json':
        return jsonify({"error": "Content-Type must be application/json", "success":False, "status":400})

    #Sets data from request
    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON", "success":False, "status":400})

    try:
        # Get the currently authenticated user ID from the JWT and try to find user
        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()
        if not user:
            return jsonify({"error": "User not found", "success":False, "status":404})
        
        #If user, try to create post using data
        post = Post(
            title = data.get('title'),
            content = data.get('content'),
            author = user.username,
            images = data.get('images',[]),
            looking_for = data.get('looking_for'),
            comments = [],
            likes = 0,
            created_at = datetime.datetime.now(),
            updated_at = datetime.datetime.now()
            )
        post.save()
        return jsonify({"message":"Designer Post Successful", "success":True, "postId":str(post.id), "status":200})
    except Exception as e:
        return jsonify({"error": str(e), "status":500})


@post_bp.route('/likePost', methods=["POST"])
def like_post():
    #Sets data from request
    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON", "success":False, "status":400})

    try:
        postId = data.get("post_id")
        post = Post.objects(id=postId).first()
        if not post:
            return jsonify({"error": "Post not found", "success":False, "status":404})
        
        post.likes += 1

        post.save()
        return jsonify({"message":"Post Liked", "success":True, "status":200})
    except Exception as e:
        return jsonify({"error": str(e), "status":500})