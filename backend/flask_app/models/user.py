import time

from peewee import Model
from flask_app.libs.db.db import database
import peewee as p


class BaseModel(Model):
    class Meta:
        database = database


def timestamp() -> int:
    return int(time.time())


class AuthUserTab(BaseModel):
    """user table"""
    id = p.PrimaryKeyField()
    username = p.CharField(unique=True)
    email = p.CharField(unique=True, max_length=255)
    jwt_version = p.IntegerField(default=1)
    password = p.FixedCharField(max_length=64)  # 密码哈希值
    create_at = p.BigIntegerField(default=timestamp)  # 账号创建的时间戳，默认值为当前时间戳，timestamp是个函数不是固定值
    last_login_at = p.BigIntegerField(null=True)  # 最后一次登录时间戳，如果没登陆过就是null


database.create_tables([AuthUserTab])