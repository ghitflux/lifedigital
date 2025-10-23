from fastapi import APIRouter
from .routes import auth, profile, uploads, margin, simulations, events, webhooks
router = APIRouter()
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(profile.router, prefix="/me", tags=["profile"])
router.include_router(uploads.router, prefix="/uploads", tags=["uploads"])
router.include_router(margin.router, prefix="/margem", tags=["margem"])
router.include_router(simulations.router, prefix="/simulacoes", tags=["simulacoes"])
router.include_router(events.router, prefix="/events", tags=["events"])
router.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
