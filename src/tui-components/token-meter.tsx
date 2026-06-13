/** @jsxImportSource @opentui/solid */
import { ProgressBar } from "./progress-bar";

export interface TokenMeterProps {
  /** Current token usage */
  tokens: number;
  /** Soft limit */
  softLimit: number;
  /** Hard limit (optional) */
  hardLimit?: number;
  /** Theme colors */
  colors?: {
    green?: string;
    orange?: string;
    red?: string;
  };
}

export function TokenMeter(props: TokenMeterProps) {
  return (
    <box flexDirection="column">
      <text><b>Tokens 📊</b></text>
      <ProgressBar
        current={props.tokens}
        total={props.softLimit}
        colors={props.colors}
      />
    </box>
  );
}
