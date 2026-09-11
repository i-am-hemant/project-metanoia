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
  // Project site (not a user site), so it is served from a subpath. `site` +
  // `base` together drive canonical URLs, the sitemap and every generated link.
  site: 'https://i-am-hemant.github.io',
  base: '/project-metanoia',
  // Emit `/page/index.html` so the subpath works without a trailing-slash
  // redirect, which GitHub Pages' static host cannot do.
  trailingSlash: 'always',

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
        { icon: 'github', label: 'GitHub', href: 'https://github.com/i-am-hemant/project-metanoia' },
      ],
      // Starlight bundles Pagefind; `pagefind: true` renders the search UI and
      // wires the index produced by `pagefind --site dist` in the build script.
      pagefind: true,
      customCss: ['./src/styles/global.css'],
      components: {
        // Adds a drag handle to the right-hand TOC panel and gives it a width
        // variable independent of the left nav.
        TwoColumnContent: './src/components/overrides/TwoColumnContent.astro',
      },
      expressiveCode: {
        themes: ['github-dark-default', 'github-light'],
      },
      sidebar: [
        {
          label: 'System Design',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'system-design' },
            {
              label: 'Fundamentals',
              collapsed: true,
              items: [{ autogenerate: { directory: 'system-design/fundamentals' } }],
            },
            {
              label: 'Components',
              collapsed: true,
              items: [{ autogenerate: { directory: 'system-design/components' } }],
            },
            {
              label: 'Real-World Systems',
              collapsed: true,
              items: [{ autogenerate: { directory: 'system-design/case-studies' } }],
            },
            {
              label: 'ADRs',
              collapsed: true,
              items: [{ autogenerate: { directory: 'system-design/adrs' } }],
            },
          ],
        },
        {
          label: 'Kubernetes',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'kubernetes' },
            {
              label: 'Architecture',
              collapsed: true,
              items: [{ autogenerate: { directory: 'kubernetes/architecture' } }],
            },
            {
              label: 'Manifests',
              collapsed: true,
              items: [{ autogenerate: { directory: 'kubernetes/manifests' } }],
            },
            {
              label: 'Troubleshooting',
              collapsed: true,
              items: [{ autogenerate: { directory: 'kubernetes/troubleshooting' } }],
            },
            {
              label: 'Security',
              collapsed: true,
              items: [{ autogenerate: { directory: 'kubernetes/security' } }],
            },
          ],
        },
        {
          label: 'DSA',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'dsa' },
            {
              label: 'Patterns',
              collapsed: true,
              items: [{ autogenerate: { directory: 'dsa/patterns' } }],
            },
          ],
        },
        {
          label: 'AI Engineering',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'ai-engineering' },
            {
              label: 'Math',
              collapsed: true,
              items: [{ autogenerate: { directory: 'ai-engineering/math' } }],
            },
            {
              label: 'Transformers',
              collapsed: true,
              items: [{ autogenerate: { directory: 'ai-engineering/transformers' } }],
            },
            {
              label: 'RAG',
              collapsed: true,
              items: [{ autogenerate: { directory: 'ai-engineering/rag' } }],
            },
            {
              label: 'Fine-Tuning',
              collapsed: true,
              items: [{ autogenerate: { directory: 'ai-engineering/fine-tuning' } }],
            },
            {
              label: 'Agents',
              collapsed: true,
              items: [{ autogenerate: { directory: 'ai-engineering/agents' } }],
            },
          ],
        },
      ],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
