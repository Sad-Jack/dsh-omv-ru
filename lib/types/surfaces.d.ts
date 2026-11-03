import type { CampaignLane } from 'oh-my-vul';
import type { CampaignSurfaces, SurfaceCardStatus } from './contracts.js';
/** Propose AttackSurfaceList.v1 cards from the shared oh-my-vul catalog. */
export declare function proposeCampaignSurfaces(id: string, projectRoot: string, force?: boolean): Promise<CampaignSurfaces>;
/** Read the campaign sidecar. A missing file is an empty projection, not an error. */
export declare function showCampaignSurfaces(id: string, projectRoot: string): Promise<CampaignSurfaces>;
/**
 * Incrementally mark cards selected or skipped. Unlike CLI `select --cards`,
 * unspecified cards keep their current status so a hypothesis can die cheaply.
 */
export declare function updateCampaignSurfaceCards(id: string, projectRoot: string, updates: ReadonlyArray<{
    cardId: string;
    status: SurfaceCardStatus;
}>): Promise<CampaignSurfaces>;
/** Runner/seed lanes come from selected cards once a surfaces file exists. */
export declare function runLanesFromSurfaces(lanes: readonly CampaignLane[], surfaces: CampaignSurfaces): CampaignLane[];
//# sourceMappingURL=surfaces.d.ts.map