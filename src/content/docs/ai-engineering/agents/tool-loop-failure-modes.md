---
title: Tool Loop Failure Modes
description: How agent loops actually break in production.
category: Agents
tags: ["agents", "tool-use", "reliability", "guardrails"]
---

Observed failure modes, most common first:

- **Silent tool failure** — a tool returns a 200 with an error payload; the model treats it as
  success and confabulates downstream. Fix: make failure a distinguishable type, not prose.
- **Retry loops** — the same failing call repeats until the budget is gone. Fix: cap attempts
  per tool signature, not just per turn.
- **Context erosion** — tool output floods the window and the original objective is compacted
  away. Fix: summarise tool results into the transcript, keep raw payloads out of band.
- **Premature commitment** — an irreversible action (write, send, delete) fires on a
  low-confidence plan. Fix: gate mutations behind explicit confirmation.
- **Goal drift** — a multi-step plan is quietly renegotiated mid-run. Fix: re-assert the goal
  each turn and diff the plan against it.
