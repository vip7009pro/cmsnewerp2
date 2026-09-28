import { useEffect, useRef } from "react";

/**
 * Hook cầu nối GridApi của AG Grid lên component cha (trang).
 *
 * Dùng cho nút `EX1 (Đang lọc)`: trang cần GridApi để đọc đúng các dòng
 * đang hiển thị (`getDisplayedGridRows`) thay vì mảng dữ liệu React đã lọc.
 *
 * Cách dùng trong component bọc bảng:
 * ```tsx
 * const gridRef = useAgGridApiBridge(onGridApiReady);
 * ...
 * <AGTable ref={gridRef} ... />
 * ```
 *
 * @param onGridApiReady Callback nhận GridApi (chạy lại mỗi lần render để luôn
 *                       trỏ tới api mới nhất sau khi lưới re-init).
 */
export const useAgGridApiBridge = (onGridApiReady?: (gridApi: any) => void) => {
  const gridRef = useRef<any>(null);

  useEffect(() => {
    if (onGridApiReady && gridRef.current?.api) {
      onGridApiReady(gridRef.current.api);
    }
  });

  return gridRef;
};
