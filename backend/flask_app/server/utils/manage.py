from flask_app.libs.data_access import DataAccess
from flask_app.libs.db.db import database
from flask_app.server.utils.password import hash_password
from flask_app.models.user import AuthUserTab

# 初始化 DataAccess
data_access = DataAccess(database)

def create_user():
    print("Create New Account")
    username = input("Enter Username: ")
    email = input("Enter Email: ")
    password = input("Enter Password: ")  # 使用 getpass 以保护密码输入
    repeat_password = input("Confirm Password: ")
    is_adm = input("admin? (yes/no): ") # yes or no

    # 检查两次输入的密码是否匹配
    if password != repeat_password:
        print("Passwords does not match")
        return

    # 检查用户名是否已经存在
    if data_access.get_user_by_username(username):
        print("User already exists!")
        return

    # 检查电子邮件是否已经存在
    if data_access.get_user_by_email(email):
        print("Email already exists!")
        return

    hashed_password = hash_password(password)  # 使用你的 hash_password 函数来哈希密码
    newuser = data_access.create_new_user(username, hashed_password, email)
    if is_adm == "yes":
        newuser.is_admin = True
        newuser.save()

    print(f"Account {username} has been created successfully！")

if __name__ == "__main__":
    create_user()
