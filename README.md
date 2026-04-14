# Football Prediction Dashboard

## Backend

- Django REST Framework
- Apps: `users`, `matches`, `predictions`
- `django-cors-headers` configured for `http://localhost:5173`
- Settings split into `project/settings/base.py`, `dev.py`, and `prod.py`
- `.env` support via `python-dotenv`

### Run backend

1. Create a Python virtual environment
2. Install dependencies: `pip install -r backend/requirements.txt`
3. Copy `backend/.env.example` to `backend/.env`
4. Run migrations: `python backend/manage.py migrate`
5. Start server: `python backend/manage.py runserver`

## Frontend

- React + Vite
- Ant Design UI
- Recharts charts
- Zustand state management
- Axios API service
- React Router navigation

### Run frontend

1. `cd frontend`
2. `npm install`
3. Copy `frontend/.env.example` to `frontend/.env`
4. `npm run dev`


