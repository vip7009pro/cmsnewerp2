import React from "react";

export const renderCheckStatusCell = (params: any) => {
  const status = params.data?.CHECKSTATUS;
  if (status === "OK") {
    return (
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#059669",
          color: "#ffffff",
          fontWeight: 700,
          borderRadius: 3,
          padding: "2px 8px",
          fontSize: "11px",
        }}
      >
        OK
      </div>
    );
  } else if (status === "NG") {
    return (
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#e11d48",
          color: "#ffffff",
          fontWeight: 700,
          borderRadius: 3,
          padding: "2px 8px",
          fontSize: "11px",
        }}
      >
        NG
      </div>
    );
  } else {
    return (
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#4f46e5",
          color: "#ffffff",
          fontWeight: 700,
          borderRadius: 3,
          padding: "2px 8px",
          fontSize: "11px",
        }}
      >
        {status || "Waiting"}
      </div>
    );
  }
};

/**
 * 44 Cột mặc định theo đúng form Excel cần upload từ bản gốc UpHangLoat.tsx
 */
export const DEFAULT_BULK_EXCEL_COLUMNS: any[] = [
  { field: "CUST_CD", headerName: "CUST_CD", width: 80 },
  { field: "PROD_PROJECT", headerName: "PROD_PROJECT", width: 90 },
  { field: "PROD_MODEL", headerName: "PROD_MODEL", width: 90 },
  { field: "CODE_12", headerName: "CODE_12", width: 80 },
  { field: "CODE_27", headerName: "CODE_27", width: 80 },
  { field: "SEQ_NO", headerName: "SEQ_NO", width: 80 },
  { field: "REV_NO", headerName: "REV_NO", width: 80 },
  { field: "G_CODE", headerName: "G_CODE", width: 85 },
  { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 85 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 100 },
  { field: "DESCR", headerName: "DESCR", width: 180 },
  { field: "PROD_MAIN_MATERIAL", headerName: "PROD_MAIN_MATERIAL", width: 130 },
  { field: "G_NAME", headerName: "G_NAME", width: 180 },
  { field: "G_LENGTH", headerName: "G_LENGTH", width: 80 },
  { field: "G_WIDTH", headerName: "G_WIDTH", width: 80 },
  { field: "PD", headerName: "PD", width: 80 },
  { field: "G_C", headerName: "G_C", width: 60 },
  { field: "G_C_R", headerName: "G_C_R", width: 60 },
  { field: "G_SG_L", headerName: "G_SG_L", width: 60 },
  { field: "G_SG_R", headerName: "G_SG_R", width: 60 },
  { field: "G_CG", headerName: "G_CG", width: 60 },
  { field: "G_LG", headerName: "G_LG", width: 60 },
  { field: "PACK_DRT", headerName: "PACK_DRT", width: 80 },
  { field: "KNIFE_TYPE", headerName: "KNIFE_TYPE", width: 85 },
  { field: "KNIFE_LIFECYCLE", headerName: "KNIFE_LIFECYCLE", width: 110 },
  { field: "KNIFE_PRICE", headerName: "KNIFE_PRICE", width: 90 },
  { field: "CODE_33", headerName: "CODE_33", width: 80 },
  { field: "ROLE_EA_QTY", headerName: "ROLE_EA_QTY", width: 95 },
  { field: "RPM", headerName: "RPM", width: 80 },
  { field: "PIN_DISTANCE", headerName: "PIN_DISTANCE", width: 95 },
  { field: "PROCESS_TYPE", headerName: "PROCESS_TYPE", width: 95 },
  { field: "EQ1", headerName: "EQ1", width: 75 },
  { field: "EQ2", headerName: "EQ2", width: 75 },
  { field: "EQ3", headerName: "EQ3", width: 75 },
  { field: "EQ4", headerName: "EQ4", width: 75 },
  { field: "PROD_DIECUT_STEP", headerName: "PROD_DIECUT_STEP", width: 125 },
  { field: "PROD_PRINT_TIMES", headerName: "PROD_PRINT_TIMES", width: 125 },
  { field: "REMK", headerName: "REMK", width: 100 },
  { field: "USE_YN", headerName: "USE_YN", width: 80 },
  { field: "PO_TYPE", headerName: "PO_TYPE", width: 80 },
  { field: "FSC", headerName: "FSC", width: 80 },
  { field: "PROD_DVT", headerName: "PROD_DVT", width: 80 },
  { field: "FSC_CODE", headerName: "FSC_CODE", width: 90 },
  {
    field: "CHECKSTATUS",
    headerName: "CHECKSTATUS",
    width: 110,
    pinned: "right",
    cellRenderer: renderCheckStatusCell,
  },
];

/**
 * Tạo danh sách cột linh hoạt theo các keys đọc từ file Excel thực tế
 */
export const getDynamicBulkExcelColumns = (keys: string[]): any[] => {
  const dynamicCols = keys
    .filter((k) => k !== "CHECKSTATUS" && k !== "id")
    .map((key) => ({
      field: key,
      headerName: key,
      width: key === "DESCR" || key === "G_NAME" ? 180 : key.length > 12 ? 130 : 90,
    }));

  dynamicCols.push({
    field: "CHECKSTATUS",
    headerName: "CHECKSTATUS",
    width: 110,
    pinned: "right",
    cellRenderer: renderCheckStatusCell,
  });

  return dynamicCols;
};
