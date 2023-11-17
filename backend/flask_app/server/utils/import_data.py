import pandas as pd
from flask_app.models.dataset import DataSetTab
from flask_app.models.metrics import RiskIndicator
from flask_app.models.customised_metrics import CusMetrics
from flask_app.libs.db.db import database

"""
Back-end stuff can via this code directly replce dataset csv file 
and metrics csv file to database system

The DataSetTab csv file is backend/synthetic_esg_data_v2.csv
The RiskIndicator csv file is backend/Metrics_weights_modified_v2.csv

Note: the path of csv file should be absolute path
"""

def import_csv_to_model(csv_file_path, model_class):
    with database.atomic():
        df = pd.read_csv(csv_file_path, encoding='utf-8')
        for index, row in df.iterrows():
            model_class.create(**row.to_dict())

def delete_existing_data(model_class):
    model_class.delete().execute()

if __name__ == "__main__":

    csv_path = input("Enter the path to your CSV file: ")
    model_choice = input("Enter the model name (DataSetTab or RiskIndicator): ")

    if model_choice == "DataSetTab":
        delete_existing_data(DataSetTab)
        import_csv_to_model(csv_path, DataSetTab)
    elif model_choice == "RiskIndicator":
        delete_existing_data(RiskIndicator)
        import_csv_to_model(csv_path, RiskIndicator)
    else:
        print("Invalid model choice.")



