import os
import requests

def send_telegram_alert(lead_data):
    # Apna real Bot Token aur Chat ID yahan daal dein
    bot_token = "8072189551:AAH9_gwjPJu0EWPtSh-V39eA8Utq4zdOTI0"  # Example format
    chat_id = "5557540276"                                 # Aapki Telegram Chat ID
    
    message = (
        f"🚨 **NEW MEDIBRIDGE REQUIREMENT ALERT** 🚨\n\n"
        f"📌 **Lead ID:** {lead_data.get('id', 'N/A')}\n"
        f"🏥 **Hospital/Entity:** {lead_data.get('hospitalName', 'N/A')}\n"
        f"📋 **Rohini ID:** {lead_data.get('rohiniId', 'N/A')}\n"
        f"💼 **Service Required:** {lead_data.get('service', 'N/A')}\n"
        f"👤 **Contact Person:** {lead_data.get('contactPerson', 'N/A')}\n"
        f"📞 **Phone:** {lead_data.get('contactNo', 'N/A')}\n"
        f"⏰ **Time:** {lead_data.get('createdAt', 'Just now')}"
    )
    
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "Markdown"
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        if response.status_code == 200:
            print("✅ Telegram alert broadcasted successfully!")
        else:
            print(f"❌ Failed to send alert: {response.text}")
    except Exception as e:
        print(f"⚠️ Exception occurred while sending Telegram notification: {e}")