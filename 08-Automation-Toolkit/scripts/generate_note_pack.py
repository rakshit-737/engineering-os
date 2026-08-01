"""Generate a prelinked Obsidian starter note pack into the vault.

Usage:
    python generate_note_pack.py [--vault PATH] [--dry-run] [--force]

Creates seed concept notes (CS core, cybersecurity, AI/ML, interview prep)
plus any missing hub indexes. Idempotent: existing files are never
overwritten unless --force, so your edited notes are safe.

Extend by adding entries to TOPICS — one line per future note.
"""

from __future__ import annotations

import argparse
from datetime import date
from pathlib import Path

# (folder, hub_index, tag) per hub
HUBS = {
    "cs": ("10-CS-Core", "CS-Core-Index", "cs-core"),
    "sec": ("20-Cybersecurity", "Cybersecurity-Index", "cybersecurity"),
    "ai": ("30-AI-ML", "AI-ML-Index", "ai-ml"),
    "int": ("40-Interview-Prep", "Interview-Prep-Index", "interview"),
}

# hub, title, related links, core idea, interview angle
TOPICS = [
    ("cs", "Big-O-Notation",
     ["Sorting-Algorithms", "Hash-Tables"],
     "Describes how runtime or memory grows with input size, ignoring constants and lower-order terms.",
     "State time AND space for every solution before coding; compare against the brute force."),
    ("cs", "Arrays-vs-Linked-Lists",
     ["Big-O-Notation", "Hash-Tables"],
     "Arrays give O(1) index access with contiguous memory; linked lists give O(1) insert/delete at known nodes but O(n) access.",
     "Cache locality usually makes arrays win in practice; say this out loud."),
    ("cs", "Hash-Tables",
     ["Arrays-vs-Linked-Lists", "Two-Pointer-Pattern"],
     "Key-value store with O(1) average lookup via a hash function mapping keys to buckets; collisions handled by chaining or open addressing.",
     "Most frequent interview accelerator: trade O(n) space for O(n) time instead of O(n^2)."),
    ("cs", "Binary-Search",
     ["Binary-Search-Pattern", "Big-O-Notation"],
     "Halves a sorted search space each step for O(log n); the invariant defines which half can be discarded.",
     "Applies beyond arrays: search on answer space (min capacity, max distance) is the senior move."),
    ("cs", "Sorting-Algorithms",
     ["Big-O-Notation", "Binary-Search"],
     "Comparison sorts bottom out at O(n log n); merge sort is stable, quicksort is fast in practice, counting/radix beat the bound for bounded keys.",
     "Know when stability matters and what your language's built-in sort actually is (Timsort in Python)."),
    ("cs", "Trees-and-BSTs",
     ["Graph-Traversal-BFS-DFS", "Heap-Pattern"],
     "Hierarchical nodes; BST invariant (left < node < right) gives O(log n) operations when balanced.",
     "Inorder traversal of a BST yields sorted order — the key to many problems."),
    ("cs", "Graph-Traversal-BFS-DFS",
     ["Trees-and-BSTs", "BFS-DFS-Pattern"],
     "BFS explores level by level with a queue (shortest path unweighted); DFS goes deep with a stack/recursion (cycles, components, topological order).",
     "Choose BFS when 'shortest/minimum steps' appears; DFS for exhaustive exploration or ordering."),
    ("cs", "Dynamic-Programming",
     ["DP-Pattern", "Recursion-and-Stack-Frames"],
     "Solve overlapping subproblems once by storing results; define state, recurrence, base case, then order the computation.",
     "Always derive the brute-force recursion first, then memoize — never jump to tables."),
    ("cs", "Recursion-and-Stack-Frames",
     ["Dynamic-Programming", "Trees-and-BSTs"],
     "Each call pushes a frame (locals + return address); depth is bounded by stack size, so linear recursions can overflow.",
     "Mention conversion to iteration with an explicit stack when input depth is unbounded."),
    ("cs", "Concurrency-Basics",
     ["Big-O-Notation"],
     "Threads share memory (need locks; risk races and deadlocks), processes isolate, async multiplexes IO waits on one thread.",
     "Classify workload first: CPU-bound wants parallelism, IO-bound wants concurrency."),

    ("sec", "CIA-Triad",
     ["Least-Privilege", "Threat-Modeling-STRIDE"],
     "Confidentiality, Integrity, Availability — every control defends at least one; every attack degrades at least one.",
     "Frame any security answer by naming which leg of the triad is at stake."),
    ("sec", "Threat-Modeling-STRIDE",
     ["CIA-Triad", "OWASP-Top-10"],
     "Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege — enumerate threats per component and data flow.",
     "Walk a data-flow diagram and apply STRIDE per element; ties to Threat-Model-Template in 06-Cybersecurity-Toolkit."),
    ("sec", "OWASP-Top-10",
     ["SQL-Injection", "XSS", "Threat-Modeling-STRIDE"],
     "The consensus list of web application risk categories: access control, crypto failures, injection, insecure design, misconfiguration, and more.",
     "Cite the category name (A01, A03...) when discussing a vuln — signals fluency."),
    ("sec", "SQL-Injection",
     ["OWASP-Top-10", "Authentication-vs-Authorization"],
     "User input concatenated into query strings changes query structure; parameterized queries keep input as data.",
     "Runnable proof in 11-Project-Templates/Secure-Coding-Examples/sql_injection_prevention.py."),
    ("sec", "XSS",
     ["OWASP-Top-10", "SQL-Injection"],
     "Attacker script executing in a victim's browser context; stored, reflected, or DOM-based. Defense: context-aware output encoding + CSP.",
     "Key distinction from injection: XSS attacks users, SQLi attacks the datastore."),
    ("sec", "Authentication-vs-Authorization",
     ["Least-Privilege", "SQL-Injection"],
     "Authentication proves who you are; authorization decides what you may do. Broken authz (IDOR, missing checks) is OWASP A01.",
     "Every endpoint needs both checks server-side; client-side checks are UX, not security."),
    ("sec", "TLS-Handshake",
     ["Hashing-vs-Encryption", "CIA-Triad"],
     "Negotiates cipher suite, authenticates the server via certificate chain, and derives session keys (asymmetric handshake, symmetric session).",
     "Know TLS 1.3 changes: 1-RTT, no RSA key exchange, forward secrecy by default."),
    ("sec", "Hashing-vs-Encryption",
     ["TLS-Handshake", "CIA-Triad"],
     "Hashing is one-way (integrity, password storage); encryption is reversible with a key (confidentiality). Signing = hash + asymmetric encryption.",
     "Passwords are hashed (slow + salted), never encrypted — see Secure-Coding-Examples/password_hashing.py."),
    ("sec", "Least-Privilege",
     ["Authentication-vs-Authorization", "CIA-Triad"],
     "Every identity, process, and service gets the minimum access needed, for the minimum time needed.",
     "Concrete examples win: non-root containers, scoped API tokens, separate DB users per service."),
    ("sec", "Incident-Response-Lifecycle",
     ["Threat-Modeling-STRIDE", "Least-Privilege"],
     "Preparation, detection/analysis, containment, eradication, recovery, lessons learned (NIST 800-61).",
     "Containment before eradication — pulling the plug too early destroys evidence."),

    ("ai", "Transformer-Architecture",
     ["Attention-Mechanism", "Embeddings"],
     "Stacked self-attention + feed-forward blocks with residual connections; processes tokens in parallel, scaling better than recurrence.",
     "Explain why attention replaced RNNs: parallelism and long-range dependencies."),
    ("ai", "Attention-Mechanism",
     ["Transformer-Architecture", "Embeddings"],
     "Each token computes weighted relevance (softmax of query-key dot products) over all others and aggregates their values.",
     "Q/K/V intuition: what I'm looking for, what I contain, what I give if selected."),
    ("ai", "Embeddings",
     ["Attention-Mechanism", "RAG-Retrieval-Augmented-Generation"],
     "Dense vectors where semantic similarity becomes geometric closeness; the interface between text and math.",
     "Cosine similarity on normalized embeddings = dot product; know why normalization matters."),
    ("ai", "RAG-Retrieval-Augmented-Generation",
     ["Embeddings", "LLM-Prompt-Engineering"],
     "Retrieve relevant chunks from a knowledge store, inject into the prompt, ground the generation; reduces hallucination and enables private data.",
     "Full pipeline detail lives in 09-AI-Toolkit/RAG-Playbook.md; know chunking and eval tradeoffs."),
    ("ai", "Fine-Tuning-vs-Prompting",
     ["RAG-Retrieval-Augmented-Generation", "LLM-Prompt-Engineering"],
     "Prompting steers behavior at inference (cheap, instant); fine-tuning bakes behavior into weights (style, format, domain). RAG covers knowledge gaps.",
     "Decision order: prompt first, then RAG for knowledge, fine-tune last for form/behavior."),
    ("ai", "Overfitting-and-Regularization",
     ["Evaluation-Metrics-ML"],
     "Model memorizes training noise and fails to generalize; countered by more data, dropout, weight decay, early stopping, simpler models.",
     "Diagnose from curves: training loss down + validation loss up = overfitting."),
    ("ai", "Evaluation-Metrics-ML",
     ["Overfitting-and-Regularization", "RAG-Retrieval-Augmented-Generation"],
     "Accuracy misleads on imbalance; precision vs recall trades false positives against false negatives; F1/AUC summarize.",
     "Pick the metric from the cost of errors: spam filter vs cancer screen want opposite tradeoffs."),
    ("ai", "LLM-Prompt-Engineering",
     ["Fine-Tuning-vs-Prompting", "RAG-Retrieval-Augmented-Generation"],
     "Role, task, constraints, examples, output format — structure beats cleverness; few-shot examples are the strongest lever.",
     "Deep guide in 02-Prompt-Library and 09-AI-Toolkit/Prompt-Engineering-Guide.md."),

    ("int", "Two-Pointer-Pattern",
     ["Sliding-Window-Pattern", "Hash-Tables"],
     "Two indexes moving with purpose (opposite ends inward, or fast/slow) to cut O(n^2) pair scans to O(n).",
     "Trigger words: sorted array, pair sum, palindrome, cycle detection."),
    ("int", "Sliding-Window-Pattern",
     ["Two-Pointer-Pattern", "Hash-Tables"],
     "Maintain a moving subarray/substring with an invariant; expand right, shrink left while invariant broken.",
     "Trigger words: longest/shortest substring, subarray with condition, at most K distinct."),
    ("int", "BFS-DFS-Pattern",
     ["Graph-Traversal-BFS-DFS", "System-Design-Basics"],
     "Model the problem as states + transitions; BFS for minimum steps, DFS/backtracking for all configurations.",
     "Grids, word ladders, and dependency orders are graphs in disguise — say so explicitly."),
    ("int", "Heap-Pattern",
     ["Trees-and-BSTs", "DP-Pattern"],
     "Priority queue gives O(log n) access to min/max; core of top-K, K-way merge, and streaming median problems.",
     "Trigger words: K largest/smallest/closest/most frequent — heap of size K, not full sort."),
    ("int", "Binary-Search-Pattern",
     ["Binary-Search", "DP-Pattern"],
     "When the answer is monotonic (if X works, X+1 works), binary search the answer space and verify with a greedy check.",
     "Trigger words: minimize the maximum, maximize the minimum, smallest capacity/speed that succeeds."),
    ("int", "DP-Pattern",
     ["Dynamic-Programming", "Binary-Search-Pattern"],
     "Recognize choice + overlapping subproblems; classify as knapsack, LIS, edit distance, interval, or grid family.",
     "Name the family first — it gives you state and recurrence for free. Implementations in 03-Coding-Library."),
    ("int", "System-Design-Basics",
     ["Concurrency-Basics", "BFS-DFS-Pattern"],
     "Clarify requirements and scale, sketch API + data model, then address storage, caching, load balancing, and failure modes.",
     "Drive the interview: state assumptions, estimate load, name tradeoffs before being asked."),
    ("int", "Behavioral-STAR-Method",
     ["System-Design-Basics"],
     "Situation, Task, Action, Result — 30-60-90-30 second split keeps stories tight and outcome-focused.",
     "Bank in 10-Career-Toolkit/STAR-Story-Template.md; quantify every Result."),
]

