from app.models import db, User, Pin, PinComment,environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker
import random

fake = Faker()

def seed_pin_comments():
    users = User.query.all()
    pins = Pin.query.all()

    for pin in pins:
        for _ in range(random.randint(0, 3)):
            commenter = random.choice(users)
            comment = PinComment(
                content=fake.sentence(),
                user_id=commenter.id,
                pin_id=pin.id
            )
            db.session.add(comment)
    db.session.commit()

def undo_pin_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.pin_comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM pin_comments"))
    db.session.commit()
