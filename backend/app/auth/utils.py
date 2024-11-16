from passlib.context import CryptContext
import datetime,time
import jwt

def get_current_timestamp() -> int:
    return int(datetime.datetime.now(datetime.timezone.utc).timestamp())

class JWT:
    algorithm = "HS256"
    # to get a string like this run:
    # openssl rand -hex 32
    secret_key = "bullshit"
    @classmethod
    def encode(cls,username:str,ttl:int = 60*15):
        exp = get_current_timestamp() + ttl
        data = {"username": username,'exp':exp}
        encoded_jwt = jwt.encode(data, cls.secret_key, algorithm=cls.algorithm)
        return dict(token=encoded_jwt,ttl=ttl,exp=exp)
    @classmethod
    def decode(cls,token:str): # returns username
        payload = jwt.decode(token, cls.secret_key, algorithms=[cls.algorithm])
        return payload

class Password:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    @classmethod
    def verify(cls,plain_password, hashed_password):
        return cls.pwd_context.verify(plain_password, hashed_password)
    @classmethod
    def hash(cls,password):
        return cls.pwd_context.hash(password)


class ExpiringList:
    def __init__(self):
        self.__items = []

    def add(self, item, expiration_time:int):
        self.__items.append({'item': item, 'expiration_time': expiration_time})

    def remove_expired(self):
        current_time = get_current_timestamp()
        self.__items = [entry for entry in self.__items if entry['expiration_time'] > current_time]

    @property
    def items(self):
        self.remove_expired()
        return set([entry['item'] for entry in self.__items])
