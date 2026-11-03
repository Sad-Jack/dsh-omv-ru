import { createRequire } from "node:module";
import Schema from "@deepseek-ai/schemastery";
import { basename, dirname, extname, join, relative, resolve, sep } from "node:path";
import { Service } from "@deepseek-ai/cordis";
import { appendFile, mkdir, mkdtemp, readFile, readdir, rename, stat, writeFile } from "node:fs/promises";
import * as omvApi from "oh-my-vul";
import { CAMPAIGN_ECOSYSTEMS, EVIDENCE_ECOSYSTEMS, archiveFinding, checkReportArtifacts, createFindingTemplate, doctorFinding, initCampaign, initReproArtifacts, initWorkspace, listArchivedFindings, listFindingWorkflow, promoteFinding, readWorkspaceActivity, restoreFinding, reviewFinding, seedCampaign, showCampaign, showFinding, validateCampaign, validateFinding, workspaceStatus } from "oh-my-vul";
import { parse, parseDocument, stringify } from "yaml";
import { createHash, randomUUID } from "node:crypto";
import { existsSync, watch } from "node:fs";
import { execFile } from "node:child_process";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";
import { defineTool } from "@deepseek-ai/dsh-tools";
// src/commands.ts
/** Register durable, discoverable DSH slash commands for the OMV workflow. */
function registerOmvCommands(ctx, workbench, runtimeSnapshot) {
	ctx.commands.register({
		name: "omv",
		description: "Посмотреть состояние аудита уязвимостей в текущей рабочей области DSH и следующие действия",
		handler: (invocation) => run(invocation, workbench, async (scoped) => {
			const dashboard = await scoped.dashboard();
			const { metrics } = dashboard;
			const queue = dashboard.findings.slice(0, 5).map((item) => `- ${item.id} · ${item.status} · ${item.assessment.maturity}/${item.assessment.confidence} · ${item.nextAction}`).join("\n");
			return [
				`Рабочая область OMV: ${dashboard.config.projectRoot}`,
				`Активных: ${metrics.active} · Подтверждено: ${metrics.confirmed} · Заблокировано: ${metrics.blocked} · Готово к отчёту: ${metrics.reportReady}`,
				queue === "" ? "Активных находок сейчас нет." : `Приоритетная очередь:\n${queue}`
			].join("\n");
		})
	});
	ctx.commands.register({
		name: "omv-health",
		description: "Проверить рабочую область OMV, планы аудита, процессы и сохранённое состояние среды выполнения",
		handler: (invocation) => run(invocation, workbench, async (scoped) => JSON.stringify(await scoped.health(), null, 2))
	});
	if (runtimeSnapshot !== void 0) ctx.commands.register({
		name: "omv-runtime",
		description: "Прочитать жизненный цикл плагинов DSH Cordis, зависимости и состояния PENDING/FAILED",
		handler: () => ({
			kind: "success",
			text: JSON.stringify(runtimeSnapshot(), null, 2)
		})
	});
	ctx.commands.register({
		name: "omv-finding",
		description: "Прочитать находку Evidence.v1, её цепочку доказательств и заключение аудита",
		input: { hint: "<finding-id>" },
		handler: (invocation) => run(invocation, workbench, async (scoped) => {
			const id = requiredInput(invocation.rawInput, "finding id");
			const finding = await scoped.finding(id);
			const { detail, doctor, review } = finding;
			return [
				`${detail.id} · ${detail.status} · ${finding.assessment.maturity}/${finding.assessment.confidence}`,
				`${detail.package} · ${detail.ecosystem} · ${detail.vulnerability}`,
				`Оценка доказательств: ${finding.assessment.summary}`,
				`Заключение аудита: ${review?.summary ?? detail.verdict.exploitability}`,
				`Замечания проверки: ${doctor?.issues.length ?? 0}`,
				`Далее: ${detail.nextAction}`
			].join("\n");
		})
	});
	ctx.commands.register({
		name: "omv-validate",
		description: "Проверить Evidence.v1 и вернуть ошибки схемы с точным указанием недостающих данных",
		input: { hint: "<finding-id>" },
		handler: (invocation) => run(invocation, workbench, async (scoped) => {
			const id = requiredInput(invocation.rawInput, "finding id");
			const result = await scoped.action({
				action: "finding.validate",
				id
			});
			return `Проверка Evidence.v1 завершена: ${id}\n${JSON.stringify(result, null, 2)}`;
		})
	});
	ctx.commands.register({
		name: "omv-init",
		description: "Инициализировать каталог исследования .omv в текущей рабочей области DSH",
		handler: (invocation) => run(invocation, workbench, async (scoped) => {
			const result = await scoped.action({
				action: "workspace.init",
				sessionId: invocation.agent.session.header.id
			});
			return `Рабочая область OMV инициализирована: ${scoped.config.projectRoot}\n${JSON.stringify(result, null, 2)}`;
		})
	});
	ctx.commands.register({
		name: "omv-new",
		description: "Создать шаблон потенциальной находки Evidence.v1 в текущей рабочей области DSH",
		input: { hint: "<id> [продукт экосистема класс-уязвимости]" },
		handler: (invocation) => run(invocation, workbench, async (scoped) => {
			const [id, product, ecosystem, vulnerabilityClass] = words(invocation.rawInput);
			if (id === void 0) throw new Error("finding id is required");
			const seeded = product !== void 0 || ecosystem !== void 0 || vulnerabilityClass !== void 0;
			if (seeded && (product === void 0 || ecosystem === void 0 || vulnerabilityClass === void 0)) throw new Error("Для создания по исходным параметрам нужно вместе указать product, ecosystem и vulnerability-class");
			const result = await scoped.action({
				action: "finding.create",
				id,
				sessionId: invocation.agent.session.header.id,
				...seeded ? {
					product,
					ecosystem,
					vulnerabilityClass,
					researcherGoal: "triage"
				} : {}
			});
			return `Потенциальная уязвимость создана: ${id}\n${JSON.stringify(result, null, 2)}`;
		})
	});
	ctx.commands.register({
		name: "omv-link",
		description: "Связать текущий чат DSH с находкой OMV",
		input: { hint: "<finding-id>" },
		handler: (invocation) => run(invocation, workbench, async (scoped) => {
			const id = requiredInput(invocation.rawInput, "finding id");
			const link = await scoped.action({
				action: "session.link",
				id,
				sessionId: invocation.agent.session.header.id
			});
			return `Текущий чат связан: ${id}\n${JSON.stringify(link, null, 2)}`;
		})
	});
	ctx.commands.register({
		name: "omv-repro",
		description: "Инициализировать локальные материалы воспроизведения находки и связать текущий чат",
		input: { hint: "<finding-id>" },
		handler: (invocation) => run(invocation, workbench, async (scoped) => {
			const id = requiredInput(invocation.rawInput, "finding id");
			await scoped.action({
				action: "session.link",
				id,
				sessionId: invocation.agent.session.header.id,
				intent: "repro"
			});
			const result = await scoped.action({
				action: "finding.repro",
				id,
				sessionId: invocation.agent.session.header.id
			});
			return `Материалы воспроизведения подготовлены: ${id}\n${JSON.stringify(result, null, 2)}`;
		})
	});
	ctx.commands.register({
		name: "omv-promote",
		description: "Обновить статус Evidence для находки",
		input: { hint: "<finding-id> <candidate|confirmed|blocked>" },
		handler: (invocation) => run(invocation, workbench, async (scoped) => {
			const [id, status] = words(invocation.rawInput);
			if (id === void 0) throw new Error("finding id is required");
			if (status !== "candidate" && status !== "confirmed" && status !== "blocked") throw new Error("status должен быть candidate, confirmed или blocked");
			const result = await scoped.action({
				action: "finding.promote",
				id,
				status,
				sessionId: invocation.agent.session.header.id
			});
			return `Статус находки обновлён: ${id} → ${status}\n${JSON.stringify(result, null, 2)}`;
		})
	});
	ctx.commands.register({
		name: "omv-run",
		description: "Зарегистрировать процесс аудита и подготовить контекст задачи для передачи помощнику",
		input: { hint: "<finding-id> <audit|repro|dedup|critic|report|disclose>" },
		handler: (invocation) => run(invocation, workbench, async (scoped) => {
			const [id, intent] = words(invocation.rawInput);
			if (id === void 0) throw new Error("finding id is required");
			if (!isIntent(intent)) throw new Error("intent должен быть audit, repro, dedup, critic, report или disclose");
			const result = await scoped.action({
				action: "workflow.start",
				id,
				intent,
				sessionId: invocation.agent.session.header.id
			});
			return `${result.label}：${id}\n\n${result.prompt}`;
		})
	});
	ctx.commands.register({
		name: "omv-campaign",
		description: "Прочитать Campaign.v1, параллельные направления и историю координации DSH",
		input: { hint: "<campaign-id>" },
		handler: (invocation) => run(invocation, workbench, async (scoped) => {
			const id = requiredInput(invocation.rawInput, "campaign id");
			const detail = await scoped.campaign(id);
			return [
				`${detail.campaign.title} · ${detail.campaign.status} · ${detail.campaign.budget.depth}`,
				`${detail.campaign.target.name} ${detail.campaign.target.version} · ${detail.campaign.lanes.length} lanes`,
				`Поверхность атаки: ${detail.surfaces.cards.length === 0 ? "Пока не предложено" : `${detail.surfaces.selected} выбрано · ${detail.surfaces.skipped} пропущено · ${detail.surfaces.proposed} не определено`}`,
				`Связанный чат: ${detail.sessionLink?.sessionId ?? "none"}`,
				`Далее: ${detail.surfaces.nextAction}`
			].join("\n");
		})
	});
	ctx.commands.register({
		name: "omv-campaign-repair",
		description: "Исправить псевдонимы экосистемы, производные заголовки и метаданные порядка выполнения в плане аудита",
		input: { hint: "<campaign-id>" },
		handler: (invocation) => run(invocation, workbench, async (scoped) => {
			const id = requiredInput(invocation.rawInput, "campaign id");
			const result = await scoped.action({
				action: "campaign.repair",
				id,
				sessionId: invocation.agent.session.header.id
			});
			return `Конфигурация плана аудита исправлена: ${id}\n${JSON.stringify(result, null, 2)}`;
		})
	});
	ctx.commands.register({
		name: "omv-campaign-seed",
		description: "Инициализировать кандидатов Evidence.v1 по выбранным карточкам поверхности атаки; если карточек нет — по направлениям аудита",
		input: { hint: "<campaign-id>" },
		handler: (invocation) => run(invocation, workbench, async (scoped) => {
			const id = requiredInput(invocation.rawInput, "campaign id");
			const result = await scoped.action({
				action: "campaign.seed",
				id,
				sessionId: invocation.agent.session.header.id
			});
			return `Кандидаты плана аудита инициализированы: ${id}\n${JSON.stringify(result, null, 2)}`;
		})
	});
	ctx.commands.register({
		name: "omv-campaign-surfaces",
		description: "Предложить, посмотреть, выбрать или пропустить карточки поверхности атаки плана аудита",
		input: { hint: "<campaign-id> [propose|show|select|skip] [card-ids|--force]" },
		handler: (invocation) => run(invocation, workbench, async (scoped) => {
			const [id, operation = "show", ...rest] = words(invocation.rawInput);
			if (id === void 0) throw new Error("campaign id is required");
			if (operation === "show" || operation === "inspect") {
				const surfaces = (await scoped.campaign(id)).surfaces;
				if (surfaces.cards.length === 0) return `Поверхности атаки ещё не предложены: ${id}\nСледующий шаг: ${surfaces.nextAction}`;
				const rows = surfaces.cards.map((card) => `- [${card.status}] ${card.id} · ${card.vulnerabilityClass} · ${card.title}`);
				return [
					`Поверхность атаки: ${id} · ${surfaces.selected} выбрано · ${surfaces.skipped} пропущено · ${surfaces.proposed} не определено`,
					...rows,
					`Далее: ${surfaces.nextAction}`
				].join("\n");
			}
			if (operation === "propose") {
				const result = await scoped.action({
					action: "campaign.surfaces.propose",
					id,
					force: rest.includes("--force")
				});
				return `Предложены поверхности атаки: ${id}\n${JSON.stringify(result, null, 2)}`;
			}
			if (operation !== "select" && operation !== "skip") throw new Error("operation должен быть propose, show, select или skip");
			const cardIds = rest.filter((value) => value !== "--force");
			const result = await scoped.action({
				action: operation === "select" ? "campaign.surfaces.select" : "campaign.surfaces.skip",
				id,
				cardIds
			});
			return `Поверхность атаки обновлена: ${id} → ${operation}\n${JSON.stringify(result, null, 2)}`;
		})
	});
	ctx.commands.register({
		name: "omv-search",
		description: "Поиск по находкам, планам аудита и журналу активности рабочей области OMV",
		input: { hint: "<query>" },
		handler: (invocation) => run(invocation, workbench, async (scoped) => {
			const query = requiredInput(invocation.rawInput, "query");
			const results = await scoped.search(query);
			return results.length === 0 ? `Нет совпадений: ${query}` : results.slice(0, 20).map((result) => `- [${result.kind}] ${result.title} · ${result.description}`).join("\n");
		})
	});
	ctx.commands.register({
		name: "omv-campaign-run",
		description: "Создать или возобновить запуск плана аудита с сохранением состояния",
		input: { hint: "<campaign-id> [concurrency]" },
		handler: (invocation) => run(invocation, workbench, async (scoped) => {
			const [id, rawConcurrency] = words(invocation.rawInput);
			if (id === void 0) throw new Error("campaign id is required");
			const concurrency = rawConcurrency === void 0 ? 3 : Number(rawConcurrency);
			const result = await scoped.action({
				action: "campaign.run.create",
				id,
				concurrency,
				sessionId: invocation.agent.session.header.id
			});
			return `Campaign Run：${result.id} · ${result.status} · ${result.lanes.length} направлений\nОткройте запуск в разделе аудита уязвимостей → планы аудита. DSH создаст отдельные чаты направлений с учётом предела одновременной работы.`;
		})
	});
	ctx.commands.register({
		name: "omv-campaign-lane",
		description: "Передать результат выполнения одного направления плана аудита",
		input: { hint: "<run-id> <lane-id> <completed|failed|blocked|awaiting_evidence> [summary]" },
		handler: (invocation) => run(invocation, workbench, async (scoped) => {
			const [runId, laneId, status, ...summaryParts] = words(invocation.rawInput);
			if (runId === void 0 || laneId === void 0 || !isLaneStatus(status)) throw new Error("Требуются идентификатор запуска, идентификатор ветви lane и допустимый статус этой ветви");
			return `Направление обновлено: ${runId}/${laneId} → ${status}\nRun：${(await scoped.action({
				action: "campaign.run.lane.update",
				runId,
				laneId,
				laneStatus: status,
				sessionId: invocation.agent.session.header.id,
				summary: summaryParts.join(" ") || `Lane ${laneId} marked ${status}`
			})).status}`;
		})
	});
	ctx.commands.register({
		name: "omv-quality",
		description: "Проверить условия качества отчёта по находке и обязательные блокирующие требования",
		input: { hint: "<finding-id>" },
		handler: (invocation) => run(invocation, workbench, async (scoped) => {
			const id = requiredInput(invocation.rawInput, "finding id");
			const gate = (await scoped.finding(id)).qualityGate;
			return [`${id} · ${gate.readyForReport ? "Условия готовности отчёта выполнены" : gate.summary}`, ...gate.checks.map((check) => `- ${check.passed ? "✓" : check.state === "partial" ? "◐" : "○"} ${check.label} · ${check.detail}${check.blocking ? " · Условия передачи" : ""}`)].join("\n");
		})
	});
	ctx.commands.register({
		name: "omv-dedup",
		description: "Найти и сохранить заключение о дублях находки среди локальных записей и данных Radar",
		input: { hint: "<finding-id> [scan|clear|duplicate|unknown]" },
		handler: (invocation) => run(invocation, workbench, async (scoped) => {
			const [id, operation = "scan"] = words(invocation.rawInput);
			if (id === void 0) throw new Error("finding id is required");
			if (operation === "scan") {
				const result = await scoped.action({
					action: "dedup.scan",
					id,
					sessionId: invocation.agent.session.header.id
				});
				return `Поиск дублей завершён: ${id}\n${JSON.stringify(result, null, 2)}`;
			}
			if (operation !== "clear" && operation !== "duplicate" && operation !== "unknown") throw new Error("operation должен быть scan, clear, duplicate или unknown");
			const result = await scoped.action({
				action: "dedup.update",
				id,
				dedupStatus: operation === "clear" ? "clear" : operation === "duplicate" ? "duplicate" : "unknown",
				sessionId: invocation.agent.session.header.id
			});
			return `Заключение о дублировании обновлено: ${id} → ${operation}\n${JSON.stringify(result, null, 2)}`;
		})
	});
}
async function run(invocation, base, operation) {
	const cwd = invocation.agent.session.header.cwd;
	const scoped = cwd === void 0 ? base : base.scoped(cwd);
	try {
		return {
			kind: "success",
			text: await operation(scoped)
		};
	} catch (error) {
		return {
			kind: "error",
			text: error instanceof Error ? error.message : String(error)
		};
	}
}
function requiredInput(raw, field) {
	const value = raw.trim();
	if (value === "") throw new Error(`${field} is required`);
	return value;
}
function words(raw) {
	return raw.trim().split(/\s+/u).filter(Boolean);
}
function isIntent(value) {
	return value === "audit" || value === "repro" || value === "dedup" || value === "critic" || value === "report" || value === "disclose";
}
function isLaneStatus(value) {
	return value === "completed" || value === "failed" || value === "blocked" || value === "awaiting_evidence";
}
// src/contracts.ts
const WORKBENCH_PROTOCOL_VERSION = "2";
const WORKBENCH_COMPATIBLE_PROTOCOL_VERSIONS = ["1", "2"];
// src/http.ts
function registerWorkbenchHttp(webServer, workbench, resolveWorkbench = () => workbench) {
	const prefix = workbench.config.apiPrefix;
	const unregisterRoute = webServer.register({
		kind: "prefix",
		path: prefix,
		handler: async (req, res) => {
			try {
				await routeRequest(req, res, workbench, resolveWorkbench);
			} catch (error) {
				sendJson(res, statusForError(error), failure(error));
			}
		}
	});
	const unregisterIndex = webServer.tapIndex((html) => injectWorkbenchBootstrap(html, workbench.config));
	return () => {
		unregisterRoute();
		unregisterIndex();
	};
}
async function routeRequest(req, res, configured, resolveWorkbench) {
	requireAllowedClient(req, configured.config.allowRemoteAccess);
	requireTrustedHost(req, configured.config.allowRemoteAccess);
	const method = req.method ?? "GET";
	const url = new URL(req.url ?? "/", "http://dsh.local");
	const suffix = url.pathname.slice(configured.config.apiPrefix.length) || "/";
	const requestedRoot = url.searchParams.get("root")?.trim() || void 0;
	const requestedProtocol = protocolFrom(url);
	let workbench;
	try {
		workbench = await resolveWorkbench(requestedRoot);
	} catch (error) {
		throw new RequestError(403, error instanceof Error ? error.message : "requested DSH workspace is unavailable");
	}
	if ((method === "GET" || method === "HEAD") && (suffix === "/" || suffix === "/dashboard")) {
		sendJson(res, 200, success(versioned(await workbench.dashboard(), requestedProtocol)), method === "HEAD");
		return;
	}
	if (method === "GET" && suffix === "/events") {
		streamEvents(req, res, workbench);
		return;
	}
	if ((method === "GET" || method === "HEAD") && suffix === "/finding") {
		const id = url.searchParams.get("id")?.trim();
		if (!id) throw new RequestError(400, "Обязателен параметр запроса id");
		const archived = url.searchParams.get("archived") === "true";
		sendJson(res, 200, success(versioned(await workbench.finding(id, archived), requestedProtocol)), method === "HEAD");
		return;
	}
	if ((method === "GET" || method === "HEAD") && suffix === "/campaign") {
		const id = url.searchParams.get("id")?.trim();
		if (!id) throw new RequestError(400, "Обязателен параметр запроса id");
		sendJson(res, 200, success(versioned(await workbench.campaign(id), requestedProtocol)), method === "HEAD");
		return;
	}
	if ((method === "GET" || method === "HEAD") && suffix === "/campaign-run") {
		const id = url.searchParams.get("id")?.trim();
		if (!id) throw new RequestError(400, "Обязателен параметр запроса id");
		sendJson(res, 200, success(versioned(await workbench.campaignRun(id), requestedProtocol)), method === "HEAD");
		return;
	}
	if ((method === "GET" || method === "HEAD") && suffix === "/quality") {
		sendJson(res, 200, success(versioned(await workbench.quality(), requestedProtocol)), method === "HEAD");
		return;
	}
	if ((method === "GET" || method === "HEAD") && suffix === "/reproductions") {
		sendJson(res, 200, success(versioned((await workbench.dashboard()).reproductionRuns, requestedProtocol)), method === "HEAD");
		return;
	}
	if ((method === "GET" || method === "HEAD") && suffix === "/poc") {
		const findingId = url.searchParams.get("findingId")?.trim();
		if (findingId === void 0 || findingId === "") throw new RequestError(400, "Обязателен параметр запроса findingId");
		const [drafts, runs] = await Promise.all([workbench.poc.listDrafts(findingId), workbench.poc.listRuns(findingId)]);
		sendJson(res, 200, success(versioned({
			drafts,
			runs
		}, requestedProtocol)), method === "HEAD");
		return;
	}
	if ((method === "GET" || method === "HEAD") && suffix === "/poc-run") {
		const runId = url.searchParams.get("id")?.trim();
		if (runId === void 0 || runId === "") throw new RequestError(400, "Обязателен параметр запроса id");
		sendJson(res, 200, success(versioned(await workbench.poc.inspectRun(runId), requestedProtocol)), method === "HEAD");
		return;
	}
	if ((method === "GET" || method === "HEAD") && suffix === "/dedup") {
		const id = url.searchParams.get("id")?.trim();
		if (!id) throw new RequestError(400, "Обязателен параметр запроса id");
		sendJson(res, 200, success(versioned(await workbench.dedupSummary(id), requestedProtocol)), method === "HEAD");
		return;
	}
	if ((method === "GET" || method === "HEAD") && suffix === "/search") {
		const query = url.searchParams.get("q")?.trim();
		if (!query) throw new RequestError(400, "Обязателен параметр запроса q");
		sendJson(res, 200, success(versioned(await workbench.search(query), requestedProtocol)), method === "HEAD");
		return;
	}
	if ((method === "GET" || method === "HEAD") && suffix === "/export") {
		sendJson(res, 200, success(versioned(await workbench.exportWorkspace(), requestedProtocol)), method === "HEAD");
		return;
	}
	if ((method === "GET" || method === "HEAD") && suffix === "/health") {
		sendJson(res, 200, success(await workbench.health()), method === "HEAD");
		return;
	}
	if ((method === "GET" || method === "HEAD") && suffix === "/protocol") {
		sendJson(res, 200, success({
			current: "2",
			compatible: WORKBENCH_COMPATIBLE_PROTOCOL_VERSIONS
		}), method === "HEAD");
		return;
	}
	if (method === "POST" && suffix === "/action") {
		requireSameOrigin(req);
		requireJson(req);
		const request = await readJsonBody(req, workbench.config.httpBodyLimitBytes);
		if (!isRecord$5(request) || typeof request.action !== "string") throw new RequestError(400, "Тело запроса должно содержать action");
		const abortController = new AbortController();
		const abort = () => abortController.abort();
		req.once("aborted", abort);
		req.once("close", abort);
		let result;
		try {
			result = await workbench.action(request, { signal: abortController.signal });
		} finally {
			req.off("aborted", abort);
			req.off("close", abort);
		}
		sendJson(res, 200, success(versioned(result, requestedProtocol)));
		return;
	}
	if (method !== "GET" && method !== "HEAD" && method !== "POST") {
		res.setHeader("Allow", "GET, HEAD, POST");
		throw new RequestError(405, `method ${method} is not supported`);
	}
	throw new RequestError(404, `unknown dsh-omv endpoint: ${suffix}`);
}
function streamEvents(req, res, workbench) {
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
	res.setHeader("Cache-Control", "no-store, no-transform");
	res.setHeader("Connection", "keep-alive");
	res.setHeader("X-Accel-Buffering", "no");
	res.flushHeaders?.();
	res.write(`event: ready\ndata: ${JSON.stringify({ projectRoot: workbench.config.projectRoot })}\n\n`);
	const unsubscribe = workbench.subscribe((event) => {
		if (!res.destroyed && !res.writableEnded) res.write(`event: workspace\ndata: ${JSON.stringify(event)}\n\n`);
	});
	const heartbeat = setInterval(() => {
		if (!res.destroyed && !res.writableEnded) res.write(": heartbeat\n\n");
	}, workbench.config.eventHeartbeatMs);
	heartbeat.unref();
	let closed = false;
	const close = () => {
		if (closed) return;
		closed = true;
		clearInterval(heartbeat);
		unsubscribe();
		if (!res.writableEnded) res.end();
	};
	req.once("close", close);
	res.once("close", close);
}
function requireAllowedClient(req, allowRemoteAccess) {
	if (allowRemoteAccess) return;
	const address = req.socket.remoteAddress ?? "";
	if (address === "127.0.0.1" || address === "::1" || address.startsWith("::ffff:127.")) return;
	throw new RequestError(403, "Удалённый доступ к рабочей панели отключён");
}
/**
* DNS-rebinding guard: the socket may be loopback while the browser targets a
* rebound foreign hostname. Loopback-only deployments must present a loopback
* Host header, otherwise a remote page could read `/export` or POST mutations
* as if it were same-origin.
*/
function requireTrustedHost(req, allowRemoteAccess) {
	if (allowRemoteAccess) return;
	const host = req.headers.host;
	if (host === void 0 || host.trim() === "") throw new RequestError(403, "Отсутствует заголовок host");
	let hostname;
	try {
		hostname = new URL(`http://${host}`).hostname.toLowerCase();
	} catch {
		throw new RequestError(403, "Некорректный заголовок host");
	}
	if (hostname !== "localhost" && hostname !== "127.0.0.1" && hostname !== "::1" && hostname !== "[::1]") throw new RequestError(403, `untrusted host header for loopback-only workbench: ${host}`);
}
function requireSameOrigin(req) {
	const fetchSite = req.headers["sec-fetch-site"];
	if (fetchSite !== void 0 && fetchSite !== "same-origin" && fetchSite !== "none") throw new RequestError(403, "Запрос на изменение из другого origin отклонён");
	const origin = req.headers.origin;
	const host = req.headers.host;
	if (origin === void 0 || host === void 0) return;
	try {
		if (new URL(origin).host !== host) throw new RequestError(403, "Запрос на изменение из другого origin отклонён");
	} catch (error) {
		if (error instanceof RequestError) throw error;
		throw new RequestError(403, "Некорректный заголовок origin");
	}
}
function injectWorkbenchBootstrap(html, config) {
	const marker = "data-dsh-omv-bootstrap";
	if (html.includes(marker)) return html;
	const script = `<script ${marker}>window.__DSH_OMV__=${JSON.stringify({
		apiPrefix: config.apiPrefix,
		projectRoot: config.projectRoot,
		refreshIntervalMs: config.refreshIntervalMs
	}).replaceAll("<", "\\u003c")}<\/script>`;
	return html.includes("</head>") ? html.replace("</head>", `${script}</head>`) : `${script}${html}`;
}
function requireJson(req) {
	if (!(req.headers["content-type"] ?? "").toLowerCase().startsWith("application/json")) throw new RequestError(415, "content-type должен быть application/json");
}
async function readJsonBody(req, maxBytes) {
	const chunks = [];
	let total = 0;
	for await (const chunk of req) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		total += buffer.length;
		if (total > maxBytes) throw new RequestError(413, "Тело запроса слишком велико");
		chunks.push(buffer);
	}
	try {
		return JSON.parse(Buffer.concat(chunks).toString("utf8"));
	} catch {
		throw new RequestError(400, "Тело запроса не является корректным JSON");
	}
}
function sendJson(res, status, value, head = false) {
	if (res.headersSent) return;
	const body = JSON.stringify(value);
	res.statusCode = status;
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.end(head ? void 0 : body);
}
function success(data) {
	return {
		ok: true,
		data
	};
}
function protocolFrom(url) {
	const value = url.searchParams.get("protocol");
	if (value === null || value === "" || value === "2") return "2";
	if (value === "1") return "1";
	throw new RequestError(406, `unsupported dsh-omv protocol: ${value}`);
}
function versioned(data, protocol) {
	if (protocol === "2") return data;
	return rewriteProtocol(data);
}
function rewriteProtocol(value) {
	if (Array.isArray(value)) return value.map(rewriteProtocol);
	if (!isRecord$5(value)) return value;
	return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, key === "protocolVersion" ? "1" : rewriteProtocol(item)]));
}
function failure(error) {
	return {
		ok: false,
		error: {
			code: error instanceof RequestError ? `HTTP_${error.status}` : "OMV_WORKBENCH_ERROR",
			message: error instanceof Error ? error.message : String(error)
		}
	};
}
function statusForError(error) {
	return error instanceof RequestError ? error.status : 500;
}
function isRecord$5(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
var RequestError = class extends Error {
	status;
	constructor(status, message) {
		super(message);
		this.status = status;
	}
};
// src/runtime.ts
/** Read-only Cordis lifecycle diagnostics for missing-service and HMR issues. */
function inspectDshRuntime(ctx) {
	const runtimes = [...ctx.registry.values()].map((runtime) => ({
		name: runtime.name ?? (runtime.callback.name || "(anonymous)"),
		fibers: [...runtime.fibers].map((fiber) => ({
			uid: fiber.uid,
			name: fiber.name,
			state: stateName(fiber.state),
			dependencies: Object.keys(fiber.inject)
		}))
	}));
	const currentFiber = {
		uid: ctx.fiber.uid,
		name: ctx.fiber.name,
		state: stateName(ctx.fiber.state),
		dependencies: Object.keys(ctx.fiber.inject)
	};
	const fibers = runtimes.flatMap((runtime) => runtime.fibers);
	return {
		currentFiber,
		runtimes,
		pending: fibers.filter((fiber) => fiber.state === "PENDING").length,
		failed: fibers.filter((fiber) => fiber.state === "FAILED").length
	};
}
function stateName(value) {
	if (value === 0) return "PENDING";
	if (value === 1) return "LOADING";
	if (value === 2) return "ACTIVE";
	if (value === 3) return "FAILED";
	if (value === 4) return "DISPOSED";
	if (value === 5) return "UNLOADING";
	return `UNKNOWN(${value})`;
}
// src/assessment.ts
/**
* Evidence maturity is deliberately separate from the legacy Evidence.v1 score.
* It describes how a claim is supported and verified instead of treating every
* populated field as interchangeable percentage points.
*/
function assessEvidence(detail, evidence, reproductionRuns = []) {
	const passedReproduction = reproductionRuns.some((run) => run.status === "passed");
	const activeReproduction = reproductionRuns.some((run) => run.status === "running");
	const failedReproduction = reproductionRuns.some((run) => run.status === "failed" || run.status === "blocked");
	const source = knownAt$1(evidence, "evidence.source");
	const sink = knownAt$1(evidence, "evidence.sink");
	const guard = knownAt$1(evidence, "evidence.guard");
	const reproducer = knownAt$1(evidence, "evidence.reproducer") && valueAt$2(evidence, "evidence.reproducer") !== "none";
	const observation = knownAt$1(evidence, "evidence.observed_result");
	const reproductionArtifacts = stringListAt(evidence, "evidence.repro_artifacts").length > 0;
	const tested = knownAt$1(evidence, "versions.tested");
	const affected = knownAt$1(evidence, "versions.affected_range");
	const exploitability = stringAt(evidence, "verdict.exploitability");
	const declaredConfidence = stringAt(evidence, "verdict.confidence");
	const verdictReason = knownAt$1(evidence, "verdict.reason");
	const reportGoal = [
		"CVE",
		"VulDB",
		"advisory"
	].includes(stringAt(evidence, "researcher_goal"));
	const chainKnown = [
		source,
		sink,
		guard
	].filter(Boolean).length;
	const chainState = chainKnown === 3 ? passedReproduction || exploitability === "proven" && declaredConfidence === "high" ? "verified" : "supported" : chainKnown > 0 ? "partial" : "missing";
	const runtimeState = passedReproduction ? "verified" : failedReproduction ? "partial" : reproducer && observation && reproductionArtifacts && exploitability === "proven" && declaredConfidence === "high" ? "verified" : reproducer && observation ? "supported" : reproducer || observation || activeReproduction || failedReproduction ? "partial" : "missing";
	const scopeState = tested && affected ? "supported" : tested || affected ? "partial" : "missing";
	const impactKnown = [
		knownValue(exploitability),
		knownValue(declaredConfidence),
		verdictReason
	].filter(Boolean).length;
	const impactState = exploitability === "proven" && declaredConfidence === "high" && verdictReason ? "verified" : impactKnown === 3 ? "supported" : impactKnown > 0 ? "partial" : "missing";
	const dedupCount = [
		"dedup.nvd_searched",
		"dedup.ghsa_searched",
		"dedup.ecosystem_db_searched"
	].filter((path) => valueAt$2(evidence, path) === true).length;
	const cvss = knownAt$1(evidence, "cvss.vector");
	const reportParts = [
		detail.validation.ok,
		dedupCount === 3,
		cvss
	].filter(Boolean).length;
	const reportState = !reportGoal ? "not_applicable" : reportParts === 3 ? "supported" : reportParts > 0 ? "partial" : "missing";
	const dimensions = [
		dimension("claim_chain", "Доказательства потока данных", chainState, chainKnown === 3 ? "source → sink → guard образуют непрерывную цепочку обоснования" : `Найдено ${chainKnown}/3 ключевых звеньев`, chainKnown === 3 ? void 0 : "Продолжите прослеживать цепочку вызовов и восполните недостающие звенья"),
		dimension("runtime_verification", "Проверка во время выполнения", runtimeState, passedReproduction ? "Структурированное воспроизведение успешно" : runtimeState === "verified" ? "Шаги, наблюдаемый результат и артефакты взаимно подтверждаются" : reproducer && observation ? "Шаги и наблюдения записаны; можно добавить структурированную проверку" : activeReproduction ? "Воспроизведение выполняется" : failedReproduction ? "Предыдущее воспроизведение не прошло; нужно объяснить расхождение" : reproducer || observation ? "Шаги воспроизведения и наблюдения ещё не образуют завершённого обоснования" : "Доказательства воспроизведения не записаны", runtimeState === "verified" ? void 0 : "/omv-repro"),
		dimension("affected_scope", "Область воздействия", scopeState, tested && affected ? "Проверенная версия и диапазон затронутых версий обоснованы" : tested || affected ? "Обоснованы либо проверенная версия, либо диапазон воздействия; второе ещё не подтверждено" : "Проверенная версия и область воздействия требуют подтверждения", scopeState === "supported" ? void 0 : "Проверьте граничные версии и запишите affected_range"),
		dimension("impact_confidence", "Достоверность заключения", impactState, impactKnown === 0 ? "Заключение, пригодное для проверки, пока не сформировано" : `${exploitability || "unknown"} · ${declaredConfidence || "unknown"}${verdictReason ? " · Обоснование записано" : ""}`, impactState === "verified" || impactState === "supported" ? void 0 : "/omv-critic"),
		dimension("report_preparation", "Материалы для передачи", reportState, !reportGoal ? "Для текущей цели исследования не требуется заранее готовить материалы CVE/VulDB" : `Schema ${detail.validation.ok ? "Пройдено" : "Есть ошибки"} · Проверка дублей: ${dedupCount}/3 · CVSS ${cvss ? "Записано" : "Нужно дополнить"}`, reportState === "supported" || reportState === "not_applicable" ? void 0 : "Завершите проверку дублей, оценку CVSS и проверку схемы")
	];
	const maturity = deriveMaturity(dimensions, detail.status === "blocked" || exploitability === "blocked" || exploitability === "disproven");
	const phase = derivePhase(detail, dimensions, activeReproduction);
	const confidence = deriveConfidence(maturity, declaredConfidence);
	const openQuestions = stringListAt(evidence, "blockers");
	const suggestedActions = [...new Set(dimensions.flatMap((item) => {
		if (item.nextAction === void 0) return [];
		if (item.id === "report_preparation" && detail.status !== "confirmed" && maturity !== "supported" && maturity !== "verified") return [];
		return [item.nextAction];
	}))];
	if (openQuestions.length > 0 && !suggestedActions.includes("/omv-critic")) suggestedActions.unshift("/omv-critic");
	const signal = maturitySignal(dimensions);
	return {
		findingId: detail.id,
		maturity,
		phase,
		confidence,
		signal,
		summary: assessmentSummary(maturity, dimensions, openQuestions),
		dimensions,
		openQuestions,
		suggestedActions
	};
}
function dimension(id, label, state, detail, nextAction) {
	return {
		id,
		label,
		state,
		detail,
		...nextAction === void 0 ? {} : { nextAction }
	};
}
function deriveMaturity(dimensions, contested) {
	if (contested) return "contested";
	const byId = new Map(dimensions.map((item) => [item.id, item.state]));
	const chain = byId.get("claim_chain");
	const runtime = byId.get("runtime_verification");
	const impact = byId.get("impact_confidence");
	if ((chain === "verified" || chain === "supported") && runtime === "verified" && (impact === "verified" || impact === "supported")) return "verified";
	if ((chain === "verified" || chain === "supported") && (runtime === "verified" || runtime === "supported" || impact === "verified" || impact === "supported")) return "supported";
	if (dimensions.some((item) => item.id !== "report_preparation" && item.state !== "missing" && item.state !== "not_applicable")) return "developing";
	return "unmapped";
}
function derivePhase(detail, dimensions, activeReproduction) {
	const byId = new Map(dimensions.map((item) => [item.id, item.state]));
	if (detail.status === "confirmed" && (byId.get("report_preparation") === "supported" || byId.get("report_preparation") === "not_applicable")) return "reporting";
	if (activeReproduction || byId.get("runtime_verification") === "partial" || byId.get("runtime_verification") === "supported" || byId.get("runtime_verification") === "verified") return "verification";
	if (byId.get("claim_chain") !== "missing") return "analysis";
	return "discovery";
}
function deriveConfidence(maturity, declared) {
	if (maturity === "unmapped") return "unrated";
	if (maturity === "contested" || maturity === "developing") return "low";
	if (maturity === "verified" && declared === "high") return "high";
	return declared === "low" ? "low" : "medium";
}
function maturitySignal(dimensions) {
	const weights = {
		claim_chain: 30,
		runtime_verification: 26,
		affected_scope: 16,
		impact_confidence: 18,
		report_preparation: 10
	};
	const values = {
		missing: 0,
		partial: .45,
		supported: .8,
		verified: 1,
		not_applicable: 0
	};
	let earned = 0;
	let possible = 0;
	for (const item of dimensions) {
		if (item.state === "not_applicable") continue;
		const weight = weights[item.id];
		earned += weight * values[item.state];
		possible += weight;
	}
	return possible === 0 ? 0 : Math.round(earned / possible * 100);
}
function assessmentSummary(maturity, dimensions, openQuestions) {
	if (maturity === "contested") return "Доказательства указывают на препятствие или опровержение. Сохраните исследование; это не следует представлять как низкий процент готовности.";
	const partial = dimensions.filter((item) => item.state === "partial" || item.state === "missing").map((item) => item.label);
	if (maturity === "verified") return openQuestions.length === 0 ? "Основные доказательства проверены во время выполнения; можно готовить отчёт." : `Основные доказательства проверены; остаётся ${openQuestions.length} пограничных вопросов для рассмотрения.`;
	if (maturity === "supported") return openQuestions.length > 0 ? `Основное обоснование подтверждено; остаётся ${openQuestions.length} пограничных вопросов, по которым нужно решение.` : partial.length === 0 ? "Доказательства образуют взаимно подтверждённую завершённую цепочку." : `Основное обоснование установлено; далее сосредоточьтесь на ${partial.slice(0, 2).join("、")}。`;
	if (maturity === "developing") return `Доказательства формируются; сначала дополните ${partial.slice(0, 2).join("、") || "основное обоснование"}。`;
	return "Основной цепочки доказательств ещё нет. Начните с определения source, sink и guard.";
}
function valueAt$2(root, path) {
	let value = root;
	for (const key of path.split(".")) {
		if (value === null || typeof value !== "object" || Array.isArray(value)) return void 0;
		value = value[key];
	}
	return value;
}
function knownAt$1(root, path) {
	return known$1(valueAt$2(root, path));
}
function knownValue(value) {
	return known$1(value);
}
function known$1(value) {
	return value !== void 0 && value !== null && value !== "" && value !== "unknown" && (!Array.isArray(value) || value.length > 0);
}
function stringAt(root, path) {
	const value = valueAt$2(root, path);
	return typeof value === "string" && value !== "unknown" ? value : "";
}
function stringListAt(root, path) {
	const value = valueAt$2(root, path);
	return Array.isArray(value) ? value.filter((item) => typeof item === "string" && item.trim() !== "") : [];
}
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
	if (isRecord$4(value)) {
		const path = stringField(value, "path") ?? stringField(value, "file") ?? stringField(value, "locator");
		if (path === void 0 || !looksLikePath(path)) return void 0;
		const line = integerField(value, "line") ?? integerField(value, "startLine");
		const endLine = integerField(value, "endLine") ?? integerField(value, "end_line");
		const note = stringField(value, "note") ?? stringField(value, "detail") ?? "";
		return {
			path: normalizePath(path),
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
		path: normalizePath(match[1]),
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
function normalizePath(value) {
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
function isRecord$4(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
// src/evidence-graph.ts
const EVIDENCE_PATHS = [
	["source", "evidence.source"],
	["sink", "evidence.sink"],
	["guard", "evidence.guard"],
	["reproducer", "evidence.reproducer"],
	["observation", "evidence.observed_result"]
];
function buildEvidenceGraph(input) {
	const rootId = `finding:${input.detail.id}`;
	const nodes = [{
		id: rootId,
		kind: "finding",
		label: input.detail.id,
		value: `${input.detail.package} · ${input.detail.vulnerability}`,
		state: input.detail.status === "confirmed" ? "verified" : "known",
		path: input.detail.path
	}];
	const edges = [];
	const claimId = `${rootId}:claim`;
	const claimLine = lineOf(input.rawEvidence, "vulnerability.class");
	nodes.push({
		id: claimId,
		kind: "claim",
		label: "Утверждение об уязвимости",
		value: input.detail.vulnerability,
		state: input.detail.status === "confirmed" ? "verified" : "known",
		path: "vulnerability.class",
		...claimLine === void 0 ? {} : { line: claimLine }
	});
	edges.push({
		from: rootId,
		to: claimId,
		relation: "describes"
	});
	for (const [kind, path] of EVIDENCE_PATHS) {
		const raw = valueAt$1(input.evidence, path);
		const value = display(raw);
		const nodeId = `${rootId}:${kind}`;
		const line = lineOf(input.rawEvidence, path);
		const codeRef = parseCodeRef(raw);
		nodes.push({
			id: nodeId,
			kind,
			label: labelFor(kind),
			value,
			state: known(raw) ? kind === "observation" && input.detail.status === "confirmed" ? "verified" : "known" : "unknown",
			path,
			...line === void 0 ? {} : { line },
			...codeRef === void 0 ? {} : { codeRef }
		});
	}
	edges.push({
		from: `${rootId}:source`,
		to: `${rootId}:sink`,
		relation: "flows_to"
	}, {
		from: `${rootId}:sink`,
		to: `${rootId}:guard`,
		relation: "guarded_by"
	}, {
		from: claimId,
		to: `${rootId}:reproducer`,
		relation: "reproduced_by"
	}, {
		from: `${rootId}:reproducer`,
		to: `${rootId}:observation`,
		relation: "observed_as"
	});
	const sessionIds = new Set(input.history.flatMap((event) => event.sessionId === void 0 ? [] : [event.sessionId]));
	for (const sessionId of sessionIds) {
		const event = input.history.find((item) => item.sessionId === sessionId);
		const nodeId = `session:${sessionId}`;
		nodes.push({
			id: nodeId,
			kind: "session",
			label: "Чат DSH",
			value: sessionId,
			state: "verified",
			sessionId,
			...event === void 0 ? {} : { timestamp: event.timestamp }
		});
		edges.push({
			from: claimId,
			to: nodeId,
			relation: "produced_in"
		});
	}
	const evidenceArtifacts = valueAt$1(input.evidence, "evidence.repro_artifacts");
	const artifacts = [...Array.isArray(evidenceArtifacts) ? evidenceArtifacts.filter((item) => typeof item === "string") : [], ...input.reproductionRuns.flatMap((run) => run.artifacts)];
	for (const artifact of [...new Set(artifacts)]) {
		const nodeId = `artifact:${artifact}`;
		nodes.push({
			id: nodeId,
			kind: "artifact",
			label: "Артефакт воспроизведения",
			value: artifact,
			state: "known",
			path: artifact
		});
		edges.push({
			from: `${rootId}:reproducer`,
			to: nodeId,
			relation: "attached_as"
		});
	}
	return {
		findingId: input.detail.id,
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		nodes,
		edges
	};
}
function evaluateQualityGate(detail, evidence, reproductionRuns = []) {
	const assessment = assessEvidence(detail, evidence, reproductionRuns);
	const byDimension = new Map(assessment.dimensions.map((item) => [item.id, item]));
	const gateActive = detail.status === "confirmed";
	const reportGoal = [
		"CVE",
		"VulDB",
		"advisory"
	].includes(display(valueAt$1(evidence, "researcher_goal")));
	const dedupCount = [
		"dedup.nvd_searched",
		"dedup.ghsa_searched",
		"dedup.ecosystem_db_searched"
	].filter((path) => valueAt$1(evidence, path) === true).length;
	const chain = byDimension.get("claim_chain");
	const runtime = byDimension.get("runtime_verification");
	const scope = byDimension.get("affected_scope");
	const impact = byDimension.get("impact_confidence");
	const openQuestions = assessment.openQuestions;
	const checks = [
		check("status", "Вывод исследования подтверждён", detail.status === "confirmed" ? "verified" : detail.status === "blocked" ? "missing" : "partial", false, detail.status === "confirmed" ? "Находка подтверждена" : `Текущий статус: ${detail.status}; на этапе кандидата даются только рекомендации, строгая блокировка не применяется`, "Сначала явно укажите verdict, затем решите вопрос о повышении статуса"),
		check("validation", "Evidence Schema", detail.validation.ok ? "verified" : "missing", gateActive, detail.validation.ok ? "Evidence.v1 прошёл проверку" : `${detail.validation.errors.length} ошибок схемы`, "Исправьте ошибки проверки Evidence.v1"),
		check("claim-chain", chain.label, chain.state, gateActive, chain.detail, chain.nextAction),
		check("runtime-verification", runtime.label, runtime.state, gateActive, runtime.detail, runtime.nextAction),
		check("affected-scope", scope.label, scope.state, gateActive, scope.detail, scope.nextAction),
		check("impact-confidence", impact.label, impact.state, gateActive, impact.detail, impact.nextAction),
		check("open-questions", "Явно указанные вопросы о границах применимости", openQuestions.length === 0 ? "verified" : "partial", gateActive && openQuestions.length > 0, openQuestions.length === 0 ? "Нерешённых блокирующих проблем нет" : `${openQuestions.length} вопросов требуют решения; они не пересчитываются в штрафные баллы`, "/omv-critic"),
		check("dedup", "Проверка дублей среди публичных раскрытий", dedupCount === 3 ? "verified" : dedupCount > 0 ? "partial" : "missing", gateActive && reportGoal, `Проверено ${dedupCount}/3 пассивных источников`, "/omv-dedup"),
		check("cvss", "Оценка CVSS", known(valueAt$1(evidence, "cvss.vector")) ? "supported" : "missing", gateActive && reportGoal, display(valueAt$1(evidence, "cvss.vector")), "Добавьте CVSS, соответствующий проверенному воздействию")
	];
	const blockers = checks.filter((item) => item.blocking && !item.passed).map((item) => item.label);
	const advisories = checks.filter((item) => !item.blocking && !item.passed).map((item) => item.label);
	const readyForReport = gateActive && blockers.length === 0;
	return {
		findingId: detail.id,
		score: assessment.signal,
		readyForReport,
		checks,
		blockers,
		advisories,
		summary: readyForReport ? "Основное обоснование подтверждено; условия передачи выполнены." : gateActive ? `${blockers.length} условий передачи ещё требуют действий; это не снижает оценку зрелости уже собранных доказательств.` : "Исследование продолжается: проверка готовности только указывает пробелы и не объявляет кандидата принудительно незавершённым."
	};
}
function check(id, label, state, blocking, detail, nextAction) {
	const passed = state === "supported" || state === "verified" || state === "not_applicable";
	return {
		id,
		label,
		state,
		blocking,
		passed,
		severity: blocking ? "required" : "recommended",
		detail,
		...nextAction === void 0 || passed ? {} : { nextAction }
	};
}
function lineOf(raw, path) {
	const key = path.split(".").at(-1);
	if (key === void 0) return void 0;
	const lines = raw.split(/\r?\n/u);
	const pattern = new RegExp(`^\\s*${escapeRegExp(key)}\\s*:`);
	const index = lines.findIndex((line) => pattern.test(line));
	return index < 0 ? void 0 : index + 1;
}
function valueAt$1(root, path) {
	let value = root;
	for (const key of path.split(".")) {
		if (value === null || typeof value !== "object" || Array.isArray(value)) return void 0;
		value = value[key];
	}
	return value;
}
function known(value) {
	return value !== void 0 && value !== null && value !== "" && value !== "unknown" && (!Array.isArray(value) || value.length > 0);
}
function display(value) {
	if (!known(value)) return "unknown";
	if (typeof value === "string") return value;
	return JSON.stringify(value);
}
function labelFor(kind) {
	if (kind === "source") return "Source";
	if (kind === "sink") return "Sink";
	if (kind === "guard") return "Guard";
	if (kind === "reproducer") return "Reproducer";
	return "Observed result";
}
function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
function analyzeEvidenceGraph(graph) {
	const rootId = `finding:${graph.findingId}`;
	const sourceId = `${rootId}:source`;
	const sinkId = `${rootId}:sink`;
	const guardId = `${rootId}:guard`;
	const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
	const edgesByFrom = /* @__PURE__ */ new Map();
	for (const edge of graph.edges) {
		if (!edgesByFrom.has(edge.from)) edgesByFrom.set(edge.from, []);
		edgesByFrom.get(edge.from).push(edge);
	}
	const primaryPath = [];
	const highlightedNodes = [];
	const highlightedEdges = [];
	const missingGuards = [];
	const disconnectedNodes = [];
	const sourceNode = nodeById.get(sourceId);
	const sinkNode = nodeById.get(sinkId);
	const guardNode = nodeById.get(guardId);
	if (sourceNode !== void 0 && sourceNode.state !== "unknown") {
		primaryPath.push(sourceId);
		highlightedNodes.push(sourceId);
	}
	if (sinkNode !== void 0 && sinkNode.state !== "unknown") {
		primaryPath.push(sinkId);
		highlightedNodes.push(sinkId);
	}
	if (guardNode !== void 0) {
		if (guardNode.state === "unknown" || guardNode.value === "unknown" || guardNode.value === "missing") missingGuards.push(guardId);
		else {
			primaryPath.push(guardId);
			highlightedNodes.push(guardId);
		}
	}
	for (const edge of graph.edges) if (edge.from === sourceId && edge.to === sinkId || edge.from === sinkId && edge.to === guardId) highlightedEdges.push(`${edge.from}→${edge.to}`);
	const reachable = /* @__PURE__ */ new Set();
	const queue = [rootId, `${rootId}:claim`];
	while (queue.length > 0) {
		const current = queue.shift();
		if (reachable.has(current)) continue;
		reachable.add(current);
		const edges = edgesByFrom.get(current) ?? [];
		for (const edge of edges) if (!reachable.has(edge.to)) queue.push(edge.to);
	}
	for (const node of graph.nodes) if (!reachable.has(node.id) && node.kind !== "finding" && node.kind !== "claim") disconnectedNodes.push(node.id);
	return {
		primaryPath,
		highlightedNodes,
		highlightedEdges,
		missingGuards,
		disconnectedNodes
	};
}
function exportEvidenceGraph(graph, format) {
	if (format === "dot") return exportToDot(graph);
	if (format === "mermaid") return exportToMermaid(graph);
	throw new Error(`unsupported export format: ${format}`);
}
function exportToDot(graph) {
	const lines = [
		"digraph EvidenceGraph {",
		"  rankdir=LR;",
		"  node [shape=box];",
		""
	];
	for (const node of graph.nodes) {
		const id = safeIdForDot(node.id);
		const label = escapeDotLabel(node.label);
		const shape = node.kind === "finding" ? "ellipse" : "box";
		const style = node.state === "unknown" ? "dashed" : node.state === "verified" ? "bold" : "solid";
		lines.push(`  ${id} [label="${label}", shape=${shape}, style=${style}];`);
	}
	lines.push("");
	for (const edge of graph.edges) {
		const from = safeIdForDot(edge.from);
		const to = safeIdForDot(edge.to);
		const label = escapeDotLabel(edge.relation.replace(/_/g, " "));
		lines.push(`  ${from} -> ${to} [label="${label}"];`);
	}
	lines.push("}");
	return lines.join("\n");
}
function exportToMermaid(graph) {
	const lines = ["graph LR", ""];
	for (const node of graph.nodes) {
		const id = safeIdForMermaid(node.id);
		const label = escapeMermaidLabel(node.label);
		const bracket = node.kind === "finding" ? ["((", "))"] : node.state === "unknown" ? ["[", "]"] : ["[", "]"];
		lines.push(`  ${id}${bracket[0]}"${label}"${bracket[1]}`);
	}
	lines.push("");
	for (const edge of graph.edges) {
		const from = safeIdForMermaid(edge.from);
		const to = safeIdForMermaid(edge.to);
		const label = escapeMermaidLabel(edge.relation.replace(/_/g, " "));
		lines.push(`  ${from} -->|"${label}"| ${to}`);
	}
	return lines.join("\n");
}
function safeIdForDot(id) {
	return id.replace(/[^A-Za-z0-9_]/g, "_");
}
function safeIdForMermaid(id) {
	return id.replace(/[^A-Za-z0-9_]/g, "_");
}
function escapeDotLabel(label) {
	return label.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
}
function escapeMermaidLabel(label) {
	return label.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/\{/g, "\\{").replace(/\}/g, "\\}").replace(/\n/g, " ").replace(/\r/g, "");
}
// src/workflow.ts
const STORE_VERSION$3 = 1;
const HISTORY_LIMIT = 80;
const MAX_PATCH_BYTES = 32768;
/**
* Persistent application layer shared by the browser, slash commands and
* Agent tools. Evidence files remain authoritative; this store only owns DSH
* session links and an append-only record of workflow transitions.
*/
var OmvWorkflowService = class {
	projectRoot;
	writeTail = Promise.resolve();
	constructor(projectRoot) {
		this.projectRoot = projectRoot;
	}
	async links() {
		return { ...(await this.readLinkStore()).links };
	}
	async linkFinding(findingId, sessionId, intent) {
		const id = required$4(findingId, "finding id");
		const session = required$4(sessionId, "session id");
		return this.serial(async () => {
			const store = await this.readLinkStore();
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const previous = store.links[id];
			const link = {
				findingId: id,
				sessionId: session,
				linkedAt: previous?.linkedAt ?? now,
				updatedAt: now,
				...intent === void 0 ? previous?.lastIntent === void 0 ? {} : { lastIntent: previous.lastIntent } : { lastIntent: intent }
			};
			store.links[id] = link;
			store.updatedAt = now;
			await this.writeLinkStore(store);
			return link;
		});
	}
	async unlinkFinding(findingId) {
		const id = required$4(findingId, "finding id");
		return this.serial(async () => {
			const store = await this.readLinkStore();
			if (store.links[id] === void 0) return false;
			delete store.links[id];
			store.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
			await this.writeLinkStore(store);
			return true;
		});
	}
	async start(finding, evidence, intent, sessionId) {
		const stage = deriveAuditStage(finding, evidence);
		const linked = await this.linkFinding(finding.id, sessionId, intent);
		await this.record({
			findingId: finding.id,
			action: "workflow.start",
			sessionId,
			intent
		});
		const spec = workflowSpec(intent, finding);
		return {
			findingId: finding.id,
			sessionId,
			intent,
			label: spec.label,
			prompt: spec.prompt,
			stage,
			linked
		};
	}
	async record(input) {
		const timestamp = (/* @__PURE__ */ new Date()).toISOString();
		const diff = input.before === void 0 || input.after === void 0 || input.before === input.after ? void 0 : evidenceDiff(input.before, input.after, input.action, timestamp);
		const event = {
			id: randomUUID(),
			findingId: input.findingId,
			action: input.action,
			timestamp,
			...input.sessionId === void 0 ? {} : { sessionId: input.sessionId },
			...input.intent === void 0 ? {} : { intent: input.intent },
			...diff === void 0 ? {} : { diff }
		};
		await this.serial(async () => {
			await mkdir(dirname(this.eventsPath()), { recursive: true });
			await appendFile(this.eventsPath(), `${JSON.stringify(event)}\n`, "utf8");
		});
		return event;
	}
	async history(findingId, limit = HISTORY_LIMIT) {
		let raw;
		try {
			raw = await readFile(this.eventsPath(), "utf8");
		} catch (error) {
			if (isNotFound$4(error)) return [];
			throw error;
		}
		const rows = [];
		for (const line of raw.split(/\r?\n/u)) {
			if (line.trim() === "") continue;
			try {
				const parsed = JSON.parse(line);
				if (isWorkflowEvent(parsed) && parsed.findingId === findingId) rows.push(parsed);
			} catch {}
		}
		return rows.slice(-Math.max(1, limit)).reverse();
	}
	async readLinkStore() {
		try {
			const parsed = JSON.parse(await readFile(this.linksPath(), "utf8"));
			if (!isLinkStore(parsed)) throw new Error(`invalid DSH session-link store: ${this.linksPath()}`);
			return parsed;
		} catch (error) {
			if (!isNotFound$4(error)) throw error;
			return {
				schemaVersion: STORE_VERSION$3,
				updatedAt: (/* @__PURE__ */ new Date(0)).toISOString(),
				links: {}
			};
		}
	}
	async writeLinkStore(store) {
		const path = this.linksPath();
		await mkdir(dirname(path), { recursive: true });
		const temporary = `${path}.${process.pid}.${randomUUID()}.tmp`;
		await writeFile(temporary, `${JSON.stringify(store, null, 2)}\n`, "utf8");
		await rename(temporary, path);
	}
	linksPath() {
		return join(this.projectRoot, ".omv", ".dsh", "session-links.json");
	}
	eventsPath() {
		return join(this.projectRoot, ".omv", ".dsh", "workflow-events.jsonl");
	}
	async serial(operation) {
		const run = this.writeTail.then(operation, operation);
		this.writeTail = run.then(() => void 0, () => void 0);
		return run;
	}
};
function deriveAuditStage(finding, evidence, review) {
	if (finding.archived) return "archived";
	if (finding.status === "blocked" || review?.verdict === "blocked") return "blocked";
	if (truthyAt(evidence, "disclosure.vendor_contacted")) return "disclosed";
	if (finding.status === "confirmed" && (evaluateQualityGate(finding, evidence).readyForReport || review?.reportReady === true)) return "report_ready";
	if (finding.status === "confirmed") return "confirmed";
	const reproducer = knownAt(evidence, "evidence.reproducer");
	const observed = knownAt(evidence, "evidence.observed_result");
	if (reproducer && !observed) return "reproducing";
	if (assessEvidence(finding, evidence).maturity !== "unmapped") return "investigating";
	return "candidate";
}
function suggestedIntent(stage) {
	switch (stage) {
		case "candidate":
		case "investigating": return "audit";
		case "reproducing": return "repro";
		case "confirmed": return "dedup";
		case "report_ready": return "report";
		case "disclosed": return "disclose";
		case "blocked": return "critic";
		case "archived": return "audit";
	}
}
function workflowSpec(intent, finding) {
	const id = finding.id;
	const common = `Текущая находка OMV в рабочей области: ${id}. Сначала вызови omv_finding_inspect и прочитай существующий Evidence.v1. Каждый вывод должен ссылаться на файл и конкретные строки. После любого изменения Evidence вызывай omv_finding_validate.`;
	switch (intent) {
		case "audit": return {
			label: "Начать углублённый аудит",
			prompt: `${common}\nВыполни углублённый аудит: проследи полный поток данных source → sink → guard, установи достижимость, граничные условия и недостающие доказательства. Обнови .omv/findings/${id}.yaml, затем изложи подтверждённые или опровергнутые выводы и следующий шаг.`
		};
		case "repro": return {
			label: "Запустить воспроизведение",
			prompt: `${common}\nВыполни локальное воспроизведение: сначала вызови omv_finding_repro_init, проверь существующие reproducer и artifacts, выполни минимальные повторяемые шаги и запиши фактический вывод в observed_result и .omv/repro/${id}/, затем повтори проверку.`
		};
		case "dedup": return {
			label: "Проверить на дубли",
			prompt: `${common}\nПроверь дубли среди публичных раскрытий: ищи по пакету, затронутому компоненту, типу уязвимости и ключевым функциям в NVD, GHSA, OSV и бюллетенях экосистемы. Запиши запросы, совпадения и заключение в dedup. Различай одинаковую первопричину, похожие симптомы и несвязанные результаты.`
		};
		case "critic": return {
			label: "Критически проверить выводы",
			prompt: `${common}\nПеред передачей критически проверь выводы с позиции CNA или сопровождающего проекта. Ищи основания для отказа: достижимость, диапазон версий, воспроизведение, воздействие, CVSS, дубли и материалы отчёта. Перечисли препятствия по серьёзности и устрани пробелы, которые можно проверить непосредственно.`
		};
		case "report": return {
			label: "Сформировать отчёт",
			prompt: `${common}\nПодготовь материалы для передачи: убедись, что finding имеет статус confirmed и доказательства достигли необходимого уровня. В .omv/reports/${id}/ создай самодостаточный отчёт об уязвимости, инструкции воспроизведения и сведения о происхождении данных (provenance). Не выдавай предположения вместо unknown за факты.`
		};
		case "disclose": return {
			label: "Подготовить раскрытие",
			prompt: `${common}\nПодготовь раскрытие: проверь отчёт и результаты поиска дублей, составь первое письмо сопровождающим, этапы последующих обращений и график раскрытия. Обнови disclosure и явно укажи контакты или даты, которые ещё должен подтвердить человек.`
		};
	}
}
function evidenceDiff(before, after, action, changedAt) {
	const oldLines = before.replace(/\r\n/gu, "\n").split("\n");
	const newLines = after.replace(/\r\n/gu, "\n").split("\n");
	let prefix = 0;
	while (prefix < oldLines.length && prefix < newLines.length && oldLines[prefix] === newLines[prefix]) prefix += 1;
	let suffix = 0;
	while (suffix < oldLines.length - prefix && suffix < newLines.length - prefix && oldLines[oldLines.length - 1 - suffix] === newLines[newLines.length - 1 - suffix]) suffix += 1;
	const removed = oldLines.slice(prefix, oldLines.length - suffix);
	const added = newLines.slice(prefix, newLines.length - suffix);
	const body = [
		`@@ -${prefix + 1},${removed.length} +${prefix + 1},${added.length} @@`,
		...removed.map((line) => `-${line}`),
		...added.map((line) => `+${line}`)
	].join("\n");
	return {
		beforeHash: digest(before),
		afterHash: digest(after),
		changedAt,
		action,
		patch: Buffer.byteLength(body, "utf8") > MAX_PATCH_BYTES ? `${body.slice(0, MAX_PATCH_BYTES)}\n… diff truncated` : body,
		additions: added.length,
		deletions: removed.length
	};
}
function valueAt(root, path) {
	let value = root;
	for (const key of path.split(".")) {
		if (value === null || typeof value !== "object" || Array.isArray(value)) return void 0;
		value = value[key];
	}
	return value;
}
function knownAt(root, path) {
	const value = valueAt(root, path);
	return value !== void 0 && value !== null && value !== "" && value !== "unknown";
}
function truthyAt(root, path) {
	return valueAt(root, path) === true;
}
function digest(value) {
	return createHash("sha256").update(value).digest("hex").slice(0, 16);
}
function required$4(value, name) {
	const normalized = value.trim();
	if (normalized === "") throw new Error(`${name} is required`);
	return normalized;
}
function isNotFound$4(error) {
	return error instanceof Error && "code" in error && error.code === "ENOENT";
}
function isLinkStore(value) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
	const record = value;
	return record.schemaVersion === STORE_VERSION$3 && typeof record.updatedAt === "string" && record.links !== null && typeof record.links === "object" && !Array.isArray(record.links);
}
function isWorkflowEvent(value) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
	const record = value;
	return typeof record.id === "string" && typeof record.findingId === "string" && typeof record.action === "string" && typeof record.timestamp === "string";
}
// src/watch.ts
/** Lazy, reference-counted watcher used by the HTTP event stream. */
var OmvWorkspaceWatcher = class {
	projectRoot;
	debounceMs;
	listeners = /* @__PURE__ */ new Set();
	paths = /* @__PURE__ */ new Set();
	watcher;
	timer;
	revision = 0;
	constructor(projectRoot, debounceMs) {
		this.projectRoot = projectRoot;
		this.debounceMs = debounceMs;
	}
	subscribe(listener) {
		this.listeners.add(listener);
		this.ensureWatching();
		return () => {
			this.listeners.delete(listener);
			if (this.listeners.size === 0) this.close();
		};
	}
	close() {
		this.watcher?.close();
		this.watcher = void 0;
		if (this.timer !== void 0) clearTimeout(this.timer);
		this.timer = void 0;
		this.paths.clear();
	}
	ensureWatching() {
		if (this.watcher !== void 0) return;
		try {
			this.watcher = watch(join(this.projectRoot, ".omv"), { recursive: true }, (_event, filename) => {
				this.recordPath(filename === null ? ".omv" : filename.toString());
			});
		} catch (error) {
			if (!isNotFound$3(error)) {
				this.close();
				return;
			}
			try {
				this.watcher = watch(this.projectRoot, { recursive: false }, (_event, filename) => {
					if (typeof filename !== "string") return;
					if (filename.replaceAll("\\", "/").split("/")[0] !== ".omv") return;
					this.close();
					if (this.listeners.size > 0) this.ensureWatching();
				});
			} catch {
				this.close();
				return;
			}
		}
		this.watcher.on("error", () => {
			this.close();
		});
	}
	recordPath(filename) {
		const path = filename.replaceAll("\\", "/");
		this.paths.add(path === "" || path === ".omv" || path.startsWith(".omv/") ? path : `.omv/${path}`);
		this.schedule();
	}
	schedule() {
		if (this.timer !== void 0) clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this.timer = void 0;
			const paths = [...this.paths].sort();
			this.paths.clear();
			if (paths.length === 0) return;
			const event = {
				revision: ++this.revision,
				generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
				projectRoot: resolve(this.projectRoot),
				paths: paths.map((path) => relative(this.projectRoot, resolve(this.projectRoot, path)).replaceAll("\\", "/"))
			};
			for (const listener of this.listeners) try {
				listener(event);
			} catch {}
		}, this.debounceMs);
		this.timer.unref();
	}
};
function isNotFound$3(error) {
	return error instanceof Error && "code" in error && error.code === "ENOENT";
}
// src/runner.ts
const STORE_VERSION$2 = 1;
const MAX_CONCURRENCY = 8;
/**
* Durable Campaign execution state. DSH owns the actual sessions; this store
* owns lane admission, correlation, recovery and evidence-driven completion.
*/
var CampaignRunner = class {
	projectRoot;
	writeTail = Promise.resolve();
	recovery;
	constructor(projectRoot) {
		this.projectRoot = projectRoot;
	}
	async list(campaignId) {
		await this.ensureRecovered();
		const store = await this.readStore();
		return Object.values(store.runs).filter((run) => campaignId === void 0 || run.campaignId === campaignId).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
	}
	async get(runId) {
		await this.ensureRecovered();
		const run = (await this.readStore()).runs[required$3(runId, "run id")];
		if (run === void 0) throw new Error(`campaign run not found: ${runId}`);
		return run;
	}
	async create(campaign, parentSessionId, concurrency = 3) {
		await this.ensureRecovered();
		const parent = required$3(parentSessionId, "parent session id");
		const width = boundedConcurrency(concurrency);
		const run = await this.serial(async () => {
			const store = await this.readStore();
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const existing = Object.values(store.runs).find((item) => item.campaignId === campaign.id && (item.status === "queued" || item.status === "running" || item.status === "paused"));
			if (existing !== void 0) {
				if (existing.status === "queued" && existing.concurrency !== width) {
					existing.concurrency = width;
					existing.updatedAt = now;
					store.updatedAt = now;
					await this.writeStore(store);
				}
				return existing;
			}
			const id = `run-${compactTime$1(now)}-${randomUUID().slice(0, 8)}`;
			const created = {
				schemaVersion: STORE_VERSION$2,
				id,
				campaignId: campaign.id,
				parentSessionId: parent,
				status: "queued",
				concurrency: width,
				createdAt: now,
				updatedAt: now,
				lanes: campaign.lanes.map((lane) => laneRecord(campaign, lane, id, now))
			};
			store.runs[id] = created;
			store.updatedAt = now;
			await this.writeStore(store);
			return created;
		});
		await this.event(run, "run.create", void 0, parent, `${run.lanes.length} lanes · concurrency ${run.concurrency}`);
		return run;
	}
	async claim(runId) {
		await this.ensureRecovered();
		const claimed = await this.serial(async () => {
			const store = await this.readStore();
			const run = requireRun(store, runId);
			if (run.status === "paused" || run.status === "cancelled" || run.status === "completed" || run.status === "needs_attention" || run.status === "failed") return [];
			const active = run.lanes.filter((lane) => lane.status === "dispatching" || lane.status === "running").length;
			const available = Math.max(0, run.concurrency - active);
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const lanes = run.lanes.filter((lane) => lane.status === "queued").slice(0, available);
			for (const lane of lanes) {
				lane.status = "dispatching";
				lane.attempts += 1;
				lane.updatedAt = now;
			}
			let storeDirty = lanes.length > 0;
			if (lanes.length > 0) {
				run.status = "running";
				run.startedAt ??= now;
				run.updatedAt = now;
			} else if (run.status === "queued" || run.status === "running") {
				const previous = run.status;
				updateRunStatus(run, now);
				storeDirty = run.status !== previous;
			}
			if (storeDirty) {
				store.updatedAt = now;
				await this.writeStore(store);
			}
			return lanes.map((lane) => dispatchOf(run, lane));
		});
		await Promise.all(claimed.map((dispatch) => this.eventById(dispatch.runId, dispatch.campaignId, "lane.claim", dispatch.laneId, void 0, `attempt ${dispatch.attempt}`)));
		return claimed;
	}
	async bind(runId, laneId, sessionId) {
		await this.ensureRecovered();
		const session = required$3(sessionId, "session id");
		const run = await this.serial(async () => {
			const store = await this.readStore();
			const current = requireRun(store, runId);
			const lane = requireLane(current, laneId);
			if (lane.status !== "dispatching" && lane.status !== "running") throw new Error(`lane ${laneId} is not awaiting a DSH session`);
			const now = (/* @__PURE__ */ new Date()).toISOString();
			lane.status = "running";
			lane.sessionId = session;
			lane.startedAt ??= now;
			lane.updatedAt = now;
			current.status = "running";
			current.startedAt ??= now;
			current.updatedAt = now;
			store.updatedAt = now;
			await this.writeStore(store);
			return current;
		});
		await this.event(run, "lane.bind", laneId, session);
		return run;
	}
	async updateLane(input) {
		await this.ensureRecovered();
		const run = await this.serial(async () => {
			const store = await this.readStore();
			const current = requireRun(store, input.runId);
			const lane = requireLane(current, input.laneId);
			const now = (/* @__PURE__ */ new Date()).toISOString();
			lane.status = input.status;
			lane.updatedAt = now;
			lane.finishedAt = now;
			if (input.sessionId !== void 0) lane.sessionId = required$3(input.sessionId, "session id");
			if (input.summary !== void 0 && input.summary.trim() !== "") lane.summary = input.summary.trim();
			if (input.status === "failed") lane.lastError = input.summary?.trim() || "lane failed without a summary";
			updateRunStatus(current, now);
			store.updatedAt = now;
			await this.writeStore(store);
			return current;
		});
		await this.event(run, `lane.${input.status}`, input.laneId, input.sessionId, input.summary);
		return run;
	}
	async control(runId, control, laneId) {
		await this.ensureRecovered();
		const run = await this.serial(async () => {
			const store = await this.readStore();
			const current = requireRun(store, runId);
			const now = (/* @__PURE__ */ new Date()).toISOString();
			if (control === "pause") {
				if (current.status === "running" || current.status === "queued") current.status = "paused";
			} else if (control === "resume") {
				if (current.status === "paused") current.status = current.lanes.some((lane) => lane.status === "running" || lane.status === "dispatching") ? "running" : "queued";
			} else if (control === "cancel") {
				current.status = "cancelled";
				current.finishedAt = now;
				for (const lane of current.lanes) if (lane.status === "queued" || lane.status === "dispatching" || lane.status === "running" || lane.status === "awaiting_evidence") {
					lane.status = "cancelled";
					lane.updatedAt = now;
					lane.finishedAt = now;
				}
			} else {
				const targets = laneId === void 0 ? current.lanes.filter(retryable) : [requireLane(current, laneId)];
				if (targets.length === 0) throw new Error("В запуске кампании нет ветви lane, которую можно повторить");
				for (const lane of targets) {
					if (!retryable(lane)) throw new Error(`lane ${lane.laneId} is not retryable from ${lane.status}`);
					lane.status = "queued";
					lane.updatedAt = now;
					delete lane.sessionId;
					delete lane.startedAt;
					delete lane.finishedAt;
					delete lane.lastError;
				}
				current.status = "queued";
				delete current.finishedAt;
			}
			current.updatedAt = now;
			store.updatedAt = now;
			await this.writeStore(store);
			return current;
		});
		await this.event(run, `run.${control}`, laneId);
		return run;
	}
	async reconcile(runId, states) {
		await this.ensureRecovered();
		const byFinding = new Map(states.map((state) => [state.findingId, state]));
		const changed = [];
		const run = await this.serial(async () => {
			const store = await this.readStore();
			const current = requireRun(store, runId);
			const now = (/* @__PURE__ */ new Date()).toISOString();
			for (const lane of current.lanes) {
				const state = byFinding.get(lane.findingId);
				if (state === void 0) continue;
				if (!(lane.status === "queued" || lane.status === "dispatching" || lane.status === "running" || lane.status === "awaiting_evidence")) continue;
				if (state.stage === "report_ready" || state.stage === "disclosed") {
					lane.status = "completed";
					lane.summary = `Evidence reached ${state.stage} with ${state.maturity} maturity`;
					lane.finishedAt = now;
					lane.updatedAt = now;
					changed.push({
						laneId: lane.laneId,
						status: lane.status,
						detail: lane.summary
					});
				} else if (state.stage === "blocked") {
					lane.status = "blocked";
					lane.summary = `Evidence is blocked with ${state.maturity} maturity`;
					lane.finishedAt = now;
					lane.updatedAt = now;
					changed.push({
						laneId: lane.laneId,
						status: lane.status,
						detail: lane.summary
					});
				}
			}
			if (changed.length > 0) {
				updateRunStatus(current, now);
				store.updatedAt = now;
				await this.writeStore(store);
			}
			return current;
		});
		await Promise.all(changed.map((change) => this.event(run, `lane.${change.status}`, change.laneId, void 0, change.detail)));
		return run;
	}
	async history(runId, limit = 100) {
		let raw;
		try {
			raw = await readFile(this.eventsPath(), "utf8");
		} catch (error) {
			if (isNotFound$2(error)) return [];
			throw error;
		}
		const events = [];
		for (const line of raw.split(/\r?\n/u)) {
			if (line.trim() === "") continue;
			try {
				const value = JSON.parse(line);
				if (value.runId === runId && typeof value.id === "string") events.push(value);
			} catch {}
		}
		return events.slice(-Math.max(1, limit)).reverse();
	}
	async ensureRecovered() {
		this.recovery ??= this.serial(async () => {
			const store = await this.readStore();
			const now = (/* @__PURE__ */ new Date()).toISOString();
			let storeChanged = false;
			for (const run of Object.values(store.runs)) {
				let runChanged = false;
				for (const lane of run.lanes) {
					if (lane.status !== "dispatching") continue;
					lane.status = "queued";
					lane.updatedAt = now;
					lane.lastError = "dispatch interrupted before DSH session binding; recovered for retry";
					runChanged = true;
				}
				if (!runChanged) continue;
				if (run.status === "running" && !run.lanes.some((lane) => lane.status === "running")) run.status = "queued";
				run.updatedAt = now;
				storeChanged = true;
			}
			if (storeChanged) {
				store.updatedAt = now;
				await this.writeStore(store);
			}
		});
		await this.recovery;
	}
	async readStore() {
		try {
			const value = JSON.parse(await readFile(this.storePath(), "utf8"));
			if (!isStore$2(value)) throw new Error(`invalid Campaign Runner store: ${this.storePath()}`);
			return value;
		} catch (error) {
			if (!isNotFound$2(error)) throw error;
			return {
				schemaVersion: STORE_VERSION$2,
				updatedAt: (/* @__PURE__ */ new Date(0)).toISOString(),
				runs: {}
			};
		}
	}
	async writeStore(store) {
		const path = this.storePath();
		await mkdir(dirname(path), { recursive: true });
		const temporary = `${path}.${randomUUID()}.tmp`;
		await writeFile(temporary, `${JSON.stringify(store, null, 2)}\n`, "utf8");
		await rename(temporary, path);
	}
	async event(run, action, laneId, sessionId, detail) {
		await this.eventById(run.id, run.campaignId, action, laneId, sessionId, detail);
	}
	async eventById(runId, campaignId, action, laneId, sessionId, detail) {
		const event = {
			id: randomUUID(),
			runId,
			campaignId,
			action,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			...laneId === void 0 ? {} : { laneId },
			...sessionId === void 0 ? {} : { sessionId },
			...detail === void 0 || detail.trim() === "" ? {} : { detail: detail.trim() }
		};
		await this.serial(async () => {
			await mkdir(dirname(this.eventsPath()), { recursive: true });
			await appendFile(this.eventsPath(), `${JSON.stringify(event)}\n`, "utf8");
		});
	}
	storePath() {
		return join(this.projectRoot, ".omv", ".dsh", "campaign-runs.json");
	}
	eventsPath() {
		return join(this.projectRoot, ".omv", ".dsh", "campaign-run-events.jsonl");
	}
	async serial(operation) {
		const run = this.writeTail.then(operation, operation);
		this.writeTail = run.then(() => void 0, () => void 0);
		return run;
	}
};
function laneRecord(campaign, lane, runId, now) {
	return {
		laneId: lane.id,
		title: lane.title,
		vulnerabilityClass: lane.vulnerability_class,
		findingId: lane.finding_id,
		status: "queued",
		attempts: 0,
		prompt: lanePrompt(campaign, lane, runId),
		createdAt: now,
		updatedAt: now
	};
}
function lanePrompt(campaign, lane, runId) {
	return [
		`Ты выполняешь независимое направление плана аудита OMV ${campaign.id} — направление ${lane.id}。`,
		`Run ID：${runId}；Finding：${lane.finding_id}; тип уязвимости: ${lane.vulnerability_class}。`,
		`Цель: ${campaign.target.name} ${campaign.target.version}; исходный код: ${campaign.target.source}; глубина: ${campaign.budget.depth}。`,
		"Сначала вызови omv_campaign_inspect и прочитай sources/sinks/guards и проверки ложных срабатываний карточки этого направления, затем omv_finding_inspect. Работай только с текущей карточкой. Выстрой доказательства с указанием строк по цепочке source → sink → guard. При опровержении укажи blocked и обоснование. При необходимости фиксируй воспроизведение через omv_repro_run_start / omv_repro_run_finish.",
		"После каждого изменения Evidence вызывай omv_finding_validate и проверяй условия готовности отчёта через omv_quality_gate.",
		`Перед завершением обязательно вызови omv_campaign_lane_update с параметром runId=${runId}、laneId=${lane.id}; явно выбери completed, blocked, failed или awaiting_evidence и запиши краткий итог.`
	].join("\n");
}
function dispatchOf(run, lane) {
	return {
		runId: run.id,
		campaignId: run.campaignId,
		parentSessionId: run.parentSessionId,
		laneId: lane.laneId,
		findingId: lane.findingId,
		title: lane.title,
		prompt: lane.prompt,
		attempt: lane.attempts
	};
}
function updateRunStatus(run, now) {
	if (run.lanes.every((lane) => lane.status === "completed" || lane.status === "blocked" || lane.status === "failed" || lane.status === "cancelled")) {
		run.status = run.lanes.some((lane) => lane.status === "failed") ? "failed" : run.lanes.some((lane) => lane.status === "cancelled") ? "cancelled" : run.lanes.some((lane) => lane.status === "blocked") ? "needs_attention" : "completed";
		run.finishedAt = now;
	} else if (run.status !== "paused") {
		run.status = run.lanes.some((lane) => lane.status === "running" || lane.status === "dispatching") ? "running" : "queued";
		delete run.finishedAt;
	}
	run.updatedAt = now;
}
function retryable(lane) {
	return lane.status === "failed" || lane.status === "blocked" || lane.status === "cancelled" || lane.status === "awaiting_evidence";
}
function requireRun(store, runId) {
	const id = required$3(runId, "run id");
	const run = store.runs[id];
	if (run === void 0) throw new Error(`campaign run not found: ${id}`);
	return run;
}
function requireLane(run, laneId) {
	const id = required$3(laneId, "lane id");
	const lane = run.lanes.find((item) => item.laneId === id);
	if (lane === void 0) throw new Error(`campaign lane not found: ${run.id}/${id}`);
	return lane;
}
function boundedConcurrency(value) {
	if (!Number.isInteger(value) || value < 1 || value > MAX_CONCURRENCY) throw new Error(`concurrency must be an integer between 1 and ${MAX_CONCURRENCY}`);
	return value;
}
function compactTime$1(value) {
	return value.replace(/[-:TZ.]/gu, "").slice(0, 14);
}
function required$3(value, name) {
	const normalized = value.trim();
	if (normalized === "") throw new Error(`${name} is required`);
	return normalized;
}
function isStore$2(value) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
	const record = value;
	return record.schemaVersion === STORE_VERSION$2 && typeof record.updatedAt === "string" && record.runs !== null && typeof record.runs === "object" && !Array.isArray(record.runs);
}
function isNotFound$2(error) {
	return error instanceof Error && "code" in error && error.code === "ENOENT";
}
// src/reproduction.ts
const STORE_VERSION$1 = 1;
const MAX_OUTPUT_BYTES = 65536;
/** Durable, append-preserving metadata for local reproduction attempts. */
var ReproductionService = class {
	projectRoot;
	writeTail = Promise.resolve();
	constructor(projectRoot) {
		this.projectRoot = projectRoot;
	}
	async list(findingId) {
		const store = await this.readStore();
		return Object.values(store.runs).filter((run) => findingId === void 0 || run.findingId === findingId).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
	}
	async start(input) {
		return this.serial(async () => {
			const store = await this.readStore();
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const id = `repro-${compactTime(now)}-${randomUUID().slice(0, 8)}`;
			const run = {
				id,
				findingId: required$2(input.findingId, "finding id"),
				status: "running",
				artifacts: normalizedArtifacts(input.artifacts),
				createdAt: now,
				updatedAt: now,
				...input.sessionId === void 0 ? {} : { sessionId: required$2(input.sessionId, "session id") },
				...blank(input.command) ? {} : { command: input.command.trim() },
				...input.environment === void 0 ? {} : { environment: normalizedEnvironment(input.environment) }
			};
			store.runs[id] = run;
			store.updatedAt = now;
			await this.writeStore(store);
			return run;
		});
	}
	async finish(input) {
		return this.serial(async () => {
			const store = await this.readStore();
			const id = required$2(input.runId, "reproduction run id");
			const run = store.runs[id];
			if (run === void 0) throw new Error(`reproduction run not found: ${id}`);
			const now = (/* @__PURE__ */ new Date()).toISOString();
			run.status = input.status;
			run.updatedAt = now;
			run.finishedAt = now;
			if (input.sessionId !== void 0) run.sessionId = required$2(input.sessionId, "session id");
			if (input.exitCode !== void 0) {
				if (!Number.isInteger(input.exitCode)) throw new Error("Код завершения должен быть целым числом");
				run.exitCode = input.exitCode;
			}
			if (input.output !== void 0) run.output = truncateUtf8(input.output, MAX_OUTPUT_BYTES);
			if (input.artifacts !== void 0) run.artifacts = [.../* @__PURE__ */ new Set([...run.artifacts, ...normalizedArtifacts(input.artifacts)])];
			store.updatedAt = now;
			await this.writeStore(store);
			return run;
		});
	}
	async readStore() {
		try {
			const value = JSON.parse(await readFile(this.storePath(), "utf8"));
			if (!isStore$1(value)) throw new Error(`invalid reproduction store: ${this.storePath()}`);
			return value;
		} catch (error) {
			if (!isNotFound$1(error)) throw error;
			return {
				schemaVersion: STORE_VERSION$1,
				updatedAt: (/* @__PURE__ */ new Date(0)).toISOString(),
				runs: {}
			};
		}
	}
	async writeStore(store) {
		const path = this.storePath();
		await mkdir(dirname(path), { recursive: true });
		const temporary = `${path}.${randomUUID()}.tmp`;
		await writeFile(temporary, `${JSON.stringify(store, null, 2)}\n`, "utf8");
		await rename(temporary, path);
	}
	storePath() {
		return join(this.projectRoot, ".omv", ".dsh", "reproduction-runs.json");
	}
	async serial(operation) {
		const run = this.writeTail.then(operation, operation);
		this.writeTail = run.then(() => void 0, () => void 0);
		return run;
	}
};
function normalizedEnvironment(value) {
	const output = {};
	for (const [key, item] of Object.entries(value)) {
		const name = key.trim();
		if (!/^[A-Za-z_][A-Za-z0-9_]*$/u.test(name)) throw new Error(`invalid environment variable name: ${key}`);
		output[name] = String(item);
	}
	return output;
}
function normalizedArtifacts(values) {
	return [...new Set((values ?? []).map((value) => value.trim()).filter(Boolean))];
}
function truncateUtf8(value, limit) {
	const buffer = Buffer.from(value, "utf8");
	return buffer.length <= limit ? value : `${buffer.subarray(0, limit).toString("utf8")}\n… output truncated`;
}
function blank(value) {
	return value === void 0 || value.trim() === "";
}
function required$2(value, name) {
	const result = value.trim();
	if (result === "") throw new Error(`${name} is required`);
	return result;
}
function compactTime(value) {
	return value.replace(/[-:TZ.]/gu, "").slice(0, 14);
}
function isNotFound$1(error) {
	return error instanceof Error && "code" in error && error.code === "ENOENT";
}
function isStore$1(value) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
	const record = value;
	return record.schemaVersion === STORE_VERSION$1 && typeof record.updatedAt === "string" && record.runs !== null && typeof record.runs === "object" && !Array.isArray(record.runs);
}
// src/poc-generator.ts
const TEMPLATES = [
	{
		id: "ssrf-python",
		vulnerabilityClass: "ssrf",
		language: "python",
		image: "python:3.12-slim",
		requiresNetwork: true,
		generationPrompt: "Generate a Python script that demonstrates SSRF by making an HTTP request to an internal service. The script should output \"PASSED\" if the internal service responds, \"FAILED\" otherwise. Write result to /output/result.json with fields: status, observedResult, artifacts.",
		resultProtocol: "JSON file at /output/result.json with {status: \"passed\"|\"failed\"|\"needs_review\", observedResult: string, artifacts: string[]}"
	},
	{
		id: "path-traversal-python",
		vulnerabilityClass: "path_traversal",
		language: "python",
		image: "python:3.12-slim",
		requiresNetwork: false,
		generationPrompt: "Generate a Python script that demonstrates path traversal by reading a file outside the intended directory. Output \"PASSED\" if sensitive file is accessible, \"FAILED\" otherwise. Write result to /output/result.json.",
		resultProtocol: "JSON file at /output/result.json"
	},
	{
		id: "command-injection-bash",
		vulnerabilityClass: "command_injection",
		language: "bash",
		image: "python:3.12-slim",
		requiresNetwork: false,
		generationPrompt: "Generate a bash script that demonstrates command injection by executing an unintended command. Output \"PASSED\" if arbitrary command executes, \"FAILED\" otherwise. Write result to /output/result.json.",
		resultProtocol: "JSON file at /output/result.json"
	},
	{
		id: "xss-python",
		vulnerabilityClass: "xss",
		language: "python",
		image: "python:3.12-slim",
		requiresNetwork: false,
		generationPrompt: "Generate a Python script that demonstrates XSS by injecting script tags into HTML output. Output \"PASSED\" if script tag appears unescaped, \"FAILED\" otherwise. Write result to /output/result.json.",
		resultProtocol: "JSON file at /output/result.json"
	},
	{
		id: "sql-injection-python",
		vulnerabilityClass: "sql_injection",
		language: "python",
		image: "python:3.12-slim",
		requiresNetwork: false,
		generationPrompt: "Generate a Python script that demonstrates SQL injection by manipulating a SQL query. Output \"PASSED\" if injection succeeds, \"FAILED\" otherwise. Write result to /output/result.json.",
		resultProtocol: "JSON file at /output/result.json"
	},
	{
		id: "xxe-python",
		vulnerabilityClass: "xxe",
		language: "python",
		image: "python:3.12-slim",
		requiresNetwork: false,
		generationPrompt: "Generate a Python script that demonstrates XXE by parsing XML with external entity. Output \"PASSED\" if external entity is resolved, \"FAILED\" otherwise. Write result to /output/result.json.",
		resultProtocol: "JSON file at /output/result.json"
	},
	{
		id: "file-upload-python",
		vulnerabilityClass: "unrestricted_file_upload",
		language: "python",
		image: "python:3.12-slim",
		requiresNetwork: false,
		generationPrompt: "Generate a Python script that demonstrates unrestricted file upload by uploading a malicious file. Output \"PASSED\" if upload succeeds, \"FAILED\" otherwise. Write result to /output/result.json.",
		resultProtocol: "JSON file at /output/result.json"
	}
];
function createPocGenerationRequest(input) {
	const vulnClass = input.detail.vulnerability.toLowerCase().replace(/\s+/g, "_");
	const template = TEMPLATES.find((t) => t.vulnerabilityClass === vulnClass) ?? {
		id: "generic",
		vulnerabilityClass: vulnClass,
		language: "python",
		image: "python:3.12-slim",
		requiresNetwork: false,
		generationPrompt: "Generate a PoC script for this vulnerability. This is an unsupported vulnerability class - manual review required.",
		resultProtocol: "JSON file at /output/result.json"
	};
	const context = {
		findingId: input.detail.id,
		package: input.detail.package,
		vulnerability: input.detail.vulnerability,
		source: input.evidence["evidence.source"] ?? "unknown",
		sink: input.evidence["evidence.sink"] ?? "unknown",
		guard: input.evidence["evidence.guard"] ?? "unknown"
	};
	return {
		templateId: template.id,
		language: template.language,
		recommendedImage: template.image,
		requiresNetwork: template.requiresNetwork,
		context,
		generationPrompt: template.generationPrompt,
		resultProtocol: template.resultProtocol,
		safetyConstraints: {
			allowHostNetwork: false,
			allowPrivileged: false,
			allowDockerSocket: false,
			maxScriptBytes: 131072,
			maxOutputBytes: 65536
		}
	};
}
// src/poc-executor.ts
const execFileAsync = promisify(execFile);
var DockerPocExecutor = class {
	validate(draft, config) {
		const errors = [];
		const warnings = [];
		if (!draft.script || draft.script.trim() === "") errors.push("script cannot be empty");
		if (Buffer.byteLength(draft.script, "utf8") > config.pocMaxScriptBytes) errors.push(`script exceeds maximum size of ${config.pocMaxScriptBytes} bytes`);
		if (![
			"python",
			"bash",
			"curl"
		].includes(draft.language)) errors.push(`unsupported language: ${draft.language}`);
		const imageReference = imageReferenceFor(draft);
		if (!config.pocDockerImages.includes(draft.image) && !config.pocDockerImages.includes(imageReference)) errors.push(`image ${imageReference} is not in the allowlist`);
		if (draft.imageDigest === void 0) warnings.push("image is tag-based; pin an image digest before submitting a report");
		if (draft.requiresNetwork && !config.pocAllowNetwork) errors.push("PoC requires network but network access is disabled");
		if (draft.script.includes("/var/run/docker.sock")) errors.push("mounting docker.sock is forbidden");
		if (draft.script.includes("--privileged")) errors.push("privileged containers are forbidden");
		if (draft.script.includes("--network host")) errors.push("host network is forbidden");
		const expectedEntrypoint = draft.language === "python" ? "python3 /workspace/poc.py" : "bash /workspace/poc.sh";
		if (!draft.commandArgs.join(" ").includes(expectedEntrypoint)) warnings.push(`command should use fixed entrypoint: ${expectedEntrypoint}`);
		return {
			ok: errors.length === 0,
			errors,
			warnings
		};
	}
	async execute(draft, config, runner, options = {}) {
		const validation = this.validate(draft, config);
		if (!validation.ok) return createBlockedRun(draft, config, validation.errors.join("; "));
		const runId = options.id ?? `poc-run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
		const runDirectory = options.runDirectory ?? await mkdtemp(join(tmpdir(), "omv-poc-"));
		const outputDirectory = join(runDirectory, "output");
		await mkdir(outputDirectory, { recursive: true });
		const scriptName = draft.language === "python" ? "poc.py" : "poc.sh";
		const scriptPath = join(runDirectory, scriptName);
		await writeFile(scriptPath, draft.script, {
			encoding: "utf8",
			mode: 448
		});
		const startedAt = (/* @__PURE__ */ new Date()).toISOString();
		const dockerArgs = this.buildDockerArgs(draft, config, {
			scriptPath,
			outputDirectory,
			...options.sourceDirectory === void 0 ? {} : { sourceDirectory: options.sourceDirectory }
		});
		const provenance = {
			image: draft.image,
			...draft.imageDigest === void 0 ? {} : { imageDigest: draft.imageDigest },
			command: dockerArgs,
			mounts: [
				{
					source: scriptPath,
					target: `/workspace/${scriptName}`,
					readOnly: true
				},
				{
					source: outputDirectory,
					target: "/output",
					readOnly: false
				},
				...options.sourceDirectory === void 0 ? [] : [{
					source: options.sourceDirectory,
					target: "/source",
					readOnly: true
				}]
			],
			scriptSha256: sha256$1(draft.script),
			startedAt
		};
		try {
			const result = await runner.run("docker", dockerArgs, {
				timeout: config.pocTimeoutMs,
				...options.signal === void 0 ? {} : { signal: options.signal }
			});
			const resultDocument = await readResultDocument(outputDirectory, config.pocMaxOutputBytes);
			const artifactRecords = await collectArtifacts(outputDirectory, config.pocMaxOutputBytes);
			const resultArtifact = artifactRecords.find((artifact) => artifact.path === "result.json");
			const finishedAt = (/* @__PURE__ */ new Date()).toISOString();
			return {
				id: runId,
				draftId: draft.id,
				findingId: draft.findingId,
				backend: "docker",
				status: this.parseStatus(result.exitCode, resultDocument),
				exitCode: result.exitCode,
				stdout: result.stdout.slice(0, config.pocMaxOutputBytes),
				stderr: result.stderr.slice(0, config.pocMaxOutputBytes),
				artifacts: artifactRecords.map((artifact) => artifact.path),
				artifactRecords,
				...resultDocument === void 0 ? {} : {
					result: resultDocument,
					...typeof resultDocument.observedResult === "string" ? { observedResult: resultDocument.observedResult } : {}
				},
				safetyProfile: safetyProfile(draft, config),
				provenance: {
					...provenance,
					...resultArtifact === void 0 ? {} : { resultSha256: resultArtifact.sha256 },
					finishedAt
				},
				createdAt: startedAt,
				updatedAt: finishedAt,
				startedAt,
				finishedAt
			};
		} catch (error) {
			if (error instanceof Error && error.message.includes("docker: command not found")) return createBlockedRun(draft, config, "Docker is not available");
			return createFailedRun(draft, config, error instanceof Error && error.name === "AbortError" ? "execution aborted" : error instanceof Error && error.message.includes("timeout") ? "execution timeout" : error instanceof Error && error.message.includes("docker: command not found") ? "Docker is not available" : error instanceof Error ? error.message : String(error), startedAt, runId, provenance);
		}
	}
	buildDockerArgs(draft, config, paths) {
		const network = draft.requiresNetwork && config.pocAllowNetwork ? "bridge" : "none";
		const scriptName = draft.language === "python" ? "poc.py" : "poc.sh";
		return [
			"run",
			"--rm",
			"--pull=never",
			`--network=${network}`,
			"--read-only",
			"--cap-drop=ALL",
			"--security-opt=no-new-privileges",
			`--pids-limit=${config.pocPidLimit}`,
			`--memory=${config.pocMemoryMb}m`,
			`--cpus=${config.pocCpuLimit}`,
			"--tmpfs=/tmp:rw,noexec,nosuid,nodev,size=16m",
			"--mount",
			`type=bind,src=${paths.scriptPath},dst=/workspace/${scriptName},readonly`,
			"--mount",
			`type=bind,src=${paths.outputDirectory},dst=/output`,
			...paths.sourceDirectory === void 0 ? [] : ["--mount", `type=bind,src=${paths.sourceDirectory},dst=/source,readonly`],
			imageReferenceFor(draft),
			...draft.commandArgs
		];
	}
	parseStatus(exitCode, result) {
		if (exitCode !== 0) return "failed";
		if (result?.status === "passed") return "passed";
		if (result?.status === "failed") return "failed";
		if (result?.status === "blocked") return "blocked";
		return "needs_review";
	}
};
function imageReferenceFor(draft) {
	return draft.imageDigest === void 0 ? draft.image : `${draft.image}@${draft.imageDigest}`;
}
function safetyProfile(draft, config) {
	return {
		network: draft.requiresNetwork && config.pocAllowNetwork ? "bridge" : "none",
		readOnly: true,
		capsDropped: true,
		pidLimit: config.pocPidLimit,
		memoryMb: config.pocMemoryMb,
		cpuLimit: config.pocCpuLimit
	};
}
function sha256$1(value) {
	return createHash("sha256").update(value).digest("hex");
}
async function readResultDocument(outputDirectory, maxBytes) {
	try {
		const path = join(outputDirectory, "result.json");
		const info = await stat(path);
		if (!info.isFile() || info.size > maxBytes) return void 0;
		const parsed = JSON.parse(await readFile(path, "utf8"));
		return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : void 0;
	} catch {
		return;
	}
}
async function collectArtifacts(outputDirectory, maxBytes) {
	const records = [];
	let total = 0;
	const visit = async (directory) => {
		for (const entry of await readdir(directory, { withFileTypes: true })) {
			const absolute = join(directory, entry.name);
			if (entry.isSymbolicLink()) continue;
			if (entry.isDirectory()) {
				await visit(absolute);
				continue;
			}
			if (!entry.isFile()) continue;
			const info = await stat(absolute);
			total += info.size;
			if (total > maxBytes) throw new Error(`PoC output exceeds maximum size of ${maxBytes} bytes`);
			records.push({
				path: relative(outputDirectory, absolute).split(sep).join("/"),
				sha256: sha256$1(await readFile(absolute)),
				size: info.size
			});
		}
	};
	await visit(outputDirectory);
	return records;
}
function createBlockedRun(draft, config, reason) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	return {
		id: `poc-run-${Date.now()}`,
		draftId: draft.id,
		findingId: draft.findingId,
		backend: "docker",
		status: "blocked",
		artifacts: [],
		stderr: reason,
		safetyProfile: safetyProfile(draft, config),
		createdAt: now,
		updatedAt: now
	};
}
function createFailedRun(draft, config, reason, startedAt, id, provenance) {
	const finishedAt = (/* @__PURE__ */ new Date()).toISOString();
	return {
		id,
		draftId: draft.id,
		findingId: draft.findingId,
		backend: "docker",
		status: "failed",
		artifacts: [],
		stderr: reason,
		safetyProfile: safetyProfile(draft, config),
		provenance: {
			...provenance,
			finishedAt
		},
		createdAt: startedAt,
		updatedAt: finishedAt,
		startedAt,
		finishedAt
	};
}
const defaultCommandRunner = { async run(command, args, options) {
	try {
		const { stdout, stderr } = await execFileAsync(command, args, {
			timeout: options.timeout,
			maxBuffer: 1048576,
			signal: options.signal
		});
		return {
			stdout,
			stderr,
			exitCode: 0
		};
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") throw new Error(`${command}: command not found`);
		if (error && typeof error === "object" && "name" in error && error.name === "AbortError") throw error;
		if (error && typeof error === "object" && "killed" in error && error.killed) throw new Error("Истекло время выполнения");
		return {
			stdout: error && typeof error === "object" && "stdout" in error ? String(error.stdout) : "",
			stderr: error && typeof error === "object" && "stderr" in error ? String(error.stderr) : "",
			exitCode: error && typeof error === "object" && "code" in error && typeof error.code === "number" ? error.code : 1
		};
	}
} };
// src/poc-store.ts
var PocStore = class {
	dshDir;
	mutationQueue = Promise.resolve();
	constructor(projectRoot) {
		this.dshDir = join(projectRoot, ".omv", ".dsh");
	}
	async ensureDirectory() {
		await mkdir(this.dshDir, { recursive: true });
	}
	async saveDraft(draft) {
		await this.enqueue(async () => {
			await this.ensureDirectory();
			const draftsPath = join(this.dshDir, "poc-drafts.json");
			const drafts = await this.loadDrafts();
			const index = drafts.findIndex((d) => d.id === draft.id);
			if (index >= 0) drafts[index] = draft;
			else drafts.push(draft);
			await this.writeAtomic(draftsPath, JSON.stringify(drafts, null, 2));
		});
	}
	async loadDrafts() {
		const draftsPath = join(this.dshDir, "poc-drafts.json");
		try {
			const content = await readFile(draftsPath, "utf8");
			const parsed = JSON.parse(content);
			if (!Array.isArray(parsed)) return [];
			return parsed.filter(isRecord$3).map((value) => ({
				...value,
				status: value.status === "approved" || value.status === "rejected" || value.status === "stale" ? value.status : "draft",
				validation: isRecord$3(value.validation) ? value.validation : {
					ok: false,
					errors: ["legacy draft requires validation"],
					warnings: []
				}
			}));
		} catch {
			return [];
		}
	}
	async saveRun(run) {
		await this.enqueue(async () => {
			await this.ensureDirectory();
			const runsPath = join(this.dshDir, "poc-runs.json");
			const runs = await this.loadRuns();
			const index = runs.findIndex((r) => r.id === run.id);
			if (index >= 0) runs[index] = run;
			else runs.push(run);
			await this.writeAtomic(runsPath, JSON.stringify(runs, null, 2));
		});
	}
	async loadRuns() {
		const runsPath = join(this.dshDir, "poc-runs.json");
		try {
			const content = await readFile(runsPath, "utf8");
			return JSON.parse(content);
		} catch {
			return [];
		}
	}
	async findDraft(id) {
		return (await this.loadDrafts()).find((d) => d.id === id);
	}
	async findRun(id) {
		return (await this.loadRuns()).find((r) => r.id === id);
	}
	async findRunsByFinding(findingId) {
		return (await this.loadRuns()).filter((r) => r.findingId === findingId);
	}
	async findDraftsByFinding(findingId) {
		return (await this.loadDrafts()).filter((draft) => draft.findingId === findingId);
	}
	async writeAtomic(path, content) {
		const tempPath = `${path}.${randomUUID()}.tmp`;
		await writeFile(tempPath, content, "utf8");
		await rename(tempPath, path);
	}
	enqueue(operation) {
		const next = this.mutationQueue.then(operation, operation);
		this.mutationQueue = next.catch(() => void 0);
		return next;
	}
};
function isRecord$3(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
// src/poc-service.ts
var PocService = class {
	store;
	executor;
	config;
	projectRoot;
	constructor(config) {
		this.config = config;
		this.projectRoot = resolve(config.projectRoot);
		this.store = new PocStore(this.projectRoot);
		this.executor = new DockerPocExecutor();
	}
	async generate(detail, evidence) {
		this.assertEnabled();
		const generated = createPocGenerationRequest({
			detail,
			evidence
		});
		const image = splitImage(this.config.pocDockerImages.find((image) => image === generated.recommendedImage || image.startsWith(`${generated.recommendedImage}@`)) ?? this.config.pocDockerImages[0] ?? generated.recommendedImage);
		const request = {
			...generated,
			recommendedImage: image.name,
			safetyConstraints: {
				...generated.safetyConstraints,
				maxScriptBytes: this.config.pocMaxScriptBytes,
				maxOutputBytes: this.config.pocMaxOutputBytes
			}
		};
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const script = scaffold(request);
		const draft = {
			id: `poc-draft-${randomUUID()}`,
			findingId: detail.id,
			templateId: request.templateId,
			language: request.language,
			script,
			commandArgs: request.language === "python" ? ["python3", "/workspace/poc.py"] : ["bash", "/workspace/poc.sh"],
			image: request.recommendedImage,
			...image.digest === void 0 ? {} : { imageDigest: image.digest },
			requiresNetwork: request.requiresNetwork,
			generationPrompt: request.generationPrompt,
			resultProtocol: request.resultProtocol,
			validation: {
				ok: false,
				errors: ["script is a review scaffold; replace it with a tested PoC"],
				warnings: []
			},
			status: "draft",
			scriptSha256: sha256(script),
			createdAt: now,
			updatedAt: now
		};
		await this.store.saveDraft(draft);
		return {
			request,
			draft
		};
	}
	async saveDraft(input) {
		this.assertEnabled();
		const existing = input.draftId === void 0 ? void 0 : await this.store.findDraft(input.draftId);
		if (existing !== void 0 && existing.findingId !== input.findingId) throw new Error("Черновик не относится к этой находке");
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const language = input.language ?? existing?.language ?? "python";
		const selectedImage = splitImage(input.image ?? existing?.image ?? this.config.pocDockerImages[0]);
		const draft = {
			id: existing?.id ?? `poc-draft-${randomUUID()}`,
			findingId: input.findingId,
			templateId: input.templateId ?? existing?.templateId ?? "generic",
			language,
			script: input.script,
			commandArgs: input.commandArgs ?? (input.language === void 0 ? existing?.commandArgs : void 0) ?? entrypoint(language),
			image: selectedImage.name,
			...selectedImage.digest === void 0 ? existing?.imageDigest === void 0 ? {} : { imageDigest: existing.imageDigest } : { imageDigest: selectedImage.digest },
			requiresNetwork: input.requiresNetwork ?? existing?.requiresNetwork ?? false,
			...existing?.generationPrompt === void 0 ? {} : { generationPrompt: existing.generationPrompt },
			...existing?.resultProtocol === void 0 ? {} : { resultProtocol: existing.resultProtocol },
			validation: {
				ok: false,
				errors: [],
				warnings: []
			},
			status: "draft",
			scriptSha256: sha256(input.script),
			createdAt: existing?.createdAt ?? now,
			updatedAt: now
		};
		draft.validation = this.executor.validate(draft, this.config);
		await this.store.saveDraft(draft);
		return draft;
	}
	async validateDraft(draftId) {
		const draft = await this.requireDraft(draftId);
		const validation = this.executor.validate(draft, this.config);
		const next = {
			...draft,
			validation,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		await this.store.saveDraft(next);
		return next;
	}
	async approveDraft(draftId, approvedBy) {
		const draft = await this.validateDraft(draftId);
		if (!draft.validation.ok) throw new Error(`draft cannot be approved: ${draft.validation.errors.join("; ")}`);
		const next = {
			...draft,
			status: "approved",
			...approvedBy === void 0 ? {} : { approvedBy },
			approvedAt: (/* @__PURE__ */ new Date()).toISOString(),
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		await this.store.saveDraft(next);
		return next;
	}
	async runDraft(draftId, options = {}, runner = defaultCommandRunner) {
		this.assertEnabled();
		const draft = await this.requireDraft(draftId);
		if (draft.status !== "approved") throw new Error("Перед выполнением черновик должен быть явно одобрен");
		if (!draft.validation.ok) throw new Error("Перед выполнением черновик должен успешно пройти проверку");
		const executableDraft = runner === defaultCommandRunner ? await this.pinImageDigest(draft, options.signal) : draft;
		const runId = `poc-run-${randomUUID()}`;
		const runDirectory = join(this.projectRoot, ".omv", ".dsh", "poc-runs", runId);
		await mkdir(runDirectory, { recursive: true });
		const sourceDirectory = options.sourceDir === void 0 ? void 0 : this.safeSourceDirectory(options.sourceDir);
		const run = await this.executor.execute(executableDraft, this.config, runner, {
			id: runId,
			runDirectory,
			...options.signal === void 0 ? {} : { signal: options.signal },
			...sourceDirectory === void 0 ? {} : { sourceDirectory }
		});
		await this.store.saveRun(run);
		return run;
	}
	async inspectRun(runId) {
		const run = await this.store.findRun(runId);
		if (run === void 0) throw new Error(`PoC run not found: ${runId}`);
		return run;
	}
	async adoptEvidence(runId) {
		const run = await this.inspectRun(runId);
		if (run.status !== "passed") throw new Error("Принять в качестве доказательства можно только запуск PoC со статусом passed");
		const draft = await this.requireDraft(run.draftId);
		if (draft.status !== "approved") throw new Error("Перед принятием доказательства черновик должен по-прежнему иметь одобрение");
		const detailPath = await this.findingPath(run.findingId);
		const before = await readFile(detailPath, "utf8");
		const document = parseDocument(before);
		if (document.errors.length > 0) throw new Error(`cannot update invalid Evidence YAML: ${document.errors[0]?.message ?? detailPath}`);
		document.setIn(["evidence", "reproducer"], `PoC ${draft.id} executed in isolated Docker container; run ${run.id}`);
		if (run.observedResult !== void 0) document.setIn(["evidence", "observed_result"], run.observedResult);
		if (run.artifacts.length > 0) document.setIn(["evidence", "repro_artifacts"], [.../* @__PURE__ */ new Set([...stringsAt(document.getIn(["evidence", "repro_artifacts"])), ...run.artifacts])]);
		document.setIn(["evidence", "poc_provenance"], run.provenance ?? {
			run_id: run.id,
			status: run.status
		});
		const after = document.toString();
		if (after !== before) await writeFile(detailPath, after, "utf8");
		return {
			run,
			before,
			after
		};
	}
	async listDrafts(findingId) {
		const drafts = await this.store.loadDrafts();
		return findingId === void 0 ? drafts : drafts.filter((draft) => draft.findingId === findingId);
	}
	async listRuns(findingId) {
		const runs = await this.store.loadRuns();
		return findingId === void 0 ? runs : runs.filter((run) => run.findingId === findingId);
	}
	async requireDraft(draftId) {
		const draft = await this.store.findDraft(draftId);
		if (draft === void 0) throw new Error(`PoC draft not found: ${draftId}`);
		return draft;
	}
	async findingPath(findingId) {
		const findingsRoot = join(this.projectRoot, ".omv", "findings");
		const path = join(findingsRoot, `${findingId}.yaml`);
		try {
			await readFile(path, "utf8");
			return path;
		} catch {
			throw new Error(`finding not found: ${findingId}`);
		}
	}
	safeSourceDirectory(sourceDir) {
		const candidate = resolve(this.projectRoot, sourceDir);
		const prefix = this.projectRoot.endsWith(sep) ? this.projectRoot : `${this.projectRoot}${sep}`;
		if (candidate !== this.projectRoot && !candidate.startsWith(prefix)) throw new Error("sourceDir должен находиться внутри корня проекта");
		return candidate;
	}
	async pinImageDigest(draft, signal) {
		if (draft.imageDigest !== void 0) return draft;
		const digest = (await defaultCommandRunner.run("docker", [
			"image",
			"inspect",
			draft.image,
			"--format",
			"{{index .RepoDigests 0}}"
		], {
			timeout: this.config.pocTimeoutMs,
			...signal === void 0 ? {} : { signal }
		})).stdout.match(/@sha256:[a-f0-9]{64}/u)?.[0]?.slice(1);
		if (digest === void 0) throw new Error(`cannot pin Docker image digest for ${draft.image}; pull the allowlisted image locally or save an explicit digest`);
		const pinned = {
			...draft,
			imageDigest: digest,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		await this.store.saveDraft(pinned);
		return pinned;
	}
	assertEnabled() {
		if (!this.config.pocEnabled) throw new Error("Возможности PoC отключены в конфигурации плагина");
	}
};
function scaffold(request) {
	if (request.language === "python") return `#!/usr/bin/env python3\nimport json\nfrom pathlib import Path\n\n# Review this scaffold against the Evidence.v1 source -> sink -> guard chain.\nresult = {"status": "needs_review", "observedResult": "replace with an observed result", "artifacts": []}\nPath("/output/result.json").write_text(json.dumps(result), encoding="utf-8")\n`;
	return `#!/usr/bin/env bash\nset -euo pipefail\n# Review this scaffold against the Evidence.v1 source -> sink -> guard chain.\nprintf '%s' '{"status":"needs_review","observedResult":"replace with an observed result","artifacts":[]}' > /output/result.json\n`;
}
function stringsAt(value) {
	return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
function sha256(value) {
	return createHash("sha256").update(value).digest("hex");
}
function entrypoint(language) {
	return language === "python" ? ["python3", "/workspace/poc.py"] : ["bash", "/workspace/poc.sh"];
}
function splitImage(value) {
	const match = value.match(/^(.*)@(sha256:[a-f0-9]{64})$/u);
	return match === null ? { name: value } : {
		name: match[1],
		digest: match[2]
	};
}
// src/campaigns.ts
const ECOSYSTEM_ALIASES = {
	gem: "ruby",
	gems: "ruby",
	rubygem: "ruby",
	rubygems: "ruby",
	pip: "python",
	pypi: "python",
	cargo: "rust",
	crate: "rust",
	crates: "rust",
	"crates.io": "rust",
	golang: "go",
	gomod: "go",
	maven: "java",
	gradle: "java",
	composer: "php",
	packagist: "php",
	nuget: "csharp",
	dotnet: "csharp",
	"c#": "csharp",
	pub: "dart",
	hex: "elixir",
	cpan: "perl",
	cran: "r",
	luarocks: "lua",
	swiftpm: "swift",
	spm: "swift"
};
const CANONICAL_ECOSYSTEMS = new Set(CAMPAIGN_ECOSYSTEMS);
function normalizeCampaignEcosystem(value) {
	const normalized = value?.trim().toLowerCase() || "unknown";
	if (CANONICAL_ECOSYSTEMS.has(normalized)) return normalized;
	const alias = ECOSYSTEM_ALIASES[normalized];
	if (alias !== void 0) return alias;
	throw new Error(`target.ecosystem must be one of: ${CAMPAIGN_ECOSYSTEMS.join(", ")}`);
}
/** Keep malformed Campaign files local instead of failing the whole workbench dashboard. */
async function inspectCampaigns(projectRoot) {
	const dir = join(projectRoot, ".omv", "campaigns");
	if (!existsSync(dir)) return {
		campaigns: [],
		issues: []
	};
	const files = (await readdir(dir, { withFileTypes: true })).filter((entry) => entry.isFile() && isCampaignSource(entry.name)).map((entry) => entry.name).sort();
	const ids = [...new Set(files.map((file) => file.replace(/\.ya?ml$/i, "")))];
	const campaigns = [];
	const issues = [];
	for (const id of ids) {
		const path = campaignSourcePath(dir, id, files);
		try {
			const detail = await showCampaign(id, projectRoot);
			campaigns.push({
				id: detail.campaign.id,
				title: detail.campaign.title,
				status: detail.campaign.status,
				target: detail.campaign.target.name,
				version: detail.campaign.target.version,
				laneCount: detail.campaign.lanes.length,
				nextAction: detail.nextAction
			});
		} catch (error) {
			const analysis = await analyzeRepair(path, id);
			issues.push({
				id,
				path,
				message: errorMessage(error),
				repairable: analysis.repairable,
				changes: analysis.changes
			});
		}
	}
	campaigns.sort((left, right) => left.id.localeCompare(right.id));
	issues.sort((left, right) => left.id.localeCompare(right.id));
	return {
		campaigns,
		issues
	};
}
/** Repairs deterministic compatibility fields: registry aliases and the derived title. */
async function repairCampaign(id, projectRoot) {
	const dir = join(projectRoot, ".omv", "campaigns");
	const yamlPath = campaignSourcePath(dir, id, await campaignFiles(dir));
	if (!existsSync(yamlPath)) throw new Error(`${yamlPath} does not exist`);
	const raw = await readFile(yamlPath, "utf8");
	const document = parseDocument(raw);
	if (document.errors.length > 0) throw new Error(`${yamlPath}: Campaign YAML parse error: ${document.errors[0].message}`);
	const normalized = normalizeRepairableCampaign(document.toJS(), id);
	if (normalized.changes.length === 0) {
		const campaign = validateCampaign(normalized.value);
		return {
			id,
			yamlPath,
			runbookPath: join(dir, `${id}.md`),
			changes: [],
			campaign
		};
	}
	document.setIn(["target", "ecosystem"], normalized.value.target.ecosystem);
	document.set("title", normalized.value.title);
	document.set("updated_at", (/* @__PURE__ */ new Date()).toISOString());
	const campaign = validateCampaign(document.toJS());
	const temporaryPath = `${yamlPath}.repair-${process.pid}-${Date.now()}`;
	await writeFile(temporaryPath, document.toString({ lineWidth: 0 }), "utf8");
	await rename(temporaryPath, yamlPath);
	const runbookPath = join(dir, `${id}.md`);
	await syncRunbookMetadata(runbookPath, campaign);
	return {
		id,
		yamlPath,
		runbookPath,
		changes: normalized.changes,
		campaign
	};
}
async function analyzeRepair(path, id) {
	try {
		const normalized = normalizeRepairableCampaign(parse(await readFile(path, "utf8")), id);
		validateCampaign(normalized.value);
		return {
			repairable: normalized.changes.length > 0,
			changes: normalized.changes
		};
	} catch {
		return {
			repairable: false,
			changes: []
		};
	}
}
function normalizeRepairableCampaign(value, expectedId) {
	if (!isRecord$2(value) || !isRecord$2(value.target)) throw new Error("Campaign.v1 должен содержать структуру target");
	if (value.id !== expectedId) throw new Error(`id must match filename id ${expectedId}`);
	const changes = [];
	const target = { ...value.target };
	const currentEcosystem = text(target.ecosystem).toLowerCase();
	const ecosystem = normalizeCampaignEcosystem(currentEcosystem);
	if (currentEcosystem !== ecosystem) changes.push(`target.ecosystem: ${currentEcosystem || "unknown"} → ${ecosystem}`);
	target.ecosystem = ecosystem;
	const title = campaignTitle(text(target.name), text(target.version));
	if (value.title !== title) changes.push(`title: ${text(value.title)} → ${title}`);
	return {
		value: {
			...value,
			title,
			target
		},
		changes
	};
}
async function syncRunbookMetadata(path, campaign) {
	if (!existsSync(path)) return;
	const current = await readFile(path, "utf8");
	const nextActions = [
		"## Next actions",
		"",
		`1. Review the normalized campaign: \`omv campaign show ${campaign.id}\``,
		`2. Create candidate finding templates: \`omv campaign seed ${campaign.id}\``,
		"3. Audit each candidate separately before making any security claim.",
		""
	].join("\n");
	const next = current.replace(/^# .*$/m, `# ${escapeMarkdown(campaign.title)}`).replace(/^- Target: .*$/m, `- Target: ${escapeMarkdown(campaign.target.name)}`).replace(/^- Version: .*$/m, `- Version: ${escapeMarkdown(campaign.target.version)}`).replace(/^- Source: .*$/m, `- Source: ${escapeMarkdown(campaign.target.source)}`).replace(/^- Ecosystem: .*$/m, `- Ecosystem: ${campaign.target.ecosystem}`).replace(/## Next actions[\s\S]*$/m, nextActions);
	if (next !== current) await writeFile(path, next.endsWith("\n") ? next : `${next}\n`, "utf8");
}
async function campaignFiles(dir) {
	try {
		return (await readdir(dir, { withFileTypes: true })).filter((entry) => entry.isFile() && isCampaignSource(entry.name)).map((entry) => entry.name);
	} catch (error) {
		if (isNodeError(error) && error.code === "ENOENT") {
			await mkdir(dir, { recursive: true });
			return [];
		}
		throw error;
	}
}
function campaignSourcePath(dir, id, files) {
	const yaml = `${id}.yaml`;
	return join(dir, files.includes(yaml) ? yaml : `${id}.yml`);
}
function isCampaignSource(name) {
	return /\.ya?ml$/i.test(name) && !/\.surfaces\.ya?ml$/i.test(name);
}
function campaignTitle(name, version) {
	return `${name}${version === "unknown" ? "" : ` ${version}`} research campaign`;
}
function escapeMarkdown(value) {
	return Array.from(value, (character) => {
		if (character === "\\") return "\\\\";
		return [
			"`",
			"*",
			"_",
			"[",
			"]",
			"<",
			">",
			"#",
			"|"
		].includes(character) ? `\\${character}` : character;
	}).join("");
}
function text(value) {
	return typeof value === "string" ? value.trim() : "";
}
function isRecord$2(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isNodeError(error) {
	return error instanceof Error && "code" in error;
}
function errorMessage(error) {
	return error instanceof Error ? error.message : String(error);
}
// src/dedup.ts
const STORE_VERSION = 1;
const VULNERABILITY_OVERLAP_REASON = "Совпадение терминов типа уязвимости";
/**
* Local-first duplicate triage. External advisory adapters can add matches later.
* A match alone is only "review this neighbour"; `possible_duplicate` additionally
* requires the vulnerability class to overlap, so same-package campaigns with
* distinct vulnerability lanes do not flag each other as duplicates.
*/
var DedupService = class {
	projectRoot;
	writeTail = Promise.resolve();
	constructor(projectRoot) {
		this.projectRoot = projectRoot;
	}
	async list(findingId) {
		const store = await this.readStore();
		return Object.values(store.summaries).filter((item) => findingId === void 0 || item.findingId === findingId).sort((left, right) => (right.scannedAt ?? "").localeCompare(left.scannedAt ?? ""));
	}
	async get(findingId) {
		const id = required$1(findingId, "finding id");
		return (await this.readStore()).summaries[id] ?? emptySummary(id);
	}
	async scan(findingId, candidates, advisoryTitles = []) {
		return this.serial(async () => {
			const id = required$1(findingId, "finding id");
			const target = candidates.find((candidate) => candidate.id === id);
			if (target === void 0) throw new Error(`finding not found for dedup scan: ${id}`);
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const matches = [];
			for (const candidate of candidates) {
				if (candidate.id === target.id) continue;
				const comparison = compare(target, candidate);
				if (comparison.score < 45) continue;
				matches.push({
					id: `dedup-${randomUUID().slice(0, 12)}`,
					findingId: target.id,
					targetFindingId: candidate.id,
					source: "local",
					title: `${candidate.id} · ${candidate.package}`,
					score: comparison.score,
					reasons: comparison.reasons,
					status: "open",
					createdAt: now
				});
			}
			for (const title of advisoryTitles) {
				const normalized = title.trim();
				if (normalized === "") continue;
				const score = tokenOverlap(`${target.package} ${target.vulnerability}`, normalized) * 100;
				if (score < 45) continue;
				matches.push({
					id: `dedup-${randomUUID().slice(0, 12)}`,
					findingId: target.id,
					source: "advisory",
					title: normalized,
					score: Math.round(score),
					reasons: ["В заголовке Radar или бюллетеня есть слова, совпадающие с пакетом или типом уязвимости"],
					status: "open",
					createdAt: now
				});
			}
			const summary = {
				findingId: target.id,
				status: matches.some((match) => match.score >= 65 && (match.source !== "local" || match.reasons.includes(VULNERABILITY_OVERLAP_REASON))) ? "possible_duplicate" : "clear",
				scannedAt: now,
				matches: matches.sort((left, right) => right.score - left.score),
				sources: ["local", ...matches.some((match) => match.source === "advisory") ? ["advisory"] : []],
				nextAction: matches.length === 0 ? "Можно записать dedup clean и продолжить проверку других признаков" : "Оцени каждый похожий результат и выбери duplicate или dismiss"
			};
			const store = await this.readStore();
			store.summaries[target.id] = summary;
			store.updatedAt = now;
			await this.writeStore(store);
			return summary;
		});
	}
	async update(findingId, status, matchId) {
		return this.serial(async () => {
			const id = required$1(findingId, "finding id");
			const store = await this.readStore();
			const summary = store.summaries[id] ?? emptySummary(id);
			summary.status = status;
			if (matchId !== void 0) {
				const match = summary.matches.find((item) => item.id === matchId);
				if (match === void 0) throw new Error(`dedup match not found: ${matchId}`);
				match.status = status === "duplicate" ? "confirmed" : status === "clear" ? "dismissed" : "open";
			}
			summary.nextAction = status === "duplicate" ? "Запиши связь дублирования и объедини контекст исследований" : status === "clear" ? "Проверка дублей завершена; можно уточнять область воздействия и готовить отчёт" : "Продолжи проверку бюллетеней, баз экосистем и соседних находок";
			store.summaries[id] = summary;
			store.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
			await this.writeStore(store);
			return summary;
		});
	}
	async readStore() {
		try {
			const value = JSON.parse(await readFile(this.storePath(), "utf8"));
			if (!isStore(value)) throw new Error(`invalid dedup store: ${this.storePath()}`);
			return value;
		} catch (error) {
			if (!isNotFound(error)) throw error;
			return {
				schemaVersion: STORE_VERSION,
				updatedAt: (/* @__PURE__ */ new Date(0)).toISOString(),
				summaries: {}
			};
		}
	}
	async writeStore(store) {
		const path = this.storePath();
		await mkdir(dirname(path), { recursive: true });
		const temporary = `${path}.${randomUUID()}.tmp`;
		await writeFile(temporary, `${JSON.stringify(store, null, 2)}\n`, "utf8");
		await rename(temporary, path);
	}
	storePath() {
		return join(this.projectRoot, ".omv", ".dsh", "dedup.json");
	}
	async serial(operation) {
		const run = this.writeTail.then(operation, operation);
		this.writeTail = run.then(() => void 0, () => void 0);
		return run;
	}
};
function emptySummary(findingId) {
	return {
		findingId,
		status: "unknown",
		matches: [],
		sources: [],
		nextAction: "Запусти поиск дублей среди локальных находок и общедоступных сведений"
	};
}
function compare(left, right) {
	let score = 0;
	const reasons = [];
	if (left.package.trim().toLowerCase() === right.package.trim().toLowerCase()) {
		score += 55;
		reasons.push("Одинаковое название пакета");
	} else if (tokenOverlap(left.package, right.package) > .4) {
		score += 25;
		reasons.push("Похожие слова в названиях пакетов");
	}
	if (left.ecosystem.trim().toLowerCase() === right.ecosystem.trim().toLowerCase()) {
		score += 15;
		reasons.push("Одна экосистема");
	}
	const overlap = tokenOverlap(left.vulnerability, right.vulnerability);
	if (overlap > .2) {
		score += Math.round(overlap * 25);
		reasons.push(VULNERABILITY_OVERLAP_REASON);
	}
	return {
		score: Math.min(100, score),
		reasons
	};
}
function tokenOverlap(left, right) {
	const leftTokens = new Set(tokens(left));
	const rightTokens = new Set(tokens(right));
	if (leftTokens.size === 0 || rightTokens.size === 0) return 0;
	let shared = 0;
	for (const token of leftTokens) if (rightTokens.has(token)) shared += 1;
	return shared / Math.max(leftTokens.size, rightTokens.size);
}
function tokens(value) {
	return value.toLowerCase().split(/[^a-z0-9一-鿿]+/u).filter((token) => token.length >= 2);
}
function required$1(value, label) {
	const normalized = value.trim();
	if (normalized === "") throw new Error(`${label} is required`);
	return normalized;
}
function isStore(value) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
	const candidate = value;
	return candidate.schemaVersion === STORE_VERSION && typeof candidate.updatedAt === "string" && candidate.summaries !== void 0 && typeof candidate.summaries === "object";
}
function isNotFound(error) {
	return error instanceof Error && "code" in error && error.code === "ENOENT";
}
// src/reporting.ts
/**
* Read-only report artifact status for the quality center. Draft generation,
* provenance refresh and disclosure timelines belong to the omv-report /
* omv-disclose Agent workflows, which write the same .omv/reports files this
* service inspects.
*/
var ReportingService = class {
	projectRoot;
	constructor(projectRoot) {
		this.projectRoot = projectRoot;
	}
	async inspect(findingId) {
		const id = required(findingId, "finding id");
		try {
			const result = await checkReportArtifacts(id, this.projectRoot);
			const status = result.errors.length > 0 ? result.reportArtifactPaths.length === 0 ? "missing" : "stale" : result.reportArtifactPaths.length === 0 ? "missing" : result.provenanceFresh === false ? "stale" : "ready";
			return {
				findingId: id,
				status,
				reportsDir: result.reportsDir,
				artifacts: result.reportArtifactPaths,
				missing: [...result.errors, ...result.warnings],
				...result.provenanceFresh === null || result.provenanceFresh === void 0 ? {} : { provenanceFresh: result.provenanceFresh },
				nextAction: status === "missing" ? "Подготовь материалы отчёта через процесс omv-report" : status === "stale" ? "Обнови источники отчёта и provenance" : "Материалы отчёта готовы"
			};
		} catch (error) {
			return {
				findingId: id,
				status: "missing",
				reportsDir: join(this.projectRoot, ".omv", "reports", id),
				artifacts: [],
				missing: [error instanceof Error ? error.message : String(error)],
				nextAction: "Подготовь материалы отчёта через процесс omv-report"
			};
		}
	}
};
function required(value, label) {
	const normalized = value.trim();
	if (normalized === "") throw new Error(`${label} is required`);
	return normalized;
}
// src/workbench/quality.ts
async function readFindingWorkflowsSafe(projectRoot, findingsDir) {
	const entries = await readdir(findingsDir, { withFileTypes: true });
	const findings = [];
	const issues = [];
	const files = entries.filter((entry) => entry.isFile() && (entry.name.endsWith(".yaml") || entry.name.endsWith(".yml"))).map((entry) => entry.name).sort();
	for (const file of files) {
		const path = join(findingsDir, file);
		const id = basename(file, extname(file));
		try {
			const detail = await showFinding(id, projectRoot);
			const evidence = await readFile(detail.path, "utf8").then((raw) => parse(raw)).then((value) => isRecord$1(value) ? value : {});
			const { archived: _archived, validation: _validation, ...summary } = detail;
			const assessment = assessEvidence(detail, evidence, []);
			findings.push({
				...summary,
				stage: deriveAuditStage(detail, evidence),
				assessment
			});
		} catch (error) {
			issues.push({
				id,
				kind: "finding",
				path,
				message: error instanceof Error ? error.message : String(error),
				recoverable: false
			});
		}
	}
	findings.sort((left, right) => evidenceQueueRank(left) - evidenceQueueRank(right) || right.assessment.openQuestions.length - left.assessment.openQuestions.length || left.id.localeCompare(right.id));
	return {
		findings,
		issues
	};
}
function evidenceQueueRank(finding) {
	if (finding.stage === "report_ready") return 0;
	if (finding.assessment.maturity === "contested") return 1;
	if (finding.assessment.maturity === "verified") return 2;
	if (finding.assessment.maturity === "supported") return 3;
	if (finding.assessment.maturity === "developing") return 4;
	return 5;
}
function reportQueueItem(pack, finding) {
	return {
		...pack,
		stage: finding.stage,
		maturity: finding.assessment.maturity,
		package: finding.package
	};
}
function reportQueueRank(item) {
	return item.status === "missing" ? 0 : item.status === "stale" ? 1 : item.stage === "report_ready" ? 2 : 3;
}
function buildWorkspaceQuality(input) {
	const issues = [];
	for (const issue of input.workspaceIssues) issues.push({
		id: `workspace-${issue.id}`,
		severity: "blocker",
		kind: "workspace",
		title: `${issue.id} — файл не загружен`,
		detail: issue.message,
		path: issue.path,
		nextAction: "Исправь YAML и обнови рабочую область"
	});
	for (const issue of input.campaignIssues) issues.push({
		id: `campaign-${issue.id}`,
		severity: issue.repairable ? "warning" : "blocker",
		kind: "campaign",
		title: `${issue.id} — конфигурация плана аудита требует действий`,
		detail: issue.message,
		path: issue.path,
		nextAction: issue.repairable ? `Выполни /omv-campaign-repair ${issue.id}` : "Проверь YAML плана аудита и поля экосистемы"
	});
	for (const finding of input.findings) {
		if (finding.assessment.openQuestions.length > 0) issues.push({
			id: `finding-${finding.id}-questions`,
			severity: "warning",
			kind: "finding",
			findingId: finding.id,
			title: `${finding.id} — есть нерешённые вопросы`,
			detail: finding.assessment.openQuestions.slice(0, 2).join("；"),
			nextAction: finding.assessment.suggestedActions[0] ?? `/omv-audit ${finding.id}`
		});
		const dedup = input.dedup.get(finding.id);
		if (dedup === void 0 || dedup.status === "unknown") issues.push({
			id: `dedup-${finding.id}`,
			severity: "info",
			kind: "dedup",
			findingId: finding.id,
			title: `${finding.id} — проверка дублей не завершена`,
			detail: "Для локальной находки ещё нет заключения о дублировании.",
			nextAction: `/omv-dedup ${finding.id}`
		});
		else if (dedup.status === "possible_duplicate") issues.push({
			id: `dedup-${finding.id}-possible`,
			severity: "warning",
			kind: "dedup",
			findingId: finding.id,
			title: `${finding.id} — есть похожие исследования`,
			detail: `${dedup.matches.length} похожих записей ожидают решения человека.`,
			nextAction: `/omv-dedup ${finding.id}`
		});
	}
	for (const report of input.reports) if (report.status === "missing" || report.status === "stale") issues.push({
		id: `report-${report.findingId}`,
		severity: report.stage === "report_ready" ? "blocker" : "warning",
		kind: "report",
		findingId: report.findingId,
		title: `${report.findingId} — пакет отчёта${report.status === "missing" ? "Отсутствует" : "Требует обновления"}`,
		detail: report.missing[0] ?? report.nextAction,
		path: report.reportsDir,
		nextAction: `Создай через процесс omv-report каталог .omv/reports/${report.findingId}/`
	});
	const blockers = issues.filter((issue) => issue.severity === "blocker").length;
	const warnings = issues.filter((issue) => issue.severity === "warning").length;
	const infos = issues.filter((issue) => issue.severity === "info").length;
	const queues = {
		needsEvidence: input.findings.filter((finding) => finding.assessment.maturity === "unmapped" || finding.assessment.maturity === "developing").length,
		needsReproduction: input.findings.filter((finding) => finding.assessment.dimensions.some((dimension) => dimension.id === "runtime_verification" && (dimension.state === "missing" || dimension.state === "partial"))).length,
		needsDedup: input.findings.filter((finding) => {
			const value = input.dedup.get(finding.id);
			return value === void 0 || value.status === "unknown" || value.status === "possible_duplicate";
		}).length,
		reportReady: input.reports.filter((report) => report.status === "ready" && report.stage === "report_ready").length
	};
	const score = Math.max(0, Math.min(100, Math.round(100 - blockers * 12 - warnings * 4 - infos)));
	return {
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		score,
		blockers,
		warnings,
		infos,
		issues: issues.slice(0, 120),
		queues
	};
}
function isRecord$1(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
// src/surfaces.ts
let cached;
function loadSurfaces() {
	cached ??= (async () => {
		const require = createRequire(import.meta.url);
		const root = dirname(require.resolve("oh-my-vul/package.json"));
		return import(pathToFileURL(join(root, "dist/cli/surfaces.js")).href);
	})();
	return cached;
}
/** Propose AttackSurfaceList.v1 cards from the shared oh-my-vul catalog. */
async function proposeCampaignSurfaces(id, projectRoot, force = false) {
	return projectSurfaces(await (await loadSurfaces()).proposeSurfaces(id, projectRoot, { force }));
}
/** Read the campaign sidecar. A missing file is an empty projection, not an error. */
async function showCampaignSurfaces(id, projectRoot) {
	try {
		return projectSurfaces(await (await loadSurfaces()).showSurfaces(id, projectRoot));
	} catch (error) {
		return {
			path: `.omv/campaigns/${id}.surfaces.yaml`,
			cards: [],
			proposed: 0,
			selected: 0,
			skipped: 0,
			nextAction: `Исправить ${id} и заново предложить поверхность атаки по AttackSurfaceList YAML`,
			issue: error instanceof Error ? error.message : String(error)
		};
	}
}
/**
* Incrementally mark cards selected or skipped. Unlike CLI `select --cards`,
* unspecified cards keep their current status so a hypothesis can die cheaply.
*/
async function updateCampaignSurfaceCards(id, projectRoot, updates) {
	if (updates.length === 0) throw new Error("Требуется хотя бы один идентификатор карты поверхности");
	const current = await (await loadSurfaces()).showSurfaces(id, projectRoot);
	if (current.list === null) throw new Error(`${current.path} does not exist; propose attack-surface cards first`);
	const known = new Set(current.list.cards.map((card) => card.id));
	for (const update of updates) if (!known.has(update.cardId)) throw new Error(`unknown surface card id: ${update.cardId}`);
	const byId = new Map(updates.map((update) => [update.cardId, update.status]));
	const next = {
		...current.list,
		updated_at: (/* @__PURE__ */ new Date()).toISOString(),
		cards: current.list.cards.map((card) => {
			const status = byId.get(card.id);
			return status === void 0 ? card : {
				...card,
				status
			};
		})
	};
	await writeFile(current.path, stringify(next), "utf8");
	const selected = next.cards.filter((card) => card.status === "selected").map((card) => card.id);
	return projectSurfaces({
		path: current.path,
		list: next,
		nextAction: selected.length > 0 ? `omv campaign seed ${id}` : `omv campaign surfaces select ${id} --cards <id,id>`
	});
}
/** Runner/seed lanes come from selected cards once a surfaces file exists. */
function runLanesFromSurfaces(lanes, surfaces) {
	if (surfaces.cards.length === 0) return [...lanes];
	if (surfaces.selected === 0) throw new Error(`${surfaces.path || "AttackSurfaceList"} has no selected cards; select at least one attack-surface card first`);
	return surfaces.cards.filter((card) => card.status === "selected").map((card) => ({
		id: card.id,
		title: card.title,
		vulnerability_class: card.vulnerabilityClass,
		finding_id: card.findingId
	}));
}
function projectSurfaces(input) {
	const cards = (input.list?.cards ?? []).map(toCardView);
	return {
		path: input.path,
		...input.list === void 0 || input.list === null ? {} : {
			generatedAt: input.list.generated_at,
			updatedAt: input.list.updated_at,
			catalogVersion: input.list.catalog_version
		},
		cards,
		proposed: cards.filter((card) => card.status === "proposed").length,
		selected: cards.filter((card) => card.status === "selected").length,
		skipped: cards.filter((card) => card.status === "skipped").length,
		nextAction: input.nextAction
	};
}
function toCardView(card) {
	return {
		id: card.id,
		title: card.title,
		pack: card.pack,
		vulnerabilityClass: card.vulnerability_class,
		status: card.status,
		findingId: card.finding_id,
		sources: card.sources,
		sinks: card.sinks,
		guards: card.guards,
		discoveryHints: card.discovery_hints,
		falsePositiveChecks: card.false_positive_checks,
		why: card.why
	};
}
// src/workbench.ts
async function deleteFinding(...args) {
	const remove = omvApi.deleteFinding;
	if (typeof remove !== "function") throw new Error("Безвозвратное удаление недоступно в oh-my-vul 1.1.0; используй архивирование.");
	return Reflect.apply(remove, void 0, args);
}
const MUTATIONS = /* @__PURE__ */ new Set([
	"workspace.init",
	"finding.create",
	"finding.repro",
	"finding.promote",
	"finding.archive",
	"finding.restore",
	"finding.delete",
	"campaign.create",
	"campaign.repair",
	"campaign.seed",
	"campaign.surfaces.propose",
	"campaign.surfaces.select",
	"campaign.surfaces.skip",
	"campaign.start",
	"campaign.run.create",
	"campaign.run.claim",
	"campaign.run.bind",
	"campaign.run.lane.update",
	"campaign.run.control",
	"campaign.run.reconcile",
	"repro.run.start",
	"repro.run.finish",
	"session.link",
	"session.unlink",
	"workflow.start",
	"dedup.scan",
	"dedup.update",
	"poc.generate",
	"poc.validate",
	"poc.draft.save",
	"poc.draft.approve",
	"poc.run.start",
	"poc.evidence.adopt"
]);
const DASHBOARD_CACHE_TTL_MS = 1e3;
var OmvWorkbench = class OmvWorkbench {
	config;
	workflow;
	runner;
	reproduction;
	poc;
	dedup;
	reporting;
	watcher;
	/** Short-lived dashboard snapshot shared by polling, search and quality reads. Invalidated by every action. */
	dashboardCache;
	constructor(config) {
		this.config = {
			...config,
			projectRoot: resolve(config.projectRoot)
		};
		this.workflow = new OmvWorkflowService(this.config.projectRoot);
		this.runner = new CampaignRunner(this.config.projectRoot);
		this.reproduction = new ReproductionService(this.config.projectRoot);
		this.poc = new PocService(this.config);
		this.dedup = new DedupService(this.config.projectRoot);
		this.reporting = new ReportingService(this.config.projectRoot);
		this.watcher = new OmvWorkspaceWatcher(this.config.projectRoot, this.config.watchDebounceMs);
	}
	/**
	* Bind the same OMV capability set to another DSH workspace. This keeps
	* tools and commands session-native instead of pinning every conversation
	* to the plugin's configured landing workspace.
	*/
	scoped(projectRoot) {
		const root = resolve(projectRoot);
		if (root === this.config.projectRoot) return this;
		return new OmvWorkbench({
			...this.config,
			projectRoot: root
		});
	}
	/**
	* Dashboard snapshot with a short shared cache. Search, quality and polling
	* requests within the TTL reuse one build; every action() invalidates it.
	*/
	async dashboard() {
		const cached = this.dashboardCache;
		if (cached !== void 0 && Date.now() < cached.expiresAt) return cached.promise;
		const promise = this.buildDashboard();
		this.dashboardCache = {
			promise,
			expiresAt: Date.now() + DASHBOARD_CACHE_TTL_MS
		};
		promise.catch(() => {
			if (this.dashboardCache?.promise === promise) this.dashboardCache = void 0;
		});
		return promise;
	}
	async buildDashboard() {
		const workspace = await workspaceStatus(this.config.projectRoot);
		const [{ findings: rawFindings, issues: workspaceIssues }, archived, campaignInspection, rawActivity, links, campaignRuns, reproductionRuns, pocDrafts, pocRuns] = await Promise.all([
			readFindingWorkflowsSafe(this.config.projectRoot, workspace.findingsDir),
			listArchivedFindings(this.config.projectRoot),
			inspectCampaigns(this.config.projectRoot),
			readWorkspaceActivity(this.config.projectRoot),
			this.workflow.links(),
			this.runner.list(),
			this.reproduction.list(),
			this.poc.listDrafts(),
			this.poc.listRuns()
		]);
		const { campaigns, issues: campaignIssues } = campaignInspection;
		const findings = await Promise.all(rawFindings.map(async (finding) => {
			const [evidence, validation, review, fileInfo] = await Promise.all([
				this.readEvidence(finding.path),
				validateFinding(finding.id, this.config.projectRoot),
				reviewFinding(finding.id, this.config.projectRoot),
				stat(finding.path).catch(() => void 0)
			]);
			const sessionLink = links[finding.id];
			const findingReproductions = reproductionRuns.filter((run) => run.findingId === finding.id);
			const detail = {
				...finding,
				archived: false,
				validation
			};
			const assessment = assessEvidence(detail, evidence, findingReproductions);
			return {
				...finding,
				stage: deriveAuditStage(detail, evidence, review),
				assessment,
				...fileInfo === void 0 ? {} : { updatedAt: fileInfo.mtime.toISOString() },
				...sessionLink === void 0 ? {} : { sessionLink }
			};
		}));
		findings.sort((left, right) => evidenceQueueRank(left) - evidenceQueueRank(right) || right.assessment.openQuestions.length - left.assessment.openQuestions.length || left.id.localeCompare(right.id));
		const totalReadiness = findings.reduce((sum, finding) => sum + finding.readiness, 0);
		const averageReadiness = findings.length === 0 ? 0 : Math.round(totalReadiness / findings.length);
		const activity = rawActivity.slice(-this.config.activityLimit).reverse();
		const dedupSummaries = await this.dedup.list();
		const dedupByFinding = new Map(dedupSummaries.map((summary) => [summary.findingId, summary]));
		const quality = buildWorkspaceQuality({
			workspaceIssues,
			campaignIssues,
			findings,
			reports: (await Promise.all(findings.map(async (finding) => reportQueueItem(await this.reporting.inspect(finding.id), finding)))).sort((left, right) => reportQueueRank(left) - reportQueueRank(right)),
			dedup: dedupByFinding
		});
		return {
			protocolVersion: "2",
			generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			workspace,
			config: this.config,
			metrics: {
				active: findings.length,
				confirmed: findings.filter((finding) => finding.status === "confirmed").length,
				candidates: findings.filter((finding) => finding.status === "candidate").length,
				blocked: findings.filter((finding) => finding.status === "blocked").length,
				archived: archived.length,
				campaigns: campaigns.length,
				averageReadiness,
				reportReady: findings.filter((finding) => finding.stage === "report_ready").length,
				investigating: findings.filter((finding) => finding.stage === "investigating").length,
				reproducing: findings.filter((finding) => finding.stage === "reproducing").length,
				disclosed: findings.filter((finding) => finding.stage === "disclosed").length,
				activeRuns: campaignRuns.filter((run) => run.status === "queued" || run.status === "running" || run.status === "paused").length,
				activeReproductions: reproductionRuns.filter((run) => run.status === "running").length,
				evidenceMaturity: {
					unmapped: findings.filter((finding) => finding.assessment.maturity === "unmapped").length,
					developing: findings.filter((finding) => finding.assessment.maturity === "developing").length,
					supported: findings.filter((finding) => finding.assessment.maturity === "supported").length,
					verified: findings.filter((finding) => finding.assessment.maturity === "verified").length,
					contested: findings.filter((finding) => finding.assessment.maturity === "contested").length
				}
			},
			findings,
			workspaceIssues,
			archived,
			campaigns,
			campaignIssues,
			activity,
			quality,
			reproductionRuns,
			pocDrafts,
			pocRuns
		};
	}
	async health() {
		const checks = await Promise.all([
			this.healthCheck("workspace", () => workspaceStatus(this.config.projectRoot)),
			this.healthCheck("findings", async () => {
				await listFindingWorkflow(this.config.projectRoot);
				await listArchivedFindings(this.config.projectRoot);
			}),
			this.healthCheck("campaigns", async () => {
				const inspection = await inspectCampaigns(this.config.projectRoot);
				if (inspection.issues.length > 0) throw new Error(`${inspection.issues.length} — конфигурация плана аудита требует действий`);
			}),
			this.healthCheck("workflow", () => this.workflow.links()),
			this.healthCheck("runner", () => this.runner.list()),
			this.healthCheck("reproduction", () => this.reproduction.list())
		]);
		return {
			protocolVersion: "2",
			generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			status: checks.some((check) => check.status === "degraded") ? "degraded" : "ok",
			projectRoot: this.config.projectRoot,
			checks
		};
	}
	async finding(id, archived = false) {
		const detail = await showFinding(id, this.config.projectRoot, { archived });
		const raw = await readFile(detail.path, "utf8");
		const parsed = parse(raw);
		const evidence = isRecord(parsed) ? parsed : {};
		const [links, history, reproductionRuns, pocDrafts, pocRuns, dedup] = await Promise.all([
			this.workflow.links(),
			this.workflow.history(detail.id),
			this.reproduction.list(detail.id),
			this.poc.listDrafts(detail.id),
			this.poc.listRuns(detail.id),
			this.dedup.get(detail.id)
		]);
		const sessionLink = links[detail.id];
		const lastDiff = history.find((event) => event.diff !== void 0)?.diff;
		if (archived) {
			const assessment = assessEvidence(detail, evidence, reproductionRuns);
			const qualityGate = evaluateQualityGate(detail, evidence, reproductionRuns);
			return {
				protocolVersion: "2",
				generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
				detail,
				evidence,
				rawEvidence: raw,
				stage: "archived",
				history,
				reproductionRuns,
				pocDrafts,
				pocRuns,
				assessment,
				qualityGate,
				graph: buildEvidenceGraph({
					detail,
					evidence,
					rawEvidence: raw,
					history,
					reproductionRuns
				}),
				dedup,
				...sessionLink === void 0 ? {} : { sessionLink },
				...lastDiff === void 0 ? {} : { lastDiff }
			};
		}
		const [doctor, review] = await Promise.all([doctorFinding(id, this.config.projectRoot), reviewFinding(id, this.config.projectRoot)]);
		const assessment = assessEvidence(detail, evidence, reproductionRuns);
		const qualityGate = evaluateQualityGate(detail, evidence, reproductionRuns);
		return {
			protocolVersion: "2",
			generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			detail,
			evidence,
			rawEvidence: raw,
			stage: deriveAuditStage(detail, evidence, review),
			history,
			doctor,
			review,
			reproductionRuns,
			pocDrafts,
			pocRuns,
			assessment,
			qualityGate,
			graph: buildEvidenceGraph({
				detail,
				evidence,
				rawEvidence: raw,
				history,
				reproductionRuns
			}),
			dedup,
			...sessionLink === void 0 ? {} : { sessionLink },
			...lastDiff === void 0 ? {} : { lastDiff }
		};
	}
	async campaign(id) {
		const detail = await showCampaign(id, this.config.projectRoot);
		const subject = `campaign:${detail.campaign.id}`;
		const [links, history, runs, surfaces] = await Promise.all([
			this.workflow.links(),
			this.workflow.history(subject),
			this.runner.list(detail.campaign.id),
			showCampaignSurfaces(detail.campaign.id, this.config.projectRoot)
		]);
		const sessionLink = links[subject];
		return {
			...detail,
			protocolVersion: "2",
			generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			history,
			runs,
			surfaces,
			...sessionLink === void 0 ? {} : { sessionLink }
		};
	}
	async campaignRun(id) {
		return this.runner.get(id);
	}
	async quality() {
		return (await this.dashboard()).quality;
	}
	async dedupSummary(findingId) {
		await showFinding(findingId, this.config.projectRoot);
		return this.dedup.get(findingId);
	}
	async search(query) {
		const needle = query.trim().toLowerCase();
		if (needle === "") return [];
		const dashboard = await this.dashboard();
		const hits = [];
		for (const finding of dashboard.findings) {
			const rawEvidence = await readFile(finding.path, "utf8");
			const haystack = `${finding.id} ${finding.package} ${finding.ecosystem} ${finding.vulnerability} ${finding.nextAction} ${rawEvidence}`.toLowerCase();
			if (haystack.includes(needle)) hits.push({
				kind: "finding",
				id: finding.id,
				title: `${finding.id} · ${finding.package}`,
				description: `${finding.stage} · ${finding.vulnerability}`,
				score: searchScore(haystack, needle)
			});
		}
		for (const finding of dashboard.archived) {
			const haystack = `${finding.id} ${finding.package} ${finding.ecosystem} ${finding.vulnerability} ${finding.archiveReason}`.toLowerCase();
			if (haystack.includes(needle)) hits.push({
				kind: "finding",
				id: finding.id,
				title: `${finding.id} · ${finding.package}`,
				description: `archived · ${finding.archiveReason}`,
				score: searchScore(haystack, needle),
				archived: true
			});
		}
		for (const campaign of dashboard.campaigns) {
			const haystack = `${campaign.id} ${campaign.title} ${campaign.target} ${campaign.version} ${campaign.nextAction}`.toLowerCase();
			if (haystack.includes(needle)) hits.push({
				kind: "campaign",
				id: campaign.id,
				title: campaign.title,
				description: `${campaign.target} · ${campaign.laneCount} lanes`,
				score: searchScore(haystack, needle)
			});
		}
		const findingTargets = new Map([...dashboard.findings.map((finding) => [finding.id, { archived: false }]), ...dashboard.archived.map((finding) => [finding.id, { archived: true }])]);
		const campaignTargets = new Set(dashboard.campaigns.map((campaign) => campaign.id));
		dashboard.activity.forEach((entry, index) => {
			const haystack = JSON.stringify(entry).toLowerCase();
			if (!haystack.includes(needle)) return;
			const targetId = entry.id;
			const findingTarget = targetId === void 0 ? void 0 : findingTargets.get(targetId);
			const targetKind = findingTarget !== void 0 ? "finding" : targetId !== void 0 && campaignTargets.has(targetId) ? "campaign" : void 0;
			hits.push({
				kind: "activity",
				id: `${entry.timestamp}-${index}`,
				title: entry.action,
				description: `${targetId ?? "Рабочая область"} · ${entry.timestamp}`,
				score: searchScore(haystack, needle),
				timestamp: entry.timestamp,
				...targetKind === void 0 || targetId === void 0 ? {} : {
					targetKind,
					targetId
				},
				...findingTarget === void 0 ? {} : { archived: findingTarget.archived }
			});
		});
		return hits.sort((left, right) => right.score - left.score || left.title.localeCompare(right.title)).slice(0, 80);
	}
	async exportWorkspace() {
		const dashboard = await this.dashboard();
		const [findings, campaigns, campaignRuns, reproductionRuns] = await Promise.all([
			Promise.all([...dashboard.findings.map((finding) => this.finding(finding.id)), ...dashboard.archived.map((finding) => this.finding(finding.id, true))]),
			Promise.all(dashboard.campaigns.map((campaign) => this.campaign(campaign.id))),
			this.runner.list(),
			this.reproduction.list()
		]);
		return {
			protocolVersion: "2",
			exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
			projectRoot: this.config.projectRoot,
			dashboard,
			findings,
			campaigns,
			campaignRuns,
			reproductionRuns
		};
	}
	async action(request, options = {}) {
		if (!request.action) throw new Error("action is required");
		if (MUTATIONS.has(request.action) && !this.config.allowMutations) throw new Error("Изменения рабочей папки отключены в конфигурации плагина");
		this.dashboardCache = void 0;
		const before = request.id === void 0 ? void 0 : await this.tryReadFinding(request.id);
		let result;
		switch (request.action) {
			case "workspace.init": return initWorkspace(this.config.projectRoot, { gitignore: true });
			case "finding.create": {
				const id = requiredString(request.id, "id");
				const seed = completeSeed(request);
				result = await createFindingTemplate(id, {
					projectRoot: this.config.projectRoot,
					...seed === void 0 ? {} : { seed }
				});
				break;
			}
			case "finding.validate": return validateFinding(requiredString(request.id, "id"), this.config.projectRoot);
			case "finding.doctor": return doctorFinding(requiredString(request.id, "id"), this.config.projectRoot);
			case "workspace.quality": return this.quality();
			case "finding.dedup": return this.dedupSummary(requiredString(request.id, "id"));
			case "poc.run.inspect": return this.poc.inspectRun(requiredString(request.runId, "runId"));
			case "poc.generate": {
				const id = requiredString(request.id, "id");
				const payload = await this.finding(id);
				result = await this.poc.generate(payload.detail, payload.evidence);
				break;
			}
			case "poc.validate":
				result = await this.poc.validateDraft(requiredString(request.draftId ?? request.id, "draftId"));
				break;
			case "poc.draft.save": {
				const findingId = requiredString(request.id ?? request.findingId, "id");
				result = await this.poc.saveDraft({
					findingId,
					...request.draftId === void 0 ? {} : { draftId: request.draftId },
					script: requiredString(request.script, "script"),
					...request.language === void 0 ? {} : { language: request.language },
					...request.templateId === void 0 ? {} : { templateId: request.templateId },
					...request.image === void 0 ? {} : { image: request.image },
					...request.requiresNetwork === void 0 ? {} : { requiresNetwork: request.requiresNetwork }
				});
				break;
			}
			case "poc.draft.approve": {
				const draftId = requiredString(request.draftId ?? request.id, "draftId");
				result = await this.poc.approveDraft(draftId, request.approvedBy);
				break;
			}
			case "poc.run.start":
				result = await this.poc.runDraft(requiredString(request.draftId, "draftId"), {
					...options.signal === void 0 ? {} : { signal: options.signal },
					...request.sourceDir === void 0 ? {} : { sourceDir: request.sourceDir }
				});
				break;
			case "poc.evidence.adopt":
				result = (await this.poc.adoptEvidence(requiredString(request.runId, "runId"))).run;
				break;
			case "finding.repro":
				result = await initReproArtifacts(requiredString(request.id, "id"), this.config.projectRoot);
				break;
			case "finding.promote":
				result = await promoteFinding(requiredString(request.id, "id"), requiredStatus(request.status), this.config.projectRoot);
				break;
			case "finding.archive":
				result = await archiveFinding(requiredString(request.id, "id"), requiredString(request.reason, "reason"), this.config.projectRoot);
				break;
			case "finding.restore":
				result = await restoreFinding(requiredString(request.id, "id"), this.config.projectRoot);
				break;
			case "finding.delete":
				result = await deleteFinding(requiredString(request.id, "id"), this.config.projectRoot, { confirmId: requiredString(request.confirmId, "confirmId") });
				break;
			case "campaign.create": return initCampaign({
				...request.id === void 0 ? {} : { id: request.id },
				target: requiredString(request.target, "target"),
				version: request.version ?? "unknown",
				source: request.source ?? "unknown",
				ecosystem: normalizeCampaignEcosystem(request.ecosystem),
				mode: request.mode ?? "passive",
				output: request.output ?? "research-notes",
				depth: request.depth ?? "standard",
				localReproduction: request.localReproduction ?? "unknown",
				vulnerabilities: request.vulnerabilities ?? []
			}, { projectRoot: this.config.projectRoot });
			case "campaign.repair": return repairCampaign(requiredString(request.id, "id"), this.config.projectRoot);
			case "campaign.seed": return seedCampaign(requiredString(request.id, "id"), this.config.projectRoot);
			case "campaign.surfaces.propose": return proposeCampaignSurfaces(requiredString(request.id, "id"), this.config.projectRoot, request.force === true);
			case "campaign.surfaces.select": return updateCampaignSurfaceCards(requiredString(request.id, "id"), this.config.projectRoot, requiredCardIds(request.cardIds).map((cardId) => ({
				cardId,
				status: "selected"
			})));
			case "campaign.surfaces.skip": return updateCampaignSurfaceCards(requiredString(request.id, "id"), this.config.projectRoot, requiredCardIds(request.cardIds).map((cardId) => ({
				cardId,
				status: "skipped"
			})));
			case "campaign.start": {
				const detail = await showCampaign(requiredString(request.id, "id"), this.config.projectRoot);
				const sessionId = requiredString(request.sessionId, "sessionId");
				const subject = `campaign:${detail.campaign.id}`;
				const linked = await this.workflow.linkFinding(subject, sessionId);
				await this.workflow.record({
					findingId: subject,
					action: "campaign.start",
					sessionId
				});
				return {
					campaignId: detail.campaign.id,
					sessionId,
					laneCount: detail.campaign.lanes.length,
					linked,
					prompt: campaignPrompt(detail)
				};
			}
			case "campaign.run.create": {
				const detail = await showCampaign(requiredString(request.id, "id"), this.config.projectRoot);
				const sessionId = requiredString(request.sessionId, "sessionId");
				const surfaces = await showCampaignSurfaces(detail.campaign.id, this.config.projectRoot);
				const campaign = {
					...detail.campaign,
					lanes: runLanesFromSurfaces(detail.campaign.lanes, surfaces)
				};
				const run = await this.runner.create(campaign, sessionId, request.concurrency ?? this.config.campaignConcurrency);
				await this.workflow.linkFinding(`campaign:${detail.campaign.id}`, sessionId);
				await this.workflow.record({
					findingId: `campaign:${detail.campaign.id}`,
					action: "campaign.run.create",
					sessionId
				});
				return run;
			}
			case "campaign.run.claim": return this.runner.claim(requiredString(request.runId, "runId"));
			case "campaign.run.bind": return this.runner.bind(requiredString(request.runId, "runId"), requiredString(request.laneId, "laneId"), requiredString(request.sessionId, "sessionId"));
			case "campaign.run.lane.update": return this.runner.updateLane({
				runId: requiredString(request.runId, "runId"),
				laneId: requiredString(request.laneId, "laneId"),
				status: requiredLaneUpdateStatus(request.laneStatus),
				...request.sessionId === void 0 ? {} : { sessionId: request.sessionId },
				...request.summary === void 0 ? {} : { summary: request.summary }
			});
			case "campaign.run.control": return this.runner.control(requiredString(request.runId, "runId"), requiredRunControl(request.control), request.laneId);
			case "campaign.run.reconcile": {
				const run = await this.runner.get(requiredString(request.runId, "runId"));
				return this.runner.reconcile(run.id, await this.laneEvidenceStates(run.lanes.map((lane) => lane.findingId)));
			}
			case "repro.run.start": {
				const id = requiredString(request.id, "id");
				await showFinding(id, this.config.projectRoot);
				await initReproArtifacts(id, this.config.projectRoot);
				const run = await this.reproduction.start({
					findingId: id,
					...request.sessionId === void 0 ? {} : { sessionId: request.sessionId },
					...request.command === void 0 ? {} : { command: request.command },
					...request.environment === void 0 ? {} : { environment: request.environment },
					...request.artifacts === void 0 ? {} : { artifacts: request.artifacts }
				});
				await this.workflow.record({
					findingId: id,
					action: "repro.run.start",
					...request.sessionId === void 0 ? {} : { sessionId: request.sessionId }
				});
				return run;
			}
			case "repro.run.finish": {
				const run = await this.reproduction.finish({
					runId: requiredString(request.runId, "runId"),
					status: requiredReproFinishStatus(request.reproStatus),
					...request.sessionId === void 0 ? {} : { sessionId: request.sessionId },
					...request.exitCode === void 0 ? {} : { exitCode: request.exitCode },
					...request.outputText === void 0 ? {} : { output: request.outputText },
					...request.artifacts === void 0 ? {} : { artifacts: request.artifacts }
				});
				const evidenceChange = run.status === "passed" ? await this.writeReproductionEvidence(run.findingId, run.output, run.artifacts) : void 0;
				await this.workflow.record({
					findingId: run.findingId,
					action: `repro.run.${run.status}`,
					...request.sessionId === void 0 ? {} : { sessionId: request.sessionId },
					...evidenceChange === void 0 ? {} : evidenceChange
				});
				return run;
			}
			case "session.link": {
				const id = requiredString(request.id, "id");
				await showFinding(id, this.config.projectRoot);
				return this.workflow.linkFinding(id, requiredString(request.sessionId, "sessionId"), request.intent);
			}
			case "session.unlink": return { removed: await this.workflow.unlinkFinding(requiredString(request.id, "id")) };
			case "workflow.start": {
				const id = requiredString(request.id, "id");
				const intent = requiredIntent(request.intent);
				const payload = await this.finding(id);
				return this.workflow.start(payload.detail, payload.evidence, intent, requiredString(request.sessionId, "sessionId"));
			}
			case "dedup.scan": {
				const id = requiredString(request.id, "id");
				const candidates = (await this.dashboard()).findings.map((finding) => ({
					id: finding.id,
					package: finding.package,
					ecosystem: finding.ecosystem,
					vulnerability: finding.vulnerability,
					path: finding.path
				}));
				result = await this.dedup.scan(id, candidates);
				break;
			}
			case "dedup.update":
				result = await this.dedup.update(requiredString(request.id, "id"), requiredDedupStatus(request.dedupStatus), request.matchId);
				break;
			default: throw new Error(`unknown action: ${String(request.action)}`);
		}
		const id = request.id ?? (isRecord(result) && typeof result.findingId === "string" ? result.findingId : void 0);
		if (id === void 0) return result;
		const after = await this.tryReadFinding(id);
		await this.workflow.record({
			findingId: id,
			action: request.action,
			...request.sessionId === void 0 ? {} : { sessionId: request.sessionId },
			...before === void 0 ? {} : { before },
			...after === void 0 ? {} : { after }
		});
		return result;
	}
	subscribe(listener) {
		return this.watcher.subscribe(listener);
	}
	close() {
		this.dashboardCache = void 0;
		this.watcher.close();
	}
	async healthCheck(name, operation) {
		try {
			await operation();
			return {
				name,
				status: "ok"
			};
		} catch (error) {
			return {
				name,
				status: "degraded",
				detail: error instanceof Error ? error.message : String(error)
			};
		}
	}
	async readEvidence(path) {
		const parsed = parse(await readFile(path, "utf8"));
		return isRecord(parsed) ? parsed : {};
	}
	async tryReadFinding(id) {
		try {
			return await readFile((await showFinding(id, this.config.projectRoot)).path, "utf8");
		} catch {
			try {
				return await readFile((await showFinding(id, this.config.projectRoot, { archived: true })).path, "utf8");
			} catch {
				return;
			}
		}
	}
	async laneEvidenceStates(findingIds) {
		return (await Promise.all(findingIds.map(async (findingId) => {
			try {
				const finding = await this.finding(findingId);
				return {
					findingId,
					stage: finding.stage,
					maturity: finding.assessment.maturity
				};
			} catch {
				return;
			}
		}))).filter((state) => state !== void 0);
	}
	async writeReproductionEvidence(findingId, output, artifacts) {
		if ((output === void 0 || output.trim() === "") && artifacts.length === 0) return void 0;
		const detail = await showFinding(findingId, this.config.projectRoot);
		const before = await readFile(detail.path, "utf8");
		const document = parseDocument(before);
		if (document.errors.length > 0) throw new Error(`cannot update invalid Evidence YAML: ${document.errors[0]?.message ?? detail.path}`);
		if (output !== void 0 && output.trim() !== "") document.setIn(["evidence", "observed_result"], output.trim());
		if (artifacts.length > 0) {
			const existing = document.getIn(["evidence", "repro_artifacts"]);
			const values = Array.isArray(existing) ? existing.filter((value) => typeof value === "string") : [];
			document.setIn(["evidence", "repro_artifacts"], [.../* @__PURE__ */ new Set([...values, ...artifacts])]);
		}
		const after = document.toString();
		if (after === before) return void 0;
		await writeFile(detail.path, after, "utf8");
		return {
			before,
			after
		};
	}
};
function campaignPrompt(detail) {
	const lanes = detail.campaign.lanes.map((lane) => `- ${lane.id}: ${lane.vulnerability_class} → ${lane.finding_id}`).join("\n");
	return [
		`Выполни план аудита OMV ${detail.campaign.id}（${detail.campaign.title}）。`,
		`Цель: ${detail.campaign.target.name} ${detail.campaign.target.version}; глубина: ${detail.campaign.budget.depth}。`,
		"Сначала прочитай план аудита и карточки поверхности атаки. Если карточек нет, вызови omv_campaign_surfaces propose, затем select для 2–3 карточек и только после этого seed. Карточки — неподтверждённые гипотезы; выбор не означает наличия уязвимости.",
		"Если карточки уже выбраны, назначай дочерних исполнителей DSH по выбранным карточкам, а не общим направлениям. Одна дочерняя задача отвечает только за одну карточку. Выстраивай Evidence.v1 по её sources/sinks/guards. Если гипотеза опровергнута, пропусти её и укажи причину ложного срабатывания.",
		"При обобщении проверь каждую находку через omv_finding_validate. Для неудачных направлений запиши причины препятствий и рекомендации по повтору. Не подменяй их результаты выводами других направлений.",
		`Lanes:\n${lanes}`
	].join("\n");
}
function requiredCardIds(values) {
	const ids = [...new Set((values ?? []).map((value) => value.trim()).filter(Boolean))];
	if (ids.length === 0) throw new Error("cardIds is required");
	return ids;
}
function searchScore(haystack, needle) {
	if (haystack.startsWith(needle)) return 100;
	if (haystack.split(/\s+/u).some((word) => word.startsWith(needle))) return 70;
	return 40;
}
function requiredString(value, name) {
	const normalized = value?.trim();
	if (!normalized) throw new Error(`${name} is required`);
	return normalized;
}
function requiredStatus(value) {
	if (value !== "candidate" && value !== "confirmed" && value !== "blocked") throw new Error("status должен быть candidate, confirmed или blocked");
	return value;
}
function requiredIntent(value) {
	if (value === "audit" || value === "repro" || value === "dedup" || value === "critic" || value === "report" || value === "disclose") return value;
	throw new Error("intent должен быть audit, repro, dedup, critic, report или disclose");
}
function requiredLaneUpdateStatus(value) {
	if (value === "completed" || value === "failed" || value === "blocked" || value === "awaiting_evidence") return value;
	throw new Error("laneStatus должен быть completed, failed, blocked или awaiting_evidence");
}
function requiredRunControl(value) {
	if (value === "pause" || value === "resume" || value === "cancel" || value === "retry") return value;
	throw new Error("control должен быть pause, resume, cancel или retry");
}
function requiredReproFinishStatus(value) {
	if (value === "passed" || value === "failed" || value === "blocked") return value;
	throw new Error("reproStatus должен быть passed, failed или blocked");
}
function requiredDedupStatus(value) {
	if (value === "unknown" || value === "clear" || value === "possible_duplicate" || value === "duplicate" || value === "not_applicable") return value;
	throw new Error("dedupStatus должен быть unknown, clear, possible_duplicate, duplicate или not_applicable");
}
function completeSeed(request) {
	if ([
		request.researcherGoal,
		request.product,
		request.ecosystem,
		request.vulnerabilityClass
	].every((value) => value === void 0 || value === "")) return void 0;
	const ecosystem = requiredString(request.ecosystem, "ecosystem");
	if (!EVIDENCE_ECOSYSTEMS.includes(ecosystem)) throw new Error(`ecosystem must be one of: ${EVIDENCE_ECOSYSTEMS.join(", ")}`);
	return {
		researcherGoal: requiredResearcherGoal(request.researcherGoal),
		product: requiredString(request.product, "product"),
		ecosystem,
		vulnerabilityClass: requiredString(request.vulnerabilityClass, "vulnerabilityClass")
	};
}
function requiredResearcherGoal(value) {
	if (value === void 0 || value.trim() === "") return "triage";
	const normalized = value.trim();
	if (normalized !== "VulDB" && normalized !== "CVE" && normalized !== "advisory" && normalized !== "triage") throw new Error("researcherGoal должен иметь одно из значений: VulDB, CVE, advisory, triage");
	return normalized;
}
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
// src/service.ts
/** Native Cordis service for the OMV capability set. */
var OmvService = class extends Service {
	config;
	workbench;
	workbenches = /* @__PURE__ */ new Map();
	constructor(ctx, config) {
		super(ctx, "omv");
		this.workbench = new OmvWorkbench(config);
		this.config = this.workbench.config;
		this.workbenches.set(this.config.projectRoot, this.workbench);
	}
	/** Resolve a workspace-scoped OMV facade under the same plugin lifecycle. */
	scoped(projectRoot) {
		const root = resolve(projectRoot);
		const existing = this.workbenches.get(root);
		if (existing !== void 0) return existing;
		const workbench = this.workbench.scoped(root);
		this.workbenches.set(root, workbench);
		return workbench;
	}
	close() {
		for (const workbench of this.workbenches.values()) workbench.close();
		this.workbenches.clear();
	}
};
// src/settings.ts
/** User-owned preference namespace; deployment knobs remain in Cordis Config. */
const OMV_SETTINGS_NAMESPACE = "dsh-omv";
const OMV_TABS = [
	"overview",
	"findings",
	"reproduction",
	"campaigns",
	"search"
];
const DEFAULT_OMV_SETTINGS = Object.freeze({ defaultTab: "overview" });
// src/settings-schema.ts
/** Host-side schema for the optional dsh-settings provider. */
const OmvSettingsSchema = Schema.object({ defaultTab: Schema.union([...OMV_TABS]).default("overview") });
// src/tools.ts
function registerOmvTools(ctx, workbench, runtimeSnapshot) {
	const register = (definition) => {
		ctx.tools.register(withSignal(definition));
	};
	register(defineTool({
		name: "omv_workspace_overview",
		description: "Проверить текущую рабочую область исследования oh-my-vul: готовность доказательств, планы аудита и приоритетные следующие действия.",
		parameters: {},
		output: stringOutput(),
		async execute(_args, exec) {
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).dashboard());
		},
		presentCall: () => ({
			card: "generic",
			title: "Прочитать состояние аудита OMV",
			kind: "read"
		}),
		presentResult: (_args, result) => ({
			card: "generic",
			title: "Состояние аудита OMV",
			content: result.content
		}),
		isConcurrencySafe: () => true
	}));
	register(defineTool({
		name: "omv_workspace_health",
		description: "Проверить работоспособность среды OMV, хранилища рабочей области, корректность планов аудита и компоненты жизненного цикла DSH.",
		parameters: {},
		output: stringOutput(),
		async execute(_args, exec) {
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).health());
		},
		presentCall: () => ({
			card: "generic",
			title: "Проверить базовую среду OMV",
			kind: "read"
		}),
		presentResult: (_args, result) => ({
			card: "generic",
			title: "Базовая среда OMV",
			content: result.content
		}),
		isConcurrencySafe: () => true
	}));
	if (runtimeSnapshot !== void 0) register(defineTool({
		name: "omv_runtime_status",
		description: "Если возможность OMV недоступна, проверить экземпляры плагинов DSH Cordis, зависимости и состояния жизненного цикла PENDING или FAILED.",
		parameters: {},
		output: stringOutput(),
		async execute() {
			return pretty(runtimeSnapshot());
		},
		presentCall: () => ({
			card: "generic",
			title: "Прочитать жизненный цикл DSH",
			kind: "read"
		}),
		presentResult: (_args, result) => ({
			card: "generic",
			title: "Жизненный цикл DSH",
			content: result.content
		}),
		isConcurrencySafe: () => true
	}));
	register(defineTool({
		name: "omv_finding_inspect",
		description: "Проверить одну находку OMV: цепочку доказательств, валидацию, диагностическую оценку, препятствия и следующее действие.",
		parameters: { id: {
			type: "string",
			required: true,
			description: "Идентификатор находки."
		} },
		output: stringOutput(),
		async execute(args, exec) {
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).finding(args.id));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Прочитать находку: ${args.id}`,
			kind: "read",
			rawInput: args.id,
			locations: [findingLocation(args.id)]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Находки: ${args.id}`,
			content: result.content
		}),
		isConcurrencySafe: () => true
	}));
	register(defineTool({
		name: "omv_finding_validate",
		description: "Проверить находку OMV Evidence.v1 и вернуть точные ошибки схемы и предупреждения. Для оценки готовности доказательств и отчёта используйте omv_quality_gate.",
		parameters: { id: {
			type: "string",
			required: true,
			description: "Идентификатор находки."
		} },
		output: stringOutput(),
		async execute(args, exec) {
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).action({
				action: "finding.validate",
				id: args.id
			}));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Проверить Evidence: ${args.id}`,
			kind: "execute",
			rawInput: args.id,
			locations: [findingLocation(args.id)]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Проверка Evidence завершена · ${args.id}`,
			content: result.content
		}),
		isConcurrencySafe: () => true
	}));
	register(defineTool({
		name: "omv_finding_create",
		description: "Создать шаблон потенциальной находки OMV Evidence.v1; при необходимости заранее заполнить метаданные пакета и уязвимости.",
		parameters: {
			id: {
				type: "string",
				required: true,
				description: "Безопасный идентификатор находки."
			},
			product: {
				type: "string",
				description: "Название пакета или продукта."
			},
			ecosystem: {
				type: "string",
				description: "Экосистема пакета, например npm, python, go или rust."
			},
			vulnerabilityClass: {
				type: "string",
				description: "Тип уязвимости, например ssrf или path-traversal."
			},
			researcherGoal: {
				type: "string",
				description: "Одно из значений: VulDB, CVE, advisory или triage."
			}
		},
		output: stringOutput(),
		async execute(args, exec) {
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).action({
				action: "finding.create",
				id: args.id,
				...args.product === void 0 ? {} : { product: args.product },
				...args.ecosystem === void 0 ? {} : { ecosystem: args.ecosystem },
				...args.vulnerabilityClass === void 0 ? {} : { vulnerabilityClass: args.vulnerabilityClass },
				...args.researcherGoal === void 0 ? {} : { researcherGoal: researcherGoal(args.researcherGoal) }
			}));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Создать потенциальную находку: ${args.id}`,
			kind: "edit",
			rawInput: args,
			locations: [findingLocation(args.id)]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Потенциальная находка создана · ${args.id}`,
			content: result.content
		})
	}));
	register(defineTool({
		name: "omv_workflow_link",
		description: "Связать текущий чат DSH с одной находкой OMV, чтобы позднее продолжить аудит из панели.",
		parameters: {
			id: {
				type: "string",
				required: true,
				description: "Идентификатор находки."
			},
			intent: {
				type: "string",
				description: "Необязательная цель процесса: audit, repro, dedup, critic, report или disclose."
			}
		},
		output: stringOutput(),
		async execute(args, exec) {
			const agent = exec.agent;
			if (agent === void 0) throw new Error("omv_workflow_link требует сессию DSH Agent");
			return pretty(await scoped(workbench, agent.session.header.cwd).action({
				action: "session.link",
				id: args.id,
				sessionId: agent.session.header.id,
				...args.intent === void 0 ? {} : { intent: workflowIntent(args.intent) }
			}));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Связать чат аудита · ${args.id}`,
			kind: "edit",
			rawInput: args
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Чат аудита связан · ${args.id}`,
			content: result.content
		})
	}));
	register(defineTool({
		name: "omv_finding_repro_init",
		description: "До воспроизведения инициализировать сохраняемые локальные артефакты для одной находки OMV.",
		parameters: { id: {
			type: "string",
			required: true,
			description: "Идентификатор находки."
		} },
		output: stringOutput(),
		async execute(args, exec) {
			const scopedWorkbench = scoped(workbench, exec.agent?.session.header.cwd);
			const sessionId = exec.agent?.session.header.id;
			return pretty(await scopedWorkbench.action({
				action: "finding.repro",
				id: args.id,
				...sessionId === void 0 ? {} : { sessionId }
			}));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Инициализировать материалы воспроизведения · ${args.id}`,
			kind: "edit",
			rawInput: args.id,
			locations: [findingLocation(args.id)]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Материалы воспроизведения подготовлены · ${args.id}`,
			content: result.content
		})
	}));
	register(defineTool({
		name: "omv_finding_promote",
		description: "После проверки доказательств установить находке OMV статус candidate, confirmed или blocked.",
		parameters: {
			id: {
				type: "string",
				required: true,
				description: "Идентификатор находки."
			},
			status: {
				type: "string",
				required: true,
				description: "candidate, confirmed или blocked."
			}
		},
		output: stringOutput(),
		async execute(args, exec) {
			const status = evidenceStatus(args.status);
			const sessionId = exec.agent?.session.header.id;
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).action({
				action: "finding.promote",
				id: args.id,
				status,
				...sessionId === void 0 ? {} : { sessionId }
			}));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Обновить статус находки · ${args.id}`,
			kind: "edit",
			rawInput: args,
			locations: [findingLocation(args.id)]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Статус находки обновлён · ${args.id}`,
			content: result.content
		})
	}));
	register(defineTool({
		name: "omv_workflow_history",
		description: "Прочитать связи с чатами DSH, переходы процесса и последнее изменение Evidence для одной находки OMV.",
		parameters: { id: {
			type: "string",
			required: true,
			description: "Идентификатор находки."
		} },
		output: stringOutput(),
		async execute(args, exec) {
			const finding = await scoped(workbench, exec.agent?.session.header.cwd).finding(args.id);
			return pretty({
				id: args.id,
				stage: finding.stage,
				sessionLink: finding.sessionLink,
				lastDiff: finding.lastDiff,
				history: finding.history
			});
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Прочитать историю процесса · ${args.id}`,
			kind: "read",
			rawInput: args.id,
			locations: [findingLocation(args.id), { path: ".omv/.dsh/workflow-events.jsonl" }]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `История процесса · ${args.id}`,
			content: result.content
		}),
		isConcurrencySafe: () => true
	}));
	register(defineTool({
		name: "omv_campaign_inspect",
		description: "Прочитать Campaign.v1: карточки поверхности атаки, цель, направления аудита, порядок выполнения, связанный чат DSH и историю координации.",
		parameters: { id: {
			type: "string",
			required: true,
			description: "Идентификатор плана аудита."
		} },
		output: stringOutput(),
		async execute(args, exec) {
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).campaign(args.id));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Прочитать план аудита · ${args.id}`,
			kind: "read",
			rawInput: args.id,
			locations: [campaignLocation(args.id), surfacesLocation(args.id)]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Campaign · ${args.id}`,
			content: result.content
		}),
		isConcurrencySafe: () => true
	}));
	register(defineTool({
		name: "omv_campaign_repair",
		description: "Исправить однозначно вычисляемые поля совместимости плана аудита, включая псевдонимы экосистемы реестра и производные заголовки.",
		parameters: { id: {
			type: "string",
			required: true,
			description: "Идентификатор плана аудита."
		} },
		output: stringOutput(),
		async execute(args, exec) {
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).action({
				action: "campaign.repair",
				id: args.id,
				...exec.agent === void 0 ? {} : { sessionId: exec.agent.session.header.id }
			}));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Исправить план аудита · ${args.id}`,
			kind: "edit",
			rawInput: args.id,
			locations: [campaignLocation(args.id)]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `План аудита исправлен · ${args.id}`,
			content: result.content
		})
	}));
	register(defineTool({
		name: "omv_campaign_seed",
		description: "Создать потенциальные находки Evidence.v1. Если есть отдельный файл surfaces, кандидаты создаются только по выбранным карточкам; иначе используются направления плана аудита.",
		parameters: { id: {
			type: "string",
			required: true,
			description: "Идентификатор плана аудита."
		} },
		output: stringOutput(),
		async execute(args, exec) {
			const sessionId = exec.agent?.session.header.id;
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).action({
				action: "campaign.seed",
				id: args.id,
				...sessionId === void 0 ? {} : { sessionId }
			}));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Инициализировать кандидатов плана аудита · ${args.id}`,
			kind: "edit",
			rawInput: args.id,
			locations: [campaignLocation(args.id), surfacesLocation(args.id)]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Кандидаты плана аудита инициализированы · ${args.id}`,
			content: result.content
		})
	}));
	register(defineTool({
		name: "omv_campaign_surfaces",
		description: "Предложить, прочитать, выбрать или пропустить карточки поверхности атаки плана аудита. Карточки — неподтверждённые гипотезы: их выбор не означает наличия уязвимости. Создавать кандидатов можно только после выбора хотя бы одной карточки.",
		parameters: {
			id: {
				type: "string",
				required: true,
				description: "Идентификатор плана аудита."
			},
			operation: {
				type: "string",
				required: true,
				description: "propose, inspect, select или skip."
			},
			cards: {
				type: "string",
				description: "Идентификаторы карточек через запятую. Обязательно для select и skip."
			},
			force: {
				type: "boolean",
				description: "Пересоздать предложенные карточки при операции propose."
			}
		},
		output: stringOutput(),
		async execute(args, exec) {
			const scopedWorkbench = scoped(workbench, exec.agent?.session.header.cwd);
			const operation = surfaceOperation(args.operation);
			if (operation === "inspect") return pretty((await scopedWorkbench.campaign(args.id)).surfaces);
			return pretty(await scopedWorkbench.action({
				action: operation === "propose" ? "campaign.surfaces.propose" : operation === "select" ? "campaign.surfaces.select" : "campaign.surfaces.skip",
				id: args.id,
				...operation === "propose" ? { force: args.force === true } : { cardIds: csv(args.cards ?? "") }
			}));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `${surfaceOperationLabel(args.operation)} · ${args.id}`,
			kind: args.operation === "inspect" ? "read" : "edit",
			rawInput: args,
			locations: [campaignLocation(args.id), surfacesLocation(args.id)]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Поверхность атаки · ${args.id}`,
			content: result.content
		}),
		isConcurrencySafe: (args) => args.operation === "inspect"
	}));
	register(defineTool({
		name: "omv_workspace_search",
		description: "Поиск по файлам Evidence, архивным находкам, планам аудита и активности рабочей области OMV.",
		parameters: { query: {
			type: "string",
			required: true,
			description: "Буквальная строка поиска."
		} },
		output: stringOutput(),
		async execute(args, exec) {
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).search(args.query));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Поиск OMV · ${args.query}`,
			kind: "read",
			rawInput: args.query
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Результаты поиска OMV · ${args.query}`,
			content: result.content
		}),
		isConcurrencySafe: () => true
	}));
	register(defineTool({
		name: "omv_campaign_run_inspect",
		description: "Прочитать сохранённый запуск плана аудита: состояния направлений и чатов, повторные попытки и историю событий.",
		parameters: { runId: {
			type: "string",
			required: true,
			description: "Идентификатор запуска плана аудита."
		} },
		output: stringOutput(),
		async execute(args, exec) {
			const runner = scoped(workbench, exec.agent?.session.header.cwd).runner;
			return pretty({
				run: await runner.get(args.runId),
				history: await runner.history(args.runId)
			});
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Прочитать запуск плана аудита · ${args.runId}`,
			kind: "read",
			rawInput: args.runId,
			locations: [{ path: ".omv/.dsh/campaign-runs.json" }, { path: ".omv/.dsh/campaign-run-events.jsonl" }]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Campaign Run · ${args.runId}`,
			content: result.content
		}),
		isConcurrencySafe: () => true
	}));
	register(defineTool({
		name: "omv_campaign_lane_update",
		description: "Записать итог текущего направления плана аудита. Каждый исполнитель направления обязан вызвать этот инструмент перед завершением.",
		parameters: {
			runId: {
				type: "string",
				required: true,
				description: "Идентификатор запуска плана аудита."
			},
			laneId: {
				type: "string",
				required: true,
				description: "Идентификатор направления плана аудита."
			},
			status: {
				type: "string",
				required: true,
				description: "Одно из значений: completed, failed, blocked или awaiting_evidence."
			},
			summary: {
				type: "string",
				required: true,
				description: "Краткий результат, обоснованный доказательствами, либо причина препятствия."
			}
		},
		output: stringOutput(),
		async execute(args, exec) {
			const agent = exec.agent;
			if (agent === void 0) throw new Error("omv_campaign_lane_update требует сессию DSH Agent");
			return pretty(await scoped(workbench, agent.session.header.cwd).action({
				action: "campaign.run.lane.update",
				runId: args.runId,
				laneId: args.laneId,
				laneStatus: laneUpdateStatus(args.status),
				summary: args.summary,
				sessionId: agent.session.header.id
			}));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Передать результат направления · ${args.laneId}`,
			kind: "edit",
			rawInput: args,
			locations: [{ path: ".omv/.dsh/campaign-runs.json" }, { path: ".omv/.dsh/campaign-run-events.jsonl" }]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Направление обновлено · ${args.laneId}`,
			content: result.content
		})
	}));
	register(defineTool({
		name: "omv_evidence_graph",
		description: "Прочитать граф доказательств находки с учётом происхождения данных: утверждение, источник, приёмник, защитные проверки, воспроизведение, наблюдения, чаты и артефакты.",
		parameters: { id: {
			type: "string",
			required: true,
			description: "Идентификатор находки."
		} },
		output: stringOutput(),
		async execute(args, exec) {
			return pretty((await scoped(workbench, exec.agent?.session.header.cwd).finding(args.id)).graph);
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Прочитать граф доказательств · ${args.id}`,
			kind: "read",
			rawInput: args.id,
			locations: [findingLocation(args.id)]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Evidence Graph · ${args.id}`,
			content: result.content
		}),
		isConcurrencySafe: () => true
	}));
	register(defineTool({
		name: "omv_quality_gate",
		description: "Оценить зрелость доказательств в контексте и условия готовности отчёта, не сводя исследование к одному жёсткому проценту завершения.",
		parameters: { id: {
			type: "string",
			required: true,
			description: "Идентификатор находки."
		} },
		output: stringOutput(),
		async execute(args, exec) {
			return pretty((await scoped(workbench, exec.agent?.session.header.cwd).finding(args.id)).qualityGate);
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Проверить готовность отчёта · ${args.id}`,
			kind: "read",
			rawInput: args.id,
			locations: [findingLocation(args.id)]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Готовность отчёта · ${args.id}`,
			content: result.content
		}),
		isConcurrencySafe: () => true
	}));
	register(defineTool({
		name: "omv_quality_overview",
		description: "Прочитать очереди контроля качества рабочей области, неблокирующие сигналы и замечания к доказательствам, по которым можно действовать.",
		parameters: {},
		output: stringOutput(),
		async execute(_args, exec) {
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).action({ action: "workspace.quality" }));
		},
		presentCall: () => ({
			card: "generic",
			title: "Прочитать центр качества доказательств",
			kind: "read"
		}),
		presentResult: (_args, result) => ({
			card: "generic",
			title: "Центр качества доказательств",
			content: result.content
		}),
		isConcurrencySafe: () => true
	}));
	register(defineTool({
		name: "omv_dedup_scan",
		description: "Сопоставить находку с локальными записями и сохранить итог проверки дублей.",
		parameters: { id: {
			type: "string",
			required: true,
			description: "Идентификатор находки."
		} },
		output: stringOutput(),
		async execute(args, exec) {
			const sessionId = exec.agent?.session.header.id;
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).action({
				action: "dedup.scan",
				id: args.id,
				...sessionId === void 0 ? {} : { sessionId }
			}));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Поиск сведений о дублях · ${args.id}`,
			kind: "edit",
			rawInput: args.id,
			locations: [findingLocation(args.id), { path: ".omv/.dsh/dedup.json" }]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Поиск дублей завершён · ${args.id}`,
			content: result.content
		})
	}));
	register(defineTool({
		name: "omv_repro_run_start",
		description: "Начать сохраняемую попытку воспроизведения и связать её с текущим чатом DSH.",
		parameters: {
			id: {
				type: "string",
				required: true,
				description: "Идентификатор находки."
			},
			command: {
				type: "string",
				description: "Точная локальная команда воспроизведения или путь к скрипту."
			},
			artifacts: {
				type: "string",
				description: "Ожидаемые пути артефактов запуска через запятую."
			}
		},
		output: stringOutput(),
		async execute(args, exec) {
			const sessionId = exec.agent?.session.header.id;
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).action({
				action: "repro.run.start",
				id: args.id,
				...sessionId === void 0 ? {} : { sessionId },
				...args.command === void 0 ? {} : { command: args.command },
				...args.artifacts === void 0 ? {} : { artifacts: csv(args.artifacts) }
			}));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Начать запуск воспроизведения · ${args.id}`,
			kind: "edit",
			rawInput: args,
			locations: [findingLocation(args.id), { path: ".omv/.dsh/reproduction-runs.json" }]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Запуск воспроизведения создан · ${args.id}`,
			content: result.content
		})
	}));
	register(defineTool({
		name: "omv_repro_run_finish",
		description: "Завершить сохраняемую попытку воспроизведения, записав фактический статус, код завершения, вывод и артефакты.",
		parameters: {
			runId: {
				type: "string",
				required: true,
				description: "Идентификатор запуска воспроизведения."
			},
			status: {
				type: "string",
				required: true,
				description: "passed, failed или blocked."
			},
			exitCode: {
				type: "number",
				description: "Фактический код завершения процесса."
			},
			output: {
				type: "string",
				description: "Краткий фактический вывод stdout/stderr."
			},
			artifacts: {
				type: "string",
				description: "Пути созданных артефактов через запятую."
			}
		},
		output: stringOutput(),
		async execute(args, exec) {
			const sessionId = exec.agent?.session.header.id;
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).action({
				action: "repro.run.finish",
				runId: args.runId,
				reproStatus: reproFinishStatus(args.status),
				...sessionId === void 0 ? {} : { sessionId },
				...args.exitCode === void 0 ? {} : { exitCode: args.exitCode },
				...args.output === void 0 ? {} : { outputText: args.output },
				...args.artifacts === void 0 ? {} : { artifacts: csv(args.artifacts) }
			}));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Завершить запуск воспроизведения · ${args.runId}`,
			kind: "edit",
			rawInput: args,
			locations: [{ path: ".omv/.dsh/reproduction-runs.json" }]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Запуск воспроизведения завершён · ${args.runId}`,
			content: result.content
		})
	}));
	register(defineTool({
		name: "omv_poc_generate",
		description: "Создать черновик PoC, пригодный для проверки, на основе находки и контекста source/sink/guard из Evidence.v1. Созданную заготовку нельзя выполнять до явного одобрения.",
		parameters: { id: {
			type: "string",
			required: true,
			description: "Идентификатор находки."
		} },
		output: stringOutput(),
		async execute(args, exec) {
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).action({
				action: "poc.generate",
				id: args.id
			}, { signal: exec.signal }));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Создать черновик PoC · ${args.id}`,
			kind: "edit",
			rawInput: args,
			locations: [findingLocation(args.id), { path: ".omv/.dsh/poc-drafts.json" }]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Черновик PoC создан · ${args.id}`,
			content: result.content
		})
	}));
	register(defineTool({
		name: "omv_poc_draft_save",
		description: "Сохранить изменённый код PoC в черновик и повторить проверку безопасности. Сохранение не одобряет и не выполняет PoC.",
		parameters: {
			findingId: {
				type: "string",
				required: true,
				description: "Идентификатор находки."
			},
			draftId: {
				type: "string",
				description: "Идентификатор существующего черновика; не указывайте для создания нового."
			},
			script: {
				type: "string",
				required: true,
				description: "Скрипт PoC. Он должен записывать JSON в /output/result.json."
			},
			language: {
				type: "string",
				description: "python, bash или curl."
			},
			image: {
				type: "string",
				description: "Разрешённый образ Docker."
			},
			requiresNetwork: {
				type: "boolean",
				description: "Нужен ли изолированному контейнеру сетевой доступ."
			}
		},
		output: stringOutput(),
		async execute(args, exec) {
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).action({
				action: "poc.draft.save",
				id: args.findingId,
				...args.draftId === void 0 ? {} : { draftId: args.draftId },
				script: args.script,
				...args.language === void 0 ? {} : { language: pocLanguage(args.language) },
				...args.image === void 0 ? {} : { image: args.image },
				...args.requiresNetwork === void 0 ? {} : { requiresNetwork: args.requiresNetwork }
			}, { signal: exec.signal }));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Сохранить черновик PoC · ${args.findingId}`,
			kind: "edit",
			rawInput: args,
			locations: [{ path: ".omv/.dsh/poc-drafts.json" }]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Черновик PoC сохранён · ${args.findingId}`,
			content: result.content
		})
	}));
	register(defineTool({
		name: "omv_poc_draft_approve",
		description: "Явно одобрить черновик PoC, прошедший проверку. Одобрение обязательно перед любым выполнением в контейнере.",
		parameters: {
			draftId: {
				type: "string",
				required: true,
				description: "Идентификатор черновика PoC."
			},
			approvedBy: {
				type: "string",
				description: "Идентификатор проверяющего или обозначение чата."
			}
		},
		output: stringOutput(),
		async execute(args, exec) {
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).action({
				action: "poc.draft.approve",
				draftId: args.draftId,
				...args.approvedBy === void 0 ? {} : { approvedBy: args.approvedBy }
			}, { signal: exec.signal }));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Одобрить черновик PoC · ${args.draftId}`,
			kind: "edit",
			rawInput: args,
			locations: [{ path: ".omv/.dsh/poc-drafts.json" }]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Черновик PoC одобрен · ${args.draftId}`,
			content: result.content
		})
	}));
	register(defineTool({
		name: "omv_poc_run",
		description: "Выполнить одобренный PoC в изолированном профиле Docker. Сохранить result.json, хеши артефактов, подключения каталогов, ограничения и происхождение результатов. Успешный запуск не принимается автоматически как доказательство.",
		parameters: {
			draftId: {
				type: "string",
				required: true,
				description: "Идентификатор одобренного черновика PoC."
			},
			sourceDir: {
				type: "string",
				description: "Необязательный каталог исходников относительно проекта; подключается только для чтения в /source."
			}
		},
		output: stringOutput(),
		async execute(args, exec) {
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).action({
				action: "poc.run.start",
				draftId: args.draftId,
				...args.sourceDir === void 0 ? {} : { sourceDir: args.sourceDir }
			}, { signal: exec.signal }));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Выполнить изолированный PoC · ${args.draftId}`,
			kind: "execute",
			rawInput: args,
			locations: [{ path: ".omv/.dsh/poc-runs" }]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Запуск PoC завершён · ${args.draftId}`,
			content: result.content
		})
	}));
	register(defineTool({
		name: "omv_poc_run_inspect",
		description: "Прочитать сохранённый запуск PoC: структурированный результат, хеши артефактов, профиль безопасности и происхождение данных.",
		parameters: { runId: {
			type: "string",
			required: true,
			description: "Идентификатор запуска PoC."
		} },
		output: stringOutput(),
		async execute(args, exec) {
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).action({
				action: "poc.run.inspect",
				runId: args.runId
			}));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Прочитать запуск PoC · ${args.runId}`,
			kind: "read",
			rawInput: args,
			locations: [{ path: ".omv/.dsh/poc-runs.json" }]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `PoC Run · ${args.runId}`,
			content: result.content
		}),
		isConcurrencySafe: () => true
	}));
	register(defineTool({
		name: "omv_poc_evidence_adopt",
		description: "Вручную принять успешный запуск PoC в Evidence.v1. Это явный этап решения человеком: одно только выполнение никогда не меняет заключение по находке.",
		parameters: { runId: {
			type: "string",
			required: true,
			description: "Идентификатор успешного запуска PoC."
		} },
		output: stringOutput(),
		async execute(args, exec) {
			return pretty(await scoped(workbench, exec.agent?.session.header.cwd).action({
				action: "poc.evidence.adopt",
				runId: args.runId
			}, { signal: exec.signal }));
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Принять доказательства PoC · ${args.runId}`,
			kind: "edit",
			rawInput: args,
			locations: [{ path: ".omv/findings" }]
		}),
		presentResult: (args, result) => ({
			card: "generic",
			title: `Доказательства PoC приняты · ${args.runId}`,
			content: result.content
		})
	}));
}
function scoped(workbench, cwd) {
	return cwd === void 0 ? workbench : workbench.scoped(cwd);
}
function stringOutput() {
	return {
		schema: { type: "string" },
		render: (_args, value) => [{
			type: "text",
			text: value
		}]
	};
}
function pretty(value) {
	return JSON.stringify(value, null, 2);
}
function pocLanguage(value) {
	if (value === "python" || value === "bash" || value === "curl") return value;
	throw new Error("language должен быть python, bash или curl");
}
/** Central cancellation guard for every OMV tool body. */
function withSignal(definition) {
	return {
		...definition,
		async execute(args, exec) {
			exec.signal.throwIfAborted();
			const value = await definition.execute(args, exec);
			exec.signal.throwIfAborted();
			return value;
		}
	};
}
function findingLocation(id) {
	return { path: `.omv/findings/${id}.yaml` };
}
function campaignLocation(id) {
	return { path: `.omv/campaigns/${id}.yaml` };
}
function surfacesLocation(id) {
	return { path: `.omv/campaigns/${id}.surfaces.yaml` };
}
function surfaceOperation(value) {
	if (value === "propose" || value === "inspect" || value === "select" || value === "skip") return value;
	throw new Error("operation должен быть propose, inspect, select или skip");
}
function surfaceOperationLabel(value) {
	if (value === "propose") return "Предложить поверхности атаки";
	if (value === "select") return "Выбрать поверхность атаки";
	if (value === "skip") return "Пропустить поверхность атаки";
	return "Прочитать поверхность атаки";
}
function evidenceStatus(value) {
	if (value === "candidate" || value === "confirmed" || value === "blocked") return value;
	throw new Error("status должен быть candidate, confirmed или blocked");
}
function researcherGoal(value) {
	if (value === "VulDB" || value === "CVE" || value === "advisory" || value === "triage") return value;
	throw new Error("researcherGoal должен иметь одно из значений: VulDB, CVE, advisory, triage");
}
function workflowIntent(value) {
	if (value === "audit" || value === "repro" || value === "dedup" || value === "critic" || value === "report" || value === "disclose") return value;
	throw new Error("intent должен быть audit, repro, dedup, critic, report или disclose");
}
function laneUpdateStatus(value) {
	if (value === "completed" || value === "failed" || value === "blocked" || value === "awaiting_evidence") return value;
	throw new Error("status должен быть completed, failed, blocked или awaiting_evidence");
}
function reproFinishStatus(value) {
	if (value === "passed" || value === "failed" || value === "blocked") return value;
	throw new Error("status должен быть passed, failed или blocked");
}
function csv(value) {
	return value.split(/[,\n]/u).map((item) => item.trim()).filter(Boolean);
}
// src/index.ts
const name = "dsh-omv";
const inject = [
	"webServer",
	"tools",
	"commands",
	"systemPrompt",
	"workspaceRegistry"
];
/** Advertise the service before apply runs so dependent plugins can wait on it. */
const provide = ["omv"];
const Config = Schema.object({
	projectRoot: Schema.string().pattern(/\S/u).default("."),
	apiPrefix: Schema.string().pattern(/^\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/u).default("/api/dsh-omv"),
	allowMutations: Schema.boolean().default(true),
	allowRemoteAccess: Schema.boolean().default(false),
	activityLimit: Schema.number().step(1).min(1).default(60),
	refreshIntervalMs: Schema.number().step(1).min(0).default(15e3),
	campaignConcurrency: Schema.number().step(1).min(1).max(8).default(3),
	watchDebounceMs: Schema.number().step(1).min(0).max(1e4).default(90),
	eventHeartbeatMs: Schema.number().step(1).min(1).max(3e5).default(2e4),
	httpBodyLimitBytes: Schema.number().step(1).min(4096).max(16777216).default(262144),
	pocEnabled: Schema.boolean().default(true),
	pocAllowNetwork: Schema.boolean().default(false),
	pocDockerImages: Schema.array(Schema.string()).min(1).default(["python:3.12-slim"]),
	pocTimeoutMs: Schema.number().step(1).min(1e3).max(6e5).default(3e4),
	pocMemoryMb: Schema.number().step(1).min(64).max(2048).default(256),
	pocCpuLimit: Schema.number().min(.1).max(4).default(1),
	pocPidLimit: Schema.number().step(1).min(16).max(512).default(128),
	pocMaxScriptBytes: Schema.number().step(1).min(1024).max(1048576).default(131072),
	pocMaxOutputBytes: Schema.number().step(1).min(1024).max(1048576).default(65536)
});
function apply(ctx, config = {}) {
	const omv = new OmvService(ctx, {
		projectRoot: config.projectRoot ?? ".",
		apiPrefix: normalizeApiPrefix(config.apiPrefix ?? "/api/dsh-omv"),
		allowMutations: config.allowMutations ?? true,
		allowRemoteAccess: config.allowRemoteAccess ?? false,
		activityLimit: positiveInteger(config.activityLimit ?? 60, "activityLimit"),
		refreshIntervalMs: nonNegativeInteger(config.refreshIntervalMs ?? 15e3, "refreshIntervalMs"),
		campaignConcurrency: boundedInteger(config.campaignConcurrency ?? 3, 1, 8, "campaignConcurrency"),
		watchDebounceMs: boundedInteger(config.watchDebounceMs ?? 90, 0, 1e4, "watchDebounceMs"),
		eventHeartbeatMs: boundedInteger(config.eventHeartbeatMs ?? 2e4, 1, 3e5, "eventHeartbeatMs"),
		httpBodyLimitBytes: boundedInteger(config.httpBodyLimitBytes ?? 262144, 4096, 16777216, "httpBodyLimitBytes"),
		pocEnabled: config.pocEnabled ?? true,
		pocAllowNetwork: config.pocAllowNetwork ?? false,
		pocDockerImages: config.pocDockerImages ?? ["python:3.12-slim"],
		pocTimeoutMs: boundedInteger(config.pocTimeoutMs ?? 3e4, 1e3, 6e5, "pocTimeoutMs"),
		pocMemoryMb: boundedInteger(config.pocMemoryMb ?? 256, 64, 2048, "pocMemoryMb"),
		pocCpuLimit: config.pocCpuLimit ?? 1,
		pocPidLimit: boundedInteger(config.pocPidLimit ?? 128, 16, 512, "pocPidLimit"),
		pocMaxScriptBytes: boundedInteger(config.pocMaxScriptBytes ?? 131072, 1024, 1048576, "pocMaxScriptBytes"),
		pocMaxOutputBytes: boundedInteger(config.pocMaxOutputBytes ?? 65536, 1024, 1048576, "pocMaxOutputBytes")
	});
	const workbench = omv.workbench;
	registerUserSettings(ctx);
	const unregisterHttp = registerWorkbenchHttp(ctx.webServer, workbench, async (projectRoot) => {
		if (projectRoot === void 0 || resolve(projectRoot) === workbench.config.projectRoot) return workbench;
		const workspace = await ctx.workspaceRegistry.resolveByPath(projectRoot);
		if (workspace === void 0) throw new Error("Запрошенный корневой каталог не зарегистрирован как рабочая папка DSH");
		return omv.scoped(workspace.path);
	});
	ctx.effect(() => () => {
		unregisterHttp();
		omv.close();
	}, "dsh-omv: workspace watchers");
	registerOmvTools(ctx, workbench, () => inspectDshRuntime(ctx));
	registerOmvCommands(ctx, workbench, () => inspectDshRuntime(ctx));
	ctx.on("tools/result", (exec, result) => {
		if (!exec.name.startsWith("omv_")) return;
		ctx.emit("dsh-omv/tool-result", {
			name: exec.name,
			callId: String(exec.callId),
			ok: !result.isError,
			...exec.agent?.session.header.id === void 0 ? {} : { sessionId: exec.agent.session.header.id },
			...exec.agent?.session.header.cwd === void 0 ? {} : { projectRoot: resolve(exec.agent.session.header.cwd) }
		});
	});
	ctx.effect(() => ctx.systemPrompt.section({
		name: "dsh-omv:workflow",
		order: 150,
		text: [
			"The current DSH workspace has an evidence-first vulnerability audit capability.",
			"Use omv_workspace_overview to orient, omv_finding_inspect before changing a finding,",
			"omv_workflow_link when one finding becomes the session focus, omv_finding_repro_init before reproduction,",
			"omv_finding_validate after evidence edits, and omv_finding_create only for a new candidate.",
			"For campaign work inspect the Campaign, propose attack-surface cards with omv_campaign_surfaces, select or skip cards, then seed only selected cards before delegating one card per subagent; do not seed generic lanes when a surfaces file exists.",
			"Campaign Runner lanes are durable DSH sessions: inspect them with omv_campaign_run_inspect and always commit an outcome with omv_campaign_lane_update before a lane ends.",
			"Use omv_evidence_graph and omv_quality_gate to verify provenance and report readiness; bracket every local reproduction with omv_repro_run_start and omv_repro_run_finish.",
			"For isolated PoC work use omv_poc_generate, edit and save the draft with omv_poc_draft_save, validate and explicitly approve with omv_poc_draft_approve, then run with omv_poc_run. Inspect result.json and provenance with omv_poc_run_inspect; never treat a passed run as a confirmed vulnerability until a human calls omv_poc_evidence_adopt.",
			"Use omv_quality_overview to triage the workspace queue and omv_dedup_scan before submission; report drafts and disclosure timelines belong to the omv-report and omv-disclose Agent workflows.",
			"If a DSH capability appears missing or a plugin is waiting, use omv_runtime_status to inspect Cordis Fiber dependencies before retrying.",
			"Treat Evidence.v1 source -> sink -> guard and observed reproduction as the canonical audit state.",
			"Keep unknown evidence explicit; describe maturity by evidence dimensions and report exact next actions instead of treating a single score as completion."
		].join(" ")
	}), "dsh-omv: system prompt");
}
/**
* Register only user-owned preferences with the optional DSH settings seam.
* Deployment/runtime knobs intentionally stay in Cordis Config and patch files.
* `ctx.inject()` keeps headless profiles working when no settings provider is mounted.
*/
function registerUserSettings(ctx) {
	ctx.inject(["settings"], (settingsCtx) => {
		const settings = settingsCtx.settings;
		if (typeof settings.register !== "function") return;
		const scope = settings.register(OMV_SETTINGS_NAMESPACE, OmvSettingsSchema, { base: DEFAULT_OMV_SETTINGS });
		settingsCtx.effect(() => scope.watch(() => void 0), "dsh-omv: settings observer");
	});
}
function normalizeApiPrefix(value) {
	const prefix = value.trim();
	if (!prefix.startsWith("/") || prefix === "/" || prefix.endsWith("/")) throw new Error("dsh-omv: apiPrefix должен быть абсолютным путём без завершающего слеша");
	if (!/^\/[A-Za-z0-9/_-]+$/.test(prefix)) throw new Error("dsh-omv: apiPrefix содержит неподдерживаемые символы");
	return prefix;
}
function positiveInteger(value, field) {
	if (!Number.isInteger(value) || value < 1) throw new Error(`dsh-omv: ${field} must be a positive integer`);
	return value;
}
function nonNegativeInteger(value, field) {
	if (!Number.isInteger(value) || value < 0) throw new Error(`dsh-omv: ${field} must be a non-negative integer`);
	return value;
}
function boundedInteger(value, min, max, field) {
	if (!Number.isInteger(value) || value < min || value > max) throw new Error(`dsh-omv: ${field} must be an integer between ${min} and ${max}`);
	return value;
}
export { CampaignRunner, Config, DEFAULT_OMV_SETTINGS, DockerPocExecutor, OMV_SETTINGS_NAMESPACE, OMV_TABS, OmvService, OmvSettingsSchema, OmvWorkbench, OmvWorkflowService, PocStore, ReproductionService, WORKBENCH_COMPATIBLE_PROTOCOL_VERSIONS, WORKBENCH_PROTOCOL_VERSION, analyzeEvidenceGraph, apply, assessEvidence, buildEvidenceGraph, createPocGenerationRequest, defaultCommandRunner, deriveAuditStage, evaluateQualityGate, exportEvidenceGraph, formatCodeRef, inject, inspectDshRuntime, name, parseCodeRef, provide, resolveCodeRef, suggestedIntent };
