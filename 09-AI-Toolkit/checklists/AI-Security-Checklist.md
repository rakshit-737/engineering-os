---
title: AI Security Checklist
description: Security review checklist for LLM applications - threat modeling, prompt injection, data protection, supply chain, and operations.
domain: ai
category: checklists
type: checklist
difficulty: advanced
status: evergreen
tags: [security, llm, checklist, appsec, privacy]
prerequisites: [Prompt-Injection, Threat-Modeling-STRIDE]
related: [Guardrails, AI-Data-Leakage-and-Privacy, Adversarial-Inputs, Agent-Design-Checklist, OWASP-Top-10]
order: 30
---

# AI Security Checklist

Hub: [[AI-Engineering-Index]]

## Threat modeling

- [ ] Data-flow diagram includes model provider, vector DB, logs, caches, memory, tools
- [ ] STRIDE applied to each component ([[Threat-Modeling-STRIDE]])
- [ ] Trust boundaries marked: every untrusted input source listed (user, web, docs, email, tool results, images)
- [ ] Impact of a fully compromised model output assessed ("what is the worst it can do?")

## Prompt injection

- [ ] Secrets never placed in prompts; system prompt assumed public
- [ ] Untrusted content delimited and never granted instruction authority ([[Prompt-Injection]])
- [ ] Privileged tools separated from contexts that read untrusted content
- [ ] Human approval for irreversible or external actions
- [ ] Egress allowlist; markdown images/links from model output not auto-loaded
- [ ] Injection regression suite in CI

## Output handling

- [ ] Model output escaped before HTML rendering (XSS)
- [ ] Model output never passed directly to shell, SQL, eval, or file paths ([[SQL-Injection]])
- [ ] Structured outputs schema-validated ([[Structured-Output]])
- [ ] Generated package names/URLs validated against allowlists

## Access control and data

- [ ] Retrieval enforces per-user ACLs inside the query
- [ ] Tools use per-user credentials with least privilege ([[Least-Privilege]])
- [ ] Caches keyed by tenant and auth context
- [ ] PII/secret redaction on logs and traces ([[AI-Data-Leakage-and-Privacy]])
- [ ] Log/trace retention and access limits set
- [ ] Provider data retention and training-use terms reviewed

## Abuse and availability

- [ ] Authentication on all model endpoints; all model calls go through one gateway ([[Pattern-LLM-Gateway]])
- [ ] Rate limits and spend quotas per user/tenant
- [ ] Max input size, max output tokens, max agent steps
- [ ] Input normalization before filters ([[Adversarial-Inputs]])

## Supply chain

- [ ] Model weights from trusted sources, checksums verified, safe serialization formats
- [ ] Third-party MCP servers/plugins reviewed and version-pinned ([[MCP-Tool-Integration]])
- [ ] Dependencies scanned; AI SDKs kept updated
- [ ] Write access to RAG sources controlled (poisoning)

## Operations

- [ ] Guardrail decisions and tool calls audit-logged
- [ ] Alerts on anomalous tool destinations and spend spikes
- [ ] Incident runbook covers prompt injection and data leak scenarios
- [ ] Kill switch for tools/features
- [ ] Periodic red-team exercise scheduled

## Mapping to OWASP Top 10 for LLM Applications (2025 edition)

The list is revised periodically; confirm the edition you report against. Scope note: this checklist is the pre-launch gate. The *why* and the defense designs live in [[Prompt-Injection]] (attack mechanics), [[Guardrails]] (runtime input/output checks) and [[AI-Data-Leakage-and-Privacy]].

| OWASP LLM (2025) | Covered by sections above |
|---|---|
| LLM01 Prompt Injection | Prompt injection |
| LLM02 Sensitive Information Disclosure | Access control and data |
| LLM03 Supply Chain | Supply chain |
| LLM04 Data and Model Poisoning | Supply chain (RAG write access, weight provenance) |
| LLM05 Improper Output Handling | Output handling |
| LLM06 Excessive Agency | Prompt injection (tool separation, approvals), Access control |
| LLM07 System Prompt Leakage | Prompt injection (no secrets in prompts) |
| LLM08 Vector and Embedding Weaknesses | Access control (ACLs in retrieval), Supply chain (poisoning) |
| LLM09 Misinformation | Not a security control here - see [[Hallucination-Mitigation]] and [[Pattern-RAG-with-Citations]] |
| LLM10 Unbounded Consumption | Abuse and availability |

- [ ] Every OWASP LLM category above has an owner and at least one tested control

> TODO: map items to your organization's own security standards.
