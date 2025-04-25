from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.session import SessionLocal
from src.models.event import Event as EventModel
from src.schemas.event import Event as EventSchema, EventCreate
from src.crud import base as crud

from src.database.session import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/events", response_model=list[EventSchema])
def read_events(db: Session = Depends(get_db)):
    return crud.get_events(db)

@app.get("/events/{event_id}", response_model=EventSchema)
def read_event(event_id: int, db: Session = Depends(get_db)):
    db_event = crud.get_event(db, event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

@app.post("/events", response_model=EventSchema)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    return crud.create_event(db, event)

@app.delete("/events/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    crud.delete_event(db, event_id)
    return {"ok": True}
