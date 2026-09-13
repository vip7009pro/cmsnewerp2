import React from "react";
import { ColDef } from "ag-grid-community";

const formatNumber = (val: number | null | undefined, maxDigits = 0) => {
  if (val === null || val === undefined || isNaN(val)) return "0";
  return val.toLocaleString("en-US", { maximumFractionDigits: maxDigits });
};

// ============================================================================
// 1. CỘT MRP CHI TIẾT - CMS (THEO PO)
// ============================================================================
export const buildMRPTableCMS = (): ColDef[] => [
  {
    field: "CUST_CD",
    headerName: "MÃ KH",
    width: 80,
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => (
      <span className="tinhlieu-mono-chip">{params.value}</span>
    ),
  },
  {
    field: "CUST_NAME_KD",
    headerName: "TÊN KH",
    width: 95,
    resizable: true,
    floatingFilter: true,
    filter: true,
  },
  {
    field: "G_CODE",
    headerName: "MÃ ERP",
    width: 85,
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => (
      <span className="tinhlieu-mono-chip">{params.value}</span>
    ),
  },
  {
    field: "G_NAME_KD",
    headerName: "TÊN SẢN PHẨM",
    width: 140,
    resizable: true,
    floatingFilter: true,
    filter: true,
  },
  {
    field: "M_CODE",
    headerName: "MÃ VL",
    width: 80,
    resizable: true,
    floatingFilter: true,
    filter: true,
  },
  {
    field: "M_NAME",
    headerName: "TÊN VẬT LIỆU",
    width: 130,
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => (
      <span className="tinhlieu-mono-chip" style={{ color: "#2563eb", background: "#eff6ff" }}>
        {params.value}
      </span>
    ),
  },
  {
    field: "WIDTH_CD",
    headerName: "KHỔ",
    width: 65,
    resizable: true,
    floatingFilter: true,
    filter: true,
  },
  {
    field: "PO_NO",
    headerName: "SỐ PO",
    width: 110,
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => (
      <span className="tinhlieu-mono-chip">{params.value}</span>
    ),
  },
  {
    field: "PO_QTY",
    headerName: "SL PO",
    width: 90,
    cellDataType: "number",
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => {
      const v = Number(params.value) || 0;
      return (
        <span className={`tinhlieu-qty ${v < 0 ? "tinhlieu-qty--negative" : "tinhlieu-qty--neutral"}`}>
          {formatNumber(v)}
        </span>
      );
    },
  },
  {
    field: "DELIVERY_QTY",
    headerName: "ĐÃ GIAO",
    width: 90,
    cellDataType: "number",
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => {
      const v = Number(params.value) || 0;
      return (
        <span className="tinhlieu-qty tinhlieu-qty--positive">{formatNumber(v)}</span>
      );
    },
  },
  {
    field: "PO_BALANCE",
    headerName: "TỒN PO",
    width: 90,
    cellDataType: "number",
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => {
      const v = Number(params.value) || 0;
      return (
        <span className={`tinhlieu-qty ${v < 0 ? "tinhlieu-qty--negative" : "tinhlieu-qty--primary"}`}>
          {formatNumber(v)}
        </span>
      );
    },
  },
  { field: "PD", headerName: "PD", width: 50, resizable: true },
  { field: "CAVITY_COT", headerName: "CV CỘT", width: 70, resizable: true },
  { field: "CAVITY_HANG", headerName: "CV HÀNG", width: 70, resizable: true },
  { field: "CAVITY", headerName: "TỔNG CV", width: 70, resizable: true },
  {
    field: "NEED_M_QTY",
    headerName: "NHU CẦU LIỆU",
    width: 120,
    cellDataType: "number",
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => {
      const v = Number(params.value) || 0;
      return (
        <span className={`tinhlieu-qty ${v < 0 ? "tinhlieu-qty--negative" : "tinhlieu-qty--primary"}`} style={{ fontSize: 12 }}>
          {formatNumber(v)}
        </span>
      );
    },
  },
];

