from fastapi import APIRouter
router = APIRouter()

@router.get("", summary="Obtém margem atual do cliente")
def get_margin():
    return {"totalDisponivel": 5240, "bruto": 6000, "utilizado": 760, "atualizadoEm": "2025-10-20T12:00:00Z",
            "historico":[{"mes":"2025-10","valor":5240},{"mes":"2025-09","valor":4200},{"mes":"2025-08","valor":4100}]}
