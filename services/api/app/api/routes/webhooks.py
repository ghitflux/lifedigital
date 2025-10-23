from fastapi import APIRouter
router = APIRouter()

@router.post("/web", summary="Recebe eventos do sistema web (placeholder)")
def in_web(): return {"ok":True}

@router.post("/out", summary="Envia eventos ao sistema web (placeholder)")
def out_web(): return {"ok":True}
