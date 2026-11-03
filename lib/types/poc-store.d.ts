import type { PocDraft, PocRun } from './contracts.js';
export declare class PocStore {
    private readonly dshDir;
    private mutationQueue;
    constructor(projectRoot: string);
    ensureDirectory(): Promise<void>;
    saveDraft(draft: PocDraft): Promise<void>;
    loadDrafts(): Promise<PocDraft[]>;
    saveRun(run: PocRun): Promise<void>;
    loadRuns(): Promise<PocRun[]>;
    findDraft(id: string): Promise<PocDraft | undefined>;
    findRun(id: string): Promise<PocRun | undefined>;
    findRunsByFinding(findingId: string): Promise<PocRun[]>;
    findDraftsByFinding(findingId: string): Promise<PocDraft[]>;
    private writeAtomic;
    private enqueue;
}
//# sourceMappingURL=poc-store.d.ts.map