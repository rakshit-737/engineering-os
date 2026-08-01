"""Pydantic schemas: the API contract lives here, not in DB models."""

from __future__ import annotations

from pydantic import BaseModel, Field


class ItemCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    price: float = Field(gt=0)
    description: str | None = Field(default=None, max_length=500)


class ItemRead(ItemCreate):
    id: int


class HealthStatus(BaseModel):
    status: str
    app: str
    version: str
