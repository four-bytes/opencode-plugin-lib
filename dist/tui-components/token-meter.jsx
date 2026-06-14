/** @jsxImportSource @opentui/solid */
import { ProgressBar } from "./progress-bar";
export function TokenMeter(props) {
    return (<>
      <text><b>Tokens 📊</b></text>
      <ProgressBar current={props.tokens} total={props.softLimit}/>
    </>);
}
