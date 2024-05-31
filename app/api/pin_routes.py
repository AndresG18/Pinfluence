from flask import Blueprint, request
from app.models import db, User,Pin,PinComment,PinLike
from flask_login import login_user,login_required,current_user
from app.forms import PinForm, PinCommentForm
from .AWS import upload_file_to_s3, get_unique_filename,remove_file_from_s3

pin_routes = Blueprint('pins', __name__)

def authorize(user_id):
    if user_id != current_user.id: return {"message":"Forbidden"}, 403
    return None

@pin_routes.route('')
def pins():
    all_pins = Pin.query.all()
    return {"Pins":[pin.to_dict() for pin in all_pins]}
# Get all Pins

@pin_routes.route('/current')
def user_pins():
    all_pins = Pin.query.filter_by(user_id=current_user.id)
    return {"Pins":[pin.to_dict() for pin in all_pins]}
# Get all Pins

@pin_routes.route('/<int:pin_id>')
def pin(pin_id):
    pin = Pin.query.get(pin_id)
    if not pin : return {"message": "Pin not found"}, 404
    return {**pin.to_dict(),"comments":[comment.to_dict() for comment in pin.comments] }
# Get a pin by id

@pin_routes.route('/new', methods=['POST'])
@login_required
def create_pin():
    form = PinForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        pin_image = form.data['content_url']
        pin_image.filename = get_unique_filename(pin_image.filename)
        upload = upload_file_to_s3(pin_image)
        if 'url' not in upload : return {"errors":upload},500
        pin = Pin(
            user_id = current_user.id,
            title = form.data['title'],
            content_url = upload['url'],
            description = form.data['description'],
            link = form.data['link'],
        )
        db.session.add(pin)
        db.session.commit()
        return pin.to_dict()
    else: return { "errors": form.errors},400
# Create a pin

@pin_routes.route('/<int:pin_id>/edit', methods=['PUT'])
@login_required
def edit_pin(pin_id):
    pin = Pin.query.get(pin_id)
    if not pin : return {"message": "Pin not found"}, 404
    is_auth = authorize(pin.user_id)
    if is_auth : return is_auth
    form = PinForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        old_image = pin.content_url
        new_image = form.data['content_url']
        new_image.filename = get_unique_filename(new_image.filename)
        upload = upload_file_to_s3(new_image)
        pin.title = form.data['title']
        pin.content_url = upload['url']
        pin.description = form.data['description']
        pin.link = form.data['link']
        if old_image: remove_file_from_s3(old_image)
        return pin.to_dict(),201
    return {"errors":form.errors},400
    
# Edit pin by id

@pin_routes.route('/<int:pin_id>/delete', methods=['DELETE'])
@login_required
def delete_pin(pin_id):
    pin = Pin.query.get(pin_id)
    if not pin: return {"message": "Pin not found"}, 404
    is_auth = authorize(pin.user_id)
    if is_auth: return is_auth
    old_image = pin.content_url
    db.session.delete(pin)
    db.session.commit()
    if old_image: remove_file_from_s3(old_image)
    return {"message": "Pin successfully deleted"}, 200
# Delete pin by id

@pin_routes.route('/<int:pin_id>/comments')
def get_comments(pin_id):
    comments = PinComment.query.filter_by(pin_id=pin_id).all()
    return {"Comments": [comment.to_dict() for comment in comments]}
# Get all comments for a pin

@pin_routes.route('/<int:comment_id>')
def get_comment(comment_id):
    comment = PinComment.query.get(comment_id)
    if not comment: return {"message": "Comment not found"}, 404
    return comment.to_dict()
# Get a comment by id

@pin_routes.route('/<int:pin_id>/comments/new', methods=['POST'])
@login_required
def create_comment(pin_id):
    pin = Pin.query.get(pin_id)
    form = PinCommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        comment = PinComment(
            user_id=current_user.id,
            pin_id=pin_id,
            content=form.data['content']
        )
        db.session.add(comment)
        db.session.commit()
        return pin.to_dict()
    else: return {"errors": form.errors}, 400
# Create a comment

@pin_routes.route('/<int:comment_id>/edit', methods=['PUT'])
@login_required
def edit_comment(comment_id):
    comment = PinComment.query.get(comment_id)
    if not comment: return {"message": "Comment not found"}, 404
    is_auth = authorize(comment.user_id)
    if is_auth: return is_auth
    form = PinCommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        comment.content = form.data['content']
        db.session.commit()
        return comment.to_dict()
    return {"errors": form.errors}, 400
# Edit a comment

@pin_routes.route('/<int:pin_id>/comments/<int:comment_id>/delete', methods=['DELETE'])
@login_required
def delete_comment(pin_id, comment_id):
    pin = Pin.query.get(pin_id)
    if not pin: return {"message": "Pin not found"}, 404
    comment = PinComment.query.get(comment_id)
    if not comment: return {"message": "Comment not found"}, 404
    if comment.user_id != current_user.id: return {"message": "Unauthorized"}, 403
    db.session.delete(comment)
    db.session.commit()
    return pin.to_dict()
# Delete a comment

@pin_routes.route('/<int:pin_id>/likes')
def get_pin_likes(pin_id):
    pin = Pin.query.get(pin_id)
    if not pin:
        return {"message": "Pin not found"}, 404
    likes = PinLike.query.filter_by(pin_id=pin_id).all()
    return {"Likes": [like.user_id for like in likes]}
# Get pin likes

@pin_routes.route('/<int:pin_id>/like', methods=['POST'])
@login_required
def toggle_like(pin_id):
    pin = Pin.query.get(pin_id)
    if not pin:
        return {"message": "Pin not found"}, 404
    like = PinLike.query.filter_by(user_id=current_user.id, pin_id=pin_id).first()
    if like:
        db.session.delete(like)
        message = "Pin unliked"
    else:
        new_like = PinLike(user_id=current_user.id, pin_id=pin_id)
        db.session.add(new_like)
        message = "Pin liked"
    db.session.commit()
    return {"message": message}, 200
# Toggle like/unlike a pin