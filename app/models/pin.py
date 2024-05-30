from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .pin_board import pin_board

class Pin(db.Model):
    __tablename__ = 'pins'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    content_url = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    link = db.Column(db.String)
    timestamp = db.Column(db.DateTime, default=datetime.now)

    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), name='fk_pin_user_id'), nullable=False)

    user = db.relationship('User', back_populates='pins')
    boards = db.relationship('Board', secondary=pin_board, back_populates='pins')
    likes = db.relationship('PinLike', back_populates='pin', cascade="all, delete-orphan")
    comments = db.relationship('PinComment', back_populates='pin', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content_url': self.content_url,
            'description': self.description,
            'link': self.link,
            'user_id': self.user_id,
            'timestamp': self.timestamp
        }
