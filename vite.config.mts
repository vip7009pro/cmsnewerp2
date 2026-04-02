import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import ViteCompressionPlugin from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin(),
    ViteCompressionPlugin({
      verbose: true,
      disable: false,
      threshold: 10240, // Adjust the threshold based on your needs (10kb in this example)
      algorithm: 'gzip', // Use 'brotli' for Brotli compression
    }),  
  ],
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/material/styles',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
    ],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Tùy chỉnh tên file, chỉ lấy id mà không có tên file gốc
        entryFileNames: 'assets/[hash].js',
        chunkFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[extname]',
        /* entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[extname]', */
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) return 'vendor-mui';
            if (id.includes('ag-grid')) return 'vendor-ag-grid';
            if (id.includes('devextreme')) return 'vendor-dx';
            if (id.includes('xlsx') || id.includes('exceljs')) return 'vendor-excel';
            if (id.includes('moment')) return 'vendor-moment';
            // Do not manual split react core
            if (id.includes('face-api.js')) return 'vendor-faceapi';
            if (id.includes('opencv-js')) return 'vendor-opencv';
            if (id.includes('recharts')) return 'vendor-recharts';
            if (id.includes('reactflow')) return 'vendor-reactflow';
            if (id.includes('jszip')) return 'vendor-jszip';
            return 'vendor';
          }
        }
      },
    },
  },
});
