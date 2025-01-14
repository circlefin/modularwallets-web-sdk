import { defineConfig } from 'tsup'

import packageJson from './package.json'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  define: {
    SDK_VERSION: JSON.stringify(packageJson.version),
  },
})
