import type { CampaignRun } from '../contracts.js';
/**
 * Pure client-side derivations. Kept free of React so they can be unit tested
 * in plain node (the client has no DOM test harness).
 */
/** Evidence.v1 dedup search flags, in methodology order: advisory databases then public discussion. */
export declare const DEDUP_SOURCES: readonly [{
    readonly key: "nvd_searched";
    readonly label: "NVD";
    readonly group: "advisory";
}, {
    readonly key: "ghsa_searched";
    readonly label: "GHSA";
    readonly group: "advisory";
}, {
    readonly key: "ecosystem_db_searched";
    readonly label: "生态库";
    readonly group: "advisory";
}, {
    readonly key: "issues_searched";
    readonly label: "Issues / PRs";
    readonly group: "discussion";
}, {
    readonly key: "commits_searched";
    readonly label: "Commits";
    readonly group: "discussion";
}, {
    readonly key: "blogs_searched";
    readonly label: "Web / 博客";
    readonly group: "discussion";
}];
export interface DedupSourceState {
    key: string;
    label: string;
    group: 'advisory' | 'discussion';
    searched: boolean;
}
export declare function valueAtPath(root: Record<string, unknown> | undefined, path: string): unknown;
/** Read the six Evidence.v1 dedup booleans; unreported older findings read as not-searched. */
export declare function dedupSources(evidence: Record<string, unknown> | undefined): DedupSourceState[];
/** All advisory + discussion sources searched — the contract's novelty precondition. */
export declare function dedupComplete(evidence: Record<string, unknown> | undefined): boolean;
export declare function dedupExistingCve(evidence: Record<string, unknown> | undefined): string;
/** Finding ids become file names and CLI args; keep them to registry-style slugs. */
export declare function findingIdError(id: string): string | undefined;
/**
 * Letter shortcuts (r, /) must not fire while the user is focused on an
 * interactive element — otherwise pressing r on a focused button refreshes the
 * workspace mid-click. Digit shortcuts (1-9, 0) are safe everywhere.
 */
export declare function shouldHandleShortcut(target: EventTarget | null, key: string): boolean;
/** A run needs a lane pump while any lane is still queued. Terminal runs never do. */
export declare function runNeedsPump(run: CampaignRun | undefined): boolean;
/** Watch a run for reconciliation while it can still make progress. */
export declare function runActive(run: Pick<CampaignRun, 'status'>): boolean;
//# sourceMappingURL=derive.d.ts.map