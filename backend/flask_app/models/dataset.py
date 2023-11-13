import peewee as p
from flask_app.libs.db.db import database
from flask_app.models.base import BaseModel


class DataSetTab(BaseModel):
    """ dataset format """
    company_name = p.CharField()
    framework = p.CharField()
    indicator_name = p.CharField()
    indicator_value = p.FloatField()
    sasb_materiality = p.IntegerField() # 1/0
    region = p.CharField()
    sector = p.CharField()
    environment = p.IntegerField() # 1/0
    social = p.IntegerField() # 1/0
    governance = p.IntegerField() # 1/0
    timestamp = p.DateField(formats=['%Y/%m/%d, %H:%M:%S'])
    data_source = p.CharField()


database.create_tables([DataSetTab])
