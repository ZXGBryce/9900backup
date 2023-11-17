import random
import string

def generate_verification_code() -> str:
    """ Generate random 6-digits verification code """
    return ''.join(random.choices(string.digits, k=6))
