import type { FindingDetail } from 'oh-my-vul';
import type { OmvWorkbenchConfig, PocDraft, PocGenerationRequest, PocRun } from './contracts.js';
import { DockerPocExecutor, type CommandRunner } from './poc-executor.js';
import { PocStore } from './poc-store.js';
export declare class PocService {
    readonly store: PocStore;
    readonly executor: DockerPocExecutor;
    private readonly config;
    private readonly projectRoot;
    constructor(config: OmvWorkbenchConfig);
    generate(detail: FindingDetail, evidence: Record<string, unknown>): Promise<{
        request: PocGenerationRequest;
        draft: PocDraft;
    }>;
    saveDraft(input: {
        findingId: string;
        draftId?: string;
        script: string;
        commandArgs?: string[];
        language?: PocDraft['language'];
        templateId?: string;
        image?: string;
        requiresNetwork?: boolean;
    }): Promise<PocDraft>;
    validateDraft(draftId: string): Promise<PocDraft>;
    approveDraft(draftId: string, approvedBy?: string): Promise<PocDraft>;
    runDraft(draftId: string, options?: {
        signal?: AbortSignal;
        sourceDir?: string;
    }, runner?: CommandRunner): Promise<PocRun>;
    inspectRun(runId: string): Promise<PocRun>;
    adoptEvidence(runId: string): Promise<{
        run: PocRun;
        before: string;
        after: string;
    }>;
    listDrafts(findingId?: string): Promise<PocDraft[]>;
    listRuns(findingId?: string): Promise<PocRun[]>;
    private requireDraft;
    private findingPath;
    private safeSourceDirectory;
    private pinImageDigest;
    private assertEnabled;
}
//# sourceMappingURL=poc-service.d.ts.map