from flask import Blueprint, request
from app.models import db, User,Board
from flask_login import login_user,login_required,current_user
from app.forms import BoardForm
from .AWS import upload_file_to_s3, get_unique_filename

board_routes = Blueprint('boards', __name__)

def authorize(user_id):
    if user_id != current_user.id: return {"message":"Forbidden"}, 403
    return None

@board_routes.route('')
def boards():
    all_boards = Board.query.all()
    return {"Boards":[board.to_dict() for board in all_boards]}
# Get users boards

@board_routes.route('/<int:board_id>')
def board(board_id):
    board = Board.query.get(board_id)
    if not board : return {"message": "Board not found"}
    return board.to_dict()
# Get a board

@board_routes.route('/new', methods=['POST'])
@login_required
def create_board():
    pass
# Create a board

@board_routes.route('/board_id', methods=['PUT'])
@login_required
def edit_board(board_id):
    pass
# Edit a board

@board_routes.route('/board_id', methods=['DELETE'])
@login_required
def delete_board(board_id):
    pass
# Delete a board

