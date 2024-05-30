from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class BoardFollow(db.Model):
    __tablename__ = 'board_follows'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True)
    board_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('boards.id')), primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.now)

    user = db.relationship('User', foreign_keys=[user_id])
    board = db.relationship('Board', foreign_keys=[board_id])