---
title: Functional and Non-Functional Requirements
description: What the system must do, versus how well it must do it — and why the second one shapes architecture more.
type: concept
date: 2026-09-11
tags: ["system-design", "fundamentals", "requirements", "nfr"]
sidebar:
  order: 3
---

> "Build a chat app" is not a requirement. It's a prompt.

Requirements come in two kinds, and confusing them is one of the most common ways a design goes
wrong before it starts.

- **Functional** — what the system does. Send a message. Cancel an order. Search products.
- **Non-functional** — how well it does it. 200ms at p99. 99.9% uptime. 100k concurrent users.

Both must exist before you draw anything. Functional requirements tell you what components you
need; non-functional requirements usually decide what shape they take.

## 1. Functional requirements

The job here is converting a vague statement into things you could actually test.

"Build a chat app" becomes:

- send a text message to one recipient
- create a group with up to N members
- show delivery status (sent / delivered / read)
- search message history

Good functional requirements are **specific**, **testable**, **scoped**, and **prioritised**
into must-have versus later. That last one matters most in practice — a list where everything
is essential is a list nobody prioritised.

### Hidden requirements

The stated features are the easy half. The ones that reshape a design tend to be unstated:

| Feature as stated | The question nobody asked |
| --- | --- |
| Send a message | Can you delete it? For everyone, or just you? |
| Follow a user | Can you block? Does blocking hide past content? |
| Place an order | What happens when payment succeeds but stock is gone? |
| Upload a photo | Who can see it? Can that change later? |
| Subscribe | How does cancellation work mid-period? |

Delete, retry, cancel, block, restore, expire. Walking that list against any feature surfaces
more design pressure than another hour of diagramming.

## 2. Non-functional requirements

A system with every feature working can still fail in production because it's too slow, too
fragile, too expensive, or too easy to attack.

The categories worth asking about:

| Category | The question | Example answer |
| --- | --- | --- |
| Performance | How fast, at which percentile? | p99 under 200ms |
| Throughput | How many operations per second? | 5k writes/s sustained |
| Concurrency | How many at once? | 100k concurrent connections |
| Scalability | Growth over what period? | 10x users in 18 months |
| Availability | How much downtime is tolerable? | 99.9% (~43 min/month) |
| Reliability | What must never be lost? | No committed order lost, ever |
| Security | What's the threat and the rule? | Encryption at rest; PII access audited |
| Maintainability | Who operates it? | Two engineers, no on-call rotation |
| Observability | How do we know it broke? | Alert within 2 min of error-rate spike |
| Cost | What's the ceiling? | Under $8k/month at launch scale |

### They must be measurable

"Fast" is not a requirement. It cannot be designed for, tested, or violated.

| Vague | Usable |
| --- | --- |
| Fast search | p95 search under 300ms with 10M documents |
| Highly available | 99.95% monthly, measured at the load balancer |
| Scalable | Handle 5x current peak without redesign |
| Secure | TLS in transit, AES-256 at rest, MFA for admin |
| Reliable | Zero data loss on single-node failure; RPO 0, RTO 5 min |

The conversion is itself the useful work. Asking "what number would count as fast enough?"
often reveals nobody knew — which is a finding, not a failure.

### They conflict, by construction

This is the part that makes them architectural rather than a checklist:

- Stronger consistency reduces availability during partitions.
- More redundancy improves resilience and increases cost.
- More validation and encryption improve security and add latency.
- Aggressive caching improves latency and increases staleness.

You cannot maximise all of them. Naming which one wins, for this system, in this business
context, *is* the design decision.

## 3. Why non-functional requirements drive architecture

Functional requirements are often satisfiable by many designs. It's the non-functional ones
that eliminate most of them.

Take "users can view their timeline." That's one line of functional requirement, and a single
database query satisfies it — at 1,000 users. Now add:

- 10M daily active users
- timeline loads under 200ms at p99
- new posts visible within a few seconds

Nothing about the *feature* changed. But the design space just collapsed: you now need caching,
probably precomputed timelines, likely a fan-out strategy on write. The numbers did that, not
the feature.

This is why "we'll figure out scale later" is expensive. Scale isn't a phase you add — it's a
constraint that selects the design.

## 4. A checklist worth running

Before designing:

1. Who are the users, and what are the distinct types?
2. What are the core actions for each type?
3. What's in the MVP, and what's explicitly out?
4. What are the hidden flows — delete, retry, cancel, block, restore, expire?
5. What scale, at launch and in a year?
6. What latency is acceptable, at which percentile?
7. What uptime is required, and measured where?
8. What data absolutely cannot be lost?
9. Any security or compliance constraints?
10. What's the cost ceiling?
11. Regional or global?
12. What's expected to change significantly later?

If several answers are "not sure," the design isn't blocked — but every assumption you make in
place of an answer should be written down as an assumption, not smuggled in as a fact.
