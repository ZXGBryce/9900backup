import jwt
import datetime
from typing import Optional, Union
from flask_app.models.user import AuthUserTab
from flask_app.configs.startup_config import config


class JWTManager:
    def __init__(self, secret_key: str):
        self.secret_key = secret_key
        self.algorithm = "HS256"
        self.expiry_duration = datetime.timedelta(days=1)

    def generate_token(self,user: AuthUserTab) -> str:
        """ Generate JWT token """
        payload = {
            "username": user.username,
            "version": user.jwt_version,
            "is_admin": user.is_admin,
            "exp": datetime.datetime.utcnow() + self.expiry_duration  # Set the time limitation is 24h
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    def decode_token(self, token: str) -> Optional[Union[str, dict]]:
        """ Decode JWT token，if the token is expired， return None """
        try:
            return jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
        except jwt.ExpiredSignatureError:
            # Token is expired
            return None
        except jwt.InvalidTokenError:
            # T1`oken is invalid
            return None

    def set_expiry_duration(self, duration: datetime.timedelta):
        """ Set token time limitation """
        self.expiry_duration = duration


    def decode_and_verify_token(self, token: str, user: AuthUserTab) -> bool:
        """  Verify JWT version """
        decode_token = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
        return  decode_token.get("version") == user.jwt_version


