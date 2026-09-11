---
title: Kubernetes
description: Control-plane internals, manifest patterns, incident playbooks and cluster security.
category: Architecture
tags: ["kubernetes", "index"]
sidebar:
  order: 0
---

Four categories, each mapping to a directory and a `category` value.

| Category | Directory | Contents |
| --- | --- | --- |
| `Architecture` | `architecture/` | Control plane, scheduler, kubelet, CNI/CSI internals |
| `Manifests` | `manifests/` | Reference YAML with rationale per field |
| `Troubleshooting` | `troubleshooting/` | Symptom-first incident playbooks |
| `Security` | `security/` | RBAC, admission control, secrets, supply chain |

[Control-Plane Request Path](./architecture/control-plane-request-path/) is the reference
shape for an architecture note. The other three categories are empty so far.
