// incomingMobileFilter.ts - Helper lọc client-side dùng chung cho nhánh mobile INCOMING
// (mobile toolbar search + chip "Chờ KQ" + counter) => 1 nguồn sự thật, không lặp logic.
import { IQC_INCOMMING_DATA } from "../../interfaces/qcInterface";

/** Lô chưa có kết quả cuối cùng (TOTAL_RESULT rỗng hoặc "PD") */
export const isPendingLot = (row: IQC_INCOMMING_DATA): boolean => {
  const val = (row.TOTAL_RESULT || "").toUpperCase();
  return val !== "OK" && val !== "NG";
};

/** Khớp từ khóa tìm kiếm nhanh trên các cột định danh chính */
export const matchesIncomingSearch = (row: IQC_INCOMMING_DATA, query: string): boolean => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return Boolean(
    row.M_CODE?.toLowerCase().includes(q) ||
      row.M_NAME?.toLowerCase().includes(q) ||
      row.M_LOT_NO?.toLowerCase().includes(q) ||
      row.LOT_CMS?.toLowerCase().includes(q) ||
      row.LOT_VENDOR?.toLowerCase().includes(q) ||
      row.LOT_VENDOR_IQC?.toLowerCase().includes(q) ||
      row.CUST_CD?.toLowerCase().includes(q) ||
      row.CUST_NAME_KD?.toLowerCase().includes(q) ||
      row.TEST_EMPL?.toLowerCase().includes(q) ||
      row.REMARK?.toLowerCase().includes(q) ||
      String(row.NCR_ID ?? "").includes(q)
  );
};

export const filterIncomingRows = (
  rows: IQC_INCOMMING_DATA[],
  quickFilterText: string,
  onlyPending: boolean
): IQC_INCOMMING_DATA[] =>
  rows.filter((row) => matchesIncomingSearch(row, quickFilterText) && (!onlyPending || isPendingLot(row)));
