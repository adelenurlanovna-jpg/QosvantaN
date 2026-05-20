import aiosqlite
import json
from datetime import datetime

DB_PATH = "paymap.db"


async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS conversations (
                user_id INTEGER PRIMARY KEY,
                messages TEXT DEFAULT '[]',
                language TEXT DEFAULT 'en',
                created_at TEXT,
                updated_at TEXT
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                username TEXT,
                data TEXT,
                submitted_at TEXT
            )
        """)
        await db.commit()


async def get_messages(user_id: int) -> list:
    async with aiosqlite.connect(DB_PATH) as db:
        async with db.execute(
            "SELECT messages FROM conversations WHERE user_id = ?", (user_id,)
        ) as cursor:
            row = await cursor.fetchone()
            if row:
                return json.loads(row[0])
            return []


async def save_messages(user_id: int, messages: list):
    async with aiosqlite.connect(DB_PATH) as db:
        now = datetime.now().isoformat()
        await db.execute("""
            INSERT INTO conversations (user_id, messages, created_at, updated_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET messages = ?, updated_at = ?
        """, (user_id, json.dumps(messages, ensure_ascii=False), now, now,
              json.dumps(messages, ensure_ascii=False), now))
        await db.commit()


async def save_application(user_id: int, username: str, data: dict) -> int:
    async with aiosqlite.connect(DB_PATH) as db:
        now = datetime.now().isoformat()
        cursor = await db.execute("""
            INSERT INTO applications (user_id, username, data, submitted_at)
            VALUES (?, ?, ?, ?)
        """, (user_id, username, json.dumps(data, ensure_ascii=False), now))
        await db.commit()
        return cursor.lastrowid


async def clear_conversation(user_id: int):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "UPDATE conversations SET messages = '[]' WHERE user_id = ?", (user_id,)
        )
        await db.commit()


async def get_application_count() -> int:
    async with aiosqlite.connect(DB_PATH) as db:
        async with db.execute("SELECT COUNT(*) FROM applications") as cursor:
            row = await cursor.fetchone()
            return row[0] if row else 0
