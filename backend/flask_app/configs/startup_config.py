import os
from enum import Enum

from pydantic import BaseModel

from flask_app.libs.db.db_config import DBConfig
from flask_app.libs.mailer.mailer_config import MailConfig
from flask_app.libs.jwtmanager.jwt_config import JWTConfig

class DeployEnv(str, Enum):
    DEV = "dev"


class StartupConfig(BaseModel):
    db: DBConfig
    mail: MailConfig
    jwt: JWTConfig

def load_startup_config() -> StartupConfig:
    # 从环境变量获取当前部署环境，如果没有环境变量就使用DEV环境
    deploy_env = DeployEnv(os.environ.get("env", DeployEnv.DEV.value))
    config_name = f"{deploy_env.value}.json"
    # 配置文件和当前文件在同一目录，获取当前目录
    config_dir = os.path.dirname(__file__)
    # 加载对应环境的配置
    config_path = os.path.join(config_dir, config_name)
    # 将配置文件解析到StartupConfig类上面
    with open(config_path, "r") as config_file:
        return StartupConfig.parse_raw(config_file.read())


config: StartupConfig = load_startup_config()