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
});
