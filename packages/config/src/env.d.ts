// Типизированный доступ к переменным VITE_, которые читает клиентская конфигурация, без зависимости от
// `vite/client`. Использующие Vite-приложения встраивают их на этапе сборки.
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
