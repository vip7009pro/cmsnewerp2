import React from 'react';

  export const column_daily_datasx_ycsx: any = [
    { field: 'PLAN_DATE', headerName: 'PLAN_DATE', resizable: true, width: 80, pinned: 'left', cellDataType: 'text' },
    {
      headerName: 'CD1',
      children: [
        {
          field: 'TARGET1', headerName: 'TARGET1', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.TARGET1 !== 0)
              return (
                <span style={{ color: "blue", fontWeight: "normal", }}>
                  {e.data.TARGET1?.toLocaleString("en-US")}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
        {
          field: 'INPUT1', headerName: 'INPUT1', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.INPUT1 !== 0)
              return (
                <span style={{ color: "#f15bcc", fontWeight: "normal" }}>
                  {e.data.INPUT1?.toLocaleString("en-US", {
                    style: "decimal",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
        {
          field: 'RESULT1', headerName: 'RESULT1', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.RESULT1 !== 0)
              return (
                <span style={{ color: "#09b420", fontWeight: "normal" }}>
                  {e.data.RESULT1?.toLocaleString("en-US", {
                    style: "decimal",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
        {
          field: 'LOSS1', headerName: 'LOSS1', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.LOSS1 !== 0)
              return (
                <span style={{ color: "#ff0000", fontWeight: "bold" }}>
                  {e.data.LOSS1?.toLocaleString("en-US", {
                    style: "percent",
                    maximumFractionDigits: 1,
                    minimumFractionDigits: 1,
                  })}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
      ],
      headerClass: 'header'
    },
    {
      headerName: 'CD2',
      children: [
        {
          field: 'TARGET2', headerName: 'TARGET2', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.TARGET2 !== 0)
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.TARGET2?.toLocaleString("en-US")}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
        {
          field: 'INPUT2', headerName: 'INPUT2', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.INPUT2 !== 0)
              return (
                <span style={{ color: "#f15bcc", fontWeight: "normal" }}>
                  {e.data.INPUT2?.toLocaleString("en-US", {
                    style: "decimal",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
        {
          field: 'RESULT2', headerName: 'RESULT2', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.RESULT2 !== 0)
              return (
                <span style={{ color: "#09b420", fontWeight: "normal" }}>
                  {e.data.RESULT2?.toLocaleString("en-US", {
                    style: "decimal",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
        {
          field: 'LOSS2', headerName: 'LOSS2', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.LOSS2 !== 0)
              return (
                <span style={{ color: "#ff0000", fontWeight: "bold" }}>
                  {e.data.LOSS2?.toLocaleString("en-US", {
                    style: "percent",
                    maximumFractionDigits: 1,
                    minimumFractionDigits: 1,
                  })}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
      ],
      headerClass: 'header'
    },
    {
      headerName: 'CD3',
      children: [
        {
          field: 'TARGET3', headerName: 'TARGET3', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.TARGET3 !== 0)
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.TARGET3?.toLocaleString("en-US")}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
        {
          field: 'INPUT3', headerName: 'INPUT3', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.INPUT3 !== 0)
              return (
                <span style={{ color: "#f15bcc", fontWeight: "normal" }}>
                  {e.data.INPUT3?.toLocaleString("en-US", {
                    style: "decimal",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
        {
          field: 'RESULT3', headerName: 'RESULT3', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.RESULT3 !== 0)
              return (
                <span style={{ color: "#09b420", fontWeight: "normal" }}>
                  {e.data.RESULT3?.toLocaleString("en-US", {
                    style: "decimal",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
        {
          field: 'LOSS3', headerName: 'LOSS3', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.LOSS3 !== 0)
              return (
                <span style={{ color: "#ff0000", fontWeight: "bold" }}>
                  {e.data.LOSS3?.toLocaleString("en-US", {
                    style: "percent",
                    maximumFractionDigits: 1,
                    minimumFractionDigits: 1,
                  })}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
      ],
      headerClass: 'header'
    },
    {
      headerName: 'CD4',
      children: [
        {
          field: 'TARGET4', headerName: 'TARGET4', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.TARGET4 !== 0)
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.TARGET4?.toLocaleString("en-US")}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
        {
          field: 'INPUT4', headerName: 'INPUT4', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.INPUT4 !== 0)
              return (
                <span style={{ color: "#f15bcc", fontWeight: "normal" }}>
                  {e.data.INPUT4?.toLocaleString("en-US", {
                    style: "decimal",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
        {
          field: 'RESULT4', headerName: 'RESULT4', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.RESULT4 !== 0)
              return (
                <span style={{ color: "#09b420", fontWeight: "normal" }}>
                  {e.data.RESULT4?.toLocaleString("en-US", {
                    style: "decimal",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
        {
          field: 'LOSS4', headerName: 'LOSS4', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.LOSS4 !== 0)
              return (
                <span style={{ color: "#ff0000", fontWeight: "bold" }}>
                  {e.data.LOSS4?.toLocaleString("en-US", {
                    style: "percent",
                    maximumFractionDigits: 1,
                    minimumFractionDigits: 1,
                  })}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
      ],
      headerClass: 'header'
    },
    {
      headerName: 'INSPECTION',
      children: [
        {
          field: 'INSP_QTY', headerName: 'INSP_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.INSP_QTY !== 0)
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.INSP_QTY?.toLocaleString("en-US", {
                    style: "decimal",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
        {
          field: 'INSP_LOSS', headerName: 'INSP_LOSS', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.INSP_LOSS !== 0)
              return (
                <span style={{ color: "gray", fontWeight: "gray" }}>
                  {e.data.INSP_LOSS?.toLocaleString("en-US", {
                    style: "decimal",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
        {
          field: 'INSP_NG', headerName: 'INSP_NG', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.INSP_NG !== 0)
              return (
                <span style={{ color: "red", fontWeight: "red" }}>
                  {e.data.INSP_NG?.toLocaleString("en-US", {
                    style: "decimal",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
        {
          field: 'INSP_OK', headerName: 'INSP_OK', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.INSP_OK !== 0)
              return (
                <span style={{ color: "#09b420", fontWeight: "normal" }}>
                  {e.data.INSP_OK?.toLocaleString("en-US", {
                    style: "decimal",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
        {
          field: 'LOSS_KT', headerName: 'LOSS_KT', resizable: true, width: 80, cellRenderer: (e: any) => {
            if (e.data.LOSS_KT !== 0)
              return (
                <span style={{ color: "#ff0000", fontWeight: "bold" }}>
                  {e.data.LOSS_KT?.toLocaleString("en-US", {
                    style: "percent",
                    maximumFractionDigits: 1,
                    minimumFractionDigits: 1,
                  })}
                </span>
              );
            return (
              <span style={{ color: "blue", fontWeight: "normal", }}>
              </span>
            )
          }
        },
      ],
      headerClass: 'header'
    },
  ];

  export const column_inputlieudatatable: any = [
    { field: 'M_LOT_NO', headerName: 'M_LOT_NO', resizable: true, width: 80 },
    { field: 'INPUT_QTY', headerName: 'INPUT_QTY', resizable: true, width: 80 },
    { field: 'USED_QTY', headerName: 'USED_QTY', resizable: true, width: 80 },
    { field: 'REMAIN_QTY', headerName: 'REMAIN_QTY', resizable: true, width: 80 },
    { field: 'PLAN_ID', headerName: 'PLAN_ID', resizable: true, width: 80 },
    { field: 'M_NAME', headerName: 'M_NAME', resizable: true, width: 80 },
    { field: 'WIDTH_CD', headerName: 'WIDTH_CD', resizable: true, width: 80 },
    { field: 'PROD_REQUEST_NO', headerName: 'PROD_REQUEST_NO', resizable: true, width: 80 },
    { field: 'G_NAME', headerName: 'G_NAME', resizable: true, width: 80 },
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', resizable: true, width: 80 },
    { field: 'M_CODE', headerName: 'M_CODE', resizable: true, width: 80 },
    { field: 'EMPL_NO', headerName: 'EMPL_NO', resizable: true, width: 80 },
    { field: 'EQUIPMENT_CD', headerName: 'EQUIPMENT_CD', resizable: true, width: 80 },
    { field: 'INS_DATE', headerName: 'INS_DATE', resizable: true, width: 80 },
  ];

  export const column_nhapkhoaotable: any = [
    { field: "USE_YN", headerName: "USE_YN", width: 40 },
    { field: "PHANLOAI", headerName: "PL", width: 30 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 70 },
    { field: "PLAN_ID_INPUT", headerName: "PLAN_INPUT", width: 70 },
    { field: "PLAN_ID_SUDUNG", headerName: "PLAN_SUDUNG", width: 80 },
    { field: "TOTAL_IN_QTY", headerName: "INPUT_QTY", width: 70 },
    { field: "IN_KHO_ID", headerName: "ID", width: 50 },
    { field: "FACTORY", headerName: "FACTORY", width: 100 },
    { field: "M_CODE", headerName: "M_CODE", width: 80 },
    { field: "M_NAME", headerName: "M_NAME", width: 150 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 80 },
    { field: "ROLL_QTY", headerName: "ROLL_QTY", width: 80 },
    { field: "IN_QTY", headerName: "IN_QTY", width: 80 },
    { field: "REMARK", headerName: "REMARK", width: 90 },
    { field: "INS_DATE", headerName: "INS_DATE", width: 150 },
    { field: "KHO_CFM_DATE", headerName: "KHO_CFM_DATE", width: 100 },
    { field: "RETURN_STATUS", headerName: "RETURN_STATUS", width: 100 },
  ];
