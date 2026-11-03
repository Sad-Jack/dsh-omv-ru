import type { ReportPack } from './contracts.js';
/**
 * Read-only report artifact status for the quality center. Draft generation,
 * provenance refresh and disclosure timelines belong to the omv-report /
 * omv-disclose Agent workflows, which write the same .omv/reports files this
 * service inspects.
 */
export declare class ReportingService {
    readonly projectRoot: string;
    constructor(projectRoot: string);
    inspect(findingId: string): Promise<ReportPack>;
}
//# sourceMappingURL=reporting.d.ts.map