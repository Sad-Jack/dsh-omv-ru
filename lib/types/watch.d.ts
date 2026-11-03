import type { WorkspaceChangeEvent } from './contracts.js';
type Listener = (event: WorkspaceChangeEvent) => void;
/** Lazy, reference-counted watcher used by the HTTP event stream. */
export declare class OmvWorkspaceWatcher {
    private readonly projectRoot;
    private readonly debounceMs;
    private readonly listeners;
    private readonly paths;
    private watcher;
    private timer;
    private revision;
    constructor(projectRoot: string, debounceMs: number);
    subscribe(listener: Listener): () => void;
    close(): void;
    private ensureWatching;
    private recordPath;
    private schedule;
}
export {};
//# sourceMappingURL=watch.d.ts.map