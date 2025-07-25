/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_OAUTH_CLIENT_ID: string
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 