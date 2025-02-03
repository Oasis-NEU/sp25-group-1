from flask import Flask
from flask_cors import CORS
from config import db
from routes.posts import post_bp
from routes.user import user_bp
from flask_bcrypt import Bcrypt

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# Blueprints
import routes.post_routes
app.register_blueprint(post_bp)

import routes.user_routes
app.register_blueprint(user_bp)

# End Blueprints

# MESSAGES
# Reinstall pip packages (activate venv, then run pip install -r requirements.txt)

# Home page
@app.route("/", methods=["GET"])
def home():
    return {"message": "Backend is working"}, 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=9999)
