NOTES API
----------
A backend API for managing personal notes with JWT authentication and role-based access control.

DEPLOYMENT
----------
This API is deployed on Railway.
Swagger UI: https://notes-api-production-d765.up.railway.app/docs

These are demo credentials for portfolio review only.
- SUPERADMIN_EMAIL=admin123@email.com
- SUPERADMIN_PASSWORD=test456

Connect via POST /auth/login (use SUPERADMIN_EMAIL as username), or create your own account via POST /auth/register.

FEATURES
----------
* Register and login with JWT authentication
* Secure password hashing with bcrypt
* OAuth2 password flow
* Role-based access control (user / admin)
* Create, read, update and delete personal notes
* User notes are private by design (admins can manage user accounts but cannot access note content)

STACK
----------
* Python
* FastAPI
* PostgreSQL
* SQLAlchemy
* Alembic
* Pydantic
* JWT
* OAuth2
* Docker

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

SETUP IN LOCAL 
----------
1. Clone the repository
2. Create a virtual environment and activate it
3. Install dependencies: pip install -r requirements.txt
4. Copy .env.example to .env and fill in the values
5. Create the PostgreSQL database: notesdb
6. Run migrations: alembic upgrade head
7. Create admin account: python -m scripts.create_admin
8. Start the server: uvicorn app.main:app --reload
9. Open API docs: http://localhost:8000/docs

SETUP WITH DOCKER
----------
1. Clone the repository git clone https://github.com/JulienLivernais/notes-api
2. Navigate to the project: cd notes-api
3. Copy the environment file: .env.example .env
4. Build and start the containers: docker compose up --build
5. Run database migrations: docker compose exec app alembic upgrade head
6. Create the admin account: docker compose exec app python -m scripts.create_admin
7. Open API docs: http://localhost:8000/docs
8. Stop the containers when done: docker compose down

ROADMAP
----------
* JWT auth (access + refresh via login/register)
* Notes CRUD, private per user
* Role-based access (user / admin)
* Pytest test suite
* Dockerized with Compose
* Deployed on Railway with managed Postgres
