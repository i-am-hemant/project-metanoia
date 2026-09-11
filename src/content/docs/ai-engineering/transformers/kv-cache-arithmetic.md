---
title: KV Cache Arithmetic
description: Sizing the KV cache, and why it — not weights — caps your batch size.
category: Transformers
tags: ["kv-cache", "inference", "memory", "throughput"]
---

Per token, per layer, a decoder caches one key and one value vector. Total cache bytes:

$$
\text{bytes} = 2 \cdot L \cdot H_{kv} \cdot d_h \cdot s \cdot b \cdot p
$$

where $L$ is layers, $H_{kv}$ KV heads, $d_h$ head dimension, $s$ sequence length, $b$ batch
size and $p$ bytes per element.

For Llama-3-8B ($L=32$, $H_{kv}=8$, $d_h=128$) at fp16, 8k context, batch 1:

$$
2 \cdot 32 \cdot 8 \cdot 128 \cdot 8192 \cdot 1 \cdot 2 \approx 1.07\text{ GB}
$$

Weights are a fixed ~16GB; the cache is ~1GB **per concurrent sequence**. On an 80GB card that
is roughly 60 sequences before OOM — which is why grouped-query attention ($H_{kv} \ll H_q$)
and paged attention exist. They attack the only term that scales with traffic.
