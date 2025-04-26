from pydantic import BaseModel, Field, constr
from datetime import datetime
from typing import Optional
from enum import Enum

class CategoryEnum(str, Enum):
    MUSIC = "Music"
    SPORTS = "Sports"
    EDUCATION = "Education"

class EventBase(BaseModel):
    title: constr(min_length=1, max_length=100)
    description: constr(min_length=10, max_length=255)
    location: constr(min_length=1, max_length=100)
    category: CategoryEnum
    image_url: Optional[str] = Field(None, alias="imageUrl")
    date: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[constr(min_length=1, max_length=100)] = None
    description: Optional[constr(min_length=10, max_length=255)] = None
    location: Optional[constr(min_length=1, max_length=100)] = None
    category: Optional[CategoryEnum] = None
    image_url: Optional[str] = Field(None, alias="imageUrl")
    date: Optional[datetime] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class Event(EventBase):
    id: int

    class Config:
        from_attributes = True
        populate_by_name = True
