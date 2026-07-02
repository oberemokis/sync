# Sync — Монорепозиторий

## Стек
- **Фронтенд**: Vue 3 + Pinia + Module Federation (Vite)
- **Бэкенд**: Hono (Node.js)
- **Рантайм**: Effect (`effect`, `@effect/platform`) — используется повсеместно
- **Менеджер пакетов**: pnpm 10 + Turbo

## Архитектура
```
apps/
  api/posts/            ← @buddy-play/posts-api (бэкенд на Hono)   → apps/api/AGENTS.md
  web/
    host/               ← @buddy-play/host (Vite-хост, 5173)      → apps/web/AGENTS.md
    posts/              ← @buddy-play/posts (Vite-ремоут, 5001)
libs/                   ← переиспользуемые библиотеки
  middleware/            ← @buddy-play/middleware (middleware + guard)
packages/               ← инфраструктурные пакеты
  composables/          ← @buddy-play/composables (Vue-композаблы)
  test/                 ← @buddy-play/test (утилиты для тестов)
  ui/                   ← @buddy-play/ui (UI-кит — пока пустой)
  utils/                ← @buddy-play/utils (хелперы, без зависимостей)
shared/                 ← доменные пакеты (общие данные)
  api/                  ← @buddy-play/api (HTTP-клиент + Effect)
  config/               ← @buddy-play/config (топология портов/URL, манифест ремоутов)
  mocks/                ← @buddy-play/mocks (фикстуры для тестов)
  schemes/              ← @buddy-play/schemes (Effect Schema)
  stores/               ← @buddy-play/stores (Pinia, синглтон для MFE)
```

У каждого сервиса свой `AGENTS.md` с локальными деталями. OpenCode автоматически подгружает их, поднимаясь от рабочей директории вверх.

## Команды
- `pnpm install` — установить все зависимости
- `pnpm dev` — запустить все приложения (Turbo: host + posts + api параллельно)
- `pnpm dev:web` — только фронтенд (host + posts)
- `pnpm dev:api` — только бэкенд (posts-api)
- `pnpm test` — все юнит-тесты (Turbo, Vitest по пакетам)
- `pnpm test:e2e` — e2e-тесты (Playwright: поднимает host + posts + api)
- `pnpm gen:remotes` — сгенерировать типы ремоутов (`host/src/remotes.d.ts`) из манифеста в `@buddy-play/config`

### Команды по пакетам
- Typecheck бэкенда: `pnpm typecheck` (из `apps/api/posts/`, запускает `tsc --noEmit`)
- Typecheck фронтенда: отдельного скрипта нет — `npx vue-tsc --noEmit` из директории приложения
- Typecheck скриптов/e2e: `npx tsc -p tsconfig.json --noEmit` из корня (корневой `tsconfig.json` покрывает `scripts/`, `e2e/`, `playwright.config.ts`)
- Сборка: `pnpm build` из директорий пакетов (api: `tsc`, web: `vite build`)
- Тесты: `pnpm test` в пакете (Vitest) или `pnpm test` из корня (Turbo агрегирует)

### Синтаксис фильтров Turbo
- `turbo run dev --filter './apps/web/*'` — все web-приложения
- `turbo run dev --filter './apps/api/*'` — все api-приложения

## Ключевые паттерны
- **Effect везде**: рантайм, схемы, HTTP-клиенты, слои сервисов — всё на `effect` и `@effect/platform`. Никаких «голых» промисов и try/catch.
- **Пакеты экспортируют исходники напрямую**: все пакеты (`packages/*`, `libs/*`, `shared/*`) указывают `main`/`types`/`exports` на `./src/index.ts`. Без шага сборки — Vite/tsx резолвят на лету.

Подробные паттерны лежат рядом с кодом:
- Паттерн Effect-слоёв бэкенда → `apps/api/AGENTS.md`
- Настройка Module Federation → `apps/web/AGENTS.md`
- Раскладка сущностей в пакете → `shared/api/AGENTS.md`

## Конвенции
- Правила стиля кода: `.rules` (автоподгрузка через `.opencode/opencode.jsonc` → instructions)
- Покрывают: именование (префиксы/суффиксы), функции, импорты (алиас `@/`), строгий TypeScript (без `any`/`!`/`as`), моделирование состояний (discriminated unions, branded-типы), null-политику, Effect-TS, Vue, Pinia, модули, комментарии, guard clauses, константы, обработку ошибок, дублирование (rule of three), тесты (AAA), git-коммиты
- Git: коммиты только под данными пользователя — без `Co-authored-by` и другой AI-атрибуции, без `git commit --no-verify`; `git push` выполняет только пользователь

## OpenCode
- Конфиг проекта: `.opencode/opencode.jsonc` (модель, instructions, плагины `oh-my-openagent` и `opencode-background-agents`, агенты)
- Агент `committer` (subagent, `opencode/kimi-k2.5`): делает коммиты по правилам проекта; редактирование файлов ему запрещено
- Команды (`.opencode/command/`):
  - `/commit` — коммит через агента `committer`, БЕЗ push; по коммиту на каждую затронутую область (префиксы `api:`, `web:`, `ai:` и т.д.)
  - `/smell` — ревью только изменённых файлов на code smells по правилам `.rules`; отчёт без исправлений
