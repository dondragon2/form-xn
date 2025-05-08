import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts()],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  build: {
    sourcemap: true,
    minify: true,
    lib: {
      entry: "src/index.ts",
      name: "FormXN",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
    },
  },
});
