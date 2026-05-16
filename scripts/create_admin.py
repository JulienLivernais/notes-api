from app.core.database import SessionLocal
from app.core.security import hash_password
from app.core.config import settings
from app.models.users import User
from app.models import notes

def create_admin():
    db = SessionLocal()

    existing = db.query(User).filter(User.email == settings.SUPERADMIN_EMAIL).first()
    if existing:
        print("Admin already exists!")
        return

    admin = User(
        username="admin",
        email=settings.SUPERADMIN_EMAIL,
        hashed_password=hash_password(settings.SUPERADMIN_PASSWORD),
        is_admin=True
    )
    db.add(admin)
    db.commit()
    print("Admin created successfully!")
    db.close()


if __name__ == "__main__":
    create_admin()

