import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: false,
  },
  server: {
    proxy: {
      '/api/clickup': {
        target: 'https://api.clickup.com/api/v2',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/clickup/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('Sending Request to ClickUp:', req.method, req.url);
          });
        },
      },
      '/api/deepseek': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/deepseek/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('Interacting with DeepSeek AI Agent...', req.method, req.url);
          });
        },
      },
    },
  },
})
