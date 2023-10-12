import peewee as p
from flask_app.libs.db.db import database
from flask_app.models.base import BaseModel


class DataSetTab(BaseModel):
    """ dataset format """
    company_name = p.CharField()
    framework = p.CharField()
    indicator_name = p.CharField()
    indicator_value = p.FloatField()
    sasb_materiality = p.CharField()
    region = p.CharField()
    sector = p.CharField()
    environment = p.BooleanField()
    social = p.BooleanField()
    governance = p.BooleanField()
    timestamp = p.DateField(formats=['%Y/%m/%d, %H:%M:%S'])

    class Meta:
        database = database

database.create_tables([DataSetTab])