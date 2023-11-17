from flask import Flask

from flask_app.libs.data_access import DataAccess
from flask_mail import Mail
from flask_app.libs.mailer.mailer import Mailer
from flask_app.libs.jwtmanager.jwt_manager import JWTManager
from flask_app.configs.startup_config import config


# Set up a dependency registry that package all the dependency in libs in this class
class DependencyRegistry:
    data_access: DataAccess
    mail: Mailer
    jwt_manager: JWTManager

    @classmethod
    def init(cls, da: DataAccess):
        """ Initialize Database """
        cls.data_access = da

    @classmethod
    def init_mail(cls, app: Flask, mail_config: dict):
        """ Configure Flask Mailer """
        for key, value in mail_config.items():
            app.config[key] = value

        mail = Mail(app)
        cls.mail = Mailer(mail)

    @classmethod
    def init_jwt_manager(cls):
        """ Initialize JWT Manager """
        cls.jwt_manager = JWTManager(secret_key=config.jwt.SECRET_KEY)