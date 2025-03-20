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

# https://docs.google.com/document/d/1QpBL0hMsuVgaeLUXRE9LmVfPSM9XT-BebozhfoxMap4/edit?tab=t.0  UPDATE AND USE THIS FOR ENDPOINT COMPLETION

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
    if request.headers['Content-Type'] != 'application/json':
        return jsonify({"error": "Content-Type must be application/json", "success":False, "status":400})
    
    # Sets data from request
    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON", "success":False, "status":400})
    
    try:
        # extracts the user's input
        try:
            user_input = data.get("userInput")
        except:
            return jsonify({"error": "Invalid input", "success":False, "status":404})

        # initializing the spell checker
        spell = SpellChecker()
        spell.distance = 2 # the default value: for longer words, set to 1

        # creating a list of all the words and then correcting them
        try: list_words = user_input.split(" ")
        except: list_words = user_input
        misspelled_phrase = spell.unknown(list_words)
        spelled = spell.known(list_words)
        lst_msp_phr = list(misspelled_phrase) # stands for *list* of *missp*elled *phr*ase
        corrected = []
        for word in misspelled_phrase:
            corrected.append(spell.correction(word))

        # making a new list of all the corrected words to join them back into a single string
        for word in list_words:
            word_c = word.lower()
            if not(word_c in spell): # all the misspelled words
                cor_word = corrected[lst_msp_phr.index(word_c)]
                list_words[list_words.index(word)] = cor_word
        corrected_input = " ".join(list_words)

        # setting up the search by both terms
        collection = db.posts
        checks_posts = ["title", "content"] # can add more if desired
        checks_user = ["user_name"] # can add more if desired
        checks = {"for_posts":checks_posts, "for_user":checks_user}
        all_searches = {}

        # setting what the desired things from the searches are
        rets_for_posts = ["profile_picture", "user_name", "_id"] # can add more if desired
        rets_for_users = ["_id", "title"] # can add more if desired
        all_rets = {"for_posts":rets_for_posts, "for_user":rets_for_users}

        # doing the search...
        ## returns the format {'for_posts': {'title': {'DIRECT': [each specific], 'CORRECT': [each specific]},
        ##                                   'content': {'DIRECT': [each specific], 'CORRECT': [each specific]}, ...},
        ##                     'for_user': {'user_name': {'DIRECT': [each specific], 'CORRECT': [each specific]}, ...}}
    
        # [each specific]:
        ##           users: profile picture, username, user_Id
        ##           posts: post_Id, title
        for each_check in checks:
            all_searches[each_check] = {}
            for indiv_check in checks[each_check]:
                all_searches[each_check][indiv_check] = {}
                documents_direct = list(collection.find({indiv_check:user_input})) # term A: what the user put in directly
                documents_correct = list(collection.find({indiv_check:corrected_input})) # term B: what the spellchecker corrected

                # getting specifics for the direct
                all_searches[each_check][indiv_check]["DIRECT"] = [] # documents_direct
                for doc_dir in documents_direct:
                    for ret_ in all_rets[each_check]:
                        all_searches[each_check][indiv_check]["DIRECT"].append(doc_dir[ret_])

                # getting specifics for the correct
                all_searches[each_check][indiv_check]["CORRECT"] = [] # documents_correct                        
                for doc_cor in documents_correct:
                    for ret_ in all_rets[each_check]:
                        all_searches[each_check][indiv_check]["CORRECT"].append(doc_dir[ret_])

        return jsonify({"documents":all_searches, "success":True, "status":200})
    except Exception as e:
        return jsonify({"error": str(e), "status":200})