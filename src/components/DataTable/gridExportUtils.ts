/**
 * Tiện ích xuất Excel dùng chung cho các bảng AG Grid (AGTable).
 *
 * VẤN ĐỀ
 * ------
 * Các nút `EX1 (Đang lọc / Hiển thị)` nằm ở toolbar NGOÀI `AGTable.tsx` trước
 * đây xuất mảng dữ liệu do React đã lọc (vd `filteredData`). Mảng này CHỈ phản
 * ánh bộ lọc state của trang, KHÔNG phản ánh:
 *   - Quick filter / ô tìm kiếm gắn trực tiếp vào AG Grid
 *   - Floating filter theo từng cột (`showFilter`)
 *   - Sắp xếp (sort) trên header
 * ⇒ File xuất ra sai so với những gì người dùng đang thấy trên lưới, và khi
 *   người dùng xóa bộ lọc thì file vẫn giữ nguyên tập dòng cũ.
 *
 * GIẢI PHÁP
 * ---------
 * Đọc trực tiếp các node đang hiển thị qua GridApi của AG Grid.
 *
 * Có 2 cách truyền GridApi:
 *   1. Truyền tường minh: `getDisplayedGridRows(gridRef.current?.api, filteredData)`
 *   2. Truyền `undefined` — helper tự tra GridApi đã đăng ký cho chính mảng
 *      `fallback` (xem `gridApiRegistry.ts`). Dùng khi handler không có ref:
 *      `getDisplayedGridRows(undefined, filteredData)`.
 */

import { resolveGridApiForData } from "./gridApiRegistry";

/**
 * Kiểm tra filter model của AG Grid có thực sự đang lọc hay không.
 *
 * Sau khi người dùng xóa floating filter, AG Grid có thể vẫn giữ lại entry
 * rỗng trong một nhịp render, ví dụ:
 *   `{ G_NAME: { filterType: "text", type: "contains", filter: "" } }`
 * Nếu chỉ đếm số key thì sẽ tưởng "vẫn đang lọc" và tiếp tục trả về đúng tập
 * node cũ. Hàm này coi các entry rỗng/null là đã xóa.
 */
const hasMeaningfulFilterValue = (value: any): boolean => {
  if (value == null || value === "") return false;
  if (Array.isArray(value)) return value.some(hasMeaningfulFilterValue);
  if (typeof value !== "object") return true;

  return Object.entries(value).some(([key, entry]) => {
    // Metadata mô tả kiểu filter, không phải điều kiện lọc.
    if (key === "type" || key === "filterType" || key === "operator") return false;
    return hasMeaningfulFilterValue(entry);
  });
};

/**
 * Lấy danh sách các dòng ĐANG HIỂN THỊ trên lưới
 * (đã áp quick filter + floating filter theo cột + sort).
 *
 * @param gridApi  GridApi của AG Grid. Có thể truyền `undefined` để helper tự
 *                 tra theo mảng `fallback`.
 * @param fallback Mảng dữ liệu React tương ứng với `data` của lưới. Được dùng
 *                 khi: không tìm thấy GridApi, hoặc lưới không có bộ lọc nào
 *                 đang hoạt động (khi đó `rowData` hiện tại chính là dữ liệu
 *                 đang hiển thị).
 */
export const getDisplayedGridRows = <T = any>(
  gridApi: any,
  fallback: T[] = []
): T[] => {
  const api =
    gridApi && typeof gridApi.forEachNodeAfterFilterAndSort === "function"
      ? gridApi
      : resolveGridApiForData(fallback);

  // Không có GridApi ⇒ trả về mảng React hiện tại (hành vi cũ).
  if (!api || typeof api.forEachNodeAfterFilterAndSort !== "function") {
    return fallback;
  }

  const filterModel =
    typeof api.getFilterModel === "function" ? api.getFilterModel() : {};
  const quickFilter =
    typeof api.getQuickFilter === "function" ? api.getQuickFilter() : "";

  const hasGridFilter =
    hasMeaningfulFilterValue(filterModel) || Boolean(String(quickFilter ?? "").trim());

  // Không còn bộ lọc nào trên lưới ⇒ rowData hiện tại là nguồn đúng.
  // (Tránh mọi rủi ro snapshot cũ và tránh việc lưới chưa kịp re-apply filter.)
  if (!hasGridFilter) return fallback;

  const rows: T[] = [];
  api.forEachNodeAfterFilterAndSort((node: any) => {
    if (node?.data) rows.push(node.data as T);
  });

  // Đang có filter hoạt động thì mảng rỗng là kết quả hợp lệ — KHÔNG fallback
  // về dữ liệu React, vì như vậy EX1 sẽ xuất lại các dòng không đúng.
  return rows;
};
