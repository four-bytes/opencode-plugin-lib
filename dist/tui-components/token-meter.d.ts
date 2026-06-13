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
export declare function TokenMeter(props: TokenMeterProps): import("solid-js").JSX.Element;
