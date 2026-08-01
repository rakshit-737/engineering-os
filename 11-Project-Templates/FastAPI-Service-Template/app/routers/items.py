"""Item CRUD endpoints backed by an in-memory store.

Replace the module-level dict with a repository class (database, cache, etc.)
when moving past prototyping — handlers should not change.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.schemas import ItemCreate, ItemRead

router = APIRouter(prefix="/items", tags=["items"])

_items: dict[int, ItemRead] = {}
_next_id = 1


@router.post("", response_model=ItemRead, status_code=status.HTTP_201_CREATED)
def create_item(payload: ItemCreate) -> ItemRead:
    global _next_id
    item = ItemRead(id=_next_id, **payload.model_dump())
    _items[item.id] = item
    _next_id += 1
    return item


@router.get("", response_model=list[ItemRead])
def list_items() -> list[ItemRead]:
    return list(_items.values())


@router.get("/{item_id}", response_model=ItemRead)
def get_item(item_id: int) -> ItemRead:
    if item_id not in _items:
        raise HTTPException(status_code=404, detail="Item not found")
    return _items[item_id]


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int) -> None:
    if item_id not in _items:
        raise HTTPException(status_code=404, detail="Item not found")
    del _items[item_id]
