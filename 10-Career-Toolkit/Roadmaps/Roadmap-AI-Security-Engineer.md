---
title: Roadmap -- AI Security Engineer
description: Path to AI security roles -- securing LLM applications and ML pipelines against prompt injection, data leakage, poisoning and model abuse.
domain: career
category: roadmaps
type: roadmap
role: "AI Security Engineer"
difficulty: advanced
status: evergreen
tags: [ai-security, llm, appsec]
related: [Roadmap-AI-Engineer, Roadmap-Application-Security-Engineer, Threat-Modeling-STRIDE]
order: 100
---

# Roadmap -- AI Security Engineer

**What the role does:** an emerging role combining AppSec and ML: threat modeling AI systems, red-teaming LLM apps, building guardrails and monitoring, and securing the ML supply chain. Titles and scope vary widely between companies.

## Stage 1 -- Foundation
- [ ] AppSec fundamentals ([[OWASP-Top-10]], [[Authentication-vs-Authorization]], [[Least-Privilege]])
- [ ] ML and LLM basics ([[Transformer-Architecture]], [[Embeddings]], [[LLM-Prompt-Engineering]])
- [ ] Python and one web framework

## Stage 2 -- Core
- [ ] OWASP Top 10 for LLM Applications: prompt injection (direct and indirect), insecure output handling, sensitive info disclosure, excessive agency
- [ ] RAG-specific risks: poisoned documents, cross-tenant retrieval ([[RAG-Retrieval-Augmented-Generation]])
- [ ] Threat modeling AI systems ([[Threat-Modeling-STRIDE]], [[Threat-Model-Template]]); MITRE ATLAS as a reference
- [ ] Adversarial ML concepts: evasion, poisoning, model extraction, membership inference

## Stage 3 -- Specialization
- [ ] Guardrail design: input/output filtering, tool permission scoping, human-in-the-loop for risky actions
- [ ] LLM red-teaming methodology and eval sets ([[LLM-Evaluation-Framework]])
- [ ] ML supply chain: model file formats and unsafe deserialization (e.g. pickle), dependency and dataset provenance
- [ ] Logging and detection for AI apps ([[Security-Logging-and-Detection]])

## Stage 4 -- Job-ready
- [ ] Published red-team/eval write-up with reproducible test cases
- [ ] Interview prep across AppSec and ML ([[Interview-Cybersecurity-Round]])

## How this differs from neighbouring roles
- vs [[Roadmap-AI-Engineer]]: you attack and defend LLM systems rather than ship features on them.
- vs [[Roadmap-Application-Security-Engineer]]: same review mindset, but new attack surfaces: prompt injection, tool abuse, training-data poisoning, unsafe model files.
- Prerequisite reality: most people enter from AppSec or AI engineering; there are few true entry-level postings.

## Readiness test (do these cold before applying)
- [ ] Achieve an indirect prompt injection through a retrieved document in a RAG app you built, then block it with a control you can justify (privilege separation, tool allowlist, output handling).
- [ ] Explain why loading an untrusted pickle-based model file is code execution, and which format avoids it.
- [ ] Threat-model an agent with email + calendar tools: list the three highest-impact abuse paths and mitigations.

## Portfolio projects

| Project | Scope | What it proves |
|---|---|---|
| Prompt-injection test harness | Suite of direct and indirect injection cases run against an LLM app; measures attack success before/after mitigations | Red-teaming with evidence |
| Hardened RAG app | RAG app with per-user access control on retrieval, output encoding, tool allowlists, audit logs, threat model doc | Secure AI system design |
| Model supply-chain scanner | Tool that flags unsafe model serialization formats and unpinned model/dataset sources | ML supply chain awareness |

## Proof-of-skill signals
Write-ups with reproducible cases, responsible disclosures to AI products (in scope), open-source guardrail contributions.

## Interview focus
Threat model an LLM agent with tools; prompt injection defense in depth; AppSec fundamentals; coding.

## Common traps
Believing a system prompt is a security boundary; only studying jailbreaks; no classic AppSec foundation.

## Optional certifications
No established standard certification yet; AppSec certs (see [[Roadmap-Application-Security-Engineer]]) are optional.
