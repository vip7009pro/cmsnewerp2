import Swal from "sweetalert2";
import { SaveExcel } from "../../../../api/services/excelService";

/**
 * Xuất Excel CHỈ các dòng đang hiển thị sau khi lọc/sắp xếp trên AG Grid.
 * Khôi phục đúng ngữ nghĩa nút EX1 của AGTable (bản legacy dùng forEachNodeAfterFilter).
 * Key của file xuất theo headerName nên giữ được thông tin ngày D1..D15 (DD/MM) khi tra 1 ngày.
 */
export const exportFilteredRowsToExcel = (
  gridApi: any,
  fallbackData: any[],
  fileName: string
) => {
  if (!gridApi) {
    if (!fallbackData || fallbackData.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    SaveExcel(fallbackData, fileName);
    return;
  }

  const displayedColumns = (gridApi.getColumnDefs() || [])
    .filter((col: any) => col && col.field && col.hide !== true)
    .map((col: any) => ({
      field: col.field as string,
      headerName: (col.headerName || col.field) as string,
    }));

  const rows: any[] = [];
  gridApi.forEachNodeAfterFilterAndSort((node: any) => {
    const row: any = {};
    displayedColumns.forEach((col) => {
      row[col.headerName] = node.data?.[col.field];
    });
    rows.push(row);
  });

  if (rows.length === 0) {
    Swal.fire("Thông báo", "Không có dòng nào đang hiển thị để xuất Excel", "warning");
    return;
  }
  SaveExcel(rows, fileName);
};
