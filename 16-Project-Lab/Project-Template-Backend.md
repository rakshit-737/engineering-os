---
title: "Project Template: Backend"
description: Project template additions and three scoped ideas for backend services.
domain: projects
category: templates
type: template
difficulty: intermediate
status: evergreen
tags: [backend, api, project]
prerequisites: [Project-Template]
related: [FastAPI-Service-Template, Checklist-Deployment]
order: 50
---
# Project Template: Backend

For API services and background workers. Start code from [[FastAPI-Service-Template]] or [[Docker-Microservice-Template]].

Start from [[Project-Template]] and add the sections below. Target levels refer to [[Project-Maturity-Model]].

## Domain-specific sections

- **API contract:** OpenAPI spec, error format, pagination, versioning
- **Data model and migrations:** schema, indexes, migration tool
- **Background work:** queues, jobs, retries, idempotency
- **Operational limits:** timeouts, rate limits, payload sizes

## Extra requirements

- [ ] OpenAPI spec published and tested.
- [ ] Integration tests against a real database container.
- [ ] Migrations run in CI.
- [ ] Structured JSON logs with request IDs.
- [ ] Health and readiness endpoints.

## Project ideas

### 1. URL shortener with analytics

- **Target level:** Level 3
- **Scope:** Shortener with custom aliases, expiry, click analytics, and abuse protection.
- **Stack:** FastAPI, Postgres, Redis cache, Docker
- **Milestones:**
  1. CRUD + redirect with caching
  2. Async click events and aggregation
  3. Rate limiting and malicious-URL checks
  4. Load test and dashboards
- **What makes it stand out:** Covers caching, async processing, and abuse handling with measured performance.

### 2. Job queue service

- **Target level:** Level 3
- **Scope:** Durable job queue with retries, backoff, dead-letter queue, and a small dashboard.
- **Stack:** Python, Postgres (`SKIP LOCKED`), FastAPI
- **Milestones:**
  1. Enqueue/dequeue with leases
  2. Retries with backoff and DLQ
  3. Idempotent handlers
  4. Dashboard and metrics
- **What makes it stand out:** Shows deep understanding of at-least-once processing.

### 3. Multi-tenant notes API

- **Target level:** Level 2
- **Scope:** Notes API with tenants, roles, and row-level security.
- **Stack:** FastAPI, Postgres RLS, JWT auth
- **Milestones:**
  1. Tenants and users
  2. RBAC and object-level checks
  3. Postgres row-level security
  4. Authorization test suite
- **What makes it stand out:** Tenant isolation proven by tests that try to cross boundaries.

All ideas are tracked in [[Project-Ideas-Backlog]]. Back to [[Project-Lab-Index]].
