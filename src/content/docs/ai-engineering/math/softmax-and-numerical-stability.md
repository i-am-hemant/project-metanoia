---
title: Softmax and Numerical Stability
description: Why every real implementation subtracts the row max first.
category: Math
tags: ["softmax", "numerical-stability", "attention"]
---

The definition,

$$
\sigma(z)_i = \frac{e^{z_i}}{\sum_{j=1}^{K} e^{z_j}},
$$

overflows in float32 as soon as any $z_i > 88$, since $e^{89}$ exceeds the float32 max. Attention
logits reach that range easily before scaling.

Softmax is invariant to a constant shift, so subtracting the row maximum $m = \max_j z_j$ is free:

$$
\sigma(z)_i = \frac{e^{z_i - m}}{\sum_{j} e^{z_j - m}}
$$

Now the largest exponent is exactly $e^0 = 1$ and the denominator is at least 1, so neither
overflow nor a divide-by-zero is reachable. This is also why attention divides by $\sqrt{d_k}$:
it keeps the logit variance near 1 so the distribution does not saturate into a one-hot
vector with vanishing gradients.
