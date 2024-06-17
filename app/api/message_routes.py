# app/api/message_routes.py
from flask import Blueprint, request, jsonify
from app.models import db, Message
from flask_login import login_required, current_user
from app.forms import MessageForm
from app.socket import socketio

message_routes = Blueprint('messages', __name__)

@message_routes.route('/<int:user_id>', methods=['GET'])
@login_required
def get_user_messages(user_id):
    messages = Message.query.filter(
        ((Message.sender_id == current_user.id) & (Message.recipient_id == user_id)) |
        ((Message.sender_id == user_id) & (Message.recipient_id == current_user.id))
    ).order_by(Message.timestamp.asc()).all()
    return jsonify({"messages": [message.to_dict() for message in messages]})

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
        print(message)
        message_data = message.to_dict()
        message_data['timestamp'] = message_data['timestamp'].isoformat()
        socketio.emit('chat', message_data)

        return message_data, 201
    return {"errors": form.errors}, 400
