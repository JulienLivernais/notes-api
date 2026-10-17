from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routers import auth, notes, users, admin

app = FastAPI()

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(notes.router)
app.include_router(admin.router)


static_dir = Path(__file__).parent.parent / "static"
if static_dir.exists():
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

