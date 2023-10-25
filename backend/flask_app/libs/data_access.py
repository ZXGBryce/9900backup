from typing import Optional

from peewee import Database
import pandas as pd
import json
from flask_app.models.user import AuthUserTab
from flask_app.models.dataset import DataSetTab


class DataAccess:
    def __init__(self, db: Database):
        self.db = db
        locate_directories(self)

    def locate_directories(self):
        self.backend_dir = os.path.abspath(os.path.dirname(__file__))
        while self.backend_dir[-7:] != "backend":
            self.backend_dir = os.path.abspath(os.path.join(self.backend_dir, '..'))
        self.configs_dir = os.path.join(self.backend_dir,"flask_app","configs")


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

    def set_user_jwt_version(self, username: str, jwt_token: str) -> Optional[int]:
        """ 为用户设置 JWT """
        user = self.get_user_by_username(username)
        return user.jwt_version if user else None

    def increment_jwt_version(self, user: AuthUserTab):
        """ 更新版本号 """
        user.jwt_version += 1
        user.save()

    def getdatasetvalue(self, entities: list, indicators: list, framework: str, sasb: str, region: list, sector: list, environment: str, social: str, governance: str):
        """ gets all the filters"""
        company_name_filter = entities
        indicators_filter = indicators
        framework_filter = framework
        sasb_filter = sasb
        region_filter = region
        sector_filter = sector
        environment_filter = environment
        social_filter = social
        governance_filter = governance
        query = DataSetTab.select()
        #filter out those column selected 筛选掉有项的
        if company_name_filter:
            query = query.where(DataSetTab.company_name << company_name_filter)
        if indicators_filter:
            query = query.where(DataSetTab.indicator_name << indicators_filter)
        if framework_filter != "None":
             query = query.where(DataSetTab.framework == framework_filter)
        if sasb_filter != 'None':
            if sasb_filter == 'Yes':
                query = query.where(DataSetTab.sasb_materiality == 'Yes')
            else:
                query = query.where(DataSetTab.sasb_materiality == 'No')
        if region_filter:
            query = query.where(DataSetTab.region << region_filter)
        if sector_filter:
            query = query.where(DataSetTab.sector << sector_filter)
        if environment_filter != 'None':
            if environment_filter == 'True':
                query = query.where(DataSetTab.environment == True)
            elif environment_filter == 'False':
                query = query.where(DataSetTab.environment == False)
        if social_filter != 'None':
            if social_filter == 'True':
                query = query.where(DataSetTab.social == True)
            elif social_filter == 'False':
                query = query.where(DataSetTab.social == False)
        if governance_filter != 'None':
            if governance_filter == 'True':
                query = query.where(DataSetTab.governance == True)
            elif governance_filter == 'False':
                query = query.where(DataSetTab.governance == False)
        # 将查询结果转换为list change query into list
        results = list(query)
        data = [
            {
                'company_name': row.company_name,
                'indicator_name': row.indicator_name,
                'indicator_value': row.indicator_value,
                'sasb_materiality': row.sasb_materiality,
                'region': row.region,
                'sector': row.sector,
                'environment': row.environment,
                'social': row.social,
                'governance': row.governance,
                'timestamp': row.timestamp,
                'data_source': row.data_source,
            }
            for row in results
        ]
        # 返回list return list
        return data

    # Note scores calculators include calculators for metrics, metric categories and overall framework
    def get_score_calculators(self, framework_list, frameworks_dir = False):
        for framework in framework_list:
            if frameworks_dir:
                json_framework_path = os.path.join(frameworks_dir,f"{framework}.json")    
            else:
                json_framework_path = os.path.join(self.configs_dir,f"{framework}.json")
            with open(json_framework_path, "r") as json_framework_file:
                framework_calculations_dict = json.load(json_framework_file)
        return framework_calculations_dict
    
    def update_framework

    