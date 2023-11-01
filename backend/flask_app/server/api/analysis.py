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
        (DataSetTab.company_name.in_(framework_request.company_list))
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

class CategoryScores(BaseModel):
    total: float
    categories: Dict[str, float]

class CalculationResponse(BaseModel):
    ESGscore: Dict[str, CategoryScores]

@analysis_blueprint.post("/calculation")
@handle_with_pydantic(CalculationRequest)
def calculation(calculation_request: CalculationRequest) -> Response[CalculationResponse]:
    # Get username from jwt token
    jwt_token = request.headers.get('Authorization').split(' ')[1]
    payload = dep.jwt_manager.decode_token(jwt_token)
    username = payload.get("username")

    # Get timestamp
    timestamp = int(time.time())

    # Read data from CalculationRequest
    for framework_name, framework_data in calculation_request.__root__.items():
        modified_framework_name = f"{framework_name}_{username}_{timestamp}"
        for company_name, company_data in framework_data.__root__.items():
            for category_name, category_data in company_data.__root__.items():
                for sub_category_name, sub_category_data in category_data.__root__.items():
                    for indicator_name, indicator_data in sub_category_data.indicators.items():
                        CusMetrics.create(
                            framework=modified_framework_name,
                            company=company_name,
                            indicator_name=indicator_name,
                            indicator_value=float(indicator_data.value),
                            indicator_weight=float(indicator_data.indicator_weight),
                            sub_category=sub_category_name,
                            sub_category_weight=sub_category_data.sub_category_weight,
                            category=category_name,
                            environment=indicator_data.environment,
                            social=indicator_data.social,
                            government=indicator_data.government
                        )
    ESG_score = {}

    for framework_name, framework_data in calculation_request.__root__.items():
        modified_framework_name = f"{framework_name}_{username}_{timestamp}"
        for company_name, _ in framework_data.__root__.items():
            # Retrieve data from CusMetrics for the current framework and company
            records = CusMetrics.select().where(
                (CusMetrics.framework == modified_framework_name) &
                (CusMetrics.company == company_name)
            )

            score = 0.0
            category_scores = {}
            # Group by sub_category
            sub_category_data = {}

            for record in records:
                if record.sub_category not in sub_category_data:
                    sub_category_data[record.sub_category] = []
                sub_category_data[record.sub_category].append(record)

                # Calculate ESG score
                for sub_category, indicators in sub_category_data.items():
                    sub_category_total = 0.0
                    sub_category_weight = indicators[0].sub_category_weight
                    for indicator in indicators:
                        sub_category_total += indicator.indicator_value * indicator.indicator_weight
                    category_name = indicators[0].category
                    if category_name not in category_scores:
                        category_scores[category_name] = 0.0
                    category_scores[category_name] += sub_category_total * sub_category_weight
                    score += sub_category_total * sub_category_weight

                # Update the ESG_score dictionary
                ESG_score[f"{company_name}"] = {
                    "total": score,
                    "categories": category_scores
                }


    return Response(data=CalculationResponse(ESGscore=ESG_score).dict(), code=Code.OK)







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