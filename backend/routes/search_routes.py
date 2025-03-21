# Imports
from flask import request, jsonify
from config import db, JWT_SECRET_KEY
from models import *
from flask_jwt_extended import jwt_required, get_jwt_identity, decode_token
from flask import Blueprint
import cloudinary
import cloudinary.uploader
from bson.objectid import ObjectId, InvalidId
from spellchecker import SpellChecker

# Set up post blueprint at "/api/posts"
search_bp = Blueprint('search', __name__, url_prefix="/api/search")

"""
/api/search/search          in progress
"""

"""
GET: /api/search/search
Fetches all users and posts from the database containing/identical to the searched term
"""
@search_bp.route('/search', methods=["POST"])
def search():
    # Check to see if content-type is json
    if request.headers.get('Content-Type') != 'application/json':
        return jsonify({"error": "Content-Type must be application/json", "success":False, "status":400})
    
    # Sets data from request
    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON", "success":False, "status":400})
    
    try:
        # extracts the user's input
        try:
            user_input = data.get("user_input")
        except:
            return jsonify({"error": "Invalid input", "success":False, "status":404})

        # initializing the spell checker
        spell = SpellChecker()
        spell.distance = 2 # the default value: for longer words, set to 1

        # creating a list of all the words and then correcting them
        try:
            list_words = user_input.split(" ")
        except:
            list_words = [user_input]

        misspelled_phrase = spell.unknown(list_words)
        spelled = spell.known(list_words)
        lst_msp_phr = list(misspelled_phrase)
        corrected = []

        for word in misspelled_phrase:
            corrected.append(spell.correction(word))

        # making a new list of all the corrected words to join them back into a single string
        for idx, word in enumerate(list_words):
            word_c = word.lower()
            if word_c in lst_msp_phr: # all the misspelled words
                cor_word = corrected[lst_msp_phr.index(word_c)]
                list_words[idx] = cor_word
        corrected_input = " ".join(list_words)

        # setting up the search by both terms
        posts_collection = db.posts
        users_collection = db.users

        # setting what the desired things from the searches are
        checks = {
            "for_posts": {
                "collection": posts_collection,
                "fields": ["title", "content", "project_type", "skills_used"],
                "returns": ["_id", "title", "images", "content"],
                "type": "post"
            },
            "for_user": {
                "collection": users_collection,
                "fields": ["user_name", "first_name", "last_name", "location", "skills"],
                "returns": ["_id", "user_name", "profile_picture", "role"],
                "type": "user"
            }
        }

        all_results = []
        seen_ids = set()

        # doing the search...
        ## returns the format {'for_posts': {'title': {'DIRECT': [each specific], 'CORRECT': [each specific]},
        ##                                   'content': {'DIRECT': [each specific], 'CORRECT': [each specific]}, ...},
        ##                     'for_user': {'user_name': {'DIRECT': [each specific], 'CORRECT': [each specific]}, ...}}
    
        # [each specific]:
        ##           users: profile picture, username, user_Id
        ##           posts: post_Id, title

        for search_group in checks.values():
            collection = search_group["collection"]
            return_fields = search_group["returns"]
            result_type = search_group["type"]


            for field in search_group["fields"]:
                # Direct matches
                direct_docs = list(collection.find({field: {"$regex": user_input, "$options": "i"}}))
                direct_ids = {doc["_id"] for doc in direct_docs}

                # Corrected matches
                corrected_docs = list(collection.find({field: {"$regex": corrected_input, "$options": "i"}}))
                corrected_docs = [doc for doc in corrected_docs if doc["_id"] not in direct_ids]

                combined_docs = direct_docs + corrected_docs
                for doc in combined_docs:
                    if doc["_id"] not in seen_ids:
                        seen_ids.add(doc["_id"])
                        result = {ret: str(doc.get(ret)) if ret == "_id" else doc.get(ret) for ret in return_fields}
                        result["type"] = result_type
                        all_results.append(result)

        return jsonify({"documents": all_results, "success": True, "status": 200})
    except Exception as e:
        return jsonify({"error": str(e), "status": 200})