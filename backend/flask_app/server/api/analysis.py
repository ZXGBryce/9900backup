from flask import Blueprint, Request, jsonify, make_response, request
from pydantic import BaseModel
import time
from typing import Dict

from flask_app.server.utils.chatgpt import generate_description
from flask_app.server.consts.response_format import Response, Code
from flask_app.libs.registry import DependencyRegistry as dep
from flask_app.models.metrics import RiskIndicator
from flask_app.models.dataset import DataSetTab
from flask_app.models.customised_metrics import CusMetrics
from flask_app.server.utils.request_parser import handle_with_pydantic

analysis_blueprint = Blueprint('analysis', __name__, url_prefix="/analysis")


class CompanyResquest(BaseModel):
    framework: str

class CompanyResponse(BaseModel):
    company_list: list


@analysis_blueprint.post('/company')
@handle_with_pydantic(CompanyResquest)
def company(company_request: CompanyResquest) -> Response[CompanyResponse]:

    # From DataSetTab to get distinct company name list
    company_info = dep.data_access.get_company_info(company_request.framework)

    # Get username from jwt token
    jwt_token = request.headers.get('Authorization').split(' ')[1]
    payload = dep.jwt_manager.decode_token(jwt_token)
    user = dep.data_access.get_user_by_username(payload.get("username"))

    # Record the framework that user selected
    dep.data_access.update_user_framework(user,company_request.framework)

    return Response(data=CompanyResponse(company_list=company_info).dict(), code=Code.OK)


class FrameworkDataRequest(BaseModel):
    company_list: list

class Indicator(BaseModel):
    value: str
    indicator_weight: str
    environment: int
    social: int
    government: int

class SubCategory(BaseModel):
    indicators: Dict[str, Indicator]
    sub_category_weight: float

class Category(BaseModel):
    __root__: Dict[str, SubCategory]

class Company(BaseModel):
    __root__: Dict[str, Category]

class Framework(BaseModel):
    __root__: Dict[str, Company]

class FrameworkDataResponse(BaseModel):
    __root__: Dict[str, Framework]


@analysis_blueprint.post('/framework')
@handle_with_pydantic(FrameworkDataRequest)
def framework(framework_request: FrameworkDataRequest) -> Response[FrameworkDataResponse]:

    # Get username from jwt token
    jwt_token = request.headers.get('Authorization').split(' ')[1]
    payload = dep.jwt_manager.decode_token(jwt_token)
    user = dep.data_access.get_user_by_username(payload.get("username"))

    framework_name = user.current_framework

    # According to company list and framework_name of request to search the records in datasettab and riskindicator
    dataset_records = DataSetTab.select().where(
        (DataSetTab.framework == framework_name) &
        (DataSetTab.company_name.in_(framework_request.company_list)) & (DataSetTab.timestamp == "2019/01/01")
    )

    risk_indicator_records = RiskIndicator.select().where(
        RiskIndicator.framework == framework_name
    )

    # Create a RiskIndicator Dict for convenient search
    risk_indicator_dict = {ri.indicator_name: ri for ri in risk_indicator_records}

    # Construct FrameworkDataResponse structure
    metrics = {framework_name: {}}

    for record in dataset_records:
        if record.company_name not in metrics[framework_name]:
            metrics[framework_name][record.company_name] = {}

        company_data = metrics[framework_name][record.company_name]

        if record.indicator_name in risk_indicator_dict:
            risk_data = risk_indicator_dict[record.indicator_name]
            category = risk_data.category
            sub_category = risk_data.sub_category

            if category not in company_data:
                company_data[category] = {}
            if sub_category not in company_data[category]:
                company_data[category][sub_category] = {
                    "indicators": {},
                    "sub_category_weight": risk_data.sub_category_weight
                }

            company_data[category][sub_category]["indicators"][record.indicator_name] = {
                "value": str(record.indicator_value),
                "indicator_weight": str(risk_data.indicator_weight),
                "environment": record.environment,
                "social": record.social,
                "government": record.governance
            }

    return Response(data=FrameworkDataResponse(__root__=metrics).dict(), code=Code.OK)


class CalculationRequest(BaseModel):
    __root__: Dict[str, Framework]

