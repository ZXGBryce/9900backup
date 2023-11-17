import bcrypt


def hash_password(password: str) -> str:
    """ Use bcrypt to hash password """

    # Generate a random salt value
    salt = bcrypt.gensalt()

    # Hash password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    return hashed_password.decode('utf-8')

def check_password(password: str, hashed_password: str) -> bool:
    """ Check if the hashed password match to the password """

    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))