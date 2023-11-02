# -*- coding: utf-8 -*-
"""
Created on Tue Oct  3 21:20:53 2023

@author: Samyz

Modified by Xiangeng Zhao on Mon Oct 30
"""
import pandas as pd
import random
import datetime
import numpy as np
import sys
import os

def generate_csv_data(top_companies_count=5000,mid_companies_count=5000,bottom_companies_count=5000):
    #esg_df = create_esg_df()
    # generated_dataset_list = generate_data(top_companies_count, 
    #                                        mid_companies_count, 
    #                                        bottom_companies_count)
    all_companies_count = {"top": top_companies_count, 
                           "mid": mid_companies_count, 
                           "bottom": bottom_companies_count}
    all_generated_data = []
    for company_tier, count in all_companies_count.items():        
        for company_number in range(1, count + 1):
            # generated_company_data is list of dictionaries, 
            # where each dictionary represents a single datapoint
            all_generated_data.append(generate_company_data(company_number, company_tier = company_tier))
    # Reformating all_generated_data from a list of lists of dictionary datapoints
    # to a list of just the dictionary datapoints
    all_generated_data_flattened = [item for sublist in all_generated_data for item in sublist]
    esg_df = create_dataframe_from_data(all_generated_data_flattened)
    export_dataframe_to_csv(esg_df)

def generate_esg_frameworks():
    # Indicators for each framework can fall under E S or G
    TCFD_INDICATORS = {"Increased pricing of GHG emissions":"E", 
                       "Enhanced emissions-reporting obligations":"E",
                       "Costs to transition to lower emissions technology":"EG",
                       "Uncertainty in market signals":"S",
                       "Increased stakeholder concern or negative stakeholder feedback":"SG",
                       "Increased severity of extreme weather events such as cyclones and floods":"E",
                       "Rising mean temperatures":"E"
                       }
    TNFD_INDICATORS = {
        "Proportion and total annual revenue exposed to transition risks": "S",
        "Proportion and value of assets exposed to transition risks.": "S",
        "Proportion and value of assets exposed to risks due to technological changes.": "E",
        "Proportion and total annual revenue affected by negative stakeholder feedback.": "S",
        "Proportion and total annual revenue exposed to acute physical risks.": "E",
        "Proportion and value of assets exposed to chronic physical risks.": "E",
        "Proportion and value of assets exposed to risks of ecosystem collapse.": "E",
        "Cumulative risk exposure due to aggregated minor risk events.": "G",
        "Proportion and value of assets exposed to contagion risks.": "G"
    }

    APRA_CPG_229_INDICATORS = {
        "Policy changes": "SG",
        "Technological innovation": "G",
        "Social adaptation": "S",
        "Changing climate conditions": "E",
        "Extreme weather events": "E",
        "Stakeholder litigation risks": "SG",
        "Regulatory enforcement risks": "G"
    }

    # The first 4 indicators in Ming's document were clipped short at
    # valunerable to, so I guessed that they were vulnerable to transition risks
    IFRS_INDICATORS = {
        "The amount and percentage of assets or business activities vulnerable to Regulatory": "G",
        "The amount and percentage of assets or business activities vulnerable to Technological": "G",
        "The amount and percentage of assets or business activities vulnerable to Market": "G",
        "The amount and percentage of assets or business activities vulnerable to legal or reputational risks": "G",
        "The amount and percentage of assets or business activities vulnerable to acute physical risks": "E",
        "The amount and percentage of assets or business activities vulnerable to chronic physical risks": "E",
        "Internal carbon price risks": "G",
        "Remuneration risks": "G"
    }

    ESG_FRAMEWORKS_DICT = {"TCFD":TCFD_INDICATORS, "TNFD": TNFD_INDICATORS, 
                           "APRA_CPG_229":APRA_CPG_229_INDICATORS, 
                           "IFRS":IFRS_INDICATORS}
    return ESG_FRAMEWORKS_DICT

def create_esg_df():
    esg_df = pd.DataFrame(columns = get_dataset_columns())
    return esg_df

def get_dataset_columns():
    # dataset_columns = {'company_name': [],'framework': [],'indicator_name': [],
    #            'indicator_value' : [], 'sasb_materiality': [], 'region': [], 'sector': [], 
    #            'environment': [],'social': [],'governance': [],'timestamp': []}
    dataset_columns = ['company_name', 'framework', 'indicator_name',
               'indicator_value', 'sasb_materiality', 'region', 'sector', 
               'environment', 'social', 'governance', 'timestamp','data_source']
    return dataset_columns 

"""
Fastest way to append generated data appears to be create data in a dictionary 
and then append to a list
https://stackoverflow.com/questions/57000903/what-is-the-fastest-and-most-efficient-way-to-append-rows-to-a-dataframe
"""

def generate_data(top_companies_count, mid_companies_count, bottom_companies_count):
    generated_dataset_list = []
    for company_number in range(top_companies_count):
        generated_dataset_list.append(generate_company_data(company_number,
                                                            company_tier = "top"))
    for company_number in range(mid_companies_count):
        generated_dataset_list.append(generate_company_data(company_number,
                                                            company_tier = "mid"))
    for company_number in range(bottom_companies_count):
        generated_dataset_list.append(generate_company_data(company_number, 
                                                            company_tier = "bottom"))    
    return generated_dataset_list

