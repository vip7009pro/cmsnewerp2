// PrecisionINSPECTIONColumns.tsx - Cấu hình 8 bộ cột AG Grid cho phân hệ Kiểm Tra

import React from "react";

// Helper renderer số có phân tách hàng nghìn
export const renderNumber = (val: any, color: string = "#0f172a", bold: boolean = true) => {
  if (val === null || val === undefined) return "";
  return (
    <span style={{ color, fontWeight: bold ? 700 : 500, fontFamily: "monospace" }}>
      {Number(val).toLocaleString("en-US")}
    </span>
  );
};

// Helper renderer mã code link xanh
export const renderCodeLink = (val: any) => {
  if (!val) return "";
  return (
    <span style={{ color: "#2563eb", fontWeight: 600, cursor: "pointer" }}>
      {val}
    </span>
  );
};

// Helper renderer badge trạng thái
export const renderStatusBadge = (status: string) => {
  if (!status) return "";
  const s = status.toUpperCase();
  if (s === "PENDING" || s === "CHỜ KIỂM") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", padding: "1px 6px", borderRadius: "9999px", fontSize: "10px", fontWeight: 700, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}>
        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#2563eb", marginRight: "4px" }}></span>
        {status}
      </span>
    );
  }
  if (s === "PROGRS" || s === "ĐANG KIỂM") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", padding: "1px 6px", borderRadius: "9999px", fontSize: "10px", fontWeight: 700, background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a" }}>
        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#d97706", marginRight: "4px" }}></span>
        ĐANG NHẬP
      </span>
    );
  }
  if (s === "NG" || s.includes("CHỜ DUYỆT")) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", padding: "1px 6px", borderRadius: "9999px", fontSize: "10px", fontWeight: 700, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>
        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#dc2626", marginRight: "4px" }}></span>
        {status}
      </span>
    );
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "1px 6px", borderRadius: "9999px", fontSize: "10px", fontWeight: 700, background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0" }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#059669", marginRight: "4px" }}></span>
      {status}
    </span>
  );
};

// 1. CỘT NHẬP KIỂM (LOT)
export const column_inspect_input = [
  { field: "INSPECT_INPUT_ID", headerName: "ID", width: 85, headerCheckboxSelection: true, checkboxSelection: true },
  { field: "CUST_NAME_KD", headerName: "Khách", width: 100 },
  { field: "EMPL_NAME", headerName: "Nhân Viên", width: 130 },
  { field: "G_CODE", headerName: "G_CODE", width: 90, cellRenderer: (p: any) => renderCodeLink(p.value) },
  { field: "G_NAME", headerName: "Tên SP", width: 220 },
  { field: "INPUT_DATETIME", headerName: "Ngày nhập kiểm", width: 140 },
  { field: "INPUT_QTY_EA", headerName: "SL NHẬP EA", width: 110, cellRenderer: (p: any) => renderNumber(p.data.INPUT_QTY_EA, "#059669", true) },
  { field: "PROD_TYPE", headerName: "Loại", width: 75 },
  { field: "G_NAME_KD", headerName: "Tên KD", width: 130 },
  { field: "PROD_REQUEST_NO", headerName: "Số YC", width: 85 },
  { field: "PROD_REQUEST_DATE", headerName: "Ngày YC", width: 90 },
  { field: "PROD_REQUEST_QTY", headerName: "SL YC", width: 90, cellRenderer: (p: any) => renderNumber(p.data.PROD_REQUEST_QTY, "#64748b", false) },
  { field: "PROCESS_LOT_NO", headerName: "LOT SX", width: 95 },
  { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 100 },
  { field: "LOTNCC", headerName: "LOTNCC", width: 100 },
  { field: "PROD_DATETIME", headerName: "NGÀY SX", width: 140 },
  { field: "INPUT_QTY_KG", headerName: "SL NHẬP GRAM", width: 110, cellRenderer: (p: any) => renderNumber(p.data.INPUT_QTY_KG, "#64748b", false) },
  { field: "REMARK", headerName: "FACTORY", width: 80 },
  { field: "CNDB_ENCODES", headerName: "CNDB_ENCODES", width: 90 },
];

