from __future__ import annotations

from fastapi import FastAPI

from app.config import get_settings
from app.routers import health, items


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        docs_url="/docs" if settings.app_env != "production" else None,
    )
    app.include_router(health.router)
    app.include_router(items.router)
    return app


app = create_app()
