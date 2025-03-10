# Imports
from flask import request, jsonify
from config import db, JWT_SECRET_KEY
from models import *
from flask_jwt_extended import jwt_required, get_jwt_identity, decode_token
from flask import Blueprint
import cloudinary
import cloudinary.uploader
from bson.objectid import ObjectId, InvalidId
from datetime import datetime

# Set up chat blueprint at "/api/chat"
chat_bp = Blueprint('chat', __name__, url_prefix="/api/chat")

"""
POST: /api/chat/createChat
{
    "user1_id": ""
    "user2_id": ""
}
Creates a new chat between 2 users
"""
@chat_bp.route('/createChat', methods=["POST"])
def create_chat():
    data = request.json
    user1_id = data.get("user1_id")
    user2_id = data.get("user2_id")

    if not user1_id or not user2_id:
        return jsonify({"error": "Both user IDs are required", "status": 400}),

    user1 = User.objects(id=ObjectId(user1_id)).first()
    user2 = User.objects(id=ObjectId(user2_id)).first()

    if not user1 or not user2:
        return jsonify({"error": "Invalid user IDs", "status": 404})

    chat = Chat.objects.filter(participants__all=[user1, user2]).first()
    if chat:
        return jsonify({"message": "Chat already exists", "chat_id": str(chat.id)})

    # Create a new chat
    chat = Chat(participants=[user1, user2])
    chat.save()
    return jsonify({"message": "Chat created", "chat_id": str(chat.id), "status": 200})

"""
POST: /api/chat/newMessage
{
    "chat_id": ""
    "creator_id": ""
}
Creates a new message in a chat
"""
@chat_bp.route('/newMessage', methods=["POST"])
def send_message():
    data = request.json
    chat_id = data.get("chat_id")
    creator_id = data.get("creator_id")
    text = data.get("text")

    if not chat_id or not creator_id or not text:
        return jsonify({"error": "Chat ID, creator ID, and text are required", "status": 400})

    try:
        chat = Chat.objects(id=ObjectId(chat_id)).first()
        creator = User.objects(id=ObjectId(creator_id)).first()
    except Exception:
        return jsonify({"error": "Invalid chat or user ID format", "status": 400})

    if not chat or not creator:
        return jsonify({"error": "Chat or User not found", "status": 404})

    if creator not in chat.participants:
        return jsonify({"error": "User is not a participant in this chat", "status": 403})

    recipient = None
    for user in chat.participants:
        if user != creator:
            recipient = user
            break

    if recipient is None:
        return jsonify({"error": "Could not determine recipient", "status": 500})

    chat.add_message(creator=creator, recipient=recipient, text=text)
    chat.save()

    return jsonify({"message": "Message sent successfully", "status": 201})

"""
POST: /api/chat/getMessages
{
    "chat_id": ""
}
Fetches all messages in a chat
"""
@chat_bp.route('/getMessages', methods=["POST"])
def get_messages():
    data = request.json
    chat_id = data.get("chat_id")
    try:
        chat = Chat.objects(id=ObjectId(chat_id)).first()
    except Exception:
        return jsonify({"error": "Invalid chat ID format", "status": 400})

    if not chat:
        return jsonify({"error": "Chat not found", "status": 404})

    return jsonify({"chat_id": str(chat.id), "messages": chat.to_json()["messages"], "status": 200})


"""
POST: /api/chat/listChats
{
    "user_Id": ""
}
Fetches all chats for a user
"""
@chat_bp.route('/listChats', methods=["POST"])
def list_user_chats():
    data = request.json
    user_id = data.get("user_Id")

    if not user_id:
        return jsonify({"error": "User ID is required", "status": 400})

    try:
        user = User.objects(id=ObjectId(user_id)).first()
    except Exception:
        return jsonify({"error": "Invalid user ID format", "status": 400})

    if not user:
        return jsonify({"error": "User not found", "status": 404})

    chats = Chat.objects(participants=user).order_by("-last_updated")

    chat_list = []
    for chat in chats:

        other_user = None
        for participant in chat.participants:
            if str(participant.id) != user_id:
                other_user = participant
                break

        other_user_info = {}

        if other_user:
            other_user = User.objects(id=other_user.id).only("user_name", "profile_picture").first()
            if other_user:
                other_user_info = {
                    "user_id": str(other_user.id),
                    "user_name": other_user.user_name,
                    "profile_picture": other_user.profile_picture
                }

        chat_list.append({
            "chat_id": str(chat.id),
            "participants": [str(user.id) for user in chat.participants],
            "last_updated": chat.last_updated.isoformat() if chat.last_updated else datetime.utcnow().isoformat(),
            "recipient_information": other_user_info
        })

    print(f"Chat list before sending response: {chat_list}")
    return jsonify({"chats": chat_list, "status": 200})