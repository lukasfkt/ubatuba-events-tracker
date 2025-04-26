import time
import os
from typing import Dict
from jose import jwt


SECRET_KEY = os.getenv("SECRET_KEY", "secret")
REFRESH_SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 15 * 60
REFRESH_TOKEN_EXPIRE_SECONDS = 7 * 24 * 60 * 60

def sign_access_token(user_id: str) -> Dict[str, str]:
    payload = {
        "user_id": user_id,
        "expires": time.time() + ACCESS_TOKEN_EXPIRE_SECONDS
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token}

def sign_refresh_token(user_id: str) -> Dict[str, str]:
    payload = {
        "user_id": user_id,
        "expires": time.time() + REFRESH_TOKEN_EXPIRE_SECONDS
    }
    token = jwt.encode(payload, REFRESH_SECRET_KEY, algorithm=ALGORITHM)
    return {"refresh_token": token}

def decode_access_token(token: str) -> dict:
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded_token if decoded_token["expires"] >= time.time() else None
    except:
        return {}

def decode_refresh_token(token: str) -> dict:
    try:
        decoded_token = jwt.decode(token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
        return decoded_token if decoded_token["expires"] >= time.time() else None
    except:
        return {}
