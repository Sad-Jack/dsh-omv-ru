import type { FindingDetail, FindingReview } from 'oh-my-vul';
import type { AuditStage, FindingSessionLink, WorkflowDispatch, WorkflowEvent, WorkflowIntent } from './contracts.js';
/**
 * Persistent application layer shared by the browser, slash commands and
 * Agent tools. Evidence files remain authoritative; this store only owns DSH
 * session links and an append-only record of workflow transitions.
 */
export declare class OmvWorkflowService {
    readonly projectRoot: string;
    private writeTail;
    constructor(projectRoot: string);
    links(): Promise<Record<string, FindingSessionLink>>;
    linkFinding(findingId: string, sessionId: string, intent?: WorkflowIntent): Promise<FindingSessionLink>;
    unlinkFinding(findingId: string): Promise<boolean>;
    start(finding: FindingDetail, evidence: Record<string, unknown>, intent: WorkflowIntent, sessionId: string): Promise<WorkflowDispatch>;
    record(input: {
        findingId: string;
        action: string;
        sessionId?: string;
        intent?: WorkflowIntent;
        before?: string;
        after?: string;
    }): Promise<WorkflowEvent>;
    history(findingId: string, limit?: number): Promise<WorkflowEvent[]>;
    private readLinkStore;
    private writeLinkStore;
    private linksPath;
    private eventsPath;
    private serial;
}
export declare function deriveAuditStage(finding: FindingDetail, evidence: Record<string, unknown>, review?: FindingReview): AuditStage;
export declare function suggestedIntent(stage: AuditStage): WorkflowIntent;
//# sourceMappingURL=workflow.d.ts.map