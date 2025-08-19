import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

  return {
    plugins: [
      react(),
      svgr()
    ],
    server: {
      allowedHosts: ['user226046612-vaohgcpr.tunnel.vk-apps.com/'],
      proxy: {
        '/auth': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false
        },
        '/users': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false
        },
        '/products': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false
        },
        '/recipes': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false
        },
        '/categories': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
