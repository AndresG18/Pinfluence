from flask import Blueprint, request
from app.models import db, Message
from flask_login import login_required, current_user
from app.forms import MessageForm

message_routes = Blueprint('messages', __name__)

@message_routes.route('')
@login_required
def get_messages():
    received_messages = Message.query.filter_by(recipient_id=current_user.id).all()
    sent_messages = Message.query.filter_by(sender_id=current_user.id).all()
    return {
        "received": [message.to_dict() for message in received_messages],
        "sent": [message.to_dict() for message in sent_messages]
    }
# Get all messages for user

@message_routes.route('/new', methods=['POST'])
@login_required
def send_message():
    form = MessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        message = Message(
            sender_id=current_user.id,
            recipient_id=form.data['recipient_id'],
            content=form.data['content']
        )
        db.session.add(message)
        db.session.commit()
        return message.to_dict(), 201
    return {"errors": form.errors}, 400
# Send a message

@message_routes.route('/<int:message_id>/delete', methods=['DELETE'])
@login_required
def delete_message(message_id):
    message = Message.query.get(message_id)
    if not message:
        return {"message": "Message not found"}, 404
    if message.sender_id != current_user.id and message.recipient_id != current_user.id:
        return {"message": "Forbidden"}, 403
    db.session.delete(message)
    db.session.commit()
    return {"message": "Message successfully deleted"}, 200
# Delete message by ID
