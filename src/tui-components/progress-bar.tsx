/** @jsxImportSource @opentui/solid */

/* Reusable progress bar for opencode TUI plugins. Compact inline mode. */

export interface ProgressBarProps {
  current: number;
  total: number;
  barWidth?: number;
  trackColor?: string;
  trackBg?: string;
  colors?: {
    green?: string;
    orange?: string;
    red?: string;
  };
  showLabel?: boolean;
}

function formatNum(n: number): string {
  return n.toLocaleString("en-US");
}

function buildBar(pct: number, width: number): string {
  const filled = Math.round((pct / 100) * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

export function ProgressBar(props: ProgressBarProps) {
  const pct = props.total > 0 ? (props.current / props.total) * 100 : 0;
  const green = props.colors?.green ?? "#4caf50";
  const orange = props.colors?.orange ?? "#ff9800";
  const red = props.colors?.red ?? "#f44336";
  const barColor = pct >= 80 ? red : pct >= 50 ? orange : green;
  const w = props.barWidth ?? 10;
  const bar = buildBar(pct, w);
  const track = props.trackBg ?? "#2a2a2a";
  const showLabel = props.showLabel !== false;

  return (
    <box flexDirection="row">
      {showLabel && (
        <text>{`${formatNum(props.current)}/${formatNum(props.total)} (${pct.toFixed(1)}%) `}</text>
      )}
      <box backgroundColor={track}>
        <text fg={barColor}>{bar}</text>
      </box>
    </box>
  );
}
