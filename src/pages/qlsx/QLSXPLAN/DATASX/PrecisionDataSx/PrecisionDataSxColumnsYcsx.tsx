import React from 'react';

  export const column_datasx_ycsx: any = [
    { field: 'PROD_REQUEST_NO', headerName: 'YCSX_NO', resizable: true, width: 70, pinned: 'left' },
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', resizable: true, width: 80, pinned: 'left' },
    { field: 'G_NAME', headerName: 'G_NAME', resizable: true, width: 80 },
    {
      field: 'YCSX_PENDING', headerName: 'YCSX_PENDING', resizable: true, width: 80, cellRenderer: (e: any) => {
        if (e.data.YCSX_PENDING === "CLOSED") {
          return (
            <span style={{ color: "green", fontWeight: "bold" }}>
              CLOSED
            </span>
          );
        } else {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              PENDING
            </span>
          );
        }
      }
    },
    { field: 'G_CODE', headerName: 'G_CODE', resizable: true, width: 80 },
    { field: 'PHAN_LOAI', headerName: 'PHAN_LOAI', resizable: true, width: 80 },
    { field: 'FACTORY', headerName: 'FACTORY', resizable: true, width: 60 },
    { field: 'PROD_REQUEST_DATE', headerName: 'YCSX DATE', resizable: true, width: 80 },
    {
      field: 'PROD_REQUEST_QTY', headerName: 'YCSX QTY', resizable: true, width: 70, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {e.data.PROD_REQUEST_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    { field: 'M_NAME', headerName: 'M_NAME', resizable: true, width: 80 },
    {
      field: 'M_OUTPUT', headerName: 'M_OUTPUT', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {e.data.M_OUTPUT?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'NEXT_IN_QTY', headerName: 'NEXT_IN_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {e.data.NEXT_IN_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'IQC_IN', headerName: 'IQC_IN', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {e.data.IQC_IN?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'NOT_SCANNED_QTY', headerName: 'NOT_SCANNED_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {e.data.NOT_SCANNED_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'SCANNED_QTY', headerName: 'SCANNED_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {e.data.SCANNED_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'REMAIN_QTY', headerName: 'REMAIN_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {e.data.REMAIN_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'USED_QTY', headerName: 'USED_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {e.data.USED_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'LOCK_QTY', headerName: 'LOCK_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {e.data.LOCK_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'TON_KHO_AO', headerName: 'TON_KHO_AO', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "#ab27e3", fontWeight: "bold" }}>
            {e.data.TON_KHO_AO?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'RETURN_IQC', headerName: 'RETURN_IQC', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "#ab27e3", fontWeight: "bold" }}>
            {e.data.RETURN_IQC?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'NEXT_OUT_QTY', headerName: 'NEXT_OUT_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "#ab27e3", fontWeight: "bold" }}>
            {e.data.NEXT_OUT_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'RETURN_QTY', headerName: 'RETURN_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "#ab27e3", fontWeight: "bold" }}>
            {e.data.RETURN_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    { field: 'PD', headerName: 'PD', resizable: true, width: 80 },
    { field: 'CAVITY', headerName: 'CAVITY', resizable: true, width: 80 },
    {
      field: 'WAREHOUSE_ESTIMATED_QTY', headerName: 'WAREHOUSE_ESTIMATED_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {e.data.WAREHOUSE_ESTIMATED_QTY?.toLocaleString("en-US", {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            })}
          </span>
        );
      }
    },
    {
      field: 'ESTIMATED_QTY', headerName: 'ESTIMATED_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {e.data.ESTIMATED_QTY?.toLocaleString("en-US", {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            })}
          </span>
        );
      }
    },
    {
      field: 'CD1', headerName: 'CD1', resizable: true, width: 60, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "purple", fontWeight: "bold" }}>
            {e.data.CD1?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'CD2', headerName: 'CD2', resizable: true, width: 60, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "purple", fontWeight: "bold" }}>
            {e.data.CD2?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'CD3', headerName: 'CD3', resizable: true, width: 60, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "purple", fontWeight: "bold" }}>
            {e.data.CD3?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'CD4', headerName: 'CD4', resizable: true, width: 60, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "purple", fontWeight: "bold" }}>
            {e.data.CD4?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'BTP_QTY', headerName: 'BTP_QTY', resizable: true, width: 60, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "red", fontWeight: "normal" }}>
            {e.data.BTP_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'INS_INPUT', headerName: 'INS_INPUT', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {e.data.INS_INPUT?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'INSPECT_BALANCE_QTY', headerName: 'INSP_BALANCE', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "red", fontWeight: "normal" }}>
            {e.data.INSPECT_BALANCE_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'INSPECT_TOTAL_QTY', headerName: 'INSPECT_TOTAL_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {e.data.INSPECT_TOTAL_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'INSPECT_OK_QTY', headerName: 'INSPECT_OK_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {e.data.INSPECT_OK_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'INSPECT_LOSS_QTY', headerName: 'INSPECT_LOSS_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {e.data.INSPECT_LOSS_QTY?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'INSPECT_TOTAL_NG', headerName: 'INSPECT_TOTAL_NG', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {e.data.INSPECT_TOTAL_NG?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'INSPECT_MATERIAL_NG', headerName: 'INSPECT_MATERIAL_NG', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {e.data.INSPECT_MATERIAL_NG?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'INSPECT_PROCESS_NG', headerName: 'INSPECT_PROCESS_NG', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {e.data.INSPECT_PROCESS_NG?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    {
      field: 'INS_OUTPUT', headerName: 'INS_OUTPUT', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {e.data.INS_OUTPUT?.toLocaleString("en-US")}
          </span>
        );
      }
    },
    /* {
      field: 'LOSS_SX1', headerName: 'LOSS_SX1', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "red", fontWeight: "normal" }}>
            {e.data.LOSS_SX1?.toLocaleString("en-US", { style: 'percent', maximumFractionDigits: 1, minimumFractionDigits: 1 })}
          </span>
        );
      }
    },
    {
      field: 'LOSS_SX2', headerName: 'LOSS_SX2', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "red", fontWeight: "normal" }}>
            {e.data.LOSS_SX2?.toLocaleString("en-US", { style: 'percent', maximumFractionDigits: 1, minimumFractionDigits: 1 })}
          </span>
        );
      }
    },
    {
      field: 'LOSS_SX3', headerName: 'LOSS_SX3', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "red", fontWeight: "normal" }}>
            {e.data.LOSS_SX3?.toLocaleString("en-US", { style: 'percent', maximumFractionDigits: 1, minimumFractionDigits: 1 })}
          </span>
        );
      }
    },
    {
      field: 'LOSS_SX4', headerName: 'LOSS_SX4', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "red", fontWeight: "normal" }}>
            {e.data.LOSS_SX4?.toLocaleString("en-US", { style: 'percent', maximumFractionDigits: 1, minimumFractionDigits: 1 })}
          </span>
        );
      }
    },
    {
      field: 'LOSS_INSPECT', headerName: 'LOSS_INSPECT', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "red", fontWeight: "normal" }}>
            {e.data.LOSS_INSPECT?.toLocaleString("en-US", { style: 'percent', maximumFractionDigits: 1, minimumFractionDigits: 1 })}
          </span>
        );
      }
    },
     */
    {
      field: 'LOSS_LT', headerName: 'LOSS_LT', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {e.data.LOSS_LT?.toLocaleString("en-US", { style: 'percent', maximumFractionDigits: 1, minimumFractionDigits: 1 })}
          </span>
        );
      }
    },
    {
      field: 'TOTAL_LOSS', headerName: 'TOTAL_LOSS', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {e.data.TOTAL_LOSS?.toLocaleString("en-US", { style: 'percent', maximumFractionDigits: 1, minimumFractionDigits: 1 })}
          </span>
        );
      }
    },
    {
      field: 'TOTAL_LOSS2', headerName: 'TOTAL_LOSS2', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {e.data.TOTAL_LOSS2?.toLocaleString("en-US", { style: 'percent', maximumFractionDigits: 1, minimumFractionDigits: 1 })}
          </span>
        );
      }
    },
    {
      field: 'LOSS_OVER', headerName: 'LOSS_OVER', resizable: true, width: 80, cellRenderer: (e: any) => {
        if (e.data.LOSS_OVER === 'OVER') {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              OVER
            </span>
          );
        }
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            OK
          </span>
        );
      }
    },
    { field: 'EQ1', headerName: 'EQ1', resizable: true, width: 40 },
    { field: 'EQ2', headerName: 'EQ2', resizable: true, width: 40 },
    { field: 'EQ3', headerName: 'EQ3', resizable: true, width: 40 },
    { field: 'EQ4', headerName: 'EQ4', resizable: true, width: 40 },
  ];
