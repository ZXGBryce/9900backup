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
        """ 生成token """
        payload = {
            "user_id": user.id,
            "version": user.jwt_version,
            "user_type": user.user_type,
            "exp": datetime.datetime.utcnow() + self.expiry_duration  # 设置token时限为一天
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    def decode_token(self, token: str) -> Optional[Union[str, dict]]:
        """ 解码 JWT token， 如果无效或过期，返回None """
        try:
            return jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
        except jwt.ExpiredSignatureError:
            # token已经过期
            return None
        except jwt.InvalidTokenError:
            # token无效
            return None

    def set_expiry_duration(self, duration: datetime.timedelta):
        """ 设置token的有效期 """
        self.expiry_duration = duration


    def decode_and_verify_token(self, token: str, user: AuthUserTab) -> bool:
        """ 验证 JWT 版本号 """
        decode_token = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
        return  decode_token.get("version") == user.jwt_version


