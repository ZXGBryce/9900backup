import os.path

from peewee import SqliteDatabase

from flask_app.configs.startup_config import config
from settings import PROJECT_DIR

# Start up a database object
database = SqliteDatabase(os.path.join(PROJECT_DIR, config.db.db_name))