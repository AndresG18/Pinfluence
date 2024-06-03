from flask import Blueprint, request
from flask_login import login_required,current_user
from app.models import db, User, UserFollow
from app.forms import EditProfileForm
from .AWS import get_unique_filename,upload_file_to_s3,remove_file_from_s3
user_routes = Blueprint('users', __name__)


@user_routes.route('/')
# @login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}

@user_routes.route('/<int:id>')
# @login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    if not user:
        return {"message": "User not found"}, 404

    followers = UserFollow.query.filter_by(followed_id=id).all()
    following = UserFollow.query.filter_by(follower_id=id).all()

    return {
        **user.to_dict(),
        "followers": [follower.follower_id for follower in followers],
        "following": [follow.followed_id for follow in following]
    }

@user_routes.route('/<int:id>/edit>',methods=['PUT'])
@login_required
def edit_user(id):
    user = User.query.get(id)
    if not user : return {"error": "User not found"}
    form = EditProfileForm()
    form['csrf_token'] = request.cookies['csrf_token']
    if form.validate_on_submit():
        if form.data['profile_image'] :
            profile_image = form.data['profile_image']
            profile_image.filename = get_unique_filename(profile_image.filename)
            upload = upload_file_to_s3(profile_image)
            if 'url' not in upload: return {"errors": upload},500
            user.profile_image = upload['url']
        user.username = form.data['username']
        user.email = form.data['email']
        db.session.commit()
        return user.to_dict()       
    else: return {"errors":form.errors},400

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
    return {"message": message, "user": user.to_dict()}, 200
# Toggle follow/unfollow a user

# @user_routes.route('/<int:user_id>/followers')
# def get_user_followers(user_id):
#     user = User.query.get(user_id)
#     if not user:
#         return {"message": "User not found"}, 404
#     followers = UserFollow.query.filter_by(followed_id=user_id).all()
#     return {"Followers": [follower.follower_id for follower in followers]}
# Get followers of a user

# @user_routes.route('/<int:user_id>/following')
# def get_user_following(user_id):
#     user = User.query.get(user_id)
#     if not user:
#         return {"message": "User not found"}, 404
#     following = UserFollow.query.filter_by(follower_id=user_id).all()
#     return {"Following": [follow.followed_id for follow in following]}
# Get users following