import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Add Node.js polyfills for browser environment
    nodePolyfills({
      // Whether to polyfill specific globals (Buffer, process, etc.)
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill specific modules (path, events, etc.)
      protocolImports: true,
    }),
  ],
  optimizeDeps: {
    include: ["bip39"],
  },
}) 
