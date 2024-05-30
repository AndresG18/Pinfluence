from app.models import db, Board, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker

fake = Faker()

def seed_boards():
    user_ids = [1, 2, 3, 4]  

    common_board_data = [
        {"name": "Travel", "description": "Explore the world and share your adventures."},
        {"name": "Food", "description": "Discover delicious recipes and cooking tips."},
        {"name": "Photography", "description": "Capture stunning moments and showcase your photography skills."},
        {"name": "Fashion", "description": "Stay trendy with fashion inspiration and style tips."},
        {"name": "Home Decor", "description": "Find and share your favorite decor tips."},
        {"name": "Workouts", "description": "Achieve your fitness goals with workout routines and tips."},
        {"name": "Coding", "description": "Improve your coding skills and discuss programming topics."}
    ]

    create_boards = []
    for user_id in user_ids:
        for board_data in common_board_data:
            board = Board(
                name=board_data["name"],
                description=board_data["description"],
                user_id=user_id
            )
            db.session.add(board)
            create_boards.append(board)

    db.session.commit()
    return create_boards

def undo_boards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.boards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM boards"))

    db.session.commit()
