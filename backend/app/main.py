from typing import Annotated
import fastapi
from fastapi import Depends
from fastapi.responses import ORJSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging

from . import models, database
from .auth.routes import router as auth_router,TU,get_user,utils


app = fastapi.FastAPI(default_response_class=ORJSONResponse)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow all origins, or specify a list of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(auth_router)



@app.exception_handler(fastapi.exceptions.RequestValidationError)
async def validation_exception_handler(request: fastapi.Request, exc: fastapi.exceptions.RequestValidationError):
	exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')
	logging.error(f"{request}: {exc_str}")
	content = {'status_code': 10422, 'message': exc_str, 'data': None}
	return ORJSONResponse(content=content, status_code=fastapi.status.HTTP_422_UNPROCESSABLE_ENTITY)

def add_users(db):
    users = [
        models.SignupIn(username='alex',email='mixsam36@gmail.com',full_name='Alexander Samson',password='admin'),
        models.SignupIn(username='oskar',email='bigboi@gmail.com',full_name='Oskar BigBoi',password='admin'),
    ]
    for user in users:
        if not get_user(user.username,db):
            hashed_password = utils.Password.hash(user.password)
            new_user = models.User(**user.dict(), hashed_password=hashed_password)
            db.add(new_user)
            db.commit()
            db.refresh(new_user)

@app.on_event("startup")
async def on_startup():
    database.create_db_and_tables()
    db = next(database.get_session())
    add_users(db)

@app.post("/send_message")
async def send_message(message: models.MessageIn, db: database.DB, current_user: TU):
    # Retrieve the receiver based on the username from the MessageIn model
    receiver = db.query(models.User).filter(models.User.username == message.receiver).first()
    if not receiver:
        raise fastapi.HTTPException(status_code=404, detail="Receiver not found")
    # Create a new Message instance
    new_message = models.Message(
        sender_id=current_user.id,
        receiver_id=receiver.id,
        message=message.message,
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return {"status": "success", "message": "Message sent successfully"}


@app.post("/chat_messages")
async def chat_messages(receiver: models.Receiver, db: database.DB, current_user: TU) -> list[models.MessagesOut]:
    receiver_user = db.query(models.User).filter(models.User.username == receiver.receiver).first()
    if not receiver_user:
        raise fastapi.HTTPException(status_code=404, detail="Receiver not found")
    messages = db.query(models.Message).filter(
        (models.Message.sender_id == current_user.id) |
        (models.Message.receiver_id == receiver_user.id)
    ).all()

    message_list = [
        models.MessagesOut(message=message.message,timestamp=message.timestamp)
        for message in messages
    ]

    return message_list
