---
title: System Design
description: Fundamentals, components and real-world systems — read in that order.
type: concept
date: 2026-09-11
tags: ["system-design", "index"]
sidebar:
  order: 0
---

Notes on designing systems, built to be read in order rather than dipped into.

## The flow

1. **[Fundamentals](./fundamentals/why-learn-system-design/)** — the properties that matter
   (scalable, reliable, available, consistent) and what each one costs. This is the vocabulary
   everything else is written in.
2. **Components** — databases, caches, load balancers, message queues. For each one: what it's
   good at, and what it's bad at.
3. **Real-World Systems** — full designs where the constraints conflict and something has to
   give.

## Fundamentals, in reading order

1. [Why Learn System Design](./fundamentals/why-learn-system-design/) — deciding what to build,
   and predicting what breaks under load.
2. [How Architects Think Differently](./fundamentals/architect-mindset/) — the six mental shifts.
3. [Functional and Non-Functional Requirements](./fundamentals/requirements/) — what the system
   does versus how well, and why the second shapes architecture more.
4. [Back-of-Envelope Estimation](./fundamentals/estimation/) — order-of-magnitude maths for
   storage, bandwidth, QPS and servers.
5. [The Four-Step Design Framework](./fundamentals/four-step-framework/) — a repeatable order for
   any design problem.
6. [Backpressure](./fundamentals/backpressure/) — what a queue does to latency when nobody
   applies it.

## The one idea underneath all of it

There is rarely a perfect solution. There are trade-offs, and the skill is choosing the right
ones for your constraints. A cache is not "better" than no cache — it buys read speed and pays
in staleness. Whether that's a good deal depends entirely on the problem.

So every note here tries to state the constraint before the solution, and name what the
solution gives up.

## Also in this section

**ADRs** — architecture decision records. Where the rest of this section is general, these are
specific decisions with context, options considered and consequences.
[ADR-001](./adrs/adr-001-caching-strategy/) is the reference shape.

Frontmatter under `system-design/` requires `type`, `date` and `tags`; ADRs additionally carry
a `status` (`Proposed`, `Accepted`, `Deprecated`).
