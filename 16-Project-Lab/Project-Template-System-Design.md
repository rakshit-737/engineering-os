---
title: "Project Template: System Design"
description: Project template additions and three scoped ideas that implement a system design case study.
domain: projects
category: templates
type: template
difficulty: intermediate
status: evergreen
tags: [system-design, project]
prerequisites: [Project-Template]
related: [Patterns-Index, Pattern-Circuit-Breaker]
order: 80
---
# Project Template: System Design

For turning a whiteboard design into a working, measured system. The value is comparing the design's assumptions with measurements.

Start from [[Project-Template]] and add the sections below. Target levels refer to [[Project-Maturity-Model]].

## Domain-specific sections

- **Requirements and estimates:** functional, non-functional, and capacity estimates stated as assumptions
- **Design doc:** HLD diagram, data model, API, and tradeoffs, written before coding
- **Measurement plan:** what you will load test and what result would falsify the design
- **Design vs reality:** a section written after load testing comparing estimates with measurements

## Extra requirements

- [ ] Design doc committed before implementation.
- [ ] Load test scripts in the repo (k6 or Locust).
- [ ] Each scaling mechanism justified by a measurement.
- [ ] Failure scenarios tested (kill a node, fill a disk, slow a dependency).

## Project ideas

### 1. News feed service

- **Target level:** Level 4
- **Scope:** Fan-out-on-write feed with a hybrid path for high-follower accounts.
- **Stack:** Python or Go, Redis, Postgres, Kafka, k6
- **Milestones:**
  1. Design doc
  2. Fan-out on write
  3. Hybrid fan-out for large accounts
  4. Load test and design-vs-reality write-up
- **What makes it stand out:** Quantified tradeoff between write amplification and read latency.

### 2. Distributed cache with consistent hashing

- **Target level:** Level 3
- **Scope:** Cache cluster client with consistent hashing, replication, and node add/remove.
- **Stack:** Go, gRPC, Docker Compose
- **Milestones:**
  1. Single node LRU
  2. Consistent hashing ring with virtual nodes
  3. Replication and failover
  4. Measure key movement on rebalance
- **What makes it stand out:** Measured key redistribution matches theory.

### 3. Notification system

- **Target level:** Level 3
- **Scope:** Multi-channel notifications with preferences, rate limits, retries, and deduplication.
- **Stack:** Python, RabbitMQ, Postgres, provider sandboxes
- **Milestones:**
  1. Design doc
  2. Queue per channel with retries
  3. Dedup and user preferences
  4. Failure tests and metrics
- **What makes it stand out:** Covers idempotency, backpressure, and provider failures end to end.

All ideas are tracked in [[Project-Ideas-Backlog]]. Back to [[Project-Lab-Index]].
