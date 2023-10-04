import functools
from typing import TypeVar, Callable, Type

from flask import Request, request
from flask.typing import RouteCallable, ResponseReturnValue
from pydantic import BaseModel, ValidationError

from ...server.consts.response_format import Response, Code

RT = TypeVar("RT", bound=BaseModel)
TypedHandler_F = Callable[[RT], Response]


def handle_with_pydantic(request_class: Type[RT]):
    """
    调用handle_with_pydantic可以获得一个装饰器
    这个装饰器以TypedHandler_F为参数，返回一个RouteCallable——一个标准的flask请求处理函数
    下面的代码中：
    装饰器就是wrapper
    TypedHandler_F类型的参数是func
    返回的标准的flask请求处理函数是inner
    """

    def wrapper(func: TypedHandler_F) -> RouteCallable:
        @functools.wraps(func)  # 装饰器本质是接受一个函数作为参数然后返回一个新的函数的函数的语法糖。这一行可以理解是固定写法。
        def inner() -> ResponseReturnValue:
            # 1. 解析请求的json，把它变成python的类便于后续使用
            # 如果出错就返回请求json错误
            try:
                req_data: RT = request_class.model_validate(request.json)
            except ValidationError as e:
                return Response(code=Code.INVALID_ACCOUNT_OR_PASSWORD).model_dump()

            # 2. 调用用户写的请求处理函数，这里可以加错误处理，也可以在中间件加错误处理
            res: Response = func(req_data)

            # 3. 返回用户写的处理函数返回的结果
            return res.model_dump()

        return inner # wrapper函数接受了func函数作为参数，

    return wrapper