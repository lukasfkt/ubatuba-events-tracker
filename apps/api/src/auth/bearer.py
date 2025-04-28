from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.auth.handler import decode_access_token

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        
        if credentials:
            if credentials.scheme != "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")

            payload = self.verify_jwt(credentials.credentials)

            if payload is None:
                raise HTTPException(status_code=403, detail="Invalid or expired token.")

            request.state.user = payload

            return credentials.credentials
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, jwtoken: str):
        try:
            payload = decode_access_token(jwtoken)
            return payload 
        except:
            return None 
