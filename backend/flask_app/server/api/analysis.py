from flask import Blueprint, Request, jsonify, make_response, request
from pydantic import BaseModel
import time

from typing import Dict
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

    # 根据 request 的 company list 和 framework_name 来调取 datasettab 和 RiskIndicator 两个表的数据
    dataset_records = DataSetTab.select().where(
        (DataSetTab.framework == framework_name) &
        (DataSetTab.company_name.in_(framework_request.company_list)) & (DataSetTab.timestamp == "2019/01/01")
    )

    risk_indicator_records = RiskIndicator.select().where(
        RiskIndicator.framework == framework_name
    )

    # 创建一个方便查询的RiskIndicator字典
    risk_indicator_dict = {ri.indicator_name: ri for ri in risk_indicator_records}

    # 开始构建 FrameworkDataResponse 结构
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

"""
class YearlyScores(BaseModel):
    total: float
    scores: Dict[str, float]

class CalculationResponse(BaseModel):
    ESGscore: Dict[str, Dict[int, YearlyScores]]
"""

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
        selectframework = frameworkname
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

    """
    Todo 按照计算公式 category_score = (indicator1_value * indicator1_weight + indicator2_value * indicator2_weight + ...) * subcategory1_weight + ...  （indicators都是属于对应subcategory中的， subcategorys都是属于 category中的）
    根据 DataSetTab 和 RiskIndicator 两张表中的信息计算selectframework下所有公司的category score 和 total score， total_score = category1 score + category2 score + ... 然后根据这些公司的数量求取每个category score 的平均值 和 total score的平均值
    """

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



    yearly_company_ave_score = {}
    category_avg_scores_based_on_select_company = {}
    """
    TODO
    根据 ESG_scores 里面的数据 分别计算 yearly_company_ave_score 和 category_avg_scores_based_on_select_company。 
    yearly_company_ave_score 的结构为 key是 ESG_scores 中 的 companies， value 是 5个年份 'total' 的平均值 和 'scores' 里面的 每个 category 的平均值
    category_avg_scores_based_on_select_company是根据 已经计算完的 yearly_company_ave_score 中的数据，以yearly_company_ave_score 中的 'total' 和 每个 category
    为 key， 以 yearly_company_ave_score 中的company为基础计算平均值。
    """

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

    return Response(data=responsedata, code=Code.OK)


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

    # 根据 framework 从 CusMetrics 表中抓取数据
    metrics_records = CusMetrics.select().where((CusMetrics.framework == framework) & (CusMetrics.timestamp == "2019/01/01"))

    # 开始构建 FrameworkDataResponse 结构
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

    # 查询与deleted_framework匹配的所有行
    query = CusMetrics.delete().where(CusMetrics.framework == deleted_framework)

    # 执行删除操作
    deleted_count = query.execute()

    return Response(code=Code.OK)