@analysis_blueprint.post("/calculation")
@handle_with_pydantic(CalculationRequest)
def calculation(calculation_request: CalculationRequest) -> Response:
    # Get username from jwt token
    jwt_token = request.headers.get('Authorization').split(' ')[1]
    payload = dep.jwt_manager.decode_token(jwt_token)
    username = payload.get("username")

    # Get timestamp
    timestamp = int(time.time())

    selectframework = ""

    # Check for empty indicators
    for frameworkname, framework in calculation_request.__root__.items():
        if frameworkname == "APRA_CPG_229":
            parts = frameworkname.split("_")
            selectframework = "_".join(parts[:3])
        else:
            selectframework = frameworkname.split("_")[0]
        for company in framework.__root__.values():
            trigger = 0
            for category in company.__root__.values():
                for subcategory in category.__root__.values():
                    if subcategory.indicators:
                        trigger = 1
            if trigger == 0:
                return Response(code=Code.EMPTY_REQUEST, message=f"No indicators present")


    dep.data_access.store_cus_framework(calculation_request, timestamp, username)
    ESG_scores = dep.data_access.metrics_calculation(calculation_request, timestamp, username)

    # Calculate 5 years scores separately
    yearly_benchmark_ESG_score = {}
    for year in range(2019, 2024):

        # Fetching data from DataSetTab and RiskIndicator with specific timestamp
        dataset_records = DataSetTab.select().where(
            (DataSetTab.framework == selectframework) &
            (DataSetTab.timestamp == f"{year}/01/01")
        )

        # Data structures to store intermediate and final results
        company_scores = {}
        company_category_scores = {}  # Storing total scores for each category per company
        category_avg_scores = {}
        total_avg_score = 0
        # Calculate scores for each company
        for record in dataset_records:
            company_name = record.company_name

            indicator_info = RiskIndicator.get((RiskIndicator.indicator_name == record.indicator_name) & (RiskIndicator.framework == selectframework))
            category = indicator_info.category
            sub_category = indicator_info.sub_category

            # Initialize company score structure
            if company_name not in company_scores:
                company_scores[company_name] = {}
            if category not in company_scores[company_name]:
                company_scores[company_name][category] = {}

            # Calculate subcategory score
            if sub_category not in company_scores[company_name][category]:
                company_scores[company_name][category][sub_category] = 0

            indicator_weight = indicator_info.indicator_weight
            company_scores[company_name][category][sub_category] += record.indicator_value * indicator_weight

        # Calculate subcategory scores
        for company, categories in company_scores.items():
            for category, subcategories in categories.items():
                for subcategory, score in subcategories.items():
                    subcategory_weight = RiskIndicator.get((RiskIndicator.sub_category == subcategory) & (RiskIndicator.framework == selectframework)).sub_category_weight
                    subcategories[subcategory] = score * subcategory_weight

        # Calculate category scores and total score
        for company, categories in company_scores.items():
            company_category_scores[company] = {}
            for category, subcategories in categories.items():
                company_category_scores[company][category] = sum(subcategories.values())

        # Sum up category scores for total score and calculate averages
        total_score_sum = 0
        for company, categories in company_category_scores.items():
            company_total = sum(categories.values())
            total_score_sum += company_total
            for category, score in categories.items():
                category_avg_scores[category] = category_avg_scores.get(category, 0) + score

        total_avg_score = total_score_sum / len(company_scores)

        category_avg_scores = {k: v / len(company_scores) for k, v in category_avg_scores.items()}

        yearly_benchmark_ESG_score[year] = {'total': total_avg_score, 'categories': category_avg_scores}

    # Calculate the ave score base on these 5 years
    benchmark_ESG_score = {'total': 0}
    for year, scores in yearly_benchmark_ESG_score.items():
        benchmark_ESG_score['total'] += scores['total'] / 5
        for category, avg_score in scores['categories'].items():
            if category not in benchmark_ESG_score:
                benchmark_ESG_score[category] = 0
            benchmark_ESG_score[category] += avg_score / 5

    # Calculate yearly_company_ave_score
    yearly_company_ave_score = {}
    for company, years_data in ESG_scores.items():
        company_total = 0
        company_category_totals = {}
        count_years = len(years_data)

        for year, data in years_data.items():
            company_total += data['total']
            for category, score in data['scores'].items():
                if category not in company_category_totals:
                    company_category_totals[category] = 0
                company_category_totals[category] += score


        yearly_company_ave_score[company] = {
            'total': company_total / count_years,
            'scores': {category: total / count_years for category, total in company_category_totals.items()}
        }

    # Calculate category_avg_scores_based_on_select_company
    category_avg_scores_based_on_select_company = {}
    total_avg = 0
    count_companies = len(yearly_company_ave_score)

    for company, data in yearly_company_ave_score.items():
        total_avg += data['total'] / count_companies
        for category, score in data['scores'].items():
            if category not in category_avg_scores_based_on_select_company:
                category_avg_scores_based_on_select_company[category] = 0
            category_avg_scores_based_on_select_company[category] += score / count_companies

    # Adding 'total' to category_avg_scores_based_on_select_company
    category_avg_scores_based_on_select_company['total'] = total_avg

    # Populate the response data
    responsedata = {}
    responsedata['ESG_scores'] = ESG_scores
    responsedata['benchmark_ESG_score'] = benchmark_ESG_score
    responsedata['yearly_company_ave_score'] = yearly_company_ave_score
    responsedata['category_avg_scores_based_on_select_company'] = category_avg_scores_based_on_select_company

    # Generate chatgpt description
    #message = ("You have downloaded the backend code version from GitHub. Due to the security protocols for ChatGPT's API key, we are unable to upload the code containing the API key to GitHub. Therefore, the analysis report feature cannot be displayed here. If you wish to experience this functionality, please connect the frontend to the backend server on AWS as per the instructions provided.")

    message = generate_description(selectframework, responsedata)
    return Response(data=responsedata, code=Code.OK, message=message)


