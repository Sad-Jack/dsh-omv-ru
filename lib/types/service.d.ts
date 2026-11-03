import { Service, type Context } from '@deepseek-ai/cordis';
import type { OmvWorkbenchConfig } from './contracts.js';
import { OmvWorkbench } from './workbench.js';
/** Native Cordis service for the OMV capability set. */
export declare class OmvService extends Service {
    readonly config: OmvWorkbenchConfig;
    readonly workbench: OmvWorkbench;
    private readonly workbenches;
    constructor(ctx: Context, config: OmvWorkbenchConfig);
    /** Resolve a workspace-scoped OMV facade under the same plugin lifecycle. */
    scoped(projectRoot: string): OmvWorkbench;
    close(): void;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Evidence-first OMV workbench service. */
        omv: OmvService;
    }
}
//# sourceMappingURL=service.d.ts.map