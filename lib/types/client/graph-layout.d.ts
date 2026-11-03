import type { EvidenceGraph, EvidenceGraphEdge, EvidenceGraphNode } from '../contracts.js';
/**
 * Deterministic layered layout for the evidence flow canvas. Pure on purpose:
 * the same graph always produces the same picture, and tests can pin it down.
 * Layers follow the narrative direction (finding → claim → evidence → results)
 * computed as longest-path depth, so `source → sink → guard` reads left to right
 * and cycle-safe by ignoring back edges.
 */
export interface GraphLayoutOptions {
    nodeWidth: number;
    nodeHeight: number;
    columnGap: number;
    rowGap: number;
    padding: number;
}
export declare const DEFAULT_GRAPH_LAYOUT: GraphLayoutOptions;
export interface LaidOutNode {
    node: EvidenceGraphNode;
    x: number;
    y: number;
    layer: number;
    openablePath: string | undefined;
}
export interface LaidOutEdge extends EvidenceGraphEdge {
    d: string;
}
export interface GraphLayout {
    nodes: LaidOutNode[];
    edges: LaidOutEdge[];
    width: number;
    height: number;
    columns: number;
}
export declare function openablePathOf(node: EvidenceGraphNode): string | undefined;
export declare function layoutEvidenceGraph(graph: EvidenceGraph, options?: GraphLayoutOptions): GraphLayout;
/** Horizontal cubic bezier between the right edge of `from` and the left edge of `to`. */
export declare function edgePath(fromX: number, fromY: number, nodeWidth: number, nodeHeight: number, toX: number, toY: number): string;
/** Truncate free-form evidence text to fit one canvas line. */
export declare function truncateForCanvas(value: string, max?: number): string;
/**
 * Radial "diffusion" layout for the campaign war room: the target seed sits on
 * the left and its audit lanes fan out on an arc to the right, so a run reads
 * as one seed radiating hypotheses. Pure and deterministic like the flow
 * layout above.
 */
export declare const WAR_ROOM_NODE: {
    width: number;
    height: number;
    seedWidth: number;
    seedHeight: number;
};
export interface WarRoomLaneSpot {
    index: number;
    x: number;
    y: number;
}
export interface WarRoomLayout {
    seed: {
        x: number;
        y: number;
    };
    lanes: WarRoomLaneSpot[];
    width: number;
    height: number;
}
export declare function layoutWarRoom(laneCount: number, padding?: number): WarRoomLayout;
/** Bezier from the seed's right edge to a lane's left edge. */
export declare function warRoomEdgePath(seedX: number, seedY: number, laneX: number, laneY: number): string;
//# sourceMappingURL=graph-layout.d.ts.map