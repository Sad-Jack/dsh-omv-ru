# Запись аудита интеграции с DSH

Документ сопоставляет [руководство по плагинам DSH](https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/) и [справочник архитектуры](https://deepseek-harness.github.io/deepseek-harness/reference/) с реализацией `dsh-omv` как основу дальнейшей разработки. Таблица отражает отчёт исходного проекта; перечисленные там проверки не означают, что все они повторно выполнены при переводе.

В исходном проходе рассматривались [точки интеграции возможностей](https://deepseek-harness.github.io/deepseek-harness/reference/capability-seams), [выполнение инструментов](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/tools), [HTTP-сервер](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/web-server), [клиентские модули](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/client-modules), [настройки пользователя](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/settings) и [команды](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/commands).

## Реализованное по исходному отчёту

| Правило DSH | Реализация | Указанная проверка |
|---|---|---|
| `apply(ctx)` и зависимости `inject` | `src/index.ts`: WebServer, Tools, Commands, SystemPrompt, WorkspaceRegistry | `dsh --profile web --dump-config` и проверка запуска |
| Регистрация через `ctx` и очистка | HTTP disposer, Tool/Command/Prompt/Slot внутри Cordis fiber; внешние watcher и Runner scope через `ctx.effect` | После остановки закрыт порт, освобождены SSE-подписки |
| Schemastery и границы параметров | Настраиваемые `activityLimit`, опрос, параллельность, watch debounce, SSE heartbeat, предел HTTP body; schema отклоняет значения вне границ | `src/config.test.ts` |
| Форма Service | `OmvService` доступен как `ctx.omv`, workbench ограничен рабочей областью; другим плагинам доступно `inject: ['omv']` | `src/service.test.ts` |
| Диагностика fiber | `inspectDshRuntime`, `omv_runtime_status`, `/omv-runtime`: PENDING/FAILED, зависимости и fiber | `src/runtime.test.ts` |
| Канонический вывод Tool | У всех `output.schema` и `render`, проверки AbortSignal до/после передачи | Регистрация 29 инструментов, `npm run check` |
| Карточка OMV | Keyed `tool.call.toolview` для 29 инструментов, существующие call/result-блоки с действием, целью, состоянием, аргументами, результатом и переходом к трассировке | `src/client/omv-toolview.tsx`, `tests/toolview.client.test.ts` |
| Представление Tool | Штатная общая карточка, `kind`, файловые `locations` для Finding/Campaign/Runner; остальные инструменты сохраняют общую карточку и сопровождение DSH | Presenters в `src/tools.ts` |
| Типизированные события | `tools/result` → `dsh-omv/tool-result`, подключение других плагинов к аудиту | `src/events.ts` |
| Настройки пользователя | Пространство `dsh-omv` хранит лишь последнюю панель аудита, если хост поддерживает собственные namespaces. В описанной автором DSH rc.6 — локальное предпочтение браузера как запасной путь. Cordis Config остаётся контрактом развёртывания | `src/settings.ts`, `src/settings-schema.ts`, клиентский `settingsScope` и локальный запасной путь |
| Слои bundle/profile | `dsh.bundle.patch`, стабильный `id: dsh-omv`, профиль повторяет полную config | `cordis.patch.yml`, dump профиля |
| Устойчивость рабочей области | Каталог текущего сеанса отделён от стандартного; повреждённый Evidence попадает в `workspaceIssues`, не рушит всю панель | `src/workbench.ts`, `src/client/index.tsx` |
| Доступность | `role=tab`, клавиши `1–9`/`0`/`/`/`R`, панель `⌘K/Ctrl-K`, семантика диалогов, закрываемые уведомления, загрузка/ошибки через `aria-live` | `src/client/index.tsx`, `src/client/styles.ts` |
| Последние изменения | Обзор использует `DashboardPayload.activity` для записей доказательств и действий; состояние DSH `JobView` показано в обзоре и панели | `src/client/pages.tsx` |
| Визуальная система | Цветовые alias хоста, значки навигации, закреплённая верхняя область, иерархия карточек, детали и мобильные точки перехода; родительский scroll-контейнер ограничивает рост страницы сеанса | `src/client/index.tsx`, `src/client/styles.ts` |
| Обратная связь синхронизации | SSE-состояние, время синхронизации, опрос после разрыва, сообщение об ошибке тихого обновления и явный повтор | `src/client/index.tsx` |
| Цикл исследования | Качество, лаборатория воспроизведения, Campaign Graph, дедупликация и материалы отчёта используют `ActionRequest`, HTTP, Tool/Command. Черновик отчёта и хронология раскрытия создаются процессами агентов omv-report / omv-disclose | `src/workbench.ts`, `src/dedup.ts`, `src/reporting.ts` |

## Следующие направления интеграции

1. **Разделить Definition / Provider / Consumer:** вынести стабильные запросы/результаты `OmvService` в `dsh-omv-contracts` для замены локального или удалённого Provider.
2. **Предметные карточки:** на базе keyed OMV Tool Card добавить краткие сведения о доказательствах, Diff и состоянии запуска для Finding, Campaign Lane, Reproduction Run. Протокол модели сохранить.
3. **Мост событий и телеметрии:** поверх `dsh-omv/tool-result` — обезличенные агрегаты времени, причин отмены и workspace scope, экспорт только по opt-in, без чувствительных Evidence в журналах.
4. **HMR:** изменить `config` локального patch и проверить полную очистку прежних HTTP/SSE/Watcher/Service scope с единственным новым экземпляром.

## Сопровождение

- Новый параметр развёртывания сначала включать в `Config` и `cordis.patch.yml`, затем в реализацию; не вводить скрытую константу.
- Для ресурсов использовать `ctx.on`, `ctx.effect`, `ctx.tools.register`, `ctx.slots.register`; не держать глобальные обработчики вне fiber.
- Инструмент изменения файла обязан указывать `locations`; изменяющие инструменты по умолчанию exclusive, без `isConcurrencySafe`.
- Авторитетное хранение Evidence — `.omv` и схема `oh-my-vul`. UI отображает состояние, а не ведёт параллельную версию оценок.
