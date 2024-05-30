from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from faker import Faker

fake = Faker()

def seed_users():
    all_users = [
        {
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "username": fake.user_name(),
            "email": fake.email(),
            "about": fake.sentence(),
            "hashed_password": "password123",  
            "profile_image": fake.image_url(),
            "private": fake.boolean()
        },
        {
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "username": fake.user_name(),
            "email": fake.email(),
            "about": fake.sentence(),
            "hashed_password": "password123",
            "profile_image": fake.image_url(),
            "private": fake.boolean()
        },
        {
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "username": fake.user_name(),
            "email": fake.email(),
            "about": fake.sentence(),
            "hashed_password": "password123",
            "profile_image": fake.image_url(),
            "private": fake.boolean()
        },
        {
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "username": fake.user_name(),
            "email": fake.email(),
            "about": fake.sentence(),
            "hashed_password": "password123",
            "profile_image": fake.image_url(),
            "private": fake.boolean()
        },
        {
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "username": fake.user_name(),
            "email": fake.email(),
            "about": fake.sentence(),
            "hashed_password": "password123",
            "profile_image": fake.image_url(),
            "private": fake.boolean()
        }
    ]

    create_users = [User(**user) for user in all_users]
    add_users = [db.session.add(user) for user in create_users]
    db.session.commit()
    return create_users


def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
