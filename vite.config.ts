import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      // 공개 페이지만 HTML 진입점을 만든다. /labs/* 는 개발 서버에서만 접근한다.
      input: {
        main: 'index.html',
        resume: 'resume/index.html',
        guidelines: 'guidelines/index.html',
        terminal: 'terminal/index.html',
      },
    },
  },
})
