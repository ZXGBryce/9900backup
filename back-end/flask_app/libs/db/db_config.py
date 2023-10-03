from pydantic import BaseModel


class DBConfig(BaseModel):
    db_name: str