// 2. CỘT XUẤT KIỂM (LOT)
export const column_inspect_output = [
  { field: "INSPECT_OUTPUT_ID", headerName: "ID", width: 85, headerCheckboxSelection: true, checkboxSelection: true },
  { field: "CUST_NAME_KD", headerName: "Khách hàng", width: 120 },
  { field: "EMPL_NAME", headerName: "Nhân viên", width: 130 },
  { field: "G_CODE", headerName: "G_CODE", width: 90, cellRenderer: (p: any) => renderCodeLink(p.value) },
  { field: "G_NAME", headerName: "G_NAME", width: 180 },
  { field: "OUTPUT_DATETIME", headerName: "OUTPUT TIME", width: 140 },
  { field: "OUTPUT_QTY_EA", headerName: "OUTPUT QTY", width: 110, cellRenderer: (p: any) => renderNumber(p.data.OUTPUT_QTY_EA, "#059669", true) },
  { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 80 },
  { field: "G_NAME_KD", headerName: "Code KD", width: 120 },
  { field: "PROD_REQUEST_NO", headerName: "Số YC", width: 85 },
  { field: "PROD_REQUEST_DATE", headerName: "Ngày YC", width: 90 },
  { field: "PROD_REQUEST_QTY", headerName: "SL YC", width: 90, cellRenderer: (p: any) => renderNumber(p.data.PROD_REQUEST_QTY, "#64748b", false) },
  { field: "PROCESS_LOT_NO", headerName: "LOT SX", width: 95 },
  { field: "PROD_DATETIME", headerName: "Ngày SX", width: 140 },
  { field: "REMARK", headerName: "REMARK", width: 80 },
  { field: "PIC_KD", headerName: "PIC_KD", width: 110 },
  { field: "CA_LAM_VIEC", headerName: "CA LV", width: 90 },
  { field: "NGAY_LAM_VIEC", headerName: "NGAY LV", width: 100 },
  { field: "STATUS", headerName: "NHẬP KHO", width: 120, cellRenderer: (p: any) => renderStatusBadge(p.data.STATUS) },
  { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 100 },
  { field: "LOTNCC", headerName: "LOTNCC", width: 100 },
];

// 3. CỘT NHẬP XUẤT KIỂM (YCSX)
export const column_inspect_inoutycsx = [
  { field: "PIC_KD", headerName: "PIC_KD", width: 130, headerCheckboxSelection: true, checkboxSelection: true },
  { field: "CUST_NAME_KD", headerName: "Khách", width: 110 },
  { field: "G_CODE", headerName: "G_CODE", width: 90, cellRenderer: (p: any) => renderCodeLink(p.value) },
  { field: "G_NAME", headerName: "G_NAME", width: 180 },
  { field: "G_NAME_KD", headerName: "Code KD", width: 120 },
  { field: "PROD_REQUEST_NO", headerName: "Số YC", width: 85 },
  { field: "PROD_REQUEST_DATE", headerName: "Ngày YC", width: 90 },
  { field: "PROD_REQUEST_QTY", headerName: "SL YC", width: 90, cellRenderer: (p: any) => renderNumber(p.data.PROD_REQUEST_QTY, "#1e293b", false) },
  { field: "LOT_TOTAL_INPUT_QTY_EA", headerName: "Nhập EA", width: 90, cellRenderer: (p: any) => renderNumber(p.data.LOT_TOTAL_INPUT_QTY_EA, "#2563eb", true) },
  { field: "LOT_TOTAL_OUTPUT_QTY_EA", headerName: "Xuất EA", width: 90, cellRenderer: (p: any) => renderNumber(p.data.LOT_TOTAL_OUTPUT_QTY_EA, "#2563eb", true) },
  { field: "DA_KIEM_TRA", headerName: "Đã Kiểm", width: 85, cellRenderer: (p: any) => renderNumber(p.data.DA_KIEM_TRA, "#64748b", false) },
  { field: "OK_QTY", headerName: "OK_QTY", width: 85, cellRenderer: (p: any) => renderNumber(p.data.OK_QTY, "#059669", true) },
  { field: "LOSS_NG_QTY", headerName: "Loss và NG", width: 90, cellRenderer: (p: any) => renderNumber(p.data.LOSS_NG_QTY, "#dc2626", true) },
  { field: "INSPECT_BALANCE", headerName: "Tồn kiểm", width: 90, cellRenderer: (p: any) => renderNumber(p.data.INSPECT_BALANCE, "#9333ea", true) },
];

