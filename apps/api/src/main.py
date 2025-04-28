import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes.auth import router as auth_router
from src.routes.events import router as events_router

app = FastAPI()

front_url = os.getenv("FRONT_END_URL", "http://localhost:3000")

origins = [
  front_url,
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True, 
  allow_methods=["*"],  
  allow_headers=["*"],          
)

app.include_router(auth_router)

app.include_router(events_router)
