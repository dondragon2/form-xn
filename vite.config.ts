import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts()],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    sourcemap: true,
    minify: true,
    copyPublicDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'FormXN',
      formats: ['es'],
      fileName: 'index.js',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@remix-run/node',
        '@remix-run/react',
        'yup',
        'zod',
      ],
    },
  },
});
