from typing import Annotated
from sqlmodel import Session, create_engine, SQLModel
from fastapi import Depends

from . import models

DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(bind=engine)

def get_session() -> Session:
    with Session(engine) as session:
        yield session

DB = Annotated[Session,Depends(get_session)]
