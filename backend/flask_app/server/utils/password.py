import bcrypt


def hash_password(password: str) -> str:
    """ 利用 bcrypt 来哈希密码."""
    # 生成一个随机的盐值
    salt = bcrypt.gensalt()

    # 将密码哈希
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    return hashed_password.decode('utf-8')

def check_password(password: str, hashed_password: str) -> bool:
    """ 对比一个输入密码和对应的哈希版本是否匹配."""

    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))