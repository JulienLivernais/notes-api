from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class NoteBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    content: str

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):          # 👈 add this
    title: str | None = Field(None, min_length=1, max_length=100)
    content: str | None = None

class NoteResponse(NoteBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime              # 👈 add this too since you have it in your model

    model_config = ConfigDict(from_attributes=True)



