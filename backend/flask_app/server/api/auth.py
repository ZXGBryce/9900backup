from flask import Blueprint, Request
from pydantic import BaseModel

from flask_app.libs.registry import DependencyRegistry as dep
from flask_app.server.consts.response_format import Response, Code
from flask_app.server.utils.password import hash_password
from flask_app.server.utils.request_parser import handle_with_pydantic

# 定义blueprint可以把一类的接口放在一起管理，不用像quickstart中都一股脑写在app上
# url_prefix是/auth 访问下面的sign_up接口时地址就是这样的http://localhost:8000/auth/sign_up
auth_blueprint = Blueprint('auth', __name__, url_prefix="/auth")


class SignUpRequest(BaseModel):
    """定义注册接口的请求参数"""
    username: str
    password: str
    repeat_password: str


@auth_blueprint.post('/sign_up')  # 在blueprint注册请求
@handle_with_pydantic(SignUpRequest)  # 这里点进去看
def sign_up(request: SignUpRequest) -> Response:
    if request.password != request.repeat_password:
        return Response(code=Code.REPEAT_PASSWORD_WRONG)
    # 判断密码强度，略，没写
    # 检查用户名是否重复
    if dep.data_access.get_user_by_username(request.username):
        return Response(code=Code.DUPLICATED_USERNAME)

    # 没问题，保存用户到数据库
    new_user = dep.data_access.create_new_user(request.username, hash_password(request.password))
    return Response()


class SignInRequest(BaseModel):
    # 登陆请求用户名 + 密码
    username: str
    password: str


class SignInResponse(BaseModel):
    # 登录成功的话返回一个jwt token
    token: str


@auth_blueprint.post('/sign_in')
@handle_with_pydantic(SignInRequest)
def sign_in(request: SignInRequest) -> Response[SignInResponse]:
    # 实现登录逻辑
    pass


