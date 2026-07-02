/// <reference types="vite/client" />

import { Schema } from "effect";
import { url } from "./services.ts";

// Конфигурация только для браузера. Vite встраивает VITE_* в import.meta.env на этапе сборки;
// всё остальное остаётся на стороне сервера. Валидируется, чтобы опечатка падала сразу при загрузке (fail-fast).
const HttpUrl = Schema.String.pipe(
  Schema.pattern(/^https?:\/\/.+/, {
    message: () => "must be an http(s) URL",
  }),
);

const decodeUrl = Schema.decodeUnknownSync(HttpUrl);

export const clientConfig = {
  apiUrl: decodeUrl(import.meta.env.VITE_API_URL ?? url("api")),
} as const;
