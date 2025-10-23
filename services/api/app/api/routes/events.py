from fastapi import APIRouter, Response
router = APIRouter()

@router.get("", summary="SSE de eventos do app (simulado)")
def sse():
    headers = {"Content-Type":"text/event-stream"}
    return Response(content="event: ping\ndata: ok\n\n", headers=headers)
