import time

from peewee import Model
from flask_app.libs.db.db import database
import peewee as p
from flask_app.models.base import BaseModel


def timestamp() -> int:
    return int(time.time())


class AuthUserTab(BaseModel):
    """ User table """
    id = p.PrimaryKeyField()
    username = p.CharField(unique=True)
    email = p.CharField(unique=True, max_length=255)
    jwt_version = p.IntegerField(default=1)
    password = p.FixedCharField(max_length=64)  # Hashed Password
    create_at = p.BigIntegerField(default=timestamp)  # The timestamp when the account create
    last_login_at = p.BigIntegerField(null=True)  # The last login timestamp
    is_admin = p.BooleanField(default=False) # User category, yes is admin
    current_framework = p.CharField(default="None") # Record the current framework that user is using
    verification_code = p.CharField(default="123456") # Record the verification code


database.create_tables([AuthUserTab])