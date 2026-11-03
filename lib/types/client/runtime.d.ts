import type { AuditStage, DashboardPayload, EvidenceAssessment, EvidenceCheckState, WorkflowIntent } from '../contracts.js';
import type { ISessions, SettingsScope, SessionId } from '@deepseek-ai/dsh-client-runtime/client';
import { type OmvSettings, type OmvSettingsTab } from '../settings.js';
import type { IconName } from './types.js';
declare global {
    interface Window {
        __DSH_OMV__?: {
            apiPrefix?: string;
            projectRoot?: string;
            refreshIntervalMs?: number;
        };
    }
}
export declare function configuredRoot(): string;
export declare function decodeSettings(value: unknown): OmvSettings | undefined;
export declare function localDefaultTab(): OmvSettingsTab | undefined;
export declare function persistDefaultTab(settings: SettingsScope<OmvSettings>, tab: OmvSettingsTab): void;
export declare function sessionRoot(sessions: ISessions, sessionId: SessionId): string;
export declare function api<T = unknown>(path: string, init?: RequestInit, projectRoot?: string): Promise<T>;
export declare function apiUrl(path: string, projectRoot?: string): string;
export declare function valueAt(root: Record<string, unknown>, path: string): unknown;
export declare function displayValue(value: unknown): string;
export declare function maturityLabel(value: EvidenceAssessment['maturity']): string;
export declare function phaseLabel(value: EvidenceAssessment['phase']): string;
export declare function confidenceLabel(value: EvidenceAssessment['confidence']): string;
export declare function checkStateIcon(value: EvidenceCheckState): IconName;
export declare function statusColor(value: string): string;
export declare function qualitySignalLabel(quality: DashboardPayload['quality']): string;
export declare function qualitySignalTone(quality: DashboardPayload['quality']): 'blocker' | 'warning' | 'info' | 'clear';
export declare function statusLabel(value: string): string;
export declare function campaignLabel(value: string): string;
export declare function primaryIntent(stage: AuditStage): WorkflowIntent;
export declare function workflowLabel(intent: WorkflowIntent): string;
export declare function activityColor(action: string): string;
export declare function activityLabel(action: string): string;
export declare function formatTime(value: string): string;
export declare function relativeTime(value: string): string;
export declare function normalizePath(value: string): string;
export declare function messageOf(error: unknown): string;
export declare function firstLine(value: string): string;
//# sourceMappingURL=runtime.d.ts.map