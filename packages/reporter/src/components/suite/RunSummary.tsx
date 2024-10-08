import type { BettererRunSummary } from '@betterer/betterer';
import type { FC } from '@betterer/render';

import { memo, React } from '@betterer/render';
import { BettererTaskResult } from '@betterer/tasks';

import { useReporterState } from '../../state/store.js';

/** @knipignore used by an exported function */
export interface RunSummaryProps {
  runSummary: BettererRunSummary;
}

export const RunSummary: FC<RunSummaryProps> = memo(function RunSummary({ runSummary }) {
  const [, logs, status] = useReporterState();

  const runLogs = logs[runSummary.name];
  const runStatus = status[runSummary.name];

  return (
    <BettererTaskResult
      error={runSummary.error}
      name={runSummary.name}
      status={runStatus ?? null}
      logs={runLogs ?? []}
    />
  );
});
