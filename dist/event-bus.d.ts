type Listener<T> = (payload: T) => void;
export declare class EventBus {
    private listeners;
    private latest;
    on<T>(event: string, listener: Listener<T>): () => void;
    emit<T>(event: string, payload: T): void;
    clear(): void;
}
export {};
