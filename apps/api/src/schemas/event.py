from pydantic import BaseModel
from datetime import datetime

class EventBase(BaseModel):
    title: str
    description: str
    location: str

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int
    date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
