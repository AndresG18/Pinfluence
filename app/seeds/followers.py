from app.models import db, User, environment, SCHEMA, UserFollow
from sqlalchemy.sql import text

def seed_followers():
    all_followers = [
        {"follower_id": 1, "followed_id": 2},
        {"follower_id": 1, "followed_id": 3},
        {"follower_id": 2, "followed_id": 1},
        {"follower_id": 2, "followed_id": 3},
        {"follower_id": 3, "followed_id": 1},
        {"follower_id": 4, "followed_id": 1},
        {"follower_id": 5, "followed_id": 3},
        {"follower_id": 5, "followed_id": 4},
        {"follower_id": 3, "followed_id": 2},
    ]

    for follower_data in all_followers:
        follower = User.query.get(follower_data['follower_id'])
        followed = User.query.get(follower_data['followed_id'])
        if follower and followed:
            user_follow = UserFollow(follower_id=follower_data['follower_id'], followed_id=follower_data['followed_id'])
            db.session.add(user_follow)
    db.session.commit()

def undo_followers():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.followers RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM followers"))

    db.session.commit()
