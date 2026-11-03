window.__ModuleLoader__.load({
	id: "dsh-omv",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		/** Browser-only fallback key for DSH rc.6, whose Host API allowlist is fixed. */
		const OMV_LOCAL_TAB_KEY = "dsh-omv.default-tab";
		const OMV_TABS = [
			"overview",
			"findings",
			"reproduction",
			"campaigns",
			"search"
		];
		const DEFAULT_OMV_SETTINGS = Object.freeze({ defaultTab: "overview" });
		function isOmvSettingsTab(value) {
			return typeof value === "string" && OMV_TABS.includes(value);
		}
		// src/client/styles.ts
		const WORKBENCH_CSS = String.raw`
.omv-launcher {
  appearance: none; width: 100%; min-height: 36px; padding: 0 10px; border: 0; border-radius: 8px;
  background: transparent; color: var(--dsw-alias-label-secondary, #5f6269); display: flex; align-items: center;
  justify-content: flex-start; gap: 10px; cursor: pointer; font: inherit;
}
.omv-launcher:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, .05)); color: var(--dsw-alias-label-primary, #1f2024);
}
.omv-launcher-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; }
.omv-launcher-badge {
  margin-left: auto; min-width: 18px; height: 18px; padding: 0 5px; display: grid; place-items: center;
  border-radius: 9px; background: var(--dsw-alias-state-error-secondary, #fdecec);
  color: var(--dsw-alias-state-error-primary, #c94b4b); font-size: 10px;
}

/* Fallback palette flips with the system scheme; host tokens always win when defined. */
.omv-native-view, .omv-settings {
  --omv-fb-bg: #f5f6fa; --omv-fb-surface: #fff; --omv-fb-line: #e2e4ec;
  --omv-fb-text: #14151d; --omv-fb-muted: #5c5f6d; --omv-fb-faint: #8a8d9c;
  --omv-fb-hover: rgba(23, 25, 44, .045);
  --omv-fb-blue: #4d6bfe; --omv-fb-green: #1f9d63; --omv-fb-orange: #b7791f;
  --omv-fb-red: #d6433f;
  /* Graph-only categorical hues: the evidence graph (flow-canvas.tsx) needs more distinct
     kinds than the four host state colors cover, so these two extra hues exist purely for
     that node/edge legend. Nothing else in the app should reach for them as a brand accent. */
  --omv-fb-teal: #0d8f9e; --omv-fb-violet: #6a5fd6;
}
@media (prefers-color-scheme: dark) {
  .omv-native-view, .omv-settings {
    --omv-fb-bg: #0b0c13; --omv-fb-surface: #14151f; --omv-fb-line: #262838;
    --omv-fb-text: #eceef5; --omv-fb-muted: #a3a6b8; --omv-fb-faint: #74778a;
    --omv-fb-hover: rgba(255, 255, 255, .06);
    --omv-fb-blue: #7c93ff; --omv-fb-green: #35d491; --omv-fb-orange: #e6ab4d;
    --omv-fb-red: #ff6b66;
    --omv-fb-teal: #29d6e6; --omv-fb-violet: #a79cf0;
  }
}
.omv-native-view, .omv-settings {
  --omv-bg: var(--dsw-alias-bg-layer-1, var(--omv-fb-bg));
  --omv-surface: var(--dsw-alias-bg-layer-2, var(--omv-fb-surface));
  --omv-line: var(--dsw-alias-border-l2, var(--omv-fb-line));
  --omv-text: var(--dsw-alias-label-primary, var(--omv-fb-text));
  --omv-muted: var(--dsw-alias-label-secondary, var(--omv-fb-muted));
  --omv-faint: color-mix(in srgb, var(--dsw-alias-label-tertiary, var(--omv-fb-faint)) 86%, var(--dsw-alias-label-primary, var(--omv-fb-text)));
  --omv-hover: var(--dsw-alias-interactive-bg-hover, var(--omv-fb-hover));
  --omv-blue: var(--dsw-alias-state-business-primary, var(--omv-fb-blue));
  --omv-green: var(--dsw-alias-state-success-primary, var(--omv-fb-green));
  --omv-orange: var(--dsw-alias-state-warn-primary, var(--omv-fb-orange));
  --omv-red: var(--dsw-alias-state-error-primary, var(--omv-fb-red));
  --omv-teal: var(--omv-fb-teal);
  --omv-purple: var(--omv-fb-violet);
  --omv-shadow-tint: rgba(15, 23, 42, .05);
  --omv-shadow-xs: 0 1px 2px var(--omv-shadow-tint);
  --omv-shadow-sm: 0 2px 6px -2px var(--omv-shadow-tint), 0 8px 20px -8px var(--omv-shadow-tint);
  --omv-shadow-md: 0 4px 10px -3px var(--omv-shadow-tint), 0 16px 36px -14px var(--omv-shadow-tint);
  --omv-shadow-lg: 0 8px 16px -4px var(--omv-shadow-tint), 0 28px 60px -20px var(--omv-shadow-tint);
  --omv-radius-sm: 10px;
  --omv-radius-md: 14px;
  --omv-radius-lg: 18px;
  color: var(--omv-text);
  font: var(--dsw-font-xs-13, 13px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
}
@media (prefers-color-scheme: dark) {
  .omv-native-view, .omv-settings { --omv-shadow-tint: rgba(0, 0, 0, .5); }
}
.omv-native-view h2, .omv-native-view h3, .omv-settings h2, .omv-settings h3 { font-feature-settings: "tnum"; }
.omv-native-view {
  position: relative; display: flex; width: 100%; height: 100%; min-width: 0; min-height: 0;
  flex-direction: column; overflow: hidden; box-sizing: border-box; background: var(--omv-bg);
}
.omv-native-view *, .omv-settings * { box-sizing: border-box; }
.omv-native-view button, .omv-native-view input, .omv-native-view select, .omv-native-view textarea,
.omv-settings button { font: inherit; }

.omv-native-view ::selection, .omv-settings ::selection { background: color-mix(in srgb, var(--omv-blue) 16%, transparent); }
.omv-native-view button, .omv-native-view input, .omv-native-view select, .omv-native-view textarea,
.omv-native-view [tabindex], .omv-native-view [role='button'] {
  transition: background-color .12s ease, border-color .12s ease, color .12s ease, box-shadow .12s ease, opacity .12s ease, filter .12s ease, transform .12s ease;
}
.omv-native-view button:focus-visible, .omv-native-view [tabindex]:focus-visible, .omv-native-view [role='button']:focus-visible,
.omv-settings button:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--omv-blue) 60%, transparent); outline-offset: 1px;
}

.omv-native-toolbar {
  min-height: 40px; height: auto; flex: none; padding: 0 10px; border-bottom: 1px solid var(--omv-line);
  background: var(--omv-bg); display: flex; align-items: center; gap: 10px;
}
.omv-nav { align-self: stretch; display: flex; align-items: stretch; gap: 4px; min-width: 0; overflow-x: auto; scrollbar-width: none; }
.omv-nav::-webkit-scrollbar { display: none; }
.omv-nav-button {
  position: relative; appearance: none; min-width: 54px; padding: 0 10px; border: 0; background: transparent;
  color: var(--omv-muted); display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer;
  font-size: 13px; border-radius: 6px;
}
.omv-nav-button:hover { color: var(--omv-text); background: var(--omv-hover); }
.omv-nav-button[data-active='true'] { color: var(--omv-text); font-weight: 600; }
.omv-nav-button[data-active='true']::after {
  content: ''; position: absolute; right: 10px; bottom: 0; left: 10px; height: 2px; border-radius: 2px 2px 0 0;
  background: var(--omv-blue);
}
.omv-nav-count {
  min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; background: var(--omv-hover);
  color: var(--omv-faint); display: grid; place-items: center; font-size: 10.5px; font-weight: 600;
}
.omv-workspace-path {
  margin-left: auto; max-width: min(34vw, 360px); overflow: hidden; color: var(--omv-faint);
  font: 11.5px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; text-overflow: ellipsis; white-space: nowrap;
}
.omv-live { flex: none; display: inline-flex; align-items: center; gap: 5px; color: var(--omv-faint); font-size: 11px; }
.omv-live > i { width: 6px; height: 6px; border-radius: 50%; background: var(--dsw-alias-state-warn-primary, #b7791f); }
.omv-live[data-state='live'] > i { background: var(--dsw-alias-state-success-primary, #329568); box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-success-primary, #329568) 12%, transparent); }
.omv-jobs-badge { flex: none; display: inline-flex; align-items: center; gap: 5px; color: var(--omv-blue); font-size: 11px; }
.omv-sync-meta { flex: none; max-width: 120px; overflow: hidden; color: var(--omv-faint); font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.omv-sync-meta:has(+ .omv-icon-button) { color: var(--omv-faint); }

.omv-icon-button {
  appearance: none; border: 1px solid var(--omv-line); border-radius: 7px; cursor: pointer;
}
.omv-icon-button {
  width: 32px; height: 32px; padding: 0; flex: none; display: grid; place-items: center;
  background: transparent; color: var(--omv-muted);
}
.omv-icon-button:hover { background: var(--omv-hover); color: var(--omv-text); }
.omv-icon-button:active { background: color-mix(in srgb, var(--omv-hover) 75%, var(--omv-surface)); }
.omv-icon-button:disabled { opacity: .45; cursor: wait; }
/* Icon-only controls are one step larger than the compact native button icon. */
.omv-icon-button svg { width: 16px; height: 16px; }
.omv-palette-button { min-height: 28px; padding: 0 7px; border: 1px solid var(--omv-line); border-radius: 6px; background: var(--omv-surface); color: var(--omv-muted); display: inline-flex; align-items: center; gap: 5px; cursor: pointer; font-size: 10.5px; }
.omv-palette-button:hover { background: var(--omv-hover); color: var(--omv-text); }
.omv-palette-button kbd { padding: 1px 4px; border: 1px solid var(--omv-line); border-radius: 3px; color: var(--omv-faint); font: 9px/1.2 ui-monospace, monospace; }

.omv-header-action {
  appearance: none; height: 26px; min-width: 26px; padding: 0 7px; border: 0; border-radius: 6px;
  display: inline-flex; align-items: center; justify-content: center; gap: 4px; background: transparent;
  color: var(--dsw-alias-label-tertiary, #8b8f98); cursor: pointer; font: var(--dsw-font-xxs-12, 12px/1 sans-serif);
}
.omv-header-action:hover { color: var(--dsw-alias-label-primary, #1f2024); background: var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,.045)); }
.omv-header-action[data-alert='true'] { color: var(--dsw-alias-state-error-primary, #c94b4b); }
.omv-header-action:disabled { opacity: .55; cursor: wait; }
.omv-tool-card {
  min-width: 0; margin: 3px 0; overflow: hidden; border: 1px solid var(--dsw-alias-border-l2, #e5e6e8);
  border-radius: 8px; background: var(--dsw-alias-bg-layer-2, #fff); color: var(--dsw-alias-label-primary, #1f2024);
}
.omv-tool-card-row {
  min-height: 30px; display: flex; align-items: center; gap: 6px; min-width: 0; padding: 4px 8px; cursor: default;
  font: var(--dsw-font-xxs-12, 12px/1.35 sans-serif);
}
.omv-tool-card-row[role='button'] { cursor: pointer; }
.omv-tool-card-row[role='button']:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, .045)); }
.omv-tool-card-row[role='button']:focus-visible { outline: 2px solid color-mix(in srgb, var(--dsw-alias-state-business-primary, #4d6bfe) 55%, transparent); outline-offset: -2px; }
.omv-tool-card-leading { flex: none; display: inline-flex; color: var(--dsw-alias-state-business-primary, #4d6bfe); }
.omv-tool-card-brand { flex: none; color: var(--dsw-alias-state-business-primary, #4d6bfe); font-size: 10px; font-weight: 700; letter-spacing: .04em; }
.omv-tool-card-action { flex: none; display: inline-flex; align-items: center; gap: 4px; color: var(--dsw-alias-label-primary, #1f2024); font-weight: 550; white-space: nowrap; }
.omv-tool-card-preview { min-width: 0; overflow: hidden; color: var(--dsw-alias-label-secondary, #65686f); text-overflow: ellipsis; white-space: nowrap; }
.omv-tool-card-state { flex: none; display: inline-flex; align-items: center; gap: 3px; margin-left: auto; color: var(--dsw-alias-label-tertiary, #8b8f98); font-size: 10.5px; white-space: nowrap; }
.omv-tool-card[data-state='running'] .omv-tool-card-state { color: var(--dsw-alias-state-business-primary, #4d6bfe); }
.omv-tool-card[data-state='error'] .omv-tool-card-state { color: var(--dsw-alias-state-error-primary, #c94b4b); }
.omv-tool-card[data-state='stopped'] .omv-tool-card-state { color: var(--dsw-alias-state-warn-primary, #b7791f); }
.omv-tool-card-body { padding: 7px 9px 9px; border-top: 1px solid var(--dsw-alias-border-l2, #e5e6e8); background: var(--dsw-alias-bg-layer-1, #f7f8fa); }
.omv-tool-card-body pre, .omv-tool-card-output { max-height: 180px; margin: 0; overflow: auto; white-space: pre-wrap; overflow-wrap: anywhere; color: var(--dsw-alias-label-secondary, #65686f); font: 11px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace; }
.omv-tool-card-argument { margin-bottom: 6px; color: var(--dsw-alias-label-tertiary, #8b8f98); font-size: 10.5px; }
.omv-tool-card-output { margin-top: 7px; padding-top: 7px; border-top: 1px solid var(--dsw-alias-border-l2, #e5e6e8); }
.omv-tool-card-inspect { margin-top: 8px; }
.omv-context-dock {
  min-height: 20px; display: flex; align-items: center; gap: 7px; padding: 0 4px;
  color: var(--dsw-alias-label-caption, #8b8f98); font: var(--dsw-font-xxxs-11, 11.5px/20px sans-serif);
}
.omv-context-dock > i { width: 2px; height: 2px; border-radius: 50%; background: currentColor; }
.omv-context-dock b { color: var(--dsw-alias-state-error-primary, #c94b4b); font-weight: 500; }
.omv-blank-dock {
  width: min(680px, 100%); min-height: 32px; margin: 0 auto 6px; padding: 6px 10px;
  border: 1px solid var(--dsw-alias-border-l2, #e5e6e8); border-radius: 8px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  background: var(--dsw-alias-bg-layer-2, #fff); color: var(--dsw-alias-label-tertiary, #8b8f98);
  font: var(--dsw-font-xxs-12, 12px/1.4 sans-serif);
}
.omv-blank-dock > svg { color: var(--dsw-alias-state-business-primary, #4d6bfe); }
.omv-blank-dock > i { width: 2px; height: 2px; border-radius: 50%; background: currentColor; }
.omv-blank-dock b { color: var(--dsw-alias-label-primary, #1f2024); font-weight: 500; }

.omv-command-row {
  display: flex; align-items: center; min-width: 0; height: 32px; padding: 0 4px; gap: 8px;
  color: var(--dsw-alias-label-secondary, #65686f); font: var(--dsw-font-xs-13, 13px/24px sans-serif);
}
.omv-command-row .omv-command-icon { display: grid; place-items: center; color: var(--dsw-alias-state-business-primary, #4d6bfe); }
.omv-command-row code { flex: none; color: var(--dsw-alias-label-primary, #1f2024); font: var(--dsw-font-code-xs, 12px/1.4 ui-monospace, monospace); }
.omv-command-row > i { flex: none; width: 2px; height: 2px; border-radius: 50%; background: var(--dsw-alias-label-caption, #9a9ca2); }
.omv-command-row > span:last-child { min-width: 0; overflow: hidden; color: var(--dsw-alias-label-tertiary, #8b8f98); text-overflow: ellipsis; white-space: nowrap; }
.omv-command-row[data-state='error'] .omv-command-icon,
.omv-command-row[data-state='error'] > span:last-child { color: var(--dsw-alias-state-error-primary, #c94b4b); }

.omv-content {
  flex: 1; min-height: 0; overflow: auto; padding: 28px 32px calc(var(--dsh-composer-height, 152px) + 28px);
  scrollbar-width: thin; overscroll-behavior: contain;
}
.omv-content-inner { width: min(1120px, 100%); margin: 0 auto; }
.omv-hero { min-height: 62px; margin-bottom: 22px; display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }
.omv-eyebrow { margin: 0 0 6px; color: var(--omv-faint); font-size: 11px; font-weight: 500; letter-spacing: .06em; }
.omv-hero h2 { margin: 0; font-size: 23px; line-height: 1.25; font-weight: 650; letter-spacing: -.025em; }
.omv-hero p:not(.omv-eyebrow) { margin: 7px 0 0; color: var(--omv-muted); font-size: 14px; line-height: 1.55; }
.omv-hero-actions, .omv-detail-actions, .omv-form-actions { display: flex; align-items: center; gap: 8px; }
.omv-campaign-notice {
  appearance: none; width: 100%; min-height: 46px; margin: -8px 0 16px; padding: 8px 11px; border: 1px solid var(--omv-line); border-radius: 8px;
  background: var(--omv-surface); color: var(--omv-muted); display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 9px; text-align: left; cursor: pointer;
}
.omv-campaign-notice:hover { background: var(--omv-hover); }
.omv-campaign-notice > svg:first-child { color: var(--dsw-alias-state-warn-primary, #b7791f); }
.omv-campaign-notice span { display: grid; gap: 1px; }
.omv-campaign-notice strong { color: var(--omv-text); font-size: 11.5px; font-weight: 500; }
.omv-campaign-notice small { color: var(--omv-faint); font-size: 10.5px; }
.omv-data-notice { min-height: 48px; margin: -8px 0 16px; padding: 8px 11px; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary, #b7791f) 28%, var(--omv-line)); border-radius: 8px; background: color-mix(in srgb, var(--dsw-alias-state-warn-secondary, #fff7e6) 60%, var(--omv-surface)); display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 9px; }
.omv-data-notice > svg { color: var(--dsw-alias-state-warn-primary, #b7791f); }
.omv-data-notice > div { min-width: 0; display: grid; gap: 1px; }
.omv-data-notice strong { color: var(--omv-text); font-size: 11.5px; font-weight: 600; }
.omv-data-notice span { overflow: hidden; color: var(--omv-muted); font-size: 10.5px; text-overflow: ellipsis; white-space: nowrap; }
.omv-data-notice details { margin-top: 6px; color: var(--omv-faint); font-size: 10.5px; }
.omv-data-notice summary { width: fit-content; cursor: pointer; color: var(--omv-muted); }
.omv-data-notice details ul { display: grid; gap: 3px; margin: 6px 0 0; padding: 0; list-style: none; }
.omv-data-notice details li { min-width: 0; display: flex; gap: 7px; }
.omv-data-notice details li code { flex: none; color: var(--omv-muted); font: 10px/1.4 ui-monospace, monospace; }
.omv-data-notice details li span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.omv-data-notice-actions { flex: none; display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }
.omv-data-notice-actions > button { flex: none; }

.omv-metrics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-bottom: 12px; }
.omv-metric {
  position: relative; min-height: 100px; padding: 18px 20px; overflow: hidden;
  border: 1px solid var(--omv-line); border-radius: var(--omv-radius-md); background: var(--omv-surface);
  box-shadow: var(--omv-shadow-xs); transition: box-shadow .16s ease, transform .16s ease;
}
.omv-metric:hover { box-shadow: var(--omv-shadow-sm); transform: translateY(-1px); }
.omv-metric-head { display: flex; align-items: center; justify-content: space-between; color: var(--omv-muted); font-size: 12px; }
.omv-metric-icon {
  width: 32px; height: 32px; border-radius: var(--omv-radius-sm);
  background: color-mix(in srgb, var(--metric-color, var(--omv-blue)) 12%, transparent);
  color: var(--metric-color, var(--omv-blue)); display: grid; place-items: center;
}
.omv-metric-icon svg { width: 16px; height: 16px; }
.omv-metric strong { display: block; margin-top: 12px; font-size: 30px; line-height: 1; font-weight: 650; letter-spacing: -.03em; font-variant-numeric: tabular-nums; }
.omv-metric-foot { margin-top: 10px; display: block; color: var(--omv-faint); font-size: 12px; }
.omv-metric-foot b { color: var(--metric-color, var(--omv-muted)); font-weight: 600; }

.omv-panel, .omv-list-wrap, .omv-campaign {
  min-width: 0; border: 1px solid var(--omv-line); border-radius: var(--omv-radius-md); background: var(--omv-surface);
  box-shadow: var(--omv-shadow-xs); overflow: hidden;
}
.omv-panel-head { min-height: 54px; padding: 0 18px; border-bottom: 1px solid var(--omv-line); display: flex; align-items: center; gap: 10px; }
.omv-panel-head h3 { margin: 0; font-size: 13px; font-weight: 600; }
.omv-panel-head p { margin: 2px 0 0; color: var(--omv-faint); font-size: 12px; }
.omv-panel-head > button { margin-left: auto; }
.omv-queue { list-style: none; margin: 0; padding: 0; }
.omv-queue-row {
  display: grid; grid-template-columns: minmax(150px, .85fr) minmax(170px, 1.2fr) 92px 20px;
  align-items: center; gap: 12px; min-height: 58px; padding: 8px 15px; border-bottom: 1px solid var(--omv-line); cursor: pointer;
}
.omv-queue-row:last-child { border-bottom: 0; }
.omv-queue-row:hover { background: var(--omv-hover); }
 .omv-finding-name { min-width: 0; padding-left: 4px; display: flex; align-items: center; gap: 12px; }
.omv-finding-name > div { min-width: 0; }
.omv-finding-name strong { display: block; overflow: hidden; color: var(--omv-text); font-size: 13px; font-weight: 500; text-overflow: ellipsis; white-space: nowrap; }
.omv-finding-name span { display: block; margin-top: 4px; overflow: hidden; color: var(--omv-faint); font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
.omv-eco-avatar {
  --eco-brand: var(--omv-muted); --eco-bg: var(--omv-hover); --eco-cutout: #fff;
  flex: none; display: grid; place-items: center; overflow: hidden;
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--eco-bg); color: var(--eco-brand);
  font-size: 12.5px; font-weight: 650; line-height: 1; text-transform: uppercase; font-variant-numeric: normal;
}
.omv-eco-avatar > svg { display: block; flex: none; width: 20px; height: 20px; }
.omv-eco-avatar[data-ecosystem='npm'] { --eco-brand: #cb3837; --eco-bg: #fff0ef; }
.omv-eco-avatar[data-ecosystem='python'], .omv-eco-avatar[data-ecosystem='pypi'], .omv-eco-avatar[data-ecosystem='pip'] { --eco-bg: #eef6fb; }
.omv-eco-avatar[data-ecosystem='go'] { --eco-brand: #00add8; --eco-bg: #e8f9fd; }
.omv-eco-avatar[data-ecosystem='rust'], .omv-eco-avatar[data-ecosystem='cargo'] { --eco-bg: #fff4eb; }
.omv-eco-avatar[data-ecosystem='java'] { --eco-bg: #eef4f8; }
.omv-eco-avatar[data-ecosystem='ruby'] { --eco-brand: #cc342d; --eco-bg: #fff0ef; }
.omv-eco-avatar[data-ecosystem='php'] { --eco-brand: #777bb3; --eco-bg: #f2f1fb; }
.omv-eco-avatar[data-ecosystem='csharp'], .omv-eco-avatar[data-ecosystem='c#'] { --eco-brand: #68217a; --eco-bg: #f7eff9; }
.omv-eco-avatar[data-ecosystem='swift'] { --eco-brand: #f05138; --eco-bg: #fff1ed; }
.omv-eco-avatar[data-ecosystem='dart'] { --eco-brand: #0175c2; --eco-bg: #edf7fd; }
.omv-eco-avatar[data-ecosystem='elixir'] { --eco-brand: #6e4a7e; --eco-bg: #f7f0fa; }
.omv-eco-avatar[data-ecosystem='perl'] { --eco-brand: #39457f; --eco-bg: #eef0fb; }
.omv-eco-avatar[data-ecosystem='r'] { --eco-brand: #276dc3; --eco-bg: #edf5ff; }
.omv-eco-avatar[data-ecosystem='lua'] { --eco-brand: #000080; --eco-bg: #eef0ff; --eco-cutout: #fff; }
.omv-eco-avatar[data-size='lg'] { width: 40px; height: 40px; font-size: 14px; }
.omv-eco-avatar[data-size='lg'] > svg { width: 22px; height: 22px; }
.omv-list-wrap {
  min-width: 0; border: 1px solid var(--omv-line); border-radius: var(--omv-radius-md); background: var(--omv-surface);
  box-shadow: var(--omv-shadow-xs); overflow: hidden;
}
.omv-list-head, .omv-finding-row {
  display: grid; grid-template-columns: minmax(0, 1.6fr) 104px 96px minmax(0, .9fr) minmax(0, 1fr);
  align-items: center; gap: 16px; padding: 0 20px;
}
.omv-list-head {
  height: 44px; border-bottom: 1px solid var(--omv-line); color: var(--omv-faint);
  font-size: 10.5px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase;
  background: color-mix(in srgb, var(--omv-bg) 65%, var(--omv-surface));
}
.omv-finding-list { margin: 0; padding: 0; list-style: none; }
.omv-finding-row { min-height: 72px; padding: 12px 20px; border-bottom: 1px solid var(--omv-line); cursor: pointer; position: relative; }
.omv-finding-row:last-child { border-bottom: 0; }
.omv-finding-row:hover { background: color-mix(in srgb, var(--omv-blue) 5%, var(--omv-surface)); }
.omv-finding-row:focus-visible { outline: 2px solid color-mix(in srgb, var(--omv-blue) 60%, transparent); outline-offset: -2px; }
.omv-finding-row::before {
  content: ''; position: absolute; top: 10px; bottom: 10px; left: 0; width: 3px; border-radius: 0 2px 2px 0;
  background: var(--stage-line, transparent);
}
.omv-finding-row[data-stage='confirmed']::before, .omv-finding-row[data-stage='report_ready']::before, .omv-finding-row[data-stage='disclosed']::before { --stage-line: var(--omv-green); }
.omv-finding-row[data-stage='candidate']::before, .omv-finding-row[data-stage='investigating']::before { --stage-line: var(--omv-blue); }
.omv-finding-row[data-stage='reproducing']::before { --stage-line: var(--omv-orange); }
.omv-finding-row[data-stage='blocked']::before { --stage-line: var(--omv-red); }
.omv-finding-row .omv-cell-mono { min-width: 0; overflow: hidden; color: var(--omv-faint); font: 11px/1.35 ui-monospace, SFMono-Regular, Menlo, monospace; text-overflow: ellipsis; white-space: nowrap; }
.omv-next { min-width: 0; overflow: hidden; color: var(--omv-muted); font: 11px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace; text-overflow: ellipsis; white-space: nowrap; }
.omv-muted-copy { color: var(--omv-faint); font-size: 11px; }
.omv-maturity {
  --maturity: var(--omv-faint); min-width: 0; display: grid; grid-template-columns: 17px minmax(0, auto) auto; align-items: center; justify-content: start; gap: 6px; color: var(--omv-muted); font-size: 11px;
}
.omv-maturity[data-maturity='developing'] { --maturity: var(--dsw-alias-state-warn-primary, #b7791f); }
.omv-maturity[data-maturity='supported'] { --maturity: var(--omv-green); }
.omv-maturity[data-maturity='verified'] { --maturity: var(--dsw-alias-state-success-primary, #329568); }
.omv-maturity[data-maturity='contested'] { --maturity: var(--dsw-alias-state-error-primary, #d44c4c); }
.omv-maturity > i { width: 17px; height: 17px; border-radius: 5px; background: color-mix(in srgb, var(--maturity) 12%, transparent); color: var(--maturity); display: grid; place-items: center; }
.omv-maturity > i svg { display: block; }
.omv-maturity > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.omv-maturity > b { color: var(--omv-faint); font-size: 10px; font-weight: 500; }
.omv-status {
  width: fit-content; padding: 3px 8px; border-radius: 5px; background: color-mix(in srgb, var(--status) 10%, transparent);
  color: var(--status); display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 500;
}
.omv-status svg { flex: none; }

.omv-native-jobs,
.omv-native-jobs li { min-height: 44px; padding: 7px 12px; border-bottom: 1px solid var(--omv-line); display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; align-items: center; gap: 8px; }
.omv-native-jobs li:last-child { border-bottom: 0; }
.omv-native-jobs li > i { width: 22px; height: 22px; border-radius: 6px; background: var(--omv-bg); color: var(--omv-faint); display: grid; place-items: center; }
.omv-native-jobs li > i[data-state='running'], .omv-native-jobs li > i[data-state='stopping'] { background: color-mix(in srgb, var(--omv-blue) 10%, transparent); color: var(--omv-blue); }
.omv-native-jobs li > i[data-state='running'] svg, .omv-native-jobs li > i[data-state='stopping'] svg { animation: omv-pulse 1.4s ease-in-out infinite; }
.omv-native-jobs li > i[data-state='completed'] { background: var(--dsw-alias-state-success-secondary, #e9f7f0); color: var(--dsw-alias-state-success-primary, #329568); }
.omv-native-jobs li > i[data-state='failed'], .omv-native-jobs li > i[data-state='killed'] { background: var(--dsw-alias-state-error-secondary, #fdecec); color: var(--dsw-alias-state-error-primary, #d44c4c); }
.omv-native-jobs li > div { min-width: 0; display: grid; gap: 2px; }
.omv-native-jobs strong { overflow: hidden; color: var(--omv-muted); font-size: 11px; font-weight: 500; text-overflow: ellipsis; white-space: nowrap; }
.omv-native-jobs span, .omv-native-jobs code { color: var(--omv-faint); font: 10px/1.4 ui-monospace, monospace; }
.omv-native-jobs button { min-height: 28px; padding: 0 10px; font-size: 11px; }
@keyframes omv-pulse { 50% { opacity: .35; } }

.omv-toolbar { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
 .omv-search { position: relative; flex: 1; }
 .omv-search svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--omv-faint); }
.omv-input, .omv-select {
  width: 100%; border: 1px solid var(--omv-line); border-radius: 7px; outline: 0;
  background: var(--omv-surface); color: var(--omv-text);
}
.omv-input { height: 36px; padding: 0 11px; font-size: 12.5px; }
.omv-search .omv-input { border-radius: 999px; padding-left: 38px; }
.omv-select { height: 36px; padding: 0 28px 0 11px; font-size: 12.5px; }
.omv-input::placeholder { color: var(--omv-faint); }
.omv-input:focus, .omv-select:focus { border-color: var(--omv-blue); box-shadow: 0 0 0 2px color-mix(in srgb, var(--omv-blue) 14%, transparent); }
/* DSH primitive inputs: the primitive owns the control chrome; these rules only
   place it inside OMV's existing page layouts. */
.omv-form-input, .omv-campaign-input, .omv-global-input { display: inline-flex; width: 100%; }
.omv-form-input { height: 36px; }
.omv-campaign-input { height: 34px; }
.omv-global-input { height: 40px; }
.omv-form-input > input, .omv-campaign-input > input, .omv-global-input > input { min-width: 0; width: 100%; }
.omv-global-input > input { font-size: 13px; }
.omv-search .omv-global-input svg, .omv-campaign-search .omv-campaign-input svg { position: static; transform: none; }
.omv-empty { min-height: 160px; padding: 28px; display: grid; place-items: center; color: var(--omv-faint); font-size: 13px; text-align: center; }
.omv-empty > div { display: grid; justify-items: center; gap: 6px; max-width: 420px; }
.omv-empty svg { display: block; margin: 0 auto 4px; color: var(--omv-blue); opacity: .72; }
.omv-empty strong { color: var(--omv-muted); font-size: 13px; font-weight: 500; }
.omv-empty span { color: var(--omv-faint); font-size: 11.5px; line-height: 1.5; }
.omv-empty-action { margin-top: 5px; }

.omv-campaigns { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.omv-campaign-issues { margin-bottom: 12px; overflow: hidden; }
.omv-campaign-issues > ul { margin: 0; padding: 3px 0; list-style: none; }
.omv-campaign-issues li { min-height: 58px; padding: 8px 12px; border-bottom: 1px solid var(--omv-line); display: grid; grid-template-columns: 7px minmax(0, 1fr) auto; align-items: center; gap: 9px; }
.omv-campaign-issues li:last-child { border-bottom: 0; }
.omv-campaign-issues li > i { width: 22px; height: 22px; border-radius: 6px; background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #b7791f) 11%, transparent); color: var(--dsw-alias-state-warn-primary, #b7791f); display: grid; place-items: center; }
.omv-campaign-issues li > div { min-width: 0; display: grid; gap: 2px; }
.omv-campaign-issues strong { color: var(--omv-text); font-size: 11.5px; font-weight: 500; }
.omv-campaign-issues span { overflow: hidden; color: var(--omv-muted); font-size: 10.5px; text-overflow: ellipsis; white-space: nowrap; }
.omv-campaign-issues code { overflow: hidden; color: var(--omv-faint); font: 10px/1.35 ui-monospace, monospace; text-overflow: ellipsis; white-space: nowrap; }
.omv-campaign { padding: 15px; }
.omv-campaign:hover { border-color: color-mix(in srgb, var(--omv-line) 40%, var(--omv-muted)); box-shadow: 0 6px 18px rgba(0, 0, 0, .05); transform: translateY(-1px); }
.omv-campaign-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.omv-campaign-icon { color: var(--omv-muted); display: grid; place-items: center; }
.omv-campaign h3 { margin: 14px 0 5px; overflow: hidden; color: var(--omv-text); font-size: 13.5px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.omv-campaign p { margin: 0; color: var(--omv-faint); font-size: 12px; }
.omv-campaign-foot { margin-top: 15px; padding-top: 11px; border-top: 1px solid var(--omv-line); display: flex; justify-content: space-between; color: var(--omv-faint); font-size: 11px; }
.omv-campaign-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 9px; margin-bottom: 14px; }
.omv-campaign-summary > div { min-width: 0; padding: 11px; border: 1px solid var(--omv-line); border-radius: 9px; background: var(--omv-bg); transition: border-color .14s ease; }
.omv-campaign-summary > div:hover { border-color: color-mix(in srgb, var(--omv-blue) 30%, var(--omv-line)); }
.omv-campaign-summary span { display: block; color: var(--omv-faint); font-size: 10px; letter-spacing: .02em; }
.omv-campaign-summary strong { display: block; margin-top: 5px; overflow: hidden; color: var(--omv-text); font-size: 12.5px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.omv-path-block { padding: 11px 12px; display: grid; gap: 5px; }
.omv-path-block code { overflow: hidden; color: var(--omv-muted); font: 10.5px/1.45 ui-monospace, monospace; text-overflow: ellipsis; white-space: nowrap; }
.omv-path-block span { color: var(--omv-faint); font-size: 11px; }.omv-global-search { margin-bottom: 12px; }
.omv-global-search .omv-input { height: 42px; font-size: 13.5px; }
.omv-search-clear { position: absolute; top: 50%; right: 8px; width: 25px; height: 25px; transform: translateY(-50%); border: 0; border-radius: 5px; background: transparent; color: var(--omv-faint); display: grid; place-items: center; cursor: pointer; }
.omv-search-clear:hover { background: var(--omv-hover); color: var(--omv-text); }
.omv-search-results { overflow: hidden; }
.omv-results-meta { min-height: 34px; padding: 0 13px; border-bottom: 1px solid var(--omv-line); display: flex; align-items: center; color: var(--omv-faint); font-size: 11px; }
.omv-search-results > ul { margin: 0; padding: 3px 0; list-style: none; }
.omv-search-results li { min-height: 52px; padding: 8px 13px; border-bottom: 1px solid var(--omv-line); display: grid; grid-template-columns: 82px minmax(0, 1fr) auto; align-items: center; gap: 11px; }
.omv-search-results li[data-actionable='true'] { cursor: pointer; }
.omv-search-results li[data-actionable='true']:hover { background: var(--omv-hover); }
.omv-search-results li > div { min-width: 0; display: grid; gap: 3px; }
.omv-search-results strong { overflow: hidden; color: var(--omv-text); font-size: 12px; font-weight: 500; text-overflow: ellipsis; white-space: nowrap; }
.omv-search-results span { overflow: hidden; color: var(--omv-faint); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.omv-search-results li > b { color: var(--omv-faint); font-size: 10.5px; font-weight: 500; }
@keyframes omv-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes omv-pop-in { from { opacity: 0; transform: translateY(10px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
@media (prefers-reduced-motion: reduce) {
  .omv-detail-backdrop, .omv-detail { animation: none !important; }
}
.omv-detail-backdrop {
  position: fixed; inset: 0; z-index: 5; overflow: auto;
  background: rgba(10, 12, 20, .5); backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center; padding: 32px;
  animation: omv-fade-in .16s ease both;
  }
.omv-detail {
  /* Height is capped against the panel's own box (100%), not vh: vh resolves to the whole
     browser window, which is taller than this panel once the host chat composer/task bar
     below it are accounted for, and would let the card spill past the panel's bottom edge. */
  position: relative; z-index: 6; width: min(860px, 100%); max-height: min(100%, 900px); overflow: auto;
  border: 1px solid var(--omv-line); border-radius: 16px; background: var(--omv-surface); box-shadow: var(--omv-shadow-lg);
  animation: omv-pop-in .2s cubic-bezier(.22, .61, .36, 1) both;
}
.omv-detail-head {
  position: sticky; z-index: 2; top: 0; min-height: 64px; padding: 14px 22px; border-bottom: 1px solid var(--omv-line);
  border-radius: 16px 16px 0 0;
  background: color-mix(in srgb, var(--omv-surface) 92%, transparent); backdrop-filter: blur(6px); display: flex; align-items: center; gap: 12px;
  box-shadow: inset 0 -2px 0 0 color-mix(in srgb, var(--omv-blue) 30%, transparent);
}
.omv-detail-head-copy { min-width: 0; flex: 1; }
.omv-detail-head h2 { margin: 0; overflow: hidden; font-size: 16px; font-weight: 650; letter-spacing: -.01em; text-overflow: ellipsis; white-space: nowrap; }
.omv-detail-head p { margin: 4px 0 0; color: var(--omv-faint); font-size: 11px; }
.omv-detail-body { padding: 22px 24px 26px; }
.omv-detail-summary { display: grid; grid-template-columns: 104px 1fr; gap: 18px; margin-bottom: 16px; }
.omv-maturity-hero {
  --maturity: var(--omv-faint); min-height: 100px; padding: 12px; border: 1px solid var(--omv-line); border-radius: 12px;
  background: linear-gradient(150deg, color-mix(in srgb, var(--maturity) 9%, var(--omv-surface)), var(--omv-surface) 70%);
  box-shadow: var(--omv-shadow-xs); display: grid; place-items: center; align-content: center; gap: 5px; text-align: center;
}
.omv-maturity-hero[data-maturity='developing'] { --maturity: var(--dsw-alias-state-warn-primary, #b7791f); }
.omv-maturity-hero[data-maturity='supported'] { --maturity: var(--omv-green); }
.omv-maturity-hero[data-maturity='verified'] { --maturity: var(--dsw-alias-state-success-primary, #329568); }
.omv-maturity-hero[data-maturity='contested'] { --maturity: var(--dsw-alias-state-error-primary, #d44c4c); }
.omv-maturity-hero > i {
  width: 34px; height: 34px; border-radius: 10px; background: color-mix(in srgb, var(--maturity) 14%, transparent);
  color: var(--maturity); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--maturity) 24%, transparent); display: grid; place-items: center;
}
.omv-maturity-hero strong { color: var(--omv-text); font-size: 12.5px; font-weight: 650; }
.omv-maturity-hero small { color: var(--omv-faint); font-size: 10px; }
.omv-summary-copy { padding-top: 3px; }
.omv-summary-copy h3 { margin: 0 0 6px; font-size: 15px; font-weight: 650; letter-spacing: -.01em; }
.omv-summary-copy p { margin: 0; color: var(--omv-muted); font-size: 12.5px; line-height: 1.55; }
.omv-detail-actions { flex-wrap: wrap; margin-top: 12px; }
.omv-danger-button { color: var(--dsw-alias-state-error-primary, #c94b4b); }
.omv-danger-button:hover:not(:disabled) { color: var(--dsw-alias-state-error-primary, #c94b4b); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #c94b4b) 8%, transparent); }
.omv-section {
  margin-top: 14px; border: 1px solid var(--omv-line); border-radius: 10px; background: var(--omv-surface);
  box-shadow: var(--omv-shadow-xs); transition: box-shadow .16s ease;
}
.omv-section-title { min-height: 42px; padding: 0 14px; border-bottom: 1px solid var(--omv-line); display: flex; align-items: center; justify-content: space-between; }
.omv-section-title h3 { margin: 0; font-size: 12.5px; font-weight: 650; letter-spacing: -.005em; }
.omv-section-title span { color: var(--omv-faint); font-size: 11px; font-variant-numeric: tabular-nums; }
.omv-chain { display: grid; grid-template-columns: 1fr 18px 1fr 18px 1fr; align-items: stretch; padding: 13px; }
.omv-chain-card {
  --chain: var(--omv-blue); appearance: none; position: relative; min-width: 0; padding: 12px 13px; border: 1px solid var(--omv-line); border-radius: 10px;
  background: var(--omv-bg); color: inherit; display: grid; align-content: start; gap: 5px; text-align: left; overflow: hidden;
  transition: border-color .14s ease, background-color .14s ease, transform .14s ease;
}
.omv-chain-card::before { content: ''; position: absolute; inset: 0 auto 0 0; width: 3px; background: var(--chain); opacity: .7; }
.omv-chain > .omv-chain-card:nth-of-type(1) { --chain: var(--omv-blue); }
.omv-chain > .omv-chain-card:nth-of-type(2) { --chain: var(--omv-red); }
.omv-chain > .omv-chain-card:nth-of-type(3) { --chain: var(--omv-green); }
button.omv-chain-card { cursor: pointer; }
.omv-chain-card[data-openable='true']:hover { border-color: color-mix(in srgb, var(--chain) 45%, var(--omv-line)); background: color-mix(in srgb, var(--chain) 5%, var(--omv-bg)); transform: translateY(-1px); }
.omv-chain-card span { color: var(--omv-faint); font-size: 10px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; }
.omv-chain-card code { display: block; overflow: hidden; color: var(--omv-text); font: 11.5px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }
.omv-chain-card small { display: -webkit-box; overflow: hidden; color: var(--omv-muted); font-size: 11px; line-height: 1.4; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
.omv-chain-card em { margin-top: 2px; color: var(--chain); display: inline-flex; align-items: center; gap: 4px; font-size: 10.5px; font-style: normal; font-weight: 600; }
.omv-chain-arrow { display: grid; place-items: center; color: var(--omv-faint); }
.omv-issues { margin: 0; padding: 4px 0; list-style: none; }
.omv-issue { display: grid; grid-template-columns: 7px 1fr; gap: 9px; padding: 9px 14px; border-bottom: 1px solid var(--omv-line); transition: background-color .12s ease; }
.omv-issue:hover { background: var(--omv-hover); }
.omv-issue:last-child { border-bottom: 0; }
.omv-issue-dot { width: 6px; height: 6px; margin-top: 4px; border-radius: 50%; background: var(--issue, var(--omv-blue)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--issue, var(--omv-blue)) 16%, transparent); }
.omv-issue strong { display: block; color: var(--omv-muted); font-size: 11px; font-weight: 500; line-height: 1.4; }
.omv-issue code { display: block; margin-top: 4px; color: var(--omv-faint); font: 10.5px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }
.omv-session-link { min-height: 66px; padding: 12px 14px; display: flex; align-items: center; gap: 14px; }
.omv-session-link-icon {
  flex: none; width: 32px; height: 32px; border-radius: var(--omv-radius-sm); display: grid; place-items: center;
  background: var(--omv-hover); color: var(--omv-faint);
}
.omv-session-link-icon svg { width: 16px; height: 16px; }
.omv-session-link[data-linked='true'] .omv-session-link-icon { background: color-mix(in srgb, var(--omv-blue) 12%, transparent); color: var(--omv-blue); }
.omv-session-link > div:first-child { flex: 1 1 auto; min-width: 0; display: grid; gap: 3px; }
.omv-session-link strong { color: var(--omv-text); font-size: 12px; font-weight: 500; }
.omv-session-link code { overflow: hidden; color: var(--omv-faint); font: 10.5px/1.4 ui-monospace, monospace; text-overflow: ellipsis; white-space: nowrap; }
.omv-session-link span { color: var(--omv-muted); font-size: 11.5px; }
.omv-session-link > div:last-child { flex: none; display: flex; gap: 6px; }
.omv-session-link button { min-height: 30px; padding: 0 11px; font-size: 11px; }
.omv-workflow-actions { padding: 11px 14px; display: flex; flex-wrap: wrap; gap: 7px; }
.omv-diff > div { min-height: 34px; padding: 0 14px; border-bottom: 1px solid var(--omv-line); display: flex; align-items: center; justify-content: space-between; gap: 12px; color: var(--omv-muted); font-size: 11px; }
.omv-diff > div code { color: var(--omv-faint); font: 10.5px/1.4 ui-monospace, monospace; }
.omv-diff-code { max-height: 240px; overflow: auto; border: 0; border-radius: 0; }
.omv-history { position: relative; margin: 0; padding: 3px 0; list-style: none; }
.omv-history li { position: relative; min-height: 43px; padding: 7px 14px; border-bottom: 1px solid var(--omv-line); display: grid; grid-template-columns: 7px minmax(0, 1fr) auto; align-items: center; gap: 9px; }
.omv-history li::before { content: ''; position: absolute; top: 0; bottom: 0; left: 17px; width: 1px; background: var(--omv-line); }
.omv-history li:first-child::before { top: 50%; }
.omv-history li:last-child::before { bottom: 50%; }
.omv-history li:last-child { border-bottom: 0; }
.omv-history li > i { position: relative; z-index: 1; width: 18px; height: 18px; border-radius: 6px; background: var(--omv-surface); box-shadow: 0 0 0 3px var(--omv-surface); display: grid; place-items: center; }
.omv-history li > i svg { display: block; }
.omv-history li > div { min-width: 0; display: grid; gap: 2px; }
.omv-history strong { color: var(--omv-muted); font-size: 11px; font-weight: 500; }
.omv-history span { overflow: hidden; color: var(--omv-faint); font: 10.5px/1.4 ui-monospace, monospace; text-overflow: ellipsis; white-space: nowrap; }
.omv-history b { color: var(--omv-faint); font-size: 10.5px; font-weight: 500; }
.omv-run-head { min-height: 52px; padding: 9px 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.omv-run-head > div:first-child { min-width: 0; display: grid; gap: 3px; }
.omv-run-head strong { color: var(--omv-text); font: 11px/1.4 ui-monospace, monospace; }
.omv-run-head span { color: var(--omv-faint); font-size: 10.5px; }
.omv-run-head > div:last-child { display: flex; gap: 6px; }
.omv-run-progress { position: relative; height: 5px; margin: 0 14px 2px; overflow: hidden; border-radius: 999px; background: var(--omv-line); }
.omv-run-progress i { position: absolute; top: 0; bottom: 0; display: block; transition: width .2s ease, left .2s ease; }
.omv-run-progress i[data-kind='completed'] { background: var(--dsw-alias-state-success-primary, #329568); }
.omv-run-progress i[data-kind='attention'] { background: var(--dsw-alias-state-warn-primary, #b7791f); }
.omv-run-progress i[data-kind='pending'] { background: color-mix(in srgb, var(--omv-blue) 34%, var(--omv-line)); }
.omv-gate-checks, .omv-repro-runs { margin: 0; padding: 3px 0; list-style: none; }
.omv-gate-summary { padding: 10px 14px; border-bottom: 1px solid var(--omv-line); background: var(--omv-bg); color: var(--omv-muted); font-size: 11px; line-height: 1.5; }
.omv-gate-checks li { min-height: 46px; padding: 7px 14px; border-bottom: 1px solid var(--omv-line); display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; align-items: center; gap: 8px; }
.omv-gate-checks li:last-child, .omv-repro-runs li:last-child { border-bottom: 0; }
.omv-gate-checks li > i { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: var(--omv-bg); color: var(--omv-faint); }
.omv-gate-checks li[data-state='supported'] > i, .omv-gate-checks li[data-state='verified'] > i, .omv-gate-checks li[data-state='not_applicable'] > i { background: var(--dsw-alias-state-success-secondary, #e9f7f0); color: var(--dsw-alias-state-success-primary, #329568); }
.omv-gate-checks li[data-state='partial'] > i { background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #b7791f) 10%, transparent); color: var(--dsw-alias-state-warn-primary, #b7791f); }
.omv-gate-checks li[data-blocking='true'][data-state='missing'] > i { background: var(--dsw-alias-state-error-secondary, #fdecec); color: var(--dsw-alias-state-error-primary, #d44c4c); }
.omv-gate-checks li > div { min-width: 0; display: grid; gap: 2px; }
.omv-gate-checks strong { color: var(--omv-muted); font-size: 11px; font-weight: 500; }
.omv-gate-checks span, .omv-gate-checks small { color: var(--omv-faint); font-size: 10.5px; }
.omv-assessment-dimensions { margin: 0; padding: 3px 0; list-style: none; }
.omv-assessment-dimensions li { --dimension: var(--omv-faint); min-height: 52px; padding: 8px 14px; border-bottom: 1px solid var(--omv-line); display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; align-items: center; gap: 10px; transition: background-color .12s ease; }
.omv-assessment-dimensions li:hover { background: var(--omv-hover); }
.omv-assessment-dimensions li:last-child { border-bottom: 0; }
.omv-assessment-dimensions li[data-state='partial'] { --dimension: var(--dsw-alias-state-warn-primary, #b7791f); }
.omv-assessment-dimensions li[data-state='supported'] { --dimension: var(--omv-green); }
.omv-assessment-dimensions li[data-state='verified'] { --dimension: var(--dsw-alias-state-success-primary, #329568); }
.omv-assessment-dimensions li > i { width: 22px; height: 22px; border-radius: 6px; background: color-mix(in srgb, var(--dimension) 11%, transparent); color: var(--dimension); display: grid; place-items: center; }
.omv-assessment-dimensions li > div { min-width: 0; display: grid; gap: 2px; }
.omv-assessment-dimensions strong { color: var(--omv-muted); font-size: 11px; font-weight: 500; }
.omv-assessment-dimensions span { color: var(--omv-faint); font-size: 10.5px; line-height: 1.4; }
.omv-assessment-dimensions code { color: var(--omv-blue); font: 10px/1.4 ui-monospace, monospace; }
.omv-repro-runs li { min-height: 48px; padding: 7px 14px; border-bottom: 1px solid var(--omv-line); display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 9px; transition: background-color .12s ease; }
.omv-repro-runs li:hover { background: var(--omv-hover); }
.omv-repro-runs li > div { min-width: 0; display: grid; gap: 2px; }
.omv-repro-runs strong { overflow: hidden; color: var(--omv-muted); font: 11px/1.4 ui-monospace, monospace; text-overflow: ellipsis; white-space: nowrap; }
.omv-repro-runs span { color: var(--omv-faint); font-size: 10.5px; }

/* 1.0 workbench surfaces: quiet DSH-native cards with clear action density. */
.omv-hero-status { min-height: 32px; padding: 0 10px; border: 1px solid var(--omv-line); border-radius: 7px; background: var(--omv-surface); color: var(--omv-muted); display: inline-flex; align-items: center; gap: 7px; font-size: 11px; }
.omv-hero-status i { width: 7px; height: 7px; border-radius: 50%; background: var(--omv-faint); }
.omv-hero-status i[data-state='live'] { background: var(--dsw-alias-state-success-primary, #329568); box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-success-primary, #329568) 12%, transparent); }
.omv-hero-status i[data-state='warn'] { background: var(--dsw-alias-state-warn-primary, #b7791f); }
.omv-repro-board > ul { margin: 0; padding: 3px 0; list-style: none; }
.omv-quality-issue { min-height: 66px; padding: 9px 13px; border-bottom: 1px solid var(--omv-line); display: grid; grid-template-columns: 26px minmax(0, 1fr) auto; align-items: center; gap: 10px; }
.omv-quality-issue:last-child,
.omv-repro-card:last-child{ border-bottom: 0; }
.omv-quality-issue[role='button'] { cursor: pointer; }
.omv-quality-issue[role='button']:hover { background: var(--omv-hover); }
.omv-priority-issue-logo { width: 26px; height: 26px; border: 1px solid color-mix(in srgb, var(--omv-blue) 24%, var(--omv-line)); border-radius: 7px; background: color-mix(in srgb, var(--omv-blue) 7%, var(--omv-surface)); color: var(--omv-blue); display: grid; place-items: center; box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 8%, transparent); }
.omv-priority-issue-mark { display: block; width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.65; stroke-linecap: round; stroke-linejoin: round; }
.omv-priority-issue-logo[data-severity='blocker'] { border-color: color-mix(in srgb, var(--omv-red) 38%, var(--omv-line)); background: color-mix(in srgb, var(--omv-red) 7%, var(--omv-surface)); color: var(--omv-red); }
.omv-priority-issue-logo[data-severity='warning'] { border-color: color-mix(in srgb, var(--omv-orange) 38%, var(--omv-line)); background: color-mix(in srgb, var(--omv-orange) 7%, var(--omv-surface)); color: var(--omv-orange); }
.omv-quality-issue > div { min-width: 0; display: grid; gap: 2px; }
.omv-quality-issue strong { color: var(--omv-text); font-size: 12px; font-weight: 500; }
.omv-quality-issue span { color: var(--omv-muted); font-size: 11px; line-height: 1.4; }
.omv-quality-issue code { overflow: hidden; color: var(--omv-faint); font: 10px/1.4 ui-monospace, monospace; text-overflow: ellipsis; white-space: nowrap; }
.omv-quality-issue small { color: var(--omv-blue); font-size: 10px; }
.omv-repro-metrics { margin-bottom: 12px; }
.omv-repro-board{ overflow: hidden; }
.omv-repro-card { padding: 12px 13px; border-bottom: 1px solid var(--omv-line); display: grid; gap: 7px; }
.omv-repro-card-head{ min-width: 0; display: flex; align-items: center; gap: 8px; }
.omv-repro-card-head code { margin-left: auto; color: var(--omv-faint); font: 10px/1.4 ui-monospace, monospace; }
.omv-repro-card > p { margin: 0; color: var(--omv-faint); font-size: 10.5px; }
.omv-repro-card-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; color: var(--omv-faint); font-size: 10.5px; }
.omv-repro-card-foot .omv-repro-restart { flex: none; }
.omv-link-button { min-width: 0; padding: 0; border: 0; background: transparent; color: var(--omv-blue); display: inline-flex; align-items: center; gap: 4px; cursor: pointer; font: 11.5px/1.4 ui-monospace, monospace; }
.omv-link-button:hover { color: color-mix(in srgb, var(--omv-blue) 78%, var(--omv-text)); text-decoration: underline; }.omv-inline-empty { padding-bottom: 8px; display: grid; justify-items: center; gap: 0; }
.omv-inline-empty .omv-inline-action { margin-top: -3px; }
.omv-section-footer { padding: 8px 12px; border-top: 1px solid var(--omv-line); }
.omv-section-footer .omv-section-action { margin: 0; }
.omv-surface-issue { margin: 0; padding: 10px 14px; color: var(--dsw-alias-state-warn-primary, #b7791f); font-size: 11.5px; line-height: 1.45; }
.omv-surface-cards { margin: 0; padding: 0; list-style: none; }
.omv-surface-card { position: relative; padding: 14px 16px 13px; border-bottom: 1px solid var(--omv-line); display: grid; gap: 8px; transition: background-color .12s ease; }
.omv-surface-card:hover { background: var(--omv-hover); }
.omv-surface-card:last-child { border-bottom: 0; }
.omv-surface-card::before { content: ''; position: absolute; top: 14px; bottom: 13px; left: 0; width: 3px; border-radius: 0 3px 3px 0; background: var(--omv-line); }
.omv-surface-card[data-status='selected']::before { background: var(--omv-green); }
.omv-surface-card[data-status='proposed']::before { background: var(--omv-blue); }
.omv-surface-card[data-status='skipped'] { color: var(--omv-faint); }
.omv-surface-card[data-status='skipped']::before { background: var(--omv-faint); }
.omv-surface-card-head { min-width: 0; display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.omv-surface-card-head > div { min-width: 0; display: grid; gap: 3px; }
.omv-surface-kicker { color: var(--omv-faint); font-size: 10px; letter-spacing: .03em; }
.omv-surface-card-head strong { overflow: hidden; color: var(--omv-text); font-size: 13px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.omv-surface-card > p { margin: 0; color: var(--omv-muted); font-size: 12px; line-height: 1.5; }
.omv-surface-lists { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; padding: 10px 11px; border: 1px solid var(--omv-line); border-radius: 9px; background: var(--omv-bg); }
.omv-surface-lists div { min-width: 0; display: grid; gap: 3px; }
.omv-surface-lists span { color: var(--omv-faint); font-size: 10px; letter-spacing: .04em; text-transform: uppercase; }
.omv-surface-lists small { color: var(--omv-muted); font-size: 11px; line-height: 1.45; }
.omv-surface-fp { color: var(--omv-faint); font-size: 11px; line-height: 1.45; }
.omv-surface-actions { display: flex; align-items: center; gap: 6px; }
.omv-surface-actions code { margin-right: auto; overflow: hidden; color: var(--omv-faint); font: 10.5px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; text-overflow: ellipsis; white-space: nowrap; }
.omv-dedup-head{ min-height: 58px; padding: 11px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.omv-dedup-head > div{ min-width: 0; display: grid; gap: 3px; }
.omv-dedup-head strong{ color: var(--omv-muted); font-size: 11px; font-weight: 500; }
.omv-dedup-head span{ color: var(--omv-faint); font-size: 10.5px; }
.omv-dedup-list{ margin: 0; padding: 3px 0; list-style: none; border-top: 1px solid var(--omv-line); }
.omv-dedup-list li { min-height: 58px; padding: 8px 14px; border-bottom: 1px solid var(--omv-line); display: flex; align-items: center; justify-content: space-between; gap: 10px; transition: background-color .12s ease; }
.omv-dedup-list li:hover { background: var(--omv-hover); }
.omv-dedup-list li:last-child{ border-bottom: 0; }
.omv-dedup-list li > div:first-child { min-width: 0; display: grid; gap: 2px; }
.omv-dedup-list strong { color: var(--omv-muted); font-size: 11px; font-weight: 500; }
.omv-dedup-list span { color: var(--omv-faint); font-size: 10px; }
.omv-dedup-list code { color: var(--omv-faint); font: 9.5px/1.4 ui-monospace, monospace; }
.omv-dedup-actions { flex: none; display: flex; align-items: center; gap: 5px; }
.omv-dedup-sources { margin: 4px 14px 10px; padding: 10px 11px; border: 1px solid var(--omv-line); border-radius: 9px; background: var(--omv-surface); }
.omv-dedup-sources[data-complete] { background: var(--omv-surface); }
.omv-dedup-sources-head { display: grid; gap: 2px; margin-bottom: 7px; }
.omv-dedup-sources-head span { color: var(--omv-muted); font-size: 11px; font-weight: 600; }
.omv-dedup-sources-head b { color: var(--omv-muted); font-size: 10.5px; font-weight: 600; }
.omv-dedup-sources[data-complete] .omv-dedup-sources-head b { color: var(--omv-green); }
.omv-dedup-sources-head small { color: var(--omv-faint); font-size: 10px; }
.omv-dedup-sources ul { margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
.omv-dedup-sources li { min-height: 30px; padding: 3px 7px; border: 1px solid var(--omv-line); border-radius: 6px; background: var(--omv-surface); display: flex; align-items: center; gap: 6px; }
.omv-dedup-source-logo { flex: none; width: 20px; height: 20px; border: 1px solid var(--omv-line); border-radius: 5px; background: var(--omv-surface); color: var(--omv-muted); display: grid; place-items: center; }
.omv-dedup-source-mark { display: block; width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.65; stroke-linecap: round; stroke-linejoin: round; }
.omv-dedup-source-logo[data-searched] { border-color: color-mix(in srgb, var(--omv-green) 42%, var(--omv-line)); }
.omv-dedup-source-logo[data-source='nvd_searched'] { color: #647484; }
.omv-dedup-source-logo[data-source='ghsa_searched'] { color: #5b6470; }
.omv-dedup-source-logo[data-source='ecosystem_db_searched'] { color: #496c72; }
.omv-dedup-source-logo[data-source='issues_searched'] { color: #596c91; }
.omv-dedup-source-logo[data-source='commits_searched'] { color: #715f82; }
.omv-dedup-source-logo[data-source='blogs_searched'] { color: #547a77; }
.omv-dedup-sources li[data-group='discussion']:not([data-searched]) { border-color: var(--omv-line); }
.omv-dedup-sources li span { overflow: hidden; color: var(--omv-muted); font-size: 10.5px; text-overflow: ellipsis; white-space: nowrap; }
.omv-dedup-sources li em { margin-left: auto; color: var(--omv-faint); font-size: 9px; font-style: normal; }
.omv-dedup-sources li[data-searched] em { color: var(--omv-green); }
.omv-dedup-cve { margin-top: 7px; color: var(--omv-faint); font-size: 10px; display: flex; align-items: center; gap: 5px; }
.omv-dedup-cve code { color: var(--omv-muted); font: 10px/1.4 ui-monospace, monospace; }
.omv-dedup-cve b { color: var(--omv-red); font-size: 10px; }
.omv-next-chip { margin-top: 8px; padding: 7px 10px; border: 1px solid color-mix(in srgb, var(--omv-blue) 35%, var(--omv-line)); border-radius: 8px; background: color-mix(in srgb, var(--omv-blue) 7%, var(--omv-surface)); box-shadow: var(--omv-shadow-xs); display: flex; align-items: baseline; gap: 7px; }
.omv-next-chip span { flex: none; color: var(--omv-blue); font-size: 10px; font-weight: 600; }
.omv-next-chip code { color: var(--omv-muted); font: 10.5px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; }
.omv-field-error { margin-top: 3px; color: var(--omv-red); font-size: 10.5px; }
.omv-flow { display: grid; gap: 0; border: 1px solid var(--omv-line); border-radius: 10px; overflow: hidden; background: color-mix(in srgb, var(--omv-bg) 55%, var(--omv-surface)); }
.omv-flow-toolbar { min-height: 38px; padding: 4px 8px 4px 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px; border-bottom: 1px solid var(--omv-line); background: var(--omv-surface); }
.omv-flow-legend { display: flex; align-items: center; gap: 10px; color: var(--omv-faint); font-size: 10px; }
.omv-flow-legend { min-width: 0; flex-wrap: wrap; }
.omv-flow-legend span { display: flex; align-items: center; gap: 4px; }
.omv-flow-legend i { width: 8px; height: 8px; border-radius: 3px; }
.omv-flow-legend .omv-flow-legend-dash { width: 18px; height: 0; border-top: 2px dashed var(--omv-faint); border-radius: 0; }
.omv-flow-zoom { flex: none; display: flex; gap: 4px; }
.omv-flow-control { min-width: 26px; height: 25px; padding: 0 7px; border-radius: 6px; font-size: 11px; }
.omv-flow-control.omv-flow-mode { min-width: 0; color: var(--omv-faint); font-size: 10px; }
.omv-flow-control.omv-flow-mode[aria-pressed='true'] { background: color-mix(in srgb, var(--omv-blue) 8%, transparent); color: var(--omv-blue); }
.omv-flow-mode small { margin-left: 2px; color: var(--omv-faint); font-size: 9px; }
.omv-flow-canvas { position: relative; height: 320px; overflow: hidden; cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none; }
.omv-flow-canvas:active { cursor: grabbing; }
.omv-flow-canvas svg { display: block; width: 100%; height: 100%; }
.omv-flow-edge { opacity: .8; }
.omv-flow-node { cursor: pointer; }
.omv-flow-node rect:first-of-type { fill: var(--omv-surface); stroke: var(--omv-line); stroke-width: 1; }
.omv-flow-node:hover rect:first-of-type { stroke: color-mix(in srgb, var(--omv-blue) 55%, var(--omv-line)); }
.omv-flow-node.selected rect:first-of-type { stroke: var(--omv-blue); stroke-width: 1.8; }
.omv-flow-node[data-state='unknown'] rect:first-of-type { stroke-dasharray: 5 4; fill: color-mix(in srgb, var(--omv-surface) 88%, var(--omv-bg)); }
.omv-flow-node[data-state='verified'] rect:first-of-type { stroke: color-mix(in srgb, var(--omv-green) 45%, var(--omv-line)); }
.omv-flow-node[data-kind='finding'] rect:first-of-type { stroke-width: 1.6; }
.omv-flow-node-kind { fill: var(--omv-muted); font-size: 9.5px; font-weight: 600; letter-spacing: .02em; }
.omv-flow-node-value { fill: var(--omv-text); font-size: 10.5px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.omv-flow-verified-dot { fill: var(--omv-green); }
.omv-flow-file-badge rect { fill: color-mix(in srgb, var(--omv-blue) 14%, var(--omv-surface)); stroke: var(--omv-blue); stroke-width: 1; }
.omv-flow-file-badge path { stroke: var(--omv-blue); stroke-width: 1.1; fill: none; }
.omv-flow-crack { stroke: var(--omv-orange); stroke-width: 1.6; fill: none; stroke-linecap: round; }
.omv-flow-inspector { min-height: 46px; padding: 7px 12px; display: flex; align-items: center; gap: 9px; border-top: 1px solid var(--omv-line); background: var(--omv-surface); }
.omv-flow-inspector-empty { color: var(--omv-faint); font-size: 10.5px; }
.omv-flow-inspector-empty small { margin-left: auto; color: var(--omv-faint); font-size: 9.5px; }
.omv-flow-inspector-kind { flex: none; padding: 2.5px 7px; border-radius: 5px; color: #fff; font-size: 9.5px; font-weight: 600; }
.omv-flow-inspector-copy { min-width: 0; display: grid; gap: 1px; }
.omv-flow-inspector-copy strong { overflow: hidden; color: var(--omv-text); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.omv-flow-inspector-copy span { overflow: hidden; color: var(--omv-muted); font-size: 10px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; text-overflow: ellipsis; white-space: nowrap; }
.omv-flow-inspector-copy small { color: var(--omv-faint); font-size: 9.5px; }
.omv-flow-inspector > button { flex: none; }
.omv-flow-hint { position: absolute; right: 10px; bottom: 54px; padding: 2px 7px; border-radius: 5px; background: color-mix(in srgb, var(--omv-surface) 82%, transparent); color: var(--omv-faint); font-size: 9px; pointer-events: none; }
.omv-flow { position: relative; }
.omv-modal-backdrop { position: absolute; inset: 0; z-index: 10; display: grid; place-items: center; padding: 20px; background: rgba(0, 0, 0, .24); }
.omv-command-palette { width: min(560px, 100%); max-height: min(620px, calc(100% - 20px)); overflow: hidden; border: 1px solid var(--omv-line); border-radius: 10px; background: var(--omv-surface); box-shadow: 0 16px 48px rgba(0, 0, 0, .16); }
.omv-command-palette-head { min-height: 54px; padding: 9px 11px; border-bottom: 1px solid var(--omv-line); display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 7px; color: var(--omv-faint); }
.omv-command-palette-head .omv-input { height: 34px; border: 0; box-shadow: none; background: transparent; }
.omv-command-input { min-width: 0; width: 100%; height: 34px; border: 0; background: transparent; }
.omv-command-input > input { min-width: 0; width: 100%; font-size: 12px; }
.omv-command-palette-head kbd { color: var(--omv-faint); font: 9px/1.2 ui-monospace, monospace; }
.omv-command-palette > ul { max-height: 500px; margin: 0; padding: 5px; overflow: auto; list-style: none; }
.omv-command-palette > ul li { margin: 1px 0; }
.omv-command-palette-item { width: 100%; min-height: 36px; padding: 0 9px; border: 0; border-radius: 6px; background: transparent; color: var(--omv-muted); display: flex; align-items: center; justify-content: space-between; text-align: left; cursor: pointer; font-size: 12px; }
.omv-command-palette-item:hover, .omv-command-palette-item.active { background: var(--omv-hover); color: var(--omv-text); }
.omv-command-palette-item kbd { min-width: 30px; padding: 3px 5px; border: 1px solid var(--omv-line); border-radius: 4px; color: var(--omv-faint); font: 9px/1.2 ui-monospace, monospace; text-align: center; }
.omv-form { padding: 16px; }
.omv-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.omv-field { display: grid; gap: 6px; }
.omv-field-full { grid-column: 1 / -1; }
.omv-field label { color: var(--omv-muted); font-size: 12px; font-weight: 500; }
.omv-form-note { margin: 12px 0 0; padding: 10px; border-radius: 7px; background: var(--omv-bg); color: var(--omv-muted); font-size: 12px; line-height: 1.45; }
.omv-form-actions { justify-content: flex-end; margin-top: 16px; }
.omv-error { padding: 12px; border: 1px solid var(--omv-line); border-radius: 8px; background: var(--dsw-alias-state-error-secondary, #fdecec); color: var(--dsw-alias-state-error-primary, #c94b4b); font-size: 12.5px; }
.omv-error-state { width: min(640px, 100%); margin: 8vh auto 0; padding: 24px; border: 1px solid var(--omv-line); border-radius: 12px; background: var(--omv-surface); box-shadow: 0 10px 32px rgba(0, 0, 0, .05); }
.omv-error-icon { width: 34px; height: 34px; margin-bottom: 14px; border-radius: 9px; background: var(--dsw-alias-state-error-secondary, #fdecec); color: var(--dsw-alias-state-error-primary, #c94b4b); display: grid; place-items: center; }
.omv-error-state .omv-eyebrow { margin-bottom: 5px; color: var(--dsw-alias-state-error-primary, #c94b4b); }
.omv-error-state h2 { margin: 0; color: var(--omv-text); font-size: 19px; line-height: 1.35; font-weight: 650; letter-spacing: -.02em; }
.omv-error-lead { margin: 8px 0 0; color: var(--omv-muted); font-size: 13px; line-height: 1.6; }
.omv-error-paths { margin-top: 16px; padding: 10px 12px; border: 1px solid var(--omv-line); border-radius: 7px; background: var(--omv-bg); display: grid; gap: 8px; }
.omv-error-paths > div { min-width: 0; display: grid; grid-template-columns: 78px minmax(0, 1fr); align-items: baseline; gap: 10px; }
.omv-error-paths span { color: var(--omv-faint); font-size: 11px; }
.omv-error-paths code { min-width: 0; overflow: hidden; color: var(--omv-muted); font: 10.5px/1.4 ui-monospace, monospace; text-overflow: ellipsis; white-space: nowrap; }
.omv-error-actions { margin-top: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.omv-error-details { margin-top: 18px; border-top: 1px solid var(--omv-line); padding-top: 11px; color: var(--omv-faint); font-size: 11px; }
.omv-error-details summary { cursor: pointer; color: var(--omv-muted); }
.omv-error-details pre { max-height: 130px; margin: 8px 0 0; padding: 9px; overflow: auto; border-radius: 6px; background: var(--omv-bg); color: var(--omv-faint); font: 10.5px/1.5 ui-monospace, monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
.omv-loading { min-height: 360px; display: grid; place-items: center; color: var(--omv-faint); font-size: 12px; }
.omv-settings { width: 100%; max-width: 680px; padding: 4px 2px 24px; }
.omv-settings-title { display: flex; align-items: center; gap: 12px; margin: 2px 0 22px; }
.omv-settings-title > svg { color: var(--omv-blue); }
.omv-settings-title h2 { margin: 0; color: var(--omv-text); font: var(--dsw-font-l-strong-18, 600 18px/1.3 sans-serif); }
.omv-settings-title p { margin: 3px 0 0; color: var(--omv-faint); font: var(--dsw-font-xxs-12, 12px/1.4 sans-serif); }
 .omv-settings-card { overflow: hidden; border: 1px solid var(--omv-line); border-radius: var(--omv-radius-md); background: var(--omv-surface); }
.omv-settings-row { min-height: 48px; padding: 0 14px; border-bottom: 1px solid var(--omv-line); display: grid; grid-template-columns: 124px minmax(0, 1fr); align-items: center; gap: 16px; }
.omv-settings-row:last-child { border-bottom: 0; }
.omv-settings-row > span { color: var(--omv-muted); font-size: 12.5px; }
.omv-settings-row > b { color: var(--omv-text); font-size: 12.5px; font-weight: 500; text-align: right; }
.omv-settings-row > code { min-width: 0; overflow: hidden; color: var(--omv-faint); font: 11.5px/1.4 ui-monospace, monospace; text-align: right; text-overflow: ellipsis; white-space: nowrap; }
.omv-settings-select { min-width: 132px; height: 30px; padding: 0 8px; border: 1px solid var(--omv-line); border-radius: 6px; background: var(--omv-surface); color: var(--omv-text); font: inherit; justify-self: end; }
.omv-settings-select:focus { outline: 0; border-color: var(--omv-blue); box-shadow: 0 0 0 2px color-mix(in srgb, var(--omv-blue) 14%, transparent); }
.omv-settings-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }
.omv-settings-help { margin: 20px 0 0; color: var(--omv-faint); font-size: 12px; line-height: 1.6; }

@media (prefers-reduced-motion: reduce) {
  .omv-native-view *, .omv-native-view *::before, .omv-native-view *::after,
  .omv-settings *, .omv-settings *::before, .omv-settings *::after {
    animation-duration: .01ms !important; animation-iteration-count: 1 !important;
    transition-duration: .01ms !important; scroll-behavior: auto !important;
  }
}

@media (max-width: 900px) {
  .omv-workspace-path { display: none; }
  .omv-sync-meta { max-width: 86px; }
  .omv-content { padding: 22px 18px 32px; }
  .omv-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .omv-campaigns { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 620px) {
  .omv-native-toolbar { padding: 0 6px; gap: 6px; }
  .omv-nav { flex: 1; }
  .omv-nav-button { min-width: 0; flex: 1; padding: 0 5px; font-size: 12.5px; }
  .omv-nav-count { display: none; }
  .omv-live, .omv-sync-meta { display: none; }
  .omv-palette-button span, .omv-palette-button kbd { display: none; }
  .omv-palette-button { width: 28px; padding: 0; justify-content: center; }
  .omv-content { padding: 18px 12px 26px; }
  .omv-hero { align-items: flex-start; flex-direction: column; }
  .omv-hero h2 { font-size: 20px; }
  .omv-metrics { grid-template-columns: 1fr 1fr; }
  .omv-queue-row { grid-template-columns: 1fr 78px 16px; }
  .omv-next { display: none; }
  .omv-campaigns { grid-template-columns: 1fr; }
  .omv-list-head { grid-template-columns: minmax(0, 1.6fr) 104px minmax(0, .9fr); }
  .omv-list-head > span:nth-child(3), .omv-list-head > span:nth-child(5) { display: none; }
  .omv-finding-row { grid-template-columns: minmax(0, 1.6fr) 104px minmax(0, .9fr); }
  .omv-finding-row > code.omv-cell-mono { display: none; }
  .omv-form-grid { grid-template-columns: 1fr; }
  .omv-field-full { grid-column: auto; }
  .omv-chain { grid-template-columns: 1fr; gap: 7px; }
  .omv-chain-arrow { transform: rotate(90deg); }
  .omv-surface-lists { grid-template-columns: 1fr; }
  .omv-detail-summary { grid-template-columns: 82px 1fr; }
  .omv-error-state { margin-top: 3vh; padding: 18px; }
  .omv-error-paths > div { grid-template-columns: 1fr; gap: 2px; }
  .omv-dedup-list li { align-items: flex-start; flex-direction: column; }
  .omv-dedup-actions { align-self: flex-end; }
}

/* ------------------------------------------------------------------------
 * DSH-native visual refresh
 *
 * The workbench intentionally stays quiet and information-dense, but gains
 * stronger rhythm, hierarchy and focus states. All colors still resolve
 * through DSH aliases so the surface follows the host theme.
 * ---------------------------------------------------------------------- */
.wSkVaW_viewArea:has(.omv-native-view) {
  min-height: 0 !important;
  height: 100% !important;
  flex: 1 1 0% !important;
  overflow: hidden !important;
}
.omv-native-view {
  --omv-bg: var(--dsw-alias-bg-layer-1, #f7f7f8);
  --omv-surface: var(--dsw-alias-bg-layer-2, #fff);
  --omv-line: var(--dsw-alias-border-l2, #e5e6e8);
  --omv-hover: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, .045));
  flex: 1 1 0%;
  height: auto;
  max-height: 100%;
  min-height: 0;
  isolation: isolate;
}
.omv-native-toolbar {
  position: sticky;
  top: 0;
  z-index: 4;
  min-height: 48px;
  padding: 0 14px;
  gap: 12px;
  background: var(--omv-bg);
  box-shadow: 0 1px 0 var(--omv-line);
  backdrop-filter: none;
}
.omv-nav {
  gap: 2px; padding: 4px; border-radius: 999px;
  background: color-mix(in srgb, var(--omv-line) 45%, var(--omv-bg));
}
.omv-nav-button {
  min-width: 66px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  flex: 0 0 auto;
  color: var(--omv-faint);
  font-size: 12px;
  font-weight: 500;
  transition: color .15s ease, background-color .15s ease, box-shadow .15s ease;
}
.omv-nav-button span { white-space: nowrap; }
.omv-nav-button svg { opacity: .72; }
.omv-nav-button:hover { color: var(--omv-text); background: var(--omv-hover); }
.omv-nav-button[data-active='true'] {
  color: var(--omv-text);
  background: var(--omv-surface);
  font-weight: 650;
  box-shadow: var(--omv-shadow-xs);
}
.omv-nav-button[data-active='true'] svg { opacity: 1; color: var(--omv-blue); }
.omv-nav-button[data-active='true']::after { content: none; }
.omv-nav-count {
  min-width: 19px; height: 19px; border-radius: 999px;
  background: color-mix(in srgb, var(--omv-blue) 14%, transparent); color: var(--omv-blue);
  border: none;
}
.omv-nav-button[data-active='true'] .omv-nav-count {
  background: color-mix(in srgb, var(--omv-blue) 18%, transparent); color: var(--omv-blue);
}
.omv-live { padding: 5px 8px; border: 1px solid var(--omv-line); border-radius: 999px; background: var(--omv-surface); }
.omv-live[data-state='live'] > i { box-shadow: none; }
.omv-palette-button { height: 32px; padding: 0 9px; border-radius: 7px; background: var(--omv-surface); box-shadow: none; }
.omv-icon-button { border-radius: var(--omv-radius-sm); background: transparent; }
.omv-content {
  min-height: 0;
  background: var(--omv-bg);
  padding: 28px 34px calc(var(--dsh-composer-height, 152px) + 34px);
}
.omv-content-inner { width: min(1160px, 100%); }
.omv-hero {
  position: relative;
  min-height: 92px;
  margin-bottom: 20px;
  padding: 21px 23px;
  border: 1px solid var(--omv-line);
  border-top: 2px solid var(--omv-blue);
  border-radius: var(--omv-radius-lg);
  background: var(--omv-surface);
  box-shadow: var(--omv-shadow-xs);
}
.omv-eyebrow { margin-bottom: 7px; color: var(--omv-blue); font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.omv-hero h2 { font-size: 25px; letter-spacing: -.035em; }
.omv-hero p:not(.omv-eyebrow) { max-width: 690px; margin-top: 8px; color: var(--omv-muted); font-size: 13px; }
.omv-hero-actions { align-self: center; }
.omv-hero-status { padding: 7px 10px; border: 1px solid var(--omv-line); border-radius: 999px; background: var(--omv-surface); color: var(--omv-muted); font-size: 11px; box-shadow: none; }
.omv-hero-status > i { width: 7px; height: 7px; box-shadow: none; }
.omv-metrics { gap: 16px; margin-bottom: 16px; }
.omv-metric {
  position: relative;
  min-height: 108px;
  padding: 17px 18px 15px;
  overflow: hidden;
  border-radius: var(--omv-radius-md);
  box-shadow: var(--omv-shadow-xs);
  transition: box-shadow .16s ease, transform .16s ease, border-color .16s ease;
}
.omv-metric:hover {
  box-shadow: var(--omv-shadow-sm); transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--omv-line) 55%, var(--metric-color, var(--omv-blue)));
}
.omv-metric::before { display: none; }
.omv-metric-head { font-size: 11.5px; }
.omv-metric-icon {
  width: 32px; height: 32px; border-radius: var(--omv-radius-sm);
  background: color-mix(in srgb, var(--metric-color, var(--omv-blue)) 12%, transparent);
}
.omv-metric strong { margin-top: 12px; font-size: 30px; font-variant-numeric: tabular-nums; }
.omv-metric-foot { margin-top: 10px; font-size: 12px; }
.omv-panel, .omv-list-wrap, .omv-campaign { border-radius: var(--omv-radius-md); box-shadow: var(--omv-shadow-xs); }
.omv-panel-head { min-height: 54px; padding: 0 18px; }
.omv-panel-head h3 { font-size: 12.5px; letter-spacing: -.01em; }
.omv-panel-head p { margin-top: 3px; font-size: 11px; }
.omv-queue-row { min-height: 62px; padding: 9px 17px; transition: background-color .12s ease; }
 .omv-queue-row:hover { background: color-mix(in srgb, var(--omv-blue) 5%, var(--omv-surface)); }
.omv-finding-name strong { font-size: 12.5px; }
.omv-finding-name span { margin-top: 3px; font-size: 11px; }
.omv-status { padding: 4px 9px; border-radius: 999px; font-size: 10.5px; font-weight: 600; letter-spacing: .01em; border: 1px solid color-mix(in srgb, var(--status) 22%, transparent); }
.omv-toolbar { margin-bottom: 12px; }
.omv-input, .omv-select { border-radius: 9px; box-shadow: inset 0 1px 1px rgba(18, 24, 40, .025); }
 .omv-list-head { height: 42px; padding: 0 20px; background: color-mix(in srgb, var(--omv-bg) 75%, var(--omv-surface)); }
 .omv-finding-row { padding: 12px 20px; }
 .omv-finding-row strong, .omv-campaign-summary strong { font-variant-numeric: tabular-nums; }
.omv-campaigns { gap: 12px; }
  .omv-campaign { position: relative; padding: 18px; overflow: hidden; border-radius: var(--omv-radius-md); transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease; }
  .omv-campaign::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--status-line, var(--omv-blue)); opacity: .75; }
  .omv-campaign[data-status='completed']::before, .omv-campaign[data-status='disclosed']::before, .omv-campaign[data-status='active']::before { --status-line: var(--omv-green); }
  .omv-campaign[data-status='blocked']::before, .omv-campaign[data-status='failed']::before { --status-line: var(--omv-red); }
  .omv-campaign[data-status='paused']::before, .omv-campaign[data-status='pending']::before, .omv-campaign[data-status='queued']::before { --status-line: var(--omv-orange); }
  .omv-campaign:hover { box-shadow: var(--omv-shadow-md); transform: translateY(-2px); border-color: color-mix(in srgb, var(--omv-line) 40%, var(--omv-blue)); }
  .omv-campaign-icon { width: 32px; height: 32px; border-radius: 10px; background: color-mix(in srgb, var(--omv-blue) 12%, transparent); color: var(--omv-blue); }
.omv-campaign h3 { margin-top: 15px; font-size: 14px; }
.omv-repro-card{ padding: 15px 17px; }
.omv-repro-card:hover{ background: var(--omv-hover); }
.omv-section { margin-top: 14px; border-radius: var(--omv-radius-md); box-shadow: var(--omv-shadow-xs); }
.omv-section-title { min-height: 44px; padding: 0 16px; background: color-mix(in srgb, var(--omv-bg) 45%, var(--omv-surface)); }
.omv-section-title h3 { font-size: 12.5px; }
.omv-chain-card, .omv-maturity-hero { border-radius: var(--omv-radius-sm); }
.omv-modal-backdrop { background: rgba(15, 20, 32, .20); backdrop-filter: none; }
.omv-command-palette { border-radius: var(--omv-radius-lg); box-shadow: var(--omv-shadow-lg); }
.omv-command-palette-head { min-height: 60px; padding: 11px 13px; }
.omv-command-palette-item { min-height: 40px; border-radius: var(--omv-radius-sm); }
.omv-command-palette-item:hover, .omv-command-palette-item.active { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--omv-blue) 22%, transparent); }
.omv-loading { min-height: 300px; }
.omv-native-view *, .omv-settings * { scrollbar-color: var(--omv-line) transparent; }
.omv-native-view *::-webkit-scrollbar, .omv-settings *::-webkit-scrollbar { width: 8px; height: 8px; }
.omv-native-view *::-webkit-scrollbar-track, .omv-settings *::-webkit-scrollbar-track { background: transparent; }
.omv-native-view *::-webkit-scrollbar-thumb, .omv-settings *::-webkit-scrollbar-thumb { background: var(--omv-line); border-radius: 999px; }
.omv-native-view *::-webkit-scrollbar-thumb:hover, .omv-settings *::-webkit-scrollbar-thumb:hover { background: color-mix(in srgb, var(--omv-muted) 55%, var(--omv-line)); }
.omv-empty svg {
  box-sizing: content-box; width: 22px; height: 22px; padding: 10px; border-radius: 13px;
  background: color-mix(in srgb, var(--omv-blue) 9%, transparent); opacity: 1;
}

@media (max-width: 900px) {
  .omv-content { padding: 22px 20px calc(var(--dsh-composer-height, 152px) + 28px); }
  .omv-hero { padding: 18px 19px; }
}
@media (max-width: 620px) {
  .omv-native-toolbar { min-height: 44px; padding: 0 7px; }
  .omv-nav-button { min-width: 42px; padding: 0 7px; flex: 0 0 auto; }
  .omv-nav-button svg { display: none; }
  .omv-content { padding: 16px 12px calc(var(--dsh-composer-height, 152px) + 22px); }
  .omv-hero { min-height: 0; padding: 17px; border-radius: 12px; }
  .omv-hero::after { opacity: .2; }
  .omv-hero h2 { font-size: 21px; }
  .omv-metric { min-height: 100px; padding: 15px; }
  .omv-detail-backdrop { padding: 0; align-items: stretch; }
  .omv-detail { width: 100%; max-height: none; border-radius: 0; border: 0; }
  .omv-detail-head { border-radius: 0; }
  .omv-detail-body { padding: 16px; }
  .omv-surface-lists { grid-template-columns: 1fr; }
}
.omv-hint-line { margin: -6px 0 10px; color: var(--omv-orange); font-size: 10.5px; }
.omv-war { position: relative; display: grid; border: 1px solid var(--omv-line); border-radius: 10px; overflow: hidden; background: color-mix(in srgb, var(--omv-bg) 55%, var(--omv-surface)); }
.omv-war-toolbar { min-height: 32px; padding: 0 8px 0 12px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--omv-line); background: var(--omv-surface); }
.omv-war-canvas { position: relative; height: 300px; overflow: hidden; cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none; }
.omv-war-canvas:active { cursor: grabbing; }
.omv-war-canvas svg { display: block; width: 100%; height: 100%; }
.omv-war-seed rect { fill: var(--omv-surface); stroke: color-mix(in srgb, var(--omv-blue) 46%, var(--omv-line)); stroke-width: 1.2; }
.omv-war-seed-kicker { fill: var(--omv-blue); font-size: 9px; font-weight: 600; letter-spacing: .04em; }
.omv-war-seed-title { fill: var(--omv-text); font-size: 12.5px; font-weight: 700; }
.omv-war-seed-meta { fill: var(--omv-faint); font-size: 9.5px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.omv-war-lane { cursor: pointer; }
.omv-war-lane rect:first-of-type { fill: var(--omv-surface); stroke: var(--omv-line); stroke-width: 1; }
.omv-war-lane:hover rect:first-of-type { stroke: color-mix(in srgb, var(--omv-blue) 55%, var(--omv-line)); }
.omv-war-lane.selected rect:first-of-type { stroke: var(--omv-blue); stroke-width: 1.6; filter: drop-shadow(0 1px 4px color-mix(in srgb, var(--omv-blue) 26%, transparent)); }
.omv-war-lane[data-status='completed'] rect:first-of-type { stroke: color-mix(in srgb, var(--omv-green) 42%, var(--omv-line)); }
.omv-war-lane[data-status='failed'] rect:first-of-type, .omv-war-lane[data-status='blocked'] rect:first-of-type { stroke: color-mix(in srgb, var(--omv-red) 45%, var(--omv-line)); }
.omv-war-lane-index { fill: var(--omv-faint); font-size: 9px; font-weight: 600; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.omv-war-lane-status { font-size: 9px; font-weight: 700; }
.omv-war-lane-title { fill: var(--omv-text); font-size: 11px; font-weight: 600; }
.omv-war-lane-meta { fill: var(--omv-muted); font-size: 9.5px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.omv-war-note-dot { fill: var(--omv-orange); }
.omv-war-pulse { fill: none; stroke: var(--omv-blue); stroke-width: 1.4; opacity: .55; animation: omv-war-pulse 1.6s ease-in-out infinite; }
@keyframes omv-war-pulse { 0%, 100% { opacity: .18; } 50% { opacity: .6; } }
@media (prefers-reduced-motion: reduce) { .omv-war-pulse { animation: none; opacity: .35; } }
.omv-war-inspector-actions { margin-left: auto; display: flex; gap: 5px; }
.omv-war-inspector-actions > button { flex: none; }

/* DSH Harness native pass: quiet chrome, compact rhythm, and clear state color. */
.omv-native-view {
  --omv-radius-sm: 6px;
  --omv-radius-md: 7px;
  --omv-radius-lg: 8px;
  --omv-shadow-xs: none;
  --omv-shadow-sm: 0 2px 8px rgba(18, 24, 40, .06);
  --omv-shadow-md: 0 4px 14px rgba(18, 24, 40, .08);
  background: var(--omv-bg);
}
.omv-native-toolbar {
  position: relative;
  min-height: 42px;
  height: 42px;
  padding: 0 10px;
  gap: 9px;
  border-bottom: 1px solid var(--omv-line);
  box-shadow: none;
}
.omv-nav {
  align-self: stretch;
  gap: 0;
  padding: 0;
  border-radius: 0;
  background: transparent;
}
.omv-nav-button {
  min-width: 56px;
  height: 42px;
  padding: 0 10px;
  border-radius: 0;
  color: var(--omv-muted);
  font-size: 12px;
  font-weight: 400;
}
.omv-nav-button:hover { background: var(--omv-hover); }
.omv-nav-button[data-active='true'] {
  color: var(--omv-text);
  background: transparent;
  font-weight: 600;
  box-shadow: none;
}
.omv-nav-button[data-active='true']::after {
  content: '';
  right: 10px;
  bottom: -1px;
  left: 10px;
  height: 2px;
  border-radius: 0;
  background: var(--omv-blue);
}
.omv-nav-button[data-active='true'] svg { color: var(--omv-blue); }
.omv-nav-count {
  min-width: 17px;
  height: 17px;
  border-radius: 4px;
  background: var(--omv-hover);
  color: var(--omv-muted);
  font-size: 10px;
}
.omv-nav-button[data-active='true'] .omv-nav-count {
  background: color-mix(in srgb, var(--omv-blue) 12%, transparent);
  color: var(--omv-blue);
}
.omv-live {
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
}
.omv-palette-button {
  height: 28px;
  border-radius: 5px;
  background: transparent;
  box-shadow: none;
}
.omv-palette-button:hover { background: var(--omv-hover); }
.omv-icon-button { border-radius: 5px; }
.omv-content {
  padding: 24px 28px calc(var(--dsh-composer-height, 152px) + 28px);
}
.omv-content-inner { width: min(1120px, 100%); }
.omv-hero {
  min-height: 0;
  margin-bottom: 18px;
  padding: 0 0 16px;
  border: 0;
  border-bottom: 1px solid var(--omv-line);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}
.omv-eyebrow {
  margin-bottom: 5px;
  color: var(--omv-faint);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .06em;
}
.omv-hero h2 { font-size: 22px; letter-spacing: -.02em; }
.omv-hero p:not(.omv-eyebrow) { margin-top: 6px; font-size: 12.5px; }
.omv-metrics { gap: 10px; margin-bottom: 12px; }
.omv-metric {
  min-height: 92px;
  padding: 14px 15px 12px;
  border-radius: 6px;
  box-shadow: none;
}
.omv-metric:hover { box-shadow: none; transform: none; }
.omv-metric strong { margin-top: 10px; font-size: 26px; }
.omv-metric-foot { margin-top: 8px; font-size: 11px; }
.omv-metric-icon { width: 28px; height: 28px; border-radius: 5px; }
.omv-panel, .omv-list-wrap, .omv-campaign {
  border-radius: 7px;
  box-shadow: none;
}
.omv-panel-head { min-height: 48px; padding: 0 15px; }
.omv-panel-head h3 { font-size: 12px; }
.omv-panel-head p { font-size: 11px; }
.omv-status { padding: 3px 7px; border-radius: 4px; font-size: 10px; }
.omv-toolbar { margin-bottom: 10px; }
.omv-input, .omv-select { border-radius: 5px; box-shadow: none; }
.omv-list-head { height: 38px; padding: 0 15px; }
.omv-finding-row { padding: 10px 15px; }
.omv-campaign { padding: 15px; }
.omv-campaign:hover { box-shadow: none; transform: none; }
.omv-section { margin-top: 12px; border-radius: 7px; box-shadow: none; }
.omv-command-palette { border-radius: 7px; box-shadow: 0 12px 32px rgba(0, 0, 0, .14); }
.omv-command-palette-item { border-radius: 5px; }
.omv-empty svg { border-radius: 6px; }

@media (max-width: 900px) {
  .omv-content { padding: 20px 18px calc(var(--dsh-composer-height, 152px) + 24px); }
}
@media (max-width: 620px) {
  .omv-native-toolbar { min-height: 42px; height: 42px; padding: 0 5px; gap: 4px; }
  .omv-nav { min-width: 0; overflow-x: auto; }
  .omv-nav-button { min-width: 50px; height: 42px; padding: 0 7px; }
  .omv-nav-button svg { display: none; }
  .omv-content { padding: 16px 12px calc(var(--dsh-composer-height, 152px) + 20px); }
.omv-hero { padding-bottom: 13px; }
  .omv-hero h2 { font-size: 20px; }
}

/* Findings page: compact ledger layout. */
.omv-findings-page { min-width: 0; }
.omv-findings-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 0 0 12px;
  border: 1px solid var(--omv-line);
  border-radius: 7px;
  background: var(--omv-surface);
  overflow: hidden;
}
.omv-findings-summary > div {
  min-width: 0;
  min-height: 58px;
  padding: 10px 14px;
  border-right: 1px solid var(--omv-line);
  display: grid;
  align-content: center;
  gap: 2px;
}
.omv-findings-summary > div:last-child { border-right: 0; }
.omv-findings-summary strong { color: var(--omv-text); font-size: 18px; line-height: 1; font-weight: 650; font-variant-numeric: tabular-nums; }
.omv-findings-summary span { color: var(--omv-faint); font-size: 10.5px; }
.omv-findings-page .omv-toolbar { margin-bottom: 10px; }
.omv-findings-page .omv-search .omv-input { border-radius: 6px; }
.omv-findings-page .omv-list-wrap { border-radius: 7px; }
.omv-findings-page .omv-list-head,
.omv-findings-page .omv-finding-row { grid-template-columns: minmax(260px, 1.9fr) 100px 84px minmax(140px, 1fr) minmax(180px, 1.2fr); gap: 12px; }
.omv-findings-page .omv-list-head { height: 38px; padding: 0 14px; background: var(--omv-bg); font-size: 10px; letter-spacing: .03em; }
.omv-findings-page .omv-finding-row { min-height: 66px; padding: 9px 14px; }
.omv-findings-page .omv-finding-name { gap: 9px; }
.omv-findings-page .omv-eco-avatar[data-size='lg'] { width: 30px; height: 30px; border-radius: 7px; background: var(--eco-bg); font-size: 11px; }
.omv-findings-page .omv-finding-name strong { font-size: 12px; font-weight: 600; }
.omv-findings-page .omv-finding-name span { margin-top: 2px; font-size: 10.5px; }
.omv-findings-page .omv-status { padding: 3px 6px; border-radius: 4px; font-size: 10px; }
.omv-findings-page .omv-maturity { font-size: 10.5px; }
.omv-findings-page .omv-cell-mono { font-size: 10.5px; }

/* Finding detail: centered modal with a stable viewport-sized work area. */
.omv-native-view { position: relative; }
.omv-detail-backdrop { position: absolute; inset: 0; z-index: 20; display: grid; place-items: center; padding: 24px; overflow: hidden; background: rgba(18, 22, 30, .42); backdrop-filter: blur(2px); }
.omv-detail { position: absolute; z-index: 21; top: 50%; left: 50%; width: min(980px, calc(100% - 48px)); height: min(760px, calc(100% - 48px)); transform: translate(-50%, -50%); overflow: auto; border: 1px solid var(--omv-line); border-radius: 8px; background: var(--omv-bg); box-shadow: 0 18px 46px rgba(18, 22, 30, .2); animation: none; }
.omv-finding-detail .omv-detail-head { min-height: 64px; padding: 13px 18px; border-radius: 7px 7px 0 0; background: var(--omv-surface); box-shadow: inset 0 -2px 0 color-mix(in srgb, var(--omv-blue) 40%, transparent); backdrop-filter: none; }
.omv-finding-detail .omv-detail-head h2 { font-size: 15px; }
.omv-finding-detail .omv-detail-head p { margin-top: 3px; font-size: 10.5px; }
.omv-finding-detail .omv-detail-body { padding: 16px; background: var(--omv-bg); }
.omv-finding-detail .omv-detail-summary { grid-template-columns: 170px minmax(0, 1fr); gap: 14px; margin-bottom: 12px; }
.omv-finding-detail .omv-maturity-hero { align-self: start; height: 108px; min-height: 108px; box-sizing: border-box; padding: 14px; border: 1px solid var(--omv-line); border-radius: 8px; background: var(--omv-surface); display: flex; align-items: center; gap: 12px; text-align: left; box-shadow: inset 3px 0 0 color-mix(in srgb, var(--maturity) 58%, var(--omv-line)); }
.omv-finding-detail .omv-maturity-hero[data-maturity='verified'] { --maturity: #587766; }
.omv-finding-detail .omv-maturity-hero[data-maturity='supported'] { --maturity: #607b91; }
.omv-finding-detail .omv-maturity-hero[data-maturity='developing'] { --maturity: #9a753c; }
.omv-finding-detail .omv-maturity-hero[data-maturity='contested'] { --maturity: #a45e5e; }
.omv-evidence-status-logo { --logo-size: 54px; position: relative; flex: none; width: var(--logo-size); height: var(--logo-size); color: var(--maturity); }
.omv-evidence-status-logo svg { display: block; width: 100%; height: 100%; overflow: visible; }
.omv-evidence-logo-ring { fill: #f2f4f3; stroke: color-mix(in srgb, var(--maturity) 28%, #fff); stroke-width: 1; }
.omv-evidence-logo-disc { fill: var(--maturity); }
.omv-evidence-logo-shield { fill: var(--omv-surface); opacity: 1; }
.omv-evidence-logo-check { fill: none; stroke: var(--maturity); stroke-width: 3.2; stroke-linecap: round; stroke-linejoin: round; }
.omv-evidence-logo-spark { fill: var(--maturity); opacity: .72; }
.omv-maturity-copy { min-width: 0; display: grid; gap: 3px; }
.omv-finding-detail .omv-maturity-copy small { color: var(--omv-faint); font-size: 9px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; }
.omv-finding-detail .omv-maturity-copy strong { color: var(--omv-text); font-size: 15px; font-weight: 700; }
.omv-finding-detail .omv-maturity-copy span { color: var(--omv-muted); font-size: 10.5px; }
.omv-finding-detail .omv-summary-copy { min-width: 0; padding: 6px 2px; }
.omv-finding-detail .omv-summary-copy h3 { font-size: 15px; }
.omv-finding-detail .omv-summary-copy p { max-width: 680px; font-size: 12px; line-height: 1.55; }
.omv-finding-detail .omv-next-chip { margin-top: 10px; padding: 7px 9px; border-radius: 5px; background: color-mix(in srgb, var(--omv-blue) 6%, var(--omv-surface)); box-shadow: none; }
.omv-finding-detail .omv-detail-actions { margin-top: 10px; }
.omv-finding-detail .omv-section { margin-top: 10px; border: 1px solid var(--omv-line); border-radius: 7px; background: var(--omv-surface); box-shadow: none; }
.omv-finding-detail .omv-section-title { min-height: 40px; padding: 0 13px; background: var(--omv-surface); }
.omv-finding-detail .omv-section-title h3 { font-size: 11.5px; }
.omv-finding-detail .omv-session-link { padding: 11px 13px; }
.omv-finding-detail .omv-workflow-actions { padding: 10px 13px; gap: 6px; }
.omv-finding-detail .omv-assessment-dimensions li { min-height: 48px; padding: 7px 13px; }
.omv-finding-detail .omv-chain { padding: 10px 13px; }
.omv-finding-detail .omv-gate-summary { padding: 9px 13px; }

/* Findings follow the native trace pattern: full-width ledger, half-width inspector,
   and an explicit expand action for deep reading. Keep this block in the watched client bundle. */
main.omv-content-inner:has(.omv-findings-page) { width: 100%; max-width: none; }
.omv-findings-page { width: 100%; }
.omv-native-view:has(.omv-finding-detail) .omv-detail-backdrop { background: transparent; backdrop-filter: none; pointer-events: none; }
.omv-native-view:has(.omv-finding-detail[data-expanded='true']) .omv-detail-backdrop { background: rgba(18, 22, 30, .14); backdrop-filter: none; pointer-events: auto; }
.omv-finding-detail {
  top: 0;
  right: 0;
  bottom: 0;
  left: auto;
  width: min(50%, 720px);
  height: auto;
  max-height: none;
  transform: none;
  border-top: 0;
  border-right: 0;
  border-bottom: 0;
  border-left: 1px solid var(--omv-line);
  border-radius: 0;
  background: var(--omv-surface);
  box-shadow: -10px 0 28px rgba(18, 22, 30, .08);
}
.omv-finding-detail .omv-detail-head { border-radius: 0; }
.omv-finding-detail .omv-detail-body { min-height: 0; }
.omv-finding-detail .omv-detail-expand { margin-left: 2px; }
.omv-finding-detail[data-expanded='true'] {
  top: 50%;
  right: auto;
  bottom: auto;
  left: 50%;
  width: min(92%, 1800px);
  height: min(92%, 1200px);
  transform: translate(-50%, -50%);
  border: 1px solid var(--omv-line);
  border-radius: 8px;
  box-shadow: 0 14px 34px rgba(18, 22, 30, .14);
}
.omv-finding-detail[data-expanded='true'] .omv-detail-head { border-radius: 7px 7px 0 0; }
.omv-finding-detail[data-expanded='true'] .omv-detail-body { padding: 18px 20px 28px; }
.omv-finding-detail[data-expanded='true'] .omv-section { margin-top: 12px; }

@media (max-width: 720px) {
  .omv-findings-summary > div { padding: 9px 10px; }
  .omv-findings-summary strong { font-size: 16px; }
  .omv-findings-summary span { font-size: 9.5px; }
  .omv-findings-page .omv-list-head { display: none; }
  .omv-findings-page .omv-finding-row { grid-template-columns: minmax(0, 1fr) auto; gap: 7px 10px; padding: 11px 13px; }
  .omv-findings-page .omv-finding-row > .omv-finding-name { grid-column: 1 / -1; }
  .omv-findings-page .omv-finding-row > .omv-maturity { justify-self: end; }
  .omv-findings-page .omv-finding-row > .omv-cell-mono { grid-column: 1 / -1; }
  .omv-detail-backdrop { padding: 10px; }
  .omv-finding-detail { width: min(92%, 560px); }
  .omv-finding-detail[data-expanded='true'] { width: calc(100% - 20px); height: calc(100% - 20px); }
  .omv-finding-detail .omv-detail-body { padding: 12px; }
  .omv-finding-detail .omv-detail-summary { grid-template-columns: 1fr; }
  .omv-finding-detail .omv-maturity-hero { height: 82px; min-height: 82px; }
}

/* Overview v2: use the available canvas as an operating surface rather than a
   centered report while keeping the DSH-native visual language. */
.omv-native-view:has(.omv-overview) .omv-content { width: 100%; padding: 20px 24px calc(var(--dsh-composer-height, 152px) + 28px); }
.omv-native-view:has(.omv-overview) .omv-content-inner { width: 100%; max-width: none; margin: 0; }
.omv-overview { width: 100%; max-width: none; margin: 0; }
.omv-overview > .omv-hero {
  min-height: 0; margin: 0 0 14px; padding: 0 0 12px;
  display: grid; grid-template-columns: minmax(0, 600px) max-content; column-gap: 36px; justify-content: start; align-items: end;
  background: transparent; color: var(--omv-text); border-bottom: 1px solid var(--omv-line);
}
.omv-overview > .omv-hero .omv-hero-actions { align-self: end; }
.omv-overview > .omv-hero .omv-eyebrow { color: var(--omv-faint); }
.omv-overview > .omv-hero h2 { color: var(--omv-text); font-size: 25px; letter-spacing: -.035em; }
.omv-overview > .omv-hero p:not(.omv-eyebrow) { color: var(--omv-muted); }
.omv-overview-stats { display: grid; grid-template-columns: repeat(4, minmax(130px, 1fr)) minmax(150px, auto); align-items: stretch; gap: 1px; margin-bottom: 14px; border: 1px solid var(--omv-line); border-radius: 10px; background: var(--omv-line); overflow: hidden; }
.omv-overview-stat { min-height: 76px; padding: 12px 16px; background: var(--omv-surface); border-top: 2px solid var(--stat-color, var(--omv-blue)); }
.omv-overview-stat-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; color: var(--omv-muted); font-size: 11px; }
.omv-overview-stat-head > i { width: 22px; height: 22px; border-radius: 6px; display: grid; place-items: center; color: var(--stat-color, var(--omv-blue)); background: color-mix(in srgb, var(--stat-color, var(--omv-blue)) 10%, transparent); }
.omv-overview-stat-head > i svg { display: block; }
.omv-overview-stat strong { display: block; margin-top: 5px; color: var(--omv-text); font-size: 25px; line-height: 1; font-weight: 700; font-variant-numeric: tabular-nums; }
.omv-overview-stat small { display: block; margin-top: 7px; color: var(--omv-faint); font-size: 10.5px; }
.omv-tone-blue { --stat-color: var(--omv-blue); }.omv-tone-green { --stat-color: var(--omv-green); }.omv-tone-teal { --stat-color: var(--omv-teal); }.omv-tone-red { --stat-color: var(--omv-red); }
.omv-overview-sync { display: flex; align-items: center; justify-content: center; gap: 7px; padding: 12px 16px; background: var(--omv-surface); color: var(--omv-muted); font-size: 11px; white-space: nowrap; }
.omv-overview-sync span:last-child { color: var(--omv-faint); }
.omv-live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--omv-green); box-shadow: 0 0 0 4px color-mix(in srgb, var(--omv-green) 13%, transparent); }
.omv-overview-main { display: grid; grid-template-columns: minmax(0, 1fr) minmax(360px, 420px); gap: 14px; align-items: start; }
.omv-overview-bottom { display: grid; grid-template-columns: minmax(0, 1fr) minmax(320px, 420px); gap: 14px; margin-top: 14px; }
.omv-action-panel { min-height: 0; }
.omv-panel-kicker { margin: 0 0 4px !important; color: var(--omv-blue) !important; font: 600 10px/1.2 var(--dsw-font-sans, sans-serif) !important; letter-spacing: .04em; }
.omv-action-panel .omv-panel-head { min-height: 68px; padding: 10px 18px; }
.omv-action-panel .omv-queue-row { grid-template-columns: minmax(0, 1fr) minmax(250px, .9fr) 92px 20px; min-height: 64px; padding: 9px 18px; }
.omv-queue-action { min-width: 0; }.omv-queue-action > span { display: block; margin-bottom: 3px; color: var(--omv-faint); font-size: 10px; }.omv-queue-action .omv-next { display: block; color: var(--omv-text); font-size: 11.5px; }
.omv-overview-rail { display: grid; gap: 14px; }
.omv-chart-panel .omv-panel-head { min-height: 62px; padding: 10px 17px; }
.omv-chart-total { display: grid; margin-left: auto; color: var(--omv-green); font-size: 23px; line-height: 1; text-align: right; font-variant-numeric: tabular-nums; }.omv-chart-total small { display: block; margin-top: 5px; color: var(--omv-faint); font-size: 10px; font-weight: 400; }
.omv-evidence-bars { display: grid; gap: 13px; padding: 17px; }.omv-evidence-row > div { display: flex; justify-content: space-between; margin-bottom: 5px; color: var(--omv-muted); font-size: 11px; }.omv-evidence-row > div span { display: inline-flex; align-items: center; gap: 5px; }.omv-evidence-row > div span svg { color: var(--omv-faint); }.omv-evidence-row b { color: var(--omv-text); font-weight: 600; }.omv-evidence-row > i { display: block; min-width: 3px; height: 7px; border-radius: 4px; background: var(--omv-blue); }.omv-bar-green { background: var(--omv-green) !important; }.omv-bar-teal { background: var(--omv-teal) !important; }.omv-bar-orange { background: var(--omv-orange) !important; }.omv-bar-muted { background: var(--omv-faint) !important; }.omv-bar-red { background: var(--omv-red) !important; }
.omv-stage-chart { height: 132px; display: flex; align-items: end; gap: 10px; padding: 14px 17px 12px; border-top: 1px solid var(--omv-line); }.omv-stage-col { flex: 1; height: 100%; display: flex; flex-direction: column; justify-content: end; align-items: center; gap: 7px; }.omv-stage-value { width: 100%; min-height: 8px; display: flex; align-items: start; justify-content: center; padding-top: 6px; border-radius: 5px 5px 2px 2px; color: #fff; font-size: 11px; font-weight: 700; font-variant-numeric: tabular-nums; }.omv-stage-col > span { display: inline-flex; align-items: center; gap: 4px; color: var(--omv-faint); font-size: 10px; white-space: nowrap; }.omv-stage-col > span svg { color: currentColor; }.omv-stage-blue { background: var(--omv-blue); }.omv-stage-teal { background: var(--omv-teal); }.omv-stage-orange { background: var(--omv-orange); }.omv-stage-green { background: var(--omv-green); }.omv-stage-purple { background: var(--omv-purple); }

@media (min-width: 1440px) {
  .omv-action-panel .omv-queue-row { grid-template-columns: minmax(340px, 520px) minmax(280px, 600px) 92px 20px; }
}

@media (max-width: 900px) {
  .omv-overview > .omv-hero { grid-template-columns: minmax(0, 1fr) max-content; column-gap: 16px; }
  .omv-overview-main, .omv-overview-bottom { grid-template-columns: 1fr; }
  .omv-overview-stats { grid-template-columns: repeat(4, 1fr); }.omv-overview-sync { grid-column: 1 / -1; justify-content: flex-start; }
}
@media (max-width: 720px) {
  .omv-native-view:has(.omv-overview) .omv-content { width: 100%; padding: 12px 12px calc(var(--dsh-composer-height, 152px) + 20px); }
  .omv-overview > .omv-hero { display: flex; margin: 0 0 12px; padding: 0 0 12px; align-items: flex-start; flex-direction: column; gap: 14px; }
  .omv-overview-stats { grid-template-columns: repeat(2, 1fr); }.omv-overview-sync { grid-column: auto; }.omv-action-panel .omv-queue-row { grid-template-columns: minmax(0, 1fr) auto 16px; }.omv-action-panel .omv-queue-action { grid-column: 1 / -1; grid-row: 2; padding-left: 42px; }.omv-action-panel .omv-queue-row .omv-maturity { grid-column: 2; grid-row: 1; }.omv-stage-chart { gap: 7px; }
}

/* Secondary workbenches: same DSH canvas rhythm as the overview, without turning
   operational data into a centered marketing layout. */
main.omv-content-inner:has(.omv-reproduction-page),
main.omv-content-inner:has(.omv-campaigns-page),
main.omv-content-inner:has(.omv-search-page) {
  width: 100%;
  max-width: none;
}
.omv-reproduction-page,
.omv-campaigns-page,
.omv-search-page {
  width: 100%;
  min-width: 0;
}
.omv-reproduction-page > .omv-hero,
.omv-campaigns-page > .omv-hero,
.omv-search-page > .omv-hero {
  margin-bottom: 14px;
  padding-bottom: 13px;
}
.omv-page-context {
  min-height: 34px;
  margin: -2px 0 12px;
  padding: 0 2px;
  display: flex;
  align-items: center;
  gap: 18px;
  color: var(--omv-faint);
  font-size: 11px;
}
.omv-page-context span { display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; }
.omv-page-context b { color: var(--omv-muted); font-weight: 600; font-variant-numeric: tabular-nums; }
.omv-page-context-warning { color: var(--omv-orange) !important; }
.omv-page-context-warning i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

/* Campaigns are a working index: cards carry hierarchy, while status remains a
   label instead of becoming a decorative card treatment. */
.omv-campaigns-page .omv-campaign-issues { margin-bottom: 12px; }
.omv-campaigns-page .omv-campaigns {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
}
.omv-campaigns-page .omv-campaign {
  min-height: 148px;
  padding: 15px;
  border-radius: 7px;
  transition: background-color .12s ease, border-color .12s ease;
}
.omv-campaigns-page .omv-campaign::before { display: none; }
.omv-campaigns-page .omv-campaign:hover {
  transform: none;
  border-color: color-mix(in srgb, var(--omv-blue) 32%, var(--omv-line));
  background: var(--omv-hover);
}
.omv-campaigns-page .omv-campaign-icon {
  width: 28px;
  height: 28px;
  border: 1px solid var(--omv-line);
  border-radius: 5px;
  background: transparent;
  color: var(--omv-muted);
}
.omv-campaigns-page .omv-campaign h3 { margin-top: 13px; }
.omv-campaigns-page .omv-campaign-foot { margin-top: 13px; }

/* Search keeps the control prominent, but the result list remains a quiet
   ledger with an explicit open affordance. */
.omv-search-toolbar { display: flex; width: 100%; margin-bottom: 12px; }
.omv-search-page .omv-global-search { flex: 1; margin: 0; }
.omv-search-page .omv-global-search .omv-input {
  height: 40px;
  border-radius: 5px;
  padding-left: 38px;
  font-size: 13px;
}
.omv-search-page .omv-global-search > svg { left: 13px; }
.omv-search-page .omv-search-results { border-radius: 7px; }
.omv-search-page .omv-results-meta { min-height: 38px; padding: 0 15px; }
.omv-search-page .omv-search-results > ul { padding: 0; }
.omv-search-page .omv-search-results li {
  min-height: 58px;
  padding: 9px 15px;
  grid-template-columns: 82px minmax(0, 1fr) 16px;
  gap: 11px;
}
.omv-search-page .omv-search-results li:last-child { border-bottom: 0; }
.omv-search-page .omv-search-results li[data-actionable='true']:focus-visible { background: var(--omv-hover); }
.omv-search-page .omv-search-results li > svg { color: var(--omv-faint); }

/* Reproduction is intentionally a full-width queue: command/output are the
   primary reading axis, and the metrics stay compact above it. */
.omv-reproduction-page .omv-repro-metrics { grid-template-columns: repeat(4, minmax(150px, 1fr)); }
.omv-reproduction-page .omv-repro-board { border-radius: 7px; }
.omv-reproduction-page .omv-repro-board > .omv-panel-head { min-height: 52px; }
.omv-reproduction-page .omv-repro-card {
  padding: 13px 15px;
  gap: 6px;
  transition: background-color .12s ease;
}
.omv-reproduction-page .omv-repro-card:hover { background: var(--omv-hover); }

@media (max-width: 900px) {
  .omv-reproduction-page .omv-repro-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .omv-page-context { gap: 12px; overflow-x: auto; }
}
@media (max-width: 620px) {
  .omv-reproduction-page .omv-repro-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .omv-search-page .omv-search-results li { grid-template-columns: 72px minmax(0, 1fr) 16px; }
}

/* Overview v3: align the operating header to the two edges of the canvas,
   then let the queue own the first reading column. */
.omv-overview > .omv-hero {
  grid-template-columns: minmax(0, 1fr) max-content;
  column-gap: 24px;
  justify-content: stretch;
}
.omv-overview > .omv-hero .omv-hero-actions { justify-self: end; }
.omv-overview > .omv-hero h2 { font-size: 23px; letter-spacing: -.025em; }
.omv-overview > .omv-hero p:not(.omv-eyebrow) { max-width: 720px; }
.omv-overview-stats {
  grid-template-columns: repeat(4, minmax(150px, 1fr)) minmax(180px, .75fr);
  border-radius: 7px;
}
.omv-overview-stat {
  min-height: 72px;
  padding: 11px 15px;
  border-top: 0;
}
.omv-overview-stat-head > i {
  width: 20px;
  height: 20px;
  border: 1px solid color-mix(in srgb, var(--stat-color, var(--omv-blue)) 22%, var(--omv-line));
  border-radius: 5px;
  background: transparent;
}
.omv-overview-stat strong { margin-top: 4px; font-size: 24px; }
.omv-overview-stat small { margin-top: 6px; }
.omv-overview-sync { justify-content: flex-start; padding: 11px 15px; }
.omv-live-dot { box-shadow: none; }
.omv-overview-main { grid-template-columns: minmax(0, 1fr) minmax(320px, 380px); gap: 12px; }
.omv-overview-bottom { grid-template-columns: minmax(0, 1fr) minmax(320px, 380px); gap: 12px; margin-top: 12px; }
.omv-action-panel .omv-panel-head { min-height: 64px; padding: 9px 15px; }
.omv-action-panel .omv-queue-row {
  grid-template-columns: minmax(250px, 1.2fr) minmax(220px, 1fr) 92px 16px;
  min-height: 62px;
  padding: 8px 15px;
}
.omv-action-panel .omv-queue-row:hover { background: var(--omv-hover); }
.omv-queue-action .omv-next { font-size: 11px; }
.omv-overview-rail { gap: 12px; }
.omv-chart-panel .omv-panel-head { min-height: 56px; padding: 8px 15px; }
.omv-chart-total { font-size: 21px; }
.omv-evidence-bars { gap: 11px; padding: 14px 15px 15px; }
.omv-stage-chart { height: 122px; padding: 12px 15px 11px; }

@media (max-width: 900px) {
  .omv-overview-stats { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .omv-overview-sync { grid-column: 1 / -1; }
}
@media (max-width: 720px) {
  .omv-overview > .omv-hero { grid-template-columns: 1fr; column-gap: 0; }
  .omv-overview > .omv-hero .omv-hero-actions { justify-self: start; }
  .omv-overview-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .omv-overview-sync { grid-column: auto; }
}

/* Quality is a workspace signal now, not another destination. Keep its
   queues and blockers visible inside the overview's operating flow. */
.omv-overview-quality {
  margin-bottom: 12px;
  overflow: hidden;
  border-radius: 7px;
}
.omv-overview-quality-head {
  min-height: 70px;
  padding: 10px 15px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  align-items: center;
  gap: 18px;
  border-bottom: 1px solid var(--omv-line);
}
.omv-overview-quality-head h3 { font-size: 12px; }
.omv-overview-quality-head > div:first-child > p:last-child { margin-top: 3px; color: var(--omv-faint); font-size: 10.5px; }
.omv-overview-quality-score {
  min-width: 190px;
  display: grid;
  grid-template-columns: auto auto;
  align-items: baseline;
  justify-content: end;
  column-gap: 8px;
  row-gap: 1px;
  text-align: right;
}
.omv-overview-quality-score strong { color: var(--omv-text); font-size: 25px; line-height: 1; font-weight: 700; font-variant-numeric: tabular-nums; }
.omv-overview-quality-score span { color: var(--omv-muted); font-size: 11px; }
.omv-overview-quality-score small { grid-column: 1 / -1; color: var(--omv-faint); font-size: 10px; }
.omv-overview-quality-score[data-state='blocker'] strong { color: var(--omv-red); }
.omv-overview-quality-score[data-state='warning'] strong { color: var(--omv-orange); }
.omv-overview-quality-score[data-state='info'] strong { color: var(--omv-blue); }
.omv-overview-quality-score[data-state='clear'] strong { color: var(--omv-green); }
.omv-overview-quality-queues { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; background: var(--omv-line); }
.omv-overview-quality-queue {
  position: relative;
  min-height: 68px;
  padding: 10px 28px 9px 15px;
  border: 0;
  background: var(--omv-surface);
  color: var(--omv-text);
  display: grid;
  align-content: center;
  gap: 2px;
  text-align: left;
  cursor: pointer;
}
.omv-overview-quality-queue:hover { background: var(--omv-hover); }
.omv-overview-quality-queue > span { color: var(--omv-muted); font-size: 10.5px; }
.omv-overview-quality-queue > strong { font-size: 22px; line-height: 1; font-weight: 650; font-variant-numeric: tabular-nums; }
.omv-overview-quality-queue > small { color: var(--omv-faint); font-size: 10px; }
.omv-overview-quality-queue > svg { position: absolute; top: 50%; right: 11px; transform: translateY(-50%); color: var(--omv-faint); }
.omv-overview-quality-issues { border-top: 1px solid var(--omv-line); }
.omv-overview-quality-issues-head { min-height: 34px; padding: 0 15px; display: flex; align-items: center; gap: 9px; color: var(--omv-muted); font-size: 10.5px; }
.omv-overview-quality-issues-head small { color: var(--omv-faint); }
.omv-overview-quality-issues-head .omv-link-button { margin-left: auto; font-size: 10.5px; }
.omv-overview-quality-issues > ul { margin: 0; padding: 0; list-style: none; }
.omv-overview-quality .omv-quality-issue { min-height: 54px; padding: 7px 15px; grid-template-columns: 26px minmax(0, 1fr) auto; }
.omv-overview-quality .omv-quality-issue:last-child { border-bottom: 0; }
.omv-overview-quality .omv-quality-issue small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.omv-overview-quality-clear { min-height: 48px; padding: 0 15px; display: flex; align-items: center; gap: 7px; color: var(--omv-green); font-size: 11px; }

@media (max-width: 900px) {
  .omv-overview-quality-queues { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 620px) {
  .omv-overview-quality-head { grid-template-columns: 1fr; gap: 10px; }
  .omv-overview-quality-score { min-width: 0; justify-content: start; text-align: left; }
  .omv-overview-quality-score small { grid-column: auto; }
  .omv-overview-quality-queues { grid-template-columns: 1fr 1fr; }
  .omv-overview-quality .omv-quality-issue { grid-template-columns: 26px minmax(0, 1fr); }
  .omv-overview-quality .omv-quality-issue > .omv-status { display: none; }
}

/* Evidence workbench refinement: restrained, dense, and closer to a native
   audit console than a promotional AI dashboard. */
.omv-native-view:has(.omv-finding-detail) {
  --omv-bg: #fff;
  --omv-surface: #fff;
  --omv-line: #deded9;
  --omv-text: #20231f;
  --omv-muted: #68706b;
  --omv-faint: #8a918b;
  --omv-hover: #f0f1ee;
  --omv-blue: #426a9d;
  --omv-green: #54745f;
  --omv-orange: #967344;
  --omv-red: #a45e5e;
  --omv-teal: #4a8082;
  --omv-radius-sm: 6px;
  --omv-radius-md: 8px;
  --omv-radius-lg: 10px;
}
.omv-native-view:has(.omv-finding-detail) .omv-finding-detail .omv-detail-head {
  box-shadow: none;
  border-bottom-color: #d7d8d3;
}
.omv-native-view:has(.omv-finding-detail) .omv-finding-detail .omv-detail-body {
  padding: 14px 16px 24px;
  background: var(--omv-bg);
}
.omv-finding-detail .omv-detail-summary { grid-template-columns: 156px minmax(0, 1fr); gap: 16px; margin-bottom: 10px; }
.omv-finding-detail .omv-maturity-hero {
  height: 86px; min-height: 86px; padding: 10px 12px; gap: 10px; border-radius: 6px;
  box-shadow: inset 2px 0 0 var(--maturity);
}
.omv-finding-detail .omv-evidence-status-logo { --logo-size: 42px; }
.omv-finding-detail .omv-maturity-copy { gap: 1px; }
.omv-finding-detail .omv-maturity-copy strong { font-size: 14px; }
.omv-finding-detail .omv-summary-copy { padding: 3px 0; }
.omv-finding-detail .omv-summary-copy h3 { margin-bottom: 4px; font-size: 14px; }
.omv-finding-detail .omv-summary-copy p { font-size: 11.5px; line-height: 1.45; }
.omv-finding-detail .omv-next-chip {
  margin-top: 7px; padding: 6px 8px; border: 1px solid #d6dbe2; border-left: 2px solid var(--omv-blue);
  border-radius: 4px; background: var(--omv-surface); color: var(--omv-muted);
}
.omv-finding-detail .omv-next-chip span { color: var(--omv-blue); }
.omv-finding-detail .omv-section { margin-top: 8px; border-radius: 6px; background: var(--omv-surface); }
.omv-finding-detail .omv-section-title { min-height: 36px; padding: 0 12px; background: var(--omv-bg); }
.omv-finding-detail .omv-section-title h3 { font-size: 11.5px; }
.omv-finding-detail .omv-section-title span { font-size: 10px; }
.omv-finding-detail .omv-session-link { min-height: 58px; padding: 9px 12px; gap: 10px; }
.omv-finding-detail .omv-session-link-icon { width: 28px; height: 28px; border-radius: 5px; }
.omv-finding-detail .omv-session-link strong { font-size: 11.5px; }
.omv-finding-detail .omv-session-link code { font-size: 10px; }
.omv-finding-detail .omv-workflow-actions { padding: 8px 12px; gap: 5px; }
.omv-finding-detail .omv-workflow-actions button { min-height: 29px; padding: 0 10px; border-radius: 4px; font-size: 10.5px; }
.omv-finding-detail .omv-status { padding: 3px 7px; border-radius: 5px; font-size: 10px; font-weight: 550; }
.omv-finding-detail .omv-status svg { width: 12px; height: 12px; }
.omv-finding-detail .omv-maturity > i,
.omv-finding-detail .omv-assessment-dimensions li > i,
.omv-finding-detail .omv-gate-checks li > i { box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent); }
.omv-finding-detail .omv-dedup-sources li { border-radius: 5px; }
.omv-finding-detail .omv-dedup-sources li span { font-size: 10.5px; }
.omv-finding-detail .omv-assessment-dimensions li { min-height: 44px; padding: 6px 12px; grid-template-columns: 18px minmax(0, 1fr) auto; gap: 8px; }
.omv-finding-detail .omv-assessment-dimensions li > i { width: 18px; height: 18px; border-radius: 4px; }
.omv-finding-detail .omv-assessment-dimensions strong { font-size: 10.5px; }
.omv-finding-detail .omv-assessment-dimensions span { font-size: 10px; }
.omv-finding-detail .omv-assessment-dimensions .omv-status { padding: 2px 5px; border-radius: 3px; font-size: 10px; }
.omv-finding-detail .omv-chain { padding: 8px 12px; }
.omv-finding-detail .omv-chain-card { padding: 9px 10px; border-radius: 5px; background: var(--omv-bg); }
.omv-finding-detail .omv-gate-summary { padding: 8px 12px; font-size: 10.5px; }
.omv-finding-detail .omv-flow { border-radius: 6px; background: #fff; }
.omv-finding-detail .omv-flow-toolbar { min-height: 36px; background: var(--omv-surface); }
.omv-finding-detail .omv-flow-canvas { background: #fff; }
.omv-finding-detail .omv-flow-node rect:first-of-type { rx: 6; }
.omv-finding-detail .omv-flow-edge { opacity: .68; }
.omv-finding-detail .omv-flow-hint { background: transparent; }

/* Campaigns are presented as recoverable audit tasks in the UI. Campaign.v1
   remains the protocol name, while the page foregrounds search and next action. */
.omv-campaigns-page .omv-campaign-index {
  min-height: 58px; margin: 0 0 12px; padding: 9px 14px; border: 1px solid var(--omv-line); border-radius: 7px;
  background: var(--omv-surface); display: flex; align-items: center; justify-content: space-between; gap: 18px;
}
.omv-campaign-index h3 { margin: 0; color: var(--omv-text); font-size: 13px; font-weight: 650; }
.omv-campaign-index span { display: block; margin-top: 2px; color: var(--omv-faint); font-size: 10.5px; }
.omv-campaign-index .omv-panel-kicker { margin-bottom: 3px !important; }
.omv-campaign-search { position: relative; width: min(360px, 42%); display: flex; align-items: center; }
.omv-campaign-search > svg { position: absolute; left: 11px; color: var(--omv-faint); pointer-events: none; }
.omv-campaign-search .omv-input { height: 34px; padding: 0 68px 0 32px; font-size: 11.5px; }
.omv-campaign-search > button { position: absolute; right: 43px; width: 22px; height: 22px; padding: 0; border: 0; border-radius: 4px; background: transparent; color: var(--omv-faint); display: grid; place-items: center; cursor: pointer; }
.omv-campaign-search > button:hover { background: var(--omv-hover); color: var(--omv-text); }
.omv-campaign-search > small { position: absolute; right: 10px; color: var(--omv-faint); font: 10px/1 ui-monospace, monospace; pointer-events: none; }
.omv-campaigns-page .omv-campaigns { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
.omv-campaigns-page .omv-campaign { min-height: 184px; padding: 15px; display: flex; flex-direction: column; border-radius: 7px; }
.omv-campaigns-page .omv-campaign h3 { display: -webkit-box; min-height: 36px; margin: 13px 0 4px; overflow: hidden; font-size: 13.5px; line-height: 1.35; white-space: normal; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.omv-campaigns-page .omv-campaign p { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.omv-campaigns-page .omv-campaign-next { min-width: 0; margin-top: 11px; padding: 7px 9px; border-left: 2px solid var(--omv-blue); background: color-mix(in srgb, var(--omv-blue) 5%, var(--omv-surface)); display: grid; gap: 2px; }
.omv-campaign-next span { color: var(--omv-blue); font-size: 9.5px; }
.omv-campaign-next strong { overflow: hidden; color: var(--omv-muted); font-size: 10.5px; font-weight: 500; text-overflow: ellipsis; white-space: nowrap; }
.omv-campaigns-page .omv-campaign-foot { margin-top: auto; padding-top: 10px; }

@media (max-width: 720px) {
  .omv-campaigns-page .omv-campaign-index { align-items: stretch; flex-direction: column; gap: 10px; }
  .omv-campaign-search { width: 100%; }
  .omv-campaigns-page .omv-campaigns { grid-template-columns: 1fr; }
}

/* DSH workbench pass: pages use the shell's quiet header + dense index rhythm.
   Operational records should read like a workspace list, not a collection of
   generated assistant cards. */
.omv-workbench-header {
  min-height: 58px;
  margin-bottom: 12px;
  padding: 0 0 12px;
  border-bottom: 1px solid var(--omv-line);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
}
.omv-workbench-title { display: flex; align-items: baseline; gap: 9px; }
.omv-workbench-title h2 { margin: 0; color: var(--omv-text); font-size: 20px; line-height: 1.25; font-weight: 600; letter-spacing: -.02em; }
.omv-workbench-title code, .omv-workbench-title span { color: var(--omv-faint); font: 10px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; }
.omv-workbench-header p { margin: 5px 0 0; color: var(--omv-faint); font-size: 11px; line-height: 1.4; }
.omv-workbench-header p b { color: var(--omv-muted); font-weight: 600; font-variant-numeric: tabular-nums; }
.omv-workbench-header .omv-page-context-warning { margin-left: 12px; }

.omv-index-toolbar {
  min-height: 42px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.omv-campaign-search { position: relative; width: min(420px, 100%); display: flex; align-items: center; }
.omv-campaign-search > svg { position: absolute; left: 10px; color: var(--omv-faint); pointer-events: none; }
.omv-campaign-search .omv-input { height: 34px; padding: 0 44px 0 31px; border-radius: 6px; font-size: 11.5px; }
.omv-campaign-search > button { position: absolute; right: 8px; width: 22px; height: 22px; padding: 0; border: 0; border-radius: 4px; background: transparent; color: var(--omv-faint); display: grid; place-items: center; cursor: pointer; }
.omv-campaign-search > button:hover { background: var(--omv-hover); color: var(--omv-text); }
.omv-index-count { margin-left: auto; color: var(--omv-faint); font: 10.5px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; font-variant-numeric: tabular-nums; }

.omv-campaigns-page .omv-campaign-list {
  display: block;
  overflow: hidden;
  border: 1px solid var(--omv-line);
  border-radius: 7px;
  background: var(--omv-surface);
  box-shadow: none;
}
.omv-campaign-list-head,
.omv-campaign-list .omv-campaign {
  display: grid;
  grid-template-columns: minmax(300px, 2.4fr) 108px minmax(190px, 1.25fr) 78px 16px;
  align-items: center;
  gap: 14px;
}
.omv-campaign-list-head {
  min-height: 31px;
  padding: 0 14px;
  border-bottom: 1px solid var(--omv-line);
  background: color-mix(in srgb, var(--omv-bg) 60%, var(--omv-surface));
  color: var(--omv-faint);
  font-size: 10px;
}
.omv-campaign-list .omv-campaign {
  min-height: 66px;
  padding: 9px 14px;
  border: 0;
  border-bottom: 1px solid var(--omv-line);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  transition: background-color .12s ease;
}
.omv-campaign-list .omv-campaign:last-child { border-bottom: 0; }
.omv-campaign-list .omv-campaign::before { display: none; }
.omv-campaign-list .omv-campaign:hover { transform: none; border-color: var(--omv-line); background: var(--omv-hover); box-shadow: none; }
.omv-campaign-main { min-width: 0; display: flex; align-items: center; gap: 10px; }
.omv-campaign-list .omv-campaign-icon { flex: none; width: 26px; height: 26px; border: 1px solid var(--omv-line); border-radius: 5px; background: transparent; color: var(--omv-faint); }
.omv-campaign-main > div { min-width: 0; }
.omv-campaign-list .omv-campaign h3 { margin: 0; overflow: hidden; color: var(--omv-text); font-size: 12px; font-weight: 550; line-height: 1.35; text-overflow: ellipsis; white-space: nowrap; }
.omv-campaign-list .omv-campaign p { margin: 3px 0 0; overflow: hidden; color: var(--omv-faint); font-size: 10.5px; text-overflow: ellipsis; white-space: nowrap; }
.omv-campaign-list .omv-campaign p code { color: inherit; font: inherit; }
.omv-campaign-list .omv-status { justify-self: start; }
.omv-campaign-list .omv-campaign-next { min-width: 0; margin: 0; padding: 0; border: 0; border-left: 0; background: transparent; display: grid; gap: 2px; }
.omv-campaign-list .omv-campaign-next span { color: var(--omv-faint); font-size: 9.5px; }
.omv-campaign-list .omv-campaign-next strong { overflow: hidden; color: var(--omv-muted); font-size: 10.5px; font-weight: 500; text-overflow: ellipsis; white-space: nowrap; }
.omv-campaign-list .omv-campaign-foot { margin: 0; padding: 0; border: 0; color: var(--omv-faint); font-size: 10.5px; }
.omv-campaign-list > .omv-campaign > svg { color: var(--omv-faint); }

.omv-search-page .omv-workbench-header { margin-bottom: 10px; }
.omv-search-toolbar { margin-bottom: 8px; }
.omv-search-page .omv-global-search .omv-input { height: 38px; border-radius: 6px; font-size: 12px; }
.omv-search-page .omv-search-results { border-radius: 7px; box-shadow: none; }
.omv-search-page .omv-results-meta { min-height: 36px; padding: 0 14px; gap: 9px; }
.omv-search-page .omv-results-meta b { color: var(--omv-muted); font-weight: 600; font-variant-numeric: tabular-nums; }
.omv-search-page .omv-results-meta span { color: var(--omv-faint); font-size: 10.5px; }
.omv-search-page .omv-search-results li { min-height: 56px; padding: 8px 14px; grid-template-columns: 82px minmax(0, 1fr) 16px; gap: 12px; }
.omv-search-page .omv-search-results li[data-actionable='true']:hover { background: var(--omv-hover); }
.omv-search-kind { min-width: 0; display: inline-flex; align-items: center; gap: 7px; color: var(--omv-faint); }
.omv-search-kind svg { flex: none; color: var(--omv-muted); }
.omv-search-kind small { color: inherit; font-size: 10.5px; }
.omv-search-kind[data-kind='finding'] svg { color: var(--omv-blue); }
.omv-search-kind[data-kind='campaign'] svg { color: var(--omv-green); }
.omv-search-kind[data-kind='activity'] svg { color: var(--omv-faint); }
.omv-search-hint { flex: none; color: var(--omv-faint); font-size: 10.5px; white-space: nowrap; }
.omv-search-groups { display: grid; }
.omv-search-group + .omv-search-group { border-top: 1px solid var(--omv-line); }
.omv-search-group-head { min-height: 34px; padding: 0 14px; display: flex; align-items: center; gap: 7px; background: color-mix(in srgb, var(--omv-bg) 38%, var(--omv-surface)); }
.omv-search-group-head h3 { margin: 0; color: var(--omv-muted); font-size: 10.5px; font-weight: 600; }
.omv-search-group-head span { min-width: 17px; padding: 1px 5px; border-radius: 999px; background: var(--omv-hover); color: var(--omv-faint); font-size: 9.5px; font-variant-numeric: tabular-nums; text-align: center; }
.omv-search-group > ul { margin: 0; padding: 0; list-style: none; }
.omv-search-result-meta { color: var(--omv-faint) !important; font-size: 9.5px !important; }
.omv-detail-primary-actions { align-items: flex-start; }
.omv-detail-more { position: relative; flex: none; }
.omv-detail-more > summary { min-height: 30px; padding: 0 10px; border: 1px solid var(--omv-line); border-radius: 6px; background: var(--omv-surface); color: var(--omv-muted); display: inline-flex; align-items: center; cursor: pointer; font-size: 11px; list-style: none; }
.omv-detail-more > summary::-webkit-details-marker { display: none; }
.omv-detail-more > summary::after { content: '⌄'; margin-left: 6px; color: var(--omv-faint); font-size: 12px; }
.omv-detail-more[open] > summary { border-color: color-mix(in srgb, var(--omv-blue) 34%, var(--omv-line)); color: var(--omv-text); background: var(--omv-hover); }
.omv-detail-more-menu { position: absolute; z-index: 3; top: calc(100% + 5px); right: 0; min-width: 156px; padding: 5px; border: 1px solid var(--omv-line); border-radius: 7px; background: var(--omv-surface); box-shadow: var(--omv-shadow-md, 0 8px 24px rgba(0, 0, 0, .12)); display: grid; gap: 2px; }
.omv-detail-more-menu > * { width: 100%; justify-content: flex-start; }
.omv-detail-tabs { margin: 4px 0 12px; padding: 3px; border: 1px solid var(--omv-line); border-radius: 7px; background: var(--omv-bg); display: flex; gap: 2px; }
.omv-detail-tabs button { min-height: 28px; flex: 1; padding: 0 9px; border: 0; border-radius: 5px; background: transparent; color: var(--omv-faint); font: inherit; font-size: 10.5px; cursor: pointer; }
.omv-detail-tabs button:hover { color: var(--omv-text); background: var(--omv-hover); }
.omv-detail-tabs button.active { background: var(--omv-surface); color: var(--omv-text); font-weight: 600; box-shadow: var(--omv-shadow-xs); }
.omv-detail-tab-panel[hidden] { display: none; }
.omv-findings-summary > .omv-findings-stat { min-height: 54px; padding: 9px 13px; border: 0; border-right: 1px solid var(--omv-line); border-radius: 0; background: transparent; color: inherit; display: grid; align-content: center; justify-items: start; gap: 5px; text-align: left; cursor: pointer; }
.omv-findings-summary > .omv-findings-stat:last-child { border-right: 0; }
.omv-findings-summary > .omv-findings-stat:hover { background: var(--omv-hover); }
.omv-findings-summary > .omv-findings-stat.active { box-shadow: inset 0 -2px 0 var(--omv-blue); }
.omv-findings-summary > .omv-findings-stat strong { font-size: 17px; }
.omv-findings-summary > .omv-findings-stat span { color: var(--omv-faint); font-size: 10px; }
.omv-findings-page .omv-toolbar { flex-wrap: wrap; }
.omv-findings-page .omv-toolbar .omv-search { min-width: 220px; }
.omv-issue-file-actions, .omv-issue-head-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 5px; }
.omv-data-notice details li > div:first-child { min-width: 0; display: grid; gap: 2px; }
.omv-data-notice details li > div:first-child span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.omv-campaign-issues .omv-panel-head { align-items: center; }

@media (max-width: 760px) {
  .omv-workbench-header { align-items: flex-start; flex-direction: column; gap: 10px; }
  .omv-workbench-header > button { align-self: flex-start; }
  .omv-campaign-list-head { display: none; }
  .omv-campaign-list .omv-campaign { grid-template-columns: minmax(0, 1fr) auto 16px; gap: 9px; }
  .omv-campaign-list .omv-campaign-main { grid-column: 1 / 2; }
  .omv-campaign-list .omv-status { grid-column: 2 / 3; }
  .omv-campaign-list .omv-campaign-next, .omv-campaign-list .omv-campaign-foot { display: none; }
  .omv-campaign-list > .omv-campaign > svg { grid-column: 3 / 4; }
  .omv-search-page .omv-search-results li { grid-template-columns: 70px minmax(0, 1fr) 16px; }
  .omv-search-hint { display: none; }
}

/* Reproduction v2: turn the page into an operational queue instead of a
   stack of equally weighted cards. The existing DSH state colors remain the
   only accents; layout carries the hierarchy. */
.omv-reproduction-page > .omv-hero { min-height: 72px; margin-bottom: 10px; }
.omv-repro-context {
  min-height: 36px; margin: 0 0 12px; padding: 0 13px; border: 1px solid var(--omv-line); border-radius: 7px;
  background: var(--omv-surface); gap: 0; overflow: hidden;
}
.omv-repro-context > span { min-height: 22px; padding: 0 14px; border-right: 1px solid var(--omv-line); }
.omv-repro-context > span:first-child { padding-left: 0; }
.omv-repro-context > span:last-child { border-right: 0; }
.omv-repro-context b { color: var(--omv-text); }
.omv-repro-context i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.omv-repro-metrics {
  grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0; margin-bottom: 14px;
  border: 1px solid var(--omv-line); border-radius: 7px; background: var(--omv-surface); overflow: hidden;
}
.omv-repro-metrics .omv-metric {
  min-height: 82px; padding: 13px 16px; border: 0; border-right: 1px solid var(--omv-line); border-radius: 0; box-shadow: none;
}
.omv-repro-metrics .omv-metric:last-child { border-right: 0; }
.omv-repro-metrics .omv-metric:hover { transform: none; box-shadow: none; background: var(--omv-hover); }
.omv-repro-metrics .omv-metric-head { font-size: 11px; }
.omv-repro-metrics .omv-metric-icon { width: 25px; height: 25px; border-radius: 5px; }
.omv-repro-metrics .omv-metric-icon svg { width: 13px; height: 13px; }
.omv-repro-metrics .omv-metric strong { margin-top: 8px; font-size: 24px; }
.omv-repro-metrics .omv-metric-foot { margin-top: 5px; font-size: 10.5px; }
.omv-repro-layout { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(320px, .8fr); gap: 14px; align-items: start; }
.omv-repro-board, .omv-repro-pending { min-width: 0; }
.omv-repro-board > .omv-panel-head { min-height: 66px; padding: 9px 15px; align-items: center; }
.omv-repro-board > .omv-panel-head > div:first-child { min-width: 0; }
.omv-repro-filters { flex: none; display: inline-flex; align-items: center; gap: 2px; padding: 3px; border: 1px solid var(--omv-line); border-radius: 6px; background: var(--omv-bg); }
.omv-repro-filters button { min-height: 25px; padding: 0 8px; border: 0; border-radius: 4px; background: transparent; color: var(--omv-faint); cursor: pointer; font-size: 10.5px; }
.omv-repro-filters button:hover, .omv-repro-filters button[data-active='true'] { background: var(--omv-surface); color: var(--omv-text); box-shadow: 0 1px 2px var(--omv-shadow-tint); }
.omv-repro-filters b { margin-left: 4px; color: var(--omv-faint); font-size: 10px; font-weight: 600; }
.omv-repro-card { padding: 14px 15px; gap: 8px; }
.omv-repro-card-head { gap: 8px; }
.omv-repro-card-head .omv-link-button { min-width: 0; overflow: hidden; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.omv-repro-card-head code { max-width: 42%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.omv-repro-facts { min-width: 0; display: grid; grid-template-columns: minmax(0, 1fr) 110px 110px; gap: 8px; color: var(--omv-faint); font-size: 10.5px; }
.omv-repro-facts span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.omv-repro-facts small { display: block; margin-bottom: 2px; color: var(--omv-faint); font-size: 9.5px; }
.omv-repro-card-foot > div { display: inline-flex; align-items: center; gap: 10px; }
.omv-repro-pending > .omv-panel-head { min-height: 66px; padding: 9px 15px; }
.omv-repro-pending > .omv-panel-head > strong { margin-left: auto; color: var(--omv-orange); font-size: 23px; font-weight: 650; font-variant-numeric: tabular-nums; }
.omv-repro-pending > ul { margin: 0; padding: 0; list-style: none; }
.omv-repro-pending > ul > li { padding: 0; border-bottom: 1px solid var(--omv-line); }
.omv-repro-pending > ul > li:last-child { border-bottom: 0; }
.omv-repro-pending-row { width: 100%; min-width: 0; padding: 12px 15px 8px; border: 0; background: transparent; color: inherit; display: grid; grid-template-columns: 30px minmax(0, 1fr) auto 14px; align-items: center; gap: 9px; text-align: left; cursor: pointer; }
.omv-repro-pending-row:hover { background: var(--omv-hover); }
.omv-repro-pending-row > span { min-width: 0; display: grid; gap: 3px; }
.omv-repro-pending-row strong { overflow: hidden; color: var(--omv-text); font-size: 11.5px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.omv-repro-pending-row small { overflow: hidden; color: var(--omv-faint); font-size: 10.5px; text-overflow: ellipsis; white-space: nowrap; }
.omv-repro-pending-row .omv-maturity { padding: 3px 6px; font-size: 9.5px; }
.omv-repro-pending-row > svg { color: var(--omv-faint); }
.omv-repro-pending-action { min-width: 0; padding: 0 15px 11px 54px; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.omv-repro-pending-action > span { overflow: hidden; color: var(--omv-blue); font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.omv-repro-pending-action > button { flex: none; }

@media (max-width: 980px) {
  .omv-repro-layout { grid-template-columns: 1fr; }
  .omv-repro-pending { order: -1; }
}
@media (max-width: 720px) {
  .omv-repro-context { flex-wrap: wrap; gap: 0; padding: 5px 9px; }
  .omv-repro-context > span { padding: 2px 8px; }
  .omv-repro-context > span:first-child { padding-left: 0; }
  .omv-repro-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .omv-repro-metrics .omv-metric:nth-child(2) { border-right: 0; }
  .omv-repro-metrics .omv-metric:nth-child(-n + 2) { border-bottom: 1px solid var(--omv-line); }
  .omv-repro-board > .omv-panel-head { align-items: flex-start; flex-direction: column; }
  .omv-repro-filters { width: 100%; }
  .omv-repro-filters button { flex: 1; }
  .omv-repro-facts { grid-template-columns: minmax(0, 1fr) 84px; }
  .omv-repro-facts span:last-child { display: none; }
  .omv-repro-card-head code { max-width: 34%; }
}

/* Findings v3: the index is a working ledger. Keep the host's semantic colors,
   but give the row itself the hierarchy and reserve strong marks for real state. */
.omv-findings-header {
  min-height: 58px;
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.omv-findings-header p { margin-top: 5px; }
.omv-findings-page .omv-data-notice-compact {
  min-height: 42px;
  margin: 0 0 10px;
  padding: 6px 10px;
  border-radius: 6px;
}
.omv-findings-page .omv-data-notice-compact details { margin-top: 4px; }
.omv-findings-summary {
  min-height: 54px;
  margin-bottom: 10px;
  border-radius: 6px;
  box-shadow: none;
}
.omv-findings-summary > div { min-height: 54px; padding: 9px 13px; }
.omv-findings-summary strong { font-size: 17px; }
.omv-findings-summary span { font-size: 10px; }
.omv-findings-page .omv-toolbar { margin-bottom: 8px; }
.omv-findings-page .omv-list-wrap { border-radius: 6px; box-shadow: none; }
.omv-findings-page .omv-list-head,
.omv-findings-page .omv-finding-row {
  grid-template-columns: minmax(280px, 2.1fr) 110px minmax(150px, 1fr) minmax(190px, 1.35fr);
  gap: 16px;
}
.omv-findings-page .omv-list-head {
  height: 34px;
  padding: 0 14px;
  background: color-mix(in srgb, var(--omv-bg) 48%, var(--omv-surface));
  color: var(--omv-faint);
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: .035em;
}
.omv-findings-page .omv-finding-row {
  min-height: 64px;
  padding: 9px 14px;
}
.omv-findings-page .omv-finding-row:hover {
  background: color-mix(in srgb, var(--omv-blue) 4%, var(--omv-surface));
}
.omv-findings-page .omv-finding-name { gap: 10px; }
.omv-findings-page .omv-eco-avatar[data-size='lg'] {
  width: 30px;
  height: 30px;
  border: 1px solid color-mix(in srgb, var(--eco-brand) 16%, var(--omv-line));
  border-radius: 7px;
  background: color-mix(in srgb, var(--eco-bg) 72%, var(--omv-surface));
  filter: saturate(.82);
}
.omv-findings-page .omv-eco-avatar[data-size='lg'] > svg { width: 18px; height: 18px; opacity: .86; }
.omv-findings-page .omv-finding-row:hover .omv-eco-avatar[data-size='lg'] { filter: saturate(1); }
.omv-findings-page .omv-finding-name strong { font-size: 12.5px; font-weight: 600; }
.omv-findings-page .omv-finding-name span { margin-top: 2px; color: var(--omv-faint); font-size: 10.5px; }
.omv-findings-page .omv-finding-row > .omv-status {
  width: fit-content;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--status);
  font-size: 10.5px;
  font-weight: 550;
}
.omv-findings-page .omv-finding-row > .omv-status::before {
  content: '';
  width: 6px;
  height: 6px;
  margin-right: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 2px color-mix(in srgb, currentColor 10%, transparent);
}
.omv-findings-page .omv-finding-row > .omv-status svg { display: none; }
.omv-findings-page .omv-maturity {
  grid-template-columns: 15px minmax(0, auto) auto;
  gap: 5px;
  color: var(--omv-muted);
  font-size: 10.5px;
}
.omv-findings-page .omv-maturity > i { width: 15px; height: 15px; border-radius: 4px; }
.omv-findings-page .omv-maturity > b { font-size: 9.5px; }
.omv-findings-page .omv-cell-mono {
  color: var(--omv-muted);
  font-size: 10.5px;
}
.omv-findings-page .omv-muted-copy { color: var(--omv-faint); font-size: 10.5px; }

@media (max-width: 720px) {
  .omv-findings-header { min-height: 0; }
  .omv-findings-summary > div { padding: 8px 10px; }
  .omv-findings-summary strong { font-size: 16px; }
  .omv-findings-page .omv-list-head { display: none; }
  .omv-findings-page .omv-finding-row {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 7px 10px;
    padding: 11px 13px;
  }
  .omv-findings-page .omv-finding-row > .omv-finding-name { grid-column: 1 / -1; }
  .omv-findings-page .omv-finding-row > .omv-maturity { justify-self: end; }
  .omv-findings-page .omv-finding-row > .omv-cell-mono { grid-column: 1 / -1; }
}

/* Reproduction controls: add tactile depth with the host palette only. The
   context rail stays informational; the history filters carry the interaction. */
.omv-repro-context {
  border-color: var(--omv-line);
  background: var(--omv-surface);
  box-shadow: none;
}
.omv-repro-context b {
  padding: 0;
  border-radius: 0;
  background: transparent;
  color: var(--omv-text);
}
.omv-repro-filters {
  padding: 2px;
  border-color: var(--omv-line);
  background: var(--omv-bg);
  box-shadow: none;
}
.omv-repro-filters button {
  min-height: 26px;
  padding: 0 8px;
  border: 0;
  border-radius: 4px;
  color: var(--omv-faint);
}
.omv-repro-filters button:hover {
  background: var(--omv-hover);
  color: var(--omv-muted);
}
.omv-repro-filters button[data-active='true'] {
  background: var(--omv-surface);
  color: var(--omv-text);
  box-shadow: 0 1px 2px var(--omv-shadow-tint);
}
.omv-repro-filters b {
  margin-left: 4px;
  color: var(--omv-faint);
  font-size: 10px;
  font-weight: 600;
}

/* Reproduction code uses dsh's native CodeBlock and TerminalBlock. Keep the
   primitives' token colors and geometry, only tightening their outer rhythm to
   fit the run ledger. */
.omv-reproduction-page .omv-repro-code,
.omv-reproduction-page .omv-repro-terminal {
  min-width: 0;
  margin: 0;
}
.omv-reproduction-page .omv-repro-code {
  border: 1px solid var(--omv-line);
  border-radius: 6px;
  overflow: hidden;
}
.omv-reproduction-page .omv-repro-terminal {
  --dsl-terminal-output-max-height: 220px;
  border: 1px solid var(--omv-line);
  border-radius: 6px;
}

/* Final interaction pass: quiet, tactile, and accessible. */
.omv-native-view {
  --omv-motion-fast: 120ms;
  --omv-motion-base: 180ms;
  --omv-motion-ease: cubic-bezier(.2, .7, .2, 1);
}
.omv-native-view button,
.omv-native-view input,
.omv-native-view select,
.omv-native-view textarea,
.omv-native-view [role='button'] {
  -webkit-tap-highlight-color: transparent;
}
.omv-native-view button:not(:disabled):active,
.omv-native-view .omv-queue-row:active,
.omv-native-view .omv-finding-row:active,
.omv-native-view .omv-campaign:active,
.omv-native-view .omv-search-results li[data-actionable='true']:active,
.omv-native-view .omv-repro-pending-row:active {
  transform: translateY(1px);
}
.omv-native-view button:disabled { cursor: not-allowed; }
.omv-native-view button:focus-visible,
.omv-native-view input:focus-visible,
.omv-native-view select:focus-visible,
.omv-native-view textarea:focus-visible,
.omv-native-view [role='button']:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--omv-blue) 72%, white);
  outline-offset: 2px;
}
.omv-native-view .omv-input:focus {
  border-color: color-mix(in srgb, var(--omv-blue) 58%, var(--omv-line));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--omv-blue) 10%, transparent);
}
.omv-nav-button,
.omv-icon-button,
.omv-palette-button,
.omv-flow-control,
.omv-command-palette-item {
  transition-duration: var(--omv-motion-fast);
}
.omv-nav-button[data-active='true']::after {
  transition: background-color var(--omv-motion-base) ease, left var(--omv-motion-base) var(--omv-motion-ease), right var(--omv-motion-base) var(--omv-motion-ease);
}
.omv-live[data-state='connecting'] > i {
  animation: omv-live-pulse 1.4s ease-in-out infinite;
}
@keyframes omv-live-pulse {
  0%, 100% { opacity: .5; transform: scale(.86); }
  50% { opacity: 1; transform: scale(1.12); }
}
.omv-queue-row,
.omv-finding-row,
.omv-campaign-list .omv-campaign,
.omv-search-results li[data-actionable='true'],
.omv-repro-pending-row {
  transition: background-color var(--omv-motion-fast) ease, box-shadow var(--omv-motion-fast) ease, border-color var(--omv-motion-fast) ease, transform var(--omv-motion-fast) ease;
}
.omv-queue-row:hover,
.omv-finding-row:hover,
.omv-campaign-list .omv-campaign:hover,
.omv-search-results li[data-actionable='true']:hover,
.omv-repro-pending-row:hover {
  box-shadow: inset 2px 0 0 color-mix(in srgb, var(--omv-blue) 72%, transparent);
}
.omv-search-page .omv-global-search { position: relative; overflow: hidden; }
.omv-search-progress {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 30%;
  height: 2px;
  border-radius: 0 2px 2px 0;
  background: var(--omv-blue);
  animation: omv-search-progress 1.05s var(--omv-motion-ease) infinite;
}
@keyframes omv-search-progress {
  from { transform: translateX(-120%); }
  to { transform: translateX(420%); }
}
.omv-detail-backdrop { overscroll-behavior: contain; }
.omv-finding-detail {
  animation: omv-drawer-in .2s var(--omv-motion-ease) both;
}
.omv-finding-detail[data-expanded='true'] {
  animation: omv-modal-in .22s var(--omv-motion-ease) both;
}
.omv-native-view:has(.omv-campaign-detail) .omv-detail-backdrop {
  background: transparent;
  backdrop-filter: none;
  pointer-events: none;
}
.omv-native-view:has(.omv-campaign-detail[data-expanded='true']) .omv-detail-backdrop {
  background: rgba(18, 22, 30, .14);
  pointer-events: auto;
}
.omv-campaign-detail {
  top: 0;
  right: 0;
  bottom: 0;
  left: auto;
  width: min(50%, 720px);
  height: auto;
  max-height: none;
  transform: none;
  border-top: 0;
  border-right: 0;
  border-bottom: 0;
  border-left: 1px solid var(--omv-line);
  border-radius: 0;
  background: var(--omv-surface);
  box-shadow: -10px 0 28px rgba(18, 22, 30, .08);
  animation: omv-drawer-in .2s var(--omv-motion-ease) both;
}
.omv-campaign-detail .omv-detail-head { border-radius: 0; background: var(--omv-surface); box-shadow: inset 0 -2px 0 color-mix(in srgb, var(--omv-blue) 40%, transparent); }
.omv-campaign-detail .omv-detail-body { min-height: 0; background: #fff; }
.omv-campaign-detail[data-expanded='true'] {
  top: 50%;
  right: auto;
  bottom: auto;
  left: 50%;
  width: min(92%, 1800px);
  height: min(92%, 1200px);
  transform: translate(-50%, -50%);
  border: 1px solid var(--omv-line);
  border-radius: 8px;
  box-shadow: 0 14px 34px rgba(18, 22, 30, .14);
  animation: omv-modal-in .22s var(--omv-motion-ease) both;
}
.omv-campaign-detail[data-expanded='true'] .omv-detail-head { border-radius: 7px 7px 0 0; }
.omv-campaign-detail[data-expanded='true'] .omv-detail-body { padding: 18px 20px 28px; }
@keyframes omv-drawer-in {
  from { opacity: 0; transform: translateX(16px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes omv-modal-in {
  from { opacity: 0; transform: translate(-50%, -48%) scale(.985); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
.omv-command-palette {
  animation: omv-pop-in .18s var(--omv-motion-ease) both;
}
.omv-flow-node {
  cursor: pointer;
  transition: opacity var(--omv-motion-fast) ease;
}
.omv-flow-node:hover,
.omv-flow-node:focus-visible { opacity: 1; }
.omv-flow-node.selected { opacity: 1; }
.omv-flow-node.selected > rect:first-of-type {
  stroke: color-mix(in srgb, var(--omv-blue) 62%, var(--omv-line));
  stroke-width: 1.6;
}
.omv-flow-node:focus-visible > rect:first-of-type {
  stroke: var(--omv-blue);
  stroke-width: 1.8;
}
.omv-flow-edge { transition: opacity var(--omv-motion-fast) ease; }
.omv-flow:has(.omv-flow-node:hover) .omv-flow-edge { opacity: .8; }
.omv-command-palette-head > kbd + kbd { margin-left: -3px; }
.omv-command-palette-item[data-active='true'] { background: var(--omv-hover); color: var(--omv-text); }
.omv-detail-body,
.omv-flow-canvas,
.omv-content { overscroll-behavior: contain; }
.omv-poc-lab { display: grid; gap: 12px; }
.omv-poc-intro { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 14px; border: 1px solid var(--omv-line); border-radius: 10px; background: var(--omv-panel); }
.omv-poc-intro > div { display: grid; gap: 3px; }
.omv-poc-intro strong { font-size: 13px; }
.omv-poc-intro span, .omv-poc-editor-head span, .omv-poc-run span { color: var(--omv-muted); font-size: 12px; }
.omv-poc-grid { display: grid; grid-template-columns: minmax(170px, .35fr) minmax(0, 1fr); gap: 10px; }
.omv-poc-drafts, .omv-poc-editor, .omv-poc-runs { min-width: 0; border: 1px solid var(--omv-line); border-radius: 10px; overflow: hidden; }
.omv-poc-subhead { display: flex; align-items: center; justify-content: space-between; padding: 9px 11px; border-bottom: 1px solid var(--omv-line); color: var(--omv-muted); font-size: 12px; }
.omv-poc-subhead small { min-width: 20px; padding: 2px 6px; border-radius: 999px; background: var(--omv-hover); text-align: center; }
.omv-poc-draft { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; padding: 10px 11px; border: 0; border-bottom: 1px solid var(--omv-line); background: transparent; color: inherit; text-align: left; cursor: pointer; }
.omv-poc-draft:last-child { border-bottom: 0; }
.omv-poc-draft[data-active='true'] { background: color-mix(in srgb, var(--omv-blue) 8%, transparent); }
.omv-poc-draft > span { display: grid; min-width: 0; gap: 3px; }
.omv-poc-draft strong, .omv-poc-draft small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.omv-poc-draft small { color: var(--omv-muted); font-size: 11px; }
.omv-poc-editor-head { display: flex; justify-content: space-between; gap: 10px; padding: 9px 11px; border-bottom: 1px solid var(--omv-line); }
.omv-poc-editor-head > div { display: grid; gap: 3px; min-width: 0; }
.omv-poc-editor-head strong, .omv-poc-editor-head code { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.omv-poc-textarea { display: block; width: 100%; min-height: 170px; padding: 11px; border: 0; resize: vertical; background: var(--omv-code-bg, #f7f8fa); color: var(--omv-text); font: 12px/1.55 ui-monospace, SFMono-Regular, Menlo, monospace; outline: none; }
.omv-poc-actions { display: flex; flex-wrap: wrap; gap: 7px; padding: 9px 11px; border-top: 1px solid var(--omv-line); }
.omv-poc-errors { margin: 0; padding: 0 11px 10px 28px; color: var(--omv-red); font-size: 11px; }
.omv-poc-warnings { margin: 0; padding: 0 11px 10px 28px; color: var(--omv-muted); font-size: 11px; }
.omv-poc-prompt { padding: 9px 11px; border-bottom: 1px solid var(--omv-line); color: var(--omv-muted); font-size: 11px; }
.omv-poc-prompt p { margin: 7px 0; line-height: 1.5; white-space: pre-wrap; }
.omv-poc-prompt code { color: var(--omv-text); }
.omv-poc-run { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 9px; padding: 10px 11px; border-bottom: 1px solid var(--omv-line); }
.omv-poc-run:last-child { border-bottom: 0; }
.omv-poc-run > div:first-child { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; min-width: 0; }
.omv-poc-run code { overflow: hidden; text-overflow: ellipsis; max-width: 220px; }
.omv-poc-run p { flex: 1 0 100%; margin: 0; color: var(--omv-text); font-size: 12px; white-space: pre-wrap; }

@media (max-width: 720px) {
  .omv-workspace-path,
  .omv-sync-meta,
  .omv-jobs-badge { display: none; }
  .omv-native-toolbar { gap: 3px; }
  .omv-nav { flex: 1 1 auto; min-width: 0; }
  .omv-nav-button { min-width: 0; padding-inline: 6px; }
  .omv-nav-button span { font-size: 10.5px; }
  .omv-palette-button { width: 30px; padding-inline: 0; justify-content: center; }
  .omv-palette-button span,
  .omv-palette-button kbd { display: none; }
  .omv-finding-detail[data-expanded='true'],
  .omv-campaign-detail[data-expanded='true'] { width: calc(100% - 16px); height: calc(100% - 16px); }
  .omv-campaign-detail { width: min(92%, 560px); }
  .omv-campaign-detail .omv-detail-body,
  .omv-campaign-detail[data-expanded='true'] .omv-detail-body { padding: 12px; }
  .omv-flow-toolbar { align-items: stretch; flex-direction: column; gap: 6px; padding: 7px 8px; }
  .omv-flow-legend { gap: 7px; }
  .omv-flow-zoom { width: 100%; }
  .omv-flow-control { flex: 1 1 auto; }
  .omv-poc-grid { grid-template-columns: 1fr; }
  .omv-poc-intro { align-items: flex-start; flex-direction: column; }
}
@media (prefers-reduced-motion: reduce) {
  .omv-native-view *,
  .omv-native-view *::before,
  .omv-native-view *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: .001ms !important;
  }
}
`;
		function ensureWorkbenchStyles() {
			if (typeof document === "undefined" || document.querySelector("style[data-plugin-css=\"dsh-omv/workbench\"]")) return;
			const style = document.createElement("style");
			style.dataset.plugin = "dsh-omv";
			style.dataset.pluginCss = "dsh-omv/workbench";
			style.textContent = WORKBENCH_CSS;
			document.head.appendChild(style);
		}
		// node_modules/.pnpm/simple-icons@16.36.0/node_modules/simple-icons/index.mjs
		const c = "<svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><title>";
		const t = "</title><path d=\"";
		const a = "\"/></svg>";
		const siDotnet = {
			title: ".NET",
			slug: "dotnet",
			get svg() {
				return c + ".NET" + t + this.path + a;
			},
			path: "M24 8.77h-2.468v7.565h-1.425V8.77h-2.462V7.53H24zm-6.852 7.565h-4.821V7.53h4.63v1.24h-3.205v2.494h2.953v1.234h-2.953v2.604h3.396zm-6.708 0H8.882L4.78 9.863a2.896 2.896 0 0 1-.258-.51h-.036c.032.189.048.592.048 1.21v5.772H3.157V7.53h1.659l3.965 6.32c.167.261.275.442.323.54h.024c-.04-.233-.06-.629-.06-1.185V7.529h1.372zm-8.703-.693a.868.829 0 0 1-.869.829.868.829 0 0 1-.868-.83.868.829 0 0 1 .868-.828.868.829 0 0 1 .869.829Z",
			source: "https://github.com/dotnet/brand/blob/c7d0f51b8ec59531332d05fb27a5b758a7a3d689/logo/dotnet-logo.svg",
			hex: "512BD4",
			guidelines: "https://github.com/dotnet/brand/blob/c7d0f51b8ec59531332d05fb27a5b758a7a3d689/dotnet-styleGuide-2024.pdf",
			license: {
				type: "CC0-1.0",
				url: "https://spdx.org/licenses/CC0-1.0"
			}
		};
		const siDart = {
			title: "Dart",
			slug: "dart",
			get svg() {
				return c + "Dart" + t + this.path + a;
			},
			path: "M4.105 4.105S9.158 1.58 11.684.316a3.079 3.079 0 0 1 1.481-.315c.766.047 1.677.788 1.677.788L24 9.948v9.789h-4.263V24H9.789l-9-9C.303 14.5 0 13.795 0 13.105c0-.319.18-.818.316-1.105l3.789-7.895zm.679.679v11.787c.002.543.021 1.024.498 1.508L10.204 23h8.533v-4.263L4.784 4.784zm12.055-.678c-.899-.896-1.809-1.78-2.74-2.643-.302-.267-.567-.468-1.07-.462-.37.014-.87.195-.87.195L6.341 4.105l10.498.001z",
			source: "https://github.com/dart-lang/site-shared/tree/18458ff440afd3d06f04e5cb871c4c5eda29c9d5/src/_assets/image/dart/logo",
			hex: "0175C2"
		};
		const siElixir = {
			title: "Elixir",
			slug: "elixir",
			get svg() {
				return c + "Elixir" + t + this.path + a;
			},
			path: "M19.793 16.575c0 3.752-2.927 7.426-7.743 7.426-5.249 0-7.843-3.71-7.843-8.29 0-5.21 3.892-12.952 8-15.647a.397.397 0 0 1 .61.371 9.716 9.716 0 0 0 1.694 6.518c.522.795 1.092 1.478 1.763 2.352.94 1.227 1.637 1.906 2.644 3.842l.015.028a7.107 7.107 0 0 1 .86 3.4z",
			source: "https://github.com/elixir-lang/elixir-lang.github.com/tree/031746384ee23b9be19298c92a9699c56cc05845/images/logo",
			hex: "8847B9",
			guidelines: "https://elixir-lang.org/trademarks/"
		};
		const siGithub = {
			title: "GitHub",
			slug: "github",
			get svg() {
				return c + "GitHub" + t + this.path + a;
			},
			path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
			source: "https://github.com/logos",
			hex: "181717",
			guidelines: "https://github.com/logos"
		};
		const siGo = {
			title: "Перейти",
			slug: "go",
			get svg() {
				return c + "Go" + t + this.path + a;
			},
			path: "M1.811 10.231c-.047 0-.058-.023-.035-.059l.246-.315c.023-.035.081-.058.128-.058h4.172c.046 0 .058.035.035.07l-.199.303c-.023.036-.082.07-.117.07zM.047 11.306c-.047 0-.059-.023-.035-.058l.245-.316c.023-.035.082-.058.129-.058h5.328c.047 0 .07.035.058.07l-.093.28c-.012.047-.058.07-.105.07zm2.828 1.075c-.047 0-.059-.035-.035-.07l.163-.292c.023-.035.07-.07.117-.07h2.337c.047 0 .07.035.07.082l-.023.28c0 .047-.047.082-.082.082zm12.129-2.36c-.736.187-1.239.327-1.963.514-.176.046-.187.058-.34-.117-.174-.199-.303-.327-.548-.444-.737-.362-1.45-.257-2.115.175-.795.514-1.204 1.274-1.192 2.22.011.935.654 1.706 1.577 1.835.795.105 1.46-.175 1.987-.77.105-.13.198-.27.315-.434H10.47c-.245 0-.304-.152-.222-.35.152-.362.432-.97.596-1.274a.315.315 0 01.292-.187h4.253c-.023.316-.023.631-.07.947a4.983 4.983 0 01-.958 2.29c-.841 1.11-1.94 1.8-3.33 1.986-1.145.152-2.209-.07-3.143-.77-.865-.655-1.356-1.52-1.484-2.595-.152-1.274.222-2.419.993-3.424.83-1.086 1.928-1.776 3.272-2.02 1.098-.2 2.15-.07 3.096.571.62.41 1.063.97 1.356 1.648.07.105.023.164-.117.2m3.868 6.461c-1.064-.024-2.034-.328-2.852-1.029a3.665 3.665 0 01-1.262-2.255c-.21-1.32.152-2.489.947-3.529.853-1.122 1.881-1.706 3.272-1.95 1.192-.21 2.314-.095 3.33.595.923.63 1.496 1.484 1.648 2.605.198 1.578-.257 2.863-1.344 3.962-.771.783-1.718 1.273-2.805 1.495-.315.06-.63.07-.934.106zm2.78-4.72c-.011-.153-.011-.27-.034-.387-.21-1.157-1.274-1.81-2.384-1.554-1.087.245-1.788.935-2.045 2.033-.21.912.234 1.835 1.075 2.21.643.28 1.285.244 1.905-.07.923-.48 1.425-1.228 1.484-2.233z",
			source: "https://blog.golang.org/go-brand",
			hex: "00ADD8",
			guidelines: "https://blog.golang.org/go-brand"
		};
		const siLua = {
			title: "Lua",
			slug: "lua",
			get svg() {
				return c + "Lua" + t + this.path + a;
			},
			path: "M.38 10.377l-.272-.037c-.048.344-.082.695-.101 1.041l.275.016c.018-.34.051-.682.098-1.02zM4.136 3.289l-.184-.205c-.258.232-.509.48-.746.734l.202.188c.231-.248.476-.49.728-.717zM5.769 2.059l-.146-.235c-.296.186-.586.385-.863.594l.166.219c.27-.203.554-.399.843-.578zM1.824 18.369c.185.297.384.586.593.863l.22-.164c-.205-.271-.399-.555-.58-.844l-.233.145zM1.127 16.402l-.255.104c.129.318.274.635.431.943l.005.01.245-.125-.005-.01c-.153-.301-.295-.611-.421-.922zM.298 9.309l.269.063c.076-.332.168-.664.272-.986l-.261-.087c-.108.332-.202.672-.28 1.01zM.274 12.42l-.275.01c.012.348.04.699.083 1.043l.273-.033c-.042-.336-.069-.68-.081-1.02zM.256 14.506c.073.34.162.682.264 1.014l.263-.08c-.1-.326-.187-.658-.258-.99l-.269.056zM11.573.275L11.563 0c-.348.012-.699.039-1.044.082l.034.273c.338-.041.68-.068 1.02-.08zM23.221 8.566c.1.326.186.66.256.992l.27-.059c-.072-.34-.16-.682-.262-1.014l-.264.081zM17.621 1.389c-.309-.164-.627-.314-.947-.449l-.107.252c.314.133.625.281.926.439l.128-.242zM15.693.572c-.332-.105-.67-.199-1.01-.277l-.063.268c.332.076.664.168.988.273l.085-.264zM6.674 1.545c.298-.15.606-.291.916-.418L7.486.873c-.317.127-.632.272-.937.428l-.015.008.125.244.015-.008zM23.727 11.588l.275-.01a11.797 11.797 0 0 0-.082-1.045l-.273.033c.041.338.068.682.08 1.022zM13.654.105c-.346-.047-.696-.08-1.043-.098l-.014.273c.339.018.683.051 1.019.098l.038-.273zM9.544.527l-.058-.27c-.34.072-.681.16-1.014.264l.081.262c.325-.099.659-.185.991-.256zM1.921 5.469l.231.15c.185-.285.384-.566.592-.834l-.217-.17c-.213.276-.417.563-.606.854zM.943 7.318l.253.107c.132-.313.28-.625.439-.924l-.243-.128c-.163.307-.314.625-.449.945zM18.223 21.943l.145.234c.295-.186.586-.385.863-.594l-.164-.219c-.272.204-.557.4-.844.579zM21.248 19.219l.217.17c.215-.273.418-.561.607-.854l-.23-.148c-.186.285-.385.564-.594.832zM19.855 20.715l.184.203c.258-.23.51-.479.746-.732l-.201-.188c-.23.248-.477.488-.729.717zM22.359 17.504l.244.129c.162-.307.314-.625.449-.945l-.254-.107a11.27 11.27 0 0 1-.439.923zM23.617 13.629l.273.039c.049-.346.082-.695.102-1.043l-.275-.014c-.018.338-.051.682-.1 1.018zM23.156 15.621l.264.086c.107-.332.201-.67.279-1.01l-.268-.063c-.077.333-.169.665-.275.987zM22.453 6.672c.154.303.297.617.424.932l.256-.104c-.131-.322-.277-.643-.436-.953l-.244.125zM8.296 23.418c.331.107.67.201 1.009.279l.062-.268c-.331-.076-.663-.168-.986-.273l-.085.262zM10.335 23.889c.345.049.696.082 1.043.102l.014-.275c-.339-.018-.682-.051-1.019-.098l-.038.271zM17.326 22.449c-.303.154-.613.297-.926.424l.104.256c.318-.131.639-.275.947-.434l.004-.002-.123-.246-.006.002zM4.613 21.467c.274.213.562.418.854.605l.149-.23c-.285-.184-.565-.385-.833-.592l-.17.217zM12.417 23.725l.009.275c.348-.014.699-.041 1.045-.084l-.035-.271c-.336.041-.68.068-1.019.08zM6.37 22.604c.307.162.625.314.946.449l.107-.254c-.313-.133-.624-.279-.924-.439l-.129.244zM3.083 20.041c.233.258.48.51.734.746l.188-.201c-.249-.23-.49-.477-.717-.729l-.205.184zM14.445 23.475l.059.27c.34-.074.68-.162 1.014-.266l-.082-.262c-.325.099-.659.185-.991.258zM21.18.129A2.689 2.689 0 1 0 21.18 5.507 2.689 2.689 0 1 0 21.18.129zM15.324 15.447c0 .471.314.66.852.66.67 0 1.297-.396 1.297-1.016v-.645c-.23.107-.379.141-1.107.24-.735.109-1.042.306-1.042.761zM12 2.818c-5.07 0-9.18 4.109-9.18 9.18 0 5.068 4.11 9.18 9.18 9.18 5.07 0 9.18-4.111 9.18-9.18 0-5.07-4.11-9.18-9.18-9.18zm-2.487 13.77H5.771v-6.023h.769v5.346h2.974v.677zm4.13 0h-.619v-.67c-.405.57-.811.793-1.446.793-.843 0-1.38-.463-1.38-1.182v-3.271h.686v3c0 .52.347.85.893.85.719 0 1.181-.578 1.181-1.461v-2.389h.686v4.33zm-.53-8.393c0-1.484 1.205-2.689 2.689-2.689s2.688 1.205 2.688 2.689-1.203 2.688-2.688 2.688-2.689-1.203-2.689-2.688zm5.567 7.856v.52c-.223.059-.33.074-.471.074-.34 0-.637-.238-.711-.57-.381.406-.918.637-1.471.637-.877 0-1.422-.463-1.422-1.248 0-.527.256-.916.76-1.123.266-.107.414-.141 1.389-.264.545-.066.719-.191.719-.48v-.182c0-.412-.348-.645-.967-.645-.645 0-.957.24-1.016.77h-.693c.041-1 .686-1.404 1.734-1.404 1.066 0 1.627.412 1.627 1.182v2.412c0 .215.133.338.373.338.041-.002.074-.002.149-.017z",
			source: "https://www.lua.org/images/",
			hex: "000080",
			guidelines: "https://www.lua.org/images/"
		};
		const siNpm = {
			title: "npm",
			slug: "npm",
			get svg() {
				return c + "npm" + t + this.path + a;
			},
			path: "M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z",
			source: "https://www.npmjs.com",
			hex: "CB3837",
			guidelines: "https://docs.npmjs.com/policies/logos-and-usage"
		};
		const siOpenjdk = {
			title: "OpenJDK",
			slug: "openjdk",
			get svg() {
				return c + "OpenJDK" + t + this.path + a;
			},
			path: "M11.915 0 11.7.215C9.515 2.4 7.47 6.39 6.046 10.483c-1.064 1.024-3.633 2.81-3.711 3.551-.093.87 1.746 2.611 1.55 3.235-.198.625-1.304 1.408-1.014 1.939.1.188.823.011 1.277-.491a13.389 13.389 0 0 0-.017 2.14c.076.906.27 1.668.643 2.232.372.563.956.911 1.667.911.397 0 .727-.114 1.024-.264.298-.149.571-.33.91-.5.68-.34 1.634-.666 3.53-.604 1.903.062 2.872.39 3.559.704.687.314 1.15.664 1.925.664.767 0 1.395-.336 1.807-.9.412-.563.631-1.33.72-2.24.06-.623.055-1.32 0-2.066.454.45 1.117.604 1.213.424.29-.53-.816-1.314-1.013-1.937-.198-.624 1.642-2.366 1.549-3.236-.08-.748-2.707-2.568-3.748-3.586C16.428 6.374 14.308 2.394 12.13.215zm.175 6.038a2.95 2.95 0 0 1 2.943 2.942 2.95 2.95 0 0 1-2.943 2.943A2.95 2.95 0 0 1 9.148 8.98a2.95 2.95 0 0 1 2.942-2.942zM8.685 7.983a3.515 3.515 0 0 0-.145.997c0 1.951 1.6 3.55 3.55 3.55 1.95 0 3.55-1.598 3.55-3.55 0-.329-.046-.648-.132-.951.334.095.64.208.915.336a42.699 42.699 0 0 1 2.042 5.829c.678 2.545 1.01 4.92.846 6.607-.082.844-.29 1.51-.606 1.94-.315.431-.713.651-1.315.651-.593 0-.932-.27-1.673-.61-.741-.338-1.825-.694-3.792-.758-1.974-.064-3.073.293-3.821.669-.375.188-.659.373-.911.5s-.466.2-.752.2c-.53 0-.876-.209-1.16-.64-.285-.43-.474-1.101-.545-1.948-.141-1.693.176-4.069.823-6.614a43.155 43.155 0 0 1 1.934-5.783c.348-.167.749-.31 1.192-.425zm-3.382 4.362a.216.216 0 0 1 .13.031c-.166.56-.323 1.116-.463 1.665a33.849 33.849 0 0 0-.547 2.555 3.9 3.9 0 0 0-.2-.39c-.58-1.012-.914-1.642-1.16-2.08.315-.24 1.679-1.755 2.24-1.781zm13.394.01c.562.027 1.926 1.543 2.24 1.783-.246.438-.58 1.068-1.16 2.08a4.428 4.428 0 0 0-.163.309 32.354 32.354 0 0 0-.562-2.49 40.579 40.579 0 0 0-.482-1.652.216.216 0 0 1 .127-.03z",
			source: "https://hg.openjdk.java.net/duke/duke/file/ca00f100dafc/vector/Agent.svg",
			hex: "000000",
			license: {
				type: "BSD-3-Clause",
				url: "https://spdx.org/licenses/BSD-3-Clause"
			}
		};
		const siPerl = {
			title: "Perl",
			slug: "perl",
			get svg() {
				return c + "Perl" + t + this.path + a;
			},
			path: "M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0m.157 1.103a10.91 10.91 0 0 1 9.214 5.404c-1.962.152-3.156 1.698-5.132 3.553-2.81 2.637-4.562.582-5.288-.898-.447-1.004-.847-2.117-1.544-2.769A.4.4 0 0 1 9.3 6.02l.08-.37a.083.083 0 0 0-.074-.1c-.33-.022-.601.093-.84.368a2.5 2.5 0 0 0-.375-.064c-.863-.093-1.036.345-1.873.345H5.81c-.758 0-1.391.361-1.7.892-.248.424-.257.884.15.93-.126.445.292.62 1.224.192 0 0 .733.421 1.749.421.549 0 .712.087.914.967.486 2.138 2.404 5.655 6.282 5.655l.118.166c.659.934.86 2.113.48 3.184-.307.867-.697 1.531-.697 1.531q.01.178.01.349c0 .81-.175 1.553-.387 2.23a10.91 10.91 0 0 1-11.989-6.342A10.91 10.91 0 0 1 7.608 2.01a10.9 10.9 0 0 1 4.55-.907M7.524 6.47c.288 0 .575.231.477.272a.4.4 0 0 1-.1.02.38.38 0 0 1-.375.327.384.384 0 0 1-.378-.326.4.4 0 0 1-.101-.02c-.098-.042.19-.273.477-.273m10.193 10.49q.05 0 .101.007.326.054.694.096.135.01.269.026a13.4 13.4 0 0 0 2.846-.007 10.9 10.9 0 0 1-2.007 2.705c-.11-.23-.547-1.19-.573-2.196q-.156-.01-.313-.026-.13-.014-.256-.022a18 18 0 0 1-.735-.102h-.003c-.032 0-.06.01-.074.035l-.003.012q-.081.265-.182.544c.428 1.084.652 2.078.652 2.078.14.22.258.432.363.64a11 11 0 0 1-2.168 1.264 11 11 0 0 1-1.205.426 13.3 13.3 0 0 1 1.055-2.531s.678-1.445 1.027-2.564v-.004a.55.55 0 0 1 .512-.38",
			source: "https://github.com/metacpan/perl-assets/blob/56b555711934dde8fd0b20ec29ecc3bf81a3d493/blessed/src/010.svg",
			hex: "0073A1"
		};
		const siPhp = {
			title: "PHP",
			slug: "php",
			get svg() {
				return c + "PHP" + t + this.path + a;
			},
			path: "M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752a2.836 2.836 0 0 1-.305.847c-.143.255-.33.49-.561.703zm4.024.715l.543-2.799c.063-.318.039-.536-.068-.651-.107-.116-.336-.174-.687-.174H11.46l-.704 3.625H9.388l1.23-6.327h1.367l-.327 1.682h1.218c.767 0 1.295.134 1.586.401s.378.7.263 1.299l-.572 2.944h-1.389zm7.597-2.265a2.782 2.782 0 0 1-.305.847c-.143.255-.33.49-.561.703a2.44 2.44 0 0 1-.917.551c-.336.108-.765.164-1.286.164h-1.18l-.327 1.682h-1.378l1.23-6.326h2.649c.797 0 1.378.209 1.744.628.366.417.477 1.001.331 1.751zM17.766 10.207h-.943l-.516 2.648h.838c.557 0 .971-.105 1.242-.314.272-.21.455-.559.551-1.049.092-.47.049-.802-.125-.995s-.524-.29-1.047-.29z",
			source: "https://php.net/download-logos.php",
			hex: "777BB4",
			license: {
				type: "CC-BY-SA-4.0",
				url: "https://spdx.org/licenses/CC-BY-SA-4.0"
			}
		};
		const siPython = {
			title: "Python",
			slug: "python",
			get svg() {
				return c + "Python" + t + this.path + a;
			},
			path: "M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z",
			source: "https://www.python.org/community/logos/",
			hex: "3776AB",
			guidelines: "https://www.python.org/community/logos/"
		};
		const siR = {
			title: "R",
			slug: "r",
			get svg() {
				return c + "R" + t + this.path + a;
			},
			path: "M12 2.746c-6.627 0-12 3.599-12 8.037 0 3.897 4.144 7.144 9.64 7.88V16.26c-2.924-.915-4.925-2.755-4.925-4.877 0-3.035 4.084-5.494 9.12-5.494 5.038 0 8.757 1.683 8.757 5.494 0 1.976-.999 3.379-2.662 4.272.09.066.174.128.258.216.169.149.25.363.372.544 2.128-1.45 3.44-3.437 3.44-5.631 0-4.44-5.373-8.038-12-8.038zm-2.111 4.99v13.516l4.093-.002-.002-5.291h1.1c.225 0 .321.066.549.25.272.22.715.982.715.982l2.164 4.063 4.627-.002-2.864-4.826s-.086-.193-.265-.383a2.22 2.22 0 00-.582-.416c-.422-.214-1.149-.434-1.149-.434s3.578-.264 3.578-3.826c0-3.562-3.744-3.63-3.744-3.63zm4.127 2.93l2.478.002s1.149-.062 1.149 1.127c0 1.165-1.149 1.17-1.149 1.17h-2.478zm1.754 6.119c-.494.049-1.012.079-1.54.088v1.807a16.622 16.622 0 002.37-.473l-.471-.891s-.108-.183-.248-.394c-.039-.054-.08-.098-.111-.137z",
			source: "https://www.r-project.org/logo/",
			hex: "276DC3",
			license: {
				type: "CC-BY-SA-4.0",
				url: "https://spdx.org/licenses/CC-BY-SA-4.0"
			}
		};
		const siRuby = {
			title: "Ruby",
			slug: "ruby",
			get svg() {
				return c + "Ruby" + t + this.path + a;
			},
			path: "M20.156.083c3.033.525 3.893 2.598 3.829 4.77L24 4.822 22.635 22.71 4.89 23.926h.016C3.433 23.864.15 23.729 0 19.139l1.645-3 2.819 6.586.503 1.172 2.805-9.144-.03.007.016-.03 9.255 2.956-1.396-5.431-.99-3.9 8.82-.569-.615-.51L16.5 2.114 20.159.073l-.003.01zM0 19.089zM5.13 5.073c3.561-3.533 8.157-5.621 9.922-3.84 1.762 1.777-.105 6.105-3.673 9.636-3.563 3.532-8.103 5.734-9.864 3.957-1.766-1.777.045-6.217 3.612-9.75l.003-.003z",
			source: "https://www.ruby-lang.org/en/about/logo/",
			hex: "CC342D",
			license: {
				type: "CC-BY-SA-2.5",
				url: "https://spdx.org/licenses/CC-BY-SA-2.5"
			}
		};
		const siRust = {
			title: "Rust",
			slug: "rust",
			get svg() {
				return c + "Rust" + t + this.path + a;
			},
			path: "M23.8346 11.7033l-1.0073-.6236a13.7268 13.7268 0 00-.0283-.2936l.8656-.8069a.3483.3483 0 00-.1154-.578l-1.1066-.414a8.4958 8.4958 0 00-.087-.2856l.6904-.9587a.3462.3462 0 00-.2257-.5446l-1.1663-.1894a9.3574 9.3574 0 00-.1407-.2622l.49-1.0761a.3437.3437 0 00-.0274-.3361.3486.3486 0 00-.3006-.154l-1.1845.0416a6.7444 6.7444 0 00-.1873-.2268l.2723-1.153a.3472.3472 0 00-.417-.4172l-1.1532.2724a14.0183 14.0183 0 00-.2278-.1873l.0415-1.1845a.3442.3442 0 00-.49-.328l-1.076.491c-.0872-.0476-.1742-.0952-.2623-.1407l-.1903-1.1673A.3483.3483 0 0016.256.955l-.9597.6905a8.4867 8.4867 0 00-.2855-.086l-.414-1.1066a.3483.3483 0 00-.5781-.1154l-.8069.8666a9.2936 9.2936 0 00-.2936-.0284L12.2946.1683a.3462.3462 0 00-.5892 0l-.6236 1.0073a13.7383 13.7383 0 00-.2936.0284L9.9803.3374a.3462.3462 0 00-.578.1154l-.4141 1.1065c-.0962.0274-.1903.0567-.2855.086L7.744.955a.3483.3483 0 00-.5447.2258L7.009 2.348a9.3574 9.3574 0 00-.2622.1407l-1.0762-.491a.3462.3462 0 00-.49.328l.0416 1.1845a7.9826 7.9826 0 00-.2278.1873L3.8413 3.425a.3472.3472 0 00-.4171.4171l.2713 1.1531c-.0628.075-.1255.1509-.1863.2268l-1.1845-.0415a.3462.3462 0 00-.328.49l.491 1.0761a9.167 9.167 0 00-.1407.2622l-1.1662.1894a.3483.3483 0 00-.2258.5446l.6904.9587a13.303 13.303 0 00-.087.2855l-1.1065.414a.3483.3483 0 00-.1155.5781l.8656.807a9.2936 9.2936 0 00-.0283.2935l-1.0073.6236a.3442.3442 0 000 .5892l1.0073.6236c.008.0982.0182.1964.0283.2936l-.8656.8079a.3462.3462 0 00.1155.578l1.1065.4141c.0273.0962.0567.1914.087.2855l-.6904.9587a.3452.3452 0 00.2268.5447l1.1662.1893c.0456.088.0922.1751.1408.2622l-.491 1.0762a.3462.3462 0 00.328.49l1.1834-.0415c.0618.0769.1235.1528.1873.2277l-.2713 1.1541a.3462.3462 0 00.4171.4161l1.153-.2713c.075.0638.151.1255.2279.1863l-.0415 1.1845a.3442.3442 0 00.49.327l1.0761-.49c.087.0486.1741.0951.2622.1407l.1903 1.1662a.3483.3483 0 00.5447.2268l.9587-.6904a9.299 9.299 0 00.2855.087l.414 1.1066a.3452.3452 0 00.5781.1154l.8079-.8656c.0972.0111.1954.0203.2936.0294l.6236 1.0073a.3472.3472 0 00.5892 0l.6236-1.0073c.0982-.0091.1964-.0183.2936-.0294l.8069.8656a.3483.3483 0 00.578-.1154l.4141-1.1066a8.4626 8.4626 0 00.2855-.087l.9587.6904a.3452.3452 0 00.5447-.2268l.1903-1.1662c.088-.0456.1751-.0931.2622-.1407l1.0762.49a.3472.3472 0 00.49-.327l-.0415-1.1845a6.7267 6.7267 0 00.2267-.1863l1.1531.2713a.3472.3472 0 00.4171-.416l-.2713-1.1542c.0628-.0749.1255-.1508.1863-.2278l1.1845.0415a.3442.3442 0 00.328-.49l-.49-1.076c.0475-.0872.0951-.1742.1407-.2623l1.1662-.1893a.3483.3483 0 00.2258-.5447l-.6904-.9587.087-.2855 1.1066-.414a.3462.3462 0 00.1154-.5781l-.8656-.8079c.0101-.0972.0202-.1954.0283-.2936l1.0073-.6236a.3442.3442 0 000-.5892zm-6.7413 8.3551a.7138.7138 0 01.2986-1.396.714.714 0 11-.2997 1.396zm-.3422-2.3142a.649.649 0 00-.7715.5l-.3573 1.6685c-1.1035.501-2.3285.7795-3.6193.7795a8.7368 8.7368 0 01-3.6951-.814l-.3574-1.6684a.648.648 0 00-.7714-.499l-1.473.3158a8.7216 8.7216 0 01-.7613-.898h7.1676c.081 0 .1356-.0141.1356-.088v-2.536c0-.074-.0536-.0881-.1356-.0881h-2.0966v-1.6077h2.2677c.2065 0 1.1065.0587 1.394 1.2088.0901.3533.2875 1.5044.4232 1.8729.1346.413.6833 1.2381 1.2685 1.2381h3.5716a.7492.7492 0 00.1296-.0131 8.7874 8.7874 0 01-.8119.9526zM6.8369 20.024a.714.714 0 11-.2997-1.396.714.714 0 01.2997 1.396zM4.1177 8.9972a.7137.7137 0 11-1.304.5791.7137.7137 0 011.304-.579zm-.8352 1.9813l1.5347-.6824a.65.65 0 00.33-.8585l-.3158-.7147h1.2432v5.6025H3.5669a8.7753 8.7753 0 01-.2834-3.348zm6.7343-.5437V8.7836h2.9601c.153 0 1.0792.1772 1.0792.8697 0 .575-.7107.7815-1.2948.7815zm10.7574 1.4862c0 .2187-.008.4363-.0243.651h-.9c-.09 0-.1265.0586-.1265.1477v.413c0 .973-.5487 1.1846-1.0296 1.2382-.4576.0517-.9648-.1913-1.0275-.4717-.2704-1.5186-.7198-1.8436-1.4305-2.4034.8817-.5599 1.799-1.386 1.799-2.4915 0-1.1936-.819-1.9458-1.3769-2.3153-.7825-.5163-1.6491-.6195-1.883-.6195H5.4682a8.7651 8.7651 0 014.907-2.7699l1.0974 1.151a.648.648 0 00.9182.0213l1.227-1.1743a8.7753 8.7753 0 016.0044 4.2762l-.8403 1.8982a.652.652 0 00.33.8585l1.6178.7188c.0283.2875.0425.577.0425.8717zm-9.3006-9.5993a.7128.7128 0 11.984 1.0316.7137.7137 0 01-.984-1.0316zm8.3389 6.71a.7107.7107 0 01.9395-.3625.7137.7137 0 11-.9405.3635z",
			source: "https://www.rust-lang.org",
			hex: "000000",
			guidelines: "https://www.rust-lang.org/policies/media-guide",
			license: {
				type: "CC-BY-SA-4.0",
				url: "https://spdx.org/licenses/CC-BY-SA-4.0"
			}
		};
		const siSwift = {
			title: "Swift",
			slug: "swift",
			get svg() {
				return c + "Swift" + t + this.path + a;
			},
			path: "M7.508 0c-.287 0-.573 0-.86.002-.241.002-.483.003-.724.01-.132.003-.263.009-.395.015A9.154 9.154 0 0 0 4.348.15 5.492 5.492 0 0 0 2.85.645 5.04 5.04 0 0 0 .645 2.848c-.245.48-.4.972-.495 1.5-.093.52-.122 1.05-.136 1.576a35.2 35.2 0 0 0-.012.724C0 6.935 0 7.221 0 7.508v8.984c0 .287 0 .575.002.862.002.24.005.481.012.722.014.526.043 1.057.136 1.576.095.528.25 1.02.495 1.5a5.03 5.03 0 0 0 2.205 2.203c.48.244.97.4 1.498.495.52.093 1.05.124 1.576.138.241.007.483.009.724.01.287.002.573.002.86.002h8.984c.287 0 .573 0 .86-.002.241-.001.483-.003.724-.01a10.523 10.523 0 0 0 1.578-.138 5.322 5.322 0 0 0 1.498-.495 5.035 5.035 0 0 0 2.203-2.203c.245-.48.4-.972.495-1.5.093-.52.124-1.05.138-1.576.007-.241.009-.481.01-.722.002-.287.002-.575.002-.862V7.508c0-.287 0-.573-.002-.86a33.662 33.662 0 0 0-.01-.724 10.5 10.5 0 0 0-.138-1.576 5.328 5.328 0 0 0-.495-1.5A5.039 5.039 0 0 0 21.152.645 5.32 5.32 0 0 0 19.654.15a10.493 10.493 0 0 0-1.578-.138 34.98 34.98 0 0 0-.722-.01C17.067 0 16.779 0 16.492 0H7.508zm6.035 3.41c4.114 2.47 6.545 7.162 5.549 11.131-.024.093-.05.181-.076.272l.002.001c2.062 2.538 1.5 5.258 1.236 4.745-1.072-2.086-3.066-1.568-4.088-1.043a6.803 6.803 0 0 1-.281.158l-.02.012-.002.002c-2.115 1.123-4.957 1.205-7.812-.022a12.568 12.568 0 0 1-5.64-4.838c.649.48 1.35.902 2.097 1.252 3.019 1.414 6.051 1.311 8.197-.002C9.651 12.73 7.101 9.67 5.146 7.191a10.628 10.628 0 0 1-1.005-1.384c2.34 2.142 6.038 4.83 7.365 5.576C8.69 8.408 6.208 4.743 6.324 4.86c4.436 4.47 8.528 6.996 8.528 6.996.154.085.27.154.36.213.085-.215.16-.437.224-.668.708-2.588-.09-5.548-1.893-7.992z",
			source: "https://developer.apple.com/swift/resources/",
			hex: "F05138",
			guidelines: "https://developer.apple.com/swift/resources/"
		};
		// src/code-ref.ts
		const UNKNOWN = /* @__PURE__ */ new Set([
			"",
			"unknown",
			"none",
			"n/a",
			"na",
			"null",
			"undefined"
		]);
		const FILE_REF = /(?:^|[\s('"[{])((?:[A-Za-z]:)?(?:\.{1,2}[\\/])?(?:[\w.@+-]+[\\/])*[\w.@+-]+\.[A-Za-z][A-Za-z0-9]*)(?::(\d+)(?:-(\d+)|:(\d+))?)?(?:#L(\d+)(?:-L?(\d+))?)?/;
		/** Extract the first workspace file:line mention from an Evidence field. */
		function parseCodeRef(value) {
			if (value === null || value === void 0) return void 0;
			if (isRecord(value)) {
				const path = stringField(value, "path") ?? stringField(value, "file") ?? stringField(value, "locator");
				if (path === void 0 || !looksLikePath(path)) return void 0;
				const line = integerField(value, "line") ?? integerField(value, "startLine");
				const endLine = integerField(value, "endLine") ?? integerField(value, "end_line");
				const note = stringField(value, "note") ?? stringField(value, "detail") ?? "";
				return {
					path: normalizePath$1(path),
					...line === void 0 ? {} : { line },
					...endLine === void 0 ? {} : { endLine },
					note
				};
			}
			const text = typeof value === "string" ? value.trim() : Array.isArray(value) ? value.filter((item) => typeof item === "string").join(" ") : "";
			if (UNKNOWN.has(text.toLowerCase()) || /^https?:\/\//iu.test(text)) return void 0;
			const match = FILE_REF.exec(` ${text}`);
			if (match?.[1] === void 0 || !looksLikePath(match[1])) return void 0;
			const line = parseLine(match[2] ?? match[5]);
			const endLine = parseLine(match[3] ?? match[6]);
			const note = text.replace(match[1], "").replace(/^[:#L\d\s-]+/u, "").trim();
			return {
				path: normalizePath$1(match[1]),
				...line === void 0 ? {} : { line },
				...endLine === void 0 ? {} : { endLine },
				note
			};
		}
		function resolveCodeRef(projectRoot, ref) {
			if (isAbsolutePath(ref.path)) return ref.path;
			return `${projectRoot.replace(/[\\/]+$/u, "")}/${ref.path.replace(/^[\\/]+/u, "")}`;
		}
		function formatCodeRef(ref) {
			if (ref.line === void 0) return ref.path;
			if (ref.endLine === void 0 || ref.endLine === ref.line) return `${ref.path}:${ref.line}`;
			return `${ref.path}:${ref.line}-${ref.endLine}`;
		}
		function looksLikePath(value) {
			if (UNKNOWN.has(value.toLowerCase()) || value.includes("://")) return false;
			return /(?:^|[\\/])[\w.@+-]+\.[A-Za-z][A-Za-z0-9]*$/u.test(value) && !value.includes("..\\..\\..");
		}
		function normalizePath$1(value) {
			return value.replaceAll("\\", "/");
		}
		function isAbsolutePath(value) {
			return value.startsWith("/") || /^[A-Za-z]:\//u.test(value);
		}
		function parseLine(value) {
			if (value === void 0) return void 0;
			const line = Number(value);
			return Number.isInteger(line) && line > 0 ? line : void 0;
		}
		function integerField(record, key) {
			const value = record[key];
			return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : parseLine(typeof value === "string" ? value : void 0);
		}
		function stringField(record, key) {
			const value = record[key];
			return typeof value === "string" && value.trim() !== "" ? value.trim() : void 0;
		}
		function isRecord(value) {
			return value !== null && typeof value === "object" && !Array.isArray(value);
		}
		// src/client/runtime.ts
		function configuredRoot() {
			return window.__DSH_OMV__?.projectRoot ?? ".";
		}
		function decodeSettings(value) {
			if (value === null || typeof value !== "object" || Array.isArray(value)) return void 0;
			const defaultTab = value.defaultTab;
			return isOmvSettingsTab(defaultTab) ? { defaultTab } : DEFAULT_OMV_SETTINGS;
		}
		function localDefaultTab() {
			try {
				const value = window.localStorage.getItem(OMV_LOCAL_TAB_KEY);
				return isOmvSettingsTab(value) ? value : void 0;
			} catch {
				return;
			}
		}
		function persistDefaultTab(settings, tab) {
			try {
				window.localStorage.setItem(OMV_LOCAL_TAB_KEY, tab);
			} catch {}
			const snapshot = settings.getSnapshot();
			if (snapshot.status !== "ready" || !snapshot.writable) return;
			settings.set("defaultTab", tab).catch(() => void 0);
		}
		function sessionRoot(sessions, sessionId) {
			return sessions.list.getSnapshot().byId[sessionId]?.cwd ?? configuredRoot();
		}
		async function api(path, init, projectRoot) {
			const url = new URL(apiUrl(path, projectRoot));
			const response = await fetch(url, {
				...init,
				cache: "no-store",
				headers: {
					...init?.body === void 0 ? {} : { "Content-Type": "application/json" },
					...init?.headers
				}
			});
			const raw = await response.text();
			let payload;
			try {
				payload = JSON.parse(raw);
			} catch {
				throw new Error(`Сервис рабочей области вернул некорректный ответ (HTTP ${response.status}）`);
			}
			if (!response.ok || !payload.ok) throw new Error(payload.ok ? `HTTP ${response.status}` : payload.error.message);
			return payload.data;
		}
		function apiUrl(path, projectRoot) {
			const prefix = window.__DSH_OMV__?.apiPrefix ?? "/api/dsh-omv";
			const url = new URL(`${prefix}${path}`, window.location.origin);
			if (projectRoot !== void 0) url.searchParams.set("root", projectRoot);
			return url.toString();
		}
		function valueAt(root, path) {
			let current = root;
			for (const part of path.split(".")) {
				if (current === null || typeof current !== "object" || Array.isArray(current)) return void 0;
				current = current[part];
			}
			return current;
		}
		function displayValue(value) {
			if (value === void 0 || value === null || value === "") return "unknown";
			if (typeof value === "string") return value;
			try {
				return JSON.stringify(value);
			} catch {
				return String(value);
			}
		}
		function maturityLabel(value) {
			return {
				unmapped: "Ещё не сопоставлено",
				developing: "В разработке",
				supported: "Есть подтверждающие данные",
				verified: "Проверено",
				contested: "Есть противоречия"
			}[value];
		}
		function phaseLabel(value) {
			return {
				discovery: "Поиск",
				analysis: "Анализ",
				verification: "Проверка",
				reporting: "Подготовка отчёта"
			}[value];
		}
		function confidenceLabel(value) {
			return {
				unrated: "Не оценено",
				low: "Низкая",
				medium: "Средняя",
				high: "Высокая"
			}[value];
		}
		function checkStateIcon(value) {
			return value === "verified" || value === "supported" || value === "not_applicable" ? "check" : "alert";
		}
		function statusColor(value) {
			if (value === "confirmed" || value === "report_ready" || value === "disclosed" || value === "active" || value === "completed" || value === "passed" || value === "verified" || value === "supported" || value === "clear" || value === "ready" || value === "selected") return "var(--dsw-alias-state-success-primary, #1f9d63)";
			if (value === "candidate" || value === "investigating" || value === "running" || value === "stopping" || value === "dispatching" || value === "reviewing" || value === "draft" || value === "proposed") return "var(--dsw-alias-state-business-primary, #4d6bfe)";
			if (value === "reproducing" || value === "queued" || value === "pending" || value === "paused" || value === "awaiting_evidence" || value === "partial" || value === "needs_attention" || value === "possible_duplicate" || value === "needs_review" || value === "stale" || value === "warning" || value === "info") return "var(--dsw-alias-state-warn-primary, #b7791f)";
			if (value === "blocked" || value === "failed" || value === "cancelled" || value === "duplicate" || value === "blocker") return "var(--dsw-alias-state-error-primary, #d6433f)";
			return "var(--dsw-alias-label-tertiary, #8b8f98)";
		}
		function qualitySignalLabel(quality) {
			if (quality.blockers > 0) return "Есть препятствия";
			if (quality.warnings > 0) return "Требует внимания";
			if (quality.infos > 0) return "Можно улучшить";
			return "Стабильно";
		}
		function qualitySignalTone(quality) {
			if (quality.blockers > 0) return "blocker";
			if (quality.warnings > 0) return "warning";
			if (quality.infos > 0) return "info";
			return "clear";
		}
		const STATUS_LABELS = {
			candidate: "Кандидат",
			investigating: "Исследуется",
			reproducing: "Воспроизводится",
			confirmed: "Подтверждено",
			report_ready: "Готово к передаче",
			disclosed: "Раскрыто",
			blocked: "Заблокировано",
			archived: "В архиве",
			active: "Активно",
			queued: "В очереди",
			dispatching: "Назначается",
			running: "Выполняется",
			stopping: "Останавливается",
			pending: "Ожидание",
			paused: "Приостановлено",
			completed: "Завершено",
			cancelled: "Отменено",
			needs_attention: "Требует действий",
			failed: "Ошибка",
			awaiting_evidence: "Ожидает доказательств",
			passed: "Пройдено",
			finding: "Находка",
			campaign: "Задача аудита",
			activity: "Активность",
			ready: "Готово",
			missing: "Отсутствует",
			draft: "Черновик",
			approved: "Одобрено",
			rejected: "Отклонено",
			needs_review: "Требует проверки человеком",
			stale: "Требует обновления",
			partial: "Частично подтверждено",
			supported: "Есть подтверждение",
			verified: "Проверено",
			not_applicable: "Пока неприменимо",
			unknown: "Неизвестно",
			clear: "Исключено",
			possible_duplicate: "Возможный дубль",
			duplicate: "Дубль",
			blocker: "Заблокировано",
			warning: "Предупреждение",
			info: "Рекомендация",
			proposed: "Ожидает выбора",
			selected: "Выбрано",
			skipped: "Пропущено"
		};
		function statusLabel(value) {
			return STATUS_LABELS[value] ?? value.replaceAll("_", " ").replace(/\b\w/gu, (char) => char.toUpperCase());
		}
		const CAMPAIGN_LABELS = {
			quick: "Быстрый",
			standard: "Стандартный",
			deep: "Углублённый",
			whitebox: "Белый ящик",
			graybox: "Серый ящик",
			"local-lab": "Локальный эксперимент",
			passive: "Пассивный",
			mixed: "Смешанный",
			"course-report": "Учебный отчёт",
			cve: "CVE",
			vuldb: "VulDB",
			"internal-report": "Внутренний отчёт",
			"research-notes": "Исследовательские заметки"
		};
		function campaignLabel(value) {
			return CAMPAIGN_LABELS[value] ?? value;
		}
		function primaryIntent(stage) {
			if (stage === "candidate" || stage === "investigating" || stage === "archived") return "audit";
			if (stage === "reproducing") return "repro";
			if (stage === "confirmed") return "dedup";
			if (stage === "report_ready") return "report";
			if (stage === "disclosed") return "disclose";
			return "critic";
		}
		function workflowLabel(intent) {
			return {
				audit: "Начать углублённый аудит",
				repro: "Запустить воспроизведение",
				dedup: "Проверить на дубли",
				critic: "Критически проверить выводы",
				report: "Сформировать отчёт",
				disclose: "Подготовить раскрытие"
			}[intent];
		}
		function activityColor(action) {
			if (action.includes("archive") || action.includes("delete")) return "var(--dsw-alias-state-error-primary, #d6433f)";
			if (action.includes("promote") || action.includes("restore")) return "var(--dsw-alias-state-success-primary, #1f9d63)";
			return "var(--dsw-alias-state-business-primary, #4d6bfe)";
		}
		function activityLabel(action) {
			return action.split(".").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
		}
		function formatTime(value) {
			const date = new Date(value);
			return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("zh-CN", {
				dateStyle: "medium",
				timeStyle: "short"
			}).format(date);
		}
		function relativeTime(value) {
			const timestamp = new Date(value).getTime();
			if (!Number.isFinite(timestamp)) return "Только что";
			const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1e3));
			if (seconds < 10) return "Только что";
			if (seconds < 60) return `${seconds} с назад`;
			const minutes = Math.round(seconds / 60);
			if (minutes < 60) return `${minutes} мин назад`;
			const hours = Math.round(minutes / 60);
			if (hours < 24) return `${hours} ч назад`;
			return formatTime(value);
		}
		function normalizePath(value) {
			return value.replaceAll("\\", "/").replace(/\/+$/u, "") || "/";
		}
		function messageOf(error) {
			return error instanceof Error ? error.message : String(error);
		}
		function firstLine$1(value) {
			return value.split(/\r?\n/u, 1)[0] ?? value;
		}
		// src/client/ui.tsx
		function Hero({ eyebrow, title, description, actions }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "omv-hero",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "omv-eyebrow",
						children: eyebrow
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: title }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: description })
				] }), actions !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "omv-hero-actions",
					children: actions
				})]
			});
		}
		function Metric({ label, value, foot, icon, color }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
				className: "omv-metric",
				style: { "--metric-color": color },
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-metric-head",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {
							className: "omv-metric-icon",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
								name: icon,
								size: 13
							})
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: value }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "omv-metric-foot",
						children: foot
					})
				]
			});
		}
		function Maturity({ assessment, compact = false }) {
			const icon = assessment.maturity === "verified" ? "check" : assessment.maturity === "supported" ? "shield" : assessment.maturity === "contested" ? "alert" : "pulse";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "omv-maturity",
				"data-maturity": assessment.maturity,
				title: assessment.summary,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
						name: icon,
						size: compact ? 10 : 11
					}) }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: maturityLabel(assessment.maturity) }),
					!compact && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: confidenceLabel(assessment.confidence) })
				]
			});
		}
		function Status({ value }) {
			const color = statusColor(value);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: "omv-status",
				style: { "--status": color },
				"aria-label": `Статус: ${statusLabel(value)}`,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: statusDotState(value) }), statusLabel(value)]
			});
		}
		function EvidenceStatusLogo({ maturity }) {
			const label = maturity === "verified" ? "Проверено" : maturityLabel(maturity);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "omv-evidence-status-logo",
				"data-maturity": maturity,
				role: "img",
				"aria-label": `Состояние доказательств: ${label}`,
				title: `Состояние доказательств: ${label}`,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 64 64",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "32",
							cy: "32",
							r: "28",
							className: "omv-evidence-logo-ring"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "32",
							cy: "32",
							r: "22",
							className: "omv-evidence-logo-disc"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M32 17.5 45 23v9.1c0 8.4-5.1 14.5-13 17.2-7.9-2.7-13-8.8-13-17.2V23l13-5.5Z",
							className: "omv-evidence-logo-shield"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "m25.5 32.5 4.2 4.2 8.8-9.1",
							className: "omv-evidence-logo-check"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "m48.5 12.5.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6Z",
							className: "omv-evidence-logo-spark"
						})
					]
				})
			});
		}
		function DedupSourceLogo({ source, searched }) {
			const label = {
				nvd_searched: "NVD",
				ghsa_searched: "GitHub Advisory Database",
				ecosystem_db_searched: "Базы экосистем",
				issues_searched: "Задачи и запросы на слияние",
				commits_searched: "История коммитов",
				blogs_searched: "Сайты и блоги"
			}[source] ?? "Внешний источник";
			const common = {
				className: "omv-dedup-source-mark",
				viewBox: "0 0 24 24",
				"aria-hidden": true
			};
			let mark;
			switch (source) {
				case "nvd_searched":
					mark = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
						...common,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 3.2 19 6v5.2c0 4.1-2.6 7.4-7 9.6-4.4-2.2-7-5.5-7-9.6V6l7-2.8Z" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M9.2 10h5.6M9.2 13.2h5.6" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M8.8 16.2h6.4" })
						]
					});
					break;
				case "ghsa_searched":
					mark = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
						...common,
						viewBox: "0 0 24 24",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							fill: "currentColor",
							stroke: "none",
							d: siGithub.path
						})
					});
					break;
				case "ecosystem_db_searched":
					mark = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
						...common,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
								cx: "12",
								cy: "6",
								rx: "7",
								ry: "3"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" })
						]
					});
					break;
				case "issues_searched":
					mark = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
						...common,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M7 6h10a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H9l-4 3v-11a3 3 0 0 1 2-2.8" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M8 11h8M8 14h5" })]
					});
					break;
				case "commits_searched":
					mark = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
						...common,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
								cx: "6",
								cy: "6",
								r: "2.2"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
								cx: "18",
								cy: "12",
								r: "2.2"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
								cx: "6",
								cy: "18",
								r: "2.2"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M8.2 6h3.2c2.2 0 2.2 6 4.4 6M8.2 18h3.2c2.2 0 2.2-6 4.4-6" })
						]
					});
					break;
				case "blogs_searched":
					mark = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
						...common,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "12",
							cy: "12",
							r: "8.5"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M3.8 12h16.4M12 3.5c2.2 2.4 3.4 5.2 3.4 8.5s-1.2 6.1-3.4 8.5c-2.2-2.4-3.4-5.2-3.4-8.5S9.8 5.9 12 3.5Z" })]
					});
					break;
				default: mark = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					...common,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: "12",
						cy: "12",
						r: "8.5"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M8 12h8" })]
				});
			}
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "omv-dedup-source-logo",
				"data-source": source,
				"data-searched": searched || void 0,
				role: "img",
				"aria-label": `${label}：${searched ? "Поиск выполнен" : "Поиск не выполнялся"}`,
				title: `${label} · ${searched ? "Поиск выполнен" : "Поиск не выполнялся"}`,
				children: mark
			});
		}
		function PriorityIssueLogo({ severity }) {
			const kind = severity === "blocker" || severity === "error" ? "blocker" : severity === "warning" ? "warning" : "info";
			const label = kind === "blocker" ? "Препятствия" : kind === "warning" ? "Предупреждения" : "Рекомендации";
			const common = {
				className: "omv-priority-issue-mark",
				viewBox: "0 0 24 24",
				"aria-hidden": true
			};
			const mark = kind === "blocker" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				...common,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m12 3.4 7.2 4.2v8.8L12 20.6l-7.2-4.2V7.6L12 3.4Z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 7.7v5.5M12 16.7h.01" })]
			}) : kind === "warning" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				...common,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					cx: "12",
					cy: "12",
					r: "8.4"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 7.5v5l3.2 2" })]
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				...common,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
					cx: "12",
					cy: "12",
					r: "8.4"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 10.8v5M12 7.5h.01" })]
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "omv-priority-issue-logo",
				"data-severity": kind,
				role: "img",
				"aria-label": label,
				title: label,
				children: mark
			});
		}
		function statusDotState(value) {
			if ([
				"confirmed",
				"report_ready",
				"passed",
				"completed",
				"verified",
				"supported",
				"selected",
				"clear",
				"approved"
			].includes(value)) return "done";
			if ([
				"blocked",
				"failed",
				"error",
				"missing",
				"contested",
				"rejected"
			].includes(value)) return "error";
			if ([
				"candidate",
				"investigating",
				"reproducing",
				"running",
				"queued",
				"pending",
				"awaiting_evidence",
				"partial",
				"open",
				"needs_review"
			].includes(value)) return "ongoing";
			return "warning";
		}
		function EcosystemAvatar({ ecosystem, size = "md" }) {
			const normalized = ecosystem.trim().toLowerCase();
			const label = normalized === "" ? "Неизвестная экосистема" : `${normalized} — экосистема`;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "omv-eco-avatar",
				"data-size": size,
				"data-ecosystem": normalized || "unknown",
				role: "img",
				"aria-label": label,
				title: label,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(EcosystemLogo, {
					ecosystem: normalized,
					fallback: ecosystem.charAt(0).toUpperCase()
				})
			});
		}
		const ECOSYSTEM_ICONS = {
			npm: siNpm,
			python: siPython,
			pypi: siPython,
			pip: siPython,
			go: siGo,
			rust: siRust,
			cargo: siRust,
			java: siOpenjdk,
			ruby: siRuby,
			php: siPhp,
			csharp: siDotnet,
			"c#": siDotnet,
			swift: siSwift,
			dart: siDart,
			elixir: siElixir,
			perl: siPerl,
			r: siR,
			lua: siLua
		};
		function EcosystemLogo({ ecosystem, fallback }) {
			const icon = ECOSYSTEM_ICONS[ecosystem];
			if (icon !== void 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 24 24",
				preserveAspectRatio: "xMidYMid meet",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: icon.path,
					fill: `#${icon.hex}`
				})
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(LegacyEcosystemLogo, {
				ecosystem,
				fallback
			});
		}
		function LegacyEcosystemLogo({ ecosystem, fallback }) {
			switch (ecosystem) {
				case "npm": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 44 20",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						fill: "currentColor",
						d: "M1 1h42v18H22v-3h-7v3H1z"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						fill: "var(--eco-cutout, #fff)",
						d: "M7 5v10h4V8h3v7h4V5zm16 0v10h4V8h3v7h4V5z"
					})]
				});
				case "python":
				case "pypi":
				case "pip": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 24 24",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						fill: "#3776ab",
						d: "M12 2c-4.4 0-4.8 2-4.8 4.5V9h5v1H5.5C2.8 10 2 11.9 2 14s.8 4 3.5 4h2.1v-3c0-2.5 1.5-4 4-4h4.9V6.5C16.5 3.8 15.1 2 12 2m-2.7 2.2h2.3v1.4H9.3z"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						fill: "#ffd343",
						d: "M12 22c4.4 0 4.8-2 4.8-4.5V15h-5v-1h6.7c2.7 0 3.5-1.9 3.5-4s-.8-4-3.5-4h-2.1v3c0 2.5-1.5 4-4 4H7.5v4.5c0 2.7 1.4 4.5 4.5 4.5m2.7-2.2h-2.3v-1.4h2.3z"
					})]
				});
				case "go": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 40 24",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						fill: "#00add8",
						d: "M2 13.5c4.2-7.2 10.5-10.8 18.7-10.8 5.8 0 10.3 1.7 13.6 5.1l-2.1 2.2c-2.8-2.5-6.3-3.8-10.5-3.8-6.1 0-11 2.5-14.8 7.4z"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
						x: "11",
						y: "20",
						fill: "#00add8",
						fontSize: "13",
						fontWeight: "800",
						fontFamily: "Arial, sans-serif",
						children: "go"
					})]
				});
				case "rust":
				case "cargo": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 24 24",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						fill: "#dea584",
						d: "m12 2 2 1.1 2.3-.2 1.1 2 2 1.1-.2 2.3 1.1 2-1.1 2 .2 2.3-2 1.1-1.1 2-2.3-.2-2 1.1-2-1.1-2.3.2-1.1-2-2-1.1.2-2.3-1.1-2 1.1-2-.2-2.3 2-1.1 1.1-2 2.3.2z"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						fill: "#fff",
						d: "M8 8.2h8v1.7h-2.8v5.8h-2.4V9.9H8z"
					})]
				});
				case "java": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 24 24",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							fill: "#e76f00",
							d: "M8 16.3c-1.6.6-2.4 1.3-2.4 2 0 1.4 3 2.5 6.7 2.5s6.7-1.1 6.7-2.5c0-.7-.8-1.4-2.4-2 .5.5.8 1 .8 1.5 0 1.2-2.3 2.1-5.1 2.1s-5.1-.9-5.1-2.1c0-.5.3-1 .8-1.5"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							fill: "#5382a1",
							d: "M8.7 12.6c-1.2.4-1.8 1-1.8 1.6 0 1 2.3 1.8 5.1 1.8s5.1-.8 5.1-1.8c0-.6-.6-1.2-1.8-1.6.3.3.5.6.5.9 0 .8-1.7 1.4-3.8 1.4s-3.8-.6-3.8-1.4c0-.3.2-.6.5-.9"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							fill: "#e76f00",
							d: "M12 3c1.8 1.3-1.2 2.1.5 3.4 1.3 1-1.1 1.9-.2 3.2 1.1-1.9 3.1-2.8 1.2-4.2C12.2 4.5 13.4 3.8 12 3"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							fill: "#5382a1",
							d: "M15.3 2.2c2.3 2-.5 3.2.2 4.4.6 1.1 2.1 1.5 1.4 3.4 2.1-2.2-.3-3.8.5-5.1.7-1.2-.3-2.1-2.1-2.7"
						})
					]
				});
				case "ruby": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 24 24",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						fill: "#cc342d",
						d: "M4 3.5h9.8L21 9.9 12.6 21 3 15.5z"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						fill: "#fff",
						opacity: ".86",
						d: "m6.1 5.4 5.8.1-1.5 5.4zm7.8.2 3.8 4.2-5.3 1.1zm-3 6.4 5.2-1.1-3.8 5z"
					})]
				});
				case "php": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 42 24",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ellipse", {
						cx: "21",
						cy: "12",
						rx: "19",
						ry: "9",
						fill: "#777bb3"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
						x: "7",
						y: "16",
						fill: "#fff",
						fontSize: "10",
						fontWeight: "700",
						fontFamily: "Arial, sans-serif",
						children: "php"
					})]
				});
				case "csharp":
				case "c#": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 24 24",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						fill: "#68217a",
						d: "M12 2.3 21 7v10l-9 4.7L3 17V7z"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
						x: "6.2",
						y: "15.7",
						fill: "#fff",
						fontSize: "10",
						fontWeight: "800",
						fontFamily: "Arial, sans-serif",
						children: "C#"
					})]
				});
				case "swift": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 24 24",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						fill: "#f05138",
						d: "M20.8 15.4c.7-3.4-.8-7.2-4.2-10.4 1.1 2.1 1.5 4 1.2 5.7C15.1 8.7 11.2 6.1 6.6 4.4c3.2 2.6 5.5 5 6.7 7.1-2.8-.8-5.6-2.4-8.4-4.8 2.1 3.3 4.6 5.8 7.6 7.5-2.3.8-5 .5-8-.9 3.5 3.7 7.3 5.1 11.4 4.1 1.4 1 2.2 1.7 2.4 2.1 1.1-.9 2-2.3 2.5-4.1"
					})
				});
				case "dart": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 24 24",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							fill: "#0175c2",
							d: "M4 4h10.4L21 10.6V21H10.4L4 14.6z"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							fill: "#29b6f6",
							d: "M4 4h6.4L21 14.6V21h-6.4L4 14.6z"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							fill: "#fff",
							d: "m12.3 7.1 4.2 4.2-3.1.2 1.3 3-5-4.6 3-.2z"
						})
					]
				});
				case "elixir": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 24 24",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							fill: "#6e4a7e",
							d: "M12 2c1.9 3.3 6.4 7.1 6.4 12.2A6.4 6.4 0 1 1 5.6 14.2C5.6 9.1 10.1 5.3 12 2"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "9.5",
							cy: "14",
							r: "1",
							fill: "#f4b942"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "12",
							cy: "16",
							r: "1",
							fill: "#f4b942"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "14.5",
							cy: "13.5",
							r: "1",
							fill: "#f4b942"
						})
					]
				});
				case "perl": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 24 24",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: "12",
						cy: "12",
						r: "9",
						fill: "#39457f"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
						x: "7.2",
						y: "16",
						fill: "#fff",
						fontSize: "11",
						fontWeight: "800",
						fontFamily: "Georgia, serif",
						children: "P"
					})]
				});
				case "r": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 24 24",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: "12",
						cy: "12",
						r: "9",
						fill: "#276dc3"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
						x: "6.8",
						y: "16",
						fill: "#fff",
						fontSize: "12",
						fontWeight: "800",
						fontFamily: "Arial, sans-serif",
						children: "R"
					})]
				});
				case "lua": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 24 24",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "12",
							cy: "12",
							r: "8.5",
							fill: "#000080"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "15.5",
							cy: "8.5",
							r: "5",
							fill: "var(--eco-bg, #fff)"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							fill: "#fff",
							d: "M6 15.7h2.1l1.1-2.3 1.1 2.3h2.1l-2.1-3.6 2-3.3h-2l-1.1 2-1-2H6l2 3.3z"
						})
					]
				});
				default: return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					children: fallback || "?"
				});
			}
		}
		function Section({ title, meta, children }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "omv-section",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "omv-section-title",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: title }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: meta })]
				}), children]
			});
		}
		function ChainCard({ label, value, onOpen }) {
			const ref = parseCodeRef(value);
			const openable = ref !== void 0 && onOpen !== void 0;
			const body = ref === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: displayValue(value) }) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: formatCodeRef(ref) }), ref.note !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: ref.note })] });
			if (!openable) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "omv-chain-card",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: label }), body]
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "omv-chain-card",
				"data-openable": "true",
				onClick: () => onOpen(ref.path),
				title: `Открыть ${formatCodeRef(ref)}`,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: label }),
					body,
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("em", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
						name: "file",
						size: 11
					}), "Открыть исходный код"] })
				]
			});
		}
		function Modal({ title, onClose, children }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
				open: true,
				onClose,
				title,
				closeLabel: "Закрыть",
				children
			});
		}
		function Field({ label, full = false, children }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: `omv-field${full ? " omv-field-full" : ""}`,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", { children: label }), children]
			});
		}
		function Empty({ label, description, action, compact = false }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "omv-empty",
				style: compact ? { minHeight: 90 } : void 0,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
						name: "inbox",
						size: 24
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: label }),
					description !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: description }),
					action !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "omv-empty-action",
						children: action
					})
				] })
			});
		}
		function Loading({ label = "Синхронизация рабочей области OMV…" }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "omv-loading",
				role: "status",
				"aria-live": "polite",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, { size: 20 }), label] })
			});
		}
		const NATIVE_ICONS = {
			refresh: _deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline16,
			close: _deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16,
			plus: _deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16,
			check: _deepseek_ai_dsh_client_ui_primitives.IconCheckOutline16,
			alert: _deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16,
			chevron: _deepseek_ai_dsh_client_ui_primitives.IconChevronRightOutline14,
			search: _deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16,
			terminal: _deepseek_ai_dsh_client_ui_primitives.IconCodeOutline16,
			campaign: _deepseek_ai_dsh_client_ui_primitives.IconGoalOutline16,
			folder: _deepseek_ai_dsh_client_ui_primitives.IconFolderOpen16,
			maximize: _deepseek_ai_dsh_client_ui_primitives.IconFullscreenOutline16,
			archive: _deepseek_ai_dsh_client_ui_primitives.IconArchiveOutline20,
			eye: _deepseek_ai_dsh_client_ui_primitives.IconBrowseOutline16
		};
		function Icon({ name, size = 16 }) {
			const NativeIcon = NATIVE_ICONS[name];
			if (NativeIcon !== void 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(NativeIcon, { size });
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: size,
				height: size,
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.7",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				"aria-hidden": true,
				children: {
					shield: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 3 5 6v5c0 4.5 2.7 7.7 7 9 4.3-1.3 7-4.5 7-9V6l-7-3Z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m9.4 11.7 1.7 1.7 3.8-4" })] }),
					grid: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
							x: "4",
							y: "4",
							width: "6",
							height: "6",
							rx: "1"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
							x: "14",
							y: "4",
							width: "6",
							height: "6",
							rx: "1"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
							x: "4",
							y: "14",
							width: "6",
							height: "6",
							rx: "1"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
							x: "14",
							y: "14",
							width: "6",
							height: "6",
							rx: "1"
						})
					] }),
					finding: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: "11",
						cy: "11",
						r: "6"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m16 16 4 4M11 8v3M11 14h.01" })] }),
					campaign: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "12",
							cy: "12",
							r: "8"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
							cx: "12",
							cy: "12",
							r: "3"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 4v2M12 18v2M4 12h2M18 12h2" })
					] }),
					pulse: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M3 12h4l2-6 4 12 2-6h6" }),
					refresh: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M20 7v5h-5" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M19 12a7 7 0 1 0-2 5" })] }),
					close: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m6 6 12 12M18 6 6 18" }),
					plus: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 5v14M5 12h14" }),
					check: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m5 12 4 4L19 6" }),
					alert: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 4 3 20h18L12 4Z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 9v5M12 17h.01" })] }),
					chevron: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m9 6 6 6-6 6" }),
					search: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: "11",
						cy: "11",
						r: "6"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m16 16 4 4" })] }),
					terminal: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
						x: "3",
						y: "4",
						width: "18",
						height: "16",
						rx: "2"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m7 9 3 3-3 3M13 15h4" })] }),
					arrowUp: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(react_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m12 19V5M6 11l6-6 6 6" }) }),
					inbox: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M4 5h16v14H4z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M4 14h5l2 2h2l2-2h5" })] }),
					folder: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M3 9h18" })] }),
					file: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M7 3.5h7l5 5V20a1.5 1.5 0 0 1-1.5 1.5h-10.5A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M14 3.5V9h5" })] }),
					copy: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
						x: "8",
						y: "8",
						width: "11",
						height: "11",
						rx: "1.5"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-10A1.5 1.5 0 0 0 3 5.5v10A1.5 1.5 0 0 0 4.5 17H8" })] }),
					maximize: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m3 3 5 5M21 3l-5 5M3 21l5-5M21 21l-5-5" })] }),
					minimize: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(react_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M8 3v5H3M16 3v5h5M8 21v-5H3M21 16h-5v5" }) }),
					archive: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M4 7.5h16v12H4z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M3 4.5h18v3H3zM9 12h6" })] }),
					activity: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M3 12h4l2-6 4 12 2-6h6" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: "3",
						cy: "12",
						r: "1",
						fill: "currentColor",
						stroke: "none"
					})] }),
					clock: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: "12",
						cy: "12",
						r: "8.5"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 7v5l3 2" })] }),
					eye: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: "12",
						cy: "12",
						r: "2.6"
					})] })
				}[name]
			});
		}
		// src/client/types.ts
		/** Public product name. Keep the package id (`dsh-omv`) stable for upgrades. */
		const OMV_DISPLAY_NAME = "Панель аудита OMV";
		const OMV_COMMANDS = [
			"omv",
			"omv-health",
			"omv-runtime",
			"omv-finding",
			"omv-validate",
			"omv-init",
			"omv-new",
			"omv-link",
			"omv-repro",
			"omv-promote",
			"omv-run",
			"omv-campaign",
			"omv-campaign-repair",
			"omv-campaign-seed",
			"omv-campaign-surfaces",
			"omv-search",
			"omv-campaign-run",
			"omv-campaign-lane",
			"omv-quality",
			"omv-dedup"
		];
		/** Wire tools that belong to the OMV capability domain and get its native chat card. */
		const OMV_TOOL_NAMES = [
			"omv_workspace_overview",
			"omv_workspace_health",
			"omv_runtime_status",
			"omv_finding_inspect",
			"omv_finding_validate",
			"omv_finding_create",
			"omv_workflow_link",
			"omv_finding_repro_init",
			"omv_finding_promote",
			"omv_workflow_history",
			"omv_campaign_inspect",
			"omv_campaign_repair",
			"omv_campaign_seed",
			"omv_campaign_surfaces",
			"omv_workspace_search",
			"omv_campaign_run_inspect",
			"omv_campaign_lane_update",
			"omv_evidence_graph",
			"omv_quality_gate",
			"omv_quality_overview",
			"omv_dedup_scan",
			"omv_repro_run_start",
			"omv_repro_run_finish",
			"omv_poc_generate",
			"omv_poc_draft_save",
			"omv_poc_draft_approve",
			"omv_poc_run",
			"omv_poc_run_inspect",
			"omv_poc_evidence_adopt"
		];
		// src/client/omv-toolview.tsx
		const ACTION_LABELS = {
			omv_workspace_overview: "Прочитать состояние аудита",
			omv_workspace_health: "Проверить базовую среду",
			omv_runtime_status: "Прочитать состояние среды выполнения",
			omv_finding_inspect: "Прочитать находку",
			omv_finding_validate: "Проверить доказательства",
			omv_finding_create: "Создать потенциальную находку",
			omv_workflow_link: "Связать чат аудита",
			omv_finding_repro_init: "Подготовить материалы воспроизведения",
			omv_finding_promote: "Обновить статус находки",
			omv_workflow_history: "Прочитать историю процесса",
			omv_campaign_inspect: "Прочитать план аудита",
			omv_campaign_repair: "Исправить план аудита",
			omv_campaign_seed: "Инициализировать план аудита",
			omv_campaign_surfaces: "Предложить поверхности атаки",
			omv_workspace_search: "Поиск по рабочей области OMV",
			omv_campaign_run_inspect: "Прочитать запуск плана аудита",
			omv_campaign_lane_update: "Передать результат направления аудита",
			omv_evidence_graph: "Прочитать граф доказательств",
			omv_quality_gate: "Проверить условия готовности отчёта",
			omv_quality_overview: "Прочитать оценку качества доказательств",
			omv_dedup_scan: "Найти сведения о возможных дублях",
			omv_repro_run_start: "Начать запуск воспроизведения",
			omv_repro_run_finish: "Завершить запуск воспроизведения",
			omv_poc_generate: "Сгенерировать PoC",
			omv_poc_draft_save: "Сохранить черновик PoC",
			omv_poc_draft_approve: "Одобрить черновик PoC",
			omv_poc_run: "Запустить PoC",
			omv_poc_run_inspect: "Прочитать запуск PoC",
			omv_poc_evidence_adopt: "Принять доказательства PoC"
		};
		const ACTION_ICONS = {
			omv_workspace_overview: "grid",
			omv_workspace_health: "pulse",
			omv_runtime_status: "activity",
			omv_finding_inspect: "finding",
			omv_finding_validate: "check",
			omv_finding_create: "plus",
			omv_workflow_link: "chevron",
			omv_finding_repro_init: "terminal",
			omv_finding_promote: "arrowUp",
			omv_workflow_history: "clock",
			omv_campaign_inspect: "campaign",
			omv_campaign_repair: "refresh",
			omv_campaign_seed: "plus",
			omv_campaign_surfaces: "search",
			omv_workspace_search: "search",
			omv_campaign_run_inspect: "eye",
			omv_campaign_lane_update: "check",
			omv_evidence_graph: "activity",
			omv_quality_gate: "shield",
			omv_quality_overview: "grid",
			omv_dedup_scan: "search",
			omv_repro_run_start: "terminal",
			omv_repro_run_finish: "check",
			omv_poc_generate: "plus",
			omv_poc_draft_save: "file",
			omv_poc_draft_approve: "check",
			omv_poc_run: "terminal",
			omv_poc_run_inspect: "eye",
			omv_poc_evidence_adopt: "arrowUp"
		};
		const ARGUMENT_KEYS = {
			omv_finding_inspect: ["id"],
			omv_finding_validate: ["id"],
			omv_finding_create: ["id"],
			omv_workflow_link: ["id"],
			omv_finding_repro_init: ["id"],
			omv_finding_promote: ["id", "status"],
			omv_workflow_history: ["id"],
			omv_campaign_inspect: ["id"],
			omv_campaign_repair: ["id"],
			omv_campaign_seed: ["id"],
			omv_campaign_surfaces: ["id"],
			omv_workspace_search: ["query"],
			omv_campaign_run_inspect: ["runId"],
			omv_campaign_lane_update: [
				"laneId",
				"runId",
				"status"
			],
			omv_evidence_graph: ["id"],
			omv_quality_gate: ["id"],
			omv_dedup_scan: ["id"],
			omv_repro_run_start: ["id"],
			omv_repro_run_finish: ["runId"],
			omv_poc_generate: ["id"],
			omv_poc_draft_save: ["id"],
			omv_poc_draft_approve: ["id"],
			omv_poc_run: ["id"],
			omv_poc_run_inspect: ["runId"],
			omv_poc_evidence_adopt: ["id", "runId"]
		};
		function argsRaw(block) {
			return "kind" in block ? block.call?.argsRaw ?? "" : block.argsRaw;
		}
		function parsedArgs(block) {
			try {
				const value = JSON.parse(argsRaw(block));
				return typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
			} catch {
				return;
			}
		}
		function salientArgument(toolName, block) {
			const args = parsedArgs(block);
			if (args === void 0) return void 0;
			for (const key of ARGUMENT_KEYS[toolName] ?? []) {
				const value = args[key];
				if (typeof value === "string" && value !== "") return `${key}=${value}`;
			}
		}
		function presentationTitle(block) {
			return ("kind" in block ? block.resultView ?? block.callView : block.callView)?.title;
		}
		function settledContent(block) {
			if (!("kind" in block)) return void 0;
			if (block.isError) return block.error === void 0 ? "error" : `${block.error.name}: ${block.error.code}`;
			if (block.content.length === 0) return "No output";
			return block.content.map((content) => content.type === "text" ? content.text : JSON.stringify(content, null, 2)).join("\n") || "No output";
		}
		function resultText(block) {
			const text = settledContent(block);
			return text === void 0 ? void 0 : firstLine(text);
		}
		function firstLine(value) {
			const line = value.split(/\r?\n/u, 1)[0] ?? value;
			return line.length > 180 ? `${line.slice(0, 177)}…` : line;
		}
		function fullResultText(block) {
			return settledContent(block);
		}
		/** UI state derived from the immutable running-or-settled tool block. */
		function toolState(block) {
			if (!("kind" in block)) return "running";
			if (block.error?.code === "interrupted") return "stopped";
			return block.isError ? "error" : "ok";
		}
		function stateLabel(state) {
			return state === "running" ? "Выполняется" : state === "error" ? "Ошибка" : state === "stopped" ? "Прервано" : "Завершено";
		}
		/**
		* Derive the OMV card from the tool block only; no workspace or network reads
		* are allowed because the same projection runs during session replay.
		* @param toolName - wire name of the OMV tool.
		* @param block - frozen running or settled tool block.
		* @returns render-ready card fields.
		*/
		function deriveOmvToolCard(toolName, block) {
			const args = argsRaw(block);
			const preview = resultText(block) ?? salientArgument(toolName, block);
			const output = fullResultText(block);
			return {
				state: toolState(block),
				title: presentationTitle(block) ?? ACTION_LABELS[toolName] ?? "Инструмент OMV",
				...preview === void 0 ? {} : { preview },
				...output === void 0 ? {} : { output },
				args
			};
		}
		/** Compact OMV-specific Tool card rendered through the official Tool view slot. */
		function OmvToolRow({ toolName, block, inspect }) {
			const [expanded, setExpanded] = (0, react.useState)(false);
			const { state, title, preview, output, args } = deriveOmvToolCard(toolName, block);
			const argument = salientArgument(toolName, block);
			const expandable = args !== "" || output !== void 0;
			const toggle = () => {
				if (expandable) setExpanded((value) => !value);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "omv-tool-card",
				"data-omv-tool": toolName,
				"data-state": state,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.DisclosureRow, {
					icon: state === "error" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: "error" }) : state === "stopped" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: "warning" }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
						name: "shield",
						size: 14
					}),
					title: "OMV",
					open: expanded && expandable,
					expandable,
					expandOnRowClick: true,
					keepContentWhenOpen: true,
					onToggle: toggle,
					rowClassName: "omv-tool-card-row",
					leadingClassName: "omv-tool-card-leading",
					collapsedContent: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "omv-tool-card-brand",
							children: "OMV"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: "omv-tool-card-action",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
								name: ACTION_ICONS[toolName] ?? "activity",
								size: 13
							}), title]
						}),
						preview !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "omv-tool-card-preview",
							children: preview
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: "omv-tool-card-state",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: state === "running" ? "ongoing" : state === "error" ? "error" : state === "stopped" ? "warning" : "done" }), stateLabel(state)]
						})
					] }),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-tool-card-body",
						children: [
							argument !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "omv-tool-card-argument",
								children: argument
							}),
							args !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", { children: args }),
							output !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "omv-tool-card-output",
								children: output
							}),
							inspect !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								size: "sm",
								className: "omv-tool-card-inspect",
								icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconInspectOutline12, {}),
								onClick: (event) => {
									event.stopPropagation();
									inspect();
								},
								children: "Найти в трассировке"
							})
						]
					})
				})
			});
		}
		/** Register one OMV row for each OMV wire tool; slot disposal follows the plugin fiber. */
		function registerOmvToolViews(ctx) {
			ctx.slots.inject("tool.call.toolview", function* () {
				for (const key of OMV_TOOL_NAMES) yield ctx.slots.register({
					name: "tool.call.toolview",
					key
				}, OmvToolRow);
			});
		}
		// src/client/derive.ts
		/**
		* Pure client-side derivations. Kept free of React so they can be unit tested
		* in plain node (the client has no DOM test harness).
		*/
		/** Evidence.v1 dedup search flags, in methodology order: advisory databases then public discussion. */
		const DEDUP_SOURCES = [
			{
				key: "nvd_searched",
				label: "NVD",
				group: "advisory"
			},
			{
				key: "ghsa_searched",
				label: "GHSA",
				group: "advisory"
			},
			{
				key: "ecosystem_db_searched",
				label: "Базы экосистем",
				group: "advisory"
			},
			{
				key: "issues_searched",
				label: "Задачи / PR",
				group: "discussion"
			},
			{
				key: "commits_searched",
				label: "Коммиты",
				group: "discussion"
			},
			{
				key: "blogs_searched",
				label: "Сайты / блоги",
				group: "discussion"
			}
		];
		function valueAtPath(root, path) {
			let current = root;
			for (const part of path.split(".")) {
				if (current === null || current === void 0 || typeof current !== "object" || Array.isArray(current)) return void 0;
				current = current[part];
			}
			return current;
		}
		/** Read the six Evidence.v1 dedup booleans; unreported older findings read as not-searched. */
		function dedupSources(evidence) {
			return DEDUP_SOURCES.map((source) => ({
				...source,
				searched: valueAtPath(evidence, `dedup.${source.key}`) === true
			}));
		}
		/** All advisory + discussion sources searched — the contract's novelty precondition. */
		function dedupComplete(evidence) {
			return dedupSources(evidence).every((source) => source.searched);
		}
		function dedupExistingCve(evidence) {
			const value = valueAtPath(evidence, "dedup.existing_cve");
			if (value === void 0 || value === null || value === "") return "unknown";
			return String(value);
		}
		/** Finding ids become file names and CLI args; keep them to registry-style slugs. */
		function findingIdError(id) {
			const value = id.trim();
			if (value === "") return "Укажите идентификатор находки";
			if (value !== id) return "Идентификатор не должен начинаться или заканчиваться пробелами";
			if (!/^[a-z0-9][a-z0-9-]*$/u.test(value)) return "Только строчные латинские буквы, цифры и дефисы, например npm-package-ssrf";
			if (value.length > 80) return "Идентификатор слишком длинный: не более 80 знаков";
		}
		const INTERACTIVE_SELECTOR = "button, a, input, select, textarea, summary, [contenteditable], [role=\"button\"], [role=\"option\"], [role=\"tab\"]";
		/**
		* Letter shortcuts (r, /) must not fire while the user is focused on an
		* interactive element — otherwise pressing r on a focused button refreshes the
		* workspace mid-click. Digit shortcuts (1-9, 0) are safe everywhere.
		*/
		function shouldHandleShortcut(target, key) {
			if (typeof key === "string" && /^[0-9]$/u.test(key)) return true;
			if (target === null || typeof target.closest !== "function") return true;
			return target.closest(INTERACTIVE_SELECTOR) === null;
		}
		/** A run needs a lane pump while any lane is still queued. Terminal runs never do. */
		function runNeedsPump(run) {
			if (run === void 0) return false;
			if (run.status !== "running" && run.status !== "queued" && run.status !== "paused") return false;
			return run.lanes.some((lane) => lane.status === "queued");
		}
		/** Watch a run for reconciliation while it can still make progress. */
		function runActive(run) {
			return run.status === "running" || run.status === "queued" || run.status === "paused";
		}
		// src/client/hooks.ts
		const REFRESH_INTERVAL_MS = 15e3;
		/**
		* Dashboard loading with three refresh sources (initial, timer, SSE/action)
		* coalesced through a single in-flight promise, and identical payloads
		* (same generatedAt) skip setState to avoid full-tree re-renders.
		*/
		function useDashboard(projectRoot) {
			const [dashboard, setDashboard] = (0, react.useState)();
			const [loading, setLoading] = (0, react.useState)(true);
			const [error, setError] = (0, react.useState)();
			const [refreshError, setRefreshError] = (0, react.useState)();
			const [lastUpdated, setLastUpdated] = (0, react.useState)();
			const dashboardRef = (0, react.useRef)();
			const inFlight = (0, react.useRef)();
			const load = (0, react.useCallback)(async (quiet, force = false) => {
				if (!force && inFlight.current !== void 0) return inFlight.current;
				const request = (async () => {
					if (force && inFlight.current !== void 0) await inFlight.current.catch(() => void 0);
					if (!quiet) setLoading(true);
					try {
						const next = await api("/dashboard", void 0, projectRoot);
						const previous = dashboardRef.current;
						if (force || previous === void 0 || next.generatedAt !== previous.generatedAt) {
							dashboardRef.current = next;
							setDashboard(next);
						}
						setError(void 0);
						setRefreshError(void 0);
						setLastUpdated(next.generatedAt);
					} catch (caught) {
						const message = messageOf(caught);
						if (quiet) setRefreshError(message);
						else setError(message);
					} finally {
						if (!quiet) setLoading(false);
						inFlight.current = void 0;
					}
				})();
				inFlight.current = request;
				return request;
			}, [projectRoot]);
			const reload = (0, react.useCallback)(() => load(false), [load]);
			const refreshQuietly = (0, react.useCallback)(() => load(true), [load]);
			const refreshForced = (0, react.useCallback)(() => load(true, true), [load]);
			(0, react.useEffect)(() => {
				reload();
			}, [reload]);
			(0, react.useEffect)(() => {
				const interval = window.__DSH_OMV__?.refreshIntervalMs ?? REFRESH_INTERVAL_MS;
				if (interval <= 0) return;
				const id = window.setInterval(() => {
					refreshQuietly();
				}, interval);
				return () => window.clearInterval(id);
			}, [refreshQuietly]);
			return {
				dashboard,
				loading,
				error,
				refreshError,
				lastUpdated,
				reload,
				refreshQuietly,
				refreshForced
			};
		}
		/**
		* SSE subscription plus the cross-component refresh bus. Workspace events are
		* parsed defensively: a malformed frame downgrades to fallback instead of
		* throwing inside the listener.
		*/
		function useOmvEvents(projectRoot, onWorkspaceChange) {
			const [live, setLive] = (0, react.useState)("connecting");
			const changeRef = (0, react.useRef)(onWorkspaceChange);
			(0, react.useEffect)(() => {
				changeRef.current = onWorkspaceChange;
			}, [onWorkspaceChange]);
			(0, react.useEffect)(() => {
				const onRefresh = (event) => {
					const root = event.detail?.projectRoot;
					if (root === void 0 || root === projectRoot) changeRef.current();
				};
				window.addEventListener("dsh-omv:refresh", onRefresh);
				return () => window.removeEventListener("dsh-omv:refresh", onRefresh);
			}, [projectRoot]);
			(0, react.useEffect)(() => {
				if (typeof EventSource === "undefined") {
					setLive("fallback");
					return;
				}
				const source = new EventSource(apiUrl("/events", projectRoot));
				source.addEventListener("ready", () => setLive("live"));
				source.addEventListener("workspace", (event) => {
					setLive("live");
					try {
						JSON.parse(event.data);
						changeRef.current();
					} catch {
						setLive("fallback");
					}
				});
				source.onerror = () => setLive("fallback");
				return () => source.close();
			}, [projectRoot]);
			return { live };
		}
		/** Per-action busy tracking replacing the single global freeze. */
		function useActionState() {
			const [pending, setPending] = (0, react.useState)(() => /* @__PURE__ */ new Set());
			const isBusy = (0, react.useCallback)((...keys) => keys.some((key) => pending.has(key)), [pending]);
			const run = (0, react.useCallback)(async (key, task) => {
				setPending((previous) => new Set(previous).add(key));
				try {
					await task();
				} finally {
					setPending((previous) => {
						const next = new Set(previous);
						next.delete(key);
						return next;
					});
				}
			}, []);
			return {
				anyBusy: pending.size > 0,
				isBusy,
				run
			};
		}
		const RECONCILE_INTERVAL_MS = 5e3;
		/**
		* Campaign orchestration detached from view state. Watched runs live in a ref
		* (not component state), so closing the detail panel no longer stalls queued
		* lanes. A single interval reconciles every watched active run; the reconcile
		* result drives both lane pumping and detail refresh.
		*/
		function useCampaignRunner(options) {
			const { projectRoot, sessions, onCampaignUpdated, onToast, runAction } = options;
			const watched = (0, react.useRef)(/* @__PURE__ */ new Map());
			const lastSeen = (0, react.useRef)(/* @__PURE__ */ new Map());
			const pumping = (0, react.useRef)(/* @__PURE__ */ new Set());
			const optionsRef = (0, react.useRef)({
				projectRoot,
				sessions,
				onCampaignUpdated
			});
			(0, react.useEffect)(() => {
				optionsRef.current = {
					projectRoot,
					sessions,
					onCampaignUpdated
				};
			}, [
				projectRoot,
				sessions,
				onCampaignUpdated
			]);
			const pump = (0, react.useCallback)(async (runId) => {
				if (pumping.current.has(runId)) return;
				pumping.current.add(runId);
				const { projectRoot: root, sessions: faces, onCampaignUpdated: notify } = optionsRef.current;
				try {
					const dispatches = await api("/action", {
						method: "POST",
						body: JSON.stringify({
							action: "campaign.run.claim",
							runId
						})
					}, root);
					for (const dispatch of dispatches) {
						let childId;
						try {
							childId = await faces.fork({
								sessionId: dispatch.parentSessionId,
								increaseTitle: true
							});
							const scope = faces.scope(childId);
							const face = scope === void 0 ? void 0 : faces.sessionOf(scope);
							if (face === void 0) throw new Error("Создание чата направления аудита ещё недоступно");
							await api("/action", {
								method: "POST",
								body: JSON.stringify({
									action: "campaign.run.bind",
									runId,
									laneId: dispatch.laneId,
									sessionId: childId
								})
							}, root);
							const renamed = await face.rename(`OMV · ${dispatch.campaignId}/${dispatch.laneId}`);
							if (!renamed.ok) throw new Error(`${renamed.error.code}: ${renamed.error.message}`);
							const accepted = await face.prompt([{
								type: "text",
								text: dispatch.prompt
							}], "queue");
							if (!accepted.ok) throw new Error(`${accepted.error.code}: ${accepted.error.message}`);
						} catch (caught) {
							await api("/action", {
								method: "POST",
								body: JSON.stringify({
									action: "campaign.run.lane.update",
									runId,
									laneId: dispatch.laneId,
									laneStatus: "failed",
									...childId === void 0 ? {} : { sessionId: childId },
									summary: messageOf(caught)
								})
							}, root);
						}
					}
					if (dispatches.length > 0) notify(runId);
				} finally {
					pumping.current.delete(runId);
				}
			}, []);
			const watch = (0, react.useCallback)((run) => {
				watched.current.set(run.id, run.campaignId);
			}, []);
			const control = (0, react.useCallback)(async (runId, controlAction, laneId) => {
				await runAction(`campaign.run:${runId}:${controlAction}:${laneId ?? "all"}`, async () => {
					try {
						if (controlAction === "cancel") {
							const run = await api(`/campaign-run?id=${encodeURIComponent(runId)}`, void 0, projectRoot);
							for (const lane of run.lanes) {
								if (lane.sessionId === void 0 || lane.status !== "running" && lane.status !== "dispatching") continue;
								const scope = sessions.scope(lane.sessionId);
								const face = scope === void 0 ? void 0 : sessions.sessionOf(scope);
								if (face !== void 0) await face.cancel();
							}
						}
						const run = await api("/action", {
							method: "POST",
							body: JSON.stringify({
								action: "campaign.run.control",
								runId,
								control: controlAction,
								...laneId === void 0 ? {} : { laneId }
							})
						}, projectRoot);
						watched.current.set(run.id, run.campaignId);
						onToast("ok", `Запуск плана аудита: ${controlAction === "pause" ? "Приостановить" : controlAction === "resume" ? "Возобновить" : controlAction === "cancel" ? "Отмена" : "Добавить в очередь повторного выполнения"}`);
						onCampaignUpdated(run.campaignId);
						if (controlAction === "resume" || controlAction === "retry") await pump(run.id);
					} catch (caught) {
						onToast("error", messageOf(caught));
					}
				});
			}, [
				onCampaignUpdated,
				onToast,
				projectRoot,
				pump,
				runAction,
				sessions
			]);
			(0, react.useEffect)(() => {
				const id = window.setInterval(() => {
					if (watched.current.size === 0) return;
					const { projectRoot: root, onCampaignUpdated: notify } = optionsRef.current;
					for (const [runId, campaignId] of watched.current) api("/action", {
						method: "POST",
						body: JSON.stringify({
							action: "campaign.run.reconcile",
							runId
						})
					}, root).then((run) => {
						const previous = lastSeen.current.get(run.id);
						lastSeen.current.set(run.id, run.updatedAt);
						if (runActive(run)) {
							if (previous !== void 0 && previous !== run.updatedAt) notify(campaignId);
							if (runNeedsPump(run)) pump(run.id);
							return;
						}
						watched.current.delete(run.id);
						lastSeen.current.delete(run.id);
						notify(campaignId);
					}).catch(() => {});
				}, RECONCILE_INTERVAL_MS);
				return () => window.clearInterval(id);
			}, [pump]);
			return {
				watch,
				pump,
				control
			};
		}
		const CANVAS_MIN_SCALE = .4;
		const CANVAS_MAX_SCALE = 2.2;
		const CANVAS_FIT_MAX_SCALE = 1.6;
		function clampViewport(viewport, viewWidth, viewHeight, contentWidth, contentHeight) {
			const margin = 12;
			const scaledWidth = contentWidth * viewport.k;
			const scaledHeight = contentHeight * viewport.k;
			const tx = scaledWidth <= viewWidth - 24 ? (viewWidth - scaledWidth) / 2 : Math.min(margin, Math.max(viewWidth - scaledWidth - margin, viewport.tx));
			const ty = scaledHeight <= viewHeight - 24 ? (viewHeight - scaledHeight) / 2 : Math.min(margin, Math.max(viewHeight - scaledHeight - margin, viewport.ty));
			return {
				...viewport,
				tx,
				ty
			};
		}
		/**
		* Fit-on-mount / fit-on-resize scale for an oversized SVG canvas plus cursor
		* anchored wheel zoom and drag panning. `resetKey` re-fits whenever the
		* underlying content identity changes (e.g. a new graph).
		*/
		function useCanvasViewport(containerRef, contentWidth, contentHeight, maxViewHeight = 320, resetKey) {
			const [viewport, setViewport] = (0, react.useState)({
				k: 1,
				tx: 0,
				ty: 0
			});
			const [viewWidth, setViewWidth] = (0, react.useState)(0);
			const dragRef = (0, react.useRef)(void 0);
			const fit = (0, react.useCallback)(() => {
				const width = containerRef.current?.clientWidth ?? 0;
				if (width === 0) return;
				setViewWidth((previous) => previous === width ? previous : width);
				const widthScale = (width - 24) / contentWidth;
				const heightScale = (maxViewHeight - 24) / contentHeight;
				setViewport(clampViewport({
					k: Math.max(CANVAS_MIN_SCALE, Math.min(CANVAS_FIT_MAX_SCALE, widthScale, heightScale)),
					tx: 0,
					ty: 0
				}, width, maxViewHeight, contentWidth, contentHeight));
			}, [
				containerRef,
				contentHeight,
				contentWidth,
				maxViewHeight
			]);
			(0, react.useEffect)(() => {
				fit();
			}, [fit, resetKey]);
			(0, react.useEffect)(() => {
				const element = containerRef.current;
				if (element === null || typeof ResizeObserver === "undefined") return;
				const observer = new ResizeObserver(() => {
					fit();
				});
				observer.observe(element);
				return () => observer.disconnect();
			}, [containerRef, fit]);
			return {
				viewport,
				viewWidth,
				fit,
				zoomBy: (0, react.useCallback)((factor) => {
					setViewport((previous) => {
						const k = Math.min(CANVAS_MAX_SCALE, Math.max(CANVAS_MIN_SCALE, previous.k * factor));
						const width = containerRef.current?.clientWidth ?? 0;
						const cx = width / 2;
						return clampViewport({
							k,
							tx: cx - (cx - previous.tx) / previous.k * k,
							ty: previous.ty
						}, width, maxViewHeight, contentWidth, contentHeight);
					});
				}, [
					containerRef,
					contentHeight,
					contentWidth,
					maxViewHeight
				]),
				onWheel: (0, react.useCallback)((event) => {
					if (!event.ctrlKey && !event.metaKey && Math.abs(event.deltaY) < 2) return;
					event.preventDefault();
					setViewport((previous) => {
						const k = Math.min(CANVAS_MAX_SCALE, Math.max(CANVAS_MIN_SCALE, previous.k * (1 - event.deltaY * .0018)));
						const rect = containerRef.current?.getBoundingClientRect();
						const cx = event.clientX - (rect?.left ?? 0);
						const width = containerRef.current?.clientWidth ?? 0;
						return clampViewport({
							k,
							tx: cx - (cx - previous.tx) / previous.k * k,
							ty: previous.ty
						}, width, maxViewHeight, contentWidth, contentHeight);
					});
				}, [
					containerRef,
					contentHeight,
					contentWidth,
					maxViewHeight
				]),
				onPointerDown: (0, react.useCallback)((event) => {
					dragRef.current = {
						x: event.clientX,
						y: event.clientY,
						tx: viewport.tx,
						ty: viewport.ty
					};
					event.currentTarget.setPointerCapture(event.pointerId);
				}, [viewport.tx, viewport.ty]),
				onPointerMove: (0, react.useCallback)((event) => {
					const drag = dragRef.current;
					if (drag === void 0) return;
					const width = containerRef.current?.clientWidth ?? 0;
					setViewport((previous) => clampViewport({
						...previous,
						tx: drag.tx + (event.clientX - drag.x),
						ty: drag.ty + (event.clientY - drag.y)
					}, width, maxViewHeight, contentWidth, contentHeight));
				}, [
					containerRef,
					contentHeight,
					contentWidth,
					maxViewHeight
				]),
				onPointerUp: (0, react.useCallback)(() => {
					dragRef.current = void 0;
				}, []),
				onPointerCancel: (0, react.useCallback)(() => {
					dragRef.current = void 0;
				}, [])
			};
		}
		// src/client/graph-layout.ts
		const DEFAULT_GRAPH_LAYOUT = {
			nodeWidth: 208,
			nodeHeight: 58,
			columnGap: 84,
			rowGap: 16,
			padding: 20
		};
		/**
		* Rendering order inside a column. Keep the source → sink → guard chain on
		* the same horizontal rail, then place claim → reproducer → observation below
		* it. This avoids the two primary evidence paths crossing one another.
		*/
		const KIND_ORDER = {
			finding: 0,
			source: 1,
			sink: 2,
			guard: 3,
			claim: 4,
			reproducer: 5,
			observation: 6,
			session: 7,
			artifact: 8
		};
		function openablePathOf(node) {
			if (node.codeRef?.path !== void 0 && node.codeRef.path !== "") return node.codeRef.path;
			return node.value.match(/(?:^|\s)([^\s:]+\.[A-Za-z0-9]+):\d+(?:-\d+|:\d+)?/)?.[1];
		}
		function layoutEvidenceGraph(graph, options = DEFAULT_GRAPH_LAYOUT) {
			const { nodeWidth, nodeHeight, columnGap, rowGap, padding } = options;
			const byId = new Map(graph.nodes.map((node) => [node.id, node]));
			const outgoing = /* @__PURE__ */ new Map();
			const incoming = /* @__PURE__ */ new Map();
			for (const edge of graph.edges) {
				if (!byId.has(edge.from) || !byId.has(edge.to)) continue;
				outgoing.set(edge.from, [...outgoing.get(edge.from) ?? [], edge]);
				incoming.set(edge.to, [...incoming.get(edge.to) ?? [], edge]);
			}
			const layerOf = /* @__PURE__ */ new Map();
			const visiting = /* @__PURE__ */ new Set();
			const depth = (id) => {
				const cached = layerOf.get(id);
				if (cached !== void 0) return cached;
				if (visiting.has(id)) return 0;
				visiting.add(id);
				let level = 0;
				const parents = incoming.get(id) ?? [];
				for (const edge of parents) level = Math.max(level, depth(edge.from) + 1);
				if (parents.length === 0 && byId.get(id)?.kind !== "finding") level = Math.max(level, 1);
				visiting.delete(id);
				layerOf.set(id, level);
				return level;
			};
			for (const node of graph.nodes) depth(node.id);
			const maxLayer = Math.max(0, ...graph.nodes.map((node) => layerOf.get(node.id) ?? 0));
			const columns = Array.from({ length: maxLayer + 1 }, () => []);
			for (const node of graph.nodes) {
				const column = columns[layerOf.get(node.id) ?? 0];
				if (column !== void 0) column.push(node);
			}
			for (const column of columns) column.sort((left, right) => (KIND_ORDER[left.kind] ?? 99) - (KIND_ORDER[right.kind] ?? 99) || left.id.localeCompare(right.id));
			const columnSize = Math.max(...columns.map((column) => column.length));
			const nodes = [];
			columns.forEach((column, layer) => {
				const columnHeight = column.length * nodeHeight + (column.length - 1) * rowGap;
				const topOffset = padding + (columnSize * nodeHeight + (columnSize - 1) * rowGap - columnHeight) / 2;
				column.forEach((node, index) => {
					nodes.push({
						node,
						layer,
						x: padding + layer * (nodeWidth + columnGap),
						y: topOffset + index * (nodeHeight + rowGap),
						openablePath: openablePathOf(node)
					});
				});
			});
			const positioned = new Map(nodes.map((item) => [item.node.id, item]));
			const edges = [];
			for (const edge of graph.edges) {
				const from = positioned.get(edge.from);
				const to = positioned.get(edge.to);
				if (from === void 0 || to === void 0) continue;
				edges.push({
					...edge,
					d: edgePath(from.x, from.y, nodeWidth, nodeHeight, to.x, to.y)
				});
			}
			const width = padding * 2 + maxLayer * (nodeWidth + columnGap) + nodeWidth;
			const height = padding * 2 + columnSize * nodeHeight + (columnSize - 1) * rowGap;
			return {
				nodes,
				edges,
				width: Math.max(width, nodeWidth + padding * 2),
				height: Math.max(height, nodeHeight + padding * 2),
				columns: maxLayer + 1
			};
		}
		/** Horizontal cubic bezier between the right edge of `from` and the left edge of `to`. */
		function edgePath(fromX, fromY, nodeWidth, nodeHeight, toX, toY) {
			const x1 = fromX + nodeWidth;
			const y1 = fromY + nodeHeight / 2;
			const x2 = toX;
			const y2 = toY + nodeHeight / 2;
			const bend = Math.max(28, Math.abs(x2 - x1) / 2);
			const forward = x2 + bend > x1;
			const c1x = forward ? x1 + bend : x1 - bend * .4;
			const c2x = forward ? x2 - bend : x2 - bend * .8;
			const midY = (y1 + y2) / 2;
			return forward ? `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}` : `M ${x1} ${y1} C ${x1 + bend} ${midY + 46}, ${x2 - bend} ${midY + 46}, ${x2} ${y2}`;
		}
		/** Truncate free-form evidence text to fit one canvas line. */
		function truncateForCanvas(value, max = 34) {
			const flat = value.replaceAll(/\s+/gu, " ").trim();
			return flat.length <= max ? flat : `${flat.slice(0, max - 1)}…`;
		}
		/**
		* Radial "diffusion" layout for the campaign war room: the target seed sits on
		* the left and its audit lanes fan out on an arc to the right, so a run reads
		* as one seed radiating hypotheses. Pure and deterministic like the flow
		* layout above.
		*/
		const WAR_ROOM_NODE = {
			width: 212,
			height: 64,
			seedWidth: 176,
			seedHeight: 64
		};
		function layoutWarRoom(laneCount, padding = 20) {
			const count = Math.max(0, laneCount);
			const laneSpacing = WAR_ROOM_NODE.height + 16;
			const radiusX = count <= 1 ? 128 : count <= 3 ? 208 : 300;
			const height = Math.max(WAR_ROOM_NODE.height * 2 + padding * 2, (count - 1) * laneSpacing + WAR_ROOM_NODE.height + padding * 2);
			const centerY = height / 2 - WAR_ROOM_NODE.height / 2;
			const seed = {
				x: padding,
				y: centerY
			};
			const spread = count <= 1 ? 0 : Math.min(Math.PI / 2.4, Math.PI / 2 * Math.min(1, count / 7));
			const lanes = Array.from({ length: count }, (_, index) => {
				const t = count === 1 ? .5 : index / (count - 1);
				const angle = (t - .5) * 2 * spread;
				return {
					index,
					x: padding + WAR_ROOM_NODE.seedWidth + radiusX * Math.cos(angle * .92),
					y: centerY + (t - .5) * (count - 1) * laneSpacing
				};
			});
			return {
				seed,
				lanes,
				width: lanes.reduce((max, lane) => Math.max(max, lane.x + WAR_ROOM_NODE.width), seed.x + WAR_ROOM_NODE.seedWidth) + padding,
				height
			};
		}
		/** Bezier from the seed's right edge to a lane's left edge. */
		function warRoomEdgePath(seedX, seedY, laneX, laneY) {
			const x1 = seedX + WAR_ROOM_NODE.seedWidth;
			const y1 = seedY + WAR_ROOM_NODE.seedHeight / 2;
			const x2 = laneX;
			const y2 = laneY + WAR_ROOM_NODE.height / 2;
			const bend = Math.max(40, (x2 - x1) * .55);
			return `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`;
		}
		// src/client/flow-canvas.tsx
		const KIND_STYLES = {
			finding: {
				label: "Находка",
				color: "var(--omv-text)"
			},
			claim: {
				label: "Утверждение об уязвимости",
				color: "var(--omv-blue)"
			},
			source: {
				label: "Точка входа",
				color: "var(--omv-blue)"
			},
			sink: {
				label: "Приёмник данных",
				color: "var(--omv-red)"
			},
			guard: {
				label: "Защитная проверка",
				color: "var(--omv-green)"
			},
			reproducer: {
				label: "Воспроизведение",
				color: "var(--omv-teal)"
			},
			observation: {
				label: "Наблюдение",
				color: "var(--omv-teal)"
			},
			session: {
				label: "Чат",
				color: "var(--omv-purple)"
			},
			artifact: {
				label: "Артефакт",
				color: "var(--omv-muted)"
			}
		};
		const FALLBACK_KIND = {
			label: "Доказательства",
			color: "var(--omv-blue)"
		};
		const kindStyle = (kind) => KIND_STYLES[kind] ?? FALLBACK_KIND;
		const EDGE_STYLES = {
			flows_to: {
				stroke: "var(--omv-blue)",
				marker: "omv-arrow-strong",
				width: 2
			},
			guarded_by: {
				stroke: "var(--omv-orange)",
				dash: "5 4",
				marker: "omv-arrow-warn",
				width: 1.6
			},
			reproduced_by: {
				stroke: "var(--omv-teal)",
				marker: "omv-arrow-teal",
				width: 1.6
			},
			observed_as: {
				stroke: "var(--omv-teal)",
				dash: "4 4",
				marker: "omv-arrow-teal",
				width: 1.4
			},
			describes: {
				stroke: "var(--omv-faint)",
				marker: "omv-arrow-muted",
				width: 1.3
			},
			produced_in: {
				stroke: "var(--omv-purple)",
				dash: "3 4",
				marker: "omv-arrow-muted",
				width: 1.2
			},
			attached_as: {
				stroke: "var(--omv-faint)",
				dash: "3 4",
				marker: "omv-arrow-muted",
				width: 1.2
			}
		};
		const FALLBACK_EDGE = {
			stroke: "var(--omv-faint)",
			marker: "omv-arrow-muted",
			width: 1.2
		};
		const edgeStyle = (relation) => EDGE_STYLES[relation] ?? FALLBACK_EDGE;
		const STATE_LABELS = {
			verified: "Проверено",
			known: "Известно",
			unknown: "Неизвестно"
		};
		function KindGlyph({ kind, size = 13 }) {
			const props = {
				width: size,
				height: size,
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: 2.1,
				strokeLinecap: "round",
				strokeLinejoin: "round",
				"aria-hidden": true
			};
			switch (kind) {
				case "source": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					...props,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: "12",
						cy: "12",
						r: "8"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 8v8M9.5 10.5 12 8l2.5 2.5" })]
				});
				case "sink": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					...props,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: "12",
						cy: "12",
						r: "7"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 2v4M12 18v4M2 12h4M18 12h4" })]
				});
				case "guard": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					...props,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 3 5 6v5c0 4.5 2.7 7.7 7 9 4.3-1.3 7-4.5 7-9V6l-7-3Z" })
				});
				case "reproducer": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					...props,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
						x: "3",
						y: "4.5",
						width: "18",
						height: "15",
						rx: "2"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m7 9.5 3 3-3 3M13 15h4" })]
				});
				case "observation": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					...props,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: "12",
						cy: "12",
						r: "2.6"
					})]
				});
				case "session": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					...props,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M4 5.5h16v10H9l-4 3.5v-3.5H4Z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" })]
				});
				case "artifact": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					...props,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M7 3.5h7l5 5V20a1.5 1.5 0 0 1-1.5 1.5h-10.5A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M14 3.5V9h5" })]
				});
				case "claim": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					...props,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M6 21V4M6 5h12l-2.5 4L18 13H6" })
				});
				default: return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					...props,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: "12",
						cy: "12",
						r: "8"
					})
				});
			}
		}
		function EvidenceFlowCanvas({ graph, onOpenPath }) {
			const viewHeight = 320;
			const [showSupporting, setShowSupporting] = (0, react.useState)(false);
			const [selected, setSelected] = (0, react.useState)();
			const visibleGraph = (0, react.useMemo)(() => {
				if (showSupporting) return graph;
				const visibleIds = new Set(graph.nodes.filter((node) => !["session", "artifact"].includes(node.kind)).map((node) => node.id));
				return {
					...graph,
					nodes: graph.nodes.filter((node) => visibleIds.has(node.id)),
					edges: graph.edges.filter((edge) => visibleIds.has(edge.from) && visibleIds.has(edge.to))
				};
			}, [graph, showSupporting]);
			const layout = (0, react.useMemo)(() => layoutEvidenceGraph(visibleGraph), [visibleGraph]);
			const containerRef = (0, react.useRef)(null);
			const canvas = useCanvasViewport(containerRef, layout.width, layout.height, viewHeight, `${graph.generatedAt}:${showSupporting ? "all" : "path"}`);
			const { viewport } = canvas;
			const selectedNode = layout.nodes.find((item) => item.node.id === selected);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "omv-flow",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-flow-toolbar",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-flow-legend",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { style: { background: "var(--omv-blue)" } }), "Точка входа"] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { style: { background: "var(--omv-red)" } }), "Приёмник"] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { style: { background: "var(--omv-green)" } }), "Защита"] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { style: { background: "var(--omv-teal)" } }), "Воспроизведение"] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { className: "omv-flow-legend-dash" }), "Непроверенная связь"] })
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-flow-zoom",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "toolbar",
									size: "sm",
									className: "omv-flow-control omv-flow-mode",
									"aria-pressed": !showSupporting,
									onClick: () => {
										setShowSupporting(false);
										setSelected(void 0);
									},
									children: "Основной путь"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "toolbar",
									size: "sm",
									className: "omv-flow-control omv-flow-mode",
									"aria-pressed": showSupporting,
									onClick: () => setShowSupporting(true),
									children: ["Все доказательства: ", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: graph.nodes.length })]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "toolbar",
									size: "sm",
									className: "omv-flow-control",
									"aria-label": "Уменьшить",
									onClick: () => canvas.zoomBy(1 / 1.25),
									children: "−"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "toolbar",
									size: "sm",
									className: "omv-flow-control",
									"aria-label": "Увеличить",
									onClick: () => canvas.zoomBy(1.25),
									children: "＋"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "toolbar",
									size: "sm",
									className: "omv-flow-control omv-flow-fit",
									"aria-label": "Вписать граф в окно",
									onClick: canvas.fit,
									children: "Вписать"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						ref: containerRef,
						className: "omv-flow-canvas",
						onWheel: canvas.onWheel,
						onPointerDown: canvas.onPointerDown,
						onPointerMove: canvas.onPointerMove,
						onPointerUp: canvas.onPointerUp,
						onPointerCancel: canvas.onPointerCancel,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
							width: "100%",
							height: viewHeight,
							viewBox: `0 0 ${canvas.viewWidth || layout.width} ${viewHeight}`,
							preserveAspectRatio: "none",
							role: "img",
							"aria-label": `Граф доказательств: ${visibleGraph.nodes.length} узлов`,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("defs", { children: [
								"strong",
								"warn",
								"teal",
								"muted"
							].map((tone) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("marker", {
								id: `omv-arrow-${tone}`,
								viewBox: "0 0 8 8",
								refX: "7",
								refY: "4",
								markerWidth: "7",
								markerHeight: "7",
								orient: "auto-start-reverse",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M0 0.8 7.2 4 0 7.2Z",
									fill: tone === "strong" ? "var(--omv-blue)" : tone === "warn" ? "var(--omv-orange)" : tone === "teal" ? "var(--omv-teal)" : "var(--omv-faint)"
								})
							}, tone)) }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
								transform: `translate(${viewport.tx} ${viewport.ty}) scale(${viewport.k})`,
								children: [layout.edges.map((edge, index) => {
									const style = edgeStyle(edge.relation);
									const verified = layout.nodes.find((item) => item.node.id === edge.from)?.node.state === "verified";
									return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: edge.d,
										fill: "none",
										stroke: style.stroke,
										strokeWidth: style.width,
										strokeDasharray: verified && style.dash === void 0 ? void 0 : style.dash ?? "10 7",
										markerEnd: `url(#${style.marker})`,
										className: "omv-flow-edge"
									}, `${edge.from}-${edge.to}-${index}`);
								}), layout.nodes.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FlowNode, {
									item,
									selected: selected === item.node.id,
									onSelect: () => setSelected((previous) => previous === item.node.id ? void 0 : item.node.id)
								}, item.node.id))]
							})]
						})
					}),
					selectedNode === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-flow-inspector omv-flow-inspector-empty",
						"aria-live": "polite",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Нажмите на узел, чтобы увидеть подробности доказательств" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", { children: [showSupporting ? "Показаны все доказательства" : `Основной путь · ${visibleGraph.nodes.length}/${graph.nodes.length} узлов`, onOpenPath === void 0 ? "" : " · Значок файла открывает исходный код"] })]
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-flow-inspector",
						"aria-live": "polite",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "omv-flow-inspector-kind",
								style: { background: kindStyle(selectedNode.node.kind).color },
								children: kindStyle(selectedNode.node.kind).label
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-flow-inspector-copy",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: selectedNode.node.label }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: truncateForCanvas(selectedNode.node.value, 110) }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", { children: [
										STATE_LABELS[selectedNode.node.state],
										" · ",
										selectedNode.node.path ?? "Путь отсутствует",
										selectedNode.node.line === void 0 ? "" : `:${selectedNode.node.line}`,
										selectedNode.node.timestamp === void 0 ? "" : ` · ${formatTime(selectedNode.node.timestamp)}`
									] })
								]
							}),
							selectedNode.openablePath !== void 0 && onOpenPath !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								size: "sm",
								onClick: () => onOpenPath(selectedNode.openablePath),
								icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
									name: "file",
									size: 11
								}),
								children: "Открыть исходный код"
							}) : void 0
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "omv-flow-hint",
						children: "Перетаскивание — перемещение; ⌘/Ctrl + колесо или ± — масштаб"
					})
				]
			});
		}
		function FlowNode({ item, selected, onSelect }) {
			const { node } = item;
			const style = kindStyle(node.kind);
			const { nodeWidth: width, nodeHeight: height } = DEFAULT_GRAPH_LAYOUT;
			const guardBroken = node.kind === "guard" && node.state === "unknown";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
				transform: `translate(${item.x} ${item.y})`,
				className: `omv-flow-node${selected ? " selected" : ""}${item.openablePath !== void 0 ? " openable" : ""}`,
				"data-state": node.state,
				"data-kind": node.kind,
				role: "button",
				tabIndex: 0,
				"aria-label": `${style.label} ${node.label}`,
				onClick: onSelect,
				onKeyDown: (event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						onSelect();
					}
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("title", { children: `${style.label} · ${node.label}\n${node.value}${node.path === void 0 ? "" : `\n${node.path}${node.line === void 0 ? "" : `:${node.line}`}`}` }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
						width,
						height,
						rx: 9
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
						width: 4,
						height,
						rx: 2,
						fill: style.color
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("g", {
						transform: `translate(14 ${height / 2 - 13})`,
						className: "omv-flow-glyph",
						style: { color: style.color },
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(KindGlyph, { kind: node.kind })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("text", {
						x: 38,
						y: 21,
						className: "omv-flow-node-kind",
						children: [style.label, guardBroken ? " · Отсутствует" : ""]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
						x: 38,
						y: 39,
						className: "omv-flow-node-value",
						children: truncateForCanvas(node.value, 24)
					}),
					node.state === "verified" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: width - 12,
						cy: 12,
						r: 4.5,
						className: "omv-flow-verified-dot"
					}),
					item.openablePath !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
						transform: `translate(${width - 26} ${height - 16})`,
						className: "omv-flow-file-badge",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
							width: "12",
							height: "12",
							rx: "2.5"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M3.5 6h5M3.5 8.5h3.5" })]
					}),
					guardBroken && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: `M ${width - 30} 6 l6 8 M ${width - 22} 10 l-7 9`,
						className: "omv-flow-crack"
					})
				]
			});
		}
		// src/client/war-room.tsx
		const ACTIVE_STATES = /* @__PURE__ */ new Set(["running", "dispatching"]);
		function laneStroke(status) {
			return status === "pending" ? "var(--omv-faint)" : statusColor(status);
		}
		function CampaignWarRoom({ target, ecosystem, lanes, onControl, onOpenSession, onFinding }) {
			const layout = (0, react.useMemo)(() => layoutWarRoom(lanes.length), [lanes.length]);
			const viewHeight = Math.min(300, Math.max(210, layout.height + 24));
			const containerRef = (0, react.useRef)(null);
			const canvas = useCanvasViewport(containerRef, layout.width, layout.height, viewHeight, `${target}-${lanes.length}`);
			const [selected, setSelected] = (0, react.useState)();
			const selectedLane = lanes.find((lane) => lane.id === selected);
			const retryable = selectedLane !== void 0 && [
				"failed",
				"blocked",
				"awaiting_evidence",
				"cancelled"
			].includes(selectedLane.status);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "omv-war",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-war-toolbar",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-flow-legend",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { style: { background: "var(--omv-green)" } }), "Завершено"] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { style: { background: "var(--omv-blue)" } }), "Выполняется"] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { style: { background: "var(--omv-orange)" } }), "Ожидает обработки"] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { style: { background: "var(--omv-faint)" } }), "Не начато"] })
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-flow-zoom",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "toolbar",
									size: "sm",
									className: "omv-flow-control",
									"aria-label": "Уменьшить",
									onClick: () => canvas.zoomBy(1 / 1.25),
									children: "−"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "toolbar",
									size: "sm",
									className: "omv-flow-control",
									"aria-label": "Увеличить",
									onClick: () => canvas.zoomBy(1.25),
									children: "＋"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "toolbar",
									size: "sm",
									className: "omv-flow-control omv-flow-fit",
									onClick: canvas.fit,
									children: "Вписать"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						ref: containerRef,
						className: "omv-war-canvas",
						style: { height: viewHeight },
						onWheel: canvas.onWheel,
						onPointerDown: canvas.onPointerDown,
						onPointerMove: canvas.onPointerMove,
						onPointerUp: canvas.onPointerUp,
						onPointerCancel: canvas.onPointerCancel,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
							width: "100%",
							height: viewHeight,
							viewBox: `0 0 ${canvas.viewWidth || layout.width} ${viewHeight}`,
							preserveAspectRatio: "none",
							role: "img",
							"aria-label": `Карта выполнения: ${target} · ${lanes.length} направлений аудита`,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("defs", { children: lanes.map((lane) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("marker", {
								id: `omv-war-arrow-${lane.id}`,
								viewBox: "0 0 8 8",
								refX: "7",
								refY: "4",
								markerWidth: "7",
								markerHeight: "7",
								orient: "auto-start-reverse",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M0 0.8 7.2 4 0 7.2Z",
									fill: laneStroke(lane.status)
								})
							}, lane.id)) }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
								transform: `translate(${canvas.viewport.tx} ${canvas.viewport.ty}) scale(${canvas.viewport.k})`,
								children: [
									lanes.map((lane, index) => {
										const spot = layout.lanes[index];
										return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
											d: warRoomEdgePath(layout.seed.x, layout.seed.y, spot.x, spot.y),
											fill: "none",
											stroke: laneStroke(lane.status),
											strokeWidth: ACTIVE_STATES.has(lane.status) ? 2.2 : 1.5,
											strokeDasharray: lane.status === "pending" ? "4 5" : void 0,
											markerEnd: `url(#omv-war-arrow-${lane.id})`,
											className: "omv-flow-edge"
										}, `edge-${lane.id}`);
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
										transform: `translate(${layout.seed.x} ${layout.seed.y})`,
										className: "omv-war-seed",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
												width: WAR_ROOM_NODE.seedWidth,
												height: WAR_ROOM_NODE.seedHeight,
												rx: 10
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
												x: 14,
												y: 22,
												className: "omv-war-seed-kicker",
												children: "Исходная цель"
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
												x: 14,
												y: 41,
												className: "omv-war-seed-title",
												children: truncateForCanvas(target, 20)
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
												x: 14,
												y: 55,
												className: "omv-war-seed-meta",
												children: ecosystem
											})
										]
									}),
									lanes.map((lane, index) => {
										const spot = layout.lanes[index];
										const stroke = laneStroke(lane.status);
										const active = ACTIVE_STATES.has(lane.status);
										return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("g", {
											transform: `translate(${spot.x} ${spot.y})`,
											className: `omv-war-lane${selected === lane.id ? " selected" : ""}${active ? " active" : ""}`,
											"data-status": lane.status,
											role: "button",
											tabIndex: 0,
											"aria-label": `Lane ${index + 1} ${lane.title} · ${statusLabel(lane.status)}`,
											onClick: () => setSelected((previous) => previous === lane.id ? void 0 : lane.id),
											onKeyDown: (event) => {
												if (event.key === "Enter" || event.key === " ") {
													event.preventDefault();
													setSelected((previous) => previous === lane.id ? void 0 : lane.id);
												}
											},
											children: [
												active && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
													x: -4,
													y: -4,
													width: WAR_ROOM_NODE.width + 8,
													height: WAR_ROOM_NODE.height + 8,
													rx: 12,
													className: "omv-war-pulse"
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
													width: WAR_ROOM_NODE.width,
													height: WAR_ROOM_NODE.height,
													rx: 9
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
													width: 4,
													height: WAR_ROOM_NODE.height,
													rx: 2,
													fill: stroke
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("text", {
													x: 14,
													y: 21,
													className: "omv-war-lane-index",
													children: ["Направление ", String(index + 1).padStart(2, "0")]
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
													x: 64,
													y: 21,
													className: "omv-war-lane-status",
													fill: stroke,
													children: statusLabel(lane.status)
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("text", {
													x: 14,
													y: 39,
													className: "omv-war-lane-title",
													children: truncateForCanvas(lane.title, 24)
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("text", {
													x: 14,
													y: 55,
													className: "omv-war-lane-meta",
													children: [truncateForCanvas(lane.detail, 30), lane.attempts > 1 ? ` · Попытка ${lane.attempts}` : ""]
												}),
												lane.summary !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
													cx: WAR_ROOM_NODE.width - 11,
													cy: 12,
													r: 4,
													className: "omv-war-note-dot"
												})
											]
										}, lane.id);
									})
								]
							})]
						})
					}),
					selectedLane === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "omv-flow-inspector omv-flow-inspector-empty",
						children: "Нажмите на направление для подробностей и действий. Перетаскивание — перемещение; ⌘/Ctrl + колесо — масштаб."
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-flow-inspector",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "omv-flow-inspector-kind",
								style: { background: laneStroke(selectedLane.status) },
								children: statusLabel(selectedLane.status)
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-flow-inspector-copy",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: selectedLane.title }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [selectedLane.detail, selectedLane.findingId === void 0 ? "" : ` · ${selectedLane.findingId}`] }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", { children: [
										"Попытка ",
										selectedLane.attempts,
										" раз",
										selectedLane.summary === void 0 ? "" : ` · ${truncateForCanvas(selectedLane.summary, 80)}`
									] })
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-war-inspector-actions",
								children: [
									selectedLane.findingId !== void 0 && onFinding !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										variant: "outline",
										size: "sm",
										onClick: () => onFinding(selectedLane.findingId),
										icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
											name: "finding",
											size: 11
										}),
										children: "Находка"
									}),
									selectedLane.sessionId !== void 0 && onOpenSession !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										variant: "outline",
										size: "sm",
										onClick: () => onOpenSession(selectedLane.sessionId),
										icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
											name: "terminal",
											size: 11
										}),
										children: "Чат"
									}),
									retryable && onControl !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										variant: "outline",
										size: "sm",
										onClick: () => onControl(selectedLane.id, "retry", selectedLane.id),
										icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
											name: "refresh",
											size: 11
										}),
										children: "Повторить это направление"
									})
								]
							})
						]
					})
				]
			});
		}
		// src/client/pages.tsx
		function CommandPalette({ tab, onTab, onNewFinding, onNewCampaign, onClose }) {
			const labels = {
				overview: "Обзор",
				findings: "Находки",
				reproduction: "Воспроизведение",
				campaigns: "Задача аудита",
				search: "Поиск"
			};
			const actions = [
				...OMV_TABS.map((item, index) => ({
					label: `Открыть${labels[item]}`,
					hint: String(index + 1),
					run: () => onTab(item)
				})),
				{
					label: "Создать потенциальную уязвимость",
					hint: "Находка",
					run: onNewFinding
				},
				{
					label: "Создать задачу аудита",
					hint: "Кампания",
					run: onNewCampaign
				}
			];
			const [query, setQuery] = (0, react.useState)("");
			const filtered = actions.filter((action) => `${action.label} ${action.hint}`.toLowerCase().includes(query.trim().toLowerCase()));
			const [activeIndex, setActiveIndex] = (0, react.useState)(0);
			(0, react.useEffect)(() => setActiveIndex(0), [query]);
			const runActive = () => filtered[Math.min(activeIndex, Math.max(0, filtered.length - 1))]?.run();
			const moveActive = (offset) => {
				if (filtered.length === 0) return;
				setActiveIndex((index) => (index + offset + filtered.length) % filtered.length);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "omv-modal-backdrop",
				role: "presentation",
				onMouseDown: onClose,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "omv-command-palette",
					role: "dialog",
					"aria-modal": "true",
					"aria-label": "Команды OMV",
					onMouseDown: (event) => event.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-command-palette-head",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
									autoFocus: true,
									"aria-label": "Поиск команд",
									className: "omv-command-input",
									value: query,
									placeholder: "Найти представление или действие…",
									icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
										name: "search",
										size: 14
									}),
									onChange: (event) => setQuery(event.target.value),
									onKeyDown: (event) => {
										if (event.key === "Escape") onClose();
										else if (event.key === "ArrowDown") {
											event.preventDefault();
											moveActive(1);
										} else if (event.key === "ArrowUp") {
											event.preventDefault();
											moveActive(-1);
										} else if (event.key === "Home") {
											event.preventDefault();
											setActiveIndex(0);
										} else if (event.key === "End") {
											event.preventDefault();
											setActiveIndex(Math.max(0, filtered.length - 1));
										} else if (event.key === "Enter") runActive();
									}
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("kbd", { children: "↑↓" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("kbd", { children: "ESC" })
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: filtered.map((action, index) => {
							const isCurrent = labels[tab] !== void 0 && action.label === `Открыть${labels[tab]}`;
							return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: `omv-command-palette-item${isCurrent ? " active" : ""}`,
								"data-active": index === activeIndex || void 0,
								"aria-current": isCurrent || void 0,
								onMouseEnter: () => setActiveIndex(index),
								onClick: action.run,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: action.label }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("kbd", { children: action.hint })]
							}) }, `${action.label}-${action.hint}`);
						}) }),
						filtered.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
							label: "Подходящих действий нет",
							compact: true
						})
					]
				})
			});
		}
		function WorkbenchErrorState({ error, projectRoot, configuredRoot: root, onRetry, onOpenConfigured, onOpenPath }) {
			const pointsElsewhere = root !== "." && normalizePath(projectRoot) !== normalizePath(root);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "omv-error-state",
				role: "alert",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "omv-error-icon",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
							name: "alert",
							size: 19
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "omv-eyebrow",
						children: "Синхронизация рабочей области"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "Пока не удалось прочитать эту рабочую область аудита" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "omv-error-lead",
						children: "Чат DSH остаётся доступен. Перед продолжением исправьте данные текущей рабочей области или переключитесь на область по умолчанию."
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-error-paths",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Текущий чат" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
							title: projectRoot,
							children: projectRoot
						})] }), pointsElsewhere && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Рабочая область по умолчанию" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
							title: root,
							children: root
						})] })]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-error-actions",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "primary",
								onClick: onRetry,
								icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
									name: "refresh",
									size: 13
								}),
								children: "Повторить синхронизацию"
							}),
							pointsElsewhere && onOpenConfigured !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								onClick: () => {
									onOpenConfigured();
								},
								icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
									name: "grid",
									size: 13
								}),
								children: "Открыть рабочую область по умолчанию"
							}),
							onOpenPath !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								onClick: onOpenPath,
								icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
									name: "folder",
									size: 13
								}),
								children: "Открыть .omv"
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
						className: "omv-error-details",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: "Посмотреть диагностику" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", { children: error })]
					})
				]
			});
		}
		function Overview({ data, jobs, onRetryJob, onTab, onFinding, onNew, onOpenConfigured, onOpenPath, onRetryIssues }) {
			const { metrics } = data;
			const queue = data.findings.slice(0, 5);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "omv-overview",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Hero, {
						eyebrow: "Обзор рабочей области",
						title: "Состояние рисков",
						description: "Потенциальные уязвимости, зрелость доказательств и следующие действия аудита.",
						actions: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							onClick: () => onTab("campaigns"),
							icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
								name: "campaign",
								size: 13
							}),
							children: "Посмотреть задачи аудита"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "primary",
							onClick: onNew,
							icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
								name: "plus",
								size: 13
							}),
							children: "Создать кандидата"
						})] })
					}),
					data.workspaceIssues.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkspaceIssuesNotice, {
						issues: data.workspaceIssues,
						onTab,
						onOpenConfigured,
						onOpenPath,
						onRetry: onRetryIssues
					}),
					data.campaignIssues.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "omv-campaign-notice",
						onClick: () => onTab("campaigns"),
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
								name: "alert",
								size: 13
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("strong", { children: [data.campaignIssues.length, " конфигураций плана аудита требуют действий"] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "Остальные данные аудита загружены" })] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
								name: "chevron",
								size: 13
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-overview-stats",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Stat, {
								label: "Активные находки",
								value: metrics.active,
								detail: `${metrics.candidates} исследуются`,
								tone: "blue",
								icon: "finding"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Stat, {
								label: "Подтверждено",
								value: metrics.confirmed,
								detail: `${metrics.reportReady} готовы к отчёту`,
								tone: "green",
								icon: "check"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Stat, {
								label: "Воспроизводится",
								value: metrics.reproducing,
								detail: `${metrics.activeReproductions} выполняются`,
								tone: "teal",
								icon: "pulse"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Stat, {
								label: "Блокирующие проблемы",
								value: metrics.blocked,
								detail: metrics.blocked > 0 ? "Требует первоочередного вмешательства" : "Блокирующих проблем нет",
								tone: "red",
								icon: "alert"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-overview-sync",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: "omv-live-dot" }),
									"Последняя синхронизация",
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: formatTime(data.generatedAt) })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(OverviewQuality, {
						data,
						onTab,
						onFinding,
						onOpenConfigured
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-overview-main",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							className: "omv-panel omv-action-panel",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-panel-head",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: "omv-panel-kicker",
										children: "Следующее действие"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "Приоритетная очередь аудита" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "Сортировка по пробелам в доказательствах, препятствиям и ценности дальнейшей работы" })
								] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									onClick: () => onTab("findings"),
									children: "Все находки"
								})]
							}), queue.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
								label: "В рабочей области пока нет потенциальных уязвимостей",
								description: "Начните с одной гипотезы. Evidence.v1 сохранит контекст каждого шага исследования.",
								action: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									onClick: onNew,
									icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
										name: "plus",
										size: 12
									}),
									children: "Создать кандидата"
								})
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
								className: "omv-queue",
								children: queue.map((finding) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
									className: "omv-queue-row",
									role: "button",
									tabIndex: 0,
									"aria-label": `Открыть ${finding.id}`,
									onClick: () => onFinding(finding.id),
									onKeyDown: (event) => {
										if (event.key === "Enter" || event.key === " ") {
											event.preventDefault();
											onFinding(finding.id);
										}
									},
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "omv-finding-name",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(EcosystemAvatar, { ecosystem: finding.ecosystem }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: finding.id }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
												finding.package,
												" · ",
												finding.vulnerability
											] })] })]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "omv-queue-action",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Следующий шаг" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
												className: "omv-next",
												children: finding.nextAction
											})]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Maturity, {
											assessment: finding.assessment,
											compact: true
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
											name: "chevron",
											size: 14
										})
									]
								}, finding.id))
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-overview-rail",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(EvidenceChart, { metrics }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(StageChart, { metrics })]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-overview-bottom",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(RecentActivity, { data }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(NativeJobs, {
							jobs,
							onRetry: onRetryJob
						})]
					})
				]
			});
		}
		function OverviewQuality({ data, onTab, onFinding, onOpenConfigured }) {
			const quality = data.quality;
			const queues = [
				{
					id: "evidence",
					label: "Дополнить доказательства",
					value: quality.queues.needsEvidence,
					tab: "findings",
					detail: "В цепочке обоснования остаются пробелы"
				},
				{
					id: "repro",
					label: "Ожидает воспроизведения",
					value: quality.queues.needsReproduction,
					tab: "reproduction",
					detail: "Нужна проверка во время выполнения"
				},
				{
					id: "dedup",
					label: "Ожидает проверки на дубли",
					value: quality.queues.needsDedup,
					tab: "findings",
					detail: "Сопоставление с известными сведениями не завершено"
				},
				{
					id: "report",
					label: "Готово к отчёту",
					value: quality.queues.reportReady,
					tab: "findings",
					detail: "Материалы почти собраны"
				}
			];
			const issues = quality.issues.slice(0, 4);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "omv-panel omv-overview-quality",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-overview-quality-head",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "omv-panel-kicker",
								children: "Работа с доказательствами"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "Показатели качества" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "Препятствия, предупреждения и следующие действия включены в общий процесс работы." })
						] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-overview-quality-score",
							"data-state": qualitySignalTone(quality),
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: quality.score }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: qualitySignalLabel(quality) }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", { children: [
									quality.blockers,
									" препятствий · ",
									quality.warnings,
									" предупреждений · ",
									quality.infos,
									" рекомендаций"
								] })
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "omv-overview-quality-queues",
						children: queues.map((queue) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "omv-overview-quality-queue",
							onClick: () => onTab(queue.tab),
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: queue.label }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: queue.value }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: queue.detail }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
									name: "chevron",
									size: 11
								})
							]
						}, queue.id))
					}),
					issues.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-overview-quality-issues",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-overview-quality-issues-head",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Приоритетные действия" }),
								quality.issues.length > issues.length && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", { children: [
									"Ещё ",
									quality.issues.length - issues.length,
									" шт."
								] }),
								onOpenConfigured !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "omv-link-button",
									onClick: () => {
										onOpenConfigured();
									},
									children: "Открыть рабочую область по умолчанию"
								})
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: issues.map((issue) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
							className: "omv-quality-issue",
							"data-severity": issue.severity,
							onClick: () => issue.findingId !== void 0 && onFinding(issue.findingId),
							role: issue.findingId === void 0 ? void 0 : "button",
							tabIndex: issue.findingId === void 0 ? void 0 : 0,
							onKeyDown: (event) => {
								if (issue.findingId !== void 0 && (event.key === "Enter" || event.key === " ")) {
									event.preventDefault();
									onFinding(issue.findingId);
								}
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PriorityIssueLogo, { severity: issue.severity }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: issue.title }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: issue.detail }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", { children: ["Далее: ", issue.nextAction] })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Status, { value: issue.severity })
							]
						}, issue.id)) })]
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-overview-quality-clear",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
							name: "check",
							size: 13
						}), "Нет нерешённых замечаний к качеству"]
					})
				]
			});
		}
		function Stat({ label, value, detail, tone, icon }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: `omv-overview-stat omv-tone-${tone}`,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-overview-stat-head",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
							name: icon,
							size: 12
						}) })]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: value }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: detail })
				]
			});
		}
		function EvidenceChart({ metrics }) {
			const items = [
				[
					"Проверено",
					metrics.evidenceMaturity.verified,
					"green",
					"check"
				],
				[
					"Есть подтверждающие данные",
					metrics.evidenceMaturity.supported,
					"teal",
					"shield"
				],
				[
					"В работе",
					metrics.evidenceMaturity.developing,
					"orange",
					"pulse"
				],
				[
					"Ещё не сопоставлено",
					metrics.evidenceMaturity.unmapped,
					"muted",
					"finding"
				],
				[
					"Есть противоречия",
					metrics.evidenceMaturity.contested,
					"red",
					"alert"
				]
			];
			const total = Math.max(1, metrics.active);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "omv-panel omv-chart-panel",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "omv-panel-head",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "omv-panel-kicker",
							children: "Состояние доказательств"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "Зрелость доказательств" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "Путь находки от гипотезы до готовности к передаче" })
					] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("strong", {
						className: "omv-chart-total",
						children: [metrics.evidenceMaturity.verified + metrics.evidenceMaturity.supported, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "Есть обоснование" })]
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "omv-evidence-bars",
					children: items.map(([label, value, tone, icon]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-evidence-row",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
							name: icon,
							size: 11
						}), label] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: value })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {
							className: `omv-bar-${tone}`,
							style: { width: `${Math.round(value / total * 100)}%` }
						})]
					}, label))
				})]
			});
		}
		function StageChart({ metrics }) {
			const stages = [
				[
					"Кандидат",
					metrics.candidates,
					"blue",
					"finding"
				],
				[
					"Исследуется",
					metrics.investigating,
					"teal",
					"eye"
				],
				[
					"Воспроизводится",
					metrics.reproducing,
					"orange",
					"pulse"
				],
				[
					"Подтверждено",
					metrics.confirmed,
					"green",
					"check"
				],
				[
					"Готово к отчёту",
					metrics.reportReady,
					"purple",
					"file"
				]
			];
			const max = Math.max(1, ...stages.map(([, value]) => value));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "omv-panel omv-chart-panel",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "omv-panel-head",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "omv-panel-kicker",
							children: "Этапы работы"
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "Этап аудита" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "Распределение активных находок по этапам работы" })
					] })
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "omv-stage-chart",
					children: stages.map(([label, value, tone, icon]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-stage-col",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: `omv-stage-value omv-stage-${tone}`,
							style: { height: `${Math.max(8, value / max * 100)}%` },
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: value })
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
							name: icon,
							size: 10
						}), label] })]
					}, label))
				})]
			});
		}
		function NativeJobs({ jobs, onRetry }) {
			const visible = jobs.slice(-6).reverse();
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "omv-panel",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "omv-panel-head",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "Фоновые задачи DSH" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "Фоновые задачи текущего чата" })] })
				}), visible.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
					label: "В текущем чате нет фоновых задач",
					compact: true
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
					className: "omv-native-jobs",
					children: visible.map((job) => {
						const icon = job.status === "running" || job.status === "stopping" ? "pulse" : job.status === "completed" ? "check" : job.status === "failed" || job.status === "killed" ? "alert" : "clock";
						return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {
								"data-state": job.status,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
									name: icon,
									size: 11
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: job.label }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
								job.kind,
								" · ",
								job.status,
								job.detail === void 0 ? "" : ` · ${job.detail}`
							] })] }),
							job.status === "failed" || job.status === "killed" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								size: "sm",
								onClick: () => onRetry(job),
								icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
									name: "refresh",
									size: 11
								}),
								children: "Повторить"
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: job.id })
						] }, job.id);
					})
				})]
			});
		}
		function RecentActivity({ data }) {
			const entries = data.activity.slice(0, 8);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: "omv-panel",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "omv-panel-head",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "Недавние изменения" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "Запись доказательств и действия процесса" })] })
				}), entries.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
					label: "Активности пока нет",
					compact: true
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
					className: "omv-history",
					children: entries.map((entry, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {
						style: { color: activityColor(entry.action) },
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
							name: "activity",
							size: 11
						})
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: activityLabel(entry.action) }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
						entry.id ?? "Рабочая область",
						" · ",
						relativeTime(entry.timestamp)
					] })] })] }, `${entry.timestamp}-${entry.action}-${entry.id ?? "workspace"}-${index}`))
				})]
			});
		}
		function Findings({ data, onFinding, onNew, onOpenConfigured, onOpenPath, onRetryIssues }) {
			const [query, setQuery] = (0, react.useState)("");
			const [scope, setScope] = (0, react.useState)("all");
			const [status, setStatus] = (0, react.useState)("active");
			const [sort, setSort] = (0, react.useState)("priority");
			const normalizedQuery = query.trim().toLowerCase();
			const matchesQuery = (finding) => `${finding.id} ${finding.package} ${finding.vulnerability} ${finding.ecosystem}`.toLowerCase().includes(normalizedQuery);
			const active = (0, react.useMemo)(() => data.findings.filter((finding) => {
				const matchesStatus = status === "active" || finding.status === status || finding.stage === status;
				const matchesScope = scope === "all" || scope === "attention" && [
					"investigating",
					"reproducing",
					"blocked"
				].includes(finding.stage) || scope === "ready" && (finding.status === "confirmed" || finding.stage === "report_ready");
				return matchesStatus && matchesScope && matchesQuery(finding);
			}).sort((left, right) => {
				if (sort === "updated") return (right.updatedAt ?? "").localeCompare(left.updatedAt ?? "");
				if (sort === "maturity") {
					const rank = {
						unmapped: 0,
						developing: 1,
						supported: 2,
						verified: 3,
						contested: -1
					};
					return (rank[right.assessment.maturity] ?? 0) - (rank[left.assessment.maturity] ?? 0);
				}
				if (sort === "blocked") return Number(right.stage === "blocked") - Number(left.stage === "blocked") || right.priority - left.priority;
				if (sort === "report_ready") return Number(right.stage === "report_ready" || right.status === "confirmed") - Number(left.stage === "report_ready" || left.status === "confirmed") || right.priority - left.priority;
				return right.priority - left.priority || right.assessment.openQuestions.length - left.assessment.openQuestions.length || left.id.localeCompare(right.id);
			}), [
				data.findings,
				normalizedQuery,
				scope,
				sort,
				status
			]);
			const archived = (0, react.useMemo)(() => data.archived.filter((finding) => {
				return matchesQuery(finding);
			}).sort((left, right) => right.archivedAt.localeCompare(left.archivedAt)), [data.archived, normalizedQuery]);
			const activeCount = data.findings.length;
			const readyCount = data.findings.filter((finding) => finding.status === "confirmed" || finding.stage === "report_ready").length;
			const blockedCount = data.findings.filter((finding) => finding.stage === "blocked").length;
			const attentionCount = data.findings.filter((finding) => [
				"investigating",
				"reproducing",
				"blocked"
			].includes(finding.stage)).length;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "omv-findings-page",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: "omv-workbench-header omv-findings-header",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-workbench-title",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "Поиск уязвимостей" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "Evidence.v1" })]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: activeCount }),
							" активных находок · ",
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: readyCount }),
							" готовых к передаче · ",
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: blockedCount }),
							" требующих действий · ",
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: data.archived.length }),
							" в архиве"
						] })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "primary",
							onClick: onNew,
							icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
								name: "plus",
								size: 13
							}),
							children: "Создать кандидата"
						})]
					}),
					data.workspaceIssues.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkspaceIssuesNotice, {
						issues: data.workspaceIssues,
						compact: true,
						onOpenConfigured,
						onOpenPath,
						onRetry: onRetryIssues
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-findings-summary",
						"aria-label": "Статистика находок",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: `omv-findings-stat${scope === "all" ? " active" : ""}`,
								onClick: () => {
									setScope("all");
									setStatus("active");
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: activeCount }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Все активные" })]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: `omv-findings-stat${scope === "ready" ? " active" : ""}`,
								onClick: () => {
									setScope("ready");
									setStatus("active");
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: readyCount }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Подтверждены / готовы к передаче" })]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: `omv-findings-stat${scope === "attention" ? " active" : ""}`,
								onClick: () => {
									setScope("attention");
									setStatus("active");
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: attentionCount }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: ["Требует действий", blockedCount > 0 ? ` · ${blockedCount} препятствий` : ""] })]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: `omv-findings-stat${scope === "archived" ? " active" : ""}`,
								onClick: () => {
									setScope("archived");
									setStatus("archived");
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: data.archived.length }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "В архиве" })]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-toolbar",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "omv-search",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
									"aria-label": "Поиск находок",
									className: "omv-input",
									icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
										name: "search",
										size: 14
									}),
									value: query,
									placeholder: "Поиск по идентификатору, пакету или типу уязвимости…",
									onChange: (event) => setQuery(event.target.value)
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
								className: "omv-select",
								style: { width: 128 },
								value: status,
								onChange: (event) => {
									const next = event.target.value;
									setStatus(next);
									setScope(next === "archived" ? "archived" : "all");
								},
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "active",
										children: "Все активные"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "candidate",
										children: "Кандидат"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "investigating",
										children: "Исследуется"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "reproducing",
										children: "Воспроизводится"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "confirmed",
										children: "Подтверждено"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "report_ready",
										children: "Готово к передаче"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "disclosed",
										children: "Раскрыто"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "blocked",
										children: "Заблокировано"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "archived",
										children: "В архиве"
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
								className: "omv-select",
								style: { width: 142 },
								value: sort,
								onChange: (event) => setSort(event.target.value),
								disabled: scope === "archived",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "priority",
										children: "По приоритету"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "updated",
										children: "Недавние изменения"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "maturity",
										children: "Зрелость доказательств"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "blocked",
										children: "Сначала заблокированные"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "report_ready",
										children: "Сначала готовые к передаче"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-list-wrap",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-list-head",
							role: "row",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Находка" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Статус аудита" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Доказательства" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Следующий шаг" })
							]
						}), (scope === "archived" ? archived.length : active.length) === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
							label: "Подходящих находок нет",
							description: query === "" && scope === "all" && status === "active" ? "В рабочей области пока нет активных находок." : "Очистите поиск или измените фильтр.",
							action: query !== "" || scope !== "all" || status !== "active" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									setQuery("");
									setScope("all");
									setStatus("active");
									setSort("priority");
								},
								children: "Сбросить фильтры"
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "primary",
								size: "sm",
								onClick: onNew,
								icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
									name: "plus",
									size: 12
								}),
								children: "Создать кандидата"
							})
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("ul", {
							className: "omv-finding-list",
							children: [scope !== "archived" && active.map((finding) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
								className: "omv-finding-row",
								"data-stage": finding.stage,
								role: "link",
								tabIndex: 0,
								"aria-label": `Открыть ${finding.id}`,
								onClick: () => onFinding(finding.id),
								onKeyDown: (event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										onFinding(finding.id);
									}
								},
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "omv-finding-name",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(EcosystemAvatar, {
											ecosystem: finding.ecosystem,
											size: "lg"
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: finding.id }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
											finding.package,
											" · ",
											finding.vulnerability
										] })] })]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Status, { value: finding.stage }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Maturity, { assessment: finding.assessment }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
										className: "omv-cell-mono",
										title: finding.nextAction,
										children: finding.nextAction
									})
								]
							}, finding.id)), scope === "archived" && archived.map((finding) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
								className: "omv-finding-row",
								role: "link",
								tabIndex: 0,
								"aria-label": `Открыть ${finding.id}`,
								onClick: () => onFinding(finding.id, true),
								onKeyDown: (event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										onFinding(finding.id, true);
									}
								},
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "omv-finding-name",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(EcosystemAvatar, {
											ecosystem: finding.ecosystem,
											size: "lg"
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: finding.id }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
											finding.package,
											" · ",
											finding.vulnerability
										] })] })]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Status, { value: "archived" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "omv-muted-copy",
										children: "В архиве"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
										className: "omv-cell-mono",
										title: finding.archiveReason,
										children: finding.archiveReason
									})
								]
							}, finding.id))]
						})]
					})
				]
			});
		}
		function WorkspaceIssuesNotice({ issues, onTab, onOpenConfigured, onOpenPath, onRetry, compact = false }) {
			const findingIssues = issues.filter((issue) => issue.kind === "finding");
			const label = findingIssues.length === 1 ? "Не загружен 1 файл Evidence" : `${findingIssues.length} файлов Evidence не загружено`;
			const [copiedPath, setCopiedPath] = (0, react.useState)();
			const copyPath = async (path) => {
				try {
					await navigator.clipboard.writeText(path);
					setCopiedPath(path);
					window.setTimeout(() => setCopiedPath((current) => current === path ? void 0 : current), 1400);
				} catch {
					setCopiedPath(void 0);
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: `omv-data-notice${compact ? " omv-data-notice-compact" : ""}`,
				role: "status",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
						name: "alert",
						size: 14
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: label }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Остальные данные аудита доступны. После исправления файла можно загрузить его отдельно или обновить всю рабочую область." }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: "Посмотреть файл" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: findingIssues.slice(0, 6).map((issue) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
							title: issue.path,
							children: issue.id
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: firstLine$1(issue.message) })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-issue-file-actions",
							children: [
								onOpenPath !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									onClick: () => onOpenPath(issue.path),
									icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
										name: "folder",
										size: 11
									}),
									children: "Открыть"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										copyPath(issue.path);
									},
									icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
										name: "copy",
										size: 11
									}),
									children: copiedPath === issue.path ? "Скопировано" : "Копировать путь"
								}),
								onRetry !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									onClick: onRetry,
									icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
										name: "refresh",
										size: 11
									}),
									children: "Загрузить заново"
								})
							]
						})] }, issue.id)) })] })
					] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-data-notice-actions",
						children: [
							onOpenConfigured !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									onOpenConfigured();
								},
								children: "Рабочая область по умолчанию"
							}),
							onTab !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								size: "sm",
								onClick: () => onTab("findings"),
								children: "Посмотреть реестр"
							}),
							onRetry !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								size: "sm",
								onClick: onRetry,
								icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
									name: "refresh",
									size: 11
								}),
								children: "Обновить"
							})
						]
					})
				]
			});
		}
		function Campaigns({ data, busy, onNew, onCampaign, onRepair, onOpenPath, onRetryIssues }) {
			const [query, setQuery] = (0, react.useState)("");
			const [copiedPath, setCopiedPath] = (0, react.useState)();
			const laneCount = data.campaigns.reduce((total, campaign) => total + campaign.laneCount, 0);
			const normalizedQuery = query.trim().toLowerCase();
			const filteredCampaigns = data.campaigns.filter((campaign) => `${campaign.title} ${campaign.target} ${campaign.version} ${campaign.id}`.toLowerCase().includes(normalizedQuery));
			const copyPath = async (path) => {
				try {
					await navigator.clipboard.writeText(path);
					setCopiedPath(path);
					window.setTimeout(() => setCopiedPath((current) => current === path ? void 0 : current), 1400);
				} catch {
					setCopiedPath(void 0);
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "omv-campaigns-page",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: "omv-workbench-header",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-workbench-title",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "Задача аудита" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: "Campaign.v1" })]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: data.campaigns.length }),
							" задач · ",
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: laneCount }),
							" направлений · ",
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: data.campaigns.filter((campaign) => campaign.nextAction !== "").length }),
							" ожидают продолжения",
							data.campaignIssues.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: "omv-page-context-warning",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}),
									data.campaignIssues.length,
									" конфигураций требуют действий"
								]
							})
						] })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "primary",
							onClick: onNew,
							icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
								name: "plus",
								size: 13
							}),
							children: "Создать задачу"
						})]
					}),
					data.campaignIssues.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "omv-panel omv-campaign-issues",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-panel-head",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "Диагностика конфигурации" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "Некорректные файлы изолированы и не мешают другим задачам и находкам" })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-issue-head-actions",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Status, { value: "needs_attention" }), onRetryIssues !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									onClick: onRetryIssues,
									icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
										name: "refresh",
										size: 11
									}),
									children: "Обновить"
								})]
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: data.campaignIssues.map((issue) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
								name: "alert",
								size: 11
							}) }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: issue.id }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: issue.changes.length > 0 ? issue.changes.join(" · ") : issue.message }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
									title: issue.path,
									children: issue.path
								})
							] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-issue-file-actions",
								children: [
									onOpenPath !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										variant: "outline",
										size: "sm",
										onClick: () => onOpenPath(issue.path),
										icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
											name: "folder",
											size: 11
										}),
										children: "Открыть"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										variant: "outline",
										size: "sm",
										onClick: () => {
											copyPath(issue.path);
										},
										icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
											name: "copy",
											size: 11
										}),
										children: copiedPath === issue.path ? "Скопировано" : "Копировать путь"
									}),
									issue.repairable && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										variant: "outline",
										size: "sm",
										disabled: busy,
										onClick: () => onRepair(issue.id),
										icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
											name: "refresh",
											size: 11
										}),
										children: "Исправить конфигурацию"
									})
								]
							})
						] }, issue.path)) })]
					}),
					data.campaigns.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "omv-panel",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
							label: "Задач аудита пока нет",
							description: "Объедините цель и тип уязвимости в план исследования, который можно возобновлять.",
							action: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "primary",
								size: "sm",
								onClick: onNew,
								icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
									name: "plus",
									size: 12
								}),
								children: "Создать задачу аудита"
							})
						})
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-index-toolbar",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-campaign-search",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
								"aria-label": "Поиск задач аудита",
								className: "omv-campaign-input",
								icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
									name: "search",
									size: 13
								}),
								value: query,
								placeholder: "Поиск по задаче, цели или идентификатору",
								onChange: (event) => setQuery(event.target.value)
							}), query !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Очистить поиск",
								onClick: () => setQuery(""),
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
									name: "close",
									size: 12
								})
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: "omv-index-count",
							children: [
								filteredCampaigns.length,
								" / ",
								data.campaigns.length
							]
						})]
					}), filteredCampaigns.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "omv-panel",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
							label: "Подходящих задач нет",
							description: "Попробуйте название цели, версию или идентификатор задачи.",
							compact: true
						})
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-campaigns omv-campaign-list",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-campaign-list-head",
							"aria-hidden": "true",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Задача" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Состояние" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Следующий шаг" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Объём" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {})
							]
						}), filteredCampaigns.map((campaign) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
							className: "omv-campaign",
							"data-status": campaign.status,
							role: "button",
							tabIndex: 0,
							onClick: () => onCampaign(campaign.id),
							onKeyDown: (event) => {
								if (event.key === "Enter" || event.key === " ") {
									event.preventDefault();
									onCampaign(campaign.id);
								}
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "omv-campaign-main",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "omv-campaign-icon",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
											name: "folder",
											size: 15
										})
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: campaign.title }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
										campaign.target,
										" · ",
										campaign.version,
										" · ",
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: campaign.id })
									] })] })]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Status, { value: campaign.status }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "omv-campaign-next",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Следующий шаг" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: campaign.nextAction || "Нет записей" })]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "omv-campaign-foot",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [campaign.laneCount, " Lane"] })
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
									name: "chevron",
									size: 13
								})
							]
						}, campaign.id))]
					})] })
				]
			});
		}
		function CampaignDetail({ payload, busy, isBusy, currentSessionId, expanded, onToggleExpand, onClose, onStart, onControl, onOpenSession, onFinding, onAction }) {
			const rowBusy = isBusy ?? (() => busy);
			const { campaign, surfaces } = payload;
			const run = payload.runs[0];
			const activeRun = run !== void 0 && (run.status === "running" || run.status === "queued" || run.status === "paused");
			const linkedElsewhere = payload.sessionLink !== void 0 && payload.sessionLink.sessionId !== currentSessionId;
			const hasCards = surfaces.cards.length > 0;
			const selectedCards = surfaces.cards.filter((card) => card.status === "selected");
			const graphLanes = selectedCards.length > 0 ? selectedCards.map((card) => ({
				id: card.id,
				title: card.title,
				vulnerability_class: card.vulnerabilityClass,
				finding_id: card.findingId
			})) : campaign.lanes;
			const runLaneById = new Map((run?.lanes ?? []).map((lane) => [lane.laneId, lane]));
			const warLanes = graphLanes.map((lane) => {
				const current = runLaneById.get(lane.id);
				return {
					id: lane.id,
					title: lane.title,
					detail: lane.vulnerability_class,
					status: current?.status ?? "pending",
					attempts: current?.attempts ?? 0,
					summary: current?.summary,
					sessionId: current?.sessionId,
					findingId: current?.findingId ?? lane.finding_id
				};
			});
			const completed = run?.lanes.filter((lane) => lane.status === "completed").length ?? 0;
			const attention = run?.lanes.filter((lane) => lane.status === "blocked" || lane.status === "failed" || lane.status === "awaiting_evidence").length ?? 0;
			const resolved = run?.lanes.filter((lane) => lane.status === "completed" || lane.status === "blocked" || lane.status === "failed" || lane.status === "cancelled").length ?? 0;
			const total = run?.lanes.length ?? graphLanes.length;
			const completedWidth = total === 0 ? 0 : Math.round(completed / total * 100);
			const attentionWidth = total === 0 ? 0 : Math.round(attention / total * 100);
			const pendingWidth = Math.max(0, 100 - completedWidth - attentionWidth);
			const selectionBlocked = hasCards && surfaces.selected === 0;
			const startLabel = !hasCards ? "Предложить поверхности атаки" : activeRun ? run?.status === "paused" ? "Запуск приостановлен" : "Запуск выполняется" : run === void 0 ? "Начать первый запуск" : "Создать новый запуск";
			const startDisabled = busy || activeRun || selectionBlocked;
			const startHint = selectionBlocked ? "Сначала выберите ниже 2–3 карточки поверхности атаки, затем начните запуск." : void 0;
			const start = () => {
				if (!hasCards) onAction({
					action: "campaign.surfaces.propose",
					id: campaign.id
				}, "Предложены карточки поверхности атаки");
				else onStart();
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "omv-detail-backdrop",
				onClick: onClose
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", {
				className: "omv-detail omv-campaign-detail",
				"data-expanded": expanded || void 0,
				role: expanded ? "dialog" : void 0,
				"aria-modal": expanded || void 0,
				"aria-label": `${campaign.title} — подробности`,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "omv-detail-head",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-detail-head-copy",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: campaign.title }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
								campaign.target.name,
								" · ",
								campaign.target.version,
								" · ",
								campaign.target.ecosystem
							] })]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Status, { value: run?.status ?? campaign.status }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "omv-icon-button omv-detail-expand",
							"aria-label": expanded ? "Вернуть панель подробностей на половину экрана" : "Увеличить панель подробностей",
							"aria-expanded": expanded,
							title: expanded ? "Вернуть панель подробностей на половину экрана" : "Увеличить панель подробностей",
							onClick: onToggleExpand,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
								name: expanded ? "minimize" : "maximize",
								size: 15
							})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: "omv-icon-button",
							autoFocus: true,
							"aria-label": "Закрыть подробности",
							onClick: onClose,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
								name: "close",
								size: 15
							})
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "omv-detail-body",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-campaign-summary",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Глубина аудита" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: campaignLabel(campaign.budget.depth) })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Режим охвата" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: campaignLabel(campaign.scope.mode) })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Цель результата" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: campaignLabel(campaign.goal.output) })] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Поверхность атаки" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: hasCards ? `${surfaces.selected} выбрано · ${surfaces.skipped} пропущено` : "Пока не предложено" })] })
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-detail-actions",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "primary",
									disabled: startDisabled,
									title: startHint,
									onClick: start,
									icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
										name: "campaign",
										size: 12
									}),
									children: startLabel
								}),
								hasCards && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									disabled: busy,
									onClick: () => onAction({
										action: "campaign.surfaces.propose",
										id: campaign.id,
										force: true
									}, "Карточки поверхности атаки предложены заново"),
									children: "Предложить заново"
								}),
								linkedElsewhere && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									onClick: () => onOpenSession(payload.sessionLink.sessionId),
									children: "Открыть связанный чат"
								})
							]
						}),
						startHint !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "omv-hint-line",
							role: "note",
							children: startHint
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Section, {
							title: "Карточки поверхности атаки",
							meta: hasCards ? `${surfaces.selected} выбрано · ${surfaces.proposed} не определено · ${surfaces.skipped} пропущено` : "Постановка исследования",
							children: [surfaces.issue !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: "omv-surface-issue",
								children: surfaces.issue
							}), !hasCards ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
								label: "Карточек поверхности атаки пока нет",
								description: "Сначала предложите карточки, затем выберите 2–3 неподтверждённые гипотезы. Выбор гипотезы не означает наличия уязвимости.",
								compact: true
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
								className: "omv-surface-cards",
								children: surfaces.cards.map((card) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
									className: "omv-surface-card",
									"data-status": card.status,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "omv-surface-card-head",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: "omv-surface-kicker",
												children: [
													card.vulnerabilityClass,
													" · ",
													card.pack
												]
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: card.title })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Status, { value: card.status })]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: card.why }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "omv-surface-lists",
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Источники данных" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: card.sources.join(" · ") })] }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Приёмники данных" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: card.sinks.join(" · ") })] }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Защитные проверки" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: card.guards.join(" · ") })] })
											]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", {
											className: "omv-surface-fp",
											children: ["Проверки на опровержение: ", card.falsePositiveChecks.join(" · ")]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "omv-surface-actions",
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: card.findingId }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
													variant: "outline",
													size: "sm",
													disabled: busy || card.status === "selected",
													onClick: () => onAction({
														action: "campaign.surfaces.select",
														id: campaign.id,
														cardIds: [card.id]
													}, `Выбрано: ${card.id}`),
													children: "Выбрать"
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
													variant: "outline",
													size: "sm",
													disabled: busy || card.status === "skipped",
													onClick: () => onAction({
														action: "campaign.surfaces.skip",
														id: campaign.id,
														cardIds: [card.id]
													}, `Пропущено: ${card.id}`),
													children: "Пропустить"
												})
											]
										})
									]
								}, card.id))
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Section, {
							title: "Карта выполнения",
							meta: run === void 0 ? `${graphLanes.length} направлений · Ожидает запуска` : `${statusLabel(run.status)} · Одновременно: ${run.concurrency} · ${resolved}/${total} завершено`,
							children: [run !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-run-head",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: run.id }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
									formatTime(run.updatedAt),
									" · ",
									completed,
									" готово · ",
									attention,
									" ожидает обработки · ",
									total - completed - attention,
									" не завершено"
								] })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [run.status === "running" || run.status === "queued" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									disabled: rowBusy(`campaign.run:${run.id}:pause:all`),
									onClick: () => onControl(run.id, "pause"),
									children: "Приостановить"
								}) : run.status === "paused" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									disabled: rowBusy(`campaign.run:${run.id}:resume:all`),
									onClick: () => onControl(run.id, "resume"),
									children: "Возобновить"
								}) : null, activeRun && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									disabled: rowBusy(`campaign.run:${run.id}:cancel:all`),
									onClick: () => onControl(run.id, "cancel"),
									children: "Отмена"
								})] })]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-run-progress",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {
										"data-kind": "completed",
										style: { width: `${completedWidth}%` }
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {
										"data-kind": "attention",
										style: {
											left: `${completedWidth}%`,
											width: `${attentionWidth}%`
										}
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {
										"data-kind": "pending",
										style: {
											left: `${completedWidth + attentionWidth}%`,
											width: `${pendingWidth}%`
										}
									})
								]
							})] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CampaignWarRoom, {
								target: `${campaign.target.name} ${campaign.target.version}`,
								ecosystem: campaign.target.ecosystem,
								lanes: warLanes,
								onControl,
								onOpenSession,
								...onFinding === void 0 ? {} : { onFinding }
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Section, {
							title: "Порядок выполнения",
							meta: payload.runbookExists ? "Готово" : "Отсутствует",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-path-block",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: payload.runbookPath }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: payload.nextAction })]
							})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Section, {
							title: "История координации",
							meta: `${payload.history.length} событий`,
							children: payload.history.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
								label: "Эта задача аудита ещё не выполнялась в DSH",
								compact: true
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
								className: "omv-history",
								children: payload.history.map((event) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {
									style: { color: activityColor(event.action) },
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
										name: "activity",
										size: 11
									})
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: activityLabel(event.action) }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
									formatTime(event.timestamp),
									" · ",
									event.sessionId ?? "Неизвестный сеанс"
								] })] })] }, event.id))
							})
						})
					]
				})]
			})] });
		}
		function SearchPage({ projectRoot, onFinding, onCampaign }) {
			const [query, setQuery] = (0, react.useState)("");
			const [results, setResults] = (0, react.useState)([]);
			const [searching, setSearching] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)();
			const [retryNonce, setRetryNonce] = (0, react.useState)(0);
			(0, react.useEffect)(() => {
				const value = query.trim();
				if (value === "") {
					setResults([]);
					setError(void 0);
					return;
				}
				const controller = new AbortController();
				const timer = window.setTimeout(() => {
					setSearching(true);
					api(`/search?q=${encodeURIComponent(value)}`, { signal: controller.signal }, projectRoot).then((results) => {
						setResults(results);
						setError(void 0);
					}).catch((error) => {
						if (error.name !== "AbortError") {
							setResults([]);
							setError(messageOf(error));
						}
					}).finally(() => setSearching(false));
				}, 180);
				return () => {
					window.clearTimeout(timer);
					controller.abort();
				};
			}, [
				projectRoot,
				query,
				retryNonce
			]);
			const counts = (0, react.useMemo)(() => {
				const summary = {
					finding: 0,
					campaign: 0,
					activity: 0
				};
				for (const result of results) summary[result.kind] += 1;
				return summary;
			}, [results]);
			const groups = (0, react.useMemo)(() => [
				{
					kind: "finding",
					label: "Поиск уязвимостей",
					items: results.filter((result) => result.kind === "finding")
				},
				{
					kind: "campaign",
					label: "Задача аудита",
					items: results.filter((result) => result.kind === "campaign")
				},
				{
					kind: "activity",
					label: "Журнал активности",
					items: results.filter((result) => result.kind === "activity")
				}
			].filter((group) => group.items.length > 0), [results]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "omv-search-page",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("header", {
						className: "omv-workbench-header",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-workbench-title",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "Поиск" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Индекс рабочей области" })]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "Находки · Задачи аудита · Активность" })] })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-search-toolbar",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-search omv-global-search",
							"aria-busy": searching,
							"data-searching": searching || void 0,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
									"aria-label": "Поиск по рабочей области OMV",
									autoFocus: true,
									className: "omv-global-input",
									icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
										name: "search",
										size: 15
									}),
									value: query,
									placeholder: "Поиск по находкам, пакетам, доказательствам и задачам",
									onChange: (event) => setQuery(event.target.value)
								}),
								query !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "omv-search-clear",
									"aria-label": "Очистить поиск",
									onClick: () => setQuery(""),
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
										name: "close",
										size: 13
									})
								}),
								searching && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "omv-search-progress",
									"aria-hidden": "true"
								})
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "omv-search-hint",
							children: "Enter — открыть · ↑↓ — перемещение"
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "omv-panel omv-search-results",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "omv-results-meta",
							children: query.trim() === "" ? "Ожидание ввода" : searching ? "Поиск…" : error !== void 0 ? "Не удалось выполнить поиск" : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: results.length }),
								" результатов",
								results.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
									"Находки: ",
									counts.finding,
									" · Задачи: ",
									counts.campaign,
									" · Активность: ",
									counts.activity
								] })
							] })
						}), searching ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Loading, { label: "Поиск по рабочей области…" }) : error !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
							label: "Не удалось выполнить поиск",
							description: error,
							action: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setRetryNonce((value) => value + 1),
								icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
									name: "refresh",
									size: 12
								}),
								children: "Повторить"
							})
						}) : query.trim() === "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
							label: "Поиск по рабочей области",
							description: "Введите ключевые слова: находка, пакет, тип уязвимости, задача или действие."
						}) : results.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
							label: "Подходящих результатов нет",
							description: "Измените запрос или проверьте рабочую область, связанную с текущим чатом."
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "omv-search-groups",
							children: groups.map((group) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
								className: "omv-search-group",
								"aria-labelledby": `omv-search-group-${group.kind}`,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "omv-search-group-head",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
										id: `omv-search-group-${group.kind}`,
										children: group.label
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: group.items.length })]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: group.items.map((result) => {
									const actionable = result.kind !== "activity" || result.targetKind !== void 0;
									const open = () => {
										if (result.kind === "finding") onFinding(result.id, result.archived);
										else if (result.kind === "campaign") onCampaign(result.id);
										else if (result.targetKind === "finding" && result.targetId !== void 0) onFinding(result.targetId, result.archived);
										else if (result.targetKind === "campaign" && result.targetId !== void 0) onCampaign(result.targetId);
									};
									return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
										...actionable ? {
											tabIndex: 0,
											role: "button",
											"aria-label": `Открыть ${result.title}`,
											onKeyDown: (event) => {
												if (event.key === "Enter" || event.key === " ") {
													event.preventDefault();
													open();
												}
											}
										} : {},
										onClick: actionable ? open : void 0,
										"data-actionable": actionable,
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: "omv-search-kind",
												"data-kind": result.kind,
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
													name: result.kind === "finding" ? "finding" : result.kind === "campaign" ? "campaign" : "activity",
													size: 14
												}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: result.kind === "finding" ? "Находка" : result.kind === "campaign" ? "Задача" : "Активность" })]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: result.title }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: result.description }),
												result.kind === "activity" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", {
													className: "omv-search-result-meta",
													children: [
														result.targetKind === void 0 ? "Запись рабочей области" : result.targetKind === "finding" ? "Связать находку" : "Связать задачу аудита",
														" · ",
														relativeTime(result.timestamp ?? "")
													]
												})
											] }),
											actionable && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
												name: "chevron",
												size: 12
											})
										]
									}, `${result.kind}-${result.id}`);
								}) })]
							}, group.kind))
						})]
					})
				]
			});
		}
		function ReproductionPage({ data, onFinding, onStart, onOpenSession }) {
			const [filter, setFilter] = (0, react.useState)("all");
			const runs = data.reproductionRuns;
			const active = runs.filter((run) => run.status === "running").length;
			const passedRuns = runs.filter((run) => run.status === "passed");
			const attentionRuns = runs.filter((run) => run.status === "failed" || run.status === "blocked");
			const pendingCandidates = data.findings.filter((finding) => finding.assessment.dimensions.some((dimension) => dimension.id === "runtime_verification" && dimension.state !== "verified" && dimension.state !== "not_applicable"));
			const needs = pendingCandidates.length;
			const filteredRuns = runs.filter((run) => filter === "all" || filter === run.status || filter === "attention" && (run.status === "failed" || run.status === "blocked"));
			const pendingFindings = pendingCandidates.slice(0, 8);
			const filterItems = [
				{
					id: "all",
					label: "Все",
					count: runs.length
				},
				{
					id: "running",
					label: "Выполняется",
					count: active
				},
				{
					id: "passed",
					label: "Пройдено",
					count: passedRuns.length
				},
				{
					id: "attention",
					label: "Требует действий",
					count: attentionRuns.length
				}
			];
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "omv-reproduction-page",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Hero, {
						eyebrow: "Доказательства выполнения",
						title: "Лаборатория воспроизведения",
						description: "Команды, окружение, вывод и артефакты сохраняются рядом с находкой в структурированной записи запуска. Результат воспроизведения дополняет цепочку доказательств.",
						actions: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: "omv-hero-status",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { "data-state": active > 0 ? "live" : "idle" }), active > 0 ? `${active} запусков выполняется` : "Сейчас нет выполняющихся запусков"]
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-page-context omv-repro-context",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: runs.length }), " запусков"] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: active }), " выполняется"] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: passedRuns.length }), " пройдено"] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: attentionRuns.length > 0 ? "omv-page-context-warning" : void 0,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}),
									" ",
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: attentionRuns.length }),
									" требует действий"
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: needs }), " находок ожидают проверки"] })
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-metrics omv-repro-metrics",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Metric, {
								label: "Всего запусков",
								value: runs.length,
								foot: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: passedRuns.length }), " успешно"] }),
								icon: "pulse",
								color: "var(--omv-teal)"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Metric, {
								label: "Находки, ожидающие проверки",
								value: needs,
								foot: "Воспроизведение можно начать прямо из списка ниже",
								icon: "finding",
								color: "var(--omv-orange)"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Metric, {
								label: "Ошибки / препятствия",
								value: attentionRuns.length,
								foot: "Сохраните состояние и дополните окружение",
								icon: "alert",
								color: "var(--omv-red)"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Metric, {
								label: "Доля успешных проверок",
								value: runs.length === 0 ? "—" : `${Math.round(passedRuns.length / runs.length * 100)}%`,
								foot: "Рассчитывается по запускам",
								icon: "check",
								color: "var(--omv-green)"
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-repro-layout",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							className: "omv-panel omv-repro-board",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-panel-head",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
										className: "omv-panel-kicker",
										children: "ИСТОРИЯ ЗАПУСКОВ"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "Очередь экспериментов" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "Из каждого запуска можно открыть соответствующую находку и весь её контекст" })
								] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "omv-repro-filters",
									role: "tablist",
									"aria-label": "Фильтр запусков воспроизведения",
									children: filterItems.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										role: "tab",
										"aria-selected": filter === item.id,
										"data-active": filter === item.id,
										onClick: () => setFilter(item.id),
										children: [item.label, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: item.count })]
									}, item.id))
								})]
							}), filteredRuns.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
								label: runs.length === 0 ? "Запусков воспроизведения пока нет" : "Подходящих запусков нет",
								description: runs.length === 0 ? "Начните структурированное воспроизведение из списка ожидающих проверки справа или из подробностей находки." : "Измените фильтр статуса, чтобы увидеть другие запуски.",
								compact: true
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: filteredRuns.map((run) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
								className: "omv-repro-card",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "omv-repro-card-head",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Status, { value: run.status }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
												type: "button",
												className: "omv-link-button",
												onClick: () => onFinding(run.findingId),
												children: [run.findingId, /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
													name: "chevron",
													size: 11
												})]
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: run.id })
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.CodeBlock, {
										code: run.command ?? "Ожидание команды",
										lang: "shellscript",
										className: "omv-repro-code",
										copyLabel: "Копировать команду",
										copiedLabel: "Скопировано"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "omv-repro-facts",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "Окружение" }), run.environment === void 0 ? "Не записано" : Object.entries(run.environment).map(([key, value]) => `${key}=${value}`).join(" · ")] }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "Результат" }), run.exitCode === void 0 ? "Не завершено" : `exit ${run.exitCode}`] }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "Артефакты запуска" }),
												run.artifacts.length,
												" шт."
											] })
										]
									}),
									run.output !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.TerminalBlock, {
										command: run.command ?? "Ожидание команды",
										output: run.output,
										exitCode: run.exitCode,
										running: run.status === "running",
										className: "omv-repro-terminal",
										labels: {
											copy: "Копировать вывод",
											copied: "Скопировано",
											noOutput: "Вывода пока нет"
										}
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "omv-repro-card-foot",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
											formatTime(run.updatedAt),
											" · ",
											run.status === "running" ? "Ожидание результата запуска" : run.finishedAt === void 0 ? "Обновлено" : `Завершено: ${formatTime(run.finishedAt)}`
										] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [run.sessionId !== void 0 && onOpenSession !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "omv-link-button",
											onClick: () => onOpenSession(run.sessionId),
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
												name: "terminal",
												size: 11
											}), "Чат"]
										}), run.status === "failed" || run.status === "blocked" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											size: "sm",
											className: "omv-repro-restart",
											onClick: () => onStart(run.findingId),
											children: "Начать заново"
										}) : null] })]
									})
								]
							}, run.id)) })]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							className: "omv-panel omv-repro-pending",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "omv-panel-head",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											className: "omv-panel-kicker",
											children: "СЛЕДУЮЩИЕ ПРОВЕРКИ"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "Находки, ожидающие проверки" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "Начните следующее воспроизведение отсюда" })
									] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: needs })]
								}),
								pendingFindings.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
									label: "Все находки прошли проверку во время выполнения",
									description: "Новые кандидаты появятся здесь автоматически.",
									compact: true
								}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: pendingFindings.map((finding) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "omv-repro-pending-row",
									onClick: () => onFinding(finding.id),
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(EcosystemAvatar, { ecosystem: finding.ecosystem }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: finding.id }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", { children: [
											finding.package,
											" · ",
											finding.vulnerability
										] })] }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Maturity, {
											assessment: finding.assessment,
											compact: true
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
											name: "chevron",
											size: 12
										})
									]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "omv-repro-pending-action",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: finding.nextAction }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										variant: "primary",
										size: "sm",
										onClick: () => onStart(finding.id),
										children: "Начать воспроизведение"
									})]
								})] }, finding.id)) }),
								pendingFindings.length < needs && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "omv-section-footer",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "omv-link-button",
										onClick: () => onFinding(pendingFindings[0]?.id ?? ""),
										children: [
											"Посмотреть остальные ",
											needs - pendingFindings.length,
											" находок"
										]
									})
								})
							]
						})]
					})
				]
			});
		}
		function FindingDetail({ payload, busy, expanded, onToggleExpand, isBusy, currentSessionId, onClose, onAction, onWorkflow, onLink, onOpenSession, onOpenPath, onStartReproduction, onScanDedup, onUpdateDedup }) {
			const { detail, evidence, doctor, review, dedup } = payload;
			const issues = doctor?.issues ?? [];
			const source = valueAt(evidence, "evidence.source");
			const sink = valueAt(evidence, "evidence.sink");
			const guard = valueAt(evidence, "evidence.guard");
			const sources = dedupSources(evidence);
			const sixSourceComplete = dedupComplete(evidence);
			const existingCve = dedupExistingCve(evidence);
			const rowBusy = isBusy ?? (() => busy);
			const mainIntent = primaryIntent(payload.stage);
			const linkIsCurrent = payload.sessionLink?.sessionId === currentSessionId;
			const actionBusy = (action) => rowBusy(`action:${action}:${detail.id}`);
			const workflowBusy = rowBusy(`workflow:${mainIntent}:${detail.id}`);
			const [archiveOpen, setArchiveOpen] = (0, react.useState)(false);
			const [archiveReason, setArchiveReason] = (0, react.useState)("");
			const [deleteOpen, setDeleteOpen] = (0, react.useState)(false);
			const [deleteConfirmId, setDeleteConfirmId] = (0, react.useState)("");
			const [detailTab, setDetailTab] = (0, react.useState)("overview");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "omv-detail-backdrop",
					onClick: onClose
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("aside", {
					className: "omv-detail omv-finding-detail",
					"data-expanded": expanded || void 0,
					role: expanded ? "dialog" : void 0,
					"aria-modal": expanded || void 0,
					"aria-label": `${detail.id} — подробности`,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-detail-head",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-detail-head-copy",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: detail.id }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
									detail.package,
									" · ",
									detail.ecosystem,
									" · ",
									detail.vulnerability
								] })]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Status, { value: payload.stage }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "omv-icon-button omv-detail-expand",
								"aria-label": expanded ? "Вернуть панель подробностей на половину экрана" : "Увеличить панель подробностей",
								"aria-expanded": expanded,
								title: expanded ? "Вернуть панель подробностей на половину экрана" : "Увеличить панель подробностей",
								onClick: onToggleExpand,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
									name: expanded ? "minimize" : "maximize",
									size: 15
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: "omv-icon-button",
								autoFocus: true,
								"aria-label": "Закрыть подробности",
								onClick: onClose,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
									name: "close",
									size: 15
								})
							})
						]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-detail-body",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-detail-summary",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "omv-maturity-hero",
									"data-maturity": payload.assessment.maturity,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(EvidenceStatusLogo, { maturity: payload.assessment.maturity }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "omv-maturity-copy",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "Состояние доказательств" }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: maturityLabel(payload.assessment.maturity) }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: phaseLabel(payload.assessment.phase) })
										]
									})]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "omv-summary-copy",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: review?.summary ?? (detail.archived ? "Находка в архиве" : "Проверка доказательств") }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", { children: [
											payload.assessment.summary,
											" Текущее заключение: ",
											detail.verdict.exploitability,
											"; совокупная уверенность: ",
											confidenceLabel(payload.assessment.confidence),
											"。"
										] }),
										!detail.archived && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "omv-next-chip",
											title: "Следующее действие",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Следующий шаг" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: detail.nextAction })]
										}),
										!detail.archived && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "omv-detail-actions omv-detail-primary-actions",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "primary",
												disabled: busy || workflowBusy,
												onClick: () => onWorkflow(mainIntent),
												icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
													name: "pulse",
													size: 12
												}),
												children: workflowBusy ? "Отправка…" : workflowLabel(mainIntent)
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
												className: "omv-detail-more",
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: "Другие действия" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
													className: "omv-detail-more-menu",
													children: [
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
															variant: "outline",
															size: "sm",
															disabled: busy || actionBusy("finding.validate"),
															onClick: () => onAction({
																action: "finding.validate",
																id: detail.id
															}, "Проверка Evidence.v1 завершена"),
															icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
																name: "check",
																size: 12
															}),
															children: actionBusy("finding.validate") ? "Проверка…" : "Проверить доказательства"
														}),
														detail.status === "candidate" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
															variant: "outline",
															size: "sm",
															disabled: busy || actionBusy("finding.promote"),
															onClick: () => onAction({
																action: "finding.promote",
																id: detail.id,
																status: "confirmed"
															}, "Статус повышен до confirmed"),
															icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
																name: "arrowUp",
																size: 12
															}),
															children: "Подтвердить находку"
														}),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
															variant: "outline",
															size: "sm",
															className: "omv-danger-button",
															disabled: busy || actionBusy("finding.archive"),
															onClick: () => {
																setArchiveReason("");
																setArchiveOpen(true);
															},
															icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
																name: "archive",
																size: 12
															}),
															children: "Убрать в архив"
														}),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
															variant: "outline",
															size: "sm",
															className: "omv-danger-button",
															disabled: busy || actionBusy("finding.delete"),
															onClick: () => {
																setDeleteConfirmId("");
																setDeleteOpen(true);
															},
															icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
																name: "alert",
																size: 12
															}),
															children: "Удалить навсегда"
														})
													]
												})]
											})]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("nav", {
								className: "omv-detail-tabs",
								"aria-label": "Разделы подробностей находки",
								role: "tablist",
								children: [
									["overview", "Обзор"],
									["evidence", "Доказательства"],
									["repro", "Воспроизведение"],
									["history", "История"]
								].map(([id, label]) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									role: "tab",
									"aria-selected": detailTab === id,
									className: detailTab === id ? "active" : void 0,
									onClick: () => setDetailTab(id),
									children: label
								}, id))
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-detail-tab-panel",
								"data-tab": "overview",
								hidden: detailTab !== "overview",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Section, {
										title: "Чат DSH",
										meta: payload.sessionLink === void 0 ? "Не связано" : formatTime(payload.sessionLink.updatedAt),
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "omv-session-link",
											"data-linked": payload.sessionLink !== void 0,
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {
													className: "omv-session-link-icon",
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
														name: "terminal",
														size: 16
													})
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: payload.sessionLink === void 0 ? "У находки пока нет чата исследования" : linkIsCurrent ? "Связано с текущим чатом" : "Связано с другим чатом исследования" }),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: payload.sessionLink?.sessionId ?? currentSessionId }),
													payload.sessionLink?.lastIntent !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: ["Последнее действие процесса: ", workflowLabel(payload.sessionLink.lastIntent)] })
												] }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [payload.sessionLink !== void 0 && !linkIsCurrent && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
													variant: "outline",
													size: "sm",
													onClick: () => onOpenSession(payload.sessionLink.sessionId),
													children: "Открыть чат"
												}), !linkIsCurrent && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
													variant: "outline",
													size: "sm",
													disabled: busy,
													onClick: onLink,
													children: "Связать текущий чат"
												})] })
											]
										})
									}),
									!detail.archived && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Section, {
										title: "Процесс аудита",
										meta: statusLabel(payload.stage),
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "omv-workflow-actions",
											children: [
												"audit",
												"repro",
												"dedup",
												"critic",
												"report",
												"disclose"
											].map((intent) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: intent === mainIntent ? "primary" : "outline",
												size: "sm",
												className: "omv-workflow-button",
												disabled: busy,
												onClick: () => onWorkflow(intent),
												children: workflowLabel(intent)
											}, intent))
										})
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Section, {
										title: "Зрелость доказательств",
										meta: `${maturityLabel(payload.assessment.maturity)} · ${confidenceLabel(payload.assessment.confidence)}Уверенность`,
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
											className: "omv-assessment-dimensions",
											children: payload.assessment.dimensions.map((dimension) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
												"data-state": dimension.state,
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
														name: checkStateIcon(dimension.state),
														size: 11
													}) }),
													/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: dimension.label }),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: dimension.detail }),
														dimension.nextAction !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: dimension.nextAction })
													] }),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Status, { value: dimension.state })
												]
											}, dimension.id))
										})
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Section, {
										title: "Условия передачи",
										meta: payload.qualityGate.readyForReport ? "Условия выполнены" : detail.status === "confirmed" ? `${payload.qualityGate.blockers.length} требуют действий` : "Этап исследования — строгая блокировка пока не применяется",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
											className: "omv-gate-summary",
											children: payload.qualityGate.summary
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
											className: "omv-gate-checks",
											children: payload.qualityGate.checks.map((check) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
												"data-state": check.state,
												"data-blocking": check.blocking || void 0,
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
														name: checkStateIcon(check.state),
														size: 12
													}) }),
													/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: check.label }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [check.detail, check.nextAction === void 0 ? "" : ` · ${check.nextAction}`] })] }),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: check.blocking ? "Условия передачи" : "Рекомендации по исследованию" })
												]
											}, check.id))
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-detail-tab-panel",
								"data-tab": "evidence",
								hidden: detailTab !== "evidence",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Section, {
									title: "Цепочка доказательств",
									meta: "Источник → Приёмник → Защитная проверка",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "omv-chain",
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChainCard, {
												label: "Источник",
												value: source,
												...onOpenPath === void 0 ? {} : { onOpen: onOpenPath }
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "omv-chain-arrow",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
													name: "chevron",
													size: 12
												})
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChainCard, {
												label: "Приёмник",
												value: sink,
												...onOpenPath === void 0 ? {} : { onOpen: onOpenPath }
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: "omv-chain-arrow",
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
													name: "chevron",
													size: 12
												})
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChainCard, {
												label: "Защита",
												value: guard,
												...onOpenPath === void 0 ? {} : { onOpen: onOpenPath }
											})
										]
									})
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Section, {
									title: "Граф доказательств",
									meta: `Путь атаки · ${payload.graph.nodes.length} узлов · ${payload.graph.edges.length} связей`,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(EvidenceFlowCanvas, {
										graph: payload.graph,
										...onOpenPath === void 0 ? {} : { onOpenPath }
									})
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-detail-tab-panel",
								"data-tab": "repro",
								hidden: detailTab !== "repro",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Section, {
									title: "Лаборатория PoC",
									meta: `${payload.pocDrafts.length} черновиков · ${payload.pocRuns.length} изолированных запусков`,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PocLab, {
										drafts: payload.pocDrafts,
										runs: payload.pocRuns,
										findingId: detail.id,
										busy,
										archived: detail.archived,
										onAction
									})
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Section, {
									title: "Запуски воспроизведения",
									meta: `${payload.reproductionRuns.length} попыток`,
									children: payload.reproductionRuns.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "omv-inline-empty",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
											label: "Структурированных запусков пока нет. Начните через процесс воспроизведения.",
											compact: true
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											size: "sm",
											className: "omv-inline-action",
											disabled: busy || detail.archived,
											onClick: () => onStartReproduction(detail.id),
											children: "Начать воспроизведение"
										})]
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
										className: "omv-repro-runs",
										children: payload.reproductionRuns.map((run) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Status, { value: run.status }),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: run.command ?? run.id }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
												formatTime(run.updatedAt),
												run.exitCode === void 0 ? "" : ` · exit ${run.exitCode}`,
												" · ",
												run.artifacts.length,
												" артефактов запуска"
											] })] }),
											run.sessionId !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "outline",
												size: "sm",
												className: "omv-run-action",
												onClick: () => onOpenSession(run.sessionId),
												children: "Чат"
											})
										] }, run.id))
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "omv-section-footer",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											size: "sm",
											className: "omv-section-action",
											disabled: busy || detail.archived,
											onClick: () => onStartReproduction(detail.id),
											children: "Создать ещё один запуск"
										})
									})] })
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-detail-tab-panel",
								"data-tab": "evidence",
								hidden: detailTab !== "evidence",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Section, {
									title: "Сведения о возможных дублях",
									meta: `${dedup.status === "unknown" ? "Поиск ещё не выполнялся" : dedup.status} · ${dedup.matches.length} совпадений`,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "omv-dedup-head",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: dedup.nextAction }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: dedup.scannedAt === void 0 ? "Проверьте локальные находки, чтобы сохранить прослеживаемое сопоставление." : `Последняя проверка: ${formatTime(dedup.scannedAt)} · Источник: ${dedup.sources.join("、") || "Локально"}` })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "outline",
												size: "sm",
												className: "omv-dedup-action",
												disabled: busy || detail.archived,
												onClick: () => onScanDedup(detail.id),
												children: dedup.scannedAt === void 0 ? "Начать поиск" : "Повторить поиск"
											})]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: "omv-dedup-sources",
											"data-complete": sixSourceComplete || void 0,
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
													className: "omv-dedup-sources-head",
													children: [
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Проверка новизны по шести источникам" }),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: sixSourceComplete ? "Все шесть источников проверены" : `${sources.filter((item) => item.searched).length}/6` }),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "Отсутствие записи в базах бюллетеней не доказывает новизну: раскрытие в задачах, PR, коммитах или на сайтах тоже может означать дубль." })
													]
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: sources.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
													"data-searched": item.searched || void 0,
													"data-group": item.group,
													children: [
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)(DedupSourceLogo, {
															source: item.key,
															searched: item.searched
														}),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: item.label }),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("em", { children: item.searched ? "Поиск выполнен" : "Поиск не выполнялся" })
													]
												}, item.key)) }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
													className: "omv-dedup-cve",
													children: [
														"existing_cve：",
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: existingCve }),
														existingCve !== "none" && existingCve !== "unknown" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: "Возможно, уже раскрыто" })
													]
												})
											]
										}),
										dedup.matches.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
											className: "omv-dedup-list",
											children: dedup.matches.map((match) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: match.title }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: match.reasons.join(" · ") }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("code", { children: [
													match.source,
													" · Сходство: ",
													match.score,
													"%",
													match.targetFindingId === void 0 ? "" : ` · ${match.targetFindingId}`
												] })
											] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
												className: "omv-dedup-actions",
												children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Status, { value: match.status }), match.status === "open" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
													variant: "outline",
													size: "sm",
													className: "omv-dedup-row-action",
													disabled: rowBusy(`action:dedup.update:${detail.id}`),
													onClick: () => onUpdateDedup(detail.id, "duplicate", match.id),
													children: "Подтвердить дубль"
												}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
													variant: "outline",
													size: "sm",
													className: "omv-dedup-row-action",
													disabled: rowBusy(`action:dedup.update:${detail.id}`),
													onClick: () => onUpdateDedup(detail.id, "clear", match.id),
													children: "Исключить"
												})] })]
											})] }, match.id))
										})
									]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Section, {
									title: "Замечания проверки",
									meta: `${issues.length} шт.`,
									children: issues.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
										label: "Замечаний проверки нет",
										compact: true
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
										className: "omv-issues",
										children: issues.slice(0, 16).map((issue, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
											className: "omv-issue",
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {
												className: "omv-issue-dot",
												style: { "--issue": issue.severity === "error" ? "#ff6075" : issue.severity === "warning" ? "#f3b85b" : "#7188ff" }
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: issue.message }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: issue.nextAction })] })]
										}, `${issue.id}-${index}`))
									})
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-detail-tab-panel",
								"data-tab": "history",
								hidden: detailTab !== "history",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Section, {
									title: "Изменения доказательств",
									meta: payload.lastDiff === void 0 ? "Изменений от плагина пока нет" : `${payload.lastDiff.additions}+ / ${payload.lastDiff.deletions}-`,
									children: payload.lastDiff === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
										label: "Изменения Evidence, внесённые процессом работы, появятся здесь",
										compact: true
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "omv-diff",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: payload.lastDiff.action }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("code", { children: [
											payload.lastDiff.beforeHash,
											" → ",
											payload.lastDiff.afterHash
										] })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.CodeBlock, {
											code: payload.lastDiff.patch,
											lang: "diff",
											className: "omv-diff-code"
										})]
									})
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Section, {
									title: "История процесса",
									meta: `${payload.history.length} событий`,
									children: payload.history.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
										label: "Для находки пока нет записей процесса DSH",
										compact: true
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
										className: "omv-history",
										children: payload.history.slice(0, 12).map((event) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {
												style: { color: activityColor(event.action) },
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
													name: "activity",
													size: 11
												})
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: event.intent === void 0 ? activityLabel(event.action) : workflowLabel(event.intent) }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [formatTime(event.timestamp), event.sessionId === void 0 ? "" : ` · ${event.sessionId}`] })] }),
											event.diff !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("b", { children: [
												event.diff.additions,
												"+ / ",
												event.diff.deletions,
												"-"
											] })
										] }, event.id))
									})
								})]
							}),
							detail.archived && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-detail-actions omv-detail-primary-actions",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "primary",
									disabled: busy || actionBusy("finding.restore"),
									onClick: () => onAction({
										action: "finding.restore",
										id: detail.id
									}, "Находка восстановлена"),
									icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
										name: "refresh",
										size: 12
									}),
									children: actionBusy("finding.restore") ? "Восстановление…" : "Вернуть в активную очередь"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
									className: "omv-detail-more",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: "Другие действия" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "omv-detail-more-menu",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											size: "sm",
											className: "omv-danger-button",
											disabled: busy || actionBusy("finding.delete"),
											onClick: () => {
												setDeleteConfirmId("");
												setDeleteOpen(true);
											},
											icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
												name: "alert",
												size: 12
											}),
											children: "Удалить навсегда"
										})
									})]
								})]
							})
						]
					})]
				}),
				archiveOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Modal, {
					title: "Убрать находку в архив",
					onClose: () => setArchiveOpen(false),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
						className: "omv-form",
						onSubmit: (event) => {
							event.preventDefault();
							const reason = archiveReason.trim();
							if (reason === "" || busy) return;
							setArchiveOpen(false);
							onAction({
								action: "finding.archive",
								id: detail.id,
								reason
							}, "Находка убрана в архив");
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
								className: "omv-form-note",
								children: [
									"Запись ",
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: detail.id }),
									" будет перемещена из активного реестра в архив. Файл Evidence и записи исследования сохранятся; находку можно восстановить."
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-field",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
									htmlFor: "omv-archive-reason",
									children: "Причина архивации"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
									id: "omv-archive-reason",
									className: "omv-form-input",
									value: archiveReason,
									placeholder: "Например: дубль, ложное срабатывание, отложено",
									onChange: (event) => setArchiveReason(event.target.value),
									autoFocus: true
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-form-actions",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									type: "button",
									variant: "outline",
									disabled: actionBusy("finding.archive"),
									onClick: () => setArchiveOpen(false),
									children: "Отмена"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									type: "submit",
									variant: "primary",
									disabled: busy || actionBusy("finding.archive") || archiveReason.trim() === "",
									children: actionBusy("finding.archive") ? "Перемещение…" : "Подтвердить архивацию"
								})]
							})
						]
					})
				}),
				deleteOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Modal, {
					title: "Удалить находку навсегда",
					onClose: () => setDeleteOpen(false),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
						className: "omv-form",
						onSubmit: (event) => {
							event.preventDefault();
							if (deleteConfirmId.trim() !== detail.id || busy) return;
							setDeleteOpen(false);
							onAction({
								action: "finding.delete",
								id: detail.id,
								confirmId: detail.id
							}, "Находка удалена навсегда");
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
								className: "omv-form-note",
								children: ["Доказательства этой находки, а также связанные только с ней воспроизведения, отчёты и состояние исследования будут безвозвратно удалены. В журнале рабочей области останется событие удаления. Для подтверждения введите полный идентификатор находки:", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: detail.id })]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-field",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
									htmlFor: "omv-delete-confirm-id",
									children: "Идентификатор находки"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
									id: "omv-delete-confirm-id",
									className: "omv-form-input",
									value: deleteConfirmId,
									placeholder: detail.id,
									onChange: (event) => setDeleteConfirmId(event.target.value),
									autoFocus: true
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-form-actions",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									type: "button",
									variant: "outline",
									disabled: actionBusy("finding.delete"),
									onClick: () => setDeleteOpen(false),
									children: "Отмена"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									type: "submit",
									variant: "primary",
									disabled: busy || actionBusy("finding.delete") || deleteConfirmId.trim() !== detail.id,
									children: actionBusy("finding.delete") ? "Удаление…" : "Удалить навсегда"
								})]
							})
						]
					})
				})
			] });
		}
		function PocLab({ drafts, runs, findingId, busy, archived, onAction }) {
			const [selectedDraftId, setSelectedDraftId] = (0, react.useState)();
			const selected = drafts.find((draft) => draft.id === selectedDraftId) ?? drafts[0];
			const [script, setScript] = (0, react.useState)(selected?.script ?? "");
			(0, react.useEffect)(() => setScript(selected?.script ?? ""), [selected?.id, selected?.script]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "omv-poc-lab",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-poc-intro",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "Превратите ручные команды воспроизведения в эксперимент, который можно проверить" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Создайте или измените черновик, одобрите и выполните его. Затем человек решает, принять ли результат и добавить его в Evidence." })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "primary",
							size: "sm",
							disabled: busy || archived,
							onClick: () => onAction({
								action: "poc.generate",
								id: findingId
							}, "Черновик PoC создан"),
							children: "Создать черновик"
						})]
					}),
					drafts.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, {
						label: "Черновиков PoC пока нет",
						description: "Создайте из текущей находки редактируемую безопасную заготовку.",
						compact: true
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-poc-grid",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-poc-drafts",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-poc-subhead",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Черновик" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: drafts.length })]
							}), drafts.map((draft) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "omv-poc-draft",
								"data-active": draft.id === selected?.id || void 0,
								onClick: () => setSelectedDraftId(draft.id),
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: draft.templateId }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("small", { children: [
									draft.language,
									" · ",
									draft.image
								] })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Status, { value: draft.status })]
							}, draft.id))]
						}), selected !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-poc-editor",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "omv-poc-editor-head",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: selected.id }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: selected.validation.ok ? "Проверки безопасности пройдены" : `${selected.validation.errors.length} проверок требуют действий` })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: selected.scriptSha256?.slice(0, 12) ?? "Хеш не вычислен" })]
								}),
								selected.generationPrompt !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
									className: "omv-poc-prompt",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: "Посмотреть ограничения генерации" }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: selected.generationPrompt }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: selected.resultProtocol ?? "Результат записывается в /output/result.json" })
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
									className: "omv-poc-textarea",
									value: script,
									onChange: (event) => setScript(event.target.value),
									spellCheck: false,
									"aria-label": "Скрипт PoC"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "omv-poc-actions",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											size: "sm",
											disabled: busy || archived || script === selected.script,
											onClick: () => onAction({
												action: "poc.draft.save",
												id: findingId,
												draftId: selected.id,
												script
											}, "Черновик PoC сохранён"),
											children: "Сохранить и проверить"
										}),
										selected.status !== "approved" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											size: "sm",
											disabled: busy || archived || !selected.validation.ok,
											onClick: () => onAction({
												action: "poc.draft.approve",
												draftId: selected.id
											}, "Черновик PoC одобрен"),
											children: "Одобрить выполнение"
										}),
										selected.status === "approved" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "primary",
											size: "sm",
											disabled: busy || archived,
											onClick: () => onAction({
												action: "poc.run.start",
												id: findingId,
												draftId: selected.id
											}, "PoC выполнен в изолированной среде"),
											children: "Выполнить PoC"
										})
									]
								}),
								selected.validation.errors.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
									className: "omv-poc-errors",
									children: selected.validation.errors.map((error) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: error }, error))
								}),
								selected.validation.warnings.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
									className: "omv-poc-warnings",
									children: selected.validation.warnings.map((warning) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: warning }, warning))
								})
							]
						})]
					}),
					runs.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-poc-runs",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-poc-subhead",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Журнал запусков" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: runs.length })]
						}), runs.map((run) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-poc-run",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Status, { value: run.status }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: run.id }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
										run.exitCode === void 0 ? "Код завершения не возвращён" : `exit ${run.exitCode}`,
										" · ",
										run.artifacts.length,
										" артефактов"
									] })
								] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: run.status === "passed" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
									variant: "outline",
									size: "sm",
									disabled: busy || archived,
									onClick: () => onAction({
										action: "poc.evidence.adopt",
										id: findingId,
										runId: run.id
									}, "Результат PoC принят и добавлен в Evidence"),
									children: "Принять доказательства"
								}) }),
								run.observedResult !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: run.observedResult })
							]
						}, run.id))]
					})
				]
			});
		}
		function NewFindingDialog({ busy, onClose, onSubmit }) {
			const [id, setId] = (0, react.useState)("");
			const [product, setProduct] = (0, react.useState)("");
			const [ecosystem, setEcosystem] = (0, react.useState)("npm");
			const [vulnerabilityClass, setVulnerabilityClass] = (0, react.useState)("");
			const [goal, setGoal] = (0, react.useState)("triage");
			const [touched, setTouched] = (0, react.useState)(false);
			const idIssue = touched ? findingIdError(id) : void 0;
			const submit = (event) => {
				event.preventDefault();
				setTouched(true);
				if (findingIdError(id) !== void 0 || product.trim() === "" || vulnerabilityClass.trim() === "") return;
				onSubmit({
					action: "finding.create",
					id: id.trim(),
					product: product.trim(),
					ecosystem,
					vulnerabilityClass: vulnerabilityClass.trim(),
					researcherGoal: goal
				});
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Modal, {
				title: "Создать потенциальную уязвимость",
				onClose,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
					className: "omv-form",
					onSubmit: submit,
					noValidate: true,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-form-grid",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Field, {
									label: "Идентификатор находки",
									full: true,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										autoFocus: true,
										required: true,
										className: "omv-form-input",
										value: id,
										placeholder: "npm-package-ssrf",
										"aria-invalid": idIssue !== void 0 || void 0,
										onChange: (event) => setId(event.target.value),
										onBlur: () => setTouched(true)
									}), idIssue !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "omv-field-error",
										role: "alert",
										children: idIssue
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
									label: "Пакет / продукт",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										required: true,
										className: "omv-form-input",
										value: product,
										placeholder: "package-name",
										onChange: (event) => setProduct(event.target.value)
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
									label: "Экосистема",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
										className: "omv-select",
										value: ecosystem,
										onChange: (event) => setEcosystem(event.target.value),
										children: [
											"npm",
											"python",
											"go",
											"rust",
											"java",
											"ruby",
											"php",
											"csharp",
											"swift",
											"dart",
											"elixir",
											"perl",
											"r",
											"lua"
										].map((value) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", { children: value }, value))
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
									label: "Тип уязвимости",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										required: true,
										className: "omv-form-input",
										value: vulnerabilityClass,
										placeholder: "ssrf / path-traversal",
										onChange: (event) => setVulnerabilityClass(event.target.value)
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
									label: "Цель исследования",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
										className: "omv-select",
										value: goal,
										onChange: (event) => setGoal(event.target.value),
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
												value: "triage",
												children: "Распределение"
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
												value: "CVE",
												children: "CVE"
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
												value: "VulDB",
												children: "VulDB"
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
												value: "advisory",
												children: "Бюллетень безопасности"
											})
										]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "omv-form-note",
							children: "Будет создан шаблон Evidence.v1 со статусом кандидата. Неизвестные поля останутся явно отмечены значением unknown."
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-form-actions",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								type: "button",
								variant: "outline",
								onClick: onClose,
								children: "Отмена"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								type: "submit",
								variant: "primary",
								disabled: busy || idIssue !== void 0,
								children: "Создать кандидата"
							})]
						})
					]
				})
			});
		}
		function NewCampaignDialog({ busy, onClose, onSubmit }) {
			const [target, setTarget] = (0, react.useState)("");
			const [ecosystem, setEcosystem] = (0, react.useState)("npm");
			const [classes, setClasses] = (0, react.useState)("ssrf, path-traversal");
			const [depth, setDepth] = (0, react.useState)("standard");
			const [touched, setTouched] = (0, react.useState)(false);
			const targetIssue = touched && target.trim() === "" ? "Укажите цель исследования" : void 0;
			const submit = (event) => {
				event.preventDefault();
				setTouched(true);
				if (target.trim() === "") return;
				onSubmit({
					action: "campaign.create",
					target: target.trim(),
					ecosystem,
					vulnerabilities: classes.split(",").map((value) => value.trim()).filter(Boolean),
					depth,
					mode: "passive",
					output: "research-notes",
					localReproduction: "unknown"
				});
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Modal, {
				title: "Создать задачу аудита",
				onClose,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
					className: "omv-form",
					onSubmit: submit,
					noValidate: true,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-form-grid",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Field, {
									label: "Цель исследования",
									full: true,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										autoFocus: true,
										required: true,
										className: "omv-form-input",
										value: target,
										placeholder: "Пакет или репозиторий",
										"aria-invalid": targetIssue !== void 0 || void 0,
										onChange: (event) => setTarget(event.target.value),
										onBlur: () => setTouched(true)
									}), targetIssue !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "omv-field-error",
										role: "alert",
										children: targetIssue
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
									label: "Экосистема",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
										className: "omv-select",
										value: ecosystem,
										onChange: (event) => setEcosystem(event.target.value),
										children: [
											"unknown",
											"npm",
											"python",
											"go",
											"rust",
											"java",
											"ruby",
											"php",
											"csharp",
											"swift",
											"dart",
											"elixir",
											"perl",
											"r",
											"lua"
										].map((value) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value,
											children: value === "unknown" ? "Неизвестно" : value
										}, value))
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
									label: "Глубина",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
										className: "omv-select",
										value: depth,
										onChange: (event) => setDepth(event.target.value),
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
												value: "quick",
												children: "Быстрый"
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
												value: "standard",
												children: "Стандартный"
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
												value: "deep",
												children: "Углублённый"
											})
										]
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
									label: "Типы уязвимостей через запятую",
									full: true,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										required: true,
										className: "omv-form-input",
										value: classes,
										onChange: (event) => setClasses(event.target.value)
									})
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "omv-form-note",
							children: "Создаёт Campaign.v1 и порядок выполнения. Затем предложите карточки поверхности атаки, выберите 2–3 неподтверждённые гипотезы и только после этого начинайте выполнение."
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "omv-form-actions",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								type: "button",
								variant: "outline",
								onClick: onClose,
								children: "Отмена"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								type: "submit",
								variant: "primary",
								disabled: busy || targetIssue !== void 0,
								children: "Создать задачу аудита"
							})]
						})
					]
				})
			});
		}
		// src/client/index.tsx
		const inject = [
			"slots",
			"sessions",
			"workspaces"
		];
		function localViewSettings() {
			const listeners = /* @__PURE__ */ new Set();
			const value = {
				...DEFAULT_OMV_SETTINGS,
				defaultTab: localDefaultTab() ?? DEFAULT_OMV_SETTINGS.defaultTab
			};
			return {
				getSnapshot: () => ({
					status: "ready",
					writable: true,
					value
				}),
				subscribe: (listener) => {
					listeners.add(listener);
					return () => {
						listeners.delete(listener);
					};
				},
				async set(key, next) {
					value[key] = next;
					try {
						window.localStorage.setItem(OMV_LOCAL_TAB_KEY, value.defaultTab);
					} catch {}
					for (const listener of listeners) listener();
				}
			};
		}
		function apply(ctx) {
			ensureWorkbenchStyles();
			registerOmvToolViews(ctx);
			const root = configuredRoot();
			const sessions = ctx.get("sessions");
			const workspaces = ctx.get("workspaces");
			const settings = ctx.get("settingsScope")?.bind({
				namespace: "dsh-omv",
				decode: decodeSettings
			}) ?? localViewSettings();
			const openWorkbench = async () => {
				let workspace = workspaces.list.getSnapshot().items.find((item) => item.path === root);
				workspace ??= await workspaces.create({ path: root });
				const sessionId = await workspaces.connectWorkspace(workspace.workspaceId);
				sessions.open(sessionId);
			};
			ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
				name: "sidebar.footer.action",
				id: "dsh-omv-workspace",
				order: 40,
				label: OMV_DISPLAY_NAME,
				inject: () => ({ openWorkbench })
			}, NativeWorkspaceLauncher));
			ctx.slots.inject("conversation.view", () => ctx.slots.register({
				name: "conversation.view",
				id: "omv-audit",
				order: 20,
				label: OMV_DISPLAY_NAME,
				inject: (sessionId) => ({
					projectRoot: sessionRoot(sessions, sessionId),
					sessions,
					settings,
					openWorkbench,
					openPath: (path) => workspaces.openPath(path)
				})
			}, AuditWorkbenchView));
			ctx.slots.inject("conversation.session.header.actions", () => ctx.slots.register({
				name: "conversation.session.header.actions",
				id: "omv-status",
				order: 35,
				inject: (sessionId) => ({
					projectRoot: sessionRoot(sessions, sessionId),
					sessions,
					settings,
					openWorkbench,
					openPath: (path) => workspaces.openPath(path)
				})
			}, AuditHeaderAction));
			ctx.slots.inject("conversation.composer.dock", () => ctx.slots.register({
				name: "conversation.composer.dock",
				id: "omv-context",
				order: 30,
				inject: (sessionId) => ({
					projectRoot: sessionRoot(sessions, sessionId),
					sessions,
					settings,
					openWorkbench,
					openPath: (path) => workspaces.openPath(path)
				})
			}, AuditContextDock));
			ctx.slots.inject("conversation.input.dock", () => ctx.slots.register({
				name: "conversation.input.dock",
				id: "omv-workspace-ready",
				order: 35,
				inject: (sessionId) => ({
					projectRoot: sessionRoot(sessions, sessionId),
					sessions,
					settings
				})
			}, AuditBlankWorkspaceDock));
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "omv-audit",
				order: 18,
				label: OMV_DISPLAY_NAME,
				inject: () => ({
					projectRoot: root,
					openWorkbench,
					openPath: (path) => workspaces.openPath(path),
					settings
				})
			}, AuditSettingsSection));
			ctx.slots.inject("conversation.chat.commandview", function* () {
				for (const command of OMV_COMMANDS) yield ctx.slots.register({
					name: "conversation.chat.commandview",
					key: command
				}, OmvCommandRow);
			});
		}
		function NativeWorkspaceLauncher({ wide, openWorkbench }) {
			const [dashboard, setDashboard] = (0, react.useState)();
			const [busy, setBusy] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				let active = true;
				api("/dashboard", void 0, configuredRoot()).then((data) => {
					if (active) setDashboard(data);
				}).catch(() => {});
				return () => {
					active = false;
				};
			}, []);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "omv-launcher",
				"aria-label": `Открыть ${OMV_DISPLAY_NAME}`,
				title: "Открыть панель аудита OMV в рабочей области DSH",
				disabled: busy,
				onClick: () => {
					setBusy(true);
					openWorkbench().finally(() => {
						setBusy(false);
					});
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
						name: "shield",
						size: 17
					}),
					wide && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "omv-launcher-label",
						children: "Панель аудита OMV"
					}),
					wide && (dashboard?.metrics.blocked ?? 0) > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "omv-launcher-badge",
						children: dashboard?.metrics.blocked
					})
				]
			});
		}
		function AuditWorkbenchView({ projectRoot, sessionId, sessions, settings, openWorkbench, openPath, useSessions }) {
			const jobs = useSessions((state) => state.jobsBySession[sessionId] ?? []);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkbenchSurface, {
				projectRoot,
				sessionId,
				sessions,
				settings,
				openWorkbench,
				openPath,
				jobs
			});
		}
		function AuditHeaderAction({ projectRoot }) {
			const [metrics, setMetrics] = (0, react.useState)();
			const [busy, setBusy] = (0, react.useState)(false);
			const refresh = (0, react.useCallback)(async () => {
				setBusy(true);
				try {
					setMetrics((await api("/dashboard", void 0, projectRoot)).metrics);
					window.dispatchEvent(new CustomEvent("dsh-omv:refresh", { detail: { projectRoot } }));
				} finally {
					setBusy(false);
				}
			}, [projectRoot]);
			(0, react.useEffect)(() => {
				refresh();
			}, [refresh]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "omv-header-action",
				"data-alert": (metrics?.blocked ?? 0) > 0 || void 0,
				title: `OMV：${metrics?.active ?? 0} активных находок; нажмите для обновления`,
				"aria-label": "Обновить состояние панели аудита OMV",
				disabled: busy,
				onClick: () => {
					refresh();
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
					name: "shield",
					size: 14
				}), (metrics?.active ?? 0) > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: metrics?.active })]
			});
		}
		function AuditContextDock({ projectRoot }) {
			const [dashboard, setDashboard] = (0, react.useState)();
			(0, react.useEffect)(() => {
				let active = true;
				api("/dashboard", void 0, projectRoot).then((data) => {
					if (active) setDashboard(data);
				}).catch(() => {});
				return () => {
					active = false;
				};
			}, [projectRoot]);
			if (dashboard === void 0 || dashboard.metrics.active === 0) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "omv-context-dock",
				title: projectRoot,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
						name: "shield",
						size: 11
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "OMV" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [dashboard.metrics.active, " активных"] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [dashboard.metrics.confirmed, " подтверждено"] }),
					dashboard.metrics.blocked > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("b", { children: [dashboard.metrics.blocked, " препятствий"] })
				]
			});
		}
		function AuditBlankWorkspaceDock({ session, projectRoot }) {
			const [dashboard, setDashboard] = (0, react.useState)();
			(0, react.useEffect)(() => {
				if (!session.blank) return;
				let active = true;
				api("/dashboard", void 0, projectRoot).then((data) => {
					if (active) setDashboard(data);
				}).catch(() => {});
				return () => {
					active = false;
				};
			}, [projectRoot, session.blank]);
			if (!session.blank || dashboard === void 0) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "omv-blank-dock",
				title: projectRoot,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
						name: "shield",
						size: 13
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Панель аудита OMV подключена" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("b", { children: [dashboard.metrics.active, " активных находок"] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Используйте /omv либо после первого сообщения переключитесь на представление «Панель аудита OMV»" })
				]
			});
		}
		function AuditSettingsSection({ close, projectRoot, openWorkbench, openPath, settings }) {
			const [dashboard, setDashboard] = (0, react.useState)();
			const [error, setError] = (0, react.useState)();
			const [busy, setBusy] = (0, react.useState)(false);
			const [, refreshSettings] = (0, react.useState)(0);
			(0, react.useEffect)(() => settings.subscribe(() => refreshSettings((value) => value + 1)), [settings]);
			const defaultTab = settings.getSnapshot().value?.defaultTab ?? localDefaultTab() ?? DEFAULT_OMV_SETTINGS.defaultTab;
			(0, react.useEffect)(() => {
				api("/dashboard", void 0, projectRoot).then(setDashboard).catch((caught) => setError(messageOf(caught)));
			}, [projectRoot]);
			const launch = async () => {
				setBusy(true);
				try {
					await openWorkbench();
					close();
				} finally {
					setBusy(false);
				}
			};
			const exportSnapshot = async () => {
				setBusy(true);
				try {
					const snapshot = await api("/export", void 0, projectRoot);
					const blob = new Blob([`${JSON.stringify(snapshot, null, 2)}\n`], { type: "application/json" });
					const url = URL.createObjectURL(blob);
					const anchor = document.createElement("a");
					anchor.href = url;
					anchor.download = `dsh-omv-export-${(/* @__PURE__ */ new Date()).toISOString().replaceAll(":", "-")}.json`;
					anchor.click();
					URL.revokeObjectURL(url);
				} finally {
					setBusy(false);
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "omv-settings",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-settings-title",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
							name: "shield",
							size: 20
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: OMV_DISPLAY_NAME }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "Рабочая область Evidence.v1 внутри DSH" })] })]
					}),
					error !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "omv-error",
						children: error
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: "omv-settings-card",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-settings-row",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Рабочая область по умолчанию" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
									title: projectRoot,
									children: projectRoot
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-settings-row",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Состояние рабочей области" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: dashboard === void 0 ? "Синхронизация" : dashboard.workspace.staleIndex ? "Индекс требует обновления" : "В порядке" })]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-settings-row",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Операции записи" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: dashboard?.config.allowMutations === false ? "Закрыть" : "Включены" })]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-settings-row",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Текущая находка" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: dashboard?.metrics.active ?? "—" })]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-settings-row",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Инструменты помощника" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", { children: "23 инструмента · 20 команд" })]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "omv-settings-row",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Представление по умолчанию" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
									className: "omv-settings-select",
									value: defaultTab,
									onChange: (event) => {
										persistDefaultTab(settings, event.target.value);
									},
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "overview",
											children: "Обзор"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "findings",
											children: "Находки"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "reproduction",
											children: "Воспроизведение"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "campaigns",
											children: "Задача аудита"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "search",
											children: "Поиск"
										})
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "omv-settings-actions",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								type: "button",
								variant: "outline",
								onClick: () => {
									openPath(`${projectRoot}/.omv`);
								},
								children: "Открыть .omv"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								type: "button",
								variant: "outline",
								disabled: busy,
								onClick: () => {
									exportSnapshot();
								},
								children: "Экспортировать снимок"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								type: "button",
								variant: "primary",
								disabled: busy,
								onClick: () => {
									launch();
								},
								children: "Открыть рабочую область аудита"
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "omv-settings-help",
						children: "Представление «Панель аудита OMV» доступно в любой рабочей области DSH. Инструменты помощника и команды /omv автоматически используют каталог текущего чата."
					})
				]
			});
		}
		function OmvCommandRow({ node }) {
			const state = node.outcome === null ? "running" : node.outcome.kind;
			const title = node.name === null ? "omv" : `/${node.name}${node.args ?? ""}`;
			const summary = node.outcome === null ? "Выполняется действие в рабочей области OMV…" : node.outcome.text ?? (state === "success" ? "Выполнено" : "Ошибка выполнения");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "omv-command-row",
				"data-state": state,
				title: summary,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "omv-command-icon",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
							name: "shield",
							size: 14
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: title }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: firstLine$1(summary) })
				]
			});
		}
		function WorkbenchSurface({ projectRoot, sessionId, sessions, settings, openWorkbench, openPath, jobs }) {
			const [tab, setTab] = (0, react.useState)(() => settings.getSnapshot().value?.defaultTab ?? localDefaultTab() ?? DEFAULT_OMV_SETTINGS.defaultTab);
			const [detail, setDetail] = (0, react.useState)();
			const [detailExpanded, setDetailExpanded] = (0, react.useState)(false);
			const [campaignDetail, setCampaignDetail] = (0, react.useState)();
			const [campaignDetailExpanded, setCampaignDetailExpanded] = (0, react.useState)(false);
			const [detailLoading, setDetailLoading] = (0, react.useState)(false);
			const [dialog, setDialog] = (0, react.useState)(null);
			const [commandPaletteOpen, setCommandPaletteOpen] = (0, react.useState)(false);
			const [toast, setToast] = (0, react.useState)();
			const detailRef = (0, react.useRef)();
			const campaignDetailRef = (0, react.useRef)();
			const showCampaignRef = (0, react.useRef)(async () => {});
			const focusReturnRef = (0, react.useRef)();
			const { dashboard, loading, error, refreshError, lastUpdated, reload, refreshQuietly, refreshForced } = useDashboard(projectRoot);
			const { anyBusy, isBusy, run } = useActionState();
			(0, react.useEffect)(() => settings.subscribe(() => {
				const next = settings.getSnapshot().value?.defaultTab;
				if (next !== void 0) setTab(next);
			}), [settings]);
			const selectTab = (0, react.useCallback)((next) => {
				setTab(next);
				persistDefaultTab(settings, next);
			}, [settings]);
			const captureOverlayFocus = (0, react.useCallback)(() => {
				const active = document.activeElement;
				if (active instanceof HTMLElement && active !== document.body) focusReturnRef.current = active;
			}, []);
			const restoreOverlayFocus = (0, react.useCallback)(() => {
				const target = focusReturnRef.current;
				focusReturnRef.current = void 0;
				window.requestAnimationFrame(() => {
					if (target !== void 0 && document.contains(target)) target.focus();
				});
			}, []);
			const openDialog = (0, react.useCallback)((next) => {
				if (!commandPaletteOpen && dialog === null) captureOverlayFocus();
				setDialog(next);
			}, [
				captureOverlayFocus,
				commandPaletteOpen,
				dialog
			]);
			const openCommandPalette = (0, react.useCallback)(() => {
				captureOverlayFocus();
				setCommandPaletteOpen(true);
			}, [captureOverlayFocus]);
			const closeCommandPalette = (0, react.useCallback)(() => {
				setCommandPaletteOpen(false);
				if (dialog === null) restoreOverlayFocus();
			}, [dialog, restoreOverlayFocus]);
			const closeDialog = (0, react.useCallback)(() => {
				setDialog(null);
				restoreOverlayFocus();
			}, [restoreOverlayFocus]);
			const closeFinding = (0, react.useCallback)(() => {
				setDetail(void 0);
				setDetailExpanded(false);
				restoreOverlayFocus();
			}, [restoreOverlayFocus]);
			const closeCampaign = (0, react.useCallback)(() => {
				setCampaignDetail(void 0);
				setCampaignDetailExpanded(false);
				restoreOverlayFocus();
			}, [restoreOverlayFocus]);
			const showFinding = (0, react.useCallback)(async (id, archived = false) => {
				captureOverlayFocus();
				setCampaignDetail(void 0);
				setCampaignDetailExpanded(false);
				if (detailRef.current === void 0) setDetailExpanded(false);
				setDetailLoading(true);
				try {
					const query = new URLSearchParams({
						id,
						...archived ? { archived: "true" } : {}
					});
					setDetail(await api(`/finding?${query}`, void 0, projectRoot));
				} catch (caught) {
					setToast({
						kind: "error",
						message: messageOf(caught)
					});
				} finally {
					setDetailLoading(false);
				}
			}, [captureOverlayFocus, projectRoot]);
			const showCampaign = (0, react.useCallback)(async (id) => {
				captureOverlayFocus();
				setDetail(void 0);
				setDetailExpanded(false);
				setCampaignDetailExpanded(false);
				setDetailLoading(true);
				try {
					setCampaignDetail(await api(`/campaign?id=${encodeURIComponent(id)}`, void 0, projectRoot));
				} catch (caught) {
					setToast({
						kind: "error",
						message: messageOf(caught)
					});
				} finally {
					setDetailLoading(false);
				}
			}, [captureOverlayFocus, projectRoot]);
			(0, react.useEffect)(() => {
				showCampaignRef.current = showCampaign;
			}, [showCampaign]);
			(0, react.useEffect)(() => {
				detailRef.current = detail;
			}, [detail]);
			(0, react.useEffect)(() => {
				campaignDetailRef.current = campaignDetail;
			}, [campaignDetail]);
			const { live } = useOmvEvents(projectRoot, (0, react.useCallback)(() => {
				refreshQuietly();
				const current = detailRef.current;
				if (current !== void 0) showFinding(current.detail.id, current.detail.archived);
				const currentCampaign = campaignDetailRef.current;
				if (currentCampaign !== void 0) showCampaignRef.current(currentCampaign.campaign.id);
			}, [refreshQuietly, showFinding]));
			const campaignRunner = useCampaignRunner({
				projectRoot,
				sessions,
				onCampaignUpdated: (campaignId) => {
					showCampaignRef.current(campaignId);
				},
				onToast: (kind, message) => setToast({
					kind,
					message
				}),
				runAction: run
			});
			(0, react.useEffect)(() => {
				const activeRun = campaignDetail?.runs.find((item) => item.status === "queued" || item.status === "running" || item.status === "paused");
				if (activeRun !== void 0) campaignRunner.watch(activeRun);
			}, [campaignDetail, campaignRunner]);
			(0, react.useEffect)(() => {
				const onKeyDown = (event) => {
					if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
						event.preventDefault();
						openCommandPalette();
						return;
					}
					if (event.metaKey || event.ctrlKey || event.altKey) return;
					const target = event.target;
					if (target !== null && (target.isContentEditable || [
						"INPUT",
						"TEXTAREA",
						"SELECT"
					].includes(target.tagName))) return;
					const index = event.key === "0" ? 10 : Number(event.key);
					if (Number.isInteger(index) && index >= 1 && index <= OMV_TABS.length) {
						event.preventDefault();
						const next = OMV_TABS[index - 1];
						if (next !== void 0) selectTab(next);
					} else if (shouldHandleShortcut(event.target, event.key)) {
						if (event.key.toLowerCase() === "r") {
							event.preventDefault();
							reload();
						} else if (event.key === "/") {
							event.preventDefault();
							selectTab("search");
						}
					}
				};
				window.addEventListener("keydown", onKeyDown);
				return () => window.removeEventListener("keydown", onKeyDown);
			}, [
				openCommandPalette,
				reload,
				selectTab
			]);
			(0, react.useEffect)(() => {
				const onKeyDown = (event) => {
					if (event.key !== "Escape") return;
					if (dialog !== null) closeDialog();
					else if (commandPaletteOpen) closeCommandPalette();
					else if (detail !== void 0) closeFinding();
					else if (campaignDetail !== void 0) closeCampaign();
				};
				window.addEventListener("keydown", onKeyDown);
				return () => window.removeEventListener("keydown", onKeyDown);
			}, [
				campaignDetail,
				closeCampaign,
				closeCommandPalette,
				closeDialog,
				closeFinding,
				commandPaletteOpen,
				detail,
				dialog
			]);
			const perform = (0, react.useCallback)(async (request, successMessage) => {
				let ok = false;
				await run(`action:${request.action}:${request.id ?? "workspace"}`, async () => {
					try {
						await api("/action", {
							method: "POST",
							body: JSON.stringify(request)
						}, projectRoot);
						setToast({
							kind: "ok",
							message: successMessage
						});
						await refreshForced();
						if (request.id !== void 0 && detailRef.current?.detail.id === request.id && request.action !== "finding.archive" && request.action !== "finding.delete") await showFinding(request.id);
						if (request.action === "finding.archive" || request.action === "finding.delete") closeFinding();
						const campaignId = campaignDetailRef.current?.campaign.id;
						if (campaignId !== void 0 && request.id === campaignId && request.action.startsWith("campaign.")) await showCampaign(campaignId);
						ok = true;
					} catch (caught) {
						setToast({
							kind: "error",
							message: messageOf(caught)
						});
					}
				});
				return ok;
			}, [
				closeFinding,
				projectRoot,
				refreshForced,
				run,
				showCampaign,
				showFinding
			]);
			const startWorkflow = (0, react.useCallback)(async (intent) => {
				const finding = detailRef.current;
				if (finding === void 0) return;
				await run(`workflow:${intent}:${finding.detail.id}`, async () => {
					try {
						const dispatch = await api("/action", {
							method: "POST",
							body: JSON.stringify({
								action: "workflow.start",
								id: finding.detail.id,
								intent,
								sessionId
							})
						}, projectRoot);
						const scope = sessions.scope(sessionId);
						const face = scope === void 0 ? void 0 : sessions.sessionOf(scope);
						if (face === void 0) throw new Error("Текущий чат DSH ещё не готов");
						const accepted = await face.prompt([{
							type: "text",
							text: dispatch.prompt
						}], "queue");
						if (!accepted.ok) throw new Error(`${accepted.error.code}: ${accepted.error.message}`);
						setToast({
							kind: "ok",
							message: `${dispatch.label}Передано в текущий чат. Выполнение можно посмотреть в представлении «Чат» или «Трассировка».`
						});
						await showFinding(finding.detail.id);
					} catch (caught) {
						setToast({
							kind: "error",
							message: messageOf(caught)
						});
					}
				});
			}, [
				projectRoot,
				run,
				sessionId,
				sessions,
				showFinding
			]);
			const linkCurrentSession = (0, react.useCallback)(async () => {
				const finding = detailRef.current;
				if (finding === void 0) return;
				await perform({
					action: "session.link",
					id: finding.detail.id,
					sessionId
				}, "Связано с текущим чатом DSH");
			}, [perform, sessionId]);
			const openLinkedSession = (0, react.useCallback)((linkedSessionId) => {
				const id = linkedSessionId;
				if (sessions.list.getSnapshot().byId[id] === void 0) {
					setToast({
						kind: "error",
						message: "Связанный чат сейчас не загружен. Его можно восстановить из списка чатов слева."
					});
					return;
				}
				sessions.open(id);
			}, [sessions]);
			const startCampaign = (0, react.useCallback)(async (campaignId) => {
				await run(`campaign.start:${campaignId}`, async () => {
					try {
						await api("/action", {
							method: "POST",
							body: JSON.stringify({
								action: "campaign.seed",
								id: campaignId,
								sessionId
							})
						}, projectRoot);
						const created = await api("/action", {
							method: "POST",
							body: JSON.stringify({
								action: "campaign.run.create",
								id: campaignId,
								sessionId,
								concurrency: dashboard?.config.campaignConcurrency ?? 3
							})
						}, projectRoot);
						campaignRunner.watch(created);
						setToast({
							kind: "ok",
							message: `Задача аудита запущена: ${created.lanes.length} направлений · Одновременно: ${created.concurrency}`
						});
						await refreshForced();
						await showCampaign(campaignId);
						await campaignRunner.pump(created.id);
					} catch (caught) {
						setToast({
							kind: "error",
							message: messageOf(caught)
						});
					}
				});
			}, [
				campaignRunner,
				dashboard?.config.campaignConcurrency,
				projectRoot,
				refreshForced,
				run,
				sessionId,
				showCampaign
			]);
			const startReproduction = (0, react.useCallback)(async (findingId, command) => {
				await perform({
					action: "repro.run.start",
					id: findingId,
					sessionId,
					...command === void 0 || command.trim() === "" ? {} : { command }
				}, "Запуск воспроизведения начат");
			}, [perform, sessionId]);
			const scanDedup = (0, react.useCallback)(async (findingId) => {
				await perform({
					action: "dedup.scan",
					id: findingId,
					sessionId
				}, "Поиск дублей завершён");
			}, [perform, sessionId]);
			const updateDedup = (0, react.useCallback)(async (findingId, status, matchId) => {
				await perform({
					action: "dedup.update",
					id: findingId,
					dedupStatus: status,
					sessionId,
					...matchId === void 0 ? {} : { matchId }
				}, "Заключение о дублировании обновлено");
			}, [perform, sessionId]);
			const retryJob = (0, react.useCallback)(async (job) => {
				await run(`job-retry:${job.id}`, async () => {
					try {
						const scope = sessions.scope(sessionId);
						const face = scope === void 0 ? void 0 : sessions.sessionOf(scope);
						if (face === void 0) throw new Error("Текущий чат DSH ещё не готов");
						const prompt = `Повтори завершившуюся ошибкой фоновую задачу DSH в текущем чате: ${job.id}：${job.label}. Сначала проверь причину ошибки и detail в чате и трассировке (${job.detail ?? "unknown"}), исправь параметры или предварительные условия и повтори выполнение. Сохрани исходную запись ошибки; доказательства не перезаписывай.`;
						const accepted = await face.prompt([{
							type: "text",
							text: prompt
						}], "queue");
						if (!accepted.ok) throw new Error(`${accepted.error.code}: ${accepted.error.message}`);
						setToast({
							kind: "ok",
							message: `Запрос на повторное выполнение передан: ${job.id}`
						});
					} catch (caught) {
						setToast({
							kind: "error",
							message: messageOf(caught)
						});
					}
				});
			}, [
				run,
				sessionId,
				sessions
			]);
			const openWorkspacePath = (0, react.useCallback)((rel) => {
				if (openPath === void 0) {
					setToast({
						kind: "error",
						message: "Текущая среда Harness не предоставляет открытие файлов"
					});
					return;
				}
				openPath(resolveCodeRef(projectRoot, {
					path: rel,
					note: ""
				})).catch((caught) => {
					setToast({
						kind: "error",
						message: messageOf(caught)
					});
				});
			}, [openPath, projectRoot]);
			const openConfigured = openWorkbench !== void 0 && normalizePath(projectRoot) !== normalizePath(configuredRoot()) ? openWorkbench : void 0;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "omv-native-view",
				"aria-label": OMV_DISPLAY_NAME,
				"aria-busy": anyBusy,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(AuditToolbar, {
						tab,
						dashboard,
						busy: anyBusy,
						live,
						jobs,
						lastUpdated,
						refreshError,
						onTab: selectTab,
						onRefresh: () => {
							reload();
						},
						onCommandPalette: () => setCommandPaletteOpen(true)
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "omv-content",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("main", {
							className: "omv-content-inner",
							id: "omv-workbench-panel",
							children: loading && dashboard === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Loading, {}) : error !== void 0 && dashboard === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(WorkbenchErrorState, {
								error,
								projectRoot,
								configuredRoot: configuredRoot(),
								onRetry: () => {
									reload();
								},
								onOpenConfigured: openWorkbench,
								onOpenPath: openPath === void 0 ? void 0 : () => {
									openPath(`${projectRoot}/.omv`);
								}
							}) : dashboard !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								tab === "overview" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Overview, {
									data: dashboard,
									jobs,
									onRetryJob: (job) => {
										retryJob(job);
									},
									onTab: selectTab,
									onFinding: (id) => {
										showFinding(id);
									},
									onNew: () => openDialog("finding"),
									onOpenConfigured: openConfigured,
									...openWorkspacePath === void 0 ? {} : { onOpenPath: openWorkspacePath },
									onRetryIssues: () => {
										reload();
									}
								}),
								tab === "findings" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Findings, {
									data: dashboard,
									onFinding: (id, archived) => {
										showFinding(id, archived);
									},
									onNew: () => openDialog("finding"),
									onOpenConfigured: openConfigured,
									...openWorkspacePath === void 0 ? {} : { onOpenPath: openWorkspacePath },
									onRetryIssues: () => {
										reload();
									}
								}),
								tab === "reproduction" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ReproductionPage, {
									data: dashboard,
									onFinding: (id) => {
										showFinding(id);
									},
									onStart: (id) => {
										startReproduction(id);
									},
									onOpenSession: openLinkedSession
								}),
								tab === "campaigns" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Campaigns, {
									data: dashboard,
									busy: anyBusy,
									onCampaign: (id) => {
										showCampaign(id);
									},
									onNew: () => openDialog("campaign"),
									onRepair: (id) => {
										perform({
											action: "campaign.repair",
											id
										}, "Конфигурация плана аудита исправлена");
									},
									onOpenPath: openWorkspacePath,
									onRetryIssues: () => {
										reload();
									}
								}),
								tab === "search" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SearchPage, {
									projectRoot,
									onFinding: (id, archived) => {
										showFinding(id, archived);
									},
									onCampaign: (id) => {
										showCampaign(id);
									}
								})
							] }) : null
						})
					}),
					detailLoading && detail === void 0 && campaignDetail === void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "omv-detail-backdrop",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Loading, { label: "Чтение Evidence.v1…" })
					}),
					detail !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FindingDetail, {
						payload: detail,
						busy: anyBusy,
						isBusy,
						currentSessionId: sessionId,
						expanded: detailExpanded,
						onToggleExpand: () => setDetailExpanded((value) => !value),
						onClose: closeFinding,
						onAction: (request, message) => {
							perform({
								...request,
								sessionId
							}, message);
						},
						onWorkflow: (intent) => {
							startWorkflow(intent);
						},
						onLink: () => {
							linkCurrentSession();
						},
						onOpenSession: openLinkedSession,
						onOpenPath: openWorkspacePath,
						onStartReproduction: (id) => {
							startReproduction(id);
						},
						onScanDedup: (id) => {
							scanDedup(id);
						},
						onUpdateDedup: (id, status, matchId) => {
							updateDedup(id, status, matchId);
						}
					}),
					campaignDetail !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CampaignDetail, {
						payload: campaignDetail,
						busy: anyBusy,
						isBusy,
						currentSessionId: sessionId,
						expanded: campaignDetailExpanded,
						onToggleExpand: () => setCampaignDetailExpanded((value) => !value),
						onClose: closeCampaign,
						onStart: () => {
							startCampaign(campaignDetail.campaign.id);
						},
						onControl: (runId, control, laneId) => {
							campaignRunner.control(runId, control, laneId);
						},
						onOpenSession: openLinkedSession,
						onFinding: (id) => {
							showFinding(id);
						},
						onAction: (request, message) => {
							perform({
								...request,
								sessionId
							}, message);
						}
					}),
					dialog === "finding" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(NewFindingDialog, {
						busy: anyBusy,
						onClose: closeDialog,
						onSubmit: async (request) => {
							if (await perform(request, "Потенциальная уязвимость создана")) closeDialog();
						}
					}),
					dialog === "campaign" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(NewCampaignDialog, {
						busy: anyBusy,
						onClose: closeDialog,
						onSubmit: async (request) => {
							if (await perform(request, "Задача аудита создана")) closeDialog();
						}
					}),
					commandPaletteOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CommandPalette, {
						tab,
						onTab: (next) => {
							selectTab(next);
							closeCommandPalette();
						},
						onNewFinding: () => {
							setDialog("finding");
							setCommandPaletteOpen(false);
						},
						onNewCampaign: () => {
							setDialog("campaign");
							setCommandPaletteOpen(false);
						},
						onClose: closeCommandPalette
					}),
					toast !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Toast, {
						text: toast.message,
						icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
							name: toast.kind === "error" ? "alert" : "check",
							size: 14
						}),
						onDone: () => setToast(void 0)
					}, `${toast.kind}:${toast.message}`)
				]
			});
		}
		function AuditToolbar({ tab, dashboard, busy, live, jobs, lastUpdated, refreshError, onTab, onRefresh, onCommandPalette }) {
			const items = [
				{
					id: "overview",
					label: "Обзор",
					icon: "grid"
				},
				{
					id: "findings",
					label: "Находки",
					icon: "finding",
					count: dashboard?.metrics.active
				},
				{
					id: "reproduction",
					label: "Воспроизведение",
					icon: "pulse",
					count: dashboard?.metrics.activeReproductions
				},
				{
					id: "campaigns",
					label: "Задача аудита",
					icon: "campaign",
					count: dashboard?.metrics.campaigns
				},
				{
					id: "search",
					label: "Поиск",
					icon: "search"
				}
			];
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "omv-native-toolbar",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("nav", {
						className: "omv-nav",
						"aria-label": `${OMV_DISPLAY_NAME}Представление`,
						"aria-orientation": "horizontal",
						role: "tablist",
						children: items.map((item, index) => {
							const shortcut = String(index + 1);
							return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								role: "tab",
								"aria-selected": tab === item.id,
								"aria-controls": "omv-workbench-panel",
								"aria-keyshortcuts": shortcut,
								title: `${item.label}(клавиши ${shortcut}）`,
								className: "omv-nav-button",
								"data-active": tab === item.id,
								onClick: () => onTab(item.id),
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
										name: item.icon,
										size: 13
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: item.label }),
									item.count !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("b", {
										className: "omv-nav-count",
										children: item.count
									})
								]
							}, item.id);
						})
					}),
					jobs.some((job) => job.status === "running" || job.status === "stopping") && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "omv-jobs-badge",
						title: jobs.map((job) => `${job.id}: ${job.label} · ${job.status}`).join("\n"),
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
								name: "pulse",
								size: 11
							}),
							jobs.filter((job) => job.status === "running" || job.status === "stopping").length,
							" задач"
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "omv-live",
						"data-state": live,
						title: live === "live" ? "Изменения файлов рабочей области синхронизируются сразу" : "До восстановления постоянного соединения используется обновление по таймеру",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", {}), live === "live" ? "В реальном времени" : live === "connecting" ? "Подключение" : "Обновление по таймеру"]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
						className: "omv-workspace-path",
						title: dashboard?.config.projectRoot,
						children: dashboard?.config.projectRoot ?? "Синхронизирую рабочую область…"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "omv-sync-meta",
						"aria-live": "polite",
						title: refreshError ?? (lastUpdated === void 0 ? "Ожидание первой синхронизации" : `Последняя синхронизация: ${formatTime(lastUpdated)}`),
						children: refreshError === void 0 ? lastUpdated === void 0 ? "Синхронизация" : `Обновлено: ${relativeTime(lastUpdated)}` : "Ошибка синхронизации"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "omv-palette-button",
						onClick: onCommandPalette,
						title: "Открыть команды — ⌘K / Ctrl K",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
								name: "search",
								size: 12
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "Команды" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("kbd", { children: "⌘K" })
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "omv-icon-button",
						"aria-label": refreshError === void 0 ? "Обновить рабочую область OMV" : "Повторить синхронизацию рабочей области OMV",
						disabled: busy,
						onClick: onRefresh,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Icon, {
							name: "refresh",
							size: 14
						})
					})
				]
			});
		}
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map