from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from src.database.base import SessionLocal
from src.models.event import Event as EventModel
from src.schemas.event import Event as EventSchema, EventCreate, EventUpdate
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
def read_events(
    request: Request,
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page index"),
    limit: int = Query(10, ge=1, le=100, description="Limit of items per page"),
    search: Optional[str] = Query(None, description="Search term"),
    categories: Optional[List[str]] = Query(None, description="Filter by categories"),
):
    user = request.state.user

    query = db.query(EventModel).filter(EventModel.user_id == user["user_id"])

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                EventModel.title.ilike(search_term),
                EventModel.location.ilike(search_term),
            )
        )

    print (search, categories)
    if categories:
        query = query.filter(EventModel.category.in_(categories))

    query = query.order_by(EventModel.date)

    offset = (page - 1) * limit
    events = query.offset(offset).limit(limit).all()

    return events

@router.get("/{event_id}", response_model=EventSchema)
def read_event(event_id: int, request: Request, db: Session = Depends(get_db)):
    user = request.state.user

    db_event = crud.get_event(db, event_id)

    if db_event is None or db_event.user_id != user["user_id"]:
        raise HTTPException(status_code=404, detail="Event not found")

    return db_event

@router.post("/", response_model=EventSchema)
def create_event(event: EventCreate, request: Request, db: Session = Depends(get_db)):
    user = request.state.user
    db_event = EventModel(**event.dict(), user_id=user["user_id"])
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.put("/{event_id}", response_model=EventSchema)
def update_event(
    event_id: int,
    event_update: EventUpdate,
    request: Request,
    db: Session = Depends(get_db),
):
    user = request.state.user

    db_event = crud.get_event(db, event_id)
    if db_event is None or db_event.user_id != user["user_id"]:
        raise HTTPException(status_code=404, detail="Event not found")

    event_data = event_update.dict(exclude_unset=True)
    for key, value in event_data.items():
        setattr(db_event, key, value)

    db.commit()
    db.refresh(db_event)

    return db_event

@router.delete("/{event_id}")
def delete_event(event_id: int, request: Request, db: Session = Depends(get_db)):
    user = request.state.user

    db_event = crud.get_event(db, event_id)

    if db_event is None or db_event.user_id != user["user_id"]:
        raise HTTPException(status_code=404, detail="Event not found")

    crud.delete_event(db, event_id)
    return {"deleted": True}
