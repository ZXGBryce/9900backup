from pydantic import BaseModel

# Define the JWT manager config structure
class JWTConfig(BaseModel):
    SECRET_KEY: str