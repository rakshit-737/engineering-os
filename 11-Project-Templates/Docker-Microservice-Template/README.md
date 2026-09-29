---
title: Docker Microservice Template
slug: docker-microservice-template
description: Stdlib-only containerized background worker with graceful shutdown and JSON logs.
domain: projects
category: templates
type: template
difficulty: intermediate
status: evergreen
tags: [docker, python]
prerequisites: []
related: [FastAPI-Service-Template]
order: 20
---
# Docker Microservice Template (Worker Pattern)

Minimal background-worker service: no web framework, stdlib only. Use for queue consumers, schedulers, file processors, scrapers, and pipeline stages.

Pair with `FastAPI-Service-Template` when the service needs an HTTP API instead.

## What It Demonstrates

- Graceful shutdown on SIGTERM/SIGINT (required for clean container stops)
- Structured JSON logging to stdout (12-factor: logs are event streams)
- Config from environment variables only
- Multi-stage Dockerfile with non-root user
- Healthcheck via heartbeat file

## Run Locally

```bash
python worker.py
# Ctrl+C -> watch it finish the current job then exit cleanly
```

## Run With Docker

```bash
docker compose up --build
docker compose down     # sends SIGTERM; worker exits gracefully
```

## Extend

1. Replace `fetch_job()` with your real source (Redis/RabbitMQ/SQS/DB poll)
2. Replace `process_job()` with your business logic
3. Keep jobs idempotent — assume at-least-once delivery
4. Add a dead-letter path for jobs that fail repeatedly
5. Emit metrics (processed count, failure count, latency) for alerting

## Production Checklist

- [ ] Set restart policy (`restart: unless-stopped` or orchestrator equivalent)
- [ ] Bound memory/CPU in compose or Kubernetes manifests
- [ ] Make shutdown grace period > longest expected job
- [ ] Alert on heartbeat staleness, not just container liveness
