---
title: LoRA vs Full Fine-Tuning
description: When a rank decomposition is enough, and when it is not.
category: Fine-Tuning
tags: ["lora", "qlora", "peft", "training"]
---

LoRA freezes $W \in \mathbb{R}^{d \times k}$ and learns a low-rank update:

$$
W' = W + \frac{\alpha}{r} BA, \quad B \in \mathbb{R}^{d \times r},\ A \in \mathbb{R}^{r \times k},\ r \ll \min(d,k)
$$

Trainable parameters drop from $dk$ to $r(d+k)$ — for $d=k=4096$, $r=16$ that is 16.7M to
131k, a 99.2% reduction, and optimiser state shrinks with it.

**Reach for LoRA** to teach format, tone, or a bounded domain vocabulary; adapters are
swappable and cheap to host.

**Reach for full fine-tuning** when adding genuinely new knowledge or a new language, when the
target diverges far from the base distribution, or when you need to change tokenizer behaviour.
A rank-16 update cannot move a distribution it never had capacity to represent.
