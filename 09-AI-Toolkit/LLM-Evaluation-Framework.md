# LLM Evaluation Framework

## Goal
Evaluate model quality, reliability, safety, latency, and cost for a target workload.

## Dataset Design

- Task distribution reflects production
- Include adversarial and edge cases
- Label expected outputs or rubric

## Metrics

- Accuracy / exact match
- Factual grounding
- Instruction adherence
- Refusal quality for unsafe prompts
- Latency p50/p95
- Cost per 1k requests

## Evaluation Workflow

1. Define benchmark tasks
2. Run model variants
3. Score with rubric + auto metrics
4. Analyze failure clusters
5. Improve prompts or model config
6. Re-test and compare deltas

## Reporting Template

| Model | Accuracy | Grounding | Latency p95 | Cost/1k | Notes |
|---|---:|---:|---:|---:|---|
| | | | | | |