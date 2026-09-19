import React from "react";

export const getPlanDataTableColumns = (onOpenDangKyLieu?: (planData: any) => void) => [
  {
    field: "PLAN_FACTORY",
    headerName: "FACTORY",
    headerCheckboxSelection: true,
    checkboxSelection: true,
    width: 80,
    editable: false,
  },
  {
    field: "PLAN_DATE",
    headerName: "PLAN_DATE",
    width: 70,
    editable: false,
  },
  {
    field: "PLAN_ID",
    headerName: "PLAN_ID",
    width: 70,
    editable: false,
    resizable: true,
  },
  {
    field: "G_CODE",
    headerName: "G_CODE",
    width: 70,
    editable: false,
    resizable: true,
  },
  {
    field: "G_NAME",
    headerName: "G_NAME",
    width: 120,
    editable: false,
    resizable: true,
  },
  {
    field: "G_NAME_KD",
    headerName: "G_NAME_KD",
    width: 100,
    editable: false,
    cellRenderer: (params: any) => {
      if (
        params.data?.FACTORY === null ||
        params.data?.EQ1 === null ||
        params.data?.EQ2 === null ||
        params.data?.Setting1 === null ||
        params.data?.Setting2 === null ||
        params.data?.UPH1 === null ||
        params.data?.UPH2 === null ||
        params.data?.Step1 === null ||
        params.data?.LOSS_SX1 === null ||
        params.data?.LOSS_SX2 === null ||
        params.data?.LOSS_SETTING1 === null ||
        params.data?.LOSS_SETTING2 === null
      )
        return <span style={{ color: "red" }}>{params.data?.G_NAME_KD}</span>;
      return <span style={{ color: "green" }}>{params.data?.G_NAME_KD}</span>;
    },
  },
  {
    field: "PLAN_EQ",
    headerName: "PLAN_EQ",
    width: 50,
    editable: true,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue", fontWeight: "bold" }}>
        {params.data?.PLAN_EQ}
      </span>
    ),
  },
  {
    field: "PLAN_ORDER",
    headerName: "STT",
    width: 40,
    editable: true,
    cellRenderer: (params: any) => (
      <span style={{ color: "purple", fontWeight: "normal" }}>
        {params.data?.PLAN_ORDER}
      </span>
    ),
  },
  {
    field: "PROCESS_NUMBER",
    headerName: "PR_NUM",
    width: 50,
    editable: true,
    cellRenderer: (params: any) => {
      if (
        params.data?.PROCESS_NUMBER === null ||
        params.data?.PROCESS_NUMBER === 0
      ) {
        return <span style={{ color: "red" }}>NG</span>;
      } else {
        return (
          <span style={{ color: "green" }}>{params.data?.PROCESS_NUMBER}</span>
        );
      }
    },
  },
  { field: "STEP", headerName: "STEP", width: 45, editable: true },
  {
    field: "PLAN_QTY",
    headerName: "PLAN_QTY",
    width: 60,
    editable: true,
    cellRenderer: (params: any) => {
      if (params.data?.PLAN_QTY === 0) {
        return <span style={{ color: "red", fontWeight: "bold" }}>NG</span>;
      } else {
        return (
          <span style={{ color: "gray", fontWeight: "bold" }}>
            {params.data?.PLAN_QTY?.toLocaleString("en", "US")}
          </span>
        );
      }
    },
  },
  {
    field: "KETQUASX",
    headerName: "RESULT_QTY",
    width: 75,
    cellRenderer: (params: any) => {
      if (params.data?.KETQUASX !== null) {
        return (
          <span style={{ color: "#F117FF", fontWeight: "bold" }}>
            {params.data?.KETQUASX?.toLocaleString("en-US")}
          </span>
        );
      } else {
        return <span>0</span>;
      }
    },
  },
  {
    field: "ACHIVEMENT_RATE",
    headerName: "ACHIV_RATE",
    width: 75,
    cellRenderer: (params: any) => {
      if (params.data?.ACHIVEMENT_RATE !== undefined) {
        if (params.data?.ACHIVEMENT_RATE === 100) {
          return (
            <span style={{ color: "green", fontWeight: "bold" }}>
              {params.data?.ACHIVEMENT_RATE?.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}
              %
            </span>
          );
        } else {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.data?.ACHIVEMENT_RATE?.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}
              %
            </span>
          );
        }
      } else {
        return <span>0</span>;
      }
    },
  },
  {
    field: "EQ_STATUS",
    headerName: "EQ_STATUS",
    width: 120,
    cellRenderer: (params: any) => {
      if (params.data?.EQ_STATUS === "KTST-KSX") {
        return <span style={{ color: "green" }}>KTST-KSX</span>;
      } else if (params.data?.EQ_STATUS === "Đang setting") {
        return (
          <span style={{ color: "orange" }}>
            Đang Setting{" "}
            <img
              alt="running"
              src="/setting3.gif"
              width={10}
              height={10}
            />
          </span>
        );
      } else if (params.data?.EQ_STATUS === "Đang Run") {
        return (
          <span style={{ color: "blue" }}>
            Đang Run{" "}
            <img
              alt="running"
              src="/blink.gif"
              width={40}
              height={15}
            />
          </span>
        );
      } else if (params.data?.EQ_STATUS === "Chạy xong") {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            Chạy xong
          </span>
        );
      } else {
        return <span style={{ color: "red" }}>Chưa chạy</span>;
      }
    },
  },
  {
    field: "SETTING_START_TIME",
    headerName: "SETTING_START",
    width: 60,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue", fontWeight: "normal" }}>
        {params.data?.SETTING_START_TIME}
      </span>
    ),
  },
  {
    field: "MASS_START_TIME",
    headerName: "MASS_START",
    width: 60,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue", fontWeight: "normal" }}>
        {params.data?.MASS_START_TIME}
      </span>
    ),
  },
  {
    field: "MASS_END_TIME",
    headerName: "MASS_END",
    width: 60,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue", fontWeight: "normal" }}>
        {params.data?.MASS_END_TIME}
      </span>
    ),
  },
  {
    field: "IS_SETTING",
    headerName: "IS_SETTING",
    width: 50,
    editable: true,
    cellRenderer: (params: any) => {
      if (params.data?.IS_SETTING === "Y")
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {params.data?.IS_SETTING}
          </span>
        );
      return (
        <span style={{ color: "red", fontWeight: "bold" }}>
          {params.data?.IS_SETTING}
        </span>
      );
    },
  },
  {
    field: "XUATDAOFILM",
    headerName: "Xuất Dao",
    width: 80,
    cellStyle: (params: any) => {
      const isSuccess = params.data?.XUATDAOFILM === "V";
      return {
        backgroundColor: isSuccess ? "#16a34a" : "#dc2626",
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 0,
      };
    },
    cellRenderer: (params: any) => {
      return params.data?.XUATDAOFILM === "V" ? "V" : "N";
    },
  },
  {
    field: "DKXL",
    headerName: "ĐK Xuất liệu",
    width: 80,
    cellStyle: (params: any) => {
      const isSuccess = params.data?.DKXL === "V";
      return {
        backgroundColor: isSuccess ? "#16a34a" : "#dc2626",
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 0,
        cursor: "pointer",
      };
    },
    cellRenderer: (params: any) => {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            if (onOpenDangKyLieu) {
              onOpenDangKyLieu(params.data);
            }
          }}
        >
          {params.data?.DKXL === "V" ? "V" : "N"}
        </div>
      );
    },
  },
  {
    field: "MAIN_MATERIAL",
    headerName: "Xuất liệu",
    width: 80,
    cellStyle: (params: any) => {
      const isSuccess = params.data?.MAIN_MATERIAL === "V";
      return {
        backgroundColor: isSuccess ? "#16a34a" : "#dc2626",
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 0,
      };
    },
    cellRenderer: (params: any) => {
      return params.data?.MAIN_MATERIAL === "V" ? "V" : "N";
    },
  },
  {
    field: "INT_TEM",
    headerName: "In Tem",
    width: 60,
    cellStyle: (params: any) => {
      const isSuccess = params.data?.INT_TEM === "V";
      return {
        backgroundColor: isSuccess ? "#16a34a" : "#dc2626",
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 0,
      };
    },
    cellRenderer: (params: any) => {
      return params.data?.INT_TEM === "V" ? "V" : "N";
    },
  },
  {
    field: "CHOTBC",
    headerName: "Chốt báo cáo",
    width: 80,
    cellStyle: (params: any) => {
      const isSuccess = params.data?.CHOTBC === "V";
      return {
        backgroundColor: isSuccess ? "#16a34a" : "#dc2626",
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 0,
      };
    },
    cellRenderer: (params: any) => {
      return params.data?.CHOTBC === "V" ? "V" : "N";
    },
  },
  {
    field: "LOSS_KT",
    headerName: "LOSS_KT",
    width: 80,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "red" }}>
        {params.data?.LOSS_KT?.toLocaleString("en", "US", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })}
        %
      </span>
    ),
  },
  {
    field: "AT_LEADTIME",
    headerName: "AT_LEADTIME",
    width: 90,
    editable: false,
    hide: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "#4178D2", fontWeight: "bold" }}>
        {params.data?.AT_LEADTIME?.toLocaleString("en-US", {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        })}
      </span>
    ),
  },
  {
    field: "ACC_TIME",
    headerName: "ACC_TIME",
    width: 80,
    editable: false,
    hide: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "#4178D2", fontWeight: "bold" }}>
        {params.data?.ACC_TIME?.toLocaleString("en-US", {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        })}
      </span>
    ),
  },
  {
    field: "KQ_SX_TAM",
    headerName: "CURRENT_RESULT",
    width: 120,
    editable: false,
    hide: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "#3394D8", fontWeight: "bold" }}>
        {params.data?.KQ_SX_TAM?.toLocaleString("en-US")}
      </span>
    ),
  },
  {
    field: "REQ_DF",
    headerName: "REQ DAO FILM",
    width: 100,
    editable: false,
    hide: false,
    cellRenderer: (params: any) => {
      if (params.data?.REQ_DF === "R") {
        return (
          <span style={{ color: "red", fontWeight: "normal" }}>
            REQUESTED
          </span>
        );
      } else {
        return (
          <span style={{ color: "green", fontWeight: "normal" }}>
            COMPLETED
          </span>
        );
      }
    },
  },
  {
    field: "PROD_REQUEST_NO",
    headerName: "YCSX NO",
    width: 80,
    editable: false,
    hide: false,
  },
  {
    field: "PROD_REQUEST_DATE",
    headerName: "YCSX DATE",
    width: 80,
    editable: false,
  },
  {
    field: "PROD_REQUEST_QTY",
    headerName: "YCSX QTY",
    width: 80,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue" }}>
        {params.data?.PROD_REQUEST_QTY?.toLocaleString("en", "US")}
      </span>
    ),
  },
  {
    field: "SLC_CD1",
    headerName: "SLC_CD1",
    width: 70,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "green" }}>
        {params.data?.SLC_CD1?.toLocaleString("en", "US")}
      </span>
    ),
  },
  {
    field: "SLC_CD2",
    headerName: "SLC_CD2",
    width: 70,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "green" }}>
        {params.data?.SLC_CD2?.toLocaleString("en", "US")}
      </span>
    ),
  },
  {
    field: "SLC_CD3",
    headerName: "SLC_CD3",
    width: 70,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "green" }}>
        {params.data?.SLC_CD3?.toLocaleString("en", "US")}
      </span>
    ),
  },
  {
    field: "SLC_CD4",
    headerName: "SLC_CD4",
    width: 70,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "green" }}>
        {params.data?.SLC_CD4?.toLocaleString("en", "US")}
      </span>
    ),
  },
  {
    field: "CD1",
    headerName: "CD1",
    width: 50,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue" }}>
        {params.data?.CD1?.toLocaleString("en", "US")}
      </span>
    ),
  },
  {
    field: "CD2",
    headerName: "CD2",
    width: 50,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue" }}>
        {params.data?.CD2?.toLocaleString("en", "US")}
      </span>
    ),
  },
  {
    field: "CD3",
    headerName: "CD3",
    width: 50,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue" }}>
        {params.data?.CD3?.toLocaleString("en", "US")}
      </span>
    ),
  },
  {
    field: "CD4",
    headerName: "CD4",
    width: 50,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue" }}>
        {params.data?.CD4?.toLocaleString("en", "US")}
      </span>
    ),
  },
  {
    field: "TON_CD1",
    headerName: "TCD1",
    width: 55,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "red" }}>
        {params.data?.TON_CD1?.toLocaleString("en", "US")}
      </span>
    ),
  },
  {
    field: "TON_CD2",
    headerName: "TCD2",
    width: 55,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "red" }}>
        {params.data?.TON_CD2?.toLocaleString("en", "US")}
      </span>
    ),
  },
  {
    field: "TON_CD3",
    headerName: "TCD3",
    width: 55,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "red" }}>
        {params.data?.TON_CD3?.toLocaleString("en", "US")}
      </span>
    ),
  },
  {
    field: "TON_CD4",
    headerName: "TCD4",
    width: 55,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "red" }}>
        {params.data?.TON_CD4?.toLocaleString("en", "US")}
      </span>
    ),
  },
  { field: "EQ1", headerName: "EQ1", width: 40, editable: false },
  { field: "EQ2", headerName: "EQ2", width: 40, editable: false },
  { field: "EQ3", headerName: "EQ3", width: 40, editable: false },
  { field: "EQ4", headerName: "EQ4", width: 40, editable: false },
];

