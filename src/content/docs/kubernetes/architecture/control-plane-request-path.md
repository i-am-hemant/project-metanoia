---
title: Control-Plane Request Path
description: What happens between kubectl apply and a running container.
category: Architecture
tags: ["control-plane", "apiserver", "etcd", "scheduler"]
---

A write to the cluster is not a single hop. Tracing `kubectl apply -f pod.yaml`:

1. **Authentication** — client cert / OIDC token / service-account JWT is verified.
2. **Authorisation** — RBAC evaluates `(user, verb, resource, namespace)`.
3. **Admission** — mutating webhooks run, then schema validation, then validating webhooks.
   Defaulting happens between the two admission phases, which is why a mutating webhook cannot
   rely on defaulted fields.
4. **Persistence** — the object is written to etcd under `/registry/pods/<ns>/<name>` via a
   Raft commit. This is the point of no return: the API returns 201 here.
5. **Scheduling** — the scheduler watches for `spec.nodeName == ""`, filters then scores nodes,
   and issues a binding subresource write.
6. **Kubelet** — the node's kubelet sees a pod bound to it, calls the CRI to pull and start
   containers, and reports status back.

Steps 1-4 are synchronous with the client. Everything after is reconciliation, which is why
`kubectl apply` returning success says nothing about whether the workload runs.
