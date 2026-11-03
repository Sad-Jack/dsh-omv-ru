import type { IncomingMessage, ServerResponse } from 'node:http';
import type { OmvWorkbench } from './workbench.js';
export interface WebServerLike {
    register(route: {
        kind: 'exact' | 'prefix';
        path: string;
        handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
    }): () => void;
    tapIndex(transform: (html: string) => string): () => void;
}
export type WorkbenchResolver = (projectRoot: string | undefined) => OmvWorkbench | Promise<OmvWorkbench>;
export declare function registerWorkbenchHttp(webServer: WebServerLike, workbench: OmvWorkbench, resolveWorkbench?: WorkbenchResolver): () => void;
//# sourceMappingURL=http.d.ts.map