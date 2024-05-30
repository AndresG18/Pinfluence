from flask import Blueprint, request
from app.models import db, User,Pin
from flask_login import login_user,login_required,current_user
from app.forms import PinForm
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

@pin_routes.route('/<int:pin_id>')
def pin(pin_id):
    pin = Pin.query.get(pin_id)
    if not pin : return {"message": "Pin not found"}, 404
    return pin.to_dict()
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



