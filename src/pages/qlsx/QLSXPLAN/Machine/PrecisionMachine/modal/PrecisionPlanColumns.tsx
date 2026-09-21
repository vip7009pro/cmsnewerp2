import React from "react";
import { getCompany } from "../../../../../../api/Api";
import { QLSXPLANDATA } from "../../../interfaces/khsxInterface";

interface ColumnsProps {
  plandatatable?: QLSXPLANDATA[];
  setPlanDataTable?: React.Dispatch<React.SetStateAction<QLSXPLANDATA[]>>;
  onMovePlan?: (direction: "UP" | "DOWN", plan: QLSXPLANDATA) => void;
  onDeletePlan?: (plans: QLSXPLANDATA[]) => void;
  onStartPlan?: (plan: QLSXPLANDATA) => void;
  onFinishPlan?: (plan: QLSXPLANDATA) => void;
}

// 1. CỘT BẢNG YCSX (NGUYÊN BẢN ĐẦY ĐỦ)
export const getColumnYcsxTable = () => {
  return [
    {
      field: "PROD_REQUEST_NO",
      headerName: "SỐ YCSX",
      width: 75,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        if (params.data.DACHITHI === null) {
          return <span style={{ color: "black" }}>{params.data.PROD_REQUEST_NO}</span>;
        }
        return (
          <span style={{ color: "#16a34a", fontWeight: "bold" }}>
            {params.data.PROD_REQUEST_NO}
          </span>
        );
      },
    },
    { field: "G_CODE", headerName: "G_CODE", width: 65 },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 95,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        const isPending = params.data.PDBV === "P" || params.data.PDBV === null;
        return (
          <span style={{ color: isPending ? "#dc2626" : "#16a34a", fontWeight: 600 }}>
            {params.data.G_NAME_KD}
          </span>
        );
      },
    },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 120,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        const isPending = params.data.PDBV === "P" || params.data.PDBV === null;
        return (
          <span style={{ color: isPending ? "#dc2626" : "#16a34a" }}>
            {params.data.G_NAME}
          </span>
        );
      },
    },
    {
      field: "PROD_REQUEST_QTY",
      headerName: "SL_YCSX",
      width: 75,
      cellRenderer: (params: any) => (
        <span style={{ color: "#009933", fontWeight: "bold" }}>
          {params.data?.PROD_REQUEST_QTY?.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      field: "TON_CD1",
      headerName: "TCD1",
      width: 55,
      cellRenderer: (params: any) => (
        <span style={{ color: "black" }}>{params.data?.TON_CD1?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "TON_CD2",
      headerName: "TCD2",
      width: 55,
      cellRenderer: (params: any) => (
        <span style={{ color: "black" }}>{params.data?.TON_CD2?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "TON_CD3",
      headerName: "TCD3",
      width: 55,
      cellRenderer: (params: any) => (
        <span style={{ color: "black" }}>{params.data?.TON_CD3?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "TON_CD4",
      headerName: "TCD4",
      width: 55,
      cellRenderer: (params: any) => (
        <span style={{ color: "black" }}>{params.data?.TON_CD4?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "SLC_CD1",
      headerName: "SLC_CD1",
      width: 70,
      cellRenderer: (params: any) => (
        <span style={{ color: "#2563eb" }}>{params.data?.SLC_CD1?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "SLC_CD2",
      headerName: "SLC_CD2",
      width: 70,
      cellRenderer: (params: any) => (
        <span style={{ color: "#2563eb" }}>{params.data?.SLC_CD2?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "SLC_CD3",
      headerName: "SLC_CD3",
      width: 70,
      cellRenderer: (params: any) => (
        <span style={{ color: "#2563eb" }}>{params.data?.SLC_CD3?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "SLC_CD4",
      headerName: "SLC_CD4",
      width: 70,
      cellRenderer: (params: any) => (
        <span style={{ color: "#2563eb" }}>{params.data?.SLC_CD4?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "CD1",
      headerName: "CD1",
      width: 55,
      cellRenderer: (params: any) => (
        <span style={{ color: "#2563eb", fontWeight: "bold" }}>
          {params.data?.CD1?.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      field: "CD2",
      headerName: "CD2",
      width: 55,
      cellRenderer: (params: any) => (
        <span style={{ color: "#2563eb", fontWeight: "bold" }}>
          {params.data?.CD2?.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      field: "CD3",
      headerName: "CD3",
      width: 55,
      cellRenderer: (params: any) => (
        <span style={{ color: "#2563eb", fontWeight: "bold" }}>
          {params.data?.CD3?.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      field: "CD4",
      headerName: "CD4",
      width: 55,
      cellRenderer: (params: any) => (
        <span style={{ color: "#2563eb", fontWeight: "bold" }}>
          {params.data?.CD4?.toLocaleString("en-US")}
        </span>
      ),
    },
    { field: "EMPL_NAME", headerName: "PIC KD", width: 85 },
    { field: "CUST_NAME_KD", headerName: "KHÁCH", width: 85 },
    { field: "PROD_REQUEST_DATE", headerName: "NGÀY YCSX", width: 85 },
    { field: "DELIVERY_DT", headerName: "NGÀY GH", width: 85 },
    {
      field: "PO_BALANCE",
      headerName: "PO_BALANCE",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "#2563eb", fontWeight: "bold" }}>
          {params.data?.PO_BALANCE?.toLocaleString("en-US")}
        </span>
      ),
    },
    { field: "EQ1", headerName: "EQ1", width: 45 },
    { field: "EQ2", headerName: "EQ2", width: 45 },
    { field: "EQ3", headerName: "EQ3", width: 45 },
    { field: "EQ4", headerName: "EQ4", width: 45 },
    {
      field: "PHAN_LOAI",
      headerName: "PHÂN LOẠI",
      width: 85,
      cellRenderer: (params: any) => {
        const val = params.data?.PHAN_LOAI;
        if (val === "01") return <b>Thông thường</b>;
        if (val === "02") return <b>SDI</b>;
        if (val === "03") return <b>GC</b>;
        if (val === "04") return <b>SAMPLE</b>;
        return val || "";
      },
    },
    { field: "PL_HANG", headerName: "PL_HANG", width: 65 },
    { field: "REMARK", headerName: "REMARK", width: 75 },
    {
      field: "PDUYET",
      headerName: "PDUYET",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: params.data?.PDUYET === 1 ? "#16a34a" : "#dc2626", fontWeight: "bold" }}>
          {params.data?.PDUYET === 1 ? "Đã Duyệt" : "Không Duyệt"}
        </span>
      ),
    },
    {
      field: "PDBV",
      headerName: "PD BẢN VẼ",
      width: 85,
      cellRenderer: (params: any) => (
        <span
          style={{
            color: params.data?.PDBV === "P" || params.data?.PDBV === null ? "#dc2626" : "#16a34a",
            fontWeight: "bold",
          }}
        >
          {params.data?.PDBV === "P" || params.data?.PDBV === null ? "PENDING" : "APPROVED"}
        </span>
      ),
    },
    {
      field: "YCSX_PENDING",
      headerName: "YCSX_PENDING",
      width: 85,
      cellRenderer: (params: any) => (
        <span
          style={{
            color: params.data?.YCSX_PENDING === 1 ? "#dc2626" : "#16a34a",
            fontWeight: "bold",
          }}
        >
          {params.data?.YCSX_PENDING === 1 ? "PENDING" : "CLOSED"}
        </span>
      ),
    },
    {
      field: "MATERIAL_YN",
      headerName: "VL_STT",
      width: 75,
      cellRenderer: (params: any) => {
        const val = params.data?.MATERIAL_YN;
        if (val === "N") return <span style={{ color: "#dc2626", fontWeight: "bold" }}>NO</span>;
        if (val === "Y") return <span style={{ color: "#16a34a", fontWeight: "bold" }}>YES</span>;
        return <span style={{ color: "#d97706", fontWeight: "bold" }}>PENDING</span>;
      },
    },
  ];
};

// 2. CỘT BẢNG KẾ HOẠCH PLAN LIST (NGUYÊN BẢN ĐẦY ĐỦ + EDITABLE)
export const getColumnPlanDataTable = ({
  plandatatable,
  setPlanDataTable,
  onMovePlan,
  onDeletePlan,
  onStartPlan,
  onFinishPlan,
}: ColumnsProps) => {
  return [
    {
      field: "PLAN_ID",
      headerName: "PLAN_ID",
      width: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      editable: false,
      resizable: true,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        const color = params.data.DKXL === null ? "#dc2626" : "#16a34a";
        return (
          <span style={{ color, fontWeight: 700, fontFamily: "monospace" }}>
            {params.data.PLAN_ID}
          </span>
        );
      },
    },
    { field: "G_CODE", headerName: "G_CODE", width: 65, editable: false },
    { field: "G_NAME", headerName: "G_NAME", width: 110, editable: false },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 100,
      editable: false,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        const isLackDinhMuc =
          params.data.FACTORY === null ||
          params.data.EQ1 === null ||
          params.data.EQ2 === null ||
          params.data.Setting1 === null ||
          params.data.Setting2 === null ||
          params.data.UPH1 === null ||
          params.data.UPH2 === null ||
          params.data.Step1 === null ||
          params.data.LOSS_SX1 === null ||
          params.data.LOSS_SX2 === null ||
          params.data.LOSS_SETTING1 === null ||
          params.data.LOSS_SETTING2 === null;
        return (
          <span style={{ color: isLackDinhMuc ? "#dc2626" : "#16a34a", fontWeight: 600 }}>
            {params.data.G_NAME_KD}
          </span>
        );
      },
    },
    {
      field: "PROD_REQUEST_QTY",
      headerName: "YCSX QTY",
      width: 80,
      editable: false,
      cellRenderer: (params: any) => (
        <span style={{ color: "#2563eb", fontWeight: "bold" }}>
          {params.data?.PROD_REQUEST_QTY?.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      field: "TON_CD1",
      headerName: "TCD1",
      width: 55,
      editable: false,
      cellRenderer: (params: any) => (
        <span style={{ color: "#2563eb" }}>{params.data?.TON_CD1?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "TON_CD2",
      headerName: "TCD2",
      width: 55,
      editable: false,
      cellRenderer: (params: any) => (
        <span style={{ color: "#2563eb" }}>{params.data?.TON_CD2?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "TON_CD3",
      headerName: "TCD3",
      width: 55,
      editable: false,
      cellRenderer: (params: any) => (
        <span style={{ color: "#2563eb" }}>{params.data?.TON_CD3?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "TON_CD4",
      headerName: "TCD4",
      width: 55,
      editable: false,
      cellRenderer: (params: any) => (
        <span style={{ color: "#2563eb" }}>{params.data?.TON_CD4?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "PLAN_QTY",
      headerName: "PLAN_QTY",
      width: 80,
      editable: true,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        if (params.data.PLAN_QTY === 0) {
          return <span style={{ color: "#dc2626", fontWeight: "bold" }}>NG</span>;
        }
        return (
          <span style={{ color: "#16a34a", fontWeight: "bold" }}>
            {params.data.PLAN_QTY?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "PROCESS_NUMBER",
      headerName: "PROC",
      width: 55,
      editable: true,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        if (params.data.PROCESS_NUMBER === null || params.data.PROCESS_NUMBER === 0) {
          return <span style={{ color: "#dc2626", fontWeight: "bold" }}>NG</span>;
        }
        return (
          <span style={{ color: "#16a34a", fontWeight: "bold" }}>
            {params.data.PROCESS_NUMBER}
          </span>
        );
      },
    },
    { field: "STEP", headerName: "STEP", width: 55, editable: true },
    { field: "PLAN_EQ", headerName: "PLAN_EQ", width: 65, editable: true },
    { field: "PLAN_ORDER", headerName: "STT", width: 50, editable: true },
    {
      field: "KETQUASX",
      headerName: "KETQUASX",
      width: 80,
      editable: true,
      cellRenderer: (params: any) => (
        <span>{(params.data?.KETQUASX || 0).toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "KQ_SX_TAM",
      headerName: "KQ_SX_TAM",
      width: 85,
      editable: true,
      cellRenderer: (params: any) => (
        <span>{(params.data?.KQ_SX_TAM || 0).toLocaleString("en-US")}</span>
      ),
    },
    { field: "PLAN_FACTORY", headerName: "FACTORY", width: 70, editable: false },
    {
      field: "IS_SETTING",
      headerName: "SETTING",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        return (
          <input
            type="checkbox"
            checked={params.data.IS_SETTING === "Y"}
            onChange={(e) => {
              const checked = e.target.checked ? "Y" : "N";
              if (setPlanDataTable && plandatatable) {
                const newdata = plandatatable.map((p) =>
                  p.PLAN_ID === params.data.PLAN_ID ? { ...p, IS_SETTING: checked } : p
                );
                setPlanDataTable(newdata);
              }
            }}
          />
        );
      },
    },
    {
      field: "SLC_CD1",
      headerName: "SLC_CD1",
      width: 65,
      editable: false,
      cellRenderer: (params: any) => (
        <span style={{ color: "#16a34a" }}>{params.data?.SLC_CD1?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "SLC_CD2",
      headerName: "SLC_CD2",
      width: 65,
      editable: false,
      cellRenderer: (params: any) => (
        <span style={{ color: "#16a34a" }}>{params.data?.SLC_CD2?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "SLC_CD3",
      headerName: "SLC_CD3",
      width: 65,
      editable: false,
      cellRenderer: (params: any) => (
        <span style={{ color: "#16a34a" }}>{params.data?.SLC_CD3?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "SLC_CD4",
      headerName: "SLC_CD4",
      width: 65,
      editable: false,
      cellRenderer: (params: any) => (
        <span style={{ color: "#16a34a" }}>{params.data?.SLC_CD4?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "CD1",
      headerName: "CD1",
      width: 55,
      editable: false,
      cellRenderer: (params: any) => (
        <span style={{ color: "#2563eb" }}>{params.data?.CD1?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "CD2",
      headerName: "CD2",
      width: 55,
      editable: false,
      cellRenderer: (params: any) => (
        <span style={{ color: "#2563eb" }}>{params.data?.CD2?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "CD3",
      headerName: "CD3",
      width: 55,
      editable: false,
      cellRenderer: (params: any) => (
        <span style={{ color: "#2563eb" }}>{params.data?.CD3?.toLocaleString("en-US")}</span>
      ),
    },
    {
      field: "CD4",
      headerName: "CD4",
      width: 55,
      editable: false,
      cellRenderer: (params: any) => (
        <span style={{ color: "#2563eb" }}>{params.data?.CD4?.toLocaleString("en-US")}</span>
      ),
    },
    { field: "PLAN_DATE", headerName: "PLAN_DATE", width: 85, editable: false },
    { field: "PROD_REQUEST_NO", headerName: "YCSX NO", width: 75, editable: false },
    { field: "PROD_REQUEST_DATE", headerName: "YCSX DATE", width: 85, editable: false },
    { field: "DELIVERY_DT", headerName: "NGAY_GH", width: 85, editable: false },
    { field: "NEXT_PLAN_ID", headerName: "NEXT_PLAN", width: 85, editable: true },
    {
      field: "AT_LEADTIME",
      headerName: "LEADTIME",
      width: 75,
      editable: false,
      cellRenderer: (params: any) => (
        <span>{params.data?.AT_LEADTIME?.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
      ),
    },
    {
      field: "ACC_TIME",
      headerName: "ACC_TIME",
      width: 75,
      editable: false,
      cellRenderer: (params: any) => (
        <span>{params.data?.ACC_TIME?.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
      ),
    },
  ];
};

// 3. CỘT BẢNG VẬT LIỆU CHỈ THỊ (NGUYÊN BẢN ĐẦY ĐỦ + EDITABLE)
export const getColumnPlanMaterialTable = () => {
  return [
    {
      field: "CHITHI_ID",
      headerName: "CT_ID",
      resizable: true,
      width: 85,
      editable: false,
      cellDataType: 'text',
      headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { field: "PLAN_ID", headerName: "PLAN_ID", resizable: true, width: 75, editable: false },
    { field: "M_CODE", headerName: "M_CODE", resizable: true, width: 80, editable: false },
    {
      field: "M_NAME",
      headerName: "M_NAME",
      resizable: true,
      width: 130,
      editable: false,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        if (params.data.LIEUQL_SX === 1) {
          return <span style={{ color: "#dc2626", fontWeight: "bold" }}>{params.data.M_NAME}</span>;
        }
        return <span style={{ color: "#0f172a" }}>{params.data.M_NAME}</span>;
      },
    },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", resizable: true, width: 75, editable: false },
    {
      field: "M_MET_QTY",
      headerName: "M_MET_QTY",
      resizable: true,
      width: 85,
      editable: true,
      cellRenderer: (params: any) => (
        <span style={{ color: "#16a34a", fontWeight: "bold" }}>
          {params.data?.M_MET_QTY?.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      field: "M_QTY",
      headerName: "M_QTY",
      resizable: true,
      width: 80,
      editable: true,
      cellRenderer: (params: any) => (
        <span style={{ color: "#c026d3", fontWeight: "bold" }}>
          {params.data?.M_QTY?.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      field: "LIEUQL_SX",
      headerName: "LIEUQL_SX",
      resizable: true,
      width: 80,
      editable: true,
      cellRenderer: (params: any) => (
        <span style={{ color: "#c026d3", fontWeight: "bold" }}>{params.data?.LIEUQL_SX}</span>
      ),
    },
    {
      field: "M_STOCK",
      headerName: "M_STOCK",
      resizable: true,
      width: 85,
      editable: false,
      cellRenderer: (params: any) => (
        <span style={{ color: "#64748b", fontWeight: "bold" }}>
          {params.data?.M_STOCK?.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      field: "OUT_KHO_SX",
      headerName: "NEXT_IN",
      resizable: true,
      width: 80,
      editable: false,
      cellRenderer: (params: any) => (
        <span style={{ color: "#c026d3", fontWeight: "bold" }}>{params.data?.OUT_KHO_SX}</span>
      ),
    },
    {
      field: "OUT_CFM_QTY",
      headerName: "WH_IN",
      resizable: true,
      width: 80,
      editable: false,
      cellRenderer: (params: any) => (
        <span style={{ color: "#c026d3", fontWeight: "bold" }}>{params.data?.OUT_CFM_QTY}</span>
      ),
    },
  ];
};

