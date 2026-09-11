---
title: Back-of-Envelope Estimation
description: Fast order-of-magnitude maths for storage, bandwidth, QPS and servers — directionally right beats precisely late.
type: concept
date: 2026-09-11
tags: ["system-design", "fundamentals", "estimation", "capacity-planning"]
sidebar:
  order: 4
---

> The goal is not the right number. It's the right order of magnitude, fast enough to change
> what you design next.

Estimation earns its place because it eliminates options. Knowing a system needs ~700 writes/s
rather than ~700,000 changes the answer completely — and you can know which one in about ninety
seconds, before committing to anything.

## 1. Units and reference sizes

Use powers of ten. Binary-exact values buy nothing at this precision.

| Unit | Bytes |
| --- | --- |
| 1 KB | $10^3$ |
| 1 MB | $10^6$ |
| 1 GB | $10^9$ |
| 1 TB | $10^{12}$ |
| 1 PB | $10^{15}$ |

Sizes worth memorising:

| Thing | Rough size |
| --- | --- |
| 1 character | 1 byte |
| Short text post | a few hundred bytes |
| Smartphone photo | 4 MB |
| HD video, per minute | 50 MB |
| 4K video, per minute | 300 MB |

And the conversion that trips everyone: **1 byte = 8 bits**. Storage is quoted in bytes,
bandwidth in bits per second. So 1 MB/s = 8 Mb/s.

Useful constant: a day is **86,400 seconds**. Round to $10^5$ when dividing in your head — it
overestimates QPS by ~15%, which is the safe direction.

## 2. QPS from users

The chain is always the same: users → actions per user per day → per second → peak.

Take a text-posting service with **10M daily active users**, each posting twice a day:

$$
\text{writes/day} = 10^7 \times 2 = 2 \times 10^7
$$

$$
\text{avg write QPS} = \frac{2 \times 10^7}{86{,}400} \approx 231
$$

Now the part people skip. **Average traffic is not what you build for.** Peak is typically
2–3x average, and event-driven spikes can hit 5–10x.

$$
\text{peak write QPS} \approx 231 \times 3 \approx 700
$$

Most systems are read-heavy. At a 100:1 read:write ratio:

$$
\text{avg read QPS} \approx 23{,}000 \qquad \text{peak} \approx 69{,}000
$$

That ratio is the single most useful number to establish early — it decides whether you're
solving a read problem or a write problem, and those have different answers.

## 3. Storage

Text is almost always cheap. Run it anyway, because "almost always" isn't "always."

At 300 bytes per post:

$$
2 \times 10^7 \times 300\,\text{B} = 6\ \text{GB/day} \approx 2.2\ \text{TB/year}
$$

With 3x replication, ~6.6 TB/year. Unremarkable — one machine could hold a year of it.

Now media, same service, 1M photos a day at 4 MB:

$$
10^6 \times 4\ \text{MB} = 4\ \text{TB/day} \approx 1{,}460\ \text{TB/year}
$$

**Media dominates.** It's ~670x the text volume here, and that gap is why photo and video
products are architecturally different from text products. If a system has media, estimate the
media first — everything else is rounding error.

Two multipliers people forget: **replication** multiplies real cost (3x is common), and
**retention** decides whether growth ever stops. Storing everything forever in hot storage is a
cost decision disguised as a default.

## 4. Bandwidth

Bandwidth follows reads, not writes. Same photo service, 50M photo views a day:

$$
5 \times 10^7 \times 4\ \text{MB} = 200\ \text{TB/day}
$$

$$
\frac{200 \times 10^{12} \times 8\ \text{bits}}{86{,}400\ \text{s}} \approx 18.5\ \text{Gb/s average}
$$

At 3x peak, ~56 Gb/s. That number is the entire argument for a CDN — serving it from origin
means provisioning for the peak, while a CDN absorbs most of it near the user and cuts both
egress cost and latency.

## 5. Servers

Peak QPS divided by what one server handles — then corrected for reality.

$$
\text{servers} = \frac{\text{peak QPS}}{\text{QPS per server} \times \text{target utilisation}}
$$

For 700 peak write QPS, assuming 500 rps per server and a 60% utilisation target:

$$
\frac{700}{500 \times 0.6} = 2.3 \rightarrow 3\ \text{servers}, +1\ \text{for redundancy} = 4
$$

Two rules inside that:

- **Never plan for 100% utilisation.** Above roughly 70% queues grow and latency degrades
  non-linearly — you hit the latency wall well before the CPU wall.
- **Always add redundancy.** N servers where losing one breaks you is not N servers of capacity.

## 6. What estimation is for

It's not for the number. It's for the decision the number forces:

| Estimate | Decision it drives |
| --- | --- |
| Read:write ratio | Cache and replicate, or partition for writes |
| Media volume | Object storage + CDN, or just a database |
| Peak QPS | Server count, autoscaling headroom |
| Storage growth | Retention policy, tiering to cold storage |
| Bandwidth | CDN, compression, adaptive quality |
| Cost projection | Whether the design is viable at all |

## 7. Where estimates go wrong

- **Using average instead of peak.** Provisioning for the mean means being down at the peak.
- **Forgetting the 8x on bits.** An easy factor-of-eight error in the direction of "looks fine."
- **Ignoring replication.** 2 TB of data is 6 TB of disk.
- **Precision theatre.** Carrying four significant figures through an estimate built on a
  guessed posting rate. If the input is "about 2 posts a day," the output is "about 700/s," not
  694.4.
- **Estimating what doesn't matter.** In a media system, arguing about text row size is wasted
  effort.

The discipline is knowing which quantity dominates, computing that one roughly, and moving on.
