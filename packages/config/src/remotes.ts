import { url, type ServiceName } from "./services.ts";

/**
 * Манифест remote-модулей — единый источник истины для настройки Module Federation.
 *
 * По одной записи на каждый remote; `exposes` сопоставляет имя экспортируемого модуля с его исходным
 * файлом относительно `src/` этого remote. Всё остальное выводится:
 *   - Vite `exposes` для remote  → `toExposes(name)`
 *   - Vite `remotes` для host     → `toRemotes()`
 *   - `remotes.d.ts` для host     → `scripts/gen-remotes.ts`
 *
 * Добавьте remote здесь (и его приложение `apps/web/<name>/`) — типы писать вручную не нужно.
 * Имя remote также должно существовать в топологии сервисов (`services`).
 */
export const remotes = {
  posts: {
    exposes: {
      PostList: "components/widgets/PostContainer.vue",
    },
  },
} as const;

export type RemoteName = keyof typeof remotes;

/** Директория remote-приложения в репозитории, относительно корня монорепо. */
export function remoteDir(name: RemoteName): string {
  return `apps/web/${name}`;
}

/** Vite `exposes` для remote: `{ "./PostList": "./src/components/.../X.vue" }`. */
export function toExposes(name: RemoteName): Record<string, string> {
  return Object.fromEntries(
    Object.entries(remotes[name].exposes).map(([key, path]) => [
      `./${key}`,
      `./src/${path}`,
    ]),
  );
}

type RemoteEntry = { type: "module"; name: string; entry: string };

/** Vite `remotes` для host, со значениями по умолчанию localhost из топологии. */
export function toRemotes(): Record<RemoteName, RemoteEntry> {
  return Object.fromEntries(
    (Object.keys(remotes) as RemoteName[]).map((name) => [
      name,
      {
        type: "module",
        name,
        entry: `${url(name as ServiceName)}/remoteEntry.js`,
      },
    ]),
  ) as Record<RemoteName, RemoteEntry>;
}
