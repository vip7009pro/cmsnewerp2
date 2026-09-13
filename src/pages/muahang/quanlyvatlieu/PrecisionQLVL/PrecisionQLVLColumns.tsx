import React from "react";
import { ColDef } from "ag-grid-community";
import { FiFolder, FiUploadCloud } from "react-icons/fi";

interface ColumnOptions {
  company: string;
  onOpenDocDialog: (m_id: number, m_name: string) => void;
  onUploadTDS: (m_id: number, file: any) => void;
  onEditMaterial?: (material: any) => void;
}

const formatCurrency = (val: number | null | undefined) => {
  if (val === null || val === undefined) return "$0.00";
  return val.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const buildQLVLColumns = ({
  company,
  onOpenDocDialog,
  onUploadTDS,
  onEditMaterial,
}: ColumnOptions): ColDef[] => {
  const commonColumnsStart: ColDef[] = [
    {
      field: "M_ID",
      headerName: "M_ID",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 85,
      resizable: true,
      floatingFilter: true,
      rowDrag: true,
    },
    {
      field: "M_NAME",
      headerName: "MÃ VẬT LIỆU",
      width: 160,
      resizable: true,
      floatingFilter: true,
      filter: true,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span
            className="precision-qlvl-mname"
            onClick={(e) => {
              e.stopPropagation();
              if (onEditMaterial && params.data) {
                onEditMaterial(params.data);
              }
            }}
            title="Nhấp để cập nhật thông tin vật liệu"
          >
            {params.data?.M_NAME}
          </span>
        );
      },
    },
    {
      field: "DESCR",
      headerName: "MÔ TẢ (DESCR)",
      width: 140,
      resizable: true,
      floatingFilter: true,
      filter: true,
    },
    {
      field: "CUST_CD",
      headerName: "MÃ NCC",
      width: 85,
      resizable: true,
      floatingFilter: true,
      filter: true,
    },
    {
      field: "CUST_NAME_KD",
      headerName: "NHÀ CUNG CẤP",
      width: 120,
      resizable: true,
      floatingFilter: true,
      filter: true,
    },
    {
      field: "SSPRICE",
      headerName: "OPEN PRICE",
      width: 105,
      resizable: true,
      floatingFilter: true,
      filter: true,
      cellDataType: "number",
      cellRenderer: (params: any) => {
        return <span className="precision-qlvl-price">{formatCurrency(params.data?.SSPRICE)}</span>;
      },
    },
    {
      field: "CMSPRICE",
      headerName: "ORIGIN PRICE",
      width: 105,
      resizable: true,
      floatingFilter: true,
      filter: true,
      cellDataType: "number",
      cellRenderer: (params: any) => {
        return <span className="precision-qlvl-price">{formatCurrency(params.data?.CMSPRICE)}</span>;
      },
    },
    {
      field: "SLITTING_PRICE",
      headerName: "PHÍ SLITTING",
      width: 105,
      resizable: true,
      floatingFilter: true,
      filter: true,
      cellDataType: "number",
      cellRenderer: (params: any) => {
        return <span className="precision-qlvl-price">{formatCurrency(params.data?.SLITTING_PRICE)}</span>;
      },
    },
    {
      field: "MASTER_WIDTH",
      headerName: "WIDTH (mm)",
      width: 95,
      resizable: true,
      floatingFilter: true,
      filter: true,
      cellDataType: "number",
    },
    {
      field: "ROLL_LENGTH",
      headerName: "LENGTH (m)",
      width: 95,
      resizable: true,
      floatingFilter: true,
      filter: true,
      cellDataType: "number",
    },
    {
      field: "FSC",
      headerName: "FSC",
      width: 60,
      resizable: true,
      floatingFilter: true,
      filter: true,
      cellRenderer: (params: any) => {
        const isFsc = params.data?.FSC === "Y";
        return (
          <span className={`precision-qlvl-chip ${isFsc ? "precision-qlvl-chip--fsc" : ""}`}>
            {params.data?.FSC || "-"}
          </span>
        );
      },
    },
    {
      field: "FSC_CODE",
      headerName: "FSC CODE",
      width: 85,
      resizable: true,
      floatingFilter: true,
      filter: true,
    },
    {
      field: "FSC_NAME",
      headerName: "LOẠI FSC",
      width: 110,
      resizable: true,
      floatingFilter: true,
      filter: true,
    },
    {
      field: "USE_YN",
      headerName: "TRẠNG THÁI",
      width: 95,
      resizable: true,
      floatingFilter: true,
      filter: true,
      cellRenderer: (params: any) => {
        const isActive = params.data?.USE_YN !== "N";
        return (
          <span
            className={`precision-qlvl-chip ${
              isActive ? "precision-qlvl-chip--active" : "precision-qlvl-chip--locked"
            }`}
          >
            {isActive ? "USE (ÁP DỤNG)" : "LOCK (KHÓA)"}
          </span>
        );
      },
    },
    {
      field: "EXP_DATE",
      headerName: "HSD (Tháng)",
      width: 85,
      resizable: true,
      floatingFilter: true,
      filter: true,
    },
  ];

  // Cột đặc thù theo Công ty (CMS vs PVN)
  let specificColumns: ColDef[] = [];
  if (company === "CMS") {
    specificColumns = [
      {
        field: "DOC",
        headerName: "HỒ SƠ KỸ THUẬT",
        width: 95,
        resizable: true,
        cellRenderer: (params: any) => {
          return (
            <button
              type="button"
              className="precision-qlvl-chip precision-qlvl-chip--btn-docs"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDocDialog(params.data?.M_ID, params.data?.M_NAME);
              }}
              title="Xem và tải tài liệu kỹ thuật"
            >
              <FiFolder size={11} style={{ marginRight: 4 }} />
              <span>Docs</span>
            </button>
          );
        },
      },
      {
        field: "TDS_VER",
        headerName: "TDS",
        width: 75,
        resizable: true,
        cellRenderer: (params: any) => {
          if (params.data?.TDS_VER > 0) {
            return (
              <a
                className="precision-qlvl-chip precision-qlvl-chip--doc-ver"
                href={`/materialdocs/${params.data?.M_ID}_TDS_${params.data?.TDS_VER}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
              >
                v.{params.data?.TDS_VER}
              </a>
            );
          }
          return <span style={{ color: "#94a3b8" }}>-</span>;
        },
      },
      {
        field: "SGS_VER",
        headerName: "SGS",
        width: 75,
        resizable: true,
        cellRenderer: (params: any) => {
          if (params.data?.SGS_VER > 0) {
            return (
              <a
                className="precision-qlvl-chip precision-qlvl-chip--doc-ver"
                href={`/materialdocs/${params.data?.M_ID}_SGS_${params.data?.SGS_VER}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
              >
                v.{params.data?.SGS_VER}
              </a>
            );
          }
          return <span style={{ color: "#94a3b8" }}>-</span>;
        },
      },
      {
        field: "MSDS_VER",
        headerName: "MSDS",
        width: 75,
        resizable: true,
        cellRenderer: (params: any) => {
          if (params.data?.MSDS_VER > 0) {
            return (
              <a
                className="precision-qlvl-chip precision-qlvl-chip--doc-ver"
                href={`/materialdocs/${params.data?.M_ID}_MSDS_${params.data?.MSDS_VER}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
              >
                v.{params.data?.MSDS_VER}
              </a>
            );
          }
          return <span style={{ color: "#94a3b8" }}>-</span>;
        },
      },
    ];
  } else {
    // PVN
    specificColumns = [
      {
        field: "TDS",
        headerName: "TDS",
        width: 120,
        resizable: true,
        floatingFilter: true,
        filter: true,
        cellRenderer: (params: any) => {
          let selectedFile: any = null;
          if (params.data?.TDS === "Y") {
            return (
              <a
                className="precision-qlvl-chip precision-qlvl-chip--doc-ver"
                target="_blank"
                rel="noopener noreferrer"
                href={`/tds2/NVL_${params.data?.M_ID}.pdf`}
              >
                XEM PDF
              </a>
            );
          }
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input
                accept=".pdf"
                type="file"
                style={{ fontSize: 10, width: 85 }}
                onChange={(e: any) => {
                  selectedFile = e.target.files[0];
                }}
              />
              <button
                type="button"
                style={{
                  height: 20,
                  fontSize: 10,
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 3,
                  cursor: "pointer",
                }}
                onClick={() => onUploadTDS(params.data?.M_ID, selectedFile)}
              >
                <FiUploadCloud size={10} />
              </button>
            </div>
          );
        },
      },
    ];
  }

  const commonColumnsEnd: ColDef[] = [
    {
      field: "INS_DATE",
      headerName: "NGÀY TẠO",
      width: 140,
      resizable: true,
      floatingFilter: true,
      filter: true,
    },
    {
      field: "INS_EMPL",
      headerName: "NGƯỜI TẠO",
      width: 95,
      resizable: true,
      floatingFilter: true,
      filter: true,
    },
    {
      field: "UPD_DATE",
      headerName: "NGÀY SỬA",
      width: 140,
      resizable: true,
      floatingFilter: true,
      filter: true,
    },
    {
      field: "UPD_EMPL",
      headerName: "NGƯỜI SỬA",
      width: 95,
      resizable: true,
      floatingFilter: true,
      filter: true,
    },
  ];

  return [...commonColumnsStart, ...specificColumns, ...commonColumnsEnd];
};
