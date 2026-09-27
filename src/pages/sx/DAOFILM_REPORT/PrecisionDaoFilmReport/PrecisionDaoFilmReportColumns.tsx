import { CustomCellRendererProps } from "ag-grid-react";
import React, { useMemo } from "react";
import { DaoFilmReportBackData, DaoFilmReportDetailData } from "../../utils/daoFilmReportUtils";

export function useDaoFilmReportColumns(isMobile?: boolean) {
  const colDefs = useMemo(() => {
    return [
      {
        field: "STT",
        headerName: "STT",
        width: isMobile ? 55 : 60,
        resizable: true,
        pinned: "left" as const,
      },
      {
        field: "MA_DAO",
        headerName: "MA_DAO",
        width: isMobile ? 120 : 130,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
        pinned: isMobile ? ("left" as const) : undefined,
      },
      {
        field: "MA_DAO_KT",
        headerName: "MA_DAO_KT",
        width: isMobile ? 125 : 140,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
      },
      {
        field: "StandardQty",
        headerName: "STANDARD",
        width: isMobile ? 100 : 110,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
        cellRenderer: (params: CustomCellRendererProps<DaoFilmReportBackData>) => (
          <span style={{ color: "#1d4ed8", fontWeight: "bold" }}>
            {(params.data?.StandardQty ?? 0).toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "TotalPress",
        headerName: "TOTAL_PRESS",
        width: isMobile ? 110 : 120,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
        cellRenderer: (params: CustomCellRendererProps<DaoFilmReportBackData>) => {
          const overPress = (params.data?.TotalPress ?? 0) >= (params.data?.StandardQty ?? 0);
          return (
            <span style={{ color: overPress ? "#dc2626" : "#0f766e", fontWeight: "bold" }}>
              {(params.data?.TotalPress ?? 0).toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "ExportCount",
        headerName: "EXPORT_COUNT",
        width: isMobile ? 105 : 120,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
        cellRenderer: (params: CustomCellRendererProps<DaoFilmReportBackData>) => (
          <span style={{ color: "#475569", fontWeight: "bold" }}>
            {(params.data?.ExportCount ?? 0).toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "NGAY_BAN_GIAO",
        headerName: "NGAY_BAN_GIAO",
        width: isMobile ? 115 : 130,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
      },
      {
        field: "OVER_STATUS",
        headerName: "OVER",
        width: isMobile ? 80 : 90,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
        cellRenderer: (params: CustomCellRendererProps<DaoFilmReportBackData>) => {
          const status = params.data?.OVER_STATUS ?? "";
          return (
            <span style={{ fontWeight: "bold", color: status === "OK" ? "#0f766e" : "#dc2626" }}>
              {status}
            </span>
          );
        },
        cellStyle: (params: any) => {
          if (params.data?.OVER_STATUS === "OK") {
            return { backgroundColor: "#dcfce7" };
          }
          return { backgroundColor: "#fee2e2" };
        },
      },
      {
        field: "OVER_PERCENTAGE",
        headerName: "OVER_%",
        width: isMobile ? 95 : 100,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
        cellRenderer: (params: CustomCellRendererProps<DaoFilmReportBackData>) => {
          const value = params.data?.OVER_PERCENTAGE ?? 0;
          return (
            <span style={{ color: value >= 100 ? "#dc2626" : "#1d4ed8", fontWeight: "bold" }}>
              {value.toFixed(2)}%
            </span>
          );
        },
      },
    ];
  }, [isMobile]);

  const detailColDefs = useMemo(() => {
    return [
      {
        field: "MA_DAO",
        headerName: "MA_DAO",
        width: isMobile ? 95 : 100,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
        pinned: isMobile ? ("left" as const) : undefined,
      },
      {
        field: "MA_DAO_KT",
        headerName: "MA_DAO_KT",
        width: isMobile ? 95 : 100,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
      },
      {
        field: "G_CODE",
        headerName: "CODE",
        width: isMobile ? 80 : 60,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
      },
      {
        field: "G_NAME",
        headerName: "CODE_NAME",
        width: isMobile ? 120 : 100,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
      },
      {
        field: "PD",
        headerName: "PD",
        width: isMobile ? 50 : 40,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
      },
      {
        field: "CAVITY",
        headerName: "CAVITY",
        width: isMobile ? 65 : 50,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
      },
      {
        field: "QTY",
        headerName: "QTY",
        width: isMobile ? 65 : 30,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
        cellRenderer: (params: CustomCellRendererProps<DaoFilmReportDetailData>) => (
          <span style={{ color: "#1d4ed8", fontWeight: "bold" }}>
            {(params.data?.QTY ?? 0).toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "PRESS_QTY",
        headerName: "PRESS_QTY",
        width: isMobile ? 85 : 60,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
        cellRenderer: (params: CustomCellRendererProps<DaoFilmReportDetailData>) => (
          <span style={{ color: "#0f766e", fontWeight: "bold" }}>
            {(params.data?.PRESS_QTY ?? 0).toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "EMPL_NO",
        headerName: "EMPL_NO",
        width: isMobile ? 75 : 50,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
      },
      {
        field: "SX_EMPL",
        headerName: "SX_EMPL",
        width: isMobile ? 95 : 50,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
      },
      {
        field: "SX_DATE",
        headerName: "SX_DATE",
        width: isMobile ? 95 : 50,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
      },
      {
        field: "PLAN_ID",
        headerName: "PLAN_ID",
        width: isMobile ? 85 : 50,
        resizable: true,
        floatingFilter: !isMobile,
        filter: true,
      },
    ];
  }, [isMobile]);

  return { colDefs, detailColDefs };
}
