import peewee as p
from flask_app.libs.db.db import database
from flask_app.models.base import BaseModel



class RiskIndicator(BaseModel):

    """ Table for risk indicators based on the CSV structure """
    framework = p.CharField()  # e.g., APRA_CPG_229
    indicator_name = p.CharField()  # e.g., Policy changes
    indicator_weight = p.FloatField()  # e.g., 34
    sub_category = p.CharField()  # e.g., Policy and legal
    sub_category_weight = p.FloatField()  # e.g., 0.2
    category = p.CharField()  # e.g., Transition Risk
    category_weight = p.FloatField()  # e.g., 0.2

# Creating the table in the SQLite database
database.create_tables([RiskIndicator])
