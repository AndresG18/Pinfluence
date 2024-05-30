from .db import db, environment, SCHEMA, add_prefix_for_prod

pin_board = db.Table('board_pins',
    db.Column('board_id', db.Integer, db.ForeignKey(add_prefix_for_prod('boards.id'), name='fk_board_pin_board_id'), primary_key=True),
    db.Column('pin_id', db.Integer, db.ForeignKey(add_prefix_for_prod('pins.id'), name='fk_board_pin_pin_id'), primary_key=True)
)
