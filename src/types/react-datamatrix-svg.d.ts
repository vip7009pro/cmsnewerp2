/**
 * Shim type cho `react-datamatrix-svg`.
 *
 * Package CÓ trường `types` nhưng bản `exports` KHÔNG khai báo điều kiện `types`
 * (chỉ có `import`/`require`). Với `moduleResolution: "bundler"`/`"node16"`, TS đi theo
 * `exports` nên không tìm thấy khai báo ⇒ lỗi TS7016 ("implicitly has an 'any' type").
 *
 * Re-export nguyên khai báo type đi kèm package. Dùng đường dẫn TƯƠNG ĐỐI (không dùng
 * `paths` của tsconfig) vì `vite-tsconfig-paths()` sẽ áp cả `paths` vào lúc build ⇒
 * bundle sẽ trỏ nhầm vào file `.d.ts`.
 */
declare module "react-datamatrix-svg" {
  export * from "../../node_modules/react-datamatrix-svg/dist/react-datamatrix-svg";
  export { default } from "../../node_modules/react-datamatrix-svg/dist/react-datamatrix-svg";
}
