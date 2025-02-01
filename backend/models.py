import mongoengine as me
from config import db
import datetime

class Post(me.Document):
    title = me.StringField(required=True)
    content = me.StringField(required=True)
    author = me.ReferenceField("User", reverse_delete_rule=me.CASCADE)
    images = me.ListField(me.StringField())
    looking_for = me.StringField(required=True, choices=["programmer", "designer"])
    created_at = me.DateTimeField()
    updated_at = me.DateTimeField()

    def to_json(self):
        return {
            "id": str(self.id),
            "title": self.title,
            "content": self.content,
            "author": str(self.author.id),
            "images": self.images,
            "looking_for": self.looking_for,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

    meta = {
        "collection": "posts"
    }


class User(me.Document):
    email = me.EmailField(unique=True, required=True)
    password = me.StringField(required=True)
    first_name = me.StringField(required=True)
    last_name = me.StringField(required=True)
    settings = me.DictField(default={})
    favorites = me.ListField(me.ReferenceField("Post", reverse_delete_rule=me.PULL))
    posts = me.ListField(me.ReferenceField("Post", reverse_delete_rule=me.CASCADE))
    role = me.StringField(required=True, choices=["programmer", "designer"])
    created_at = me.DateTimeField()
    updated_at = me.DateTimeField()

    def to_json(self):
        return {
            "id": str(self.id),
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "role": self.role,
            "settings": self.settings,
            "favorites": [str(post.id) for post in self.favorites],
            "posts": [str(post.id) for post in self.posts],
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

    meta = {
        "collection": "users"
    }