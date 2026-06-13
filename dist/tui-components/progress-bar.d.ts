/** @jsxImportSource @opentui/solid */
/**
 * Reusable progress bar for opencode TUI plugins.
 *
 * Two-column layout (50/50):
 *   Left:  "12,345 / 50,000 (24.7%)"
 *   Right: [████████░░░░░░░░░░░░]
 */
export interface ProgressBarProps {
    current: number;
    total: number;
    height?: number;
    trackColor?: string;
    /** Green/Orange/Red thresholds. Default: green < 50%, orange < 80%, red >= 80% */
    colors?: {
        green?: string;
        orange?: string;
        red?: string;
    };
    /** Show label on left side */
    showLabel?: boolean;
}
export declare function ProgressBar(props: ProgressBarProps): import("solid-js").JSX.Element;
