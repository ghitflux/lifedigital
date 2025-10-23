from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class SimIn(BaseModel):
    produto: str
    parametros: dict

@router.post("", summary="Cria simulação")
def create_sim(body: SimIn):
    return {"id":"sim-1234","status":"EM_ANALISE"}

@router.get("/{sim_id}", summary="Obtém detalhe da simulação")
def get_sim(sim_id:str):
    return {"id":sim_id,"status":"APROVADA","resultado":{"cet":0.023,"parcela":1613.31,"total":83447.21}}

@router.post("/{sim_id}/aceite", summary="Confirma aceite do cliente")
def approve(sim_id:str): return {"status":"ACEITE_RECEBIDO"}
