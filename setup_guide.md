# Intelligent Football League Prediction Dashboard

A full-stack application built with Django (REST Framework) and React to analyze, display, and predict football match outcomes using historical data and machine learning.

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.10+**
- **Node.js 18+**
- An active API key from [API-Football (API-Sports)](https://www.api-football.com/)

---

## ⚙️ 1. Backend Setup (Django)

Open your terminal and navigate to the backend directory:
```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

Create a .env file in the same directory as settings.py (backend/project/.env) and add the following keys:

SECRET_KEY=your-local-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
FOOTBALL_API_KEY=your_api_football_key_here

Run migrations to build the database tables:
python manage.py migrate
Fetch reference data (Leagues and Teams):
python manage.py fetch_reference_data
Fetch the 2024 season match fixtures:
python manage.py fetch_fixtures

python manage.py runserver

npm run dev