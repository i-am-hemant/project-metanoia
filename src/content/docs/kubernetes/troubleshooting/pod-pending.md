---
title: "Symptom: Pod stuck in Pending"
description: Ordered checks for an unschedulable pod.
category: Troubleshooting
tags: ["scheduling", "pending", "playbook"]
---

`Pending` means the pod exists in etcd but has no node bound. Work the causes in this order —
each is cheaper to check than the next.

1. `kubectl describe pod` -> the scheduler's own reason is in the events. Read it first.
2. **Insufficient resources** — sum of `requests` exceeds every node's allocatable. Check with
   `kubectl describe node | grep -A5 Allocated`.
3. **Taints without tolerations** — common on control-plane and GPU node pools.
4. **Node affinity / topology spread** that no node satisfies.
5. **Unbound PVC** — the pod waits on a volume whose StorageClass is
   `WaitForFirstConsumer`, producing a deadlock if the zone has no capacity.
6. **Quota rejection** at the ResourceQuota admission layer.
