最外层文件夹名为xxx-xxx的形式，用dash分割
里面写一个同名的，所有业务代码都写在这 但是dash替换成underline

app.py 项目入口文件 写在根目录。
**项目结构**

- `app.py`：项目入口文件，位于根目录。

- `flask-app`：项目目录

  - `flask-app`：包目录（PEP517 PEP518）

    - `libs`：第三方中间件目录，包括各种依赖项，例如数据库连接的初始化和 Redis 连接

      - `db`：数据库连接的初始化模块

    - `configs`：配置文件目录，包含配置文件的结构定义和实际配置文件
    - `models`：定义数据模型，也就是数据库表的结构
    - `server`：服务器相关目录

      - `api`：HTTP 接口实现目录，每个文件对应一个 API 实现，每个文件暴露一个 `blueprint`

      - `middlewares`：中间件实现目录，比如鉴权中间件

**Project Structure**

- `app.py`：The project entry file, located at the root directory.

- `flask-app`：Project directory.

  - `flask-app`：Package directory (PEP517 & PEP518 compliant).

    - `libs`：Directory for third-party middleware, which includes various dependencies such as initializations for database connections and Redis connections.

      - `db`：Module for initializing database connections.
        
    - `configs`：Directory for configuration files, containing both the configuration file structure definitions and actual configuration files.
    - `models`：Defines data models, i.e., the structure of the database tables.
    - `server`：Server-related directory.

      - `api`：Directory for HTTP API implementations. Each file corresponds to an API implementation, and each file exposes a blueprint.

      - `middlewares`：Middleware implementation directory, for instance, authentication middleware.
