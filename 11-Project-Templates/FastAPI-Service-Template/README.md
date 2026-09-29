---
title: FastAPI Service Template
slug: fastapi-service-template
description: Production-shaped FastAPI REST service starter with Docker, settings, and tests.
domain: projects
category: templates
type: template
difficulty: intermediate
status: evergreen
tags: [python, api, docker]
prerequisites: []
related: [Project-Template-Backend, Docker-Microservice-Template]
order: 10
---
# FastAPI Service Template

Production-shaped starting point for any REST API project. Copy the folder, rename, and build.

## Features

- Layered layout: routers -> schemas -> repository seam
- Settings from environment variables (`.env` supported)
- Health endpoint for load balancers and uptime checks
- Dockerfile (multi-stage, non-root user) + docker-compose
- API tests with FastAPI TestClient

## Quick Start

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

Open http://127.0.0.1:8000/docs for interactive API docs.

## Run Tests

```bash
pip install pytest httpx
python -m pytest tests -v
```

## Run With Docker

```bash
docker compose up --build
```

## Extend

1. Add a schema in `app/schemas.py`
2. Add a router file in `app/routers/`
3. Register the router in `app/main.py`
4. Replace the in-memory dict in `app/routers/items.py` with a real database layer
5. Add tests in `tests/`

## Production Checklist

- [ ] Set `APP_ENV=production` and disable docs if API is private
- [ ] Put a reverse proxy (nginx/Caddy) or API gateway in front
- [ ] Add auth (OAuth2/JWT) before exposing write endpoints
- [ ] Add rate limiting and request size limits
- [ ] Wire structured logging + metrics (Prometheus/OpenTelemetry)
- [ ] Pin dependency versions and enable CI (see `08-Automation-Toolkit/github-actions`)
