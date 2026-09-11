import type { Loader, LoaderContext } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { AstroError } from 'astro/errors';
import {
  systemDesignSchema,
  kubernetesSchema,
  dsaSchema,
  aiEngineeringSchema,
} from '@/content/schemas';

/**
 * Directory prefix under `src/content/docs/` -> required frontmatter schema.
 *
 * Astro's collection `schema` only ever sees raw frontmatter, never the entry
 * id, so per-directory metadata rules cannot be expressed there. The loader's
 * `parseData` hook *does* receive the id, so we wrap Starlight's docs loader
 * and run the domain schema after Astro's own validation/coercion has run.
 */
const domains = [
  { dir: 'system-design', schema: systemDesignSchema },
  { dir: 'kubernetes', schema: kubernetesSchema },
  { dir: 'dsa', schema: dsaSchema },
  { dir: 'ai-engineering', schema: aiEngineeringSchema },
] as const;

function domainFor(id: string) {
  return domains.find((d) => id === d.dir || id.startsWith(`${d.dir}/`));
}

/**
 * Starlight's `docsLoader()` with per-domain frontmatter validation layered on
 * top. Entries outside a known domain directory (e.g. `index.mdx`) are passed
 * through with Starlight's stock validation only.
 */
export function metanoiaDocsLoader(): Loader {
  const inner = docsLoader();
  return {
    name: 'metanoia-docs-loader',
    load: (context: LoaderContext) =>
      inner.load({
        ...context,
        parseData: async (props) => {
          const data = await context.parseData(props);
          const domain = domainFor(props.id);
          if (!domain) return data;
          const result = domain.schema.safeParse(data);
          if (!result.success) {
            const details = result.error.issues
              .map((issue) => {
                const path = issue.path.join('.') || '(root)';
                return `  - ${path}: ${issue.message}`;
              })
              .join('\n');
            throw new AstroError(
              `Invalid frontmatter in docs entry "${props.id}".`,
              `Entries under src/content/docs/${domain.dir}/ must satisfy the ${domain.dir} schema:\n${details}`
            );
          }
          return data;
        },
      }),
  };
}
