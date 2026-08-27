/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set to 'hash' by the standalone build so routing works without a server. */
  readonly VITE_ROUTER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