// 4. CỘT NHẬT KÝ KIỂM TRA (NG & 32 MÃ LỖI)
export const column_inspection_NG = [
  { field: "INSPECT_ID", headerName: "INSPECT_ID", width: 100, headerCheckboxSelection: true, checkboxSelection: true },
  { field: "YEAR_WEEK", headerName: "YEAR_WEEK", width: 80 },
  { field: "CUST_NAME_KD", headerName: "Khách", width: 110 },
  { field: "PHANLOAI", headerName: "PHANLOAI", width: 80 },
  { field: "PROD_REQUEST_NO", headerName: "Số YC", width: 80 },
  { field: "G_NAME_KD", headerName: "Code KD", width: 110 },
  { field: "G_NAME", headerName: "Code full", width: 150 },
  { field: "G_CODE", headerName: "G_CODE", width: 85, cellRenderer: (p: any) => renderCodeLink(p.value) },
  { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 80 },
  { field: "M_LOT_NO", headerName: "LOT VL", width: 100 },
  { field: "LOTNCC", headerName: "LOTNCC", width: 100 },
  { field: "M_NAME", headerName: "M_NAME", width: 120 },
  { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 80 },
  { field: "INSPECTOR", headerName: "INSPECTOR", width: 90 },
  { field: "LINEQC", headerName: "LINEQC", width: 80 },
  { field: "PROD_PIC", headerName: "PROD_PIC", width: 80 },
  { field: "UNIT", headerName: "UNIT", width: 60 },
  { field: "PROCESS_LOT_NO", headerName: "LOT SX", width: 85 },
  { field: "PROCESS_IN_DATE", headerName: "NGÀY SX", width: 110 },
  { field: "INSPECT_DATETIME", headerName: "Ngày kiểm", width: 140 },
  { field: "INSPECT_START_TIME", headerName: "INSPECT_START_TIME", width: 140 },
  { field: "INSPECT_FINISH_TIME", headerName: "INSPECT_FINISH_TIME", width: 140 },
  { field: "FACTORY", headerName: "FACTORY", width: 80 },
  { field: "LINEQC_PIC", headerName: "LINEQC_PIC", width: 80 },
  { field: "MACHINE_NO", headerName: "MACHINE_NO", width: 80 },
  { field: "INSPECT_TOTAL_QTY", headerName: "Tổng Kiểm", width: 90, cellRenderer: (p: any) => renderNumber(p.value, "#0f172a", true) },
  { field: "INSPECT_OK_QTY", headerName: "Tổng OK", width: 90, cellRenderer: (p: any) => renderNumber(p.value, "#059669", true) },
  { field: "INSPECT_SPEED", headerName: "Tốc độ kiểm", width: 85 },
  { field: "INSPECT_TOTAL_LOSS_QTY", headerName: "Tổng Loss", width: 85, cellRenderer: (p: any) => renderNumber(p.value, "#d97706", false) },
  { field: "INSPECT_TOTAL_NG_QTY", headerName: "Tổng NG", width: 85, cellRenderer: (p: any) => renderNumber(p.value, "#dc2626", true) },
  { field: "MATERIAL_NG_QTY", headerName: "NG MATERIAL", width: 100 },
  { field: "PROCESS_NG_QTY", headerName: "NG PROCESS", width: 100 },
  { field: "PROD_PRICE", headerName: "PROD_PRICE", width: 90 },
  // ERR1 đến ERR32
  ...Array.from({ length: 32 }, (_, i) => ({
    field: `ERR${i + 1}`,
    headerName: `ERR${i + 1}`,
    width: 60,
  })),
  { field: "CNDB_ENCODES", headerName: "CNDB_ENCODES", width: 130 },
  { field: "TRU_DIEM", headerName: "TRU_DIEM", width: 100, editable: true },
];

