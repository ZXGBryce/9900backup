from flask import Flask

from flask_app.libs.data_access import DataAccess
from flask_app.libs.db.db import database
from flask_app.libs.registry import DependencyRegistry
from flask_app.server.api.auth import auth_blueprint

# 实例化flask app
app = Flask(__name__)
# 注册auth_blueprint
app.register_blueprint(auth_blueprint)
# 初始化DependencyRegistry，正常这里应该是所有的依赖，比如访问数据库，访问缓存，消息队列，目前只有数据库
DependencyRegistry.init(DataAccess(database))


# 初始化结束

def run_debug_server():
    app.run(debug=True)

#1111

if __name__ == '__main__':
    run_debug_server()
