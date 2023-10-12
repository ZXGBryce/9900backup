from peewee import Model
from flask_app.libs.db.db import database

class BaseModel(Model):
    class Meta:
        database = database