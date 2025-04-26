from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from src.auth.handler import sign_access_token, sign_refresh_token, decode_refresh_token
from src.database.session import SessionLocal
from src.models.user import User
from src.schemas.user import UserSignup, UserLogin, TokenRefresh 
from pydantic import BaseModel

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(user: UserSignup, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Usuário já cadastrado")
    new_user = User(username=user.username, password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        **sign_access_token(user.username),
        **sign_refresh_token(user.username)
    }

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username, User.password == user.password).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Credenciais inválidas")
    return {
        **sign_access_token(user.username),
        **sign_refresh_token(user.username)
    }

@router.post("/refresh")
def refresh_token(token: TokenRefresh):
    decoded_token = decode_refresh_token(token.refresh_token)
    if not decoded_token:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")
    user_id = decoded_token["user_id"]
    return sign_access_token(user_id)