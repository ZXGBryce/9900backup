from flask import Blueprint, Request, request
from pydantic import BaseModel

from flask_app.libs.registry import DependencyRegistry as dep
from flask_app.server.consts.response_format import Response, Code
from flask_app.server.utils.password import hash_password, check_password
from flask_app.server.utils.request_parser import handle_with_pydantic
from flask_app.models.customised_metrics import CusMetrics



profile_blueprint = Blueprint('profile', __name__, url_prefix="/profile")


class ProfileResponse(BaseModel):
    username: str
    email: str
    cusframeworks: list

@profile_blueprint.get("/userprofile")
def userprofile():

    # Get username from jwt token
    jwt_token = request.headers.get('Authorization').split(' ')[1]
    if not jwt_token:
        return Response(data={"message": "JWT token missing."}, code=Code.REQ_JSON_INVALID).dict()

    payload = dep.jwt_manager.decode_token(jwt_token)
    if not payload:
        return Response(data={"message": "JWT token invalid or expired."}, code=Code.REQ_JSON_INVALID).dict()

    username = payload.get("username")
    user = dep.data_access.get_user_by_username(payload.get("username"))
    email = user.email

    # Fetch the relevant frameworks for the given username from the CusMetrics table
    query = CusMetrics.select(CusMetrics.framework).where(CusMetrics.framework.contains(f"_{username}_")).distinct()
    frameworks = [entry.framework for entry in query]

    return Response(data=ProfileResponse(username=username, email=email, cusframeworks=frameworks).dict(), code=Code.OK).dict()