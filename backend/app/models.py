from pydantic import BaseModel, EmailStr, validator, SecretStr
from sqlmodel import Field, SQLModel
import re,datetime

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(sa_column=Field(unique=True))
    email: EmailStr = Field(sa_column=Field(unique=True))
    full_name: str
    hashed_password: str

class Message(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    sender_id: int = Field(foreign_key="user.id")
    receiver_id: int = Field(foreign_key="user.id")
    message: str = Field(..., nullable=False)
    timestamp: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

# Model for user creation (signup)
class SignupIn(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    password: str

class SignupOut(BaseModel):
    message: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Model for login
class LoginIn(BaseModel):
    username: str
    password: str

class MessageIn(BaseModel):
    receiver: str
    message: str

class Receiver(BaseModel):
    receiver: str

class MessagesOut(BaseModel):
    timestamp: datetime.datetime
    sender: str
    receiver: str
    message: str


class UserOut(BaseModel):
    username: str
    full_name: str
