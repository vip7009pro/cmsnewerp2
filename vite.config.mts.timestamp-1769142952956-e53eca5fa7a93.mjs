// vite.config.mts
import { defineConfig } from "file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/node_modules/vite/dist/node/index.js";
import react from "file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/node_modules/@vitejs/plugin-react/dist/index.mjs";
import viteTsconfigPaths from "file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/node_modules/vite-tsconfig-paths/dist/index.js";
import svgrPlugin from "file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/node_modules/vite-plugin-svgr/dist/index.js";
import ViteCompressionPlugin from "file:///G:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/node_modules/vite-plugin-compression/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin(),
    ViteCompressionPlugin({
      verbose: true,
      disable: false,
      threshold: 10240,
      // Adjust the threshold based on your needs (10kb in this example)
      algorithm: "gzip"
      // Use 'brotli' for Brotli compression
    })
  ],
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Tùy chỉnh tên file, chỉ lấy id mà không có tên file gốc
        entryFileNames: "assets/[hash].js",
        chunkFileNames: "assets/[hash].js",
        assetFileNames: "assets/[hash][extname]"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRzpcXFxcTk9ERUpTXFxcXFdFQkNNUyBFUlAyXFxcXGNtc25ld2VycDJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkc6XFxcXE5PREVKU1xcXFxXRUJDTVMgRVJQMlxcXFxjbXNuZXdlcnAyXFxcXHZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRzovTk9ERUpTL1dFQkNNUyUyMEVSUDIvY21zbmV3ZXJwMi92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XHJcbmltcG9ydCB2aXRlVHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xyXG5pbXBvcnQgc3ZnclBsdWdpbiBmcm9tIFwidml0ZS1wbHVnaW4tc3ZnclwiO1xyXG5pbXBvcnQgVml0ZUNvbXByZXNzaW9uUGx1Z2luIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJztcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCksIHZpdGVUc2NvbmZpZ1BhdGhzKCksIHN2Z3JQbHVnaW4oKSxcclxuICAgIFZpdGVDb21wcmVzc2lvblBsdWdpbih7XHJcbiAgICAgIHZlcmJvc2U6IHRydWUsXHJcbiAgICAgIGRpc2FibGU6IGZhbHNlLFxyXG4gICAgICB0aHJlc2hvbGQ6IDEwMjQwLCAvLyBBZGp1c3QgdGhlIHRocmVzaG9sZCBiYXNlZCBvbiB5b3VyIG5lZWRzICgxMGtiIGluIHRoaXMgZXhhbXBsZSlcclxuICAgICAgYWxnb3JpdGhtOiAnZ3ppcCcsIC8vIFVzZSAnYnJvdGxpJyBmb3IgQnJvdGxpIGNvbXByZXNzaW9uXHJcbiAgICB9KSwgIFxyXG4gIF0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNTAwLFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAvLyBUXHUwMEY5eSBjaFx1MUVDOW5oIHRcdTAwRUFuIGZpbGUsIGNoXHUxRUM5IGxcdTFFQTV5IGlkIG1cdTAwRTAga2hcdTAwRjRuZyBjXHUwMEYzIHRcdTAwRUFuIGZpbGUgZ1x1MUVEMWNcclxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9baGFzaF0uanMnLFxyXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL1toYXNoXS5qcycsXHJcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW2hhc2hdW2V4dG5hbWVdJyxcclxuXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThSLFNBQVMsb0JBQW9CO0FBQzNULE9BQU8sV0FBVztBQUNsQixPQUFPLHVCQUF1QjtBQUM5QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLDJCQUEyQjtBQUdsQyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFBQyxNQUFNO0FBQUEsSUFBRyxrQkFBa0I7QUFBQSxJQUFHLFdBQVc7QUFBQSxJQUNqRCxzQkFBc0I7QUFBQSxNQUNwQixTQUFTO0FBQUEsTUFDVCxTQUFTO0FBQUEsTUFDVCxXQUFXO0FBQUE7QUFBQSxNQUNYLFdBQVc7QUFBQTtBQUFBLElBQ2IsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLHVCQUF1QjtBQUFBLElBQ3ZCLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQTtBQUFBLFFBRU4sZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFFbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
