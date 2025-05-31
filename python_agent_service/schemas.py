from pydantic import BaseModel
from typing import Optional

class Contact(BaseModel):
    id: str
    name: Optional[str]
    email: Optional[str]
    telegram_id: str
    created_at: Optional[str]
    updated_at: Optional[str]

class Message(BaseModel):
    id: str
    contact_id: str
    sender: str
    channel: str
    content: str
    status: str
    metadata: Optional[dict]
    created_at: str 