
from flask_app.libs.data_access import DataAccess
from flask_app.libs.db.db import database
from flask_app.server.utils.password import hash_password
from flask_app.models.user import AuthUserTab

# 初始化 DataAccess
data_access = DataAccess(database)

def create_user():
    print("创建新用户")
    username = input("输入用户名: ")
    email = input("输入邮箱: ")
    password = input("输入密码: ")  # 使用 getpass 以保护密码输入
    repeat_password = input("再次输入密码: ")

    # 检查两次输入的密码是否匹配
    if password != repeat_password:
        print("密码不匹配！请重新尝试。")
        return

    # 检查用户名是否已经存在
    if data_access.get_user_by_username(username):
        print("该用户名已经存在！")
        return

    # 检查电子邮件是否已经存在
    if data_access.get_user_by_email(email):
        print("该电子邮件已经存在！")
        return

    hashed_password = hash_password(password)  # 使用你的 hash_password 函数来哈希密码
    data_access.create_new_user(username, hashed_password, email)
    print(f"用户 {username} 创建成功！")

if __name__ == "__main__":
    create_user()
