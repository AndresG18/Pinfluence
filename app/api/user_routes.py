from flask import Blueprint, jsonify
from flask_login import login_required,current_user
from app.models import db, User, UserFollow

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/<int:user_id>/follow', methods=['POST'])
@login_required
def toggle_follow_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return {"message": "User not found"}, 404
    follow = UserFollow.query.filter_by(follower_id=current_user.id, followed_id=user_id).first()
    if follow:
        db.session.delete(follow)
        message = "User unfollowed"
    else:
        new_follow = UserFollow(follower_id=current_user.id, followed_id=user_id)
        db.session.add(new_follow)
        message = "User followed"
    db.session.commit()
    return {"message": message}, 200
# Toggle follow/unfollow a user

@user_routes.route('/<int:user_id>/followers')
def get_user_followers(user_id):
    user = User.query.get(user_id)
    if not user:
        return {"message": "User not found"}, 404
    followers = UserFollow.query.filter_by(followed_id=user_id).all()
    return {"Followers": [follower.follower_id for follower in followers]}
# Get followers of a user

@user_routes.route('/<int:user_id>/following')
def get_user_following(user_id):
    user = User.query.get(user_id)
    if not user:
        return {"message": "User not found"}, 404
    following = UserFollow.query.filter_by(follower_id=user_id).all()
    return {"Following": [follow.followed_id for follow in following]}
# Get users following