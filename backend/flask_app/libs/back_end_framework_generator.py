#import pandas as pd
import random
import json
import os

# NOTE: If this class is called from 
class FrameworkGenerator:
    def __init__(self):
        self.locate_directories()
        # Structure of Frameworks:
        # Dictionary of the Metric category, 
        # where each metric category is a dictionary of actual metrics 
        # and each actual metric is a dictionary of indicators used for the metric, category and pillar calculation.
        self.frameworks_dict = {"TCFD":{"Transition Risk": 
                     {"Policy and Legal":
                      {"Increased pricing of GHG emissions":{}, 
                       "Enhanced emissions-reporting obligations":{}},
                       "Technology":
                       {"Costs to transition to lower emissions technology":{}},
                       "Market":
                       {"Uncertainty in market signals":{}},
                       "Reputation":
                       {"Increased stakeholder concern or negative stakeholder feedback":{}}
                       },
                     "Physical Risk":
                     {"Acute":
                      {"Increased severity of extreme weather events such as cyclones and floods":{}},
                      "Chronic":
                      {"Rising mean temperatures":{}}}}}
        self.add_weights_to_framework()
        print("Framework dictionary created")
        self.create_json_from_framework_dict()

    def locate_directories(self):
        self.backend_dir = os.path.abspath(os.path.dirname(__file__))
        while self.backend_dir[-7:] != "backend":
            self.backend_dir = os.path.abspath(os.path.join(self.backend_dir, '..'))
        self.configs_dir = os.path.join(self.backend_dir,"flask_app","configs")
        self.frameworks_dir = os.path.join(self.configs_dir,"frameworks")
        if not os.path.exists(self.frameworks_dir):
            os.mkdir(self.frameworks_dir)
        return


    def add_weights_to_framework(self):
        # Assigning random weights 
        # I have made it so that on average the weights for framework, 
        # metric category and metric all on average would sum to 100.
        # Note that the __weight__ value in a child dictionary corresponds to the weight 
        # of the parent dictionary key. 
        # I.e. metrics_in_category_dict["__weight__"] is equivalent to the 
        # weight for the parent category.
        for framework, metric_catergories_dict in self.frameworks_dict.items():
            number_of_categories = len(metric_catergories_dict)
            for metric_category, metrics_in_category_dict in metric_catergories_dict.items():
                if metric_category != "__weight__":
                    metrics_in_category_dict["__weight__"] = int(
                        random.randint(0,100)/
                        number_of_categories)
                    number_of_metrics_in_category = len(metrics_in_category_dict)
                    for metric_in_category, indicators_in_metric_dict in metrics_in_category_dict.items():
                        if metric_in_category != "__weight__":
                            indicators_in_metric_dict["__weight__"] = int(
                                random.randint(0,100)/
                                number_of_metrics_in_category)
                            number_of_indicators_in_metric = len(indicators_in_metric_dict)
                            for indicator_name, indicator_dict in indicators_in_metric_dict.items():
                                if indicator_name != "__weight__":
                                    indicator_dict["__weight__"] = int(
                                    random.randint(0,100)/
                                        number_of_indicators_in_metric)
        return
    
    def create_json_from_framework_dict(self, frameworks_dir = False):
        for framework, metric_catergories_dict in self.frameworks_dict.items():
            if frameworks_dir:
                json_framework_path = os.path.join(frameworks_dir,f"{framework}.json")    
            else:
                json_framework_path = os.path.join(self.frameworks_dir,f"{framework}.json")
            if os.path.isfile(json_framework_path):
                creation_approved = input(f"{framework}.json already exists. Type 'yes' to overwrite or 'no' if not.")
            else:
                creation_approved = "yes"
            if creation_approved.lower() == "yes":
                with open(json_framework_path, "w") as json_framework_file:
                    json.dump(metric_catergories_dict, json_framework_file, indent = 4)
        return








if __name__ == "__main__":
    framework_generator = FrameworkGenerator()
    framework_generator.create_json_from_framework_dict()



