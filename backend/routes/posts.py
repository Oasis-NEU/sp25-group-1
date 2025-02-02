from flask import Blueprint

post_bp = Blueprint('posts', __name__, url_prefix="/api/posts")
