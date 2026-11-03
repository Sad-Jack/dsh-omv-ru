import type { FindingDetail } from 'oh-my-vul';
import type { EvidenceAssessment, ReproductionRun } from './contracts.js';
/**
 * Evidence maturity is deliberately separate from the legacy Evidence.v1 score.
 * It describes how a claim is supported and verified instead of treating every
 * populated field as interchangeable percentage points.
 */
export declare function assessEvidence(detail: FindingDetail, evidence: Record<string, unknown>, reproductionRuns?: readonly ReproductionRun[]): EvidenceAssessment;
//# sourceMappingURL=assessment.d.ts.map