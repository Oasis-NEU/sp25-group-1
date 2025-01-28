from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from pymongo import MongoClient
from dotenv import load_dotenv
load_dotenv()

# This is a commit to get the backend started
# incomplete app.py will finish it later
# - Aryan

# To do
# 1. Create a database connection
# 2. Flask Blueprints for different routes