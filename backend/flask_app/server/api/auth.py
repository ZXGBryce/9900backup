from flask import Blueprint, Request
from pydantic import BaseModel

from flask_app.libs.registry import DependencyRegistry as dep
from flask_app.server.consts.response_format import Response, Code
from flask_app.server.utils.password import hash_password, check_password
from flask_app.server.utils.request_parser import handle_with_pydantic


auth_blueprint = Blueprint('auth', __name__, url_prefix="/auth")

class SignUpRequest(BaseModel):
    username: str
    email: str
    password: str
    repeat_password: str


@auth_blueprint.post('/sign_up')
@handle_with_pydantic(SignUpRequest)
def sign_up(request: SignUpRequest) -> Response:
    # Check if the confirmed password match to password
    if request.password != request.repeat_password:
        return Response(code=Code.REPEAT_PASSWORD_WRONG)

    # Check if username already exists
    if dep.data_access.get_user_by_username(request.username):
        return Response(code=Code.DUPLICATED_USERNAME)

    # Check if email address already exists
    if dep.data_access.get_user_by_email(request.email):
        return Response(code=Code.DUPLICATED_EMAIL)

    # Store the user info in User table
    new_user = dep.data_access.create_new_user(request.username, hash_password(request.password), request.email)
    return Response()


class SignInRequest(BaseModel):
    username_or_email: str
    password: str

class SignInResponse(BaseModel):
    token: str

@auth_blueprint.post('/sign_in')
@handle_with_pydantic(SignInRequest)
def sign_in(request: SignInRequest) -> Response[SignInResponse]:
    # Check if username already exists
    user = dep.data_access.get_user_by_username(request.username_or_email)
    if not user:
        # If it is email, check if email already exists
        user = dep.data_access.get_user_by_email(request.username_or_email)
        if not user:
            return Response(code=Code.WRONG_USERNAME_OR_EMAIL)

    # Verify the password
    if not check_password(request.password, user.password):
        return Response(code=Code.WRONG_PASSWORD)

    # Create JWT token
    jwt_token = dep.jwt_manager.generate_token(user)

    # Identify the user type and return to front end
    message = "admin" if user.is_admin else "regular"

    return Response(data=SignInResponse(token=jwt_token), code=Code.OK, message=message)





















