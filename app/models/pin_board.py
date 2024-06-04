from .db import db, environment, SCHEMA, add_prefix_for_prod

pin_board = db.Table(
    'board_pins',
    db.Column('board_id', db.Integer, db.ForeignKey(add_prefix_for_prod('boards.id')), primary_key=True),
    db.Column('pin_id', db.Integer, db.ForeignKey(add_prefix_for_prod('pins.id')), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True) 
)

if environment == "production":
    pin_board.schema = SCHEMA