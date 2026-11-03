import type { ISessions } from '@deepseek-ai/dsh-client-runtime/client';
import type { CampaignRun, DashboardPayload } from '../contracts.js';
/**
 * Client hooks extracted from WorkbenchSurface so the component composes
 * behavior instead of owning it. All orchestration here survives detail-panel
 * visibility changes (campaign pumping no longer depends on an open modal).
 */
export interface DashboardState {
    dashboard: DashboardPayload | undefined;
    loading: boolean;
    error: string | undefined;
    refreshError: string | undefined;
    lastUpdated: string | undefined;
    reload: () => Promise<void>;
    refreshQuietly: () => Promise<void>;
    /** Post-mutation refresh: waits out any stale in-flight poll, then always applies. */
    refreshForced: () => Promise<void>;
}
/**
 * Dashboard loading with three refresh sources (initial, timer, SSE/action)
 * coalesced through a single in-flight promise, and identical payloads
 * (same generatedAt) skip setState to avoid full-tree re-renders.
 */
export declare function useDashboard(projectRoot: string): DashboardState;
export interface OmvEventsState {
    live: 'connecting' | 'live' | 'fallback';
}
/**
 * SSE subscription plus the cross-component refresh bus. Workspace events are
 * parsed defensively: a malformed frame downgrades to fallback instead of
 * throwing inside the listener.
 */
export declare function useOmvEvents(projectRoot: string, onWorkspaceChange: () => void): OmvEventsState;
export interface ActionState {
    /** True while any action is in flight — coarse signal for aria-busy and global buttons. */
    anyBusy: boolean;
    isBusy: (...keys: string[]) => boolean;
    /** Runs the action under a key so only the originating control shows progress. */
    run: (key: string, task: () => Promise<void>) => Promise<void>;
}
/** Per-action busy tracking replacing the single global freeze. */
export declare function useActionState(): ActionState;
export interface CampaignRunnerOptions {
    projectRoot: string;
    sessions: ISessions;
    /** Refresh the visible detail panel after runs change; may be a no-op when closed. */
    onCampaignUpdated: (campaignId: string) => void;
    onToast: (kind: 'ok' | 'error', message: string) => void;
    runAction: (key: string, task: () => Promise<void>) => Promise<void>;
}
export interface CampaignRunner {
    /** Start tracking a run (idempotent) so it keeps being pumped and reconciled even with the detail panel closed. */
    watch: (run: Pick<CampaignRun, 'id' | 'campaignId' | 'status'>) => void;
    /** Dispatch queued lanes into forked DSH sessions now. */
    pump: (runId: string) => Promise<void>;
    /** Pause / resume / cancel / retry, cancelling lane sessions on cancel. */
    control: (runId: string, control: 'pause' | 'resume' | 'cancel' | 'retry', laneId?: string) => Promise<void>;
}
/**
 * Campaign orchestration detached from view state. Watched runs live in a ref
 * (not component state), so closing the detail panel no longer stalls queued
 * lanes. A single interval reconciles every watched active run; the reconcile
 * result drives both lane pumping and detail refresh.
 */
export declare function useCampaignRunner(options: CampaignRunnerOptions): CampaignRunner;
export interface CanvasViewportState {
    k: number;
    tx: number;
    ty: number;
}
export interface CanvasViewport {
    viewport: CanvasViewportState;
    viewWidth: number;
    fit: () => void;
    zoomBy: (factor: number) => void;
    onWheel: (event: React.WheelEvent) => void;
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => void;
    onPointerUp: () => void;
    onPointerCancel: () => void;
}
/**
 * Fit-on-mount / fit-on-resize scale for an oversized SVG canvas plus cursor
 * anchored wheel zoom and drag panning. `resetKey` re-fits whenever the
 * underlying content identity changes (e.g. a new graph).
 */
export declare function useCanvasViewport(containerRef: React.RefObject<HTMLElement | null>, contentWidth: number, contentHeight: number, maxViewHeight?: number, resetKey?: string): CanvasViewport;
//# sourceMappingURL=hooks.d.ts.map