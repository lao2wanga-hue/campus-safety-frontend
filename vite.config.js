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
    // ⭐ 强制更改文件名（添加时间戳）
    rollupOptions: {
      output: {
        entryFileNames: `static/[name]-[hash]-v4.js`,
        chunkFileNames: `static/[name]-[hash]-v4.js`,
        assetFileNames: `static/[name]-[hash]-v4.[ext]`
      }
    },
    chunkSizeWarningLimit: 2000
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'https://localhost:8080',
        changeOrigin: true
      }
    }
  }
})