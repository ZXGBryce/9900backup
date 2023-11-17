from peewee import Model
from flask_app.libs.db.db import database

# Setup a base model
class BaseModel(Model):
    class Meta:
        database = database