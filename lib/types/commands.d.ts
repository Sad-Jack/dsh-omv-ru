import type { Context } from '@deepseek-ai/cordis';
import type { DshRuntimeSnapshot } from './runtime.js';
import type { OmvWorkbench } from './workbench.js';
/** Register durable, discoverable DSH slash commands for the OMV workflow. */
export declare function registerOmvCommands(ctx: Context, workbench: OmvWorkbench, runtimeSnapshot?: () => DshRuntimeSnapshot): void;
//# sourceMappingURL=commands.d.ts.map