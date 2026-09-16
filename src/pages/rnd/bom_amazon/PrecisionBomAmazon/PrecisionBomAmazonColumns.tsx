import React from "react";
import Swal from "sweetalert2";
import { getUserData } from "../../../../api/Api";

export const createCodeInfoColumns = (enableEdit: boolean) => [
  {
    field: "id",
    headerName: "ID",
    headerClass: "super-app-theme--header",
    width: 45,
    editable: enableEdit,
  },
  {
    field: "G_CODE",
    headerName: "G_CODE",
    headerClass: "super-app-theme--header",
    width: 95,
    editable: enableEdit,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "#1d4ed8" },
  },
  {
    field: "G_NAME",
    headerName: "G_NAME",
    flex: 1,
    minWidth: 120,
    headerClass: "super-app-theme--header",
    editable: enableEdit,
    cellStyle: { fontWeight: 500 },
  },
  {
    field: "G_NAME_KD",
    headerName: "G_NAME_KD",
    headerClass: "super-app-theme--header",
    width: 110,
    editable: enableEdit,
  },
];

export const createListBomAmazonColumns = (enableEdit: boolean) => [
  {
    field: "id",
    headerName: "ID",
    headerClass: "super-app-theme--header",
    width: 45,
    editable: enableEdit,
  },
  {
    field: "G_CODE",
    headerName: "G_CODE",
    headerClass: "super-app-theme--header",
    width: 95,
    editable: enableEdit,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "#059669" },
  },
  {
    field: "G_NAME",
    headerName: "G_NAME",
    flex: 1,
    minWidth: 120,
    headerClass: "super-app-theme--header",
    editable: enableEdit,
    cellStyle: { fontWeight: 500 },
  },
  {
    field: "G_NAME_KD",
    headerName: "G_NAME_KD",
    headerClass: "super-app-theme--header",
    width: 100,
    editable: enableEdit,
  },
];

export const createBomAmazonColumns = (enableEdit: boolean) => [
  {
    field: "id",
    headerName: "ID",
    headerClass: "super-app-theme--header",
    width: 45,
    editable: false,
  },
  {
    field: "G_CODE",
    headerName: "G_CODE",
    headerClass: "super-app-theme--header",
    width: 95,
    editable: false,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "#0f172a" },
  },
  {
    field: "G_NAME",
    headerName: "G_NAME",
    headerClass: "super-app-theme--header",
    width: 130,
    editable: false,
    cellStyle: { fontWeight: 600 },
  },
  {
    field: "G_CODE_MAU",
    headerName: "G_CODE_MAU",
    headerClass: "super-app-theme--header",
    width: 105,
    editable: false,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace", color: "#64748b" },
  },
  {
    field: "TEN_MAU",
    headerName: "TEN_MAU",
    headerClass: "super-app-theme--header",
    width: 110,
    editable: false,
  },
  {
    field: "DOITUONG_NO",
    headerName: "DOITUONG_NO",
    headerClass: "super-app-theme--header",
    width: 100,
    editable: false,
    cellStyle: { fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "#475569" },
  },
  {
    field: "DOITUONG_NAME",
    headerName: "DOITUONG_NAME",
    headerClass: "super-app-theme--header",
    width: 140,
    editable: false,
    cellStyle: { fontWeight: 600, color: "#1e293b" },
  },
  {
    field: "GIATRI",
    headerName: "GIATRI",
    headerClass: "super-app-theme--header",
    width: 140,
    editable: enableEdit,
    cellClass: enableEdit ? "editable-cell-highlight" : "",
  },
  {
    field: "REMARK",
    headerName: "REMARK",
    headerClass: "super-app-theme--header",
    width: 130,
    editable: enableEdit,
    cellClass: enableEdit ? "editable-cell-highlight" : "",
  },
  {
    field: "DOITUONG_NAME2",
    headerName: "QR_DOITUONG_NAME2",
    headerClass: "super-app-theme--header",
    width: 140,
    editable: enableEdit,
    cellRenderer: (params: any) => {
      if (params.data?.PHANLOAI_DT === "QRCODE" || params.data?.PHANLOAI_DT === "2D MATRIX") {
        return (
          <select
            className="precision-bom-amz__selectCell"
            value={params.data.DOITUONG_NAME2 || ""}
            onChange={(e) => {
              const emplNo = getUserData()?.EMPL_NO;
              if (emplNo === "NHU1903" || emplNo === "NVD1201" || !params.data.DOITUONG_NAME2) {
                params.data.DOITUONG_NAME2 = e.target.value;
                if (params.api) {
                  params.api.refreshCells({ rowNodes: [params.node], columns: ["DOITUONG_NAME2"] });
                }
              } else {
                Swal.fire("Cảnh báo", "Chỉ thay đổi 1 lần", "warning");
              }
            }}
          >
            <option value="">-- Chọn --</option>
            <option value="QRCODE">QRCODE</option>
            <option value="2D MATRIX">2D MATRIX</option>
          </select>
        );
      }
      return params.value;
    },
  },
];
