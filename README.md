NOTES API
----------

[![CI](https://github.com/JulienLivernais/notes-api/actions/workflows/ci.yml/badge.svg)](https://github.com/JulienLivernais/notes-api/actions/workflows/ci.yml)

A full-stack notes application: a FastAPI backend with JWT authentication and role-based access control, 
and a React frontend.


DEPLOYMENT
----------
This API is deployed on Railway:

* App: https://notes-api-production-d765.up.railway.app
Create an account from the app, or sign in with GitHub

* Swagger UI: https://notes-api-production-d765.up.railway.app/docs
Connect via POST /auth/login or create your own account via POST /auth/register.

FEATURES
----------
BACKEND
* Register and login with JWT authentication (access + refresh tokens)
* Secure password hashing with bcrypt
* OAuth2 password flow
* Role-based access control (user / admin)
* Create, read, update and delete personal notes
* User notes are private by design (admins can manage user accounts but cannot access note content)
* Password change requires current password verification
* Admin: list users, search by email or username, delete accounts

FRONTEND
* Login, registration and GitHub sign in
* Profile page: update username and email, change password, delete account
* Admin page: list, search and delete users (visible to admins only)
* Automatic access token refresh: users stay logged in without re-entering the password

STACK
----------
BACKEND
* Python
* FastAPI
* PostgreSQL
* SQLAlchemy
* Alembic
* Pydantic
* JWT
* OAuth2
* Docker

FRONTEND
* React
* Vite
* JavaScript (fetch API)
* HTML/CSS

DATABASE
----------
1. users
- id
- username
- email
- hashed_password
- is_admin
- created_at

2. notes
- id
- user_id
- title
- content
- created_at
- updated_at

3. oauth_accounts
- id
- user_id
- provider
- provider_account_id
- created_at

SETUP IN LOCAL 
----------
1. Clone the repository
2. Create a virtual environment and activate it
3. Install dependencies: pip install -r requirements.txt
4. Copy .env.example to .env and fill in the values
5. Create the PostgreSQL database: notesdb
6. Run migrations: alembic upgrade head
7. Create admin account: python -m scripts.create_admin
8. Start the server: uvicorn app.main:app --reload --port 8001
9. Open API docs: http://localhost:8001/docs

SETUP WITH DOCKER
----------
1. Clone the repository git clone https://github.com/JulienLivernais/notes-api
2. Navigate to the project: cd notes-api
3. Copy the environment file: .env.example .env
4. Build and start the containers: docker compose up --build
5. Run database migrations: docker compose exec app alembic upgrade head
6. Create the admin account: docker compose exec app python -m scripts.create_admin
7. Open API docs: http://localhost:8001/docs
8. Stop the containers when done: docker compose down

ROADMAP
----------
* JWT auth (access + refresh via login/register)
* Notes CRUD, private per user
* Role-based access (user / admin)
* Pytest test suite
* Dockerized with Compose
* Deployed on Railway with managed Postgres
* Refresh token endpoint
* GitHub OAuth login
* CI with GitHub Actions
* React frontend (Vite)
* GitHub login and automatic token refresh in the frontend
* Frontend served by FastAPI


