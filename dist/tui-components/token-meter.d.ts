export interface TokenMeterProps {
    /** Current token usage */
    tokens: number;
    /** Soft limit */
    softLimit: number;
    /** Hard limit (optional) */
    hardLimit?: number;
}
export declare function TokenMeter(props: TokenMeterProps): import("solid-js").JSX.Element;
