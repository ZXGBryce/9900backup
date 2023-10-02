最外层文件夹名为xxx-xxx的形式，用dash分割 里面写一个同名的，所有业务代码都写在这 但是dash替换成underline

app.py 项目入口文件 写在根目录。 项目结构

app.py：项目入口文件，位于根目录。

flask-example：项目目录

flask_example：包目录（PEP517 PEP518）

libs：第三方中间件目录，包括各种依赖项，例如数据库连接的初始化和 Redis 连接

db：数据库连接的初始化模块
configs：配置文件目录，包含配置文件的结构定义和实际配置文件

models：定义数据模型，也就是数据库表的结构

server：服务器相关目录

api：HTTP 接口实现目录，每个文件对应一个 API 实现，每个文件暴露一个 blueprint

middlewares：中间件实现目录，比如鉴权中间件

前置知识：

pydantic是什么
typehint
装饰器
写接口流程

打开server/api文件夹，看要写的接口的分类，选择对应的文件，比如auth.py
确定请求的结构和响应的结构
模仿sign_up函数定义新的请求处理函数
编写请求处理函数逻辑
判断用不用访问数据库，如果需要就在libs/data_access.py中加方法，模仿get_user_by_username写。
