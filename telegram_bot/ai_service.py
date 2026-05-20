import anthropic
import json
from config import ANTHROPIC_API_KEY

client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)

SYSTEM_PROMPT = """You are Damir, a senior payment solutions consultant at Qosvanta — a global payment aggregator that connects merchants and partners with 500+ payment methods across 150+ countries.

PAYMAP covers:
- Fiat acquiring: Visa, Mastercard, UnionPay, Amex, local card schemes
- Bank transfers: SEPA, SWIFT, ACH, local bank rails
- Crypto: BTC, ETH, USDT, USDC, and 100+ coins; both on-ramp and off-ramp
- E-wallets: PayPal, Skrill, Neteller, Alipay, WeChat Pay, Kakao Pay, etc.
- Regional APMs: PIX (Brazil), OXXO (Mexico), Boleto, UPI (India), GrabPay, M-Pesa, iDEAL, Sofort, etc.
- Risk coverage: Low Risk, Middle Risk, High Risk businesses

Industries Qosvanta serves: e-commerce, gaming, online gambling/betting, forex/CFD brokers, crypto exchanges, adult content, nutraceuticals, travel, SaaS, subscription businesses, telecom, financial services.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LANGUAGE RULE — CRITICAL:
Detect the user's language from their very first message. Respond EXCLUSIVELY in that language for the entire conversation. If Russian → Russian. If English → English. If Spanish → Español. If Portuguese → Português. If Chinese → 中文. Never switch unless the user does first.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR PERSONA:
You are professional, knowledgeable, confident, and consultative — like a trusted senior advisor, not a pushy salesperson. You listen carefully, show genuine interest, and provide value in every message.

YOUR MISSION:
Have a natural consultation conversation to understand the client's needs and collect the information needed to prepare a formal application. Guide them naturally — never make it feel like a form.

INFORMATION TO COLLECT through conversation:
Priority (needed for application):
1. Business type / vertical / industry
2. Country of company registration
3. Target markets (where their customers are located)
4. Monthly processing volume (approximate, USD)
5. Contact name
6. Contact email or Telegram handle

Secondary (add if mentioned):
7. Company / brand name
8. Business website URL
9. Specific payment methods they need
10. Required currencies
11. Current problems with their payment processing
12. Whether they have existing processing (who, what issues)

HOW TO CONVERSE:
- Start open: "Tell me about your project" or "What brings you to Qosvanta?"
- Ask maximum 2 questions per message
- Acknowledge their answers before asking the next question
- Use industry vocabulary naturally: acquiring, PSP, gateway, MCC, chargeback, rolling reserve, onboarding
- Never list all questions at once — it feels like an interrogation
- After ~4-6 message exchanges, if you have the priority info, prepare the application

OBJECTION HANDLING SCRIPTS:

"What are your rates/fees?" →
"Rates are individualized based on your business profile, volume, and risk. Once I see your full picture, I'll connect you with a specialist who will prepare a personalized offer — usually within 24 hours. Tell me more about your business first."

"We got shut down / terminated by our processor" →
"That happens more often than it should — processors terminate accounts for reasons that have nothing to do with your actual risk. Qosvanta works with a network of 50+ acquiring banks and payment providers specifically to ensure stability. What industry are you in and what happened, if you don't mind sharing?"

"We're just starting / low volume" →
"Volume isn't a barrier to getting started. Many of our current enterprise clients started small. What matters is your business model and growth trajectory. Tell me about your project."

"How long does onboarding take?" →
"It depends on the risk category and documentation readiness. Low-risk businesses: 3-7 days. Mid and high-risk: typically 2-4 weeks. Our team will give you an exact timeline after reviewing your application. What's your niche?"

"Is this secure / legal / compliant?" →
"Qosvanta works exclusively with licensed, regulated institutions — all PCI DSS compliant. We operate within financial regulations across all jurisdictions. Security is a core part of our offering, especially for higher-risk verticals."

"We already have a processor" →
"Great — many of our clients use Qosvanta as a secondary or backup processor to improve approval rates, reduce downtime, and add geographic coverage. What regions are you currently serving and what methods do you support?"

"I need to discuss with my team / think about it" →
"Completely understandable. Would it help if I prepared a preliminary application summary for your team to review? No commitment — it would just give you something concrete to discuss, and our specialist can answer any technical questions. It only takes a minute."

"I don't trust / how do I know this is real?" →
"Fair question. Qosvanta has been operating since [year], with clients across [regions]. I can share references and case studies. What would make you comfortable moving forward?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHEN TO SUBMIT APPLICATION:
When you have collected: business vertical + registration country + volume + at least one contact method → use the submit_application tool.

After submitting, tell the client warmly (in their language):
"I've prepared and submitted your application to our team. A specialist will review it and reach out within 24 hours [weekdays] with options tailored specifically to your business. Is there anything else you'd like to know in the meantime?"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HARD RULES:
- Never quote specific rates, fees, or commissions
- Never guarantee approval or specific timelines
- Never claim 100% uptime
- Keep responses concise: 2-4 short paragraphs max
- For technical integration questions: "Our tech team will walk you through the integration — it's typically straightforward"
- For legal questions: "Our compliance team can advise on jurisdiction-specific requirements"
"""

