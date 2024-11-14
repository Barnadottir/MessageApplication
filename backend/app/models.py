from pydantic import BaseModel, EmailStr, validator
from sqlmodel import Field, SQLModel
import re

# User class for Database
class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(sa_column=Field(unique=True))
    email: EmailStr = Field(sa_column=Field(unique=True))
    full_name: str
    hashed_password: str

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
