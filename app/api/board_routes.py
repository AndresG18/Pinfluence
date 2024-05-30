from flask import Blueprint, request
from app.models import db, Board,Pin
from flask_login import login_required, current_user
from app.forms import BoardForm

board_routes = Blueprint('boards', __name__)

def authorize(user_id):
    if user_id != current_user.id: return {"message": "Forbidden"}, 403
    return None

@board_routes.route('')
def boards():
    all_boards = Board.query.all()
    return {"Boards": [board.to_dict() for board in all_boards]}
# Get all boards

@board_routes.route('/<int:board_id>')
def board(board_id):
    board = Board.query.get(board_id)
    if not board: return {"message": "Board not found"}, 404
    return board.to_dict()
# Get a board by id

@board_routes.route('/new', methods=['POST'])
@login_required
def create_board():
    form = BoardForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        board = Board(
            user_id=current_user.id,
            name=form.data['name'],
            description=form.data['description']
        )
        db.session.add(board)
        db.session.commit()
        return board.to_dict()
    else: return {"errors": form.errors}, 400
# Create a board

@board_routes.route('/<int:board_id>/edit', methods=['PUT'])
@login_required
def edit_board(board_id):
    board = Board.query.get(board_id)
    if not board: return {"message": "Board not found"}, 404
    is_auth = authorize(board.user_id)
    if is_auth: return is_auth
    form = BoardForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        board.name = form.data['name']
        board.description = form.data['description']
        db.session.commit()
        return board.to_dict()
    return {"errors": form.errors}, 400
# Edit a board

@board_routes.route('/<int:board_id>/delete', methods=['DELETE'])
@login_required
def delete_board(board_id):
    board = Board.query.get(board_id)
    if not board: return {"message": "Board not found"}, 404
    is_auth = authorize(board.user_id)
    if is_auth: return is_auth
    db.session.delete(board)
    db.session.commit()
    return {"message": "Board successfully deleted"}, 200
# Delete a board
@board_routes.route('/<int:board_id>/pins')
def get_board_pins(board_id):
    board = Board.query.get(board_id)
    if not board: return {"message": "Board not found"}, 404
    pins = board.pins
    return {"Pins": [pin.to_dict() for pin in pins]}
# Get all pins in a board

@board_routes.route('/<int:pin_id>/boards')
def get_pin_boards(pin_id):
    pin = Pin.query.get(pin_id)
    if not pin: return {"message": "Pin not found"}, 404
    boards = pin.boards
    return {"Boards": [board.to_dict() for board in boards]}
# Get all boards a pin is in

@board_routes.route('/<int:board_id>/pins/<int:pin_id>', methods=['POST'])
@login_required
def add_pin_to_board(board_id, pin_id):
    board = Board.query.get(board_id)
    pin = Pin.query.get(pin_id)
    if not board or not pin:
        return {"message": "Board or Pin not found"}, 404
    is_auth = authorize(board.user_id)
    if is_auth: return is_auth
    board.pins.append(pin)
    db.session.commit()
    return {"message": "Pin added to board"}, 200
# Add a pin to a board

@board_routes.route('/<int:board_id>/pins/<int:pin_id>', methods=['DELETE'])
@login_required
def remove_pin_from_board(board_id, pin_id):
    board = Board.query.get(board_id)
    pin = Pin.query.get(pin_id)
    if not board or not pin:
        return {"message": "Board or Pin not found"}, 404
    is_auth = authorize(board.user_id)
    if is_auth: return is_auth
    board.pins.remove(pin)
    db.session.commit()
    return {"message": "Pin removed from board"}, 200
# Remove a pin from a board