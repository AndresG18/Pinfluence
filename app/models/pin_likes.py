from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class PinLike(db.Model):
    __tablename__ = 'pin_likes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True)
    pin_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('pins.id')), primary_key=True)

    user = db.relationship('User', back_populates='pin_likes')
    pin = db.relationship('Pin', back_populates='likes')
    
    def to_dict(self):
        return{
            'user_id':self.user_id,
            'pin_id':self.pin_id
        }
