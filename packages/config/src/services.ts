/**
 * Топология сервисов — единый источник истины для портов и имён.
 *
 * Чистые данные, без чтения env и без зависимостей, поэтому безопасно импортировать из
 * ЛЮБОГО рантайма (сборочные инструменты Node, бэкенд Hono и браузерный бандл).
 * Переопределения из окружения накладываются поверх этих значений по умолчанию:
 * URL для браузера — в `./client` (VITE_*), порт бэкенда — через `PORT` (Effect.Config).
 */
export const services = {
  api: { name: "posts-api", port: 3001 },
  posts: { name: "posts", port: 5001 },
  host: { name: "host", port: 5173 },
} as const;

export type ServiceName = keyof typeof services;

/** URL сервиса для локальной разработки — значение по умолчанию, когда переопределение из env не задано. */
export function url(service: ServiceName): string {
  return `http://localhost:${services[service].port}`;
}
