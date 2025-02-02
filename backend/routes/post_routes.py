"""
    /api/posts/createPostDesigner
    /api/posts/createPostCoder
    /api/posts/trending
    /api/posts/likePost
    /api/posts/deletePost
    /api/posts/updatePost
    /api/posts/getComments
    /api/posts/makeComment
    /api/posts/getPostsByUser
    /api/posts/reportPost
"""
from flask import request, jsonify
from config import db
from .posts import post_bp
from models import *

@post_bp.route('/getAllPosts', methods=["GET"])
def get_all_posts():
    try:
        collection = db.posts
        documents = list(collection.find({}, {"_id": 0}))
        return jsonify(documents)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@post_bp.route('/createPostDesigner', methods=["POST", "GET"])
def create_post_designer():
    if request.headers['Content-Type'] == 'application/json':
        data = request.json
        print(data)
    try:
        post = Post(
            title = data.get('title'),
            content = data.get('content'),
            author = data.get('author'), # To change when login system is implemented
            images = data.get('images'),
            looking_for = data.get('looking_for')
            )
        post.save()
        return jsonify.message({"Message":"success"})
    except Exception as e:
        return f"ERROR: {e}"
"""
Test Case 1:
{
    "title": "Test Post A",
    "content": "This is a post made to test the createPostDesigner function",
    "author": "TestAdmin1",
    "images": ["image1", "image2"],
    "looking_for": "programmer",
    "created_at": "2025-02-02T12: 00: 00.000+00: 00",
    "updated_at": "2025-02-02T12: 00: 00.000+00: 00"
}
"""