import html
import logging
from aiogram import Router, F
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove

from database import get_messages, save_messages, save_application, clear_conversation
from ai_service import get_ai_response
from application_sender import send_application_to_managers

router = Router()
logger = logging.getLogger(__name__)

WELCOME_TEXT = """👋 <b>Welcome to Qosvanta!</b>

I'm Damir, your personal payment solutions consultant.

Qosvanta is a global payment aggregator — we connect merchants and partners with <b>500+ payment methods</b> worldwide: fiat acquiring, crypto, e-wallets, local APMs, and more. We work with <b>all risk levels</b> across 150+ countries.

<b>How can I help you today?</b> Tell me about your business and what you're looking for — I'll find the best payment solution for you.

Feel free to write in any language 🌍
<i>Можете писать на русском · En español · Em português · 中文 · Auf Deutsch</i>"""


@router.message(CommandStart())
async def handle_start(message: Message):
    user_id = message.from_user.id
    await clear_conversation(user_id)

    await message.answer(
        WELCOME_TEXT,
        parse_mode="HTML",
        reply_markup=ReplyKeyboardRemove()
    )


@router.message(Command("reset"))
async def handle_reset(message: Message):
    user_id = message.from_user.id
    await clear_conversation(user_id)

    lang_hints = {
        "ru": "✅ Разговор сброшен. Начнём заново — расскажите о вашем бизнесе.",
        "en": "✅ Conversation reset. Let's start fresh — tell me about your business.",
    }
    await message.answer("✅ Conversation reset. Let's start fresh — tell me about your business.")


@router.message(Command("help"))
async def handle_help(message: Message):
    text = """<b>PayMap Assistant — Help</b>

/start — Start a new conversation
/reset — Reset conversation and start over
/help — Show this help message

<b>What I can help with:</b>
• Find the right payment solution for your business
• Explain available payment methods by region
• Prepare a formal application for our team
• Answer questions about processing, rates, and onboarding

Just write your question in any language and I'll respond accordingly 🌍"""

    await message.answer(text, parse_mode="HTML")


@router.message(F.text)
async def handle_message(message: Message):
    user_id = message.from_user.id
    user_text = message.text.strip()
    username = message.from_user.username or ""

    user_info = {
        "id": user_id,
        "username": username,
        "first_name": message.from_user.first_name or "",
        "last_name": message.from_user.last_name or "",
        "language_code": message.from_user.language_code or "en",
    }

    # Show typing indicator
    await message.bot.send_chat_action(chat_id=message.chat.id, action="typing")

    # Load conversation history
    messages = await get_messages(user_id)

    # Add user message
    messages.append({"role": "user", "content": user_text})

    try:
        # Get AI response
        text_response, application_data = await get_ai_response(messages, user_info)

        # Add assistant response to history
        messages.append({"role": "assistant", "content": text_response})

        # Save updated conversation
        await save_messages(user_id, messages)

        # Send response to user — escape to neutralize any HTML the LLM emits
        await message.answer(html.escape(text_response or ""), parse_mode="HTML")

        # If application was submitted, save and send to managers
        if application_data:
            app_id = await save_application(user_id, username, application_data)
            await send_application_to_managers(
                bot=message.bot,
                user_id=user_id,
                username=username,
                app_data=application_data,
                app_id=app_id
            )
            logger.info(f"Application #{app_id} submitted for user {user_id} (@{username})")

    except Exception as e:
        logger.error(f"Error processing message from user {user_id}: {e}", exc_info=True)
        await message.answer(
            "⚠️ Something went wrong on my end. Please try again in a moment.",
        )
