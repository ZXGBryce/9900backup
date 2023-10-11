from enum import Enum
from typing import Optional, Union, Dict, TypeVar, Generic

from pydantic import BaseModel


class Code(int, Enum):
    OK = 20000
    REQ_JSON_INVALID = 40001
    INVALID_ACCOUNT_OR_PASSWORD = 40002
    REPEAT_PASSWORD_WRONG = 40003
    DUPLICATED_USERNAME = 40004
    WRONG_USERNAME_OR_EMAIL = 40005
    WRONG_PASSWORD = 40006


Response_T = TypeVar("Response_T", bound=BaseModel)


class Response(BaseModel, Generic[Response_T]):
    code: Code = Code.OK
    data: Optional[Union[Dict, Response_T]] = None
    message: str = ""