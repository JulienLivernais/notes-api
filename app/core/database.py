from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.core.config import settings


class Base(DeclarativeBase):
    pass

# ENGINE
engine = create_engine(settings.DATABASE_URL)

# SESSION
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# SYNC
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# alembic init alembic
# pgadmin