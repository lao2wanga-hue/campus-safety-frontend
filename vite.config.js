import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: '/campus-safety-frontend/',
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    sourcemap: false,
    minify: 'esbuild',
    // 强制生成新 hash
    rollupOptions: {
      output: {
        entryFileNames: 'static/[name]-[hash]-v5.js',
        chunkFileNames: 'static/[name]-[hash]-v5.js',
        assetFileNames: 'static/[name]-[hash]-v5.[ext]'
      }
    },
    chunkSizeWarningLimit: 2000
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})