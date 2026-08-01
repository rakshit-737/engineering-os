"""API tests. Requires: pip install pytest httpx"""

from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_create_and_get_item() -> None:
    created = client.post("/items", json={"name": "widget", "price": 9.5})
    assert created.status_code == 201
    item_id = created.json()["id"]

    fetched = client.get(f"/items/{item_id}")
    assert fetched.status_code == 200
    assert fetched.json()["name"] == "widget"


def test_validation_rejects_bad_price() -> None:
    response = client.post("/items", json={"name": "widget", "price": -1})
    assert response.status_code == 422


def test_missing_item_404() -> None:
    assert client.get("/items/999999").status_code == 404
