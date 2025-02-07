# Imports
import mongoengine as me
from config import db
import datetime

# Post Model
class Post(me.Document):
    title = me.StringField(required=True)
    content = me.StringField(required=True)
    author = me.StringField(required=True) # To change, force author to be a User
    images = me.ListField(me.StringField())
    looking_for = me.StringField(required=True, choices=["programmer", "designer"])
    comments = me.ListField(me.StringField())
    likes = me.IntField()
    created_at = me.DateTimeField()
    updated_at = me.DateTimeField()

    def to_json(self):
        return {
            "id": str(self.id),
            "title": self.title,
            "content": self.content,
            "author": self.author, # str(self.author.id),
            "images": self.images,
            "looking_for": self.looking_for,
            "comments": self.comments,
            "likes": self.likes,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

    meta = {
        "collection": "posts"
    }

# User model
class User(me.Document):
    email = me.EmailField(unique=True, required=True)
    password = me.StringField(required=True)
    user_name = me.StringField(reqired=True)
    first_name = me.StringField(required=True)
    last_name = me.StringField(required=True)
    settings = me.DictField(default={})
    profile_picture = me.StringField()
    # Delete from favorites list when a post is deleted
    favorites = me.ListField(me.ReferenceField("Post", reverse_delete_rule=me.PULL))
    # If a user is deleted, all their posts are also deleted
    posts = me.ListField(me.ReferenceField("Post", reverse_delete_rule=me.CASCADE))
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
            "favorites": [str(post.id) for post in self.favorites],
            "posts": [str(post.id) for post in self.posts],
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

    meta = {
        "collection": "users"
    }