import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Tauri serves this dev server and then bundles `dist/` into the binary.
// Fixed port so `tauri.conf.json` can point at it; no HMR fallback games.
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 5183,
    strictPort: true,
  },
  build: {
    target: 'chrome105',
    // WebView2 on Windows is evergreen Chromium, so there is nothing to
    // down-level. Source maps stay on so the drag path is debuggable from
    // devtools in a release build.
    sourcemap: true,
  },
})
