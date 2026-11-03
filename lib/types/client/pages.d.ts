import type { JobView, SessionId } from '@deepseek-ai/dsh-client-runtime/client';
import type { ActionRequest, CampaignPayload, DashboardPayload, DedupStatus, FindingPayload, WorkflowIntent } from '../contracts.js';
import type { Tab } from './types.js';
export declare function CommandPalette({ tab, onTab, onNewFinding, onNewCampaign, onClose }: {
    tab: Tab;
    onTab: (tab: Tab) => void;
    onNewFinding: () => void;
    onNewCampaign: () => void;
    onClose: () => void;
}): import("react").JSX.Element;
export declare function WorkbenchErrorState({ error, projectRoot, configuredRoot: root, onRetry, onOpenConfigured, onOpenPath }: {
    error: string;
    projectRoot: string;
    configuredRoot: string;
    onRetry: () => void;
    onOpenConfigured: (() => Promise<void>) | undefined;
    onOpenPath: (() => void) | undefined;
}): import("react").JSX.Element;
export declare function Overview({ data, jobs, onRetryJob, onTab, onFinding, onNew, onOpenConfigured, onOpenPath, onRetryIssues }: {
    data: DashboardPayload;
    jobs: readonly JobView[];
    onRetryJob: (job: JobView) => void;
    onTab: (tab: Tab) => void;
    onFinding: (id: string) => void;
    onNew: () => void;
    onOpenConfigured?: (() => Promise<void>) | undefined;
    onOpenPath?: ((path: string) => void) | undefined;
    onRetryIssues?: (() => void) | undefined;
}): import("react").JSX.Element;
export declare function NativeJobs({ jobs, onRetry }: {
    jobs: readonly JobView[];
    onRetry: (job: JobView) => void;
}): import("react").JSX.Element;
export declare function RecentActivity({ data }: {
    data: DashboardPayload;
}): import("react").JSX.Element;
export declare function Findings({ data, onFinding, onNew, onOpenConfigured, onOpenPath, onRetryIssues }: {
    data: DashboardPayload;
    onFinding: (id: string, archived?: boolean) => void;
    onNew: () => void;
    onOpenConfigured?: (() => Promise<void>) | undefined;
    onOpenPath?: ((path: string) => void) | undefined;
    onRetryIssues?: (() => void) | undefined;
}): import("react").JSX.Element;
export declare function WorkspaceIssuesNotice({ issues, onTab, onOpenConfigured, onOpenPath, onRetry, compact }: {
    issues: DashboardPayload['workspaceIssues'];
    onTab?: (tab: Tab) => void;
    onOpenConfigured?: (() => Promise<void>) | undefined;
    onOpenPath?: ((path: string) => void) | undefined;
    onRetry?: (() => void) | undefined;
    compact?: boolean;
}): import("react").JSX.Element;
export declare function Campaigns({ data, busy, onNew, onCampaign, onRepair, onOpenPath, onRetryIssues }: {
    data: DashboardPayload;
    busy: boolean;
    onNew: () => void;
    onCampaign: (id: string) => void;
    onRepair: (id: string) => void;
    onOpenPath?: ((path: string) => void) | undefined;
    onRetryIssues?: (() => void) | undefined;
}): import("react").JSX.Element;
export declare function CampaignDetail({ payload, busy, isBusy, currentSessionId, expanded, onToggleExpand, onClose, onStart, onControl, onOpenSession, onFinding, onAction }: {
    payload: CampaignPayload;
    busy: boolean;
    isBusy?: (...keys: string[]) => boolean;
    currentSessionId: SessionId;
    expanded: boolean;
    onToggleExpand: () => void;
    onClose: () => void;
    onStart: () => void;
    onControl: (runId: string, control: 'pause' | 'resume' | 'cancel' | 'retry', laneId?: string) => void;
    onOpenSession: (sessionId: string) => void;
    onFinding?: (findingId: string) => void;
    onAction: (request: ActionRequest, message: string) => void;
}): import("react").JSX.Element;
export declare function SearchPage({ projectRoot, onFinding, onCampaign }: {
    projectRoot: string;
    onFinding: (id: string, archived?: boolean) => void;
    onCampaign: (id: string) => void;
}): import("react").JSX.Element;
export declare function ReproductionPage({ data, onFinding, onStart, onOpenSession }: {
    data: DashboardPayload;
    onFinding: (id: string) => void;
    onStart: (id: string) => void;
    onOpenSession?: (sessionId: string) => void;
}): import("react").JSX.Element;
export declare function FindingDetail({ payload, busy, expanded, onToggleExpand, isBusy, currentSessionId, onClose, onAction, onWorkflow, onLink, onOpenSession, onOpenPath, onStartReproduction, onScanDedup, onUpdateDedup }: {
    payload: FindingPayload;
    busy: boolean;
    expanded: boolean;
    onToggleExpand: () => void;
    isBusy?: (...keys: string[]) => boolean;
    currentSessionId: SessionId;
    onClose: () => void;
    onAction: (request: ActionRequest, message: string) => void;
    onWorkflow: (intent: WorkflowIntent) => void;
    onLink: () => void;
    onOpenSession: (sessionId: string) => void;
    onOpenPath?: (path: string) => void;
    onStartReproduction: (findingId: string) => void;
    onScanDedup: (findingId: string) => void;
    onUpdateDedup: (findingId: string, status: DedupStatus, matchId?: string) => void;
}): import("react").JSX.Element;
export declare function NewFindingDialog({ busy, onClose, onSubmit }: {
    busy: boolean;
    onClose: () => void;
    onSubmit: (request: ActionRequest) => void;
}): import("react").JSX.Element;
export declare function NewCampaignDialog({ busy, onClose, onSubmit }: {
    busy: boolean;
    onClose: () => void;
    onSubmit: (request: ActionRequest) => void;
}): import("react").JSX.Element;
//# sourceMappingURL=pages.d.ts.map