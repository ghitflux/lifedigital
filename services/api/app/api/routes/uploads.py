from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class PresignIn(BaseModel):
    kind: str
    contentType: str
    size: int

class PresignOut(BaseModel):
    urlPut: str
    objectKey: str

@router.post("/presign", response_model=PresignOut, summary="Gera URL pré-assinada para upload direto")
def presign(body: PresignIn):
    return {"urlPut":"https://minio/presigned-demo","objectKey":"contracheques/demo.jpg"}

class FinalizeIn(BaseModel):
    objectKey: str

@router.post("/finalize", summary="Finaliza upload e agenda varredura")
def finalize(body: FinalizeIn):
    return {"status":"PENDENTE_SCAN"}
