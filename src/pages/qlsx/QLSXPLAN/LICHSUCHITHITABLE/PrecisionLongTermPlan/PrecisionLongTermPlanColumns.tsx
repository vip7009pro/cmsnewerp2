import React from "react";
import moment from "moment";

export const WEEKDAY_ARRAY = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export interface GetColumnsLongTermPlanProps {
  fromDate: string;
}

export const getColumnsLongTermPlan = ({ fromDate }: GetColumnsLongTermPlanProps) => {
  // 16 cột ngày từ D1 đến D16
  const dayColumns = Array.from({ length: 16 }, (_, i) => {
    const dayIndex = i; // 0 to 15
    const colNumber = i + 1; // 1 to 16
    const targetDate = moment.utc(fromDate).add(dayIndex, "days");
    const headerTitle = `${targetDate.format("DD/MM")} (${WEEKDAY_ARRAY[targetDate.weekday()]})`;

    return {
      field: `D${colNumber}`,
      headerName: headerTitle,
      width: 65,
      editable: true,
      cellStyle: { textAlign: "right", fontFamily: "JetBrains Mono, monospace" },
      cellRenderer: (params: any) => {
        if (params.value === null || params.value === undefined || params.value === "") {
          return null;
        }
        return (
          <span style={{ color: "#0f172a", fontWeight: 600 }}>
            {Number(params.value).toLocaleString("en-US")}
          </span>
        );
      },
    };
  });

  return [
    {
      field: "G_CODE",
      headerName: "G_CODE",
      width: 110,
      editable: false,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      cellRenderer: (params: any) => {
        const isUnplanned = !params.data?.PLAN_DATE || params.data.PLAN_DATE === "";
        return (
          <span
            style={{
              color: isUnplanned ? "#dc2626" : "#2563eb",
              fontWeight: 700,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 150,
      editable: false,
      tooltipField: "G_NAME",
      cellStyle: { fontWeight: 500 },
    },
    {
      field: "PROCESS_NUMBER",
      headerName: "CD",
      width: 45,
      editable: false,
      cellStyle: { textAlign: "center", fontWeight: 700, color: "#64748b" },
    },
    {
      field: "EQ_NAME",
      headerName: "EQ_NAME",
      width: 65,
      editable: false,
      cellStyle: { textAlign: "center", fontWeight: 700, color: "#0284c7" },
    },
    {
      field: "PROD_REQUEST_QTY",
      headerName: "YCSX_QTY",
      width: 75,
      editable: false,
      cellStyle: { textAlign: "right", fontFamily: "JetBrains Mono, monospace" },
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#2563eb", fontWeight: 600 }}>
            {params.data?.PROD_REQUEST_QTY?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "KETQUASX",
      headerName: "KETQUASX",
      width: 75,
      editable: false,
      cellStyle: { textAlign: "right", fontFamily: "JetBrains Mono, monospace" },
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#16a34a", fontWeight: 600 }}>
            {params.data?.KETQUASX?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "TON_YCSX",
      headerName: "TON_YCSX",
      width: 75,
      editable: false,
      cellStyle: { textAlign: "right", fontFamily: "JetBrains Mono, monospace" },
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#dc2626", fontWeight: 700 }}>
            {params.data?.TON_YCSX?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "UPH",
      headerName: "UPH",
      width: 60,
      editable: false,
      cellStyle: { textAlign: "right", fontFamily: "JetBrains Mono, monospace" },
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#0284c7", fontWeight: 600 }}>
            {params.data?.UPH?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "PLAN_DATE",
      headerName: "PLAN_DATE",
      width: 90,
      editable: false,
      cellStyle: { textAlign: "center", fontFamily: "JetBrains Mono, monospace" },
    },
    ...dayColumns,
  ];
};
