from pydantic import BaseModel, constr

class UserSignup(BaseModel):
    username: constr(min_length=6)
    password: constr(min_length=6)

class UserLogin(BaseModel):
    username: constr(min_length=6)
    password: constr(min_length=6)

class TokenRefresh(BaseModel):
    refresh_token: str
