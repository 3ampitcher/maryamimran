import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* Builds the whole site as ONE bundle so it can be inlined into a single
   self-contained .html file (see scripts/build-standalone.mjs). Code
   splitting and CSS splitting are off; dynamic imports resolve in-bundle. */
export default defineConfig({
  plugins: [react()],
  define: { 'import.meta.env.VITE_ROUTER': JSON.stringify('hash') },
  build: {
    outDir: 'dist-standalone',
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
})