data =  {
        "__root__": {
            "TNFD": {
                "Bottom Company 4 - TCFD TNFD": {
                    "Physical Risk": {
                        "Acute risks": {
                            "indicators": {
                                "Proportion and total annual revenue exposed to acute physical risks.": {
                                    "environment": 1,
                                    "government": 0,
                                    "indicator_weight": "1.0",
                                    "social": 0,
                                    "value": "0.544547601938282"
                                },
                                "Human resource risks": {
                                    "environment": 0,
                                    "government": 0,
                                    "indicator_weight": "4.0",
                                    "social": 1,
                                    "value": "0.33333333333"
                                }
                            },
                            "sub_category_weight": 0.1
                        },
                        "Chronic risks": {
                            "indicators": {
                                "Proportion and value of assets exposed to chronic physical risks.": {
                                    "environment": 1,
                                    "government": 0,
                                    "indicator_weight": "2.0",
                                    "social": 0,
                                    "value": "0.5812935650972728"
                                }
                            },
                            "sub_category_weight": 0.1
                        }
                    },
                    "Systemic Risk": {
                        "Aggregated": {
                            "indicators": {
                                "Cumulative risk exposure due to aggregated minor risk events.": {
                                    "environment": 0,
                                    "government": 1,
                                    "indicator_weight": "8.0",
                                    "social": 0,
                                    "value": "0.6853257460170412"
                                }
                            },
                            "sub_category_weight": 0.0
                        },
                        "Contagion": {
                            "indicators": {
                                "Proportion and value of assets exposed to contagion risks.": {
                                    "environment": 0,
                                    "government": 1,
                                    "indicator_weight": "7.0",
                                    "social": 0,
                                    "value": "0.6849899998937572"
                                }
                            },
                            "sub_category_weight": 0.1
                        },
                        "Ecosystem collapse": {
                            "indicators": {
                                "Proportion and value of assets exposed to risks of ecosystem collapse.": {
                                    "environment": 1,
                                    "government": 0,
                                    "indicator_weight": "10.0",
                                    "social": 0,
                                    "value": "0.6544391816766114"
                                }
                            },
                            "sub_category_weight": 0.3
                        }
                    },
                    "Transition Risk": {
                        "Market": {
                            "indicators": {
                                "Proportion and value of assets exposed to transition risks.": {
                                    "environment": 0,
                                    "government": 0,
                                    "indicator_weight": "4.0",
                                    "social": 1,
                                    "value": "0.709833434977886"
                                }
                            },
                            "sub_category_weight": 0.1
                        },
                        "Policy and Legal": {
                            "indicators": {
                                "Proportion and total annual revenue exposed to transition risks": {
                                    "environment": 0,
                                    "government": 0,
                                    "indicator_weight": "6.0",
                                    "social": 1,
                                    "value": "0.8366483476200739"
                                }
                            },
                            "sub_category_weight": 0.1
                        },
                        "Reputation": {
                            "indicators": {
                                "Proportion and total annual revenue affected by negative stakeholder feedback.": {
                                    "environment": 0,
                                    "government": 0,
                                    "indicator_weight": "10.0",
                                    "social": 1,
                                    "value": "0.6635615142276361"
                                }
                            },
                            "sub_category_weight": 0.0
                        },
                        "Technology": {
                            "indicators": {
                                "Proportion and value of assets exposed to risks due to technological changes.": {
                                    "environment": 1,
                                    "government": 0,
                                    "indicator_weight": "3.0",
                                    "social": 0,
                                    "value": "0.5623203263097458"
                                }
                            },
                            "sub_category_weight": 0.2
                        }
                    }
                },
                "Top Company 1 - TNFD": {
                    "Physical Risk": {
                        "Acute risks": {
                            "indicators": {
                                "Proportion and total annual revenue exposed to acute physical risks.": {
                                    "environment": 1,
                                    "government": 0,
                                    "indicator_weight": "1.0",
                                    "social": 0,
                                    "value": "0.2103107754631726"
                                },
                                "Human resource risks": {
                                    "environment": 0,
                                    "government": 0,
                                    "indicator_weight": "4.0",
                                    "social": 1,
                                    "value": "0.4444444444444"
                                }
                            },
                            "sub_category_weight": 0.1
                        },
                        "Chronic risks": {
                            "indicators": {
                                "Proportion and value of assets exposed to chronic physical risks.": {
                                    "environment": 1,
                                    "government": 0,
                                    "indicator_weight": "2.0",
                                    "social": 0,
                                    "value": "0.1484490699689178"
                                }
                            },
                            "sub_category_weight": 0.1
                        }
                    },
                    "Systemic Risk": {
                        "Aggregated": {
                            "indicators": {
                                "Cumulative risk exposure due to aggregated minor risk events.": {
                                    "environment": 0,
                                    "government": 1,
                                    "indicator_weight": "8.0",
                                    "social": 0,
                                    "value": "0.2439753427860904"
                                }
                            },
                            "sub_category_weight": 0.0
                        },
                        "Contagion": {
                            "indicators": {
                                "Proportion and value of assets exposed to contagion risks.": {
                                    "environment": 0,
                                    "government": 1,
                                    "indicator_weight": "7.0",
                                    "social": 0,
                                    "value": "0.3958716149394791"
                                }
                            },
                            "sub_category_weight": 0.1
                        },
                        "Ecosystem collapse": {
                            "indicators": {
                                "Proportion and value of assets exposed to risks of ecosystem collapse.": {
                                    "environment": 1,
                                    "government": 0,
                                    "indicator_weight": "10.0",
                                    "social": 0,
                                    "value": "0.5418808646252072"
                                }
                            },
                            "sub_category_weight": 0.3
                        }
                    },
                    "Transition Risk": {
                        "Market": {
                            "indicators": {
                                "Proportion and value of assets exposed to transition risks.": {
                                    "environment": 0,
                                    "government": 0,
                                    "indicator_weight": "4.0",
                                    "social": 1,
                                    "value": "0.3968519940590321"
                                }
                            },
                            "sub_category_weight": 0.1
                        },
                        "Policy and Legal": {
                            "indicators": {
                                "Proportion and total annual revenue exposed to transition risks": {
                                    "environment": 0,
                                    "government": 0,
                                    "indicator_weight": "6.0",
                                    "social": 1,
                                    "value": "0.0866992080799793"
                                }
                            },
                            "sub_category_weight": 0.1
                        },
                        "Reputation": {
                            "indicators": {
                                "Proportion and total annual revenue affected by negative stakeholder feedback.": {
                                    "environment": 0,
                                    "government": 0,
                                    "indicator_weight": "10.0",
                                    "social": 1,
                                    "value": "0.1518775633653525"
                                }
                            },
                            "sub_category_weight": 0.0
                        },
                        "Technology": {
                            "indicators": {
                                "Proportion and value of assets exposed to risks due to technological changes.": {
                                    "environment": 1,
                                    "government": 0,
                                    "indicator_weight": "3.0",
                                    "social": 0,
                                    "value": "0.0"
                                }
                            },
                            "sub_category_weight": 0.2
                        }
                    }
                }
            }
        }
    }




