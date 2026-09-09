import httpx
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.users import User

GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USER_URL = "https://api.github.com/user"
GITHUB_EMAILS_URL = "https://api.github.com/user/emails"


async def exchange_code_for_token(code: str) -> str | None:
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            GITHUB_TOKEN_URL,
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": settings.GITHUB_REDIRECT_URI,
            },
            headers={"Accept": "application/json"},
        )
    if response.status_code != 200:
        return None
    return response.json().get("access_token")


async def fetch_github_profile(access_token: str) -> dict | None:
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/vnd.github+json",
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        user_response = await client.get(GITHUB_USER_URL, headers=headers)
        emails_response = await client.get(GITHUB_EMAILS_URL, headers=headers)

    if user_response.status_code != 200 or emails_response.status_code != 200:
        return None

    profile = user_response.json()
    verified_email = next(
        (
            item["email"]
            for item in emails_response.json()
            if item.get("primary") and item.get("verified")
        ),
        None,
    )
    if verified_email is None:
        return None

    return {
        "provider_account_id": str(profile["id"]),
        "email": verified_email,
        "login": profile["login"],
    }


def generate_unique_username(db: Session, base: str) -> str:
    candidate = base[:30]
    suffix = 1
    while db.query(User).filter(User.username == candidate).first():
        suffix_str = str(suffix)
        candidate = f"{base[:30 - len(suffix_str)]}{suffix_str}"
        suffix += 1
    return candidate