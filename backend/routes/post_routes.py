"""
    /api/posts/getAllPosts
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

@post_bp.route('/getAllPosts', methods=["GET"])
def get_all_posts():
    print("Fetching posts...")
    try:
        collection = db.posts
        documents = list(collection.find({}, {"_id": 0}))
        return jsonify(documents)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
