# 🌉 YojanaSetu

**Bridging Citizens and Government Schemes using Voice & AI**

_YojanaSetu empowers rural and underserved communities to discover government schemes through voice search, regional languages, and even SMS — ensuring accessibility for users with feature phones or limited digital literacy._


---

## 📌 Table of Contents

- [🚀 Features]
- [🛠️ Tech Stack]
- [📁 Project Structure]
- [⚙️ Setup Instructions]
- [🌐 Live Demo]
- [📦 API Endpoints]
- [🧠 AI & Python Integration]
- [🪛 Limitations & Next Steps]
- [👥 Team]


---

## 🚀 Features

- 🎙️ Voice-based scheme search using OpenAI Whisper
- 🧾 Scheme matching logic with static JSON
- 🔍 Typed input fallback if mic fails
- 💬 Placeholder for SMS integration (code present but not live)
- 📱 Mobile-friendly UI built with Tailwind

---

## 🛠️ Tech Stack

| Layer        | Tech                                |
|--------------|--------------------------------------|
| Frontend     | React, Tailwind CSS                  |
| Backend      | Node.js, Express.js                  |
| AI           | Python (Whisper tiny model)          |
| Integration  | Node child process + Python script   |
| Hosting      | Render (both frontend & backend)     |

---

## 📁 Project Structure
yojanasetu/
├── backdemo/ # Backend (Express + Whisper)
│ ├── _data/ # Static scheme data
│ ├── routes/ # Express routes (voice, match, sms)
│ ├── uploads/ # Uploaded audio files
│ ├── venv/ # Python virtual environment
│ ├── transcriber.py # Whisper-based transcription script
│ ├── index.js # Main Express server
│ ├── requirements.txt # Python dependencies
│ └── .env # Environment config

<br>

│
├── frontend/ # React frontend
│ ├── public/ # Static assets
│ ├── src/
│ │ ├── assets/ # Icons and visuals
│ │ ├── components/ # UI components (e.g. mic)
│ │ ├── utils/ # Scheme matching, translation logic
│ │ ├── App.jsx # Main app layout
│ │ └── index.css # Styling

## ⚙️ Setup Instructions
1. Clone the Repo
bash
Copy
Edit
git clone https://github.com/your-username/yojanasetu.git
cd yojanasetu
2. Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev
The frontend will run on http://localhost:5173

3. Backend Setup
bash
Copy
Edit
cd ../backdemo
npm install
pip install -r requirements.txt
node index.js
The backend will run on http://localhost:5000

Make sure you have:

Python 3.8+ installed

whisper installed: pip install -U openai-whisper

ffmpeg installed (required by Whisper)

The .env file contains any necessary config

## 🌐 Live Demo
Frontend: https://ysfrontend.onrender.com

Backend: https://ysbackend.onrender.com

##  API Endpoints
Endpoint	Method	Description
/api/whisper	POST	Accepts audio & returns text
/api/match	POST	Matches text to schemes
/api/send-sms	POST	(Planned) Send SMS (inactive)

🧠 AI & Python Integration
transcriber.py uses OpenAI Whisper (tiny) for multilingual transcription

Backend uses child_process.spawn() to call the script from Node.js

Result is streamed back and shown in the UI

Works best for Hindi, English, Marathi with small audio files

## 🪛 Limitations & Next Steps
✅ Built & Working
Voice transcription with Whisper

Typed search fallback

Scheme matcher (static)

Mobile-friendly frontend

## 🛠️ In Progress / Planned
🔒 SMS feature — pending DLT template approval

🌐 Full multi-language UI via i18next

📊 SDG tagging and analytics dashboard

📍 NGO locator using pin code or geolocation

📱 Convert to PWA for offline usage

## 👥 Team
Gagan  – Backend Development + Whisper Python Integration
<br>
Aashi Goel - Frontend Develpment & Integration Frontend and Backend
<br>
Aman - UI/UX Design
<br>
Disha - UI/UX Design 
<br>
