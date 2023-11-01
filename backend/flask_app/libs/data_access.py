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





