from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound
# from post_routes import ...

post_bp = Blueprint('posts', __name__, url_prefix="/api/posts")

""" In case we need this...
@post_bp.route('/posts', methods=["GET"])
def show(page):
    try:
        return render_template(f'pages/{page}.html')
    except TemplateNotFound:
        abort(404)
"""