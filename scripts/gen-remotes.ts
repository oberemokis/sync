/**
 * Генерирует apps/web/host/src/remotes.d.ts из манифеста ремоутов
 * @buddy-play/config. Запускается через `pnpm gen:remotes` (также привязан к predev/prebuild).
 *
 * Типы реэкспортируются из реального исходного кода каждого ремоута (только типы,
 * стирается при сборке), поэтому `import("posts/PostList")` в хосте типизируется
 * ровно как компонент ремоута — без сети, без архивов типов MF, без рассинхронизации.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { relative } from "node:path";
import { remotes, remoteDir, type RemoteName } from "@buddy-play/config";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const hostSrc = `${repoRoot}apps/web/host/src`;
const outFile = `${hostSrc}/remotes.d.ts`;

function blocks(): string[] {
  const names = Object.keys(remotes) as RemoteName[];

  return names.flatMap((name) =>
    Object.entries(remotes[name].exposes).map(([key, source]) => {
      const absolute = `${repoRoot}${remoteDir(name)}/src/${source}`;
      const importPath = relative(hostSrc, absolute);

      return [
        `declare module "${name}/${key}" {`,
        `  export { default } from "${importPath}";`,
        `}`,
      ].join("\n");
    }),
  );
}

const header = [
  "// АВТОГЕНЕРАЦИЯ через scripts/gen-remotes.ts — не редактировать.",
  "// Запустите `pnpm gen:remotes` после изменения манифеста ремоутов в @buddy-play/config.",
  "// В рантайме они загружаются через Module Federation; типы берутся из исходного",
  "// кода каждого ремоута (только типы — стирается при сборке, без связи в рантайме).",
];

const content = `${[...header, "", ...blocks()].join("\n")}\n`;

writeFileSync(outFile, content);
console.log(`[gen-remotes] wrote ${relative(repoRoot, outFile)}`);
