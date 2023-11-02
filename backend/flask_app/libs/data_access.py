from typing import Optional

from peewee import Database
import pandas as pd
import json
from flask_app.models.user import AuthUserTab
from flask_app.models.dataset import DataSetTab
from flask_app.models.customised_metrics import CusMetrics


class DataAccess:
    def __init__(self, db: Database):
        self.db = db
        #locate_directories(self)


    def get_user_by_username(self, username: str) -> Optional[AuthUserTab]:
        """ 检查用户名是否存在 """
        return AuthUserTab.get_or_none(
            AuthUserTab.username == username
        )

    def create_new_user(self, username: str, hashed_password: str, email: str) -> AuthUserTab:
        """ 创建新用户 """
        return AuthUserTab.create(
            username=username,
            password=hashed_password,
            email=email
        )

    def get_user_by_email(self, email: str) -> Optional[AuthUserTab]:
        """ 检查邮件是否存在 """
        return AuthUserTab.get_or_none(
            AuthUserTab.email == email
        )

    def set_user_jwt_version(self, username: str) -> Optional[int]:
        """ 为用户设置 JWT """
        user = self.get_user_by_username(username)
        return user.jwt_version if user else None

    def increment_jwt_version(self, user: AuthUserTab):
        """ 更新版本号 """
        user.jwt_version += 1
        user.save()

    def update_user_framework(self, user: AuthUserTab, framework: str):
        """ record the framework the user is using """
        user.current_framework = framework
        user.save()

    def get_company_info(self, framework_input: str) -> list:
        """ Get company details for a specific framework from dataset table """
        company_list = []

        # 查询包含给定framework的所有独特的公司名称及其对应的region和sector
        query = (DataSetTab.select(
            DataSetTab.company_name, DataSetTab.region, DataSetTab.sector
        )
                 .where(DataSetTab.framework == framework_input)
                 .distinct()
                 .tuples())

        for company_name, region, sector in query:
            company_info = {
                "name": company_name,
                "region": region,
                "sector": sector
            }
            company_list.append(company_info)

        return company_list

    def store_cus_framework(self, calculation_request, timestamp, username):

        """ Read data from CalculationRequest and store them"""

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

    def metrics_calculation(self, calculation_request, timestamp, username):

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

        return ESG_score


