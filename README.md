NOTES API
A backend API for managing personal notes with JWT authentication and role-based access control.

FEATURES

* Register and login with JWT authentication
* Secure password hashing with bcrypt
* OAuth2 password flow
* Role-based access control (user / admin)
* Create, read, update and delete personal notes

STACK

* Python
* FastAPI
* PostgresSQL
* SQLAlchemy
* Alembic
* Pydantic
* JWT
* OAuth2

DATABASE

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

* POST /auth/register
* POST /auth/login
* GET  /users/me
* GET  /notes
* POST /notes
* PUT  /notes/{id}
* DELETE /notes/{id}

ARCHITECTURE APPLICATION

* notes-api/
* app/
   * main.py
   * auth/
      * hashing.py
      * jwt.py
      * dependencies.py
   * routers/
      * auth.py
      * users.py
      * notes.py
   * models/
      * users.py
      * notes.py
   * schemas/
      * users.py
      * notes.py
   * core/
      * config.py
      * database.py
* scripts/
   * create_admin.py
* alembic/
* .env.example
* .gitignore
* requirements.txt
* README.md

SETUP

1. Clone the repository
2. Create a virtual environment and activate it
3. Install dependencies: pip install -r requirements.txt
4. Copy .env.example to .env and fill in the values
5. Run migrations: alembic upgrade head
6. Start the server: uvicorn app.main:app --reload
7. Open API docs: http://localhost:8000/docs

ADMIN ACCOUNT 
User notes are private by design. 
Admins can manage user accounts but cannot access note content.

Admin can NOT read note content
Admin can only see metadata:
- how many notes a user has
- note titles only

ROADMAP

* Phase 1 - MVP (completed)
* DB connection
* User model
* Register / login (JWT)
* Create / read notes

* Phase 2 - Notes management (completed)
* Update / delete notes
* User can only access own notes

* Phase 3 - Auth (completed)
* JWT token expiration
* OAuth2 password flow

* Phase 4 - Admin (in progress)
* Admin role
* Admin endpoints

* Phase 5 - Advanced auth
* Refresh tokens

NOTES
This API is a portfolio project focused on backend fundamentals including
authentication, database design, and clean architecture.

