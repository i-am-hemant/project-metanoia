---
title: RBAC Least Privilege
description: Building the smallest workable Role instead of copying cluster-admin.
category: Security
tags: ["rbac", "least-privilege", "serviceaccount"]
---

Start from an empty Role and add only what a denial proves you need.

```bash
# What can this service account actually do?
kubectl auth can-i --list --as=system:serviceaccount:prod:catalogue
```

Rules worth holding:

- Never grant `*` on `verbs` or `resources`. `list` on secrets is equivalent to reading them.
- Prefer `Role` over `ClusterRole`; namespace is the cheapest blast-radius boundary.
- `escalate` and `bind` let a subject grant itself more than it has — treat as admin-equivalent.
- Disable service-account token automounting by default
  (`automountServiceAccountToken: false`) and opt in per workload.
