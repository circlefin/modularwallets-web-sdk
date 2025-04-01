/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
