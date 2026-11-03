import type { ReactNode } from 'react';
import type { EvidenceAssessment } from '../contracts.js';
import type { IconName } from './types.js';
export declare function Hero({ eyebrow, title, description, actions }: {
    eyebrow: string;
    title: string;
    description: string;
    actions?: ReactNode;
}): import("react").JSX.Element;
export declare function Metric({ label, value, foot, icon, color }: {
    label: string;
    value: ReactNode;
    foot: ReactNode;
    icon: IconName;
    color: string;
}): import("react").JSX.Element;
export declare function Maturity({ assessment, compact }: {
    assessment: EvidenceAssessment;
    compact?: boolean;
}): import("react").JSX.Element;
export declare function Status({ value }: {
    value: string;
}): import("react").JSX.Element;
export declare function EvidenceStatusLogo({ maturity }: {
    maturity: EvidenceAssessment['maturity'];
}): import("react").JSX.Element;
export declare function DedupSourceLogo({ source, searched }: {
    source: string;
    searched: boolean;
}): import("react").JSX.Element;
export declare function PriorityIssueLogo({ severity }: {
    severity: string;
}): import("react").JSX.Element;
export declare function EcosystemAvatar({ ecosystem, size }: {
    ecosystem: string;
    size?: 'md' | 'lg';
}): import("react").JSX.Element;
export declare function Section({ title, meta, children }: {
    title: string;
    meta: string;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function ChainCard({ label, value, onOpen }: {
    label: string;
    value: unknown;
    onOpen?: (path: string) => void;
}): import("react").JSX.Element;
export declare function Modal({ title, onClose, children }: {
    title: string;
    onClose: () => void;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function Field({ label, full, children }: {
    label: string;
    full?: boolean;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function Empty({ label, description, action, compact }: {
    label: string;
    description?: string;
    action?: ReactNode;
    compact?: boolean;
}): import("react").JSX.Element;
export declare function Loading({ label }: {
    label?: string;
}): import("react").JSX.Element;
export declare function Icon({ name, size }: {
    name: IconName;
    size?: number;
}): import("react").JSX.Element;
//# sourceMappingURL=ui.d.ts.map