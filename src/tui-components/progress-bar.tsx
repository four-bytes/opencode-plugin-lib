/** @jsxImportSource @opentui/solid */

/* Reusable progress bar for opencode TUI plugins. Box-based: grey track + colored fill. */

export interface ProgressBarProps {
  current: number;
  total: number;
  barWidth?: number;
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

export function ProgressBar(props: ProgressBarProps) {
  const pct = props.total > 0 ? (props.current / props.total) * 100 : 0;
  const green = props.colors?.green ?? "#4caf50";
  const orange = props.colors?.orange ?? "#ff9800";
  const red = props.colors?.red ?? "#f44336";
  const barColor = pct >= 80 ? red : pct >= 50 ? orange : green;
  const w = props.barWidth ?? 10;
  const showLabel = props.showLabel !== false;

  return (
    <box flexDirection="row">
      {showLabel && (
        <text>{`${formatNum(props.current)}/${formatNum(props.total)} `}</text>
      )}
      <box width={w} height={1} backgroundColor="#333">
        <box
          width={`${Math.min(pct, 100)}%`}
          height={1}
          backgroundColor={barColor}
        />
      </box>
      <text> {pct.toFixed(1)}%</text>
    </box>
  );
}
