---
title: System Design
description: Architecture decision records, case studies and first-principles concept notes.
type: concept
status: Accepted
date: 2026-09-11
tags: ["system-design", "index"]
sidebar:
  order: 0
---

Architecture work in this notebook is filed in three shapes.

- **ADRs** — a decision, its context, the options rejected and why. Immutable once
  `Accepted`; superseded rather than edited.
- **Case studies** — a teardown of a real system, ending in the constraints that
  actually drove its design.
- **Concepts** — mechanism notes (quorum, backpressure, consistent hashing) that ADRs
  and case studies link to instead of re-explaining.

Every entry under `system-design/` must declare `type`, `date` and `tags`; `status` is
required in practice for ADRs and is validated by review, not by the schema.

Existing entries: [ADR-001](./adrs/adr-001-caching-strategy/) is the reference shape for a
decision record, and [Backpressure](./concepts/backpressure/) for a concept note. Everything
else here is still to be written.
