import React from "react";
import { ColDef } from "ag-grid-community";
import { MATERIAL_STATUS } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

// Danh mục các trường trạng thái công đoạn
const STAGE_FIELDS = new Set([
  "XUAT_KHO",
  "VAO_FR",
  "VAO_SR",
  "VAO_DC",
  "VAO_ED",
  "CONFIRM_GIAONHAN",
  "VAO_KIEM",
  "NHATKY_KT",
  "RETURN_IQC",
  "RETURN_KHO",
  "VAO_SX",
  "RA_KIEM",
]);

// Danh mục các trường số lượng mét
const MET_QTY_FIELDS = new Set([
  "TOTAL_OUT_QTY",
  "INSPECT_TOTAL_QTY",
  "INSPECT_OK_QTY",
  "INS_OUT",
  "ROLL_QTY",
  "OUT_CFM_QTY",
]);

// Danh mục các trường số lượng EA
const EA_QTY_FIELDS = new Set([
  "TOTAL_OUT_EA",
  "FR_EA",
  "SR_EA",
  "DC_EA",
  "ED_EA",
  "INSPECT_TOTAL_EA",
  "INSPECT_OK_EA",
  "INS_OUTPUT_EA",
]);

/**
 * Hàm sinh cấu hình cột AG-Grid High-Density cho Tình Hình Cuộn Liệu
 * Bảo toàn 100% headerName và field theo bản gốc
 */
export const buildCuonLieuColumns = (
  sampleRow?: MATERIAL_STATUS | null
): ColDef[] => {
  // Nếu có dòng dữ liệu mẫu, lấy keys từ sampleRow, ngược lại dùng danh sách mặc định
  const defaultKeys = [
    "id",
    "FIRST_INPUT_DATE",
    "INS_DATE",
    "FACTORY",
    "M_LOT_NO",
    "M_CODE",
    "M_NAME",
    "WIDTH_CD",
    "ROLL_QTY",
    "OUT_CFM_QTY",
    "TOTAL_OUT_QTY",
    "PROD_REQUEST_NO",
    "PLAN_ID",
    "PLAN_EQ",
    "G_CODE",
    "G_NAME",
    "XUAT_KHO",
    "VAO_FR",
    "VAO_SR",
    "VAO_DC",
    "VAO_ED",
    "CONFIRM_GIAONHAN",
    "VAO_KIEM",
    "NHATKY_KT",
    "RA_KIEM",
    "INSPECT_TOTAL_QTY",
    "INSPECT_OK_QTY",
    "INS_OUT",
    "ROLL_LOSS_KT",
    "ROLL_LOSS",
    "PD",
    "CAVITY",
    "FR_RESULT",
    "SR_RESULT",
    "DC_RESULT",
    "ED_RESULT",
    "TOTAL_OUT_EA",
    "FR_EA",
    "SR_EA",
    "DC_EA",
    "ED_EA",
    "INSPECT_TOTAL_EA",
    "INSPECT_OK_EA",
    "INS_OUTPUT_EA",
  ];

  const keysArray = sampleRow ? Object.keys(sampleRow) : defaultKeys;

  return keysArray.map((key) => {
    // 1. Cột ID & Checkbox
    if (key === "id") {
      return {
        field: key,
        headerName: "ID",
        width: 60,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        pinned: "left",
      };
    }

    // 2. Cột trạng thái công đoạn (Y / R / N)
    if (STAGE_FIELDS.has(key) || key.startsWith("VAO_")) {
      return {
        field: key,
        headerName: key,
        width: 70,
        cellRenderer: (params: any) => {
          const val = params.data?.[key];
          if (val === "Y") {
            return <span className="cuonlieu-badge cuonlieu-badge--pass">Y</span>;
          }
          if (val === "R") {
            return <span className="cuonlieu-badge cuonlieu-badge--warn">R</span>;
          }
          return <span className="cuonlieu-badge cuonlieu-badge--danger">N</span>;
        },
      };
    }

    // 3. Cột số lượng mét & kết quả
    if (MET_QTY_FIELDS.has(key) || key.includes("RESULT")) {
      return {
        field: key,
        headerName: key,
        width: 80,
        cellRenderer: (params: any) => {
          const val = params.data?.[key];
          if (val === null || val === undefined || isNaN(Number(val))) {
            return <span>{val}</span>;
          }
          return (
            <span className="cuonlieu-cell-num">
              {Number(val).toLocaleString("en-US")}
            </span>
          );
        },
      };
    }

    // 4. Cột số lượng EA
    if (EA_QTY_FIELDS.has(key) || key.endsWith("_EA")) {
      return {
        field: key,
        headerName: key,
        width: 80,
        cellRenderer: (params: any) => {
          const val = params.data?.[key];
          if (val === null || val === undefined || isNaN(Number(val))) {
            return <span>{val}</span>;
          }
          return (
            <span className="cuonlieu-cell-num ea">
              {Number(val).toLocaleString("en-US")}
            </span>
          );
        },
      };
    }

    // 5. Cột tỷ lệ tổn thất (%)
    if (key.includes("_LOSS")) {
      return {
        field: key,
        headerName: key,
        width: 80,
        cellRenderer: (params: any) => {
          const val = params.data?.[key];
          if (val === null || val === undefined || isNaN(Number(val))) {
            return <span>{val}</span>;
          }
          const numVal = Number(val) * 100;
          const isHigh = numVal >= 5;
          return (
            <span className={`cuonlieu-cell-num loss ${isHigh ? "high" : ""}`}>
              {numVal.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              %
            </span>
          );
        },
      };
    }

    // 6. Cột mã số, lot, ngày tháng (Monospace)
    if (
      key.includes("CODE") ||
      key.includes("LOT") ||
      key.includes("NO") ||
      key.includes("DATE") ||
      key.includes("PLAN_ID")
    ) {
      return {
        field: key,
        headerName: key,
        width: key.includes("DATE") ? 130 : key.includes("NAME") ? 120 : 90,
        cellRenderer: (params: any) => {
          const val = params.data?.[key];
          return <span className="cuonlieu-cell-code">{val}</span>;
        },
      };
    }

    // 7. Cột thông thường khác (giữ nguyên width: 70-80)
    return {
      field: key,
      headerName: key,
      width: 70,
      cellRenderer: (params: any) => <span>{params.data?.[key]}</span>,
    };
  });
};
