from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, PasswordField, TextAreaField
from wtforms.validators import DataRequired, Email, Length


class BoardForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    description =StringField('Description')
