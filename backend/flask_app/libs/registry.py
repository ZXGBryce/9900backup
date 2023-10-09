from flask_app.libs.data_access import DataAccess


class DependencyRegistry:
    data_access: DataAccess

    @classmethod
    def init(cls, da: DataAccess):
        cls.data_access = da