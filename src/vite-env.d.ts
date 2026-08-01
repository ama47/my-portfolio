/// <reference types="vite/client" />

// Declared explicitly rather than leaning on Vite's `[key: string]: any` index
// signature, so a typo in a variable name is a type error rather than `any`.
interface ImportMetaEnv {
  readonly VITE_CONTACT_ENDPOINT?: string;
  readonly VITE_CONTACT_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