class HistoryResponse(BaseModel):
    cusframeworks: list


@analysis_blueprint.get("/history")
def history():
    # Get username from jwt token
    jwt_token = request.headers.get('Authorization').split(' ')[1]
    payload = dep.jwt_manager.decode_token(jwt_token)
    username = payload.get("username")

    # Fetch the relevant frameworks for the given username from the CusMetrics table
    query = CusMetrics.select(CusMetrics.framework).where(CusMetrics.framework.contains(f"_{username}_")).distinct()
    frameworks = [entry.framework for entry in query]

    return Response(data=HistoryResponse(cusframeworks=frameworks).dict(), code=Code.OK).dict()


class ResetFrameworkRequest(BaseModel):
    framework_name: str

class ResetFrameworkResponse(BaseModel):
    __root__: Dict[str, Framework]


@analysis_blueprint.post("/resetframework")
@handle_with_pydantic(ResetFrameworkRequest)
def resetframework(resetframework_request: ResetFrameworkRequest) -> Response[ResetFrameworkResponse]:
    framework = resetframework_request.framework_name

    # Get records according to framework name
    metrics_records = CusMetrics.select().where((CusMetrics.framework == framework) & (CusMetrics.timestamp == "2019/01/01"))

    # Construct Response structure
    metrics = {framework: {}}

    for record in metrics_records:
        if record.company not in metrics[framework]:
            metrics[framework][record.company] = {}

        company_data = metrics[framework][record.company]
        category = record.category
        sub_category = record.sub_category

        if category not in company_data:
            company_data[category] = {}
        if sub_category not in company_data[category]:
            company_data[category][sub_category] = {
                "indicators": {},
                "sub_category_weight": record.sub_category_weight
            }

        company_data[category][sub_category]["indicators"][record.indicator_name] = {
            "value": str(record.indicator_value),
            "indicator_weight": str(record.indicator_weight),
            "environment": record.environment,
            "social": record.social,
            "government": record.government
        }

    return Response(data=FrameworkDataResponse(__root__=metrics).dict(), code=Code.OK)

class DeleteCusFramework(BaseModel):
    deleted_framework: str


@analysis_blueprint.post("/delete_cusframework")
@handle_with_pydantic(DeleteCusFramework)
def delete_framework(DeleteCusFramework) -> Response:
    deleted_framework = DeleteCusFramework.deleted_framework

    # Search the records that match to deleted framework name
    query = CusMetrics.delete().where(CusMetrics.framework == deleted_framework)

    # Delete the corresponding records
    deleted_count = query.execute()

    return Response(code=Code.OK)


