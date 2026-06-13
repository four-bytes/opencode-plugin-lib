/** @jsxImportSource @opentui/solid */
export interface ProgressBarProps {
    current: number;
    total: number;
    barWidth?: number;
    showLabel?: boolean;
}
export declare function ProgressBar(props: ProgressBarProps): import("solid-js").JSX.Element;
