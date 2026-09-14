import React from "react";

export const getTestItemColumns = () => {
  return [
    {
      field: "TEST_CODE",
      headerName: "Mã Hạng Mục",
      width: 120,
      cellRenderer: (params: any) => {
        if (!params.value && params.value !== 0) return "";
        return (
          <span className="precision-testtable__codeChip">
            {params.value}
          </span>
        );
      },
    },
    {
      field: "TEST_NAME",
      headerName: "Tên Hạng Mục Kiểm Tra",
      flex: 1,
      minWidth: 180,
      cellRenderer: (params: any) => {
        return (
          <span className="precision-testtable__itemName">
            {params.value || ""}
          </span>
        );
      },
    },
    {
      field: "TEST_TIME",
      headerName: "Thời Gian Test",
      width: 130,
      cellRenderer: (params: any) => {
        if (!params.value) return <span style={{ color: "#94a3b8" }}>—</span>;
        return (
          <span className="precision-testtable__timeBadge">
            {params.value}
          </span>
        );
      },
    },
  ];
};

export const getTestPointColumns = () => {
  return [
    {
      field: "POINT_CODE",
      headerName: "Mã Điểm Đo",
      width: 110,
      cellRenderer: (params: any) => {
        if (!params.value && params.value !== 0) return "";
        return (
          <span className="precision-testtable__pointChip">
            P.{params.value}
          </span>
        );
      },
    },
    {
      field: "POINT_NAME",
      headerName: "Tên Điểm Đo (Point Name)",
      flex: 1,
      minWidth: 160,
      cellRenderer: (params: any) => {
        return (
          <span className="precision-testtable__itemName">
            {params.value || ""}
          </span>
        );
      },
    },
    {
      field: "TEST_CODE",
      headerName: "Mã Hạng Mục",
      width: 110,
      cellRenderer: (params: any) => {
        if (!params.value && params.value !== 0) return "";
        return (
          <span className="precision-testtable__codeChip">
            {params.value}
          </span>
        );
      },
    },
    {
      field: "TEST_NAME",
      headerName: "Hạng Mục",
      width: 160,
      cellRenderer: (params: any) => {
        return <span>{params.value || ""}</span>;
      },
    },
  ];
};