// ============================================================================
// 2. CỘT MRP CHI TIẾT - PVN / YCSX
// ============================================================================
export const buildMRPTablePVN = (): ColDef[] => [
  {
    field: "PROD_REQUEST_NO",
    headerName: "SỐ YCSX",
    width: 100,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => {
      const isY = params.data?.MATERIAL_YN === "Y";
      return (
        <span
          className="tinhlieu-mono-chip"
          style={{
            color: isY ? "#1d4ed8" : "#be123c",
            background: isY ? "#eff6ff" : "#fff1f2",
            borderColor: isY ? "#bfdbfe" : "#fecdd3",
          }}
        >
          {params.value}
        </span>
      );
    },
  },
  { field: "PROD_REQUEST_DATE", headerName: "NGÀY YCSX", width: 90, resizable: true, floatingFilter: true, filter: true },
  { field: "CUST_CD", headerName: "MÃ KH", width: 80, resizable: true, floatingFilter: true, filter: true },
  { field: "CUST_NAME_KD", headerName: "TÊN KH", width: 95, resizable: true, floatingFilter: true, filter: true },
  { field: "G_CODE", headerName: "MÃ ERP", width: 85, resizable: true, floatingFilter: true, filter: true },
  { field: "G_NAME_KD", headerName: "TÊN SẢN PHẨM", width: 130, resizable: true, floatingFilter: true, filter: true },
  { field: "M_CODE", headerName: "MÃ VL", width: 80, resizable: true, floatingFilter: true, filter: true },
  {
    field: "M_NAME",
    headerName: "TÊN VẬT LIỆU",
    width: 130,
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => (
      <span className="tinhlieu-mono-chip" style={{ color: "#2563eb", background: "#eff6ff" }}>
        {params.value}
      </span>
    ),
  },
  { field: "WIDTH_CD", headerName: "KHỔ", width: 65, resizable: true },
  {
    field: "PROD_REQUEST_QTY",
    headerName: "SL YCSX",
    width: 90,
    cellDataType: "number",
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => {
      const v = Number(params.value) || 0;
      return (
        <span className={`tinhlieu-qty ${v < 0 ? "tinhlieu-qty--negative" : "tinhlieu-qty--neutral"}`}>
          {formatNumber(v)}
        </span>
      );
    },
  },
  { field: "PD", headerName: "PD", width: 50, resizable: true },
  { field: "CAVITY_COT", headerName: "CV CỘT", width: 70, resizable: true },
  { field: "CAVITY_HANG", headerName: "CV HÀNG", width: 70, resizable: true },
  { field: "CAVITY", headerName: "TỔNG CV", width: 70, resizable: true },
  {
    field: "NEED_M_QTY",
    headerName: "NHU CẦU LIỆU",
    width: 120,
    cellDataType: "number",
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => {
      const v = Number(params.value) || 0;
      return (
        <span className={`tinhlieu-qty ${v < 0 ? "tinhlieu-qty--negative" : "tinhlieu-qty--primary"}`} style={{ fontSize: 12 }}>
          {formatNumber(v)}
        </span>
      );
    },
  },
  {
    field: "MATERIAL_YN",
    headerName: "TRẠNG THÁI LIỆU",
    width: 120,
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => {
      const val = params.data?.MATERIAL_YN;
      if (val === "Y") {
        return <span className="tinhlieu-status tinhlieu-status--yes">ĐÃ MỞ (YES)</span>;
      }
      if (val === "N") {
        return <span className="tinhlieu-status tinhlieu-status--no">ĐANG KHÓA (NO)</span>;
      }
      return <span className="tinhlieu-status tinhlieu-status--pending">CHỜ (PENDING)</span>;
    },
  },
];

// ============================================================================
// 3. CỘT MRP TỔNG HỢP (SUMMARY)
// ============================================================================
export const buildMRPTableSummary = (): ColDef[] => [
  {
    field: "M_CODE",
    headerName: "MÃ VẬT LIỆU",
    width: 100,
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => (
      <span className="tinhlieu-mono-chip">{params.value}</span>
    ),
  },
  {
    field: "M_NAME",
    headerName: "TÊN VẬT LIỆU",
    width: 180,
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => (
      <span className="tinhlieu-mono-chip" style={{ color: "#2563eb", background: "#eff6ff" }}>
        {params.value}
      </span>
    ),
  },
  {
    field: "WIDTH_CD",
    headerName: "KHỔ RỘNG (mm)",
    width: 110,
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => (
      <span className="tinhlieu-mono-chip">{params.value}</span>
    ),
  },
  {
    field: "NEED_M_QTY",
    headerName: "TỔNG NHU CẦU",
    width: 130,
    cellDataType: "number",
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => {
      const v = Number(params.value) || 0;
      return (
        <span className="tinhlieu-qty tinhlieu-qty--primary" style={{ fontSize: 12 }}>
          {formatNumber(v)}
        </span>
      );
    },
  },
  {
    field: "STOCK_M",
    headerName: "TỒN KHO THỰC TẾ",
    width: 130,
    cellDataType: "number",
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => {
      const v = Number(params.value) || 0;
      return (
        <span className={`tinhlieu-qty ${v < 0 ? "tinhlieu-qty--negative" : "tinhlieu-qty--positive"}`}>
          {formatNumber(v)}
        </span>
      );
    },
  },
  {
    field: "HOLDING_M",
    headerName: "LƯỢNG GIỮ (HOLD)",
    width: 130,
    cellDataType: "number",
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => {
      const v = Number(params.value) || 0;
      return (
        <span className="tinhlieu-qty tinhlieu-qty--neutral">
          {formatNumber(v)}
        </span>
      );
    },
  },
  {
    field: "M_SHORTAGE",
    headerName: "LƯỢNG THIẾU CẦN MUA",
    width: 160,
    cellDataType: "number",
    resizable: true,
    floatingFilter: true,
    filter: true,
    cellRenderer: (params: any) => {
      const v = Number(params.value) || 0;
      if (v > 0) {
        return (
          <span className="tinhlieu-qty tinhlieu-qty--negative" style={{ fontSize: 12.5 }}>
            ⚠️ Thiếu {formatNumber(v)}
          </span>
        );
      }
      return (
        <span className="tinhlieu-qty tinhlieu-qty--positive">
          ✓ Đủ tồn kho
        </span>
      );
    },
  },
];

