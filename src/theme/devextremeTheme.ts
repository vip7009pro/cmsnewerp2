/**
 * DevExtreme theme CSS (≈774 KB minified, ~100 KB gzip) — CHỈ cần thiết cho các widget
 * DevExtreme thật (PivotGrid, Chart, DataGrid).
 *
 * TRƯỚC ĐÂY: `import "devextreme/dist/css/dx.light.css"` nằm ở `src/App.tsx` nên Vite đưa nó
 * vào <head> của index.html ⇒ CSS render-blocking cho MỌI người dùng, kể cả màn hình đăng nhập
 * (nơi không có widget DevExtreme nào).
 *
 * BÂY GIỜ: chỉ những module có render widget DevExtreme mới import file này. CSS sẽ được bundler
 * đưa vào chunk CSS dùng chung của nhóm đó (lazy) thay vì nằm trong initial payload.
 *
 * ⚠️ Nếu thêm một widget DevExtreme mới ở nơi khác, nhớ import module này vào file đó.
 */
import "devextreme/dist/css/dx.light.css";
