import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import ViteCompressionPlugin from 'vite-plugin-compression';

// https://vitejs.dev/config/
// Plugin CHẨN ĐOÁN (chỉ dùng khi cần soi bundle): in ra top module theo KB trong entry chunk.
// Bật bằng biến môi trường: $env:ANALYZE_BUNDLE=1; npm run build
const analyzeBundlePlugin = () => ({
  name: 'analyze-bundle',
  generateBundle(_opts: any, bundle: any) {
    if (!process.env.ANALYZE_BUNDLE) return;
    for (const [name, ch] of Object.entries<any>(bundle)) {
      if (ch.type !== 'chunk' || !ch.isEntry) continue;
      const mods = Object.entries<any>(ch.modules)
        .map(([id, m]) => ({ id, kb: Math.round((m.renderedLength || 0) / 1024) }))
        .sort((a, b) => b.kb - a.kb)
        .slice(0, 30);
      console.log(`\n[ANALYZE] entry chunk ${name} (${Math.round(ch.code.length / 1024)} KB)`);
      for (const m of mods) {
        console.log(`   ${String(m.kb).padStart(6)} KB  ${m.id.replace(/^.*node_modules[\\/]/, 'nm:').slice(0, 110)}`);
      }
    }
  },
}) as any;

export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin(),
    analyzeBundlePlugin(),
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
        // ===== KHÔNG dùng manualChunks nữa (quyết định 2026-09-21 sau khi đo) =====
        // Lịch sử: bản cũ gom mọi node_modules không khớp rule vào 1 chunk 'vendor' (~9.6 MB)
        // => entry kéo theo cả monaco-editor/socket.io/lodash/moment/sweetalert2... dù chỉ dùng ở page lazy.
        // Bản thử tiếp theo (gom từng nhóm thủ công) vẫn bị: chunk 'vendor-mui'/'vendor-dx' do Rollup
        // tạo ra lại trở thành static dep của entry (đo được: entry -> z3rAlkf5.js -> nozJKXpV.js 6.5 MB,
        // và index.html vẫn link dx.light.css 774 KB), trong khi ở dev graph khởi động ĐÃ SẠCH DevExtreme.
        // => Trả quyền tách chunk cho Rollup: nó tách theo module graph, lib chỉ dùng ở page lazy sẽ
        //    nằm trong async chunk thay vì bị preload.
        // (giữ lại đây để tham chiếu nếu cần quay lại)
        // manualChunks(id) { ... }

        // entryFileNames/chunkFileNames giữ tên có hash để cache-busting hoạt động.
      },
    },
  },
});
