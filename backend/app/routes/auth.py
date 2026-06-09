from urllib.parse import urlencode

from authlib.integrations.starlette_client import OAuthError
from fastapi import APIRouter, Depends, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.middleware.auth import create_access_token, get_current_user
from app.models.user import User
from app.oauth import oauth
from app.schemas.user import UserResponse
from app.services import auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.get("/login", summary="Inicia el flujo de login con Google OAuth 2.0")
async def login(request: Request):
    return await oauth.google.authorize_redirect(request, settings.google_redirect_uri)


@router.get(
    "/callback",
    summary="Callback de Google. Crea/actualiza el usuario, emite el JWT y redirige al frontend.",
)
async def callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError:
        return RedirectResponse(f"{settings.frontend_url}/auth/callback?error=oauth")

    userinfo = token.get("userinfo")
    if not userinfo or not userinfo.get("email"):
        return RedirectResponse(f"{settings.frontend_url}/auth/callback?error=no_email")

    user = auth_service.get_or_create_user(
        db,
        email=userinfo["email"],
        name=userinfo.get("name"),
        picture=userinfo.get("picture"),
    )
    jwt_token = create_access_token(user)
    query = urlencode({"token": jwt_token})
    return RedirectResponse(f"{settings.frontend_url}/auth/callback?{query}")


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Devuelve el usuario autenticado (incluye is_admin determinado en servidor).",
)
def me(user: User = Depends(get_current_user)):
    return user
