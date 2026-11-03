import type { ReproductionRun, ReproductionRunStatus } from './contracts.js';
/** Durable, append-preserving metadata for local reproduction attempts. */
export declare class ReproductionService {
    readonly projectRoot: string;
    private writeTail;
    constructor(projectRoot: string);
    list(findingId?: string): Promise<ReproductionRun[]>;
    start(input: {
        findingId: string;
        sessionId?: string;
        command?: string;
        environment?: Record<string, string>;
        artifacts?: string[];
    }): Promise<ReproductionRun>;
    finish(input: {
        runId: string;
        status: Extract<ReproductionRunStatus, 'passed' | 'failed' | 'blocked'>;
        sessionId?: string;
        exitCode?: number;
        output?: string;
        artifacts?: string[];
    }): Promise<ReproductionRun>;
    private readStore;
    private writeStore;
    private storePath;
    private serial;
}
//# sourceMappingURL=reproduction.d.ts.map