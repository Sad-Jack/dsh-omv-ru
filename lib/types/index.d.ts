import type { Context } from '@deepseek-ai/cordis';
import Schema from '@deepseek-ai/schemastery';
import './events.js';
export declare const name = "dsh-omv";
export declare const inject: string[];
/** Advertise the service before apply runs so dependent plugins can wait on it. */
export declare const provide: string[];
export interface Config {
    /** Project containing the private .omv workspace. Relative paths resolve from the DSH launch directory. */
    projectRoot?: string;
    /** Same-origin HTTP prefix used by the browser workbench. */
    apiPrefix?: string;
    /** Enables workbench buttons and tools that modify .omv artifacts. */
    allowMutations?: boolean;
    /** Allows HTTP workbench access from non-loopback clients. */
    allowRemoteAccess?: boolean;
    /** Maximum recent activity rows returned to the browser. */
    activityLimit?: number;
    /** Browser dashboard refresh cadence in milliseconds; zero disables polling. */
    refreshIntervalMs?: number;
    /** Default maximum number of concurrently running Campaign lane sessions. */
    campaignConcurrency?: number;
    /** Debounce window for workspace change events. */
    watchDebounceMs?: number;
    /** SSE heartbeat cadence. */
    eventHeartbeatMs?: number;
    /** Maximum JSON mutation body in bytes. */
    httpBodyLimitBytes?: number;
    /** Enable PoC generation and validation features. */
    pocEnabled?: boolean;
    /** Allow PoC containers to access the network. */
    pocAllowNetwork?: boolean;
    /** Allowed Docker images for PoC execution. */
    pocDockerImages?: string[];
    /** Maximum PoC execution time in milliseconds. */
    pocTimeoutMs?: number;
    /** Memory limit for PoC containers in MB. */
    pocMemoryMb?: number;
    /** CPU limit for PoC containers. */
    pocCpuLimit?: number;
    /** Process limit for PoC containers. */
    pocPidLimit?: number;
    /** Maximum PoC script size in bytes. */
    pocMaxScriptBytes?: number;
    /** Maximum PoC output size in bytes. */
    pocMaxOutputBytes?: number;
}
export declare const Config: Schema<Config>;
export declare function apply(ctx: Context, config?: Config): void;
export type { ActionRequest, ApiFailure, ApiResponse, ApiSuccess, DashboardMetrics, DashboardPayload, HealthCheck, HealthPayload, FindingPayload, FindingSessionLink, CampaignPayload, CampaignSurfaces, AttackSurfaceCardView, SurfaceCardStatus, CampaignIssue, CampaignDispatch, CampaignRun, CampaignRunLane, CampaignRunEvent, CampaignLaneDispatch, CampaignRunStatus, CampaignLaneStatus, EvidenceGraph, EvidenceGraphNode, EvidenceGraphEdge, EvidenceGraphAnalysis, QualityGateResult, QualityGateCheck, EvidenceAssessment, EvidenceDimension, EvidenceCheckState, EvidenceMaturity, EvidencePhase, ReproductionRun, ReproductionRunStatus, SearchHit, OmvWorkbenchConfig, AuditStage, EvidenceDiff, WorkflowDispatch, WorkflowEvent, WorkflowIntent, WorkspaceChangeEvent, WorkspaceExportPayload, DedupStatus, DedupMatch, DedupSummary, ReportPackStatus, ReportPack, ReportQueueItem, WorkspaceQualityIssue, WorkspaceQualityPayload, PocLanguage, PocStatus, PocValidation, PocGenerationRequest, PocDraft, PocArtifact, PocProvenance, PocRun, CodeRef, } from './contracts.js';
export { DEFAULT_OMV_SETTINGS, OMV_SETTINGS_NAMESPACE, OMV_TABS } from './settings.js';
export { OmvSettingsSchema } from './settings-schema.js';
export type { OmvSettings, OmvSettingsTab } from './settings.js';
export { OmvService } from './service.js';
export { inspectDshRuntime } from './runtime.js';
export type { DshRuntimeEntry, DshRuntimeFiber, DshRuntimeSnapshot, DshRuntimeState } from './runtime.js';
export type { OmvToolResultEvent } from './events.js';
export { WORKBENCH_PROTOCOL_VERSION, WORKBENCH_COMPATIBLE_PROTOCOL_VERSIONS } from './contracts.js';
export { OmvWorkbench } from './workbench.js';
export { OmvWorkflowService, deriveAuditStage, suggestedIntent } from './workflow.js';
export { CampaignRunner } from './runner.js';
export { ReproductionService } from './reproduction.js';
export { buildEvidenceGraph, evaluateQualityGate, analyzeEvidenceGraph, exportEvidenceGraph } from './evidence-graph.js';
export { assessEvidence } from './assessment.js';
export { parseCodeRef, resolveCodeRef, formatCodeRef } from './code-ref.js';
export { createPocGenerationRequest } from './poc-generator.js';
export { DockerPocExecutor, defaultCommandRunner } from './poc-executor.js';
export type { CommandRunner, PocExecutor } from './poc-executor.js';
export { PocStore } from './poc-store.js';
//# sourceMappingURL=index.d.ts.map