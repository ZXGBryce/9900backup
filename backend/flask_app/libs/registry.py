from flask import Flask

from flask_app.libs.data_access import DataAccess
from flask_mail import Mail
from flask_app.libs.mailer.mailer import Mailer
from flask_app.libs.jwtmanager.jwt_manager import JWTManager
from flask_app.configs.startup_config import config


class DependencyRegistry:
    data_access: DataAccess
    mail: Mailer
    jwt_manager: JWTManager


    @classmethod
    def init(cls, da: DataAccess):
        """ 初始化 数据库 """
        cls.data_access = da

    @classmethod
    def init_mail(cls, app: Flask, mail_config: dict):
        """ 配置 Flask 邮箱服务器。 """
        for key, value in mail_config.items():
            app.config[key] = value

        mail = Mail(app)
        cls.mail = Mailer(mail)

    @classmethod
    def init_jwt_manager(cls):
        """ 初始化 JWT Manager """
        cls.jwt_manager = JWTManager(secret_key=config.jwt.SECRET_KEY)