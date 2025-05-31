import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_conn():
    return psycopg2.connect(os.getenv('SUPABASE_DB_URL'), cursor_factory=RealDictCursor)

def get_or_create_contact(telegram_id):
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM contacts WHERE telegram_id = %s", (telegram_id,))
    contact = cur.fetchone()
    if contact:
        conn.close()
        return contact, False
    # Create new contact with only telegram_id
    cur.execute("INSERT INTO contacts (telegram_id) VALUES (%s) RETURNING *", (telegram_id,))
    contact = cur.fetchone()
    conn.commit()
    conn.close()
    return contact, True

def save_message(contact_id, sender, channel, content, status):
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO messages (contact_id, sender, channel, content, status, metadata, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, NOW())
        """,
        (contact_id, sender, channel, content, status, '{}')
    )
    conn.commit()
    conn.close()

def get_recent_messages(contact_id, limit=5):
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute(
        "SELECT sender, content FROM messages WHERE contact_id = %s ORDER BY created_at DESC LIMIT %s",
        (contact_id, limit)
    )
    messages = cur.fetchall()
    conn.close()
    return list(reversed(messages)) 