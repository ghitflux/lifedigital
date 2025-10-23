from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class GoogleAuthIn(BaseModel):
    id_token: str

class SessionOut(BaseModel):
    accessToken: str
    refreshToken: str | None = None
    user: dict

@router.post("/google", response_model=SessionOut, summary="Valida ID token do Google e cria sessão")
def auth_google(payload: GoogleAuthIn):
    # TODO: validar via google-auth (verify_oauth2_token)
    return {"accessToken":"dev-token", "refreshToken":None, "user":{"id":"demo","email":"user@demo"}}
