from flask import Blueprint, request, jsonify
import pandas as pd

from flask_app.libs.registry import DependencyRegistry as dep
from flask_app.server.utils.admin_parser import require_admin
from flask_app.models.dataset import DataSetTab
from flask_app.server.consts.response_format import Response, Code


# Create the 'admin' blueprint
admin_blueprint = Blueprint('admin', __name__, url_prefix="/admin")


@admin_blueprint.get('/check_admin')
@require_admin
def check_admin_access():
    """ 用户权限通过 返回状态码 """
    #return jsonify(message="Admin access granted"), 200
    return Response(code=Code.IS_ADMIN).dict()

@admin_blueprint.post('/upload_csv')
@require_admin
def upload_csv():
    """ 接受csv文件并转换为table """
    if 'csv_file' not in request.files:
        #return jsonify(error="No file provided"), 404
        return Response(code=Code.NO_FILE_PROVIDED).dict()
    csv_file = request.files['csv_file']

    # 对文件进行安全检查， 检查文件大小，文件类型等

    # 插入数据
    df = pd.read_csv(csv_file.stream)
    for col in ['environment', 'social', 'governance']:
        df[col] = df[col].map({'Yes': True, 'No': False})
    with dep.data_access.db.atomic():
        for index, row in df.iterrows():
            DataSetTab.create(
                company_name=row['company_name'],
                framework=row['framework'],
                indicator_name=row['indicator_name'],
                indicator_value=row['indicator_value'],
                sasb_materiality=row['sasb_materiality'],
                region=row['region'],
                sector=row['sector'],
                environment=row['environment'],
                social=row['social'],
                governance=row['governance'],
                timestamp=row['timestamp'],
                data_source=row['data_source']
            )
    #return jsonify(message="Upload successful"), 200
    return Response().dict()
