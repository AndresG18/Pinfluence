from flask_wtf import FlaskForm
from wtforms import StringField,TextAreaField,BooleanField
from wtforms.validators import DataRequired, Email, ValidationError,Length
from app.models import User
from flask_wtf.file import FileField,FileAllowed,FileRequired
from app.api.AWS import ALLOWED_EXTENSIONS

def user_exists(form, field):
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


class SignUpForm(FlaskForm):
    first_name = StringField('First Name', validators=[Length(max=30)])
    last_name = StringField('Last Name', validators=[Length(max=30)])
    username = StringField('username', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[DataRequired(), user_exists])
    about = TextAreaField('About')
    password = StringField('password', validators=[DataRequired()])
    profile_image = FileField('Content File',validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    private = BooleanField('Private',default=False,validators=[DataRequired()])
