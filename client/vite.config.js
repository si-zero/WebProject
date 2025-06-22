// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  // ✅ Vercel에서는 아래 설정이 매우 중요
  server: {
    port: 5173
  },
  // ✅ 아래가 없으면 SPA 라우팅에서 404 뜰 수 있음
  resolve: {
    alias: {
      '@': '/src',
    },
  }
})