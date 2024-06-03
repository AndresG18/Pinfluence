from flask.cli import AppGroup
from .users import seed_users, undo_users
from .boards import seed_boards,undo_boards
from .pins import seed_pins,undo_pins
from .pin_comments import seed_pin_comments , undo_pin_comments
from .pin_board import seed_board_pins,undo_board_pins
from .followers import seed_followers,undo_followers
from app.models.db import db, environment, SCHEMA


seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        undo_followers
        undo_board_pins()
        undo_pin_comments()
        undo_boards()
        undo_pins()
        undo_users()
        
        
    seed_users()
    seed_pins()
    seed_boards()
    seed_pin_comments()
    seed_board_pins()
    seed_followers()

@seed_commands.command('undo')
def undo():
    undo_followers()
    seed_board_pins()
    undo_pin_comments()
    undo_boards()
    undo_pins()
    undo_users()
    
