import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: '3000',
    open: true, 
    base: "./ ",
    proxy: {
      '^/api': {
        target: 'http://xxx.xxx.xxx.xxx:9999',
        changeOrigin: true, //开启代理
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
