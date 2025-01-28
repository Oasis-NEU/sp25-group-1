from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from pymongo import MongoClient
from dotenv import load_dotenv
load_dotenv()

# This is a commit to get the backend started
# incomplete app.py will finish it later
# - Aryan

# Also guys, please make sure to install the required packages
# You should just be able to git pull everything?
# Also DO NOT WORK on the main branch, create a new branch and work on that
# - Aryan

# To do
# 1. Create a database connection
# 2. Flask Blueprints for different routes