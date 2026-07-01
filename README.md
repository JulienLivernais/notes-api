NOTES API
----------
A backend API for managing personal notes with JWT authentication and role-based access control.

LIVE DEMO
----------
This API is deployed on Railway.
Swagger UI: https://notes-api-production-d765.up.railway.app/docs

These are demo credentials for portfolio review only.
- SUPERADMIN_EMAIL=admin123@email.com
- SUPERADMIN_PASSWORD=test456

Connect via POST /auth/login, use SUPERADMIN_EMAIL as username.
Click "Try it out" to test.

You can also register your own account via POST /auth/register.

FEATURES
----------
* Register and login with JWT authentication
* Secure password hashing with bcrypt
* OAuth2 password flow
* Role-based access control (user / admin)
* Create, read, update and delete personal notes
* User notes are private by design

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
- is_admin (bool)
- created_at

2. notes
- id
- user_id (FK → users.id)
- title
- content
- created_at
- updated_at

API
----------
Auth
* POST /auth/register
* POST /auth/login

Users
* GET    /users/me
* PATCH  /users/me
* DELETE /users/me

Notes
* GET    /notes
* POST   /notes
* GET    /notes/{id}
* PATCH  /notes/{id}
* DELETE /notes/{id}

Admin
* GET    /admin/users
* GET    /admin/users/{id}
* GET    /admin/users/by-email
* GET    /admin/users/by-username
* DELETE /admin/users/{id}

ARCHITECTURE APPLICATION
----------
* notes-api/
* app/ 
   * main.py
   * core/
      * config.py
      * database.py
      * security.py
      * dependencies.py
   * routers/
      * auth.py
      * users.py
      * notes.py
      * admin.py
   * models/
      * users.py
      * notes.py
   * schemas/
      * users.py
      * notes.py
   * repositories/
      * user_repository.py
* scripts/
   * create_admin.py
* tests/
   * conftest.py
   * test_admin.py
   * test_auth.py
   * test_notes.py
* alembic/
* .env.example
* .gitignore
* requirements.txt
* Dockerfile
* docker-compose.yml
* README.md

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

ADMIN ACCOUNT 
----------
User notes are private by design. Admins can manage user accounts but cannot access note content.

Create the admin account: 
- Run python -m scripts.create_admin to create the account.
- Then login via POST /auth/login to get a JWT token.

REGULAR USER
----------
Register via POST /auth/register

ROADMAP
----------
Phase 1 - MVP
* DB connection
* User model
* Register / login (JWT)
* Create / read notes

Phase 2 - Notes management
* Update / delete notes
* User can only access own notes

Phase 3 - Auth
* JWT token expiration
* OAuth2 password flow

Phase 4 - Admin
* Admin role
* Admin endpoints

Phase 5 - Testing
* Unit tests with Pytest
* Test authentication endpoints
* Test notes CRUD
* Test admin endpoints

Phase 6 - Docker
* Dockerized with Docker Compose
* PostgreSQL in a separate container
* Persistent data with volumes
* Custom network between containers

Phase 7 - Deployment
* Deployed on Railway
* Managed PostgreSQL database
* Environment variables for secrets configuration
* Automated migrations on deploy 
* Public Swagger UI for live testing
