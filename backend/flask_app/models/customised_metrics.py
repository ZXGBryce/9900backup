import peewee as p
from flask_app.libs.db.db import database
from flask_app.models.base import BaseModel



class CusMetrics(BaseModel):

    """ Table for customised Metrics based on the CSV structure """
    framework = p.CharField()  # e.g., zxg_1_APRA_CPG_229
    company = p.CharField()
    indicator_name = p.CharField()  # e.g., Policy changes
    indicator_value = p.FloatField()
    indicator_weight = p.FloatField()  # e.g., 34
    sub_category = p.CharField()  # e.g., Policy and legal
    sub_category_weight = p.FloatField()  # e.g., 0.2
    category = p.CharField()  # e.g., Transition Risk
    environment = p.IntegerField()  # 1/0
    social = p.IntegerField()  # 1/0
    government = p.IntegerField()  # 1/0
    timestamp = p.DateField(formats=['%Y/%m/%d, %H:%M:%S'])

# Creating the table in the SQLite database
database.create_tables([CusMetrics])