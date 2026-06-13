/** @jsxImportSource @opentui/solid */
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
export declare function ProgressBar(props: ProgressBarProps): import("solid-js").JSX.Element;
