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
    """ User right is correct return code """
    #return jsonify(message="Admin access granted"), 200
    return Response(code=Code.IS_ADMIN).dict()

@admin_blueprint.post('/upload_csv')
@require_admin
def upload_csv():
    """ Receive the csv file and check the format than store in DataSetTab """

    # Check if the file is empty
    if 'csv_file' not in request.files:
        return Response(code=Code.NO_FILE_PROVIDED).dict()
    csv_file = request.files['csv_file']

    if csv_file.filename == '':
        return Response(code=Code.NO_FILE_PROVIDED).dict()

    # Try to read the file
    try:
        df = pd.read_csv(csv_file.stream)
    except pd.errors.EmptyDataError:
        return Response(code=Code.WRONG_CSV_FILE_FORMAT).dict()

    # File format check
    expected_columns = {
        'company_name', 'framework', 'indicator_name', 'indicator_value',
        'sasb_materiality', 'region', 'sector', 'environment',
        'social', 'governance', 'timestamp', 'data_source'
    }
    if set(df.columns) != expected_columns:
        return Response(code=Code.WRONG_CSV_FILE_FORMAT).dict()


    # Read the data
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
    return Response().dict()
