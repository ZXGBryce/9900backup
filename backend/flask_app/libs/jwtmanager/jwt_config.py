from pydantic import BaseModel


class JWTConfig(BaseModel):
    SECRET_KEY: str