export interface ProgressBarProps {
    current: number;
    total: number;
    barWidth?: number;
    showLabel?: boolean;
    rightAlign?: boolean;
    fillFg?: string;
    fillBg?: string;
    unfillFg?: string;
    unfillBg?: string;
}
export declare function ProgressBar(props: ProgressBarProps): import("solid-js").JSX.Element;
