// PrecisionCodeManagerColumns.tsx - AG-Grid Column Definitions with Stitch Industrial Cell Renderers

import React, { useState, useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FiDownload, FiFileText } from "react-icons/fi";
import { CODE_FULL_INFO } from "../../interfaces/rndInterface";

interface GetColumnsParams {
  enableEdit: boolean;
  onUploadBanVe: (file: File, row: CODE_FULL_INFO) => void;
  onUploadAppSheet: (file: File, row: CODE_FULL_INFO) => void;
}

// Helper tạo URL bản vẽ với tham số giả ngẫu nhiên chống cache trình duyệt
export const getBanVeUrl = (gCode: string) => {
  if (!gCode) return "";
  const timestamp = Date.now();
  const randomSalt = Math.random().toString(36).substring(2, 8);
  return `/banve/${encodeURIComponent(gCode)}.pdf?v=${timestamp}_${randomSalt}`;
};

// Helper tạo URL AppSheet với tham số giả ngẫu nhiên chống cache
export const getAppSheetUrl = (gCode: string) => {
  if (!gCode) return "";
  const timestamp = Date.now();
  const randomSalt = Math.random().toString(36).substring(2, 8);
  return `/appsheet/Appsheet_${encodeURIComponent(gCode)}.docx?v=${timestamp}_${randomSalt}`;
};

// Cell Renderer chuyên dụng cho cột G_CODE (Link xem bản vẽ)
const GCodeCellRenderer: React.FC<any> = (params: any) => {
  const gCode = params.data?.G_CODE;
  const [url, setUrl] = useState<string>(() => (gCode ? getBanVeUrl(gCode) : ""));

  useEffect(() => {
    if (gCode) {
      setUrl(getBanVeUrl(gCode));
    } else {
      setUrl("");
    }
  }, [gCode]);

  if (!gCode) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const freshUrl = getBanVeUrl(gCode);
    setUrl(freshUrl);
    window.open(freshUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <a
      className="cell-code-link"
      href={url || getBanVeUrl(gCode)}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      title={`Xem bản vẽ ${gCode}`}
    >
      {gCode}
    </a>
  );
};

// Cell Renderer chuyên dụng cho cột BẢN VẼ (Nút xem/tải CAD và nút Upload)
const BanVeCellRenderer: React.FC<any> = (params: any) => {
  const row: CODE_FULL_INFO = params.data;
  const gCode = row?.G_CODE;
  const banVeStatus = row?.BANVE;
  const onUploadBanVe = params.colDef?.cellRendererParams?.onUploadBanVe ?? params.onUploadBanVe;

  const [banVeUrl, setBanVeUrl] = useState<string>(() => (gCode ? getBanVeUrl(gCode) : ""));

  useEffect(() => {
    if (gCode) {
      setBanVeUrl(getBanVeUrl(gCode));
    } else {
      setBanVeUrl("");
    }
  }, [gCode, banVeStatus]);

  if (!gCode) return null;

  if (banVeStatus && banVeStatus !== "N") {
    const handleOpen = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const freshUrl = getBanVeUrl(gCode);
      setBanVeUrl(freshUrl);
      window.open(freshUrl, "_blank", "noopener,noreferrer");
    };

    return (
      <a
        className="cell-btn-download"
        href={banVeUrl || getBanVeUrl(gCode)}
        onClick={handleOpen}
        target="_blank"
        rel="noopener noreferrer"
        title={`Xem / Tải bản vẽ CAD PDF của sản phẩm ${gCode}`}
      >
        <FiDownload size={11} />
        <span>Tải CAD</span>
      </a>
    );
  }

  return (
    <label className="cell-btn-upload" title={`Upload bản vẽ PDF cho ${gCode}`}>
      <AiOutlineCloudUpload size={13} />
      <span>Upload</span>
      <input
        type="file"
        accept=".pdf"
        style={{ display: "none" }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files?.[0] && onUploadBanVe) {
            onUploadBanVe(e.target.files[0], row);
          }
        }}
      />
    </label>
  );
};

// Cell Renderer chuyên dụng cho cột APPSHEET
const AppSheetCellRenderer: React.FC<any> = (params: any) => {
  const row: CODE_FULL_INFO = params.data;
  const gCode = row?.G_CODE;
  const appsheetStatus = row?.APPSHEET;
  const onUploadAppSheet = params.colDef?.cellRendererParams?.onUploadAppSheet ?? params.onUploadAppSheet;

  const [url, setUrl] = useState<string>(() => (gCode ? getAppSheetUrl(gCode) : ""));

  useEffect(() => {
    if (gCode) {
      setUrl(getAppSheetUrl(gCode));
    } else {
      setUrl("");
    }
  }, [gCode, appsheetStatus]);

  if (!gCode) return null;

  if (appsheetStatus && appsheetStatus !== "N") {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const freshUrl = getAppSheetUrl(gCode);
      setUrl(freshUrl);
      window.open(freshUrl, "_blank", "noopener,noreferrer");
    };

    return (
      <a
        className="cell-btn-download"
        style={{ backgroundColor: "#f0fdf4", color: "#16a34a", borderColor: "#bbf7d0" }}
        href={url || getAppSheetUrl(gCode)}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        title={`Tải tệp AppSheet docx của sản phẩm ${gCode}`}
      >
        <FiFileText size={11} />
        <span>AppSheet</span>
      </a>
    );
  }

  return (
    <label className="cell-btn-upload" title={`Upload tệp AppSheet docx cho ${gCode}`}>
      <AiOutlineCloudUpload size={13} />
      <span>Upload</span>
      <input
        type="file"
        accept=".docx"
        style={{ display: "none" }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files?.[0] && onUploadAppSheet) {
            onUploadAppSheet(e.target.files[0], row);
          }
        }}
      />
    </label>
  );
};

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
      cellRenderer: GCodeCellRenderer,
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
      cellRenderer: BanVeCellRenderer,
      cellRendererParams: {
        onUploadBanVe,
      },
    },
    {
      field: "APPSHEET",
      headerName: "APPSHEET",
      width: 125,
      cellRenderer: AppSheetCellRenderer,
      cellRendererParams: {
        onUploadAppSheet,
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