// 5. CỘT TỒN KIỂM / CHỜ KIỂM (INSPECT BALANCE)
export const column_inspect_balance = [
  { field: "G_CODE", headerName: "G_CODE", width: 110, headerCheckboxSelection: true, checkboxSelection: true, cellRenderer: (p: any) => renderCodeLink(p.value) },
  { field: "G_NAME", headerName: "G_NAME", width: 160 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 150 },
  { field: "INSPECT_BALANCE_QTY", headerName: "TON_KIEM", width: 110, cellRenderer: (p: any) => renderNumber(p.data.INSPECT_BALANCE_QTY, "#0f172a", true) },
  { field: "WAIT_CS_QTY", headerName: "CHO_CS", width: 100, cellRenderer: (p: any) => renderNumber(p.data.WAIT_CS_QTY, "#0f172a", false) },
  { field: "WAIT_SORTING_RMA", headerName: "RMA_CHO_SORTING", width: 120, cellRenderer: (p: any) => renderNumber(p.data.WAIT_SORTING_RMA, "#0f172a", false) },
  { field: "TOTAL_WAIT", headerName: "TOTAL_WAIT", width: 110, cellRenderer: (p: any) => renderNumber(p.data.TOTAL_WAIT, "#2563eb", true) },
];

// 6. CỘT DATA PATROL
export const column_inspect_patrol = [
  { field: "INS_PATROL_ID", headerName: "INS_PATROL_ID", width: 110, headerCheckboxSelection: true, checkboxSelection: true },
  { field: "G_NAME", headerName: "G_NAME", width: 100 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 100 },
  { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 100 },
  { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 100 },
  { field: "PLAN_ID", headerName: "PLAN_ID", width: 80 },
  { field: "PROCESS_LOT_NO", headerName: "PROCESS_LOT_NO", width: 90 },
  { field: "G_CODE", headerName: "G_CODE", width: 85, cellRenderer: (p: any) => renderCodeLink(p.value) },
  { field: "ERR_CODE", headerName: "ERR_CODE", width: 80 },
  { field: "INSPECT_QTY", headerName: "INSPECT_QTY", width: 90, cellRenderer: (p: any) => renderNumber(p.value, "#0f172a", true) },
  { field: "DEFECT_QTY", headerName: "DEFECT_QTY", width: 90, cellRenderer: (p: any) => renderNumber(p.value, "#dc2626", true) },
  { field: "DEFECT_PHENOMENON", headerName: "DEFECT_PHENOMENON", width: 130 },
  { field: "LINEQC_PIC", headerName: "LINEQC_PIC", width: 90 },
  { field: "INSP_PIC", headerName: "INSP_PIC", width: 90 },
  { field: "PROD_PIC", headerName: "PROD_PIC", width: 90 },
  { field: "INS_DATE", headerName: "INS_DATE", width: 90 },
  { field: "PHANLOAI", headerName: "PHANLOAI", width: 80 },
  { field: "REMARK", headerName: "REMARK", width: 80 },
  { field: "OCCURR_TIME", headerName: "OCCURR_TIME", width: 90 },
  { field: "LABEL_ID", headerName: "LABEL_ID", width: 80 },
  { field: "EQUIPMENT_CD", headerName: "EQUIPMENT_CD", width: 90 },
  { field: "CUST_CD", headerName: "CUST_CD", width: 80 },
  { field: "FACTORY", headerName: "FACTORY", width: 80 },
];

