import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Keep the framework and the motion library in their own long-lived
        // chunks so content edits don't invalidate them.
        advancedChunks: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router)/ },
            { name: 'motion', test: /node_modules[\\/](framer-)?motion/ },
          ],
        },
      },
    },
  },
})
