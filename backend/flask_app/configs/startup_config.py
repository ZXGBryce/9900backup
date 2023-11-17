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

    # Retrieve the current deployment environment from environment variables; use the DEV environment if no environment variable is present.
    deploy_env = DeployEnv(os.environ.get("env", DeployEnv.DEV.value))
    config_name = f"{deploy_env.value}.json"

    # The configuration file and the current file are in the same directory; obtain the current directory.
    config_dir = os.path.dirname(__file__)

    # Load the configuration for the corresponding environment.
    config_path = os.path.join(config_dir, config_name)

    # Parse the configuration file onto the StartupConfig class.
    with open(config_path, "r") as config_file:
        return StartupConfig.parse_raw(config_file.read())


config: StartupConfig = load_startup_config()