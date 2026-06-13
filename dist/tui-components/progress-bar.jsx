/** @jsxImportSource @opentui/solid */
function centerText(s, width) {
    if (s.length >= width)
        return s.slice(0, width);
    const totalPad = width - s.length;
    const left = Math.floor(totalPad / 2);
    const right = totalPad - left;
    return " ".repeat(left) + s + " ".repeat(right);
}
function formatNum(n) {
    return n.toLocaleString("en-US");
}
export function ProgressBar(props) {
    const pct = props.total > 0 ? (props.current / props.total) * 100 : 0;
    const green = props.colors?.green ?? "#4caf50";
    const orange = props.colors?.orange ?? "#ff9800";
    const red = props.colors?.red ?? "#f44336";
    const barColor = pct >= 80 ? red : pct >= 50 ? orange : green;
    const w = props.barWidth ?? 10;
    const showLabel = props.showLabel !== false;
    const trackColor = "#666";
    // Center the percentage text inside the bar and split into per-character
    // <text> elements so the foreground color can advance left-to-right as
    // the progress fill crosses each character position.
    const text = centerText(` ${pct.toFixed(1)}% `, w);
    const filledCount = Math.round((pct / 100) * w);
    const chars = Array.from(text);
    return (<box flexDirection="row">
      {showLabel && <text>{`${formatNum(props.current)}/${formatNum(props.total)} `}</text>}
      <box width={w} height={1} backgroundColor="#333" flexDirection="row">
        {chars.map((char, i) => (<text fg={i < filledCount ? barColor : trackColor}>{char}</text>))}
      </box>
    </box>);
}
