---
title: Backpressure
description: A queue without backpressure is a latency amplifier with extra steps.
type: concept
date: 2026-09-11
tags: ["backpressure", "queueing", "load-shedding", "reliability"]
sidebar:
  order: 6
---

By Little's Law, mean latency for arrival rate $\lambda$ and queue length $L$ is

$$
W = \frac{L}{\lambda}
$$

An unbounded queue therefore cannot fail *fast* — it converts an overload into unbounded
latency while every item still consumes memory. The request at the back is very likely already
abandoned by its client, so the work is pure waste.

Backpressure means the consumer's capacity is visible to the producer. Mechanisms, from most
to least preferable:

1. **Bounded queues with rejection** — reject at the boundary with a 429 and a `Retry-After`.
2. **Credit / windowing** — the consumer grants explicit permits (TCP, gRPC flow control).
3. **Load shedding by priority** — drop the cheapest-to-lose class first.
4. **Timeout propagation** — pass a deadline down the call chain so downstream work is
   abandoned once the caller has given up.

Blocking the producer is the crude version: it works, but it couples liveness across the whole
chain and turns one slow consumer into a stalled system.
