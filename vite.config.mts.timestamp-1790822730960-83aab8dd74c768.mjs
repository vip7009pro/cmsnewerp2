// vite.config.mts
import { defineConfig } from "file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/node_modules/vite/dist/node/index.js";
import react from "file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/node_modules/@vitejs/plugin-react/dist/index.mjs";
import viteTsconfigPaths from "file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/node_modules/vite-tsconfig-paths/dist/index.js";
import svgrPlugin from "file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/node_modules/vite-plugin-svgr/dist/index.js";
import ViteCompressionPlugin from "file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/node_modules/vite-plugin-compression/dist/index.mjs";
var analyzeBundlePlugin = () => ({
  name: "analyze-bundle",
  generateBundle(_opts, bundle) {
    if (!process.env.ANALYZE_BUNDLE) return;
    for (const [name, ch] of Object.entries(bundle)) {
      if (ch.type !== "chunk" || !ch.isEntry) continue;
      const mods = Object.entries(ch.modules).map(([id, m]) => ({ id, kb: Math.round((m.renderedLength || 0) / 1024) })).sort((a, b) => b.kb - a.kb).slice(0, 30);
      console.log(`
[ANALYZE] entry chunk ${name} (${Math.round(ch.code.length / 1024)} KB)`);
      for (const m of mods) {
        console.log(`   ${String(m.kb).padStart(6)} KB  ${m.id.replace(/^.*node_modules[\\/]/, "nm:").slice(0, 110)}`);
      }
    }
  }
});
var vite_config_default = defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin(),
    analyzeBundlePlugin(),
    ViteCompressionPlugin({
      verbose: true,
      disable: false,
      threshold: 10240,
      // Adjust the threshold based on your needs (10kb in this example)
      algorithm: "gzip"
      // Use 'brotli' for Brotli compression
    })
  ],
  optimizeDeps: {
    include: [
      "@mui/material",
      "@mui/material/styles",
      "@mui/icons-material",
      "@emotion/react",
      "@emotion/styled"
    ]
  },
  build: {
    chunkSizeWarningLimit: 1e3,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Tùy chỉnh tên file, chỉ lấy id mà không có tên file gốc
        entryFileNames: "assets/[hash].js",
        chunkFileNames: "assets/[hash].js",
        assetFileNames: "assets/[hash].[extname]"
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
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRzpcXFxcTk9ERUpTXFxcXFdFQkNNUyBFUlAyXFxcXGNtc25ld2VycDJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkc6XFxcXE5PREVKU1xcXFxXRUJDTVMgRVJQMlxcXFxjbXNuZXdlcnAyXFxcXHZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRzovTk9ERUpTL1dFQkNNUyUyMEVSUDIvY21zbmV3ZXJwMi92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XHJcbmltcG9ydCB2aXRlVHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xyXG5pbXBvcnQgc3ZnclBsdWdpbiBmcm9tIFwidml0ZS1wbHVnaW4tc3ZnclwiO1xyXG5pbXBvcnQgVml0ZUNvbXByZXNzaW9uUGx1Z2luIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbi8vIFBsdWdpbiBDSFx1MUVBOE4gXHUwMTEwT1x1MDBDMU4gKGNoXHUxRUM5IGRcdTAwRjluZyBraGkgY1x1MUVBN24gc29pIGJ1bmRsZSk6IGluIHJhIHRvcCBtb2R1bGUgdGhlbyBLQiB0cm9uZyBlbnRyeSBjaHVuay5cclxuLy8gQlx1MUVBRHQgYlx1MUVCMW5nIGJpXHUxRUJGbiBtXHUwMEY0aSB0clx1MDFCMFx1MUVERG5nOiAkZW52OkFOQUxZWkVfQlVORExFPTE7IG5wbSBydW4gYnVpbGRcclxuY29uc3QgYW5hbHl6ZUJ1bmRsZVBsdWdpbiA9ICgpID0+ICh7XHJcbiAgbmFtZTogJ2FuYWx5emUtYnVuZGxlJyxcclxuICBnZW5lcmF0ZUJ1bmRsZShfb3B0czogYW55LCBidW5kbGU6IGFueSkge1xyXG4gICAgaWYgKCFwcm9jZXNzLmVudi5BTkFMWVpFX0JVTkRMRSkgcmV0dXJuO1xyXG4gICAgZm9yIChjb25zdCBbbmFtZSwgY2hdIG9mIE9iamVjdC5lbnRyaWVzPGFueT4oYnVuZGxlKSkge1xyXG4gICAgICBpZiAoY2gudHlwZSAhPT0gJ2NodW5rJyB8fCAhY2guaXNFbnRyeSkgY29udGludWU7XHJcbiAgICAgIGNvbnN0IG1vZHMgPSBPYmplY3QuZW50cmllczxhbnk+KGNoLm1vZHVsZXMpXHJcbiAgICAgICAgLm1hcCgoW2lkLCBtXSkgPT4gKHsgaWQsIGtiOiBNYXRoLnJvdW5kKChtLnJlbmRlcmVkTGVuZ3RoIHx8IDApIC8gMTAyNCkgfSkpXHJcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IGIua2IgLSBhLmtiKVxyXG4gICAgICAgIC5zbGljZSgwLCAzMCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGBcXG5bQU5BTFlaRV0gZW50cnkgY2h1bmsgJHtuYW1lfSAoJHtNYXRoLnJvdW5kKGNoLmNvZGUubGVuZ3RoIC8gMTAyNCl9IEtCKWApO1xyXG4gICAgICBmb3IgKGNvbnN0IG0gb2YgbW9kcykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGAgICAke1N0cmluZyhtLmtiKS5wYWRTdGFydCg2KX0gS0IgICR7bS5pZC5yZXBsYWNlKC9eLipub2RlX21vZHVsZXNbXFxcXC9dLywgJ25tOicpLnNsaWNlKDAsIDExMCl9YCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG59KSBhcyBhbnk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCB2aXRlVHNjb25maWdQYXRocygpLCBzdmdyUGx1Z2luKCksXHJcbiAgICBhbmFseXplQnVuZGxlUGx1Z2luKCksXHJcbiAgICBWaXRlQ29tcHJlc3Npb25QbHVnaW4oe1xyXG4gICAgICB2ZXJib3NlOiB0cnVlLFxyXG4gICAgICBkaXNhYmxlOiBmYWxzZSxcclxuICAgICAgdGhyZXNob2xkOiAxMDI0MCwgLy8gQWRqdXN0IHRoZSB0aHJlc2hvbGQgYmFzZWQgb24geW91ciBuZWVkcyAoMTBrYiBpbiB0aGlzIGV4YW1wbGUpXHJcbiAgICAgIGFsZ29yaXRobTogJ2d6aXAnLCAvLyBVc2UgJ2Jyb3RsaScgZm9yIEJyb3RsaSBjb21wcmVzc2lvblxyXG4gICAgfSksICBcclxuICBdLFxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgaW5jbHVkZTogW1xyXG4gICAgICAnQG11aS9tYXRlcmlhbCcsXHJcbiAgICAgICdAbXVpL21hdGVyaWFsL3N0eWxlcycsXHJcbiAgICAgICdAbXVpL2ljb25zLW1hdGVyaWFsJyxcclxuICAgICAgJ0BlbW90aW9uL3JlYWN0JyxcclxuICAgICAgJ0BlbW90aW9uL3N0eWxlZCcsXHJcbiAgICBdLFxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCxcclxuICAgIHNvdXJjZW1hcDogZmFsc2UsXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIC8vIFRcdTAwRjl5IGNoXHUxRUM5bmggdFx1MDBFQW4gZmlsZSwgY2hcdTFFQzkgbFx1MUVBNXkgaWQgbVx1MDBFMCBraFx1MDBGNG5nIGNcdTAwRjMgdFx1MDBFQW4gZmlsZSBnXHUxRUQxY1xyXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnYXNzZXRzL1toYXNoXS5qcycsXHJcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvW2hhc2hdLmpzJyxcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9baGFzaF0uW2V4dG5hbWVdJyxcclxuICAgICAgICAvKiBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLltleHRuYW1lXScsICovXHJcbiAgICAgICAgLy8gPT09PT0gS0hcdTAwRDRORyBkXHUwMEY5bmcgbWFudWFsQ2h1bmtzIG5cdTFFRUZhIChxdXlcdTFFQkZ0IFx1MDExMVx1MUVDQm5oIDIwMjYtMDktMjEgc2F1IGtoaSBcdTAxMTFvKSA9PT09PVxyXG4gICAgICAgIC8vIExcdTFFQ0JjaCBzXHUxRUVEOiBiXHUxRUEzbiBjXHUwMTY5IGdvbSBtXHUxRUNEaSBub2RlX21vZHVsZXMga2hcdTAwRjRuZyBraFx1MUVEQnAgcnVsZSB2XHUwMEUwbyAxIGNodW5rICd2ZW5kb3InICh+OS42IE1CKVxyXG4gICAgICAgIC8vID0+IGVudHJ5IGtcdTAwRTlvIHRoZW8gY1x1MUVBMyBtb25hY28tZWRpdG9yL3NvY2tldC5pby9sb2Rhc2gvbW9tZW50L3N3ZWV0YWxlcnQyLi4uIGRcdTAwRjkgY2hcdTFFQzkgZFx1MDBGOW5nIFx1MUVERiBwYWdlIGxhenkuXHJcbiAgICAgICAgLy8gQlx1MUVBM24gdGhcdTFFRUQgdGlcdTFFQkZwIHRoZW8gKGdvbSB0XHUxRUVCbmcgbmhcdTAwRjNtIHRoXHUxRUU3IGNcdTAwRjRuZykgdlx1MUVBQm4gYlx1MUVDQjogY2h1bmsgJ3ZlbmRvci1tdWknLyd2ZW5kb3ItZHgnIGRvIFJvbGx1cFxyXG4gICAgICAgIC8vIHRcdTFFQTFvIHJhIGxcdTFFQTFpIHRyXHUxRURGIHRoXHUwMEUwbmggc3RhdGljIGRlcCBjXHUxRUU3YSBlbnRyeSAoXHUwMTExbyBcdTAxMTFcdTAxQjBcdTFFRTNjOiBlbnRyeSAtPiB6M3JBbGtmNS5qcyAtPiBub3pKS1hwVi5qcyA2LjUgTUIsXHJcbiAgICAgICAgLy8gdlx1MDBFMCBpbmRleC5odG1sIHZcdTFFQUJuIGxpbmsgZHgubGlnaHQuY3NzIDc3NCBLQiksIHRyb25nIGtoaSBcdTFFREYgZGV2IGdyYXBoIGtoXHUxRURGaSBcdTAxMTFcdTFFRDluZyBcdTAxMTBcdTAwQzMgU1x1MUVBMENIIERldkV4dHJlbWUuXHJcbiAgICAgICAgLy8gPT4gVHJcdTFFQTMgcXV5XHUxRUMxbiB0XHUwMEUxY2ggY2h1bmsgY2hvIFJvbGx1cDogblx1MDBGMyB0XHUwMEUxY2ggdGhlbyBtb2R1bGUgZ3JhcGgsIGxpYiBjaFx1MUVDOSBkXHUwMEY5bmcgXHUxRURGIHBhZ2UgbGF6eSBzXHUxRUJEXHJcbiAgICAgICAgLy8gICAgblx1MUVCMW0gdHJvbmcgYXN5bmMgY2h1bmsgdGhheSB2XHUwMEVDIGJcdTFFQ0IgcHJlbG9hZC5cclxuICAgICAgICAvLyAoZ2lcdTFFRUYgbFx1MUVBMWkgXHUwMTExXHUwMEUyeSBcdTAxMTFcdTFFQzMgdGhhbSBjaGlcdTFFQkZ1IG5cdTFFQkZ1IGNcdTFFQTduIHF1YXkgbFx1MUVBMWkpXHJcbiAgICAgICAgLy8gbWFudWFsQ2h1bmtzKGlkKSB7IC4uLiB9XHJcblxyXG4gICAgICAgIC8vIGVudHJ5RmlsZU5hbWVzL2NodW5rRmlsZU5hbWVzIGdpXHUxRUVGIHRcdTAwRUFuIGNcdTAwRjMgaGFzaCBcdTAxMTFcdTFFQzMgY2FjaGUtYnVzdGluZyBob1x1MUVBMXQgXHUwMTExXHUxRUQ5bmcuXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThSLFNBQVMsb0JBQW9CO0FBQzNULE9BQU8sV0FBVztBQUNsQixPQUFPLHVCQUF1QjtBQUM5QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLDJCQUEyQjtBQUtsQyxJQUFNLHNCQUFzQixPQUFPO0FBQUEsRUFDakMsTUFBTTtBQUFBLEVBQ04sZUFBZSxPQUFZLFFBQWE7QUFDdEMsUUFBSSxDQUFDLFFBQVEsSUFBSSxlQUFnQjtBQUNqQyxlQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssT0FBTyxRQUFhLE1BQU0sR0FBRztBQUNwRCxVQUFJLEdBQUcsU0FBUyxXQUFXLENBQUMsR0FBRyxRQUFTO0FBQ3hDLFlBQU0sT0FBTyxPQUFPLFFBQWEsR0FBRyxPQUFPLEVBQ3hDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxJQUFJLEtBQUssT0FBTyxFQUFFLGtCQUFrQixLQUFLLElBQUksRUFBRSxFQUFFLEVBQ3pFLEtBQUssQ0FBQyxHQUFHLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUMxQixNQUFNLEdBQUcsRUFBRTtBQUNkLGNBQVEsSUFBSTtBQUFBLHdCQUEyQixJQUFJLEtBQUssS0FBSyxNQUFNLEdBQUcsS0FBSyxTQUFTLElBQUksQ0FBQyxNQUFNO0FBQ3ZGLGlCQUFXLEtBQUssTUFBTTtBQUNwQixnQkFBUSxJQUFJLE1BQU0sT0FBTyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxRQUFRLHdCQUF3QixLQUFLLEVBQUUsTUFBTSxHQUFHLEdBQUcsQ0FBQyxFQUFFO0FBQUEsTUFDL0c7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQUMsTUFBTTtBQUFBLElBQUcsa0JBQWtCO0FBQUEsSUFBRyxXQUFXO0FBQUEsSUFDakQsb0JBQW9CO0FBQUEsSUFDcEIsc0JBQXNCO0FBQUEsTUFDcEIsU0FBUztBQUFBLE1BQ1QsU0FBUztBQUFBLE1BQ1QsV0FBVztBQUFBO0FBQUEsTUFDWCxXQUFXO0FBQUE7QUFBQSxJQUNiLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTO0FBQUEsTUFDUDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsdUJBQXVCO0FBQUEsSUFDdkIsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBO0FBQUEsUUFFTixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFnQmxCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
