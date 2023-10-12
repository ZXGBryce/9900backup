from flask import Blueprint, request
from functools import wraps

from flask_app.libs.registry import DependencyRegistry as dep
from flask_app.server.consts.response_format import Response, Code


# 检查用户权限的装饰器
def require_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        jwt_token = request.headers.get('Authorization').split(' ')[1]  # Assuming "Bearer {token}" format
        payload = dep.jwt_manager.decode_token(jwt_token)

        """ 检查用户权限 """
        if not payload.get("is_admin"):
            return Response(code= Code.PERMISSION_DENY).dict()

        user = dep.data_access.get_user_by_username(payload.get("username"))
        if not user or not user.is_admin:
            return Response(code=Code.WRONG_USERNAME_OR_EMAIL).dict()
        """ 检查 token 是否过期 """
        # 版本号有问题没有更新功能要重写
        #if dep.jwt_manager.decode_and_verify_token(jwt_token, user):
            #return Response(code=Code.TOKEN_EXPIRY).dict()

        return f(*args, **kwargs)

    return decorated_function