// 7. CỘT KHKT (KẾ HOẠCH KIỂM TRA)
export const column_khkt = [
  { field: "PLAN_DATE", headerName: "PLAN_DATE", width: 80, headerCheckboxSelection: true, checkboxSelection: true },
  { field: "FACTORY", headerName: "FACTORY", width: 65 },
  { field: "G_CODE", headerName: "G_CODE", width: 75, cellRenderer: (p: any) => renderCodeLink(p.value) },
  { field: "G_NAME", headerName: "G_NAME", width: 130 },
  { field: "INSPECT_SPEED", headerName: "INSPECT_SPEED", width: 85 },
  { field: "INS_STOCK_14H", headerName: "INS_STOCK_14H", width: 100 },
  { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 80 },
  { field: "UNIT", headerName: "UNIT", width: 60 },
  { field: "INIT_WH_STOCK", headerName: "INIT_WH_STOCK", width: 100 },
  { field: "PL_TG", headerName: "PL_TG", width: 80 },
  { field: "TONKIEM_QTY", headerName: "TONKIEM_QTY", width: 100 },
  { field: "KQ_D1", headerName: "KQ_D1", width: 60 },
  { field: "KQ_OK", headerName: "KQ_OK", width: 60 },
  { field: "INS_STOCK", headerName: "INS_STOCK", width: 70 },
  { field: "TON_THUA", headerName: "TON_THUA", width: 70 },
  { field: "D1_YESTD", headerName: "D1_YESTD", width: 70 },
  { field: "D2_YESTD", headerName: "D2_YESTD", width: 70 },
  { field: "OUTPUT_YESTD", headerName: "OUTPUT_YESTD", width: 90 },
  { field: "OUTPUT_QTY_EA", headerName: "OUTPUT_QTY_EA", width: 100 },
  { field: "D1", headerName: "D1", width: 60 },
  { field: "D2", headerName: "D2", width: 60 },
  { field: "D3", headerName: "D3", width: 60 },
  { field: "D4", headerName: "D4", width: 60 },
  { field: "D5", headerName: "D5", width: 60 },
  { field: "D6", headerName: "D6", width: 60 },
  { field: "D1D2_H", headerName: "D1D2_H", width: 80 },
  { field: "D1_H", headerName: "D1_H", width: 60 },
  { field: "D2_H", headerName: "D2_H", width: 60 },
  { field: "D3_H", headerName: "D3_H", width: 60 },
  { field: "D4_H", headerName: "D4_H", width: 60 },
  { field: "D5_H", headerName: "D5_H", width: 60 },
  { field: "D6_H", headerName: "D6_H", width: 60 },
  { field: "FINAL_INPUT", headerName: "FINAL_INPUT", width: 100 },
  { field: "INPUT_14_18H", headerName: "INPUT_14_18H", width: 100 },
  { field: "INPUT_18_2H", headerName: "INPUT_18_2H", width: 100 },
  { field: "INPUT_2_6H", headerName: "INPUT_2_6H", width: 100 },
  { field: "INPUT_6_10H", headerName: "INPUT_6_10H", width: 100 },
  { field: "BTP_QTY", headerName: "BTP_QTY", width: 80 },
  { field: "INPUT_14_18H_YESTD", headerName: "INPUT_14_18H_YESTD", width: 120 },
  { field: "INPUT_18_2H_YESTD", headerName: "INPUT_18_2H_YESTD", width: 120 },
  { field: "INPUT_2_6H_YESTD", headerName: "INPUT_2_6H_YESTD", width: 120 },
  { field: "INPUT_6_10H_YESTD", headerName: "INPUT_6_10H_YESTD", width: 120 },
  { field: "INPUT_10_14H_YESTD", headerName: "INPUT_10_14H_YESTD", width: 120 },
  { field: "TOTAL_INPUT_SAU_14H_YESTD", headerName: "TOTAL_INPUT_SAU_14H_YESTD", width: 150 },
  { field: "TOTAL_INPUT_SAU_14H", headerName: "TOTAL_INPUT_SAU_14H", width: 140 },
];

