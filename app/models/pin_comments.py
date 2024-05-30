from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class PinComment(db.Model):
    __tablename__ = 'pin_comments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    pin_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('pins.id')), nullable=False)

    user = db.relationship('User', back_populates='pin_comments')
    pin = db.relationship('Pin', back_populates='comments')

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'timestamp': self.timestamp,
            'user_id': self.user_id,
            'pin_id': self.pin_id
        }
