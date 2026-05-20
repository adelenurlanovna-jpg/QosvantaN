import html
from aiogram import Bot
from datetime import datetime
from config import MANAGER_CHAT_ID


def _field(value: str | None, fallback: str | None = "—") -> str:
    v = value.strip() if value and value.strip() else fallback
    if v is None:
        return ""
    return html.escape(v)


def _risk_emoji(risk: str) -> str:
    mapping = {
        "High Risk": "🔴",
        "Middle Risk": "🟡",
        "Low Risk": "🟢",
    }
    return mapping.get(risk, "⚪")


async def send_application_to_managers(
    bot: Bot,
    user_id: int,
    username: str | None,
    app_data: dict,
    app_id: int
):
    now = datetime.now().strftime("%d.%m.%Y %H:%M")
    risk = _field(app_data.get("risk_category"), "Не определён")
    risk_emoji = _risk_emoji(risk)

    tg_contact = _field(app_data.get("contact_telegram"), None)
    if not tg_contact and username:
        tg_contact = f"@{html.escape(username)}"
    elif tg_contact and not tg_contact.startswith("@"):
        tg_contact = f"@{tg_contact}"
    tg_contact = tg_contact or "—"

    user_link = f'<a href="tg://user?id={user_id}">Открыть чат</a>'

    card = f"""🔔 <b>НОВАЯ ЗАЯВКА #{app_id}</b>
━━━━━━━━━━━━━━━━━━━━━━

👤 <b>Клиент:</b> {tg_contact} · {user_link}
📛 <b>Компания:</b> {_field(app_data.get('company_name'))}
🌐 <b>Сайт:</b> {_field(app_data.get('website'))}

📊 <b>Бизнес:</b>
├ Вертикаль: <b>{_field(app_data.get('business_vertical'))}</b>
├ Риск: {risk_emoji} <b>{risk}</b>
├ Страна регистрации: {_field(app_data.get('registration_country'))}
└ Целевые рынки: {_field(app_data.get('target_markets'))}

💰 <b>Финансы:</b>
├ Оборот/мес: <b>{_field(app_data.get('monthly_volume'))}</b>
└ Валюты: {_field(app_data.get('currencies_needed'))}

💳 <b>Нужные методы:</b>
{_field(app_data.get('payment_methods_needed'))}

🎯 <b>Текущие проблемы:</b>
{_field(app_data.get('current_challenges'))}

🔄 <b>Текущий процессинг:</b>
{_field(app_data.get('has_existing_processing'))}

📞 <b>Контакты:</b>
├ Имя: {_field(app_data.get('contact_name'))}
├ Email: {_field(app_data.get('contact_email'))}
└ Telegram: {tg_contact}

💬 <b>Резюме для менеджера:</b>
<i>{_field(app_data.get('manager_summary'))}</i>

━━━━━━━━━━━━━━━━━━━━━━
⏰ <i>{now}</i>"""

    await bot.send_message(
        chat_id=MANAGER_CHAT_ID,
        text=card,
        parse_mode="HTML",
        disable_web_page_preview=True
    )
