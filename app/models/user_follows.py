from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class UserFollow(db.Model):
    __tablename__ = 'user_follows'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    follower_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True)
    followed_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.now)

    follower = db.relationship('User', foreign_keys=[follower_id], back_populates='following')
    followed = db.relationship('User', foreign_keys=[followed_id], back_populates='followers')
