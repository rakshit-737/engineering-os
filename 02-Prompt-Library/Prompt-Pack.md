# Prompt Pack

## 1) Senior Code Reviewer

You are a senior software engineer. Review `{code_or_pr}` for correctness, performance, security, readability, and maintainability.

Output format:

1. Critical defects
2. Security risks
3. Performance concerns
4. Suggested refactors
5. Tests to add
6. Final patch-ready recommendations

Constraints:

- Explain root cause for each issue
- Provide concrete code-level fixes
- Prioritize by severity

## 2) Debug Partner

I am debugging `{bug_description}` in `{language/framework}`.

Provide:

1. Hypothesis table (cause, confidence, evidence needed)
2. Minimal reproduction strategy
3. Instrumentation plan (logs, assertions, metrics)
4. Step-by-step isolation path
5. Fix validation checklist
6. Regression test cases

## 3) System Design Mentor

Design `{system_name}` for `{scale}` with requirements:
`{requirements}`

Deliver:

1. API and data model
2. Architecture diagram in mermaid
3. Capacity estimate
4. Failure modes and mitigations
5. Security model
6. Deployment strategy
7. Observability plan
8. Cost optimization ideas

## 4) Threat Modeling Assistant

Threat model `{application}` with context:
`{architecture_summary}`

Use STRIDE.

Output:

1. Asset inventory
2. Trust boundaries
3. Threat table (threat, impact, likelihood, controls)
4. Abuse cases
5. Security test plan
6. Priority roadmap (P0, P1, P2)

## 5) Paper Reading Accelerator

Analyze this paper: `{paper_text_or_link}`

Output:

1. One-paragraph summary
2. Problem and novelty
3. Method details
4. Key equations/concepts
5. Experiment quality critique
6. Reproducibility checklist
7. How to apply to my project `{project_name}`

## 6) Literature Review Composer

Topic: `{topic}`

Create:

1. Search query strategy
2. Inclusion/exclusion criteria
3. Thematic grouping
4. Comparison table format
5. Gap analysis
6. Novel thesis directions

## 7) Assignment Builder

Create a complete assignment solution framework for:
`{subject}` / `{question}`

Need:

1. Problem decomposition
2. Key concepts and formulas
3. Pseudocode or logic
4. Polished final write-up structure
5. Viva questions and answers

## 8) Interview Drill (DSA)

I am preparing for `{company_type}`.

Generate:

1. 10 DSA questions by pattern
2. Hints-only mode
3. Full optimized solutions
4. Complexity analysis
5. Follow-up interviewer twists

## 9) Resume Bullet Optimizer

Convert this experience into strong impact bullets:
`{raw_experience}`

Constraints:

- Use action + impact + metric
- 1 line per bullet
- ATS-friendly keywords
- Variants for product, backend, security roles

## 10) GitHub README Architect

Generate production-grade README for `{project_name}`.

Include:

- Problem statement
- Features
- Architecture
- Quickstart
- API docs summary
- Testing
- Security notes
- Roadmap

## 11) API Design Critic

Given this endpoint design `{api_spec}`:

1. Validate REST semantics
2. Spot versioning issues
3. Spot auth/rate-limit gaps
4. Spot schema consistency issues
5. Propose improved OpenAPI snippet

## 12) Research Notebook Assistant

Given experiment logs `{logs}`:

1. Summarize outcomes
2. Identify confounders
3. Suggest next experiments
4. Flag reproducibility issues
5. Draft lab notebook entry

## 13) Study Sprint Planner

Subject: `{subject}`
Duration: `{days}`
Goal: `{goal}`

Build:

1. Daily topics
2. Active recall prompts
3. Spaced repetition schedule
4. Mock test plan
5. Weak-area remediation loop

## 14) Documentation Writer

Write technical docs for `{component}`.

Output:

1. Purpose
2. Interfaces
3. Internal logic
4. Configuration
5. Failure behavior
6. Troubleshooting
7. Example usage

## 15) Secure Coding Assistant

Review this code for OWASP Top 10:
`{code}`

Return:

1. Findings with CWE mappings
2. Exploit scenario
3. Severity
4. Secure patch suggestions
5. Unit/integration security tests

## 16) Architecture Decision Record Generator

Context: `{decision_context}`
Decision needed: `{decision}`

Generate ADR with:

- Context
- Options considered
- Decision
- Consequences
- Rollback strategy
- Validation metrics

## 17) Project Scaffolding Planner

I need a project scaffold for `{stack}` with goals `{goals}`.

Output:

1. Directory structure
2. Starter files
3. Tooling setup (lint/test/CI)
4. Dev/prod workflows
5. Security and secrets handling
6. First milestone checklist

## 18) Incident Response Drill

Simulate incident `{incident_type}` for `{system}`.

Provide:

1. Detection signals
2. Triage steps
3. Containment actions
4. Eradication and recovery
5. Postmortem template
6. Preventive controls

## 19) Codebase Explainer

Explain `{repository}` for a new contributor.

Need:

1. Architecture map
2. Entry points
3. Data flow
4. Build/test/deploy steps
5. High-risk areas
6. Easy first issues

## 20) Learning Path Generator

Topic: `{topic}`
Skill level: `{level}`
Target role: `{role}`

Build a 12-week roadmap with:

1. Weekly outcomes
2. Projects
3. Assessments
4. Portfolio artifacts
5. Interview checkpoints