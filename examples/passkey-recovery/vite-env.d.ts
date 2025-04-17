/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLIENT_KEY: string
  readonly VITE_CLIENT_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 
