from flask import Blueprint, Request, request
from pydantic import BaseModel

from flask_app.libs.registry import DependencyRegistry as dep
from flask_app.server.consts.response_format import Response, Code
from flask_app.server.utils.password import hash_password, check_password
from flask_app.server.utils.request_parser import handle_with_pydantic
from flask_app.server.utils.verification_code import generate_verification_code
from flask_app.models.user import AuthUserTab


auth_blueprint = Blueprint('mailer', __name__, url_prefix="/mailer")


# TODO 完成接口1: 接收request中的用户邮箱， 然后利用registry.py中已经定义好的mail sever向用户邮箱发送验证码同时更新AutheUserTab中对应用户中的verification_code，记得使用generate_verification_code 生成验证码并验证用户邮箱是否为有效邮箱。如果用户邮箱不是有效邮箱返回错误message

class SendMailcodeRequest(BaseModel):
    email: str

@auth_blueprint.post('/send_mailcode')  # 在blueprint注册请求
@handle_with_pydantic(SendMailcodeRequest)  # 这里点进去看
def send_mailcode(SendMailcodeRequest) -> Response:

    # Get username from jwt token
    jwt_token = request.headers.get('Authorization').split(' ')[1]
    payload = dep.jwt_manager.decode_token(jwt_token)
    username = payload.get("username")

    user = dep.data_access.get_user_by_username(username)

    code = generate_verification_code()

    dep.data_access.update_user_verification_code(user,code)

    return Response



# TODO 接口2: 接收request 发来的用户输入的验证码，然后验证AuthUserTab中的正确验证码和发来的验证码是否一致，返回验证消息
class VerifyCodeRequest(BaseModel):
    code: str

@auth_blueprint.post('/verify_code')  # 在blueprint注册请求
@handle_with_pydantic(VerifyCodeRequest)  # 这里点进去看
def verfi_code(VerifyCodeRequest) -> Response:

    # Get username from jwt token
    jwt_token = request.headers.get('Authorization').split(' ')[1]
    payload = dep.jwt_manager.decode_token(jwt_token)
    username = payload.get("username")

    user = dep.data_access.get_user_by_username(username)

    correct_code = user.verification_code

    return Response