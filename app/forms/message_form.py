from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired

class MessageForm(FlaskForm):
    content = StringField('Content', validators=[DataRequired()])
    recipient_id = StringField('Recipient ID', validators=[DataRequired()])