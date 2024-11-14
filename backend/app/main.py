from typing import Annotated
import fastapi
from fastapi import Depends
from fastapi.responses import ORJSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging

from . import models, database
from .auth.routes import router as auth_router,add_admin,TU


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



@app.on_event("startup")
async def on_startup():
    database.create_db_and_tables()
    db = next(database.get_session())
    add_admin(db)

@app.get("/watchlist")
async def protected_route(current_user: TU):
    print(f'{current_user.username}')
    data = [
      { 'name': "ADCT", 'quantity': 10, 'action': "Buy" },
      { 'name': "TSLA", 'quantity': 4, 'action': "Buy" },
      { 'name': "NVDA", 'quantity': 4, 'action': "Hold" },
      { 'name': "SWVL", 'quantity': 6, 'action': "Hold" },
      { 'name': "AAPL", 'quantity': 6, 'action': "Sell" },
      { 'name': "MSFT", 'quantity': 10, 'action': "Sell" },
      { 'name': "MSFT", 'quantity': 10, 'action': "Sell" },
      { 'name': "ADCT", 'quantity': 10, 'action': "Buy" },
    ] * 10;
    return data