// 8. CỘT TEM LOT HISTORY
export const column_lothistory = [
  {
    field: "PROCESS_LOT_NO",
    headerName: "PROCESS_LOT_NO",
    width: 120,
    resizable: true,
    floatingFilter: true,
    filter: true,
    editable: false,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    cellStyle: (params: any) => {
      if (params.data.INS_STATUS === "E") {
        return { backgroundColor: "#ecfdf5", color: "#065f46", fontWeight: "bold" };
      } else {
        return { backgroundColor: "#fef2f2", color: "#991b1b", fontWeight: "bold" };
      }
    },
  },
  { field: "INS_STATUS", headerName: "INS_STATUS", width: 90, resizable: true, floatingFilter: true, filter: true, cellRenderer: (p: any) => renderStatusBadge(p.value) },
  { field: "G_NAME", headerName: "G_NAME", width: 110, resizable: true, floatingFilter: true, filter: true },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 110, resizable: true, floatingFilter: true, filter: true },
  { field: "DESCR", headerName: "DESCR", width: 100, resizable: true, floatingFilter: true, filter: true },
  { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 85, resizable: true, floatingFilter: true, filter: true },
  { field: "PROD_MAIN_MATERIAL", headerName: "PROD_MAIN_MATERIAL", width: 120, resizable: true, floatingFilter: true, filter: true },
  { field: "CTR_CD", headerName: "CTR_CD", width: 80, resizable: true, floatingFilter: true, filter: true },
  { field: "FACTORY", headerName: "FACTORY", width: 80, resizable: true, floatingFilter: true, filter: true },
  { field: "LOT_PRINT_DATE", headerName: "LOT_PRINT_DATE", width: 120, resizable: true, floatingFilter: true, filter: true },
  { field: "EMPL_NO", headerName: "EMPL_NO", width: 85, resizable: true, floatingFilter: true, filter: true },
  { field: "PACKING_QTY", headerName: "PACKING_QTY", width: 95, resizable: true, floatingFilter: true, filter: true, cellRenderer: (p: any) => renderNumber(p.value, "#0f172a", false) },
  { field: "LOT_QTY", headerName: "LOT_QTY", width: 85, resizable: true, floatingFilter: true, filter: true, cellRenderer: (p: any) => renderNumber(p.value, "#059669", true) },
  { field: "REMARK", headerName: "REMARK", width: 85, resizable: true, floatingFilter: true, filter: true },
  { field: "REMARK2", headerName: "REMARK2", width: 85, resizable: true, floatingFilter: true, filter: true },
  { field: "LABEL_ID", headerName: "LABEL_ID", width: 85, resizable: true, floatingFilter: true, filter: true },
  { field: "LINEQC_EMPL_NO", headerName: "LINEQC_EMPL_NO", width: 110, resizable: true, floatingFilter: true, filter: true },
  { field: "CNDB_ENCODES", headerName: "CNDB_ENCODES", width: 90, resizable: true, floatingFilter: true, filter: true },
  { field: "EXP_DATE", headerName: "EXP_DATE", width: 90, resizable: true, floatingFilter: true, filter: true },
  { field: "MFT_DATE", headerName: "MFT_DATE", width: 90, resizable: true, floatingFilter: true, filter: true },
  { field: "LABEL_ID2", headerName: "LABEL_ID2", width: 85, resizable: true, floatingFilter: true, filter: true },
  { field: "LABEL_SEQ", headerName: "LABEL_SEQ", width: 85, resizable: true, floatingFilter: true, filter: true },
  { field: "LABEL_ID_OLD", headerName: "LABEL_ID_OLD", width: 90, resizable: true, floatingFilter: true, filter: true },
  { field: "MFT_WEEK", headerName: "MFT_WEEK", width: 85, resizable: true, floatingFilter: true, filter: true },
  { field: "PLAN_ID", headerName: "PLAN_ID", width: 85, resizable: true, floatingFilter: true, filter: true },
  { field: "G_CODE", headerName: "G_CODE", width: 85, resizable: true, floatingFilter: true, filter: true, cellRenderer: (p: any) => renderCodeLink(p.value) },
  { field: "MACHINE_NO", headerName: "MACHINE_NO", width: 90, resizable: true, floatingFilter: true, filter: true },
  { field: "TABLE_NO", headerName: "TABLE_NO", width: 85, resizable: true, floatingFilter: true, filter: true },
  { field: "PO_TYPE", headerName: "PO_TYPE", width: 80, resizable: true, floatingFilter: true, filter: true },
  { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 100, resizable: true, floatingFilter: true, filter: true },
  { field: "LABEL_QTY_BY_DATE", headerName: "LABEL_QTY_BY_DATE", width: 110, resizable: true, floatingFilter: true, filter: true },
  { field: "G_EXP_DATE", headerName: "G_EXP_DATE", width: 95, resizable: true, floatingFilter: true, filter: true },
];
