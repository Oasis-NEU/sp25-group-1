# Imports
from flask import request, jsonify
from config import db, JWT_SECRET_KEY
from models import *
from flask_jwt_extended import jwt_required, get_jwt_identity, decode_token
from flask import Blueprint
import cloudinary
import cloudinary.uploader
from bson.objectid import ObjectId, InvalidId

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
/api/posts/likePost             DONE
/api/posts/unlikePost           DONE
/api/posts/deletePost           DONE
/api/posts/updatePost           
/api/posts/getComments          tbd
/api/posts/makeComment          tbd
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
{
    "title": ""
    "content": ""
    "images": ["", ""] # Optional
    "files": ["", ""] # Optional
    "looking_for": ["designer", "programmer"]
    "post_type": ["designer", "programmer"]
}

Creates a new post in the database
Returns success message and post ID
"""
@post_bp.route('/createPost', methods=["POST", "OPTIONS"])
def create_post():
    try:
        if not request.form:
            return jsonify({"error": "Missing form data", "success": False, "status": 400})

        token = request.form.get("token") or request.json.get("token")
        if not token:
            return jsonify({"error": "Token is missing", "success": False, "status": 401}), 401

        user_id = decode_token(request.form.get("token")).get('sub')
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
            comments={},
            likes=0,
            created_at=datetime.datetime.now(),
            updated_at=datetime.datetime.now(),
            post_type=request.form.get("post_type")
        )
        post.save()

        return jsonify({"message": "Post Successful", "success": True, "postId": str(post.id), "status": 200})

    except Exception as e:
        print(e)
        return jsonify({"error": str(e), "success": False, "status": 500})


"""
POST: /api/posts/likePost
{
    "post_id":""
}

Increases like count for a particular post
Returns success message
"""
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


"""
POST: /api/posts/unlikePost
{
    "post_id":""
}

Decreases like count for a particular post
Returns success message
"""
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
    
"""
POST: /api/posts/deletePost
{
    "post_id":""
}

Deletes the post from database
Returns success message
"""
@post_bp.route('/deletePost', methods=["POST"])
@jwt_required()
def delete_post():
    try:
        user_id = get_jwt_identity()

        data = request.json
        if not data:
            return jsonify({"error": "Invalid JSON", "success":False, "status":400})

        post_id = data["post_id"]
        post = Post.objects(id=post_id).first()
        if not post:
            return jsonify({"error": "Post not found", "success": False, "status": 404})
        
        if str(post.author.id) != str(user_id):
            return jsonify({"error": "Unauthorized: You can only delete your own posts", "success": False, "status": 403})
        
        post.delete()

        return jsonify({"message": "Post deleted successfully", "success": True, "status": 200})
    
    except Exception as e:
        return jsonify({"error": str(e), "success": False, "status": 500})


"""
POST: /api/posts/getPostsByUser
Takes in string user id and finds all posts by that user id
"""
@post_bp.route('/getPostsByUser', methods=["POST"])
def get_posts_by_user():
    # Check to see if content-type is json
    if request.headers['Content-Type'] != 'application/json':
        return jsonify({"error": "Content-Type must be application/json", "success":False, "status":400})
    
    #Sets data from request
    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON", "success":False, "status":400})

    try:
        try:
            obj_id = ObjectId(data.get("userId"))
        except InvalidId:
            return jsonify({"error": "Invalid user ID not found", "success":False, "status":404})
        
        collection = db.posts
        documents = list(collection.find({"author":obj_id}))
        
        for doc in documents:
            doc["_id"] = str(doc["_id"])
            if "author" in doc:
                doc["author"] = str(doc["author"])
                
        return jsonify({"documents":documents, "success":True, "status":200})
    except Exception as e:
        return jsonify({"error": str(e), "status":500})


"""
POST: /api/posts/makeComment
JWT Required - PROTECTED ROUTE
{
    "post_id": "",  # ID of the post to comment on
    "comment": ""    # The comment content
}

Adds a comment to a post
Returns success message
"""
@post_bp.route('/makeComment', methods=["POST"])
@jwt_required()
def make_comment():
    try:
        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()
        if not user:
            return jsonify({"error": "User not found", "success": False, "status": 404})

        data = request.json
        if not data:
            return jsonify({"error": "Invalid JSON", "success":False, "status":400})

        post_id = data["post_id"]
        comment_text = data["comment"]

        try:
            post_id = ObjectId(post_id)
        except Exception:
            return jsonify({"error": "Invalid post_id format", "success": False, "status": 400})

        post = Post.objects(id=post_id).first()
        if not post:
            return jsonify({"error": "Post not found", "success": False, "status": 404})

        post.comments[str(user.username)] = comment_text

        post.save()

        return jsonify({"message": "Comment added successfully", "success": True, "status": 200})

    except Exception as e:
        return jsonify({"error": str(e), "success": False, "status": 500})


"""
GET: /api/posts/getComments
JWT Required - PROTECTED ROUTE
{
    "post_id": ""  # ID of the post to fetch comments for
}

Fetches all comments for a post
Returns success message and list of comments
"""
@post_bp.route('/getComments', methods=["GET"])
@jwt_required()
def get_comments():
    try:
        user_id = get_jwt_identity()
        user = User.objects(id=user_id).first()
        if not user:
            return jsonify({"error": "User not found", "success": False, "status": 404})

        data = request.json
        if not data:
            return jsonify({"error": "Invalid JSON", "success":False, "status":400})

        post_id = data["post_id"]
        if not post_id:
            return jsonify({"error": "Missing 'post_id' parameter", "success": False, "status": 400})

        try:
            post_id = ObjectId(post_id)
        except Exception:
            return jsonify({"error": "Invalid post_id format", "success": False, "status": 400})

        post = Post.objects(id=post_id).first()
        if not post:
            return jsonify({"error": "Post not found", "success": False, "status": 404})

        comments = post.comments

        comment_list = []
        for user_id, comment_text in comments.items():
            try:
                user_obj = User.objects(id=ObjectId(user_id)).first()
                username = user_obj.username if user_obj else "Unknown User"
            except Exception:
                username = "Unknown User"

            comment_list.append({
                "user_id": user_id,
                "username": username,
                "comment": commenttext
            })

        return jsonify({"comments": comment_list, "success": True, "status": 200})

    except Exception as e:
        return jsonify({"error": str(e), "success": False, "status": 500})