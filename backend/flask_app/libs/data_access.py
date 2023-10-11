from typing import Optional

from peewee import Database

from flask_app.models.user import AuthUserTab


class DataAccess:
    def __init__(self, db: Database):
        self.db = db

    def get_user_by_username(self, username: str) -> Optional[AuthUserTab]:
        """ 检查用户名是否存在 """
        return AuthUserTab.get_or_none(
            AuthUserTab.username == username
        )

    def create_new_user(self, username: str, hashed_password: str, email: str) -> AuthUserTab:
        """ 创建新用户 """
        return AuthUserTab.create(
            username=username,
            password=hashed_password,
            email=email
        )

    def get_user_by_email(self, email: str) -> Optional[AuthUserTab]:
        """ 检查邮件是否存在 """
        return AuthUserTab.get_or_none(
            AuthUserTab.email == email
        )

    def set_user_jwt_version(self, username: str, jwt_token: str) -> Optional[int]:
        """ 为用户设置 JWT """
        user = self.get_user_by_username(username)
        return user.jwt_version if user else None

    def increment_jwt_version(self, user: AuthUserTab):
        """ 更新版本号 """
        user.jwt_version += 1
        user.save()