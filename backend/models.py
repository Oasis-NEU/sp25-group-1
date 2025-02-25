# Imports
import mongoengine as me
from config import db
import datetime

# User model
class User(me.Document):
    email = me.EmailField(unique=True, required=True)
    password = me.StringField(required=True)
    user_name = me.StringField(unique=True, required=True, null=False)
    first_name = me.StringField(required=True)
    last_name = me.StringField(required=True)
    settings = me.DictField(default={})
    profile_picture = me.StringField()

    favorites = me.ListField(me.StringField())
    posts = me.ListField(me.StringField())

    role = me.StringField(required=True, choices=["programmer", "designer"])
    created_at = me.DateTimeField()
    updated_at = me.DateTimeField()

    def to_json(self):
        return {
            "id": str(self.id),
            "email": self.email,
            "user_name": self.user_name,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "role": self.role,
            "settings": self.settings,
            "profile_picture": self.profile_picture,
            "favorites": self.favorites,
            "posts": self.posts,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

    meta = {
        "collection": "users"
    }

# Post Model
class Post(me.Document):
    title = me.StringField(required=True)
    content = me.StringField(required=True)
    author = me.ReferenceField(User, required=True, reverse_delete_rule=me.CASCADE)
    images = me.ListField(me.StringField())
    files = me.ListField(me.DictField())
    looking_for = me.StringField(required=True, choices=["programmer", "designer"])
    comments = comments = me.DictField()
    likes = me.IntField()
    created_at = me.DateTimeField()
    updated_at = me.DateTimeField()
    post_type = me.StringField(required=True)

    def to_json(self):
        return {
            "id": str(self.id),
            "title": self.title,
            "content": self.content,
            "author": str(self.author),
            "images": self.images,
            "files":self.files,
            "looking_for": self.looking_for,
            "comments": self.comments,
            "likes": self.likes,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "post_type":self.post_type
        }

    meta = {
        "collection": "posts"
    }