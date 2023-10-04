import os.path

from peewee import SqliteDatabase

from ...configs.startup_config import config
from ....settings import PROJECT_DIR

database = SqliteDatabase(os.path.join(PROJECT_DIR, config.db.db_name))