export const column_planmaterialtable = [
  {
    field: "CHITHI_ID",
    headerName: "CT_ID",
    resizable: true,
    width: 100,
    editable: false,
    cellDataType: "text",
    headerCheckboxSelection: true,
    checkboxSelection: true,
    cellRenderer: (params: any) => {
      const rawId = params.data?.CHITHI_ID;
      const textId = rawId === null || rawId === undefined ? "" : String(rawId);
      const temporaryId = textId.match(/^NEW[_-]?(\d+)$/i);
      const displayId = temporaryId
        ? `NEW_${Number(temporaryId[1]) + 1}`
        : textId;

      return <span style={{ fontFamily: "JetBrains Mono, monospace", color: "#2563eb", fontWeight: 700 }}>{displayId}</span>;
    },
  },
  { field: "PLAN_ID", headerName: "PLAN_ID", resizable: true, width: 80, editable: false },
  { field: "M_CODE", headerName: "M_CODE", resizable: true, width: 80, editable: false },
  {
    field: "M_NAME",
    headerName: "M_NAME",
    resizable: true,
    width: 80,
    editable: false,
    cellRenderer: (params: any) => {
      if (params.data?.LIEUQL_SX === 1) {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {params.data?.M_NAME}
          </span>
        );
      } else {
        return <span style={{ color: "black" }}>{params.data?.M_NAME}</span>;
      }
    },
  },
  { field: "WIDTH_CD", headerName: "WIDTH_CD", resizable: true, width: 80, editable: false },
  {
    field: "M_MET_QTY",
    headerName: "M_MET_QTY",
    resizable: true,
    width: 80,
    editable: true,
    cellRenderer: (params: any) => (
      <span style={{ color: "green", fontWeight: "bold" }}>
        {params.data?.M_MET_QTY}
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
      <span style={{ color: "#F117FF", fontWeight: "bold" }}>
        {params.data?.M_QTY}
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
      <span style={{ color: "#F117FF", fontWeight: "bold" }}>
        {params.data?.LIEUQL_SX}
      </span>
    ),
  },
  {
    field: "M_STOCK",
    headerName: "M_STOCK",
    resizable: true,
    width: 80,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "gray", fontWeight: "bold" }}>
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
      <span style={{ color: "#F117FF", fontWeight: "bold" }}>
        {params.data?.OUT_KHO_SX}
      </span>
    ),
  },
  {
    field: "OUT_CFM_QTY",
    headerName: "WH_IN",
    resizable: true,
    width: 80,
    editable: false,
    cellRenderer: (params: any) => (
      <span style={{ color: "#F117FF", fontWeight: "bold" }}>
        {params.data?.OUT_CFM_QTY}
      </span>
    ),
  },
];
