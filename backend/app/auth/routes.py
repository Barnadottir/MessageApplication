import fastapi
from fastapi import Depends
from typing import Annotated

from .. import models,database
from . import utils

class OAuth2PasswordBearerWithCookie(fastapi.security.OAuth2):
    __hash__ = lambda obj: id(obj)
    def __init__(
        self,
        tokenUrl: str,
        scheme_name: str|None = None,
        scopes: dict|None = None,
        auto_error: bool = True,
    ):
        if not scopes:
            scopes = {}
        flows = fastapi.openapi.models.OAuthFlows(
            password={"tokenUrl": tokenUrl, "scopes": scopes}
        )
        super().__init__(flows=flows, scheme_name=scheme_name, auto_error=auto_error)
        self.blacklist = utils.ExpiringList()

    def handle_exception(self):
        if self.auto_error:
            raise fastapi.HTTPException(
                status_code=fastapi.status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated",
                headers={"WWW-Authenticate": "Bearer"},
            )
        else:
            return None

    async def __call__(self, request: fastapi.Request) -> str|None:
        authorization: str = request.headers.get("Authorization")
        access_token = request.cookies.get("access_token")
        scheme, param = fastapi.security.utils.get_authorization_scheme_param(authorization)
        if access_token is not None and access_token in self.blacklist.items:
            self.handle_exception()
        if authorization is not None:
            print('Authentication using authorization.')
            if scheme.lower() != "bearer":
                self.handle_exception()
            return param
        elif access_token is not None:
            print('Authentication using access_token.')
            return access_token
        else:
            self.handle_exception()


oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="auth/login") #replacing fastapi.security.OAuth2PasswordBearer

def get_user(username: str, db: database.Session) -> models.User:
    """Gets user from db"""
    return db.query(models.User).filter(models.User.username == username).first()

async def token_to_user(db:database.DB,token: str = Depends(oauth2_scheme)):
    """Get the current user from the token"""
    username = utils.JWT.decode(token).get("username")
    print(f'Decoded: {username}')
    if not username:
        raise fastapi.HTTPException(status_code=401, detail="Not authenticated")
    user = get_user(username,db)
    if not user:
        raise fastapi.HTTPException(status_code=401, detail="User not found")
    return user

TU = Annotated[models.User,Depends(token_to_user)]

# Add an admin user if not already present
def add_admin(db):
    user = models.SignupIn(
        username='admin',
        email='mixsam36@gmail.com',
        full_name='Alexander Samson',
        password='admin',
    )
    if not get_user(user.username,db):
        hashed_password = utils.Password.hash(user.password)
        new_user = models.User(**user.dict(), hashed_password=hashed_password)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

router = fastapi.APIRouter(
    prefix='/auth',
    tags=['auth'],
)

@router.post("/signup")
async def signup(user_create: models.SignupIn, db: database.DB) -> models.SignupOut:
    existing_user = db.query(models.User).filter(
        (models.User.username == user_create.username) | (models.User.email == user_create.email)
    ).first()
    if existing_user:
        raise fastapi.HTTPException(status_code=400, detail="Username or email is already taken.")
    new_user = models.User(**user_create.dict(), hashed_password=utils.Password.hash(user_create.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return models.SignupOut(message="Signed up successfully!")

@router.post("/login")
async def login(user_login: Annotated[fastapi.security.OAuth2PasswordRequestForm, Depends()], response: fastapi.Response, db: database.DB) -> models.Token:
    user = db.query(models.User).filter(models.User.username == user_login.username).first()
    if not user:
        raise fastapi.HTTPException(status_code=401, detail="Incorrect username or password.")
    if not utils.Password.verify(user_login.password, user.hashed_password):
        raise fastapi.HTTPException(status_code=401, detail="Incorrect username or password.")
    token_data = utils.JWT.encode(user.username,ttl=60*15)
    if not token_data:
        raise fastapi.HTTPException(status_code=500, detail="Failed to generate authentication token.")
    response.set_cookie(key="access_token", value=token_data['token'], httponly=True, expires=token_data['ttl'])
    return models.Token(access_token=token_data['token'], token_type="bearer")

@router.get("/logout")
async def protected_route(_: TU,token: str = Depends(oauth2_scheme)):
    d = utils.JWT.decode(token)
    username = d.get("username")
    if username:
        print(f'Logging out: {d}')
        oauth2_scheme.blacklist.add(token,d['exp'])
    return {}
