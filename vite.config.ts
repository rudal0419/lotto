
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vercel 환경 변수에서 가져온 API_KEY를 클라이언트 코드에 주입
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
