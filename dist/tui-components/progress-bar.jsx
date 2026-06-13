/** @jsxImportSource @opentui/solid */
import { createMemo } from "solid-js";
const FILLED_FG = "#fff";
const FILLED_BG = "#4caf50";
const UNFILLED_FG = "#888";
const UNFILLED_BG = "#2a2a2a";
function centerText(s, width) {
    if (s.length >= width)
        return s.slice(0, width);
    const left = Math.floor((width - s.length) / 2);
    return " ".repeat(left) + s + " ".repeat(Math.max(0, width - s.length - left));
}
function formatNum(n) {
    return n.toLocaleString("en-US");
}
export function ProgressBar(props) {
    const pct = createMemo(() => props.total > 0 ? (props.current / props.total) * 100 : 0);
    const w = createMemo(() => props.barWidth ?? 10);
    const filledCount = createMemo(() => Math.round((props.current / props.total) * w()));
    const text = createMemo(() => centerText(` ${pct().toFixed(1)}% `, w()));
    const showLabel = createMemo(() => props.showLabel !== false);
    return (<box flexDirection="row">
      {showLabel() && <text>{`${formatNum(props.current)}/${formatNum(props.total)} `}</text>}
      <box flexDirection="row">
        {Array.from(text()).map((char, i) => (<box backgroundColor={i < filledCount() ? FILLED_BG : UNFILLED_BG}>
            <text fg={i < filledCount() ? FILLED_FG : UNFILLED_FG}>{char}</text>
          </box>))}
      </box>
    </box>);
}
