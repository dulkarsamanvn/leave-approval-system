Leave Approval System

A full-stack web application for managing leave requests and approvals.  
Built with Django REST Framework (Backend), PostgreSQL (Database), and React (Frontend),Deployed on Render.


Features
- User authentication (JWT with HttpOnly cookies)
- Role-based access (Employees & Admins)
- Apply for leave
- Approve / Reject leave requests
- View leave history
- Responsive React frontend


Tech Stack
- **Backend**: Django, Django REST Framework, PostgreSQL
- **Frontend**: React + Vite
- **Deployment**: Render (Backend, Frontend, DB hosted separately)
- **Auth**: JWT Authentication (HttpOnly Cookies)
- **CORS**: Configured for frontend ↔ backend communication


Local Setup
### 1. Clone Repository
```bash
git clone https://github.com/<your-username>/leave-approval-system.git
cd leave-approval-system

Backend Setup

cd backend/leave_system
python -m venv env
source env/bin/activate   # On Windows: env\Scripts\activate
pip install -r requirements.txt

# Migrate DB
python manage.py migrate

# Run server
python manage.py runserver
Backend runs at 👉 http://127.0.0.1:8000


Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at 👉 http://localhost:5173


Environment Variables

SECRET_KEY=your_secret_key
DEBUG=False
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=5432


