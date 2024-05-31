from flask_wtf import FlaskForm
from wtforms import StringField,TextAreaField,BooleanField
from wtforms.validators import DataRequired, Email, ValidationError,Length
from app.models import User
from flask_wtf.file import FileField,FileAllowed,FileRequired
from app.api.AWS import ALLOWED_EXTENSIONS
from flask_login import current_user
def username_exists(form, field):
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user.id != current_user.id:
        raise ValidationError('Email address is already in use.')

def email_exists(form,field):
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user.id != current_user.id:
        raise ValidationError('Email address is already in use.')
    
class EditProfileForm(FlaskForm):
    username = StringField('username', validators=[DataRequired(),username_exists])
    email = StringField('email', validators=[DataRequired()])
    about = StringField('about')
    profile_image = FileField('Content File',validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    private = BooleanField('Private',default=False)