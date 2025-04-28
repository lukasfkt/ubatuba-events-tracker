from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from src.database.base import Base
import datetime

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True)
    title = Column(String, index=True)
    location = Column(String, index=True)
    description = Column(String)
    category = Column(String)
    image_url = Column(String)
    date = Column(DateTime, default=datetime.datetime.now(datetime.UTC))
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.UTC))
    updated_at = Column(DateTime, default=datetime.datetime.now(datetime.UTC), onupdate=datetime.datetime.now(datetime.UTC))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
