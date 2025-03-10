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
/api/posts/deletePost           
/api/posts/updatePost           DONE
/api/posts/getComments          DONE
/api/posts/makeComment          DONE
/api/posts/getPostsByUser       DONE
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

            if "comments" in doc:
                for comment in doc["comments"]:
                    if "user" in comment:
                        comment["user"] = str(comment["user"])

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
    "looking_for": ["designer", "programmer", "none"]
    "post_type": ["designer", "programmer"]
    "skills_used": ["", ""] # Optional
    "preferred_experience": ["N/A", "Beginner", "Intermediate", "Expert"]
    "project_type": "" #SEE LIST IN MODELS.PY
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
            return jsonify({"error": "Login Again", "success": False, "status": 401}), 401

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
            skills_used=request.form.getlist("skills_used"),
            preferred_experience=request.form.get('preferred_experience'),
            project_type=request.form.get('project_type'),
            comments=[],
            likes=0,
            likedBy=[],
            created_at=datetime.now(),
            updated_at=datetime.now(),
            post_type=request.form.get("post_type")
        )
        post.save()

        user.posts.append(str(post.id))
        user.save()

        return jsonify({"message": "Post Successful", "success": True, "postId": str(post.id), "status": 200})

    except Exception as e:
        return jsonify({"error": str(e), "success": False, "status": 500})

"""
PUT: /api/posts/updatePost
{
    "title": ""
    "content": ""
    "images": ["", ""] # Optional
    "files": ["", ""] # Optional
    "looking_for": ["designer", "programmer", "none"]
    "post_type": ["designer", "programmer"]
    "skills_used": ["", ""] # Optional
    "preferred_experience": ["N/A", "Beginner", "Intermediate", "Expert"]
    "project_type": "" #SEE LIST IN MODELS.PY
    "id":""
    "token":""
}

Edits a post in the database
Returns success message
"""
@post_bp.route('/updatePost', methods=["PUT"])
def update_post():
    try:
        # Ensure request contains form data
        if not request.form:
            return jsonify({"error": "Missing form data", "success": False, "status": 400})

        # Validate user authentication
        token = request.form.get("token") or request.json.get("token")
        if not token:
            return jsonify({"error": "Login Again", "success": False, "status": 401})

        user_id = decode_token(token).get('sub')
        user = User.objects(id=user_id).first()
        if not user:
            return jsonify({"error": "User not found", "success": False, "status": 404})

        postId = request.form.get("id")
        if not postId:
            return jsonify({"error": "Post ID not found", "success": False, "status": 400})

        # Find the post
        post = Post.objects(id=postId).first()
        if not post:
            return jsonify({"error": "Post not found", "success": False, "status": 404})

        # Ensure only the author can edit the post
        if str(post.author.id) != str(user.id):
            return jsonify({"error": "Unauthorized action, not author", "success": False, "status": 403})

        # Update text fields if provided
        post.title = request.form.get('title', post.title)
        post.content = request.form.get('content', post.content)
        post.looking_for = request.form.get('looking_for', post.looking_for)
        post.skills_used = request.form.getlist("skills_used") or post.skills_used
        post.preferred_experience = request.form.get('preferred_experience', post.preferred_experience)
        post.project_type = request.form.get('project_type', post.project_type)
        post.post_type = request.form.get("post_type", post.post_type)

        # Handle image updates
        uploaded_images = post.images if post.images else []
        if 'images' in request.files:
            files = request.files.getlist('images')
            if len(files) > 5:
                return jsonify({"error": "Maximum 5 images allowed per post", "success": False, "status": 400})
            for file in files:
                if file and file.filename:
                    file.seek(0)
                    file_size = len(file.read())
                    file.seek(0)
                    if file_size > 5 * 1024 * 1024:
                        return jsonify({"error": f"File {file.filename} exceeds 5MB limit", "success": False, "status": 400})
                    upload_result = cloudinary.uploader.upload(file)
                    uploaded_images.append(upload_result['secure_url'])
        post.images = uploaded_images

        # Handle file updates
        uploaded_files = post.files if post.files else []
        if 'files' in request.files:
            files = request.files.getlist('files')
            if len(files) > 5:
                return jsonify({"error": "Maximum 5 files allowed per post", "success": False, "status": 400})
            for file in files:
                if file and file.filename:
                    file.seek(0)
                    file_size = len(file.read())
                    file.seek(0)
                    if file_size > 5 * 1024 * 1024:
                        return jsonify({"error": f"File {file.filename} exceeds 5MB limit", "success": False, "status": 400})
                    upload_result = cloudinary.uploader.upload(file, resource_type="raw")
                    uploaded_files.append({"filename": file.filename, "file_url": upload_result['secure_url']})
        post.files = uploaded_files

        # Update the timestamp
        post.updated_at = datetime.now()

        # Save the updated post
        post.save()

        return jsonify({"message": "Post Updated Successfully", "success": True, "status": 200})

    except Exception as e:
        return jsonify({"error": str(e), "success": False, "status": 500})


"""
POST: /api/posts/react
{
    "post_id":""
    "user_id":""
    "reaction_type":""
}

Increases like/dislike count for a particular post
Returns success message
"""

