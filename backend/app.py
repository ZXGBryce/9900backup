from flask import Flask, jsonify
from flask_mail import Mail, Message

from flask_app.libs.data_access import DataAccess
from flask_app.libs.db.db import database
from flask_app.libs.registry import DependencyRegistry
from flask_app.server.api.auth import auth_blueprint
from flask_app.server.api.admin import admin_blueprint
from flask_app.server.api.analysis import analysis_blueprint
from flask_app.server.api.profile import profile_blueprint
from flask_app.configs.startup_config import config
from flask_cors import CORS
import flask_app.server.utils.import_data

# 实例化flask app
app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
CORS(app)

# 注册auth_blueprint
app.register_blueprint(auth_blueprint)
app.register_blueprint(admin_blueprint)
app.register_blueprint(analysis_blueprint)
app.register_blueprint(profile_blueprint)

# 初始化DependencyRegistry，正常这里应该是所有的依赖，比如访问数据库，访问缓存，消息队列，目前只有数据库
DependencyRegistry.init(DataAccess(database)) # 初始化数据库
DependencyRegistry.init_mail(app, config.mail.dict()) # 初始化邮件服务器
DependencyRegistry.init_jwt_manager() # 初始化JWT Manager


# 初始化结束

def run_debug_server():
    app.run(host='0.0.0.0', port=5000, debug=True)


if __name__ == '__main__':
    run_debug_server()
