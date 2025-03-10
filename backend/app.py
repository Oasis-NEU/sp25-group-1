# Imports
from flask import Flask
from flask_cors import CORS
from config import db, JWT_SECRET_KEY
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

#Set up Flask, CORS and Bcrypt
app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}},
     allow_headers=["Authorization", "Content-Type"])
bcrypt = Bcrypt(app)

#Set JWT configuration
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
jwt= JWTManager(app)

# Blueprints
from routes.post_routes import post_bp
from routes.user_routes import user_bp
from routes.chat_routes import chat_bp

app.register_blueprint(post_bp)
app.register_blueprint(user_bp)
app.register_blueprint(chat_bp)

# End Blueprints

# MESSAGES
# Reinstall pip packages (activate venv, then run pip install -r requirements.txt)
# PLEASE GIT PULL, TONS CHANGED

# Home page
@app.route("/", methods=["GET"])
def home():
    return {"message": "Backend is working"}, 200

@app.route('/api/all', methods=["GET"])
def get_all_routes():
    routes = []
    try:
        for route in app.url_map.iter_rules():
            routes.append({
                'Endpoint': route.endpoint,
                'Accepts': ', '.join(route.methods),
                'Route': str(route)
            })
        return (routes)
    except Exception as e:
        return ({"error": str(e), "status":500})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=9999)
