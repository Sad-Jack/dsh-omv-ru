import type { PocDraft, PocRun, OmvWorkbenchConfig } from './contracts.js';
export interface CommandRunner {
    run(command: string, args: string[], options: {
        timeout: number;
        signal?: AbortSignal;
    }): Promise<{
        stdout: string;
        stderr: string;
        exitCode: number;
    }>;
}
export interface PocExecutionOptions {
    id?: string;
    signal?: AbortSignal;
    runDirectory?: string;
    sourceDirectory?: string;
}
export interface PocExecutor {
    validate(draft: PocDraft, config: OmvWorkbenchConfig): {
        ok: boolean;
        errors: string[];
        warnings: string[];
    };
    execute(draft: PocDraft, config: OmvWorkbenchConfig, runner: CommandRunner, options?: PocExecutionOptions): Promise<PocRun>;
}
export declare class DockerPocExecutor implements PocExecutor {
    validate(draft: PocDraft, config: OmvWorkbenchConfig): {
        ok: boolean;
        errors: string[];
        warnings: string[];
    };
    execute(draft: PocDraft, config: OmvWorkbenchConfig, runner: CommandRunner, options?: PocExecutionOptions): Promise<PocRun>;
    private buildDockerArgs;
    private parseStatus;
}
export declare const defaultCommandRunner: CommandRunner;
//# sourceMappingURL=poc-executor.d.ts.map