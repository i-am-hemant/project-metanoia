import { defineCollection } from 'astro:content';
import { i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { metanoiaDocsLoader } from '@/content/loaders';
import { docsFrontmatterExtension } from '@/content/schemas';

/**
 * Content model for Project Metanoia.
 *
 * Starlight owns a single `docs` collection, so domain-specific metadata is
 * enforced per directory by `metanoiaDocsLoader()` rather than by declaring one
 * Astro collection per domain. That keeps Starlight routing, sidebar
 * autogeneration and Pagefind indexing intact while still failing the build on
 * missing or invalid domain frontmatter.
 *
 * See `src/content/schemas.ts` for the domain contracts.
 *
 * The `i18n` collection carries Starlight's UI string overrides. Starlight
 * queries it unconditionally, so it stays declared (and non-empty) even for a
 * single-locale site to keep the build warning-free.
 */
export const collections = {
  docs: defineCollection({
    loader: metanoiaDocsLoader(),
    schema: docsSchema({ extend: docsFrontmatterExtension }),
  }),
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
