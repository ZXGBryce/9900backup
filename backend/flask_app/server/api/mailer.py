from flask import Blueprint, Request, request
from pydantic import BaseModel

from flask_app.libs.registry import DependencyRegistry as dep
from flask_app.server.consts.response_format import Response, Code
from flask_app.server.utils.password import hash_password, check_password
from flask_app.server.utils.request_parser import handle_with_pydantic
from flask_app.server.utils.verification_code import generate_verification_code
from flask_app.models.user import AuthUserTab
from flask_app.server.utils.password import hash_password


mailer_blueprint = Blueprint('mailer', __name__, url_prefix="/mailer")



class SendMailcodeRequest(BaseModel):
    email: str
    username: str

@mailer_blueprint.post('/send_mailcode')  # 在blueprint注册请求
@handle_with_pydantic(SendMailcodeRequest)  # 这里点进去看
def send_mailcode(SendMailcodeRequest) -> Response:

    email = SendMailcodeRequest.email

    username = SendMailcodeRequest.username

    user = dep.data_access.get_user_by_username(username)

    if not user:
        return Response(code=Code.WRONG_USERNAME_OR_EMAIL,message="User not exist")

    if user.email != email:
        return Response(code=Code.WRONG_USERNAME_OR_EMAIL, message="Wrong Email Address")

    code = generate_verification_code()

    dep.data_access.update_user_verification_code(user,code)

    mailer = dep.mail

    mailer.send_verification_code(email, code)

    return Response(code=Code.OK)



class VerifyCodeRequest(BaseModel):
    code: str
    username: str

@mailer_blueprint.post('/verify_code')
@handle_with_pydantic(VerifyCodeRequest)
def verify_code(VerifyCodeRequest) -> Response:

    username = VerifyCodeRequest.username

    user = dep.data_access.get_user_by_username(username)

    correct_code = user.verification_code

    if VerifyCodeRequest.code == correct_code:
        return Response(code=Code.OK)
    else:
        return Response(code=Code.WRONG_CODE)


class ChangepasswordRequest(BaseModel):
    username: str
    newpassword: str

@mailer_blueprint.post('/change_new_password')
@handle_with_pydantic(ChangepasswordRequest)
def change_password(ChangepasswordRequest) -> Response:

    username = ChangepasswordRequest.username

    user = dep.data_access.get_user_by_username(username)

    user.password = hash_password(ChangepasswordRequest.newpassword)

    user.save()

    return Response(code=Code.OK)
