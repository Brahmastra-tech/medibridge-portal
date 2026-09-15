from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from telegram_alert import send_telegram_alert  # Apni pehli file ko import karein
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI()

# React frontend se request allow karne ke liye CORS enable karein
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Aapki React app ka URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LeadData(BaseModel):
    hospitalName: str
    rohiniId: str
    service: str
    contactPerson: str
    contactNo: str

@app.post("/api/submit-lead")
async def submit_lead(data: LeadData):
    # 1. Data ko backend dictionary mein convert karein
    lead_dict = data.dict()
    lead_dict['id'] = f"WEB-{int(time.time())}" # Unique ID create karein
    lead_dict['createdAt'] = time.strftime("%Y-%m-%d %H:%M:%S")

    # 2. Telegram alert trigger karein
    try:
        send_telegram_alert(lead_dict)
        return {"message": "Lead received and alert sent successfully"}
    except Exception as e:
        print(f"Error sending alert: {e}")
        # Alert bhejne mein error aaye tab bhi lead accept ho jayegi,
        # lekin console mein error dikhega
        return {"message": "Lead received, but alert failed to send"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)