// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import mermaid from 'astro-mermaid';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',

  markdown: {
    // Astro 7 defaults to the Sätteri Markdown processor, which does not run
    // remark/rehype plugins. KaTeX needs the unified pipeline, so select it
    // explicitly rather than relying on the deprecated top-level plugin arrays.
    // `$inline$` / `$$block$$` -> MathML + HTML, styled by katex.min.css
    // (imported once in src/styles/global.css).
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { strict: 'ignore', throwOnError: false }]],
    }),
  },

  integrations: [
    // Must precede Starlight so ```mermaid fences are transformed before
    // Starlight's Expressive Code claims them as plain code blocks.
    // Note: installing @mermaid-js/layout-elk makes this integration bundle a
    // 1.9MB ELK chunk automatically. Only add it if an ELK layout is actually used.
    mermaid({
      theme: 'neutral',
      autoTheme: true,
      enableLog: false,
      mermaidConfig: {
        sequence: { useMaxWidth: true },
        flowchart: { useMaxWidth: true, htmlLabels: true },
      },
    }),
    react({ experimentalReactChildren: true }),
    starlight({
      title: 'Project Metanoia',
      description:
        'A structured technical notebook: system design, Kubernetes, DSA and AI engineering.',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/hemant/project-metanoia' },
      ],
      // Starlight bundles Pagefind; `pagefind: true` renders the search UI and
      // wires the index produced by `pagefind --site dist` in the build script.
      pagefind: true,
      customCss: ['./src/styles/global.css'],
      expressiveCode: {
        themes: ['github-dark-default', 'github-light'],
      },
      sidebar: [
        {
          label: 'System Design',
          collapsed: false,
          items: [
            { label: 'Overview', slug: 'system-design' },
            { label: 'ADRs', items: [{ autogenerate: { directory: 'system-design/adrs' } }] },
            { label: 'Case Studies', items: [{ autogenerate: { directory: 'system-design/case-studies' } }] },
            { label: 'Concepts', items: [{ autogenerate: { directory: 'system-design/concepts' } }] },
          ],
        },
        {
          label: 'Kubernetes',
          collapsed: false,
          items: [
            { label: 'Overview', slug: 'kubernetes' },
            { label: 'Architecture', items: [{ autogenerate: { directory: 'kubernetes/architecture' } }] },
            { label: 'Manifests', items: [{ autogenerate: { directory: 'kubernetes/manifests' } }] },
            { label: 'Troubleshooting', items: [{ autogenerate: { directory: 'kubernetes/troubleshooting' } }] },
            { label: 'Security', items: [{ autogenerate: { directory: 'kubernetes/security' } }] },
          ],
        },
        {
          label: 'DSA',
          collapsed: false,
          items: [
            { label: 'Overview', slug: 'dsa' },
            { label: 'Patterns', items: [{ autogenerate: { directory: 'dsa/patterns' } }] },
          ],
        },
        {
          label: 'AI Engineering',
          collapsed: false,
          items: [
            { label: 'Overview', slug: 'ai-engineering' },
            { label: 'Math', items: [{ autogenerate: { directory: 'ai-engineering/math' } }] },
            { label: 'Transformers', items: [{ autogenerate: { directory: 'ai-engineering/transformers' } }] },
            { label: 'RAG', items: [{ autogenerate: { directory: 'ai-engineering/rag' } }] },
            { label: 'Fine-Tuning', items: [{ autogenerate: { directory: 'ai-engineering/fine-tuning' } }] },
            { label: 'Agents', items: [{ autogenerate: { directory: 'ai-engineering/agents' } }] },
          ],
        },
      ],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
