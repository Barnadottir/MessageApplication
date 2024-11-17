from typing import Annotated
import fastapi
from fastapi import Depends
from fastapi.responses import ORJSONResponse
from fastapi.middleware.cors import CORSMiddleware
import sqlalchemy
import logging
import ngrok
import uvicorn

from . import models, database
from .auth.routes import router as auth_router,TU,get_user,utils


from contextlib import asynccontextmanager
from os import getenv
from dotenv import load_dotenv
load_dotenv()



NGROK_AUTH_TOKEN = getenv("NGROK_AUTH_TOKEN", "")
NGROK_EDGE = getenv("NGROK_EDGE", "edge:edghts_")
APPLICATION_PORT = 8000

# ngrok free tier only allows one agent. So we tear down the tunnel on application termination
@asynccontextmanager
async def lifespan(app: fastapi.FastAPI):
    print("Setting up Ngrok Tunnel")
    ngrok.set_auth_token(NGROK_AUTH_TOKEN)
    ngrok.forward(
        addr=APPLICATION_PORT,
        labels=NGROK_EDGE,
        proto="labeled",
    )
    yield
    print("Tearing Down Ngrok Tunnel")
    ngrok.disconnect()

app = fastapi.FastAPI(lifespan=lifespan,default_response_class=ORJSONResponse)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'https://eb4c-89-253-80-225.ngrok-free.app'],  # http://localhost:5173 Allow all origins, or specify a list of allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

active_connections: list[fastapi.WebSocket] = []

@app.websocket("/ws/chat/{username}")
async def websocket_endpoint(websocket: fastapi.WebSocket, username: str):
    print(f'New active connection {username}')
    await websocket.accept()
    active_connections.append((username, websocket))
    try:
        while True:
            # Keep the connection open and await messages (optional)
            data = await websocket.receive_text()
            print(f'New data {data}')
            # Handle received data if needed (e.g., for acknowledgments)
    except fastapi.WebSocketDisconnect:
        active_connections.remove((username, websocket))
        print(f'Connection disconnect {username}')

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

    # Notify the receiver if they are connected via WebSocket
    for username, websocket in active_connections:
        print(f'existing connection {username}')
        if username == message.receiver:
            print(f'Notifies {username} of message')
            await websocket.send_text(f"New message from {current_user.username}: {message.message}")

    return {"message": "Message sent successfully"}

@app.post("/chat_messages")
async def chat_messages(receiver: models.Receiver, db: database.DB, current_user: TU) -> list[models.MessagesOut]:
    receiver_user = db.query(models.User).filter(models.User.username == receiver.receiver).first()
    if receiver_user:
        messages = db.query(models.Message).filter(
            ((models.Message.sender_id == current_user.id) &
                (models.Message.receiver_id == receiver_user.id)) |
            ((models.Message.sender_id == receiver_user.id) &
                (models.Message.receiver_id == current_user.id))
        ).all()
    else:
        messages = []
    id2username = {user.id:user.username for user in [receiver_user,current_user] if user is not None}
    message_list = [
        models.MessagesOut(message=message.message,timestamp=message.timestamp,sender=id2username[message.sender_id],receiver=id2username[message.receiver_id])
        for message in messages
    ]
    return message_list

@app.get("/users")
async def users(db: database.DB, current_user: TU) -> list[models.UserOut]:
    users = db.query(models.User).all()
    return [models.UserOut(username=u.username,full_name=u.full_name) for u in users]

@app.get("/friends")
async def friends(db: database.DB, current_user: TU) -> list[models.UserOut]:
    friend_relationships = (
        db.query(models.Friends)
        .filter((models.Friends.user_id == current_user.id) | (models.Friends.friend_id == current_user.id))
        .all()
    )
    friend_ids = {f.friend_id for f in friend_relationships if f.user_id == current_user.id} | \
                 {f.user_id for f in friend_relationships if f.friend_id == current_user.id}
    friends = db.query(models.User).filter(models.User.id.in_(friend_ids)).all()
    return [models.UserOut(username=f.username, full_name=f.full_name) for f in friends]

@app.get("/search_users")
async def search_users(db: database.DB, current_user: TU, query: str) -> list[models.UserOut]:
    # Perform case-insensitive search on both username and full_name
    search_results = db.query(models.User).filter(
        sqlalchemy.or_(
            models.User.username.ilike(f"%{query}%"),
            models.User.full_name.ilike(f"%{query}%")
        )
    ).all()
    return [models.UserOut(username=u.username, full_name=u.full_name) for u in search_results]




if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=APPLICATION_PORT, reload=True)
