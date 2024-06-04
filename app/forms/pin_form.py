from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField
from wtforms.validators import DataRequired, Optional
from flask_wtf.file import FileField, FileAllowed
from app.api.AWS import ALLOWED_EXTENSIONS

class PinForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired()])
    content_url = FileField('Content File', validators=[Optional(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    description = TextAreaField('Description', validators=[DataRequired()])
    link = StringField('Link', validators=[Optional()])

class PinCommentForm(FlaskForm):
    content = StringField('Content', validators=[DataRequired()])
