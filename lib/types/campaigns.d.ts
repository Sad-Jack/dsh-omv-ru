import { type Campaign, type CampaignEcosystem, type CampaignSummary } from 'oh-my-vul';
import type { CampaignIssue } from './contracts.js';
export interface CampaignInspection {
    campaigns: CampaignSummary[];
    issues: CampaignIssue[];
}
export interface CampaignRepairResult {
    id: string;
    yamlPath: string;
    runbookPath: string;
    changes: string[];
    campaign: Campaign;
}
export declare function normalizeCampaignEcosystem(value: string | undefined): CampaignEcosystem;
/** Keep malformed Campaign files local instead of failing the whole workbench dashboard. */
export declare function inspectCampaigns(projectRoot: string): Promise<CampaignInspection>;
/** Repairs deterministic compatibility fields: registry aliases and the derived title. */
export declare function repairCampaign(id: string, projectRoot: string): Promise<CampaignRepairResult>;
//# sourceMappingURL=campaigns.d.ts.map