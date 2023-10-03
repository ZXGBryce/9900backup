from typing import Optional

from peewee import Database

from flask_example.models.user import AuthUserTab


class DataAccess:
    def __init__(self, db: Database):
        self.db = db

    def get_user_by_username(self, username: str) -> Optional[AuthUserTab]:
        return AuthUserTab.get_or_none(
            AuthUserTab.username == username
        )

    def create_new_user(self, username: str, hashed_password: str) -> AuthUserTab:
        return AuthUserTab.create(
            username=username,
            password=hashed_password
        )