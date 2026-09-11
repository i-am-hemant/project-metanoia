---
title: Production Deployment Baseline
description: A Deployment manifest with every field justified.
category: Manifests
tags: ["deployment", "probes", "resources", "security-context"]
---

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: catalogue
spec:
  replicas: 3                          # survives one node loss + one voluntary eviction
  strategy:
    rollingUpdate:
      maxUnavailable: 0                # never dip below capacity
      maxSurge: 1
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        seccompProfile: { type: RuntimeDefault }
      containers:
        - name: app
          image: registry.internal/catalogue@sha256:...   # digest, never a tag
          resources:
            requests: { cpu: 250m, memory: 256Mi }        # drives scheduling
            limits:   { memory: 256Mi }                   # no CPU limit: avoids throttling
          readinessProbe:                                 # gates traffic
            httpGet: { path: /readyz, port: 8080 }
          livenessProbe:                                  # restarts only on deadlock
            httpGet: { path: /livez, port: 8080 }
            initialDelaySeconds: 30
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities: { drop: ["ALL"] }
```

Two choices worth defending: memory `limit == request` makes the pod `Guaranteed` and
immune to eviction ranking, while omitting the CPU limit avoids CFS throttling that shows up
as p99 latency spikes long before CPU utilisation looks high.
