---
title: "Case Study: Scaling a Read-Heavy PostgreSQL Workload"
description: The constraints that actually forced each step of a read-scaling path.
type: case-study
date: 2026-09-11
tags: ["postgresql", "read-scaling", "replication", "case-study"]
---

The path a read-heavy relational workload usually walks, and the constraint that ends each stage:

1. **Index the query** — free, until the working set exceeds RAM and the index itself thrashes.
2. **Connection pooling** (PgBouncer, transaction mode) — each PostgreSQL backend is a process
   with ~10MB of overhead; ends when the primary is CPU-bound rather than connection-bound.
3. **Read replicas** — linear read scaling, ends at replica lag becoming user-visible or the
   primary's WAL shipping saturating.
4. **Caching** — see [ADR-001](/system-design/adrs/adr-001-caching-strategy/); ends when the
   consistency requirement is tighter than a TTL can express.
5. **Partitioning / sharding** — the first genuinely irreversible step, and the first that
   breaks cross-shard joins and transactions.

The lesson is ordering: each step buys roughly an order of magnitude and each is cheaper to
reverse than the next. Skipping ahead to sharding buys the same headroom at permanent cost.
