from app.models import db, pin_board, environment, SCHEMA
from sqlalchemy.sql import text

def seed_board_pins():
    all_board_pins = [
        # User 1
        {"board_id": 1, "pin_id": 1},
        {"board_id": 1, "pin_id": 2},
        {"board_id": 2, "pin_id": 3},
        {"board_id": 2, "pin_id": 4},
        {"board_id": 3, "pin_id": 5},
        {"board_id": 3, "pin_id": 6},
        {"board_id": 4, "pin_id": 7},
        {"board_id": 4, "pin_id": 8},
        {"board_id": 5, "pin_id": 9},
        {"board_id": 5, "pin_id": 10},
        {"board_id": 6, "pin_id": 11},
        {"board_id": 6, "pin_id": 12},
        {"board_id": 7, "pin_id": 13},
        {"board_id": 7, "pin_id": 14},

        # User 2
        {"board_id": 8, "pin_id": 15},
        {"board_id": 8, "pin_id": 16},
        {"board_id": 9, "pin_id": 17},
        {"board_id": 9, "pin_id": 18},
        {"board_id": 10, "pin_id": 19},
        {"board_id": 10, "pin_id": 20},
        {"board_id": 11, "pin_id": 21},
        {"board_id": 11, "pin_id": 22},
        {"board_id": 12, "pin_id": 23},
        {"board_id": 12, "pin_id": 24},
        {"board_id": 13, "pin_id": 25},
        {"board_id": 13, "pin_id": 26},
        {"board_id": 14, "pin_id": 27},
        {"board_id": 14, "pin_id": 28},

        # User 3
        {"board_id": 15, "pin_id": 29},
        {"board_id": 15, "pin_id": 30},
        {"board_id": 16, "pin_id": 31},
        {"board_id": 16, "pin_id": 32},
        {"board_id": 17, "pin_id": 33},
        {"board_id": 17, "pin_id": 34},
        {"board_id": 18, "pin_id": 35},
        {"board_id": 18, "pin_id": 36},
        {"board_id": 19, "pin_id": 37},
        {"board_id": 19, "pin_id": 38},
        {"board_id": 20, "pin_id": 39},
        {"board_id": 20, "pin_id": 40},
        {"board_id": 21, "pin_id": 41},
        {"board_id": 21, "pin_id": 42},

        # User 4
        {"board_id": 22, "pin_id": 43},
        {"board_id": 22, "pin_id": 44},
        {"board_id": 23, "pin_id": 45},
        {"board_id": 23, "pin_id": 46},
        {"board_id": 24, "pin_id": 47},
        {"board_id": 24, "pin_id": 48},
        {"board_id": 25, "pin_id": 49},
        {"board_id": 25, "pin_id": 50},
        {"board_id": 26, "pin_id": 51},
        {"board_id": 26, "pin_id": 52},
        {"board_id": 27, "pin_id": 53},
        {"board_id": 27, "pin_id": 54},
        {"board_id": 28, "pin_id": 55},
        {"board_id": 28, "pin_id": 56},
        {"board_id": 29, "pin_id": 57},
        {"board_id": 29, "pin_id": 58}
    ]

    for board_pin in all_board_pins:
        stmt = pin_board.insert().values(board_id=board_pin['board_id'], pin_id=board_pin['pin_id'])
        db.session.execute(stmt)
    
    db.session.commit()

def undo_board_pins():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.board_pins RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM board_pins"))

    db.session.commit()
