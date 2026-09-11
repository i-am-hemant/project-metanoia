---
title: Chunking Strategies
description: Chunk boundaries decide retrieval quality more than the embedding model does.
category: RAG
tags: ["rag", "chunking", "retrieval", "embeddings"]
---

Ranked by how often they are the right default:

1. **Structural** — split on document structure (headings, list items, code fences). Best when
   the corpus has real structure; preserves the author's own semantic boundaries.
2. **Recursive character** — try paragraph, then sentence, then word, until under the token
   budget. The sane generic fallback.
3. **Semantic** — split where consecutive-sentence embedding distance spikes. Better recall,
   but an embedding pass per document at ingest.
4. **Fixed-size** — only acceptable with generous overlap, and only for unstructured text.

Two things matter more than the strategy: **overlap** (10-20% prevents an answer being severed
at a boundary) and **retrieval-time expansion** — embed the small chunk for precision, then hand
the model its neighbours for context.
