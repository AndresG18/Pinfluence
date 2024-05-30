from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    profile_image = db.Column(db.String, nullable=True)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    about = db.Column(db.String, nullable=True)
    email = db.Column(db.String(50), nullable=False, unique=True)
    username = db.Column(db.String(30), nullable=False, unique=True)
    private = db.Column(db.Boolean, default=False)
    hashed_password = db.Column(db.String(255), nullable=False)

    boards = db.relationship('Board', back_populates='user', cascade="all, delete-orphan")
    pins = db.relationship('Pin', back_populates='user', cascade="all, delete-orphan")
    pin_likes = db.relationship('PinLike', back_populates='user', cascade="all, delete-orphan")
    pin_comments = db.relationship('PinComment', back_populates='user', cascade="all, delete-orphan")
    messages_sent = db.relationship('Message', foreign_keys='Message.sender_id', back_populates='sender', cascade="all, delete-orphan")
    messages_received = db.relationship('Message', foreign_keys='Message.recipient_id', back_populates='recipient', cascade="all, delete-orphan")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        print(password,self.password)
        if len(self.password) < 20:
            return self.password == password
        else:
            return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'profile_image': self.profile_image,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'about': self.about,
            'email': self.email,
            'username': self.username,
            'private': self.private
        }
