import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Math-Snap/',
  server: {
    port: 5577,
    strictPort: true, // Fail if port is already in use, ensuring it's independent
  }
});
