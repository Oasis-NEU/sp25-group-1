# Imports
from flask import request, jsonify
from config import db
from models import *
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint
import cloudinary
import cloudinary.uploader

# Set up post blueprint at "/api/posts"
post_bp = Blueprint('posts', __name__, url_prefix="/api/posts")

# Image Restrictions
MAX_SIZE = 5 * 1024 * 1024
MAX_IMAGES = 5
MAX_FILES = 5

# https://docs.google.com/document/d/1QpBL0hMsuVgaeLUXRE9LmVfPSM9XT-BebozhfoxMap4/edit?tab=t.0  UPDATE AND USE THIS FOR ENDPOINT COMPLETION

"""
/api/posts/getAllPosts          DONE
/api/posts/createPost           DONE
/api/posts/trending
/api/posts/likePost
/api/posts/unlikePost 
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
        documents = list(collection.find({}))
        for doc in documents:
            doc["_id"] = str(doc["_id"])
            if "author" in doc:
                doc["author"] = str(doc["author"])

        return jsonify({"documents":documents, "success":True, "status":200})
    except Exception as e:
        return jsonify({"error": str(e), "status":500})

"""
POST: /api/posts/createPost
JWT Required - PROTECTED ROUTE
{
    "title": ""
    "content": ""
    "images": ["", ""] # Optional
    "files": ["", ""] # Optional
    "looking_for": ""
    "post_type": ["designer", "programmer"]
}

Creates a new post in the database
Returns success message and post ID
"""
@post_bp.route('/createPost', methods=["POST", "GET"])
@jwt_required()
def create_post():
    try:
        if not request.form:
            return jsonify({"error": "Missing form data", "success": False, "status": 400})

        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()
        if not user:
            return jsonify({"error": "User not found", "success": False, "status": 404})

        # Handle image uploads
        uploaded_images = []
        if 'images' in request.files:
            files = request.files.getlist('images')

            if len(files) > MAX_IMAGES:
                return jsonify({"error": f"Maximum {MAX_IMAGES} images allowed per post", "success": False, "status": 400})

            for file in files:
                if file and file.filename:
                    file.seek(0)
                    file_size = len(file.read())
                    file.seek(0)
                    if file_size > MAX_SIZE:
                        return jsonify({"error": f"File {file.filename} exceeds 5MB limit", "success": False, "status": 400})

                    upload_result = cloudinary.uploader.upload(file)
                    uploaded_images.append(upload_result['secure_url'])
            
        # Handle file uploads
        uploaded_files = []
        if 'files' in request.files:
            files = request.files.getlist('files')

            if len(files) > MAX_FILES:
                return jsonify({"error": f"Maximum {MAX_FILES} images allowed per post", "success": False, "status": 400})

            for file in files:
                if file and file.filename:
                    file.seek(0)
                    file_size = len(file.read())
                    file.seek(0)

                    if file_size > MAX_SIZE:
                        return jsonify({"error": f"File {file.filename} exceeds 5MB limit", "success": False, "status": 400})

                    # Upload file to Cloudinary as a raw file
                    upload_result = cloudinary.uploader.upload(file, resource_type="raw")
                    uploaded_files.append({
                        "filename": file.filename,
                        "file_url": upload_result['secure_url']
                    })

        # Create post
        post = Post(
            title=request.form.get('title'),
            content=request.form.get('content'),
            author=user,
            images=uploaded_images,
            files=uploaded_files,
            looking_for=request.form.get('looking_for'),
            comments=[],
            likes=0,
            created_at=datetime.datetime.now(),
            updated_at=datetime.datetime.now(),
            post_type=request.form.get("post_type")
        )
        post.save()

        return jsonify({"message": "Post Successful", "success": True, "postId": str(post.id), "status": 200})

    except Exception as e:
        return jsonify({"error": str(e), "success": False, "status": 500})
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
    

@post_bp.route('/unlikePost', methods=["POST"])
def unlike_post():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON", "success":False, "status":400})

    try:
        postId = data.get("post_id")
        post = Post.objects(id=postId).first()
        if not post:
            return jsonify({"error": "Post not found", "success":False, "status":404})
        
        post.likes -= 1
        
        post.save()
        return jsonify({"message":"Post Unliked", "success":True, "status":200})
    
    except Exception as e:
        return jsonify({"error": str(e), "status":500})