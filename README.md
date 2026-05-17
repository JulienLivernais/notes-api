NOTES API
----------
A backend API for managing personal notes with JWT authentication and role-based access control.

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
* alembic/
* .env.example
* .gitignore
* requirements.txt
* README.md

SETUP
----------
1. Clone the repository
2. Create a virtual environment and activate it
3. Install dependencies: pip install -r requirements.txt
4. Copy .env.example to .env and fill in the values
5. Create the database: notesdb
6. Run migrations: alembic upgrade head
7. Create admin account: python -m scripts.create_admin
8. Start the server: uvicorn app.main:app --reload
9. Open API docs: http://localhost:8000/docs

ADMIN ACCOUNT 
----------
User notes are private by design. Admins can manage user accounts but cannot access note content.

⚠️ These are demo credentials for portfolio review only.
- SUPERADMIN_EMAIL=admin123@email.com / SUPERADMIN_PASSWORD=test456
- To create the admin account run: python -m scripts.create_admin. Then login via POST /auth/login to get a JWT token.

REGULAR USER
----------
Register via POST /auth/register

ROADMAP
----------
Phase 1 - MVP (completed)
* DB connection
* User model
* Register / login (JWT)
* Create / read notes

Phase 2 - Notes management (completed)
* Update / delete notes
* User can only access own notes

Phase 3 - Auth (completed)
* JWT token expiration
* OAuth2 password flow

Phase 4 - Testing (not started)
* Unit tests with Pytest
* Test authentication endpoints
* Test notes CRUD
* Test admin endpoints

Phase 5 - Testing (not started)
* Unit tests with Pytest
* Test authentication endpoints
* Test notes CRUD
* Test admin endpoints

NOTES
----------
This API is a portfolio project focused on backend fundamentals including
authentication, database design, and clean architecture.

