from flask import Flask
from flask_cors import CORS
from config import db

app = Flask(__name__)
CORS(app)

# Blueprints

# End Blueprints

@app.route("/", methods=["GET"])
def home():
    return {"message": "Backend is working"}, 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=9999)