"""
metrics = {
    "framework1": {
        "company_name_1": {
            "category_1": {
                "sub_category_1": {
                    "indicators": {
                        "Policy changes": {
                            "value": "0.45231",
                            "indicator_weight": "15",
                            "environment": 1,
                            "social": 0,
                            "government": 0
                        },
                        "Technological innovation": {
                            "value": "0.234566",
                            "indicator_weight": "5",
                            "environment": 0,
                            "social": 1,
                            "government": 0
                        }
                    },
                    "sub_category_weight": 0.1
                },
                "sub_category_2": {
                    "indicators": {
                        "Stakeholder litigation risks": {
                            "value": "0.1245",
                            "indicator_weight": "35",
                            "environment": 0,
                            "social": 1,
                            "government": 0
                        }
                    },
                    "sub_category_weight": 0.2
                }
            },
            "category_2": {
                "sub_category_3": {
                    "indicators": {
                        "Regulatory enforcement risks": {
                            "value": "0.46125",
                            "indicator_weight": "12",
                            "environment": 0,
                            "social": 1,
                            "government": 0
                        }
                    },
                    "sub_category_weight": 0.1
                }
            }
        },
        "company_name_2": {
            "category_1": {
                "sub_category_1": {
                    "indicators": {
                        "Policy changes": {
                            "value": "0.253231",
                            "indicator_weight": "23",
                            "environment": 1,
                            "social": 0,
                            "government": 0
                        },
                        "Technological innovation": {
                            "value": "0.64366",
                            "indicator_weight": "6",
                            "environment": 0,
                            "social": 1,
                            "government": 0
                        }
                    },
                    "sub_category_weight": 0.2
                },
                "sub_category_2": {
                    "indicators": {
                        "Stakeholder litigation risks": {
                            "value": "0.5136",
                            "indicator_weight": "45",
                            "environment": 0,
                            "social": 1,
                            "government": 0
                        }
                    },
                    "sub_category_weight": 0.1
                }
            },
            "category_2": {
                "sub_category_3": {
                    "indicators": {
                        "Regulatory enforcement risks": {
                            "value": "0.73434",
                            "indicator_weight": "18",
                            "environment": 0,
                            "social": 1,
                            "government": 0
                        }
                    },
                    "sub_category_weight": 0.2
                }
            }
        }
    }
}
"""
"""
try:
    parsed_response = FrameworkDataResponse.parse_obj(metrics)
    print("The structure is valid!")
except Exception as e:
    print(f"Invalid structure: {e}")
"""


"""
company_list = [{
            "name": "Top Company 1 - APRA_CPG_229 TNFD",
            "region": "Japan,New Zealand,China",
            "sector": "Education"
        },
        {
            "name": "Top Company 2 - TCFD",
            "region": "New Zealand",
            "sector": "Health"
        },
        {
            "name": "Top Company 3 - TCFD",
            "region": "New Zealand,China",
            "sector": "Health,Energy,Hospitality,Legal,Agriculture"
        },
        {
            "name": "Top Company 4 - TNFD IFRS",
            "region": "US",
            "sector": "Agriculture"
        },
        {
            "name": "Top Company 5 - IFRS TNFD TCFD",
            "region": "Australia",
            "sector": "Mining"
        }
]
"""