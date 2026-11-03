/** User-owned preference namespace; deployment knobs remain in Cordis Config. */
export declare const OMV_SETTINGS_NAMESPACE = "dsh-omv";
/** Browser-only fallback key for DSH rc.6, whose Host API allowlist is fixed. */
export declare const OMV_LOCAL_TAB_KEY = "dsh-omv.default-tab";
export declare const OMV_TABS: readonly ["overview", "findings", "reproduction", "campaigns", "search"];
export type OmvSettingsTab = typeof OMV_TABS[number];
export interface OmvSettings {
    /** The first workbench surface shown when a session opens the OMV view. */
    defaultTab: OmvSettingsTab;
}
export declare const DEFAULT_OMV_SETTINGS: OmvSettings;
export declare function isOmvSettingsTab(value: unknown): value is OmvSettingsTab;
//# sourceMappingURL=settings.d.ts.map