import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1800,
    // Vite 8 默认 lightningcss 会丢掉成对声明里的标准 backdrop-filter，
    // Chrome 只认未前缀写法，Vercel 生产毛玻璃会全没（vite#22649）。
    cssMinify: 'esbuild',
  },
})
