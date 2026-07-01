# @sync/utils — универсальные хелперы

**Без зависимостей** (ни runtime, ни dev). Если хелперу нужна зависимость, ему место в другом пакете.

## Что здесь есть

### `Module<TApi, TQueries, TKeys>` + `createModule()`

Тип фабрики для композиции сущностей — объединяет api, queries, keys в один экспортируемый объект:

```ts
type Module<TApi, TQueries, TKeys> = TApi & TQueries & { keys: TKeys };

function createModule<TApi, TQueries, TKeys>(
  api: TApi,
  queries: TQueries,
  keys: TKeys,
): Module<TApi, TQueries, TKeys> {
  return { ...api, ...queries, keys };
}
```

Планировался как целевая фабрика для `packages/api/src/<entity>/index.ts` (описывалось в старой версии `.rules`). **Сейчас не используется** — `packages/api` пока применяет обычные реэкспорты.
