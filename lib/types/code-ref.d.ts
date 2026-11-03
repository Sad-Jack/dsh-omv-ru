/** A local source location projected from Evidence prose. Not a second source of truth. */
export interface CodeRef {
    path: string;
    line?: number;
    endLine?: number;
    note: string;
}
/** Extract the first workspace file:line mention from an Evidence field. */
export declare function parseCodeRef(value: unknown): CodeRef | undefined;
export declare function resolveCodeRef(projectRoot: string, ref: CodeRef): string;
export declare function formatCodeRef(ref: CodeRef): string;
//# sourceMappingURL=code-ref.d.ts.map