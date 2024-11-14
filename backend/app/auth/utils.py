from passlib.context import CryptContext
import datetime
import jwt

class JWT:
    algorithm = "HS256"
    # to get a string like this run:
    # openssl rand -hex 32
    secret_key = "82b8bdd7cada3abfa3be5231861a9139c9edc222f5754a61bfce63a868c00b22"
    @classmethod
    def encode(cls,username:str,timeout:datetime.timedelta|None = datetime.timedelta(minutes=15)):
        expiration = datetime.datetime.now(datetime.timezone.utc) + timeout
        data = {"username": username,'exp':expiration}
        encoded_jwt = jwt.encode(data, cls.secret_key, algorithm=cls.algorithm)
        return dict(token=encoded_jwt,timeout=timeout,expiration=expiration)
    @classmethod
    def decode(cls,token:str): # returns username
        payload = jwt.decode(token, cls.secret_key, algorithms=[cls.algorithm])
        username: str = payload.get("username")
        return username


class Password:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    @classmethod
    def verify(cls,plain_password, hashed_password):
        return cls.pwd_context.verify(plain_password, hashed_password)
    @classmethod
    def hash(cls,password):
        return cls.pwd_context.hash(password)
