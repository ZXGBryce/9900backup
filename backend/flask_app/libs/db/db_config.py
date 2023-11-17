from pydantic import BaseModel


# Define a Database configure structure
class DBConfig(BaseModel):
    db_name: str