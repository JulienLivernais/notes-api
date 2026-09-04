import secrets
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from app.core.config import settings

STATE_EXPIRE_MINUTES = 5


def create_oauth_state() -> str:
    payload = {
        "nonce": secrets.token_urlsafe(16),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=STATE_EXPIRE_MINUTES),
        "typ": "oauth_state",
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm="HS256")


def verify_oauth_state(state: str) -> bool:
    try:
        payload = jwt.decode(state, settings.JWT_SECRET_KEY, algorithms=["HS256"])
    except JWTError:
        return False
    return payload.get("typ") == "oauth_state"