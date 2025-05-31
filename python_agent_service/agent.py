import os
from langchain_openai import ChatOpenAI

def agent_respond(contact, user_message, history, is_new):
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    if is_new:
        # If missing name, ask for name
        if not contact.get('name'):
            return "Hi there! I don't think we've met yet. What's your name?"
        # If missing email, ask for email
        if not contact.get('email'):
            return f"Nice to meet you, {contact['name']}! Could you share your email address so I can keep you updated?"
    # If known contact, use history for context
    context = "\n".join([
        f"{m['sender']}: {m['content']}" for m in history
    ])
    prompt = f"""
You are a friendly meeting assistant. Here is the recent conversation:
{context}

The user says: {user_message}
Respond in a helpful, friendly, and concise way.
"""
    response = llm.invoke([{"role": "user", "content": prompt}])
    return response.content.strip() 