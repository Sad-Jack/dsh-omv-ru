import type { FindingDetail } from 'oh-my-vul';
import type { EvidenceGraph, EvidenceGraphAnalysis, QualityGateResult, ReproductionRun, WorkflowEvent } from './contracts.js';
export declare function buildEvidenceGraph(input: {
    detail: FindingDetail;
    evidence: Record<string, unknown>;
    rawEvidence: string;
    history: WorkflowEvent[];
    reproductionRuns: ReproductionRun[];
}): EvidenceGraph;
export declare function evaluateQualityGate(detail: FindingDetail, evidence: Record<string, unknown>, reproductionRuns?: readonly ReproductionRun[]): QualityGateResult;
export declare function analyzeEvidenceGraph(graph: EvidenceGraph): EvidenceGraphAnalysis;
export declare function exportEvidenceGraph(graph: EvidenceGraph, format: 'dot' | 'mermaid'): string;
//# sourceMappingURL=evidence-graph.d.ts.map