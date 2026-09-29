---
title: Agent Design Checklist
description: Checklist for scoping, building, securing and operating LLM agents and multi-agent systems.
domain: ai
category: checklists
type: checklist
difficulty: advanced
status: evergreen
tags: [agents, checklist, tool-calling, security]
prerequisites: [AI-Agents]
related: [Multi-Agent-Systems, Agent-Memory, MCP-Tool-Integration, Prompt-Injection, AI-Security-Checklist]
order: 20
---

# Agent Design Checklist

Hub: [[AI-Engineering-Index]]

## Scoping

- [ ] Confirmed a fixed workflow or router cannot solve the task ([[AI-Agents]])
- [ ] Task success criteria defined and measurable
- [ ] Single agent tried before multi-agent ([[Multi-Agent-Systems]])
- [ ] Irreversible or external actions listed explicitly

## Tools

- [ ] Each tool has a clear name, description, and JSON Schema ([[Tool-Calling-and-Function-Calling]])
- [ ] Tool set minimized per task; no unused tools exposed
- [ ] Arguments validated server-side before execution
- [ ] Tools are idempotent or have idempotency keys where retried
- [ ] Tool results truncated or summarized to protect context
- [ ] Tool errors returned to the model as structured messages
- [ ] Third-party MCP servers reviewed, pinned, and scoped ([[MCP-Tool-Integration]])

## Control loop

- [ ] Max steps, max tokens, max wall time, max spend per task
- [ ] Repeat/loop detection (same tool + same args)
- [ ] Explicit stop condition and final-answer format
- [ ] Planning strategy chosen (ReAct, plan-and-execute, router)
- [ ] Graceful degradation when limits hit (partial result + reason)

## Memory and state

- [ ] Context compaction/summarization strategy defined ([[Agent-Memory]])
- [ ] Long-term memory writes validated and provenance-tagged
- [ ] Per-user isolation of memory; user can view/delete
- [ ] State checkpointed so long tasks can resume

## Security

- [ ] Agent acts with the end user's permissions, not a superuser ([[Least-Privilege]])
- [ ] No single context combines private data, untrusted content, and an exfiltration channel
- [ ] Human approval required for irreversible/external actions
- [ ] Egress allowlist for network tools
- [ ] All tool outputs and inter-agent messages treated as untrusted ([[Prompt-Injection]])
- [ ] Code execution sandboxed (no host access, resource limits, no secrets)

## Evaluation

- [ ] Scenario suite with expected outcomes and forbidden actions
- [ ] Trajectory checks, not only final answer
- [ ] Injection and adversarial scenarios included ([[Adversarial-Inputs]])
- [ ] Cost and latency per task measured

## Operations

- [ ] Every step traced with a shared trace ID ([[LLM-Observability]])
- [ ] Audit log of all side-effecting tool calls
- [ ] Alerts on step count, tool error rate, and spend anomalies
- [ ] Kill switch to disable tools or the agent quickly
