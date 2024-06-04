from app.models import db, pin_board, environment, SCHEMA
from sqlalchemy.sql import text

def seed_board_pins():
    all_board_pins = [
        # User 1
        {"board_id": 1, "pin_id": 1, "user_id": 1},
        {"board_id": 1, "pin_id": 2, "user_id": 1},
        {"board_id": 2, "pin_id": 3, "user_id": 1},
        {"board_id": 2, "pin_id": 4, "user_id": 1},
        {"board_id": 3, "pin_id": 5, "user_id": 1},
        {"board_id": 3, "pin_id": 6, "user_id": 1},
        {"board_id": 4, "pin_id": 7, "user_id": 1},
        {"board_id": 4, "pin_id": 8, "user_id": 1},
        {"board_id": 5, "pin_id": 9, "user_id": 1},
        {"board_id": 5, "pin_id": 10, "user_id": 1},
        {"board_id": 6, "pin_id": 11, "user_id": 1},
        {"board_id": 6, "pin_id": 12, "user_id": 1},
        {"board_id": 7, "pin_id": 13, "user_id": 1},
        {"board_id": 7, "pin_id": 14, "user_id": 1},

        # User 2
        {"board_id": 8, "pin_id": 15, "user_id": 2},
        {"board_id": 8, "pin_id": 16, "user_id": 2},
        {"board_id": 9, "pin_id": 17, "user_id": 2},
        {"board_id": 9, "pin_id": 18, "user_id": 2},
        {"board_id": 10, "pin_id": 19, "user_id": 2},
        {"board_id": 10, "pin_id": 20, "user_id": 2},
        {"board_id": 11, "pin_id": 21, "user_id": 2},
        {"board_id": 11, "pin_id": 22, "user_id": 2},
        {"board_id": 12, "pin_id": 23, "user_id": 2},
        {"board_id": 12, "pin_id": 24, "user_id": 2},
        {"board_id": 13, "pin_id": 25, "user_id": 2},
        {"board_id": 13, "pin_id": 26, "user_id": 2},
        {"board_id": 14, "pin_id": 27, "user_id": 2},
        {"board_id": 14, "pin_id": 28, "user_id": 2},

        # User 3
        {"board_id": 15, "pin_id": 29, "user_id": 3},
        {"board_id": 15, "pin_id": 30, "user_id": 3},
        {"board_id": 16, "pin_id": 31, "user_id": 3},
        {"board_id": 16, "pin_id": 32, "user_id": 3},
        {"board_id": 17, "pin_id": 33, "user_id": 3},
        {"board_id": 17, "pin_id": 34, "user_id": 3},
        {"board_id": 18, "pin_id": 35, "user_id": 3},
        {"board_id": 18, "pin_id": 36, "user_id": 3},
        {"board_id": 19, "pin_id": 37, "user_id": 3},
        {"board_id": 19, "pin_id": 38, "user_id": 3},
        {"board_id": 20, "pin_id": 39, "user_id": 3},
        {"board_id": 20, "pin_id": 40, "user_id": 3},
        {"board_id": 21, "pin_id": 41, "user_id": 3},
        {"board_id": 21, "pin_id": 42, "user_id": 3},

        # User 4
        {"board_id": 22, "pin_id": 43, "user_id": 4},
        {"board_id": 22, "pin_id": 44, "user_id": 4},
        {"board_id": 23, "pin_id": 45, "user_id": 4},
        {"board_id": 23, "pin_id": 46, "user_id": 4},
        {"board_id": 24, "pin_id": 47, "user_id": 4},
        {"board_id": 24, "pin_id": 48, "user_id": 4},
        {"board_id": 25, "pin_id": 49, "user_id": 4},
        {"board_id": 25, "pin_id": 50, "user_id": 4},
        {"board_id": 26, "pin_id": 51, "user_id": 4},
        {"board_id": 26, "pin_id": 52, "user_id": 4},
        {"board_id": 27, "pin_id": 53, "user_id": 4},
        {"board_id": 27, "pin_id": 54, "user_id": 4},
        {"board_id": 28, "pin_id": 55, "user_id": 4},
        {"board_id": 28, "pin_id": 56, "user_id": 4}
    ]

    for board_pin in all_board_pins:
        statement = pin_board.insert().values(board_id=board_pin['board_id'], pin_id=board_pin['pin_id'], user_id=board_pin['user_id'])
        db.session.execute(statement)

    db.session.commit()

def undo_board_pins():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.board_pins RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM board_pins"))

    db.session.commit()
