from flask import Flask
from flask_cors import CORS
from config import db
from routes.posts import post_bp

app = Flask(__name__)
CORS(app)

# Blueprints
import routes.post_routes
app.register_blueprint(post_bp)

# End Blueprints


# Home page
@app.route("/", methods=["GET"])
def home():
    return {"message": "Backend is working"}, 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=9999)
