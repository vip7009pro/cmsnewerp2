import React from "react";
import moment from "moment";
import { DEFECT_PROCESS_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

interface ColumnsOptions {
  onOpenImageModal: (imageSrc: string, title: string, item: DEFECT_PROCESS_DATA) => void;
}

export const createMainDefectsColumns = ({ onOpenImageModal }: ColumnsOptions) => [
  {
    field: "NG_SX100_ID",
    headerName: "ID",
    width: 50,
    cellRenderer: (params: any) => {
      const val = params.value;
      if (!val) return "";
      return <span className="cell-code-chip">{val}</span>;
    },
  },
  {
    field: "PROD_MODEL",
    headerName: "PROD_MODEL",
    width: 100,
    cellRenderer: (params: any) => {
      return <strong>{params.value || "-"}</strong>;
    },
  },
  {
    field: "G_CODE",
    headerName: "G_CODE",
    width: 70,
    cellRenderer: (params: any) => {
      const val = params.value;
      if (!val) return "";
      return <span className="cell-code-chip">{val}</span>;
    },
  },
  {
    field: "G_NAME",
    headerName: "G_NAME",
    width: 100,
  },
  {
    field: "DESCR",
    headerName: "DESCR",
    width: 150,
  },
  {
    field: "PROCESS_NUMBER",
    headerName: "PROCESS_NUMBER",
    width: 100,
    cellRenderer: (params: any) => {
      const p = params.value;
      if (p === null || p === undefined) return "-";
      let cls = "cell-process-badge--other";
      if (p === 1) cls = "cell-process-badge--cd1";
      else if (p === 2) cls = "cell-process-badge--cd2";
      else if (p === 3) cls = "cell-process-badge--cd3";
      else if (p >= 4) cls = "cell-process-badge--cd4";

      return <span className={`cell-process-badge ${cls}`}>CĐ {p}</span>;
    },
  },
  {
    field: "STT",
    headerName: "STT",
    width: 50,
  },
  {
    field: "DEFECT",
    headerName: "DEFECT",
    width: 150,
    cellRenderer: (params: any) => {
      return <span style={{ fontWeight: 600, color: "#b91c1c" }}>{params.value || ""}</span>;
    },
  },
  {
    field: "TEST_ITEM",
    headerName: "TEST_ITEM",
    width: 150,
  },
  {
    field: "TEST_METHOD",
    headerName: "TEST_METHOD",
    width: 150,
  },
  {
    field: "INS_PATROL_ID",
    headerName: "INS_PATROL_ID",
    width: 90,
    cellRenderer: (params: any) => {
      const patrolId = params.data?.INS_PATROL_ID;
      if (!patrolId || String(patrolId).trim() === "") {
        return <span className="cell-thumb-wrap"><span className="no-img">-</span></span>;
      }
      const imgSrc = `/INS_PATROL/INS_PATROL_${patrolId}.png`;
      return (
        <div
          className="cell-thumb-wrap"
          onClick={() => onOpenImageModal(imgSrc, `Tiêu Chuẩn Patrol: ${params.data.G_CODE}`, params.data)}
          title="Click để phóng to ảnh INS_PATROL"
        >
          <img
            src={imgSrc}
            alt={params.data?.G_CODE || "Patrol"}
            onError={(e: any) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span style={{ fontSize: "10.5px", fontFamily: "JetBrains Mono" }}>{patrolId}</span>
        </div>
      );
    },
  },
  {
    field: "USE_YN",
    headerName: "USE_YN",
    width: 80,
    cellRenderer: (params: any) => {
      const isY = params.value === "Y";
      return (
        <span className={`cell-status-pill ${isY ? "cell-status-pill--active" : "cell-status-pill--inactive"}`}>
          {isY ? "Hiệu Lực" : "Tạm Dừng"}
        </span>
      );
    },
  },
  {
    field: "IMAGE_YN",
    headerName: "IMAGE_YN",
    width: 60,
    cellRenderer: (params: any) => {
      const ngId = params.data?.NG_SX100_ID;
      if (!ngId) return "-";
      const imgSrc = `/sxng100/SX100_${ngId}.png`;
      return (
        <div
          className="cell-thumb-wrap"
          onClick={() => onOpenImageModal(imgSrc, `Ảnh Lỗi SX100: ${params.data.DEFECT || params.data.G_CODE}`, params.data)}
          title="Click để phóng to ảnh lỗi SX100"
        >
          <img
            src={imgSrc}
            alt={params.data?.G_CODE || "SX100"}
            onError={(e: any) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      );
    },
  },
  {
    field: "INS_DATE",
    headerName: "INS_DATE",
    width: 100,
    cellRenderer: (params: any) => {
      if (!params.value) return "";
      return <span style={{ fontFamily: "JetBrains Mono", fontSize: "11px" }}>{params.value}</span>;
    },
  },
  {
    field: "INS_EMPL",
    headerName: "INS_EMPL",
    width: 70,
  },
  {
    field: "UPD_DATE",
    headerName: "UPD_DATE",
    width: 100,
    cellRenderer: (params: any) => {
      if (!params.value) return "";
      return <span style={{ fontFamily: "JetBrains Mono", fontSize: "11px" }}>{params.value}</span>;
    },
  },
  {
    field: "UPD_EMPL",
    headerName: "UPD_EMPL",
    width: 70,
  },
];
