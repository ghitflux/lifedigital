from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()

class CPFIn(BaseModel):
    cpf: str = Field(..., examples=["00000000000"])

class PhoneIn(BaseModel):
    phoneE164: str = Field(..., examples=["+5511999999999"])

class OTPVerifyIn(BaseModel):
    code: str = Field(..., examples=["123456"])

@router.put("/cpf", summary="Define CPF do usuário")
def set_cpf(body: CPFIn): return {"ok": True}

@router.put("/whatsapp", summary="Inicia verificação do WhatsApp (envia OTP)")
def set_whatsapp(body: PhoneIn): return {"sent": True}

@router.post("/whatsapp/verify", summary="Verifica OTP recebido via WhatsApp")
def verify_whatsapp(body: OTPVerifyIn): return {"verified": True}
