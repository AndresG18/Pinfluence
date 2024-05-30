from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField
from wtforms.validators import DataRequired
from flask_wtf.file import FileField,FileAllowed,FileRequired
from app.api.AWS import ALLOWED_EXTENSIONS
class PinForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired()])
    content_url = FileField('Content File',validators=[FileRequired(),FileAllowed(list(ALLOWED_EXTENSIONS))])
    description = TextAreaField('Description', validators=[DataRequired()])
    link = StringField('Link')

class PinCommentForm(FlaskForm):
    content = StringField('Content', validators=[DataRequired()])