from flask import Blueprint, Request, jsonify, make_response
from pydantic import BaseModel
import json
from flask_app.server.consts.response_format import Response, Code
from flask_app.server.utils.request_parser import handle_with_pydantic
from flask_app.libs.registry import DependencyRegistry as dep

# 定义blueprint可以把一类的接口放在一起管理，不用像quickstart中都一股脑写在app上
# url_prefix是/auth 访问下面的sign_up接口时地址就是这样的http://localhost:8000/auth/sign_up
indi_blueprint = Blueprint('analysis', __name__, url_prefix="/analysis")

class IndiRequest(BaseModel):
    """定义注册接口的请求参数"""
    entities: list
    indicators: list
    framework: str
    sasb: str
    region: list
    sector: list
    environment: str
    social: str
    governance: str

class IndiResponse(BaseModel):
    query: list
@indi_blueprint.get('/indicators')  # 在blueprint注册请求
@handle_with_pydantic(IndiRequest)
def custom_indi(request: IndiRequest) -> Response:
    data_query = dep.data_access.getdatasetvalue(request.entities,request.indicators,request.framework,request.sasb,request.region,request.sector,request.environment,request.social,request.governance)  # 获取所有符合条件的项,在getdatasetvalue中转为json list
    # 返回 JSON 数据作为响应
    if data_query == []:
        return Response(data=IndiResponse(query=data_query), code=Code.REQ_JSON_INVALID)
    return Response(data=IndiResponse(query=data_query), code=Code.OK)