# Hub indexes that ship with the pack when missing. Research + Cheat-Sheet are
# structural stubs pointing at their toolkits until notes exist.
INDEX_STUBS = {
    "Research-Index": [
        "# Research Index",
        "",
        "Hub for paper summaries and experiment notes.",
        "",
        "## Workflow",
        "",
        "1. Summarize papers with `99-Templates/Paper-Summary-Template.md`",
        "2. Track experiments in `05-Research-Toolkit/Experiment-Tracker.md`",
        "3. Check novelty with `05-Research-Toolkit/Novelty-Checklist.md`",
        "",
        "## Papers",
        "",
        "- (add [[paper summaries]] here)",
    ],
    "Cheat-Sheet-Index": [
        "# Cheat Sheet Index",
        "",
        "Fast-retrieval reference sheets. Promote hard-won knowledge here weekly.",
        "",
        "## Available",
        "",
        "- Linux security: `06-Cybersecurity-Toolkit/Linux-Security-Cheat-Sheet.md`",
        "- OWASP web checklist: `06-Cybersecurity-Toolkit/Web-Security-Checklist-OWASP.md`",
        "",
        "## To Create",
        "",
        "- Git commands under pressure",
        "- Python stdlib power tools",
        "- SQL joins and window functions",
    ],
}


