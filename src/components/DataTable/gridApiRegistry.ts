/**
 * Sổ đăng ký GridApi theo mảng `rowData` của AG Grid.
 *
 * VẤN ĐỀ
 * ------
 * Các trang ERP thường render nút `EX1 (Đang lọc / Hiển thị)` ở toolbar NGOÀI
 * `AGTable.tsx` (không dùng toolbar built-in). Handler của các nút đó chỉ có
 * mảng dữ liệu React (`filteredData`, `whdatatable`, ...) nên không đọc được:
 *   - Floating filter theo từng cột (AGTable bật `showFilter` mặc định)
 *   - Quick filter gắn vào grid
 *   - Sort trên header
 * ⇒ Bấm EX1 sau khi lọc/xóa lọc cho ra file sai (thiếu dòng, hoặc giữ lại đúng
 *   tập dòng của lần lọc trước).
 *
 * GIẢI PHÁP
 * ---------
 * `AGTable` tự đăng ký GridApi của mình theo CHÍNH mảng `data` mà trang truyền
 * vào. Các handler export chỉ cần gọi:
 *
 * ```ts
 * SaveExcel(getDisplayedGridRows(undefined, filteredData), "file");
 * ```
 *
 * Helper sẽ tự tìm GridApi tương ứng với mảng dữ liệu đó. Nếu không tìm thấy
 * (ví dụ dữ liệu chưa từng render trong grid), helper trả về chính mảng React —
 * đúng như hành vi cũ, nên không gây hồi quy.
 *
 * Dùng `WeakMap` để không giữ rác: khi mảng rowData bị giải phóng, entry tự mất.
 */

const gridApiByData = new WeakMap<object, any>();

/**
 * Gắn GridApi vào mảng rowData tương ứng.
 * Được gọi tự động từ `AGTable` khi grid sẵn sàng và mỗi khi `data` đổi.
 */
export const registerGridApiForData = (data: any, api: any): void => {
  if (!api || !Array.isArray(data)) return;
  gridApiByData.set(data, api);
};

/**
 * Lấy GridApi đã đăng ký cho một mảng rowData.
 * Trả về `undefined` nếu mảng này chưa từng (hoặc không còn) render trong AGTable.
 */
export const resolveGridApiForData = (data: any): any => {
  if (!Array.isArray(data)) return undefined;
  const api = gridApiByData.get(data);
  // Grid đã bị hủy (unmount / re-init) thì coi như không có.
  if (api && typeof api.isDestroyed === "function" && api.isDestroyed()) return undefined;
  return api;
};
