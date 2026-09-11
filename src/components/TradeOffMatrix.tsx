import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/** How a cell value should be rendered. */
export type Verdict = 'good' | 'bad' | 'mixed' | 'neutral';

export interface TradeOffCell {
  /** Cell text. Keep it short — one clause. */
  value: string;
  /** Colour/semantics of the cell. Defaults to `neutral`. */
  verdict?: Verdict;
  /** Optional expansion shown beneath the value in muted text. */
  note?: string;
}

export interface TradeOffCriterion {
  /** Row label, e.g. "p99 latency" or "Operational cost". */
  label: string;
  /** Optional clarification of how the criterion is measured. */
  description?: string;
  /**
   * One entry per option, in the same order as `options`. A raw string is
   * shorthand for `{ value, verdict: 'neutral' }`.
   */
  cells: Array<TradeOffCell | string>;
}

export interface TradeOffOption {
  /** Column header, e.g. "Cache-aside + Redis". */
  name: string;
  /** Optional one-line summary rendered under the header. */
  summary?: string;
  /** Marks the column as the decision that was taken. */
  recommended?: boolean;
}

export interface TradeOffMatrixProps {
  /** Architecture options being compared — one column each. */
  options: TradeOffOption[];
  /** Criteria being scored — one row each. */
  criteria: TradeOffCriterion[];
  /** Optional caption rendered below the table. */
  caption?: string;
  className?: string;
}

const verdictBadge: Record<Verdict, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  good: 'default',
  bad: 'destructive',
  mixed: 'secondary',
  neutral: 'outline',
};

const verdictLabel: Record<Verdict, string> = {
  good: 'Favourable',
  bad: 'Unfavourable',
  mixed: 'Trade-off',
  neutral: 'Neutral',
};

function normalise(cell: TradeOffCell | string): TradeOffCell {
  return typeof cell === 'string' ? { value: cell, verdict: 'neutral' } : cell;
}

function joinClasses(...values: Array<string | false | undefined>): string {
  return values.filter(Boolean).join(' ');
}

/**
 * Multi-column architecture comparison matrix.
 *
 * Renders criteria as rows and candidate architectures as columns, with each
 * cell carrying an explicit verdict so the reader can scan a decision in one
 * pass instead of parsing prose.
 *
 * @example
 * <TradeOffMatrix
 *   options={[{ name: 'Cache-aside', recommended: true }, { name: 'Write-through' }]}
 *   criteria={[
 *     { label: 'Read latency', cells: [
 *       { value: 'sub-10ms on hit', verdict: 'good' },
 *       { value: 'sub-10ms on hit', verdict: 'good' },
 *     ] },
 *   ]}
 * />
 */
export function TradeOffMatrix({
  options,
  criteria,
  caption,
  className,
}: TradeOffMatrixProps): React.JSX.Element {
  const mismatched = criteria.filter((c) => c.cells.length !== options.length);

  return (
    <div className={joinClasses('not-content my-6 w-full overflow-x-auto', className)}>
      <Table className="min-w-[36rem] text-sm">
        {caption ? <TableCaption>{caption}</TableCaption> : null}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[14rem] align-bottom font-semibold">Criterion</TableHead>
            {options.map((option) => (
              <TableHead key={option.name} className="align-bottom">
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 font-semibold text-foreground">
                    {option.name}
                    {option.recommended ? (
                      <Badge variant="default" title="Selected option">
                        Chosen
                      </Badge>
                    ) : null}
                  </span>
                  {option.summary ? (
                    <span className="text-xs font-normal text-muted-foreground">
                      {option.summary}
                    </span>
                  ) : null}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {criteria.map((criterion) => (
            <TableRow key={criterion.label}>
              <TableHead scope="row" className="align-top font-medium text-foreground">
                <div className="flex flex-col gap-1">
                  <span>{criterion.label}</span>
                  {criterion.description ? (
                    <span className="text-xs font-normal text-muted-foreground">
                      {criterion.description}
                    </span>
                  ) : null}
                </div>
              </TableHead>
              {options.map((option, index) => {
                const raw = criterion.cells[index];
                if (raw === undefined) {
                  return (
                    <TableCell key={option.name} className="align-top text-muted-foreground">
                      —
                    </TableCell>
                  );
                }
                const cell = normalise(raw);
                const verdict = cell.verdict ?? 'neutral';
                return (
                  <TableCell key={option.name} className="align-top">
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={verdictBadge[verdict]}
                        title={verdictLabel[verdict]}
                        className="h-auto max-w-full whitespace-normal py-0.5 text-left"
                      >
                        {cell.value}
                      </Badge>
                      {cell.note ? (
                        <span className="text-xs text-muted-foreground">{cell.note}</span>
                      ) : null}
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {mismatched.length > 0 ? (
        <p className="mt-2 text-xs text-destructive">
          Matrix definition warning: {mismatched.length} criterion row(s) do not supply one cell per
          option ({mismatched.map((c) => c.label).join(', ')}).
        </p>
      ) : null}
    </div>
  );
}

export default TradeOffMatrix;
