---
title: AI Architecture Reference
description: Reference diagrams for common LLM system architectures - RAG pipeline, agent loop, evaluation pipeline, and LLM gateway with fallback.
domain: ai
category: templates
type: template
difficulty: intermediate
status: evergreen
tags: [template, architecture, rag, agents, gateway, mermaid]
prerequisites: [RAG-Playbook, AI-Agents]
related: [AI-Project-Template, LLM-Evaluation-Pipelines, LLM-Cost-Optimization, Guardrails]
order: 30
---

# AI Architecture Reference

Hub: [[AI-Engineering-Index]]

Copy a diagram into your design doc ([[AI-Project-Template]]) and replace `<placeholders>` with your components.

## 1. RAG pipeline

```mermaid
flowchart LR
  subgraph Offline ingestion
    S[(Sources)] --> P[Parse + clean]
    P --> C[Chunk]
    C --> E[Embed]
    E --> V[(Vector index)]
    C --> K[(BM25 index)]
  end
  subgraph Online query
    Q[User query] --> AU[AuthN/Z]
    AU --> QR[Query rewrite]
    QR --> H[Hybrid retrieve with ACL filter]
    V --> H
    K --> H
    H --> RR[Rerank]
    RR --> PR[Prompt assembly]
    PR --> L[LLM via gateway]
    L --> GV[Output guardrails + citation check]
    GV --> A[Answer + sources]
  end
```

Notes: [[RAG-Playbook]], [[Chunking-Strategies]], [[Hybrid-Search-and-Reranking]], [[Hallucination-Mitigation]].

## 2. Agent loop

```mermaid
flowchart TD
  G[Goal] --> M[LLM: decide next action]
  M -->|tool call| PV[Policy: schema, authz, allowlist]
  PV -->|needs approval| HU[Human approval]
  PV -->|allowed| X[Execute tool in sandbox]
  HU --> X
  X --> OB[Observation - untrusted]
  OB --> MEM[(Working memory)]
  MEM --> M
  M -->|final| F[Answer]
  M -->|budget exceeded| F
```

Notes: [[AI-Agents]], [[Agent-Memory]], [[MCP-Tool-Integration]], [[Agent-Design-Checklist]].

## 3. Evaluation pipeline

```mermaid
flowchart LR
  PR[PR: prompt/model/config change] --> CI[CI eval runner]
  DS[(Versioned datasets)] --> CI
  CI --> SC[Scorers: deterministic + judge]
  SC --> GT{Gate vs baseline}
  GT -- fail --> BL[Block + diff report]
  GT -- pass --> CN[Canary]
  CN --> ON[Online eval: sampled traces + feedback]
  ON --> TR[Triage failures]
  TR --> DS
```

Notes: [[LLM-Evaluation-Pipelines]], [[LLM-Evaluation-Framework]].

## 4. LLM gateway with fallback

```mermaid
flowchart LR
  APP[Services] --> GW[LLM gateway]
  subgraph GW_inner[Gateway responsibilities]
    AUTH[Auth + quotas]
    RED[PII redaction]
    CACHE[Response cache - keyed by tenant]
    ROUTE[Router: task/complexity]
    CB[Retries, timeouts, circuit breaker]
    LOG[Tracing + cost attribution]
  end
  GW --> AUTH --> RED --> CACHE --> ROUTE --> CB
  CB --> P1[Primary model]
  CB -->|error / timeout / breaker open| P2[Fallback model or provider]
  CB -->|all failed| DEG[Degraded response]
  CB --> LOG
```

Notes: [[LLM-Cost-Optimization]], [[LLM-Latency-Optimization]], [[LLM-Observability]], [[Guardrails]].

## Component checklist per diagram

| Component | Owner | Technology | SLO | Notes |
|---|---|---|---|---|
| `<component>` | `<team>` | `<choice>` | `<latency/availability>` | `<>` |
