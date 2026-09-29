---
title: Secure Defaults
description: Make the safe configuration the default so insecure behavior requires an explicit, visible opt-in.
domain: patterns
category: security
type: pattern
difficulty: beginner
status: evergreen
tags: [security, configuration]
prerequisites: []
related: [Pattern-Defense-in-Depth, Pattern-Input-Validation-at-Boundaries]
order: 140
---
# Secure Defaults

## Problem

Most misconfigurations are defaults nobody changed: debug mode in production, permissive CORS, public buckets, admin/admin credentials, TLS verification disabled "temporarily". Secure behavior that depends on everyone remembering to turn it on will be missed.

## Solution

Design settings so the zero-configuration state is the safe one: deny by default, least privilege, TLS verification on, debug off, cookies `Secure; HttpOnly; SameSite`. Insecure options require explicit flags with loud names, are logged at startup, and are refused in production environments. Fail closed when required configuration is missing.

## Example

```python
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    env: str = "production"                 # default to the strictest environment
    debug: bool = False
    allowed_origins: list[str] = []         # no CORS unless configured
    session_cookie_secure: bool = True
    verify_tls: bool = True
    secret_key: str = Field(min_length=32)  # no default: app refuses to start without it

    @field_validator("debug", "verify_tls", mode="after")
    @classmethod
    def forbid_unsafe_in_prod(cls, v, info):
        env = info.data.get("env", "production")
        if env == "production" and ((info.field_name == "debug" and v) or
                                    (info.field_name == "verify_tls" and not v)):
            raise ValueError(f"{info.field_name}={v} is not allowed in production")
        return v

settings = Settings()   # raises at startup on a missing secret or unsafe prod config
```

## Tradeoffs

- Slightly more friction for local development (provide a documented dev profile).
- Fail-closed startup can cause outages if configuration management is sloppy, which is usually preferable to running insecurely.

## Failure modes

- Dev-mode overrides leaking into production through a shared `.env`.
- Library defaults (e.g. an HTTP client with no timeout, or a YAML loader that constructs objects) silently undermine your own defaults.
- Opt-out flags with innocent names (`SKIP_CHECKS=1`).

## Security implications

- Secure defaults reduce the blast radius of human error, which is the dominant cause of misconfiguration incidents.
- Audit third-party defaults at adoption time and pin them explicitly in config.

## When to use

- Every library, service, template, and CLI you ship, especially ones others will copy (such as [[FastAPI-Service-Template]]).

## When not to use

- There is no case for insecure defaults; the only question is how much convenience a documented dev profile provides.

Back to [[Patterns-Index]].
