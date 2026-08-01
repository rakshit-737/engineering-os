from __future__ import annotations

from fastapi import APIRouter

from app.config import get_settings
from app.schemas import HealthStatus

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthStatus)
def health() -> HealthStatus:
    settings = get_settings()
    return HealthStatus(status="ok", app=settings.app_name, version=settings.app_version)
