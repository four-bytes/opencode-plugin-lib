export declare class LRUCache<K, V> {
    private maxEntries;
    private map;
    constructor(maxEntries?: number);
    get(key: K): V | undefined;
    set(key: K, value: V): void;
    has(key: K): boolean;
    clear(): void;
    get size(): number;
}
export declare const sessionCache: {
    embeddings: LRUCache<string, Float32Array<ArrayBufferLike>>;
    search: LRUCache<string, unknown[]>;
    chunks: LRUCache<string, unknown>;
    hashes: LRUCache<string, string>;
    reset(): void;
};
