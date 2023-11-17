from enum import Enum
from typing import Optional, Union, Dict, TypeVar, Generic

from pydantic import BaseModel


class Code(int, Enum):
    """ Definition of each different status code """
    OK = 20000
    IS_ADMIN = 20001
    REQ_JSON_INVALID = 40001
    INVALID_ACCOUNT_OR_PASSWORD = 40002
    REPEAT_PASSWORD_WRONG = 40003
    DUPLICATED_USERNAME = 40004
    WRONG_USERNAME_OR_EMAIL = 40005
    WRONG_PASSWORD = 40006
    DUPLICATED_EMAIL = 40007
    PERMISSION_DENY = 40009
    NO_FILE_PROVIDED = 40010
    TOKEN_EXPIRY = 40011
    EMPTY_REQUEST = 40012
    WRONG_CODE= 40013
    WRONG_CSV_FILE_FORMAT = 40014


Response_T = TypeVar("Response_T", bound=BaseModel)


class Response(BaseModel, Generic[Response_T]):
    """" Define a typing of Response """
    code: Code = Code.OK
    data: Optional[Union[Dict, Response_T]] = None
    message: str = ""