def note_body(title: str, hub_tag: str, hub_index: str, core: str, interview: str,
              links: list[str], today: str) -> str:
    related = "\n".join(f"- [[{link}]]" for link in links)
    return f"""---
tags: [concept, {hub_tag}]
created: {today}
status: seed
---

# {title.replace("-", " ")}

Hub: [[{hub_index}]]

## Core Idea

{core}

## Details

- (expand: definition, mechanics, tradeoffs, failure modes)
- (add one concrete example from a project or problem you solved)

## Interview Angle

{interview}

## Related

{related}
"""


def index_body(hub_index: str, titles: list[str]) -> str:
    lines = [f"# {hub_index.replace('-', ' ')}", "", "Seed notes (expand as you learn):", ""]
    lines += [f"- [[{title}]]" for title in titles]
    lines += ["", "Back to [[Home]]"]
    return "\n".join(lines) + "\n"


def write_file(path: Path, content: str, dry_run: bool, force: bool) -> str:
    if path.exists() and not force:
        return "kept"
    if not dry_run:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
    return "would write" if dry_run else "wrote"


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate prelinked Obsidian note pack")
    default_vault = Path(__file__).resolve().parents[2] / "01-Obsidian-Vault"
    parser.add_argument("--vault", type=Path, default=default_vault)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--force", action="store_true", help="Overwrite existing notes")
    args = parser.parse_args()

    vault: Path = args.vault
    today = date.today().isoformat()
    counts = {"wrote": 0, "kept": 0, "would write": 0}

    titles_by_hub: dict[str, list[str]] = {}
    for hub, title, links, core, interview in TOPICS:
        folder, hub_index, tag = HUBS[hub]
        titles_by_hub.setdefault(hub_index, []).append(title)
        path = vault / folder / f"{title}.md"
        result = write_file(path, note_body(title, tag, hub_index, core, interview, links, today),
                            args.dry_run, args.force)
        counts[result] += 1

    index_dir = vault / "00-Indexes"
    for hub_index, titles in titles_by_hub.items():
        index_path = index_dir / f"{hub_index}.md"
        if not index_path.exists():
            result = write_file(index_path, index_body(hub_index, titles), args.dry_run, args.force)
            counts[result] += 1

    for stub_name, lines in INDEX_STUBS.items():
        stub_path = index_dir / f"{stub_name}.md"
        result = write_file(stub_path, "\n".join(lines) + "\n", args.dry_run, args.force)
        counts[result] += 1

    print(f"notes+indexes: {counts['wrote']} written, {counts['kept']} kept, "
          f"{counts['would write']} would be written (dry run)")
    print(f"vault: {vault}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
