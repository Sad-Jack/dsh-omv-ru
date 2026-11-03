import type { DedupStatus, DedupSummary } from './contracts.js';
export interface DedupCandidate {
    id: string;
    package: string;
    ecosystem: string;
    vulnerability: string;
    path: string;
}
/**
 * Local-first duplicate triage. External advisory adapters can add matches later.
 * A match alone is only "review this neighbour"; `possible_duplicate` additionally
 * requires the vulnerability class to overlap, so same-package campaigns with
 * distinct vulnerability lanes do not flag each other as duplicates.
 */
export declare class DedupService {
    readonly projectRoot: string;
    private writeTail;
    constructor(projectRoot: string);
    list(findingId?: string): Promise<DedupSummary[]>;
    get(findingId: string): Promise<DedupSummary>;
    scan(findingId: string, candidates: readonly DedupCandidate[], advisoryTitles?: readonly string[]): Promise<DedupSummary>;
    update(findingId: string, status: DedupStatus, matchId?: string): Promise<DedupSummary>;
    private readStore;
    private writeStore;
    private storePath;
    private serial;
}
//# sourceMappingURL=dedup.d.ts.map