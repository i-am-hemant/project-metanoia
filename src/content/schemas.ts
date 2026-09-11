import { z } from 'astro/zod';

/**
 * Per-domain frontmatter schemas for Project Metanoia.
 *
 * These are the *authoritative* metadata contracts for each learning domain.
 * They are applied two ways:
 *   1. Merged (as optional fields) into Starlight's `docs` schema so editors and
 *      `astro check` know the fields exist — see `src/content.config.ts`.
 *   2. Enforced as *required* per directory by `metanoiaDocsLoader()` — see
 *      `src/content/loaders.ts` — which fails the build on violations.
 */

const tags = z.array(z.string().min(1)).min(1, 'at least one tag is required');

/** `src/content/docs/system-design/**` — ADRs, case studies, concept notes. */
export const systemDesignSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['adr', 'case-study', 'concept']),
  status: z.enum(['Proposed', 'Accepted', 'Deprecated']).optional(),
  date: z.coerce.date(),
  tags,
});

/** `src/content/docs/kubernetes/**` */
export const kubernetesSchema = z.object({
  title: z.string().min(1),
  category: z.enum(['Architecture', 'Manifests', 'Troubleshooting', 'Security']),
  tags,
});

/** `src/content/docs/dsa/**` */
export const dsaSchema = z.object({
  title: z.string().min(1),
  pattern: z.enum([
    'Sliding Window',
    'Two Pointers',
    'Dynamic Programming',
    'Graphs',
    'Trees',
    'Trie',
    'Other',
  ]),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  timeComplexity: z.string().min(1),
  spaceComplexity: z.string().min(1),
  leetcodeUrl: z.url().optional(),
});

/** `src/content/docs/ai-engineering/**` */
export const aiEngineeringSchema = z.object({
  title: z.string().min(1),
  category: z.enum(['Math', 'Transformers', 'RAG', 'Fine-Tuning', 'Agents']),
  tags,
});

export type SystemDesignFrontmatter = z.infer<typeof systemDesignSchema>;
export type KubernetesFrontmatter = z.infer<typeof kubernetesSchema>;
export type DsaFrontmatter = z.infer<typeof dsaSchema>;
export type AiEngineeringFrontmatter = z.infer<typeof aiEngineeringSchema>;

/**
 * Superset of all domain fields, every field optional. This is what gets merged
 * into Starlight's frontmatter schema; the loader supplies the per-directory
 * "required" half of the contract.
 */
export const docsFrontmatterExtension = z.object({
  // system-design
  type: z.enum(['adr', 'case-study', 'concept']).optional(),
  status: z.enum(['Proposed', 'Accepted', 'Deprecated']).optional(),
  date: z.coerce.date().optional(),
  // shared by system-design / kubernetes / ai-engineering
  tags: z.array(z.string().min(1)).optional(),
  // kubernetes | ai-engineering
  category: z
    .enum([
      'Architecture',
      'Manifests',
      'Troubleshooting',
      'Security',
      'Math',
      'Transformers',
      'RAG',
      'Fine-Tuning',
      'Agents',
    ])
    .optional(),
  // dsa
  pattern: z
    .enum([
      'Sliding Window',
      'Two Pointers',
      'Dynamic Programming',
      'Graphs',
      'Trees',
      'Trie',
      'Other',
    ])
    .optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  timeComplexity: z.string().min(1).optional(),
  spaceComplexity: z.string().min(1).optional(),
  leetcodeUrl: z.url().optional(),
});
