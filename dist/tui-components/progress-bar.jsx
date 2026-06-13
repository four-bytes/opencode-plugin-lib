/** @jsxImportSource @opentui/solid */
function formatNum(n) {
    return n.toLocaleString("en-US");
}
export function ProgressBar(props) {
    const pct = props.total > 0 ? Math.min(100, Math.max(0, (props.current / props.total) * 100)) : 0;
    const h = props.height ?? 1;
    const green = props.colors?.green ?? "#4caf50";
    const orange = props.colors?.orange ?? "#ff9800";
    const red = props.colors?.red ?? "#f44336";
    const barColor = pct >= 80 ? red : pct >= 50 ? orange : green;
    const showLabel = props.showLabel !== false;
    return (<box flexDirection="row" width="100%" justifyContent="space-between">
      {showLabel && (<text>{`${formatNum(props.current)} / ${formatNum(props.total)} (${pct.toFixed(1)}%)`}</text>)}
      <box width={showLabel ? "33%" : "100%"} height={h} backgroundColor={props.trackColor ?? "#333"}>
        <box height={h} width={`${pct}%`} backgroundColor={barColor}/>
      </box>
    </box>);
}