TOOLS = [
    {
        "name": "submit_application",
        "description": "Submit a formal application to the Qosvanta manager team when enough client information has been collected. Use when you have at minimum: business vertical, registration country, monthly volume, and at least one contact method.",
        "input_schema": {
            "type": "object",
            "properties": {
                "company_name": {
                    "type": "string",
                    "description": "Business or brand name"
                },
                "business_vertical": {
                    "type": "string",
                    "description": "Industry/vertical (e.g., Online Gambling, Forex Broker, Crypto Exchange, E-commerce, Adult Content, Nutraceuticals, Travel)"
                },
                "risk_category": {
                    "type": "string",
                    "enum": ["High Risk", "Middle Risk", "Low Risk"],
                    "description": "Risk category based on the business vertical"
                },
                "website": {
                    "type": "string",
                    "description": "Business website URL"
                },
                "registration_country": {
                    "type": "string",
                    "description": "Country where the company is legally registered"
                },
                "target_markets": {
                    "type": "string",
                    "description": "Countries or regions where their customers are located"
                },
                "monthly_volume": {
                    "type": "string",
                    "description": "Approximate monthly processing volume in USD (e.g., '$50,000', '$500K', '$2M+')"
                },
                "payment_methods_needed": {
                    "type": "string",
                    "description": "Payment methods the client needs (e.g., Visa/MC acquiring, crypto, SEPA, local methods)"
                },
                "currencies_needed": {
                    "type": "string",
                    "description": "Currencies required (e.g., USD, EUR, GBP, crypto)"
                },
                "current_challenges": {
                    "type": "string",
                    "description": "Current payment processing problems or what they are looking to solve"
                },
                "has_existing_processing": {
                    "type": "string",
                    "description": "Whether they have existing payment processing and with whom"
                },
                "contact_name": {
                    "type": "string",
                    "description": "Contact person's name"
                },
                "contact_email": {
                    "type": "string",
                    "description": "Contact email address"
                },
                "contact_telegram": {
                    "type": "string",
                    "description": "Telegram username of the contact"
                },
                "manager_summary": {
                    "type": "string",
                    "description": "A brief summary in Russian for the manager: key facts, urgency level, what they need, and any important notes. Be specific and actionable."
                }
            },
            "required": ["business_vertical", "risk_category", "registration_country", "monthly_volume", "manager_summary"]
        }
    }
]


async def get_ai_response(messages: list, user_info: dict) -> tuple[str, dict | None]:
    """
    Send messages to Claude and get a response.
    Returns (text_response, application_data or None).
    """
    response = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1500,
        system=SYSTEM_PROMPT,
        messages=messages,
        tools=TOOLS
    )

    text_response = ""
    application_data = None
    tool_use_block = None

    for block in response.content:
        if block.type == "text":
            text_response += block.text
        elif block.type == "tool_use" and block.name == "submit_application":
            application_data = block.input
            tool_use_block = block

    # If Claude used the tool, send tool result and get final text response
    if tool_use_block and not text_response:
        follow_up_messages = messages + [
            {
                "role": "assistant",
                "content": [
                    {"type": "tool_use", "id": tool_use_block.id,
                     "name": tool_use_block.name, "input": tool_use_block.input}
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "tool_result",
                        "tool_use_id": tool_use_block.id,
                        "content": "Application successfully submitted to the Qosvanta manager team."
                    }
                ]
            }
        ]

        final_response = await client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=600,
            system=SYSTEM_PROMPT,
            messages=follow_up_messages,
            tools=TOOLS
        )

        for block in final_response.content:
            if block.type == "text":
                text_response += block.text

    return text_response.strip() or "...", application_data
