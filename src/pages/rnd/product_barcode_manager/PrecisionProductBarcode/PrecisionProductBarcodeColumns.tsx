import React from "react";
import BARCODE from "../../design_amazon/design_components/BARCODE";
import DATAMATRIX from "../../design_amazon/design_components/DATAMATRIX";
import QRCODE from "../../design_amazon/design_components/QRCODE";

export const createProductBarcodeColumns = () => [
  {
    field: "G_CODE",
    headerName: "G_CODE",
    width: 85,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#1e293b" },
  },
  {
    field: "G_NAME",
    headerName: "G_NAME",
    width: 170,
    cellStyle: { fontWeight: 600, color: "#0f172a" },
  },
  {
    field: "BARCODE_STT",
    headerName: "BARCODE_STT",
    width: 85,
    cellStyle: { textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 },
  },
  {
    field: "BARCODE_TYPE",
    headerName: "BARCODE_TYPE",
    width: 90,
    cellRenderer: (params: any) => {
      const type = params.value || "1D";
      return <span className="barcode-type-tag">{type}</span>;
    },
  },
  {
    field: "BARCODE_RND",
    headerName: "BARCODE_RND",
    width: 120,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace", color: "#2563eb", fontWeight: 600 },
  },
  {
    field: "BARCODE_INSP",
    headerName: "BARCODE_INSP",
    width: 95,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace", color: "#64748b" },
  },
  {
    field: "BARCODE_RELI",
    headerName: "BARCODE_RELI",
    width: 95,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace", color: "#64748b" },
  },
  {
    field: "STATUS",
    headerName: "STATUS",
    width: 85,
    cellRenderer: (params: any) => {
      const isOk = params.value === "OK";
      return (
        <span className={`barcode-status-chip ${isOk ? "barcode-status-chip--ok" : "barcode-status-chip--ng"}`}>
          {isOk ? "OK" : "NG"}
        </span>
      );
    },
  },
  {
    field: "BARCODE_RND",
    headerName: "CODE_VISUALIZE",
    width: 250,
    cellRenderer: (params: any) => {
      const type = params.data?.BARCODE_TYPE;
      const value = params.value;
      if (!value) return null;

      if (type === "QR") {
        return (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <QRCODE
              DATA={{
                CAVITY_PRINT: 2,
                DOITUONG_NAME: "bc",
                DOITUONG_NO: 1,
                DOITUONG_STT: "0",
                FONT_NAME: "Arial",
                FONT_SIZE: 6,
                FONT_STYLE: "normal",
                G_CODE_MAU: "",
                GIATRI: value,
                PHANLOAI_DT: "QR CODE",
                POS_X: 0,
                POS_Y: 0,
                SIZE_W: 10,
                SIZE_H: 10,
                REMARK: "",
                ROTATE: 0,
              }}
            />
          </div>
        );
      } else if (type === "1D") {
        return (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <BARCODE
              DATA={{
                CAVITY_PRINT: 2,
                DOITUONG_NAME: "bc",
                DOITUONG_NO: 1,
                DOITUONG_STT: "0",
                FONT_NAME: "Arial",
                FONT_SIZE: 6,
                FONT_STYLE: "normal",
                G_CODE_MAU: "",
                GIATRI: value,
                PHANLOAI_DT: "QR CODE",
                POS_X: 0,
                POS_Y: 0,
                SIZE_W: 60,
                SIZE_H: 10,
                REMARK: "",
                ROTATE: 0,
              }}
            />
          </div>
        );
      } else if (type === "MATRIX") {
        return (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <DATAMATRIX
              DATA={{
                CAVITY_PRINT: 2,
                DOITUONG_NAME: "bc",
                DOITUONG_NO: 1,
                DOITUONG_STT: "0",
                FONT_NAME: "Arial",
                FONT_SIZE: 6,
                FONT_STYLE: "normal",
                G_CODE_MAU: "",
                GIATRI: value,
                PHANLOAI_DT: "QR CODE",
                POS_X: 0,
                POS_Y: 0,
                SIZE_W: 10,
                SIZE_H: 10,
                REMARK: "",
                ROTATE: 0,
              }}
            />
          </div>
        );
      }
      return value;
    },
  },
  {
    field: "SX_STATUS",
    headerName: "SX_STATUS",
    width: 95,
    cellRenderer: (params: any) => {
      const isYes = params.value === "YES";
      return (
        <span
          className={`barcode-status-chip ${
            isYes ? "barcode-status-chip--prod-yes" : "barcode-status-chip--prod-no"
          }`}
        >
          {isYes ? "ĐÃ SX" : "CHƯA SX"}
        </span>
      );
    },
  },
];