@post_bp.route('/react', methods=['POST'])
def react():
    data = request.json
    user_id = data.get("user_id")
    post_id = data.get("post_id")
    reaction_type = data.get("reaction_type") 

    if reaction_type not in ["like", "dislike"]:
        return jsonify({"error": "Invalid Reaction", "success":False, "status":400})

    try:
        user = User.objects.get(id=user_id)
        post = Post.objects.get(id=post_id)

        if reaction_type == "like":
            if user_id in post.likedBy:
                post.likedBy.remove(user_id)
                post.likes -= 1
                message = "Like removed"
            else:
                if user_id in post.unlikedBy:
                    post.unlikedBy.remove(user_id)

                post.likedBy.append(user_id)
                post.likes += 1
                message = "Liked"

        elif reaction_type == "dislike":
            if user_id in post.unlikedBy:
                post.unlikedBy.remove(user_id)
                message = "Dislike removed"
            else:
                if user_id in post.likedBy:
                    post.likedBy.remove(user_id)
                    post.likes -= 1

                post.unlikedBy.append(user_id)
                message = "Disliked"

        post.save()
        return jsonify({"message": message, "success": True, "likes": post.likes, "status": 200})

    except Exception as e:
        return jsonify({"error": str(e), "success": False, "status": 500})

    
"""
POST: /api/posts/deletePost
{
    "post_Id":""
    "token":""
}

Deletes the post from database
Returns success message
"""
@post_bp.route('/deletePost', methods=["POST"])
def delete_post():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid JSON", "success":False, "status":400})

        token = data["token"]
        if not token:
            return jsonify({"error": "Login Again", "success": False, "status": 401})

        user_id = decode_token(token).get('sub')
        user = User.objects(id=user_id).first()
        if not user:
            return jsonify({"error": "User not found", "success": False, "status": 404})

        post_id = data["post_Id"]
        post = Post.objects(id=post_id).first()
        if not post:
            return jsonify({"error": "Post not found", "success": False, "status": 404})
        
        if str(post.author.id) != str(user_id):
            return jsonify({"error": "Unauthorized: You can only delete your own posts", "success": False, "status": 403})

        user.posts.remove(post_id)
        user.save()
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
        print(documents)

        for doc in documents:
            print(doc)
            doc["_id"] = str(doc["_id"])
            if "author" in doc:
                doc["author"] = str(doc["author"])

            if "comments" in doc:
                for comment in doc["comments"]:
                    if "user" in comment:
                        comment["user"] = str(comment["user"])
                
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
        if not user_id:
            return jsonify({"error": "User not found", "success": False, "status": 404})

        data = request.json
        if not data or "post_id" not in data or "comment" not in data:
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

        try:
            user_id = ObjectId(user_id)
        except Exception:
            return jsonify({"error": "Invalid user_id format", "success": False, "status": 400})
        
        user = User.objects(id=user_id).first()
        if not user:
            return jsonify({"error": "User not found", "success": False, "status": 404})

        new_comment = Comment(user=user, text=comment_text)

        if post.comments is None:
            post.comments = []

        post.comments.append(new_comment)
        post.save()

        return jsonify({"message": "Comment added successfully", "success": True, "status": 200})

    except Exception as e:
        return jsonify({"error": str(e), "success": False, "status": 500})


"""
POST: /api/posts/getComments
{
    "post_id": ""  # ID of the post to fetch comments for
}

Fetches all comments for a post
Returns success message and list of comments
"""
@post_bp.route('/getComments', methods=["POST"])
def get_comments():
    try:
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

        comments = []
        
        for comment in post.comments:
            comments.append(
                {
                    "user_id": str(comment.user.id),
                    "user_name": comment.user.user_name if comment.user else "Unknown User",
                    "profile_picture": comment.user.profile_picture if comment.user else "https://upload.wikimedia.org/wikipedia/commons/2/21/Solid_black.svg",
                    "text": comment.text,
                    "created_at": comment.created_at
                }
            )

        return jsonify({"comments": comments, "success": True, "status": 200})

    except Exception as e:
        return jsonify({"error": str(e), "success": False, "status": 500})

"""
POST: /api/posts/favoritePost
{
    "userId": ""
    "postId": ""
}

Adds this post id to users favorite
Returns success, message, and data
"""
@post_bp.route('/favoritePost', methods=["POST"])
def add_to_favorite():
    if request.headers.get('Content-Type') != 'application/json':
        return jsonify({"error": "Content-Type must be application/json", "success": False, "status": 400})

    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON", "success": False, "status": 400})

    user_id = data.get("userId")
    if not user_id:
        return jsonify({"error": "User ID is required", "success": False, "status": 400})

    post_id = data.get("postId")
    if not post_id:
        return jsonify({"error": "Post ID is required", "success": False, "status": 400})

    try:
        user_objId = ObjectId(user_id)
        post_objId = ObjectId(post_id)
    except Exception:
        return jsonify({"error": "Invalid ID format", "success": False, "status": 400})

    user = User.objects(id=user_objId).first()
    if user is None:
        return jsonify({"error": "User not found", "success": False, "status": 404})

    post = Post.objects(id=post_objId).first()
    if post is None:
        return jsonify({"error": "Post not found", "success": False, "status": 404})

    if user.favorites is None:
        user.favorites = []

    if post_id in user.favorites:
        user.favorites.remove(post_id)
        message = "Post removed from favorites"
    else:
        user.favorites.append(post_id)
        message = "Post added to favorites"
    
    user.save()

    return jsonify({"message": message, "success": True, "status": 200})