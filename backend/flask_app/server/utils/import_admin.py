from flask_app.libs.data_access import DataAccess
from flask_app.libs.db.db import database
from flask_app.server.utils.password import hash_password
from flask_app.models.user import AuthUserTab
from flask_app.libs.registry import DependencyRegistry as dep

# Initialize DataAccess
data_access = DataAccess(database)



"""
This py file is for backend stuff to create an admin account
When they run this python file, they will be guided to fill in the new admin information
"""
def create_user():
    print("Create New Account")
    username = input("Enter Username: ")
    email = input("Enter Email: ")
    password = input("Enter Password: ")  # 使用 getpass 以保护密码输入
    repeat_password = input("Confirm Password: ")
    is_adm = input("admin? (yes/no): ") # yes or no

    # Check if the two input passwords is matching
    if password != repeat_password:
        print("Passwords does not match")
        return

    # Check if username already exists
    if data_access.get_user_by_username(username):
        print("User already exists!")
        return

    # Check if the email address already exists
    if data_access.get_user_by_email(email):
        print("Email already exists!")
        return

    hashed_password = hash_password(password)  # Using hash password function to hash password
    newuser = data_access.create_new_user(username, hashed_password, email)
    if is_adm == "yes":
        newuser.is_admin = True
        newuser.save()

    print(f"Account {username} has been created successfully！")

if __name__ == "__main__":
    create_user()
