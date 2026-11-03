import type { CampaignIssue, DedupSummary, ReportPack, ReportQueueItem, WorkbenchFindingSummary, WorkspaceIssue, WorkspaceQualityPayload } from '../contracts.js';
export declare function readFindingWorkflowsSafe(projectRoot: string, findingsDir: string): Promise<{
    findings: WorkbenchFindingSummary[];
    issues: WorkspaceIssue[];
}>;
export declare function evidenceQueueRank(finding: WorkbenchFindingSummary): number;
export declare function reportQueueItem(pack: ReportPack, finding: WorkbenchFindingSummary): ReportQueueItem;
export declare function reportQueueRank(item: ReportQueueItem): number;
export declare function buildWorkspaceQuality(input: {
    workspaceIssues: readonly WorkspaceIssue[];
    campaignIssues: readonly CampaignIssue[];
    findings: readonly WorkbenchFindingSummary[];
    reports: readonly ReportQueueItem[];
    dedup: ReadonlyMap<string, DedupSummary>;
}): WorkspaceQualityPayload;
//# sourceMappingURL=quality.d.ts.map