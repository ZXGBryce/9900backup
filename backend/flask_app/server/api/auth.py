from flask import Blueprint, Request
from pydantic import BaseModel

from flask_app.libs.registry import DependencyRegistry as dep
from flask_app.server.consts.response_format import Response, Code
from flask_app.server.utils.password import hash_password, check_password
from flask_app.server.utils.request_parser import handle_with_pydantic


# 定义blueprint可以把一类的接口放在一起管理，不用像quickstart中都一股脑写在app上
# url_prefix是/auth 访问下面的sign_up接口时地址就是这样的http://localhost:8000/auth/sign_up
auth_blueprint = Blueprint('auth', __name__, url_prefix="/auth")


class SignUpRequest(BaseModel):
    """定义注册接口的请求参数"""
    username: str
    email: str
    password: str
    repeat_password: str
    #verification_code: str


@auth_blueprint.post('/sign_up')  # 在blueprint注册请求
@handle_with_pydantic(SignUpRequest)  # 这里点进去看
def sign_up(request: SignUpRequest) -> Response:
    # 判断密码和重复密码是否一致
    if request.password != request.repeat_password:
        return Response(code=Code.REPEAT_PASSWORD_WRONG)

    # 判断密码强度

    # 检查用户名是否重复
    if dep.data_access.get_user_by_username(request.username):
        return Response(code=Code.DUPLICATED_USERNAME)

    # 没问题，保存用户到数据库
    new_user = dep.data_access.create_new_user(request.username, hash_password(request.password), request.email)
    return Response()


class SignInRequest(BaseModel):
    # 登陆请求用户名 + 密码
    username_or_email: str
    password: str


class SignInResponse(BaseModel):
    # 登录成功的话返回一个jwt token
    token: str


@auth_blueprint.post('/sign_in')
@handle_with_pydantic(SignInRequest)
def sign_in(request: SignInRequest) -> Response[SignInResponse]:
    # 检查用户名是否存在
    user = dep.data_access.get_user_by_username(request.username_or_email)
    if not user:
        # 若用户名不存在，尝试检查邮箱是否存在
        user = dep.data_access.get_user_by_email(request.username_or_email)  # 注意这里也使用request.username，因为用户可能输入邮箱作为用户名登录
        if not user:
            return Response(code=Code.WRONG_USERNAME_OR_EMAIL)

    # 验证密码
    if not check_password(request.password, user.password):
        return Response(code=Code.WRONG_PASSWORD)

    # 生成 JWT
    jwt_token = dep.jwt_manager.generate_token(user)

    # 以下可以是生成和返回JWT token的逻辑，这里为简化示例，我们只返回一个静态token
    return Response(data=SignInResponse(token=jwt_token), code=Code.OK)





















