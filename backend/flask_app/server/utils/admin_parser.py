from flask import Blueprint, request
from functools import wraps

from flask_app.libs.registry import DependencyRegistry as dep
from flask_app.server.consts.response_format import Response, Code


# Decorator to check user right
def require_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        jwt_token = request.headers.get('Authorization').split(' ')[1]  # Assuming "Bearer {token}" format
        payload = dep.jwt_manager.decode_token(jwt_token)

        """ check user type """
        if not payload.get("is_admin"):
            return Response(code= Code.PERMISSION_DENY).dict()

        user = dep.data_access.get_user_by_username(payload.get("username"))
        if not user or not user.is_admin:
            return Response(code=Code.WRONG_USERNAME_OR_EMAIL).dict()

        return f(*args, **kwargs)

    return decorated_function