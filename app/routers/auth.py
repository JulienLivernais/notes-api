from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.models.users import User
from app.schemas.users import UserCreate, UserResponse

from urllib.parse import urlencode
from fastapi.responses import RedirectResponse
from app.core.config import settings
from app.core.oauth_state import create_oauth_state

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # create new user
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hash_password(user_data.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")


    return {
        "access_token": create_access_token(data={"sub": str(user.id)}),
        "refresh_token": create_refresh_token(data={"sub": str(user.id)}),
        "token_type": "bearer",
    }


# ///////////////////////////////////////////////
# GITHUB AUTHENTIFICATION

GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize"

@router.get("/github/login", include_in_schema=False)
def github_login():
    params = {
        "client_id": settings.GITHUB_CLIENT_ID,
        "redirect_uri": settings.GITHUB_REDIRECT_URI,
        "scope": "user:email",
        "state": create_oauth_state(),
    }
    return RedirectResponse(
        url=f"{GITHUB_AUTHORIZE_URL}?{urlencode(params)}",
        status_code=302,
    )

@router.post("/refresh")
def refresh(refresh_token: str = Body(..., embed=True)):
    payload = decode_token(refresh_token, expected_type="refresh")
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    return {
        "access_token": create_access_token(data={"sub": payload["sub"]}),
        "token_type": "bearer",
    }