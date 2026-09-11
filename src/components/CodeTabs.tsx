import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/** Languages this notebook keeps parallel implementations in. */
export const CODE_LANGUAGES = ['python', 'go', 'cpp'] as const;

export type CodeLanguage = (typeof CODE_LANGUAGES)[number];

const LANGUAGE_LABELS: Record<CodeLanguage, string> = {
  python: 'Python',
  go: 'Go',
  cpp: 'C++',
};

export interface CodeTabsProps {
  /**
   * Snippet source per language. Omitted languages are simply not rendered, so
   * a note with only Python and Go shows two tabs rather than an empty third.
   */
  snippets: Partial<Record<CodeLanguage, string>>;
  /** Which tab opens first. Falls back to the first available language. */
  defaultLanguage?: CodeLanguage;
  /** Optional heading rendered above the tab strip. */
  label?: string;
  className?: string;
}

function joinClasses(...values: Array<string | false | undefined>): string {
  return values.filter(Boolean).join(' ');
}

function dedent(source: string): string {
  const lines = source.replace(/\t/g, '  ').split('\n');
  while (lines.length > 0 && lines[0]?.trim() === '') lines.shift();
  while (lines.length > 0 && lines[lines.length - 1]?.trim() === '') lines.pop();
  const indents = lines
    .filter((line) => line.trim() !== '')
    .map((line) => line.length - line.trimStart().length);
  const shift = indents.length > 0 ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(shift)).join('\n');
}

/**
 * Language-switchable code viewer built on shadcn `<Tabs />`.
 *
 * Intended for DSA notes where the same algorithm is kept in Python, Go and
 * C++. Snippets are plain strings, so they can be authored inline in MDX
 * without fighting fence-in-fence escaping.
 *
 * @example
 * <CodeTabs snippets={{ python: 'def f(): ...', go: 'func f() {}' }} />
 */
export function CodeTabs({
  snippets,
  defaultLanguage,
  label,
  className,
}: CodeTabsProps): React.JSX.Element | null {
  const available = CODE_LANGUAGES.filter(
    (language) => typeof snippets[language] === 'string' && snippets[language]!.trim() !== ''
  );

  if (available.length === 0) return null;

  const fallback = available[0] as CodeLanguage;
  const initial =
    defaultLanguage && available.includes(defaultLanguage) ? defaultLanguage : fallback;

  return (
    <div className={joinClasses('not-content my-6', className)}>
      {label ? (
        <p className="mb-2 text-sm font-semibold text-foreground">{label}</p>
      ) : null}
      <Tabs defaultValue={initial}>
        <TabsList>
          {available.map((language) => (
            <TabsTrigger key={language} value={language}>
              {LANGUAGE_LABELS[language]}
            </TabsTrigger>
          ))}
        </TabsList>
        {available.map((language) => (
          <TabsContent key={language} value={language}>
            <pre
              className="overflow-x-auto rounded-md border border-border bg-muted/40 p-4 text-sm leading-relaxed"
              data-language={language}
            >
              <code>{dedent(snippets[language] as string)}</code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default CodeTabs;
