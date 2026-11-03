/**
 * Campaign war room: the target seed radiates its audit lanes on an arc, each
 * lane carrying live run status. Selecting a lane moves its controls into the
 * inspector strip, so the map — not a separate list — is the control surface.
 */
export interface WarRoomLaneView {
    id: string;
    title: string;
    detail: string;
    status: string;
    attempts: number;
    summary?: string | undefined;
    sessionId?: string | undefined;
    findingId?: string | undefined;
}
export interface CampaignWarRoomProps {
    target: string;
    ecosystem: string;
    lanes: WarRoomLaneView[];
    onControl?: (runId: string, control: 'pause' | 'resume' | 'cancel' | 'retry', laneId?: string) => void;
    onOpenSession?: (sessionId: string) => void;
    onFinding?: (findingId: string) => void;
}
export declare function CampaignWarRoom({ target, ecosystem, lanes, onControl, onOpenSession, onFinding }: CampaignWarRoomProps): import("react").JSX.Element;
//# sourceMappingURL=war-room.d.ts.map