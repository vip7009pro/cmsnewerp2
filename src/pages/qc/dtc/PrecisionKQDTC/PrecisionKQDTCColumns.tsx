import React from "react";

export const buildDTCColumns = (): any[] => {
  return [
    {
      field: "DTC_ID",
      headerName: "DTC_ID",
      width: 90,
      cellRenderer: (params: any) => {
        if (!params.value) return <span></span>;
        return <span className="kqdtc-mono">{params.value}</span>;
      },
    },
    {
      field: "PROD_REQUEST_NO",
      headerName: "YCSX",
      width: 95,
      cellRenderer: (params: any) => {
        if (!params.value) return <span></span>;
        return <span className="kqdtc-mono">{params.value}</span>;
      },
    },
    {
      field: "G_CODE",
      headerName: "G_CODE",
      width: 90,
      cellRenderer: (params: any) => {
        if (!params.value) return <span></span>;
        return <span className="kqdtc-mono">{params.value}</span>;
      },
    },
    {
      field: "G_NAME",
      headerName: "TÊN SẢN PHẨM",
      width: 190,
      cellRenderer: (params: any) => {
        if (params.data?.M_CODE !== "B0000035") return <span></span>;
        return (
          <span style={{ fontWeight: 700, color: "#1e293b" }}>
            {params.data?.G_NAME}
          </span>
        );
      },
    },
    {
      field: "M_CODE",
      headerName: "MÃ LIỆU",
      width: 90,
      cellRenderer: (params: any) => {
        if (params.data?.M_CODE === "B0000035") return <span></span>;
        return <span className="kqdtc-mono">{params.data?.M_CODE}</span>;
      },
    },
    {
      field: "M_NAME",
      headerName: "TÊN VẬT LIỆU",
      width: 160,
      cellRenderer: (params: any) => {
        if (params.data?.M_CODE === "B0000035") return <span></span>;
        return (
          <span style={{ fontWeight: 700, color: "#0f766e" }}>
            {params.data?.M_NAME}
          </span>
        );
      },
    },
    {
      field: "TEST_NAME",
      headerName: "HẠNG MỤC TEST",
      width: 130,
      cellRenderer: (params: any) => {
        return (
          <span style={{ fontWeight: 600, color: "#2563eb" }}>
            {params.value}
          </span>
        );
      },
    },
    {
      field: "POINT_CODE",
      headerName: "POINT",
      width: 80,
      cellRenderer: (params: any) => {
        return <span className="kqdtc-mono">{params.value}</span>;
      },
    },
    {
      field: "CENTER_VALUE",
      headerName: "CENTER_VAL",
      width: 105,
      cellRenderer: (params: any) => {
        return (
          <span className="kqdtc-val" style={{ color: "#4338ca" }}>
            {params.value}
          </span>
        );
      },
    },
    {
      field: "UPPER_TOR",
      headerName: "UPPER_TOR",
      width: 95,
      cellRenderer: (params: any) => {
        return <span className="kqdtc-val">+{params.value}</span>;
      },
    },
    {
      field: "LOWER_TOR",
      headerName: "LOWER_TOR",
      width: 95,
      cellRenderer: (params: any) => {
        return <span className="kqdtc-val">-{params.value}</span>;
      },
    },
    {
      field: "RESULT",
      headerName: "KẾT QUẢ ĐO",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span className="kqdtc-val" style={{ color: "#0f172a" }}>
            {params.value}
          </span>
        );
      },
    },
    {
      field: "DANHGIA",
      headerName: "ĐÁNH GIÁ",
      width: 90,
      cellRenderer: (params: any) => {
        if (params.value === "OK") {
          return <span className="kqdtc-badge kqdtc-badge--ok">OK</span>;
        }
        return <span className="kqdtc-badge kqdtc-badge--ng">NG</span>;
      },
    },
    { field: "REMARK", headerName: "GHI CHÚ", width: 100 },
    { field: "BARCODE_CONTENT", headerName: "BARCODE", width: 130 },
    { field: "FACTORY", headerName: "NHÀ MÁY", width: 85 },
    { field: "TEST_FINISH_TIME", headerName: "THỜI GIAN TEST", width: 145 },
    { field: "TEST_EMPL_NO", headerName: "NV TEST", width: 95 },
    { field: "TEST_TYPE_NAME", headerName: "LOẠI TEST", width: 130 },
    { field: "WORK_POSITION_NAME", headerName: "BỘ PHẬN", width: 90 },
    { field: "SAMPLE_NO", headerName: "SAMPLE_NO", width: 90 },
    { field: "REQUEST_DATETIME", headerName: "NGÀY YÊU CẦU", width: 145 },
    { field: "REQUEST_EMPL_NO", headerName: "NV YÊU CẦU", width: 95 },
    { field: "SIZE", headerName: "KÍCH THƯỚC", width: 85 },
    { field: "LOTCMS", headerName: "LOT CMS", width: 90 },
    { field: "TEST_CODE", headerName: "MÃ TEST", width: 85 },
    { field: "TDS", headerName: "TDS", width: 80 },
    { field: "TDS_EMPL", headerName: "TDS EMPL", width: 90 },
    { field: "TDS_UPD_DATE", headerName: "NGÀY CẬP NHẬT TDS", width: 140 },
  ];
};
