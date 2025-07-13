import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import path  from 'path';

export default defineConfig({
  base: '/mail/',
  plugins: [
    // 1️⃣ Plugin “pre” para transformar tus .js como JSX
    {
      name: 'treat-js-as-jsx',
      enforce: 'pre',
      async transform(code, id) {
        // Sólo .js de tu carpeta src (ajusta la ruta si hace falta)
        if (!/\/src\/.*\.js$/.test(id)) return null;
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',   // usa runtime automático de React 17+/18+
        });
      },
    },
    // 2️⃣ Plugin oficial de React (trae Fast Refresh, Babel si lo necesitas, etc.)
    react(),
  ],

  // 3️⃣ Forzar al pre-bundler (optimizeDeps) a tratar .js como JSX
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
    // force: true, // opcional: fuerza re-optimización siempre
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    port: 3000,
    proxy: {
      '/mail/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: 'build',
  },
});
