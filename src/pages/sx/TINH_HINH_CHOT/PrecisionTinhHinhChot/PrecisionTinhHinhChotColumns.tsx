import React from "react";

export const getTinhHinhChotColumns = () => {
  return [
    {
      field: "SX_DATE",
      headerName: "SX_DATE",
      width: 110,
      editable: false,
      pinned: "left",
      cellRenderer: (params: any) => {
        if (!params.value) return "";
        return (
          <span className="precision-thc__date-badge">
            {params.value}
          </span>
        );
      },
    },
    {
      field: "TOTAL",
      headerName: "Tổng SL Chỉ Thị",
      width: 130,
      editable: false,
      cellRenderer: (params: any) => {
        const val = Number(params.value) || 0;
        return (
          <span className="precision-thc__num precision-thc__num--total">
            {val.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "DA_CHOT",
      headerName: "Đã Chốt Báo Cáo",
      width: 140,
      editable: false,
      cellRenderer: (params: any) => {
        const val = Number(params.value) || 0;
        return (
          <span className="precision-thc__num precision-thc__num--success">
            {val.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "CHUA_CHOT",
      headerName: "Chưa Chốt Báo Cáo",
      width: 150,
      editable: false,
      cellRenderer: (params: any) => {
        const val = Number(params.value) || 0;
        if (val > 0) {
          return (
            <span className="precision-thc__pill-warning">
              ⚠️ {val.toLocaleString("en-US")}
            </span>
          );
        }
        return (
          <span className="precision-thc__num precision-thc__num--zero">0</span>
        );
      },
    },
    {
      field: "TL_CHOT",
      headerName: "Tỷ Lệ Chốt (%)",
      width: 125,
      editable: false,
      cellRenderer: (params: any) => {
        const val = Number(params.value) || 0;
        const isComplete = val >= 100;
        return (
          <div className="precision-thc__rate-cell">
            <div className="precision-thc__rate-bar">
              <div
                className={`precision-thc__rate-fill ${
                  isComplete ? "complete" : val >= 80 ? "good" : "warning"
                }`}
                style={{ width: `${Math.min(val, 100)}%` }}
              />
            </div>
            <span
              className={`precision-thc__rate-text ${
                isComplete ? "text-success" : "text-warning"
              }`}
            >
              {val}%
            </span>
          </div>
        );
      },
    },
    {
      field: "DA_NHAP_HIEUSUAT",
      headerName: "Đã Nhập Hiệu Suất",
      width: 150,
      editable: false,
      cellRenderer: (params: any) => {
        const val = Number(params.value) || 0;
        return (
          <span className="precision-thc__num precision-thc__num--success">
            {val.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "CHUA_NHAP_HIEUSUAT",
      headerName: "Chưa Nhập Hiệu Suất",
      width: 160,
      editable: false,
      cellRenderer: (params: any) => {
        const val = Number(params.value) || 0;
        if (val > 0) {
          return (
            <span className="precision-thc__pill-danger">
              ⚠️ {val.toLocaleString("en-US")}
            </span>
          );
        }
        return (
          <span className="precision-thc__num precision-thc__num--zero">0</span>
        );
      },
    },
    {
      field: "TL_HIEUSUAT",
      headerName: "Tỷ Lệ Nhập HS (%)",
      width: 125,
      editable: false,
      cellRenderer: (params: any) => {
        const val = Number(params.value) || 0;
        const isComplete = val >= 100;
        return (
          <div className="precision-thc__rate-cell">
            <div className="precision-thc__rate-bar">
              <div
                className={`precision-thc__rate-fill ${
                  isComplete ? "complete" : val >= 80 ? "good" : "danger"
                }`}
                style={{ width: `${Math.min(val, 100)}%` }}
              />
            </div>
            <span
              className={`precision-thc__rate-text ${
                isComplete ? "text-success" : "text-danger"
              }`}
            >
              {val}%
            </span>
          </div>
        );
      },
    },
  ];
};