"""

Returns a list of dictionaries, where each dictionary represents a single datapoint
"""
def generate_company_data(company_number, company_tier):
    esg_frameworks_dict = generate_esg_frameworks()
    company_info_dict = generate_company_info(company_number, company_tier)
    complete_company_dataset_list = []
    for framework in company_info_dict['frameworks']:
        framework_indicators = esg_frameworks_dict[framework]
        # Populating the data
        company_framework_data_list = generate_company_framework_data(
            company_info_dict, framework, framework_indicators)
        # Using addition rather than append here because I want to have 
        # the elements from both lists in a single list, rather than appending 
        # a list to a list and have a list of framework lists.
        complete_company_dataset_list = complete_company_dataset_list + company_framework_data_list
    # The complete_company_dataset_list here is just a list of dictionaries, 
    # where each dictionary represents a single datapoint.
    return complete_company_dataset_list

def generate_company_info(company_number, company_tier):
    company_info_dict = {}
    company_info_dict['modifier'] = get_value_modifier(company_tier)
    esg_frameworks_dict = generate_esg_frameworks()
    # esg_frameworks_list used so that one company doesn't use the same framework twice
    esg_frameworks_list = list(esg_frameworks_dict)
    company_info_dict["frameworks"] = random_items_with_large_count_penalty(esg_frameworks_list)
    company_info_dict["company_name"] = (company_tier[0].upper() + company_tier[1:] 
                                         + " Company " + str(company_number) 
                                         + " - " 
                                         + " ".join(company_info_dict["frameworks"]))
    company_info_dict["region"] = get_random_region()
    company_info_dict["sector"] = get_random_sector()
    return company_info_dict

def get_value_modifier(company_tier):
    value_modifier_values_dict = {"top":0.25,"mid":0.5,"bottom":0.75}
    return value_modifier_values_dict[company_tier]
    
def get_random_region():
    regions = ["Australia", "New Zealand", "China", "US", "Japan"]    
    #return random_items_with_large_count_penalty(regions)
    return ",".join(random_items_with_large_count_penalty(regions))

def get_random_sector():
    sectors = ["Agriculture","Manufacturing","Energy","Health","Legal",
               "Retail","Hospitality","Construction","Mining","Education"]
    #return random_items_with_large_count_penalty(sectors)
    return ",".join(random_items_with_large_count_penalty(sectors))

#### FIX ABOVE


def random_items_with_large_count_penalty(input_list):
    # Randomly selecting how many items will be used with decreasing probability 
    # of larger numbers (in a somewhat overly complicated way).
    # Effectively, I just wanted a decreasing probability of selecting a larger 
    # number of regions.
    number_of_items = random.choices([i for i in range(1,len(input_list)+1)],
                                          weights = [i for i in range(
                                              len(input_list),0,-1)],
                                          k = 1)[0]
    return random.sample(input_list, k = number_of_items)

def generate_company_framework_data(company_info_dict, framework, 
                                    framework_indicators):
    timestamp = get_random_time_stamp()
    company_framework_dataset_list = []
    for indicator, pillars in framework_indicators.items():
        company_datapoint = {'company_name': company_info_dict['company_name'],
                             'framework': framework,
                             'indicator_name': indicator,
                             'indicator_value': get_indicator_value_from_distribution(
                                 company_info_dict['modifier']),
                             'sasb_materiality': random.choice([1,0]),
                             'region': company_info_dict['region'],
                             'sector': company_info_dict['sector'],
                             'environment': 1 if "E" in pillars else 0,
                             'social': 1 if "S" in pillars else 0,
                             'governance': 1 if "G" in pillars else 0,
                             'timestamp': timestamp,
                             'data_source': "Synthetic data for " + company_info_dict['company_name']}
        company_framework_dataset_list.append(company_datapoint)    
    return company_framework_dataset_list

def get_random_time_stamp():
    time_stamps = [datetime.datetime(int("20" + str(monthday).zfill(2)), monthday, monthday).strftime("%Y/%m/%d, %H:%M:%S") 
                   for monthday in range(1,13)]
    return random.choice(time_stamps)

def get_indicator_value_from_distribution(modifier):
    indicator_value = np.random.normal(modifier,0.15)
    if indicator_value > 1.0:
        indicator_value = 1.0
    elif indicator_value < 0.0:
        indicator_value = 0.0
    return indicator_value

def create_dataframe_from_data(data):
    """

    Parameters
    ----------
    data : List of dictionaries
        Dictionaries represent datapoints in the dataset 
    esg_df : TYPE
        DESCRIPTION.

    Returns
    -------
    esg_df

    """
    esg_df = pd.DataFrame.from_dict(data)
    return esg_df


def export_dataframe_to_csv(esg_df):
    current_directory = os.path.dirname(os.path.realpath(__file__))
    file_path = os.path.join(current_directory, 'synthetic_esg_data.csv')
    esg_df.to_csv(file_path, index=False)

    
if __name__ == "__main__":
    top_companies_count = int(input("Enter number of top companies:"))
    mid_companies_count = int(input("Enter number of mid companies:"))
    bottom_companies_count = int(input("Enter number of bottom companies:"))
    generate_csv_data(top_companies_count,
                      mid_companies_count,
                      bottom_companies_count)
