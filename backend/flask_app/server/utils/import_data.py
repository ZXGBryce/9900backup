import pandas as pd
from flask_app.models.dataset import DataSetTab
from flask_app.models.metrics import RiskIndicator
from flask_app.models.customised_metrics import CusMetrics
from flask_app.libs.db.db import database

"""
Back-end stuff can via this code directly upload dataset csv file 
and metrics csv file to database system
"""

def import_csv_to_model(csv_file_path, model_class):
    with database.atomic():
        df = pd.read_csv(csv_file_path, encoding='utf-8')
        for index, row in df.iterrows():
            model_class.create(**row.to_dict())

def delete_existing_data(model_class):
    model_class.delete().execute()

if __name__ == "__main__":
    """
    csv_path = input("Enter the path to your CSV file: ")
    model_choice = input("Enter the model name (DataSetTab or RiskIndicator): ")

    if model_choice == "DataSetTab":
        import_csv_to_model(csv_path, DataSetTab)
    elif model_choice == "RiskIndicator":
        import_csv_to_model(csv_path, RiskIndicator)
    else:
        print("Invalid model choice.")
    """

    # delete corresponding table data
    # delete_existing_data(CusMetrics)
    import_csv_to_model("/Users/xiangengzhao/capstone-project-9900f15aglitch/backend/Metrics_weights_modified_v2.csv", RiskIndicator)
    import_csv_to_model("/Users/xiangengzhao/9900backup/backend/synthetic_esg_data_v2.csv", DataSetTab)
