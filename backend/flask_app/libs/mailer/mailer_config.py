from pydantic import BaseModel

# Define the Mail Server config structure
class MailConfig(BaseModel):
    MAIL_SERVER: str
    MAIL_PORT: int
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_USE_TLS: bool
    MAIL_USE_SSL: bool