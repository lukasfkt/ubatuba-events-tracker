from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database.session import SessionLocal
from src.models.event import Event as EventModel
from src.schemas.event import Event as EventSchema, EventCreate
from src.crud import base as crud
from src.auth.bearer import JWTBearer

router = APIRouter(
    prefix="/events",
    tags=["Events"],
    dependencies=[Depends(JWTBearer())],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[EventSchema])
def read_events(db: Session = Depends(get_db)):
    return crud.get_events(db)

@router.get("/{event_id}", response_model=EventSchema)
def read_event(event_id: int, db: Session = Depends(get_db)):
    db_event = crud.get_event(db, event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

@router.post("/", response_model=EventSchema)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    return crud.create_event(db, event)

@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    crud.delete_event(db, event_id)
    return {"ok": True}
