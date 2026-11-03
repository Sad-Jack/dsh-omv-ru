import type { Campaign } from 'oh-my-vul';
import type { AuditStage, CampaignLaneDispatch, CampaignLaneStatus, CampaignRun, CampaignRunEvent, EvidenceMaturity } from './contracts.js';
export interface LaneEvidenceState {
    findingId: string;
    stage: AuditStage;
    maturity: EvidenceMaturity;
}
/**
 * Durable Campaign execution state. DSH owns the actual sessions; this store
 * owns lane admission, correlation, recovery and evidence-driven completion.
 */
export declare class CampaignRunner {
    readonly projectRoot: string;
    private writeTail;
    private recovery;
    constructor(projectRoot: string);
    list(campaignId?: string): Promise<CampaignRun[]>;
    get(runId: string): Promise<CampaignRun>;
    create(campaign: Campaign, parentSessionId: string, concurrency?: number): Promise<CampaignRun>;
    claim(runId: string): Promise<CampaignLaneDispatch[]>;
    bind(runId: string, laneId: string, sessionId: string): Promise<CampaignRun>;
    updateLane(input: {
        runId: string;
        laneId: string;
        status: Extract<CampaignLaneStatus, 'completed' | 'failed' | 'blocked' | 'awaiting_evidence'>;
        sessionId?: string;
        summary?: string;
    }): Promise<CampaignRun>;
    control(runId: string, control: 'pause' | 'resume' | 'cancel' | 'retry', laneId?: string): Promise<CampaignRun>;
    reconcile(runId: string, states: readonly LaneEvidenceState[]): Promise<CampaignRun>;
    history(runId: string, limit?: number): Promise<CampaignRunEvent[]>;
    private ensureRecovered;
    private readStore;
    private writeStore;
    private event;
    private eventById;
    private storePath;
    private eventsPath;
    private serial;
}
//# sourceMappingURL=runner.d.ts.map