import type { Context } from '@deepseek-ai/cordis';
export interface DshRuntimeFiber {
    uid: number | null;
    name: string;
    state: DshRuntimeState;
    dependencies: string[];
}
export interface DshRuntimeEntry {
    name: string;
    fibers: DshRuntimeFiber[];
}
export type DshRuntimeState = 'PENDING' | 'LOADING' | 'ACTIVE' | 'FAILED' | 'DISPOSED' | 'UNLOADING' | `UNKNOWN(${number})`;
export interface DshRuntimeSnapshot {
    currentFiber: DshRuntimeFiber;
    runtimes: DshRuntimeEntry[];
    pending: number;
    failed: number;
}
/** Read-only Cordis lifecycle diagnostics for missing-service and HMR issues. */
export declare function inspectDshRuntime(ctx: Context): DshRuntimeSnapshot;
//# sourceMappingURL=runtime.d.ts.map