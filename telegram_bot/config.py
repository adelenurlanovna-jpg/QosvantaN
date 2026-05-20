import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
MANAGER_CHAT_ID = os.getenv("MANAGER_CHAT_ID", "")
BOT_NAME = os.getenv("BOT_NAME", "PayMap Assistant")

if not BOT_TOKEN:
    raise ValueError("BOT_TOKEN is not set in .env file")
if not ANTHROPIC_API_KEY:
    raise ValueError("ANTHROPIC_API_KEY is not set in .env file")
if not MANAGER_CHAT_ID:
    raise ValueError("MANAGER_CHAT_ID is not set in .env file")
