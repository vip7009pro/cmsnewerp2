// PrecisionCodeManagerColumns.tsx - AG-Grid Column Definitions with Stitch Industrial Cell Renderers

import React from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FiDownload, FiFileText } from "react-icons/fi";
import { CODE_FULL_INFO } from "../interfaces/rndInterface";

interface GetColumnsParams {
  enableEdit: boolean;
  onUploadBanVe: (file: File, row: CODE_FULL_INFO) => void;
  onUploadAppSheet: (file: File, row: CODE_FULL_INFO) => void;
}

// Helper render cell trạng thái NG/Value
const renderNgCell = (params: any, fieldName: string) => {
  const val = params.data?.[fieldName];
  if (val === null || val === undefined || val === "") {
    return <span style={{ color: "#ef4444", fontWeight: 700 }}>NG</span>;
  }
  return <span style={{ fontWeight: 600 }}>{val}</span>;
};

export const getCodeManagerColumns = ({
  enableEdit,
  onUploadBanVe,
  onUploadAppSheet,
}: GetColumnsParams) => {
  const baseColumns: any[] = [
    {
      field: "id",
      headerName: "ID",
      width: 75,
      editable: enableEdit,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      pinned: "left",
    },
    {
      field: "G_CODE",
      headerName: "G_CODE",
      width: 95,
      editable: enableEdit,
      pinned: "left",
      cellRenderer: (params: any) => {
        const gCode = params.data?.G_CODE;
        if (!gCode) return null;
        return (
          <a
            className="cell-code-link"
            href={`/banve/${gCode}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            title={`Xem bản vẽ ${gCode}`}
          >
            {gCode}
          </a>
        );
      },
    },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      minWidth: 220,
      flex: 1,
      editable: enableEdit,
      cellRenderer: (params: any) => (
        <span style={{ fontWeight: 600, color: "#0f172a" }}>{params.data?.G_NAME}</span>
      ),
    },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 125,
      editable: enableEdit,
    },
    {
      field: "PROD_TYPE",
      headerName: "PROD_TYPE",
      width: 90,
      editable: enableEdit,
      cellRenderer: (params: any) => {
        const type = params.data?.PROD_TYPE;
        if (!type) return null;
        return (
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              padding: "1px 6px",
              borderRadius: "4px",
              backgroundColor: "#e0f2fe",
              color: "#0369a1",
              border: "1px solid #bae6fd",
            }}
          >
            {type}
          </span>
        );
      },
    },
    {
      field: "PACKING_TYPE",
      headerName: "PACKING_TYPE",
      width: 95,
      editable: enableEdit,
    },
    {
      field: "BEP",
      headerName: "BEP",
      width: 75,
      editable: enableEdit,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono", fontWeight: 600 }}>
          {params.data?.BEP != null ? Number(params.data.BEP).toLocaleString("en-US") : ""}
        </span>
      ),
    },
    {
      field: "PROD_LAST_PRICE",
      headerName: "PRICE",
      width: 85,
      editable: enableEdit,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono", fontWeight: 600, color: "#059669" }}>
          {params.data?.PROD_LAST_PRICE != null ? params.data.PROD_LAST_PRICE : ""}
        </span>
      ),
    },
    { field: "PD", headerName: "PD", width: 70, editable: enableEdit },
    { field: "CAVITY", headerName: "CAVITY", width: 70, editable: enableEdit },
    {
      field: "PACKING_QTY",
      headerName: "PACKING_QTY",
      width: 95,
      editable: enableEdit,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono", fontWeight: 600 }}>
          {params.data?.PACKING_QTY != null ? Number(params.data.PACKING_QTY).toLocaleString("en-US") : ""}
        </span>
      ),
    },
    {
      field: "G_WIDTH",
      headerName: "G_WIDTH",
      width: 75,
      editable: enableEdit,
    },
    {
      field: "G_LENGTH",
      headerName: "G_LENGTH",
      width: 75,
      editable: enableEdit,
    },
    {
      field: "PROD_PROJECT",
      headerName: "PROD_PROJECT",
      width: 120,
      editable: enableEdit,
    },
    {
      field: "PROD_MODEL",
      headerName: "PROD_MODEL",
      width: 120,
      editable: enableEdit,
    },
    {
      field: "M_NAME_FULLBOM",
      headerName: "FULLBOM",
      minWidth: 150,
      flex: 1,
      editable: enableEdit,
    },
    {
      field: "BANVE",
      headerName: "BẢN VẼ",
      width: 125,
      cellRenderer: (params: any) => {
        const row = params.data;
        if (row?.BANVE && row.BANVE !== "N") {
          return (
            <a
              className="cell-btn-download"
              href={`/banve/${row.G_CODE}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              title="Tải bản vẽ CAD / PDF"
            >
              <FiDownload size={11} />
              <span>Tải CAD</span>
            </a>
          );
        }

        return (
          <label className="cell-btn-upload" title="Upload bản vẽ PDF">
            <AiOutlineCloudUpload size={13} />
            <span>Upload</span>
            <input
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e: any) => {
                if (e.target.files?.[0]) {
                  onUploadBanVe(e.target.files[0], row);
                }
              }}
            />
          </label>
        );
      },
    },
    {
      field: "APPSHEET",
      headerName: "APPSHEET",
      width: 125,
      cellRenderer: (params: any) => {
        const row = params.data;
        if (row?.APPSHEET && row.APPSHEET !== "N") {
          return (
            <a
              className="cell-btn-download"
              style={{ backgroundColor: "#f0fdf4", color: "#16a34a", borderColor: "#bbf7d0" }}
              href={`/appsheet/Appsheet_${row.G_CODE}.docx`}
              target="_blank"
              rel="noopener noreferrer"
              title="Tải tệp AppSheet docx"
            >
              <FiFileText size={11} />
              <span>AppSheet</span>
            </a>
          );
        }

        return (
          <label className="cell-btn-upload" title="Upload tệp AppSheet docx">
            <AiOutlineCloudUpload size={13} />
            <span>Upload</span>
            <input
              type="file"
              accept=".docx"
              style={{ display: "none" }}
              onChange={(e: any) => {
                if (e.target.files?.[0]) {
                  onUploadAppSheet(e.target.files[0], row);
                }
              }}
            />
          </label>
        );
      },
    },
    {
      field: "NO_INSPECTION",
      headerName: "KT NGOẠI QUAN",
      width: 120,
      cellRenderer: (params: any) => {
        const noInspect = params.data?.NO_INSPECTION;
        if (noInspect !== "Y") {
          return <span className="cell-status-chip cell-status-chip--ok">Kiểm tra</span>;
        }
        return <span className="cell-status-chip cell-status-chip--ng">K.Kiểm tra</span>;
      },
    },
    {
      field: "USE_YN",
      headerName: "SỬ DỤNG",
      width: 85,
      cellRenderer: (params: any) => {
        const useYn = params.data?.USE_YN;
        if (useYn !== "Y") {
          return <span className="cell-status-chip cell-status-chip--ng">KHÓA</span>;
        }
        return <span className="cell-status-chip cell-status-chip--ok">MỞ</span>;
      },
    },
    {
      field: "PDBV",
      headerName: "PD BANVE",
      width: 95,
      cellRenderer: (params: any) => {
        const pdbv = params.data?.PDBV;
        if (pdbv === "P" || pdbv === "R" || pdbv === null || pdbv === undefined) {
          return <span className="cell-status-chip cell-status-chip--pending">PENDING</span>;
        }
        return <span className="cell-status-chip cell-status-chip--ok">APPROVED</span>;
      },
    },
    { field: "QL_HSD", headerName: "QL_HSD", width: 80 },
    { field: "EXP_DATE", headerName: "EXP_DATE", width: 90 },
    {
      field: "TENCODE",
      headerName: "TENCODE",
      minWidth: 150,
      cellRenderer: (params: any) => params.data?.G_NAME,
    },
    {
      field: "PROD_DIECUT_STEP",
      headerName: "BC DIECUT",
      width: 100,
      cellRenderer: (params: any) => renderNgCell(params, "PROD_DIECUT_STEP"),
    },
    {
      field: "PROD_PRINT_TIMES",
      headerName: "SO LAN IN",
      width: 95,
      cellRenderer: (params: any) => renderNgCell(params, "PROD_PRINT_TIMES"),
    },
    {
      field: "FACTORY",
      headerName: "FACTORY",
      width: 85,
      cellRenderer: (params: any) => renderNgCell(params, "FACTORY"),
    },
  ];

  // Các cột lặp lại của dây chuyền sản xuất: EQ1-4, Setting1-4, UPH1-4, Step1-4, LOSS_SX1-4, LOSS_SETTING1-4, LOSS_ST_SX1-4
  const groupFields = [
    { prefix: "EQ", count: 4, width: 75, header: "EQ" },
    { prefix: "Setting", count: 4, width: 85, header: "Setting" },
    { prefix: "UPH", count: 4, width: 75, header: "UPH" },
    { prefix: "Step", count: 4, width: 75, header: "Step" },
    { prefix: "LOSS_SX", count: 4, width: 95, header: "LOSS_SX", suffix: "(%)" },
    { prefix: "LOSS_SETTING", count: 4, width: 110, header: "LOSS_SETTING", suffix: "(m)" },
    { prefix: "LOSS_ST_SX", count: 4, width: 110, header: "LOSS_SETTING_SX", suffix: "(m)" },
  ];

  const generatedColumns: any[] = [];
  groupFields.forEach((group) => {
    for (let i = 1; i <= group.count; i++) {
      const field = `${group.prefix}${i}`;
      const headerName = `${group.header}${i}${group.suffix ? group.suffix : ""}`;
      generatedColumns.push({
        field,
        headerName,
        width: group.width,
        cellRenderer: (params: any) => renderNgCell(params, field),
      });
    }
  });

  const trailingColumns: any[] = [
    {
      field: "INSPECT_SPEED",
      headerName: "INSPECT_SPEED",
      width: 95,
      cellRenderer: (params: any) => (
        <span style={{ fontFamily: "JetBrains Mono", fontWeight: 700 }}>
          {params.data?.INSPECT_SPEED?.toLocaleString("en-US", { maximumFractionDigits: 0 }) ?? ""}
        </span>
      ),
    },
    { field: "NOTE", headerName: "NOTE", width: 150 },
  ];

  return [...baseColumns, ...generatedColumns, ...trailingColumns];
};
