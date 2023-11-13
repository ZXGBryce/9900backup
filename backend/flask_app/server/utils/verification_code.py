import random
import string

def generate_verification_code() -> str:
    """ 生成6位数字随机验证码。"""
    return ''.join(random.choices(string.digits, k=6))
