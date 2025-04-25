from sqlalchemy.orm import Session
from src import models, schemas

def get_events(db: Session):
    return db.query(models.event.Event).all()

def get_event(db: Session, event_id: int):
    return db.query(models.event.Event).filter(models.event.Event.id == event_id).first()

def create_event(db: Session, event: schemas.event.EventCreate):
    db_event = models.event.Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def delete_event(db: Session, event_id: int):
    db_event = db.query(models.event.Event).filter(models.event.Event.id == event_id).first()
    db.delete(db_event)
    db.commit()