// ============================================================================
// 4. CỘT MRP KẾ HOẠCH 15 NGÀY (PLAN 15D)
// ============================================================================
export const buildMRPTablePlan = (): ColDef[] => {
  const baseCols: ColDef[] = [
    {
      field: "CUST_NAME_KD",
      headerName: "VENDOR",
      width: 100,
      resizable: true,
      floatingFilter: true,
      filter: true,
      headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    {
      field: "M_NAME",
      headerName: "TÊN VL",
      width: 120,
      resizable: true,
      floatingFilter: true,
      filter: true,
      cellRenderer: (params: any) => (
        <span className="tinhlieu-mono-chip" style={{ color: "#2563eb", background: "#eff6ff" }}>
          {params.value}
        </span>
      ),
    },
    { field: "WIDTH_CD", headerName: "SIZE", width: 60, resizable: true },
    { field: "M_CODE", headerName: "M_CODE", width: 80, resizable: true, floatingFilter: true, filter: true },
    {
      field: "M_INIT_WH_STOCK",
      headerName: "TP_STOCK",
      width: 85,
      cellDataType: "number",
      cellRenderer: (params: any) => (
        <span className="tinhlieu-qty tinhlieu-qty--positive">{formatNumber(params.value)}</span>
      ),
    },
    {
      field: "M_INIT_INSP_STOCK",
      headerName: "CK_STOCK",
      width: 85,
      cellDataType: "number",
      cellRenderer: (params: any) => (
        <span className="tinhlieu-qty tinhlieu-qty--positive">{formatNumber(params.value)}</span>
      ),
    },
    {
      field: "M_INIT_BTP_STOCK",
      headerName: "BTP_STOCK",
      width: 85,
      cellDataType: "number",
      cellRenderer: (params: any) => (
        <span className="tinhlieu-qty tinhlieu-qty--positive">{formatNumber(params.value)}</span>
      ),
    },
    {
      field: "RAW_M_STOCK",
      headerName: "VL_STOCK",
      width: 85,
      cellDataType: "number",
      cellRenderer: (params: any) => (
        <span className="tinhlieu-qty tinhlieu-qty--positive">{formatNumber(params.value)}</span>
      ),
    },
    {
      field: "M_BTP_QTY",
      headerName: "CURR_BTP",
      width: 85,
      cellDataType: "number",
      cellRenderer: (params: any) => (
        <span className="tinhlieu-qty tinhlieu-qty--neutral">{formatNumber(params.value)}</span>
      ),
    },
    {
      field: "M_TONKIEM_QTY",
      headerName: "CURR_CK",
      width: 85,
      cellDataType: "number",
      cellRenderer: (params: any) => (
        <span className="tinhlieu-qty tinhlieu-qty--neutral">{formatNumber(params.value)}</span>
      ),
    },
    {
      field: "M_STOCK_QTY",
      headerName: "CURR_TP",
      width: 85,
      cellDataType: "number",
      cellRenderer: (params: any) => (
        <span className="tinhlieu-qty tinhlieu-qty--neutral">{formatNumber(params.value)}</span>
      ),
    },
    {
      field: "TOTAL_STOCK",
      headerName: "TOTAL_STOCK",
      width: 100,
      cellDataType: "number",
      cellRenderer: (params: any) => (
        <span className="tinhlieu-qty tinhlieu-qty--primary" style={{ fontSize: 12 }}>
          {formatNumber(params.value)}
        </span>
      ),
    },
  ];

  // Tạo 15 cột MD1 đến MD15 với logic so sánh lũy kế
  for (let d = 1; d <= 15; d++) {
    const fieldName = `MD${d}`;
    baseCols.push({
      field: fieldName,
      headerName: `D${d}`,
      width: 60,
      cellDataType: "number",
      resizable: true,
      cellRenderer: (params: any) => {
        const val = Number(params.data?.[fieldName]) || 0;
        let cumulative = 0;
        for (let i = 1; i <= d; i++) {
          cumulative += Number(params.data?.[`MD${i}`]) || 0;
        }
        const totalStock = Number(params.data?.TOTAL_STOCK) || 0;
        const isShortage = cumulative > totalStock;

        return (
          <div className={`tinhlieu-plan-cell ${isShortage ? "tinhlieu-plan-cell--shortage" : "tinhlieu-plan-cell--ok"}`}>
            {formatNumber(val)}
          </div>
        );
      },
    });
  }

  return baseCols;
};
