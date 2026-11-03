import type { Context } from '@deepseek-ai/cordis';
import type { ToolCallBlock } from '@deepseek-ai/dsh-client-runtime/client';
import type { ToolCallViewProps } from '@deepseek-ai/dsh-client-ui-tool/client';
type OmvToolViewProps = ToolCallViewProps;
/** UI state derived from the immutable running-or-settled tool block. */
export declare function toolState(block: ToolCallBlock): 'running' | 'ok' | 'error' | 'stopped';
/** Compact, replay-safe values used by the OMV Tool card. */
export interface OmvToolCardModel {
    readonly state: ReturnType<typeof toolState>;
    readonly title: string;
    readonly preview?: string;
    readonly output?: string;
    readonly args: string;
}
/**
 * Derive the OMV card from the tool block only; no workspace or network reads
 * are allowed because the same projection runs during session replay.
 * @param toolName - wire name of the OMV tool.
 * @param block - frozen running or settled tool block.
 * @returns render-ready card fields.
 */
export declare function deriveOmvToolCard(toolName: string, block: ToolCallBlock): OmvToolCardModel;
/** Compact OMV-specific Tool card rendered through the official Tool view slot. */
export declare function OmvToolRow({ toolName, block, inspect }: OmvToolViewProps): import("react").JSX.Element;
/** Register one OMV row for each OMV wire tool; slot disposal follows the plugin fiber. */
export declare function registerOmvToolViews(ctx: Context): void;
export {};
//# sourceMappingURL=omv-toolview.d.ts.map