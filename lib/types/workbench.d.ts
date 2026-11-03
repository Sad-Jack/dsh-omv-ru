import type { ActionRequest, CampaignPayload, DashboardPayload, FindingPayload, OmvWorkbenchConfig, SearchHit, WorkspaceExportPayload, WorkspaceChangeEvent, WorkspaceQualityPayload, DedupSummary, HealthPayload } from './contracts.js';
import { OmvWorkflowService } from './workflow.js';
import { CampaignRunner } from './runner.js';
import { ReproductionService } from './reproduction.js';
import { PocService } from './poc-service.js';
import { DedupService } from './dedup.js';
import { ReportingService } from './reporting.js';
export declare class OmvWorkbench {
    readonly config: OmvWorkbenchConfig;
    readonly workflow: OmvWorkflowService;
    readonly runner: CampaignRunner;
    readonly reproduction: ReproductionService;
    readonly poc: PocService;
    readonly dedup: DedupService;
    readonly reporting: ReportingService;
    private readonly watcher;
    /** Short-lived dashboard snapshot shared by polling, search and quality reads. Invalidated by every action. */
    private dashboardCache;
    constructor(config: OmvWorkbenchConfig);
    /**
     * Bind the same OMV capability set to another DSH workspace. This keeps
     * tools and commands session-native instead of pinning every conversation
     * to the plugin's configured landing workspace.
     */
    scoped(projectRoot: string): OmvWorkbench;
    /**
     * Dashboard snapshot with a short shared cache. Search, quality and polling
     * requests within the TTL reuse one build; every action() invalidates it.
     */
    dashboard(): Promise<DashboardPayload>;
    private buildDashboard;
    health(): Promise<HealthPayload>;
    finding(id: string, archived?: boolean): Promise<FindingPayload>;
    campaign(id: string): Promise<CampaignPayload>;
    campaignRun(id: string): Promise<import("./contracts.js").CampaignRun>;
    quality(): Promise<WorkspaceQualityPayload>;
    dedupSummary(findingId: string): Promise<DedupSummary>;
    search(query: string): Promise<SearchHit[]>;
    exportWorkspace(): Promise<WorkspaceExportPayload>;
    action(request: ActionRequest, options?: {
        signal?: AbortSignal;
    }): Promise<unknown>;
    subscribe(listener: (event: WorkspaceChangeEvent) => void): () => void;
    close(): void;
    private healthCheck;
    private readEvidence;
    private tryReadFinding;
    private laneEvidenceStates;
    private writeReproductionEvidence;
}
//# sourceMappingURL=workbench.d.ts.map