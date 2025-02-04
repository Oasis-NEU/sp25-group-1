# Imports
from flask import Flask
from flask_cors import CORS
from config import db, JWT_SECRET_KEY
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

#Set up Flask, CORS and Bcrypt
app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

#Set JWT configuration
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
jwt= JWTManager(app)

# Blueprints
from routes.post_routes import post_bp
from routes.user_routes import user_bp

app.register_blueprint(post_bp)
app.register_blueprint(user_bp)

# End Blueprints

# MESSAGES
# Reinstall pip packages (activate venv, then run pip install -r requirements.txt)
# PLEASE GIT PULL, TONS CHANGED

# Home page
@app.route("/", methods=["GET"])
def home():
    return {"message": "Backend is working"}, 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=9999)
