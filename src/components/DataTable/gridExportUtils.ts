/**
 * Tiện ích xuất Excel dùng chung cho các bảng AG Grid (AGTable).
 *
 * VẤN ĐỀ: Nút `EX1 (Đang lọc)` trước đây xuất mảng dữ liệu do React đã lọc
 * (vd `filteredData`). Mảng này CHỈ phản ánh bộ lọc state của trang, KHÔNG phản
 * ánh:
 *   - Quick filter / ô tìm kiếm gắn trực tiếp vào AG Grid
 *   - Floating filter theo từng cột (`showFilter`)
 *   - Sắp xếp (sort) trên header
 * ⇒ File xuất ra bị đủ dòng so với những gì người dùng đang thấy trên lưới.
 *
 * GIẢI PHÁP: đọc trực tiếp các node đang hiển thị qua GridApi của AG Grid.
 */

/**
 * Lấy danh sách các dòng ĐANG HIỂN THỊ trên lưới
 * (đã áp quick filter + floating filter theo cột + sort).
 *
 * @param gridApi GridApi của AG Grid (có thể null nếu lưới chưa sẵn sàng).
 * @param fallback Mảng dự phòng khi không đọc được GridApi (tránh xuất file rỗng).
 */
export const getDisplayedGridRows = <T = any>(
  gridApi: any,
  fallback: T[] = []
): T[] => {
  if (!gridApi || typeof gridApi.forEachNodeAfterFilterAndSort !== "function") {
    return fallback;
  }

  const rows: T[] = [];
  gridApi.forEachNodeAfterFilterAndSort((node: any) => {
    if (node?.data) rows.push(node.data as T);
  });

  // Ưu tiên dữ liệu lưới; chỉ fallback khi lưới thực sự rỗng (tránh race lúc mount).
  return rows.length > 0 ? rows : fallback;
};
