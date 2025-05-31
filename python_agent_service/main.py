import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
from agent import agent_respond
from db import get_or_create_contact, save_message, get_recent_messages
import httpx

load_dotenv()

app = FastAPI()
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_WEBHOOK_URL = "https://athena-exec-assistant.onrender.com/webhook/telegram"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    telegram_id: str
    message: str

class ChatResponse(BaseModel):
    reply: str
    contact_id: str

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    # Get or create contact
    contact, is_new = get_or_create_contact(req.telegram_id)
    # Save incoming message
    save_message(contact['id'], req.telegram_id, 'telegram', req.message, 'received')
    # Get recent messages for context
    history = get_recent_messages(contact['id'], limit=5)
    # Get agent reply
    reply = agent_respond(contact, req.message, history, is_new)
    # Save agent reply
    save_message(contact['id'], 'agent', 'telegram', reply, 'sent')
    return ChatResponse(reply=reply, contact_id=contact['id'])

@app.post("/webhook/telegram")
async def telegram_webhook(request: Request):
    data = await request.json()
    message = data.get("message", {})
    chat_id = message.get("chat", {}).get("id")
    text = message.get("text", "")
    
    if not chat_id or not text:
        return {"status": "error", "message": "Invalid message format"}
    
    # Process the message using your agent
    response = agent_respond(
        contact={"name": message.get("from", {}).get("first_name", "User")},
        user_message=text,
        history=[],  # You might want to implement message history storage
        is_new=True  # You might want to implement contact tracking
    )
    
    # Send response back to Telegram
    async with httpx.AsyncClient() as client:
        await client.post(
            f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
            json={
                "chat_id": chat_id,
                "text": response
            }
        )
    
    return {"status": "success"}

@app.get("/setup-webhook")
async def setup_telegram_webhook():
    """Endpoint to set up the Telegram webhook"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/setWebhook",
            json={
                "url": TELEGRAM_WEBHOOK_URL
            }
        )
        return response.json() 