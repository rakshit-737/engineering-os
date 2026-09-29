---
title: Contract Testing
description: Verify that a provider API satisfies the exact expectations of its consumers without full end-to-end environments.
domain: patterns
category: testing
type: pattern
difficulty: intermediate
status: evergreen
tags: [testing, api, microservices]
prerequisites: []
related: [Pattern-API-Versioning, Pattern-Test-Pyramid]
order: 220
---
# Contract Testing

## Problem

Microservices tested in isolation pass, then break in integration because the provider renamed a field the consumer relied on. Full end-to-end environments to catch this are slow, shared, and flaky.

## Solution

Consumer tests record the requests they make and the response shape they need into a contract (Pact is the common tool). The contract is published to a broker. The provider's CI replays each consumer contract against the real provider and fails if any expectation breaks. Deployment gates (`can-i-deploy`) check compatibility between the versions about to run together.

## Example

```python
# Consumer side (pact-python): the web app needs GET /users/1 -> {id, name}
import atexit, requests
from pact import Consumer, Provider, Like

pact = Consumer("web-app").has_pact_with(Provider("user-service"), port=1234)
pact.start_service(); atexit.register(pact.stop_service)

def get_user(base, uid):
    return requests.get(f"{base}/users/{uid}", timeout=2).json()

def test_get_user_contract():
    (pact.given("user 1 exists")
         .upon_receiving("a request for user 1")
         .with_request("GET", "/users/1")
         .will_respond_with(200, body={"id": 1, "name": Like("Ada")}))
    with pact:
        assert get_user(pact.uri, 1)["id"] == 1
# The generated pact JSON is published to the broker; user-service CI verifies it
# against a running provider with provider-state setup for "user 1 exists".
```

## Tradeoffs

- Catches integration breaks early and cheaply, but only for interactions consumers declared.
- Requires broker infrastructure and discipline across teams.

## Failure modes

- Consumers over-specify (exact values instead of matchers) and make contracts brittle.
- Provider states not implemented faithfully, so verification passes against fake data.
- Contracts not gated at deploy time, so incompatible versions still ship.

## Security implications

- Contracts document API shapes; keep brokers access-controlled if APIs are internal.
- Include error and auth-failure interactions (401/403) in contracts so security behavior is also pinned.

## When to use

- Several services owned by different teams, APIs with known consumers.

## When not to use

- Public APIs with unknown consumers (use schema/OpenAPI compatibility checks), or a monolith.

Back to [[Patterns-Index]].
