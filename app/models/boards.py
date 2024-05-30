from .db import db, environment, SCHEMA, add_prefix_for_prod
from .pin_board import pin_board

class Board(db.Model):
    __tablename__ = 'boards'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), name='fk_board_user_id'), nullable=False)

    user = db.relationship('User', back_populates='boards')
    pins = db.relationship('Pin', secondary=pin_board, back_populates='boards')
    followers = db.relationship('BoardFollow', back_populates='board', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'user_id': self.user_id
        }
