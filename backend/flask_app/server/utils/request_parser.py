import functools
from typing import TypeVar, Callable, Type

from flask import Request, request
from flask.typing import RouteCallable, ResponseReturnValue
from pydantic import BaseModel, ValidationError

from flask_app.server.consts.response_format import Response, Code

RT = TypeVar("RT", bound=BaseModel)
TypedHandler_F = Callable[[RT], Response]


def handle_with_pydantic(request_class: Type[RT]):
    """
    Calling handle_with_pydantic provides a decorator.
    This decorator takes a TypedHandler_F as an argument and returns a RouteCallable — a standard Flask request handling function.
    In the code below:

    The decorator is referred to as wrapper.
    The TypedHandler_F type argument is func.
    The returned standard Flask request handling function is inner.
    """

    def wrapper(func: TypedHandler_F) -> RouteCallable:
        @functools.wraps(func)
        def inner() -> ResponseReturnValue:
            # 1. Parse the request's JSON and convert it into a Python class for easier use later.
            # If there is an error, return that the request JSON is incorrect.
            try:
                req_data: RT = request_class(**request.json)
            except ValidationError as e:
                print(e.json())  # print error message
                return Response(code=Code.REQ_JSON_INVALID).dict()

            # 2. Invoke the user-written request handling function. Error handling can be added here, or it can be implemented in middleware.
            res: Response = func(req_data)

            # 3. Return the result produced by the user-written processing function.
            return res.dict()

        return inner # wrapper accept func as parameter

    return wrapper