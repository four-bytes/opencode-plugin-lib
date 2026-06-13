/** @jsxImportSource @opentui/solid */

/**
 * Reusable progress bar for opencode TUI plugins.
 *
 * Two-column layout (50/50):
 *   Left:  "12,345 / 50,000 (24.7%)"
 *   Right: [████████░░░░░░░░░░░░]
 */

export interface ProgressBarProps {
  current: number;
  total: number;
  height?: number;
  trackColor?: string;
  /** Green/Orange/Red thresholds. Default: green < 50%, orange < 80%, red >= 80% */
  colors?: {
    green?: string;
    orange?: string;
    red?: string;
  };
  /** Show label on left side */
  showLabel?: boolean;
}

function formatNum(n: number): string {
  return n.toLocaleString("en-US");
}

export function ProgressBar(props: ProgressBarProps) {
  const pct = props.total > 0 ? Math.min(100, Math.max(0, (props.current / props.total) * 100)) : 0;
  const h = props.height ?? 1;
  const green = props.colors?.green ?? "#4caf50";
  const orange = props.colors?.orange ?? "#ff9800";
  const red = props.colors?.red ?? "#f44336";
  const barColor = pct >= 80 ? red : pct >= 50 ? orange : green;
  const showLabel = props.showLabel !== false;

  return (
    <box flexDirection="row" width="100%">
      {showLabel && (
        <box width="50%">
          <text>{`${formatNum(props.current)} / ${formatNum(props.total)} (${pct.toFixed(1)}%)`}</text>
        </box>
      )}
      <box width={showLabel ? "50%" : "100%"} height={h} backgroundColor={props.trackColor ?? "#333"}>
        <box height={h} width={`${pct}%`} backgroundColor={barColor} />
      </box>
    </box>
  );
}
