from flask_mail import Mail, Message

class Mailer:
    def __init__(self, mail: Mail):
        self.mail = mail

    def send_verification_code(self, email: str, code: str):
        """ 发送验证码。 """
        msg = Message("Your Verification Code", sender="9900glitch@gmail.com",recipients=[email])
        msg.body = f"Your verification code is: {code}"
        self.mail.send(msg)
