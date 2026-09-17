import React from 'react';
import { CustomCellRendererProps } from 'ag-grid-react';

  export const column_datasx_chithi: any = [
    { field: 'PLAN_ID', headerName: 'PLAN_ID', resizable: true, width: 60, pinned: 'left' },
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', resizable: true, width: 80, pinned: 'left' },
    {
      headerName: 'PLAN_INFORMATION',
      children: [
        { field: 'PHAN_LOAI', headerName: 'PHAN_LOAI', resizable: true, width: 80, },
        { field: 'G_CODE', headerName: 'G_CODE', resizable: true, width: 80 },
        { field: 'PLAN_DATE', headerName: 'PLAN_DATE', resizable: true, width: 80 },
        { field: 'PROD_REQUEST_NO', headerName: 'PROD_REQUEST_NO', resizable: true, width: 60, },
        { field: 'G_NAME', headerName: 'G_NAME', resizable: true, width: 80 },
        {
          field: 'PLAN_QTY', headerName: 'PLAN_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "green", fontWeight: "bold" }}>
                {e.data.PLAN_QTY?.toLocaleString("en-US")}
              </span>
            );
          }
        },
        {
          field: 'PLAN_ORG_MET', headerName: 'PLAN_ORG_MET', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "#0d7ac4ff", fontWeight: "bold" }}>
                {e.data.PLAN_ORG_MET?.toLocaleString("en-US", {maximumFractionDigits: 0, minimumFractionDigits: 0})}
              </span>
            );
          }
        },
        {
          field: 'PLAN_TARGET_MET', headerName: 'PLAN_TARGET_MET', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "#0d7ac4ff", fontWeight: "bold" }}>
                {e.data.PLAN_TARGET_MET?.toLocaleString("en-US", {maximumFractionDigits: 0, minimumFractionDigits: 0})}
              </span>
            );
          }
        },
        {
          field: 'PLAN_LOSS', headerName: 'PLAN_LOSS', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "#990a75", fontWeight: "bold" }}>
                {e.data.PLAN_LOSS?.toLocaleString("en-US", {style: 'percent', maximumFractionDigits: 1, minimumFractionDigits: 1})}
              </span>
            );
          }
        },
        { field: 'EQ1', headerName: 'EQ1', resizable: true, width: 50 },
        { field: 'EQ2', headerName: 'EQ2', resizable: true, width: 50 },
        { field: 'PLAN_EQ', headerName: 'PLAN_EQ', resizable: true, width: 50 },
        { field: 'PLAN_FACTORY', headerName: 'PLAN_FACTORY', resizable: true, width: 50},
        { field: 'PROCESS_NUMBER', headerName: 'PROCESS_NUMBER', resizable: true, width: 50 },
        { field: 'STEP', headerName: 'STEP', resizable: true, width: 50 },
        { field: 'PD', headerName: 'PD', resizable: true, width: 50 },
        { field: 'CAVITY', headerName: 'CAVITY', resizable: true, width: 50 },
      ],
      headerClass: 'header'
    },
    {
      headerName: 'MATERIAL_TRACKING',
      children: [
        { field: 'M_NAME', headerName: 'M_NAME', resizable: true, width: 80 },
        {
          field: 'WAREHOUSE_OUTPUT_QTY', headerName: 'WAREHOUSE_OUTPUT_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "black", fontWeight: "bold" }}>
                {e.data.WAREHOUSE_OUTPUT_QTY?.toLocaleString("en-US")}
              </span>
            );
          }
        },
        {
          field: 'NEXT_IN_QTY', headerName: 'NEXT_IN_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "black", fontWeight: "bold" }}>
                {e.data.NEXT_IN_QTY?.toLocaleString("en-US")}
              </span>
            );
          }
        },
        {
          field: 'IQC_IN', headerName: 'IQC_IN', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "black", fontWeight: "bold" }}>
                {e.data.IQC_IN?.toLocaleString("en-US")}
              </span>
            );
          }
        },
        {
          field: 'NOT_BEEP_QTY', headerName: 'NOT_BEEP_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "#0570a1", fontWeight: "bold" }}>
                {e.data.NOT_BEEP_QTY?.toLocaleString("en-US")}
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
          field: 'BEEP_QTY', headerName: 'BEEP_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "blue", fontWeight: "bold" }}>
                {e.data.BEEP_QTY?.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}
              </span>
            );
          }
        },
        {
          field: 'USED_QTY', headerName: 'USED_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "green", fontWeight: "bold" }}>
                {e.data.USED_QTY?.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}
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
          field: 'TON_KHO_AO', headerName: 'TON_KHO_AO', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "#ab27e3", fontWeight: "bold" }}>
                {e.data.TON_KHO_AO?.toLocaleString("en-US")}
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
          field: 'RETURN_IQC', headerName: 'RETURN_IQC', resizable: true, width: 100, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "red", fontWeight: "bold" }}>
                {e.data.RETURN_IQC?.toLocaleString("en-US")}
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
      ],
      headerClass: 'header'
    },
    {
      headerName: 'PRODUCTION_RESULT',
      children: [
        { field: 'SETTING_MET_TC', headerName: 'SETTING_MET_TC', resizable: true, width: 80 },
        { field: 'SETTING_DM_SX', headerName: 'SETTING_DM_SX', resizable: true, width: 80 },
        {
          field: 'SETTING_MET', headerName: 'SETTING_MET', resizable: true, width: 80, cellRenderer: (e: CustomCellRendererProps) => {
            return (
              <span style={{ color: "#d96e0a", fontWeight: "bold" }}>
                {e.data.SETTING_MET?.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}
              </span>
            )
          }
        },
        {
          field: 'NG_MET', headerName: 'NG_MET', resizable: true, width: 80, cellRenderer: (e: CustomCellRendererProps) => {
            return (
              <span style={{ color: "#ef1b1b", fontWeight: "bold" }}>
                {e.data.NG_MET?.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}
              </span>
            )
          }
        },
        {
          field: 'KETQUASX_M', headerName: 'KETQUASX_M', resizable: true, width: 80, cellRenderer: (e: CustomCellRendererProps) => {
            return (
              <span style={{ color: "#059c32", fontWeight: "bold" }}>
                {e.data.KETQUASX_M?.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}
              </span>
            )
          }
        },
        {
          field: 'WAREHOUSE_ESTIMATED_QTY', headerName: 'WAREHOUSE_ESTIMATED_QTY', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "#1170dd", fontWeight: "bold" }}>
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
              <span style={{ color: "#1170dd", fontWeight: "bold" }}>
                {e.data.ESTIMATED_QTY?.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}
              </span>
            );
          }
        },
        {
          field: 'ESTIMATED_QTY_ST', headerName: 'ESTIMATED_QTY_ST', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "#1170dd", fontWeight: "bold" }}>
                {e.data.ESTIMATED_QTY_ST?.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}
              </span>
            );
          }
        },
        {
          field: 'SETTING_EA', headerName: 'SETTING_EA', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "gray", fontWeight: "bold" }}>
                {e.data.SETTING_EA?.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}
              </span>
            );
          }
        },
        {
          field: 'NG_EA', headerName: 'NG_EA', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "red", fontWeight: "bold" }}>
                {e.data.NG_EA?.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}
              </span>
            );
          }
        },
        {
          field: 'KETQUASX', headerName: 'KETQUASX', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "green", fontWeight: "bold" }}>
                {e.data.KETQUASX?.toLocaleString("en-US")}
              </span>
            );
          }
        },
        {
          field: 'KETQUASX_TP', headerName: 'KETQUASX_TP', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "purple", fontWeight: "bold" }}>
                {e.data.KETQUASX_TP?.toLocaleString("en-US")}
              </span>
            );
          }
        },
        {
          field: 'LOSS_SX_ST', headerName: 'LOSS_SX_ST', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "green", fontWeight: "bold" }}>
                {
                  e.data.LOSS_SX_ST?.toLocaleString("en-US", {
                    style: 'percent',
                    maximumFractionDigits: 1,
                    minimumFractionDigits: 1,
                  })}{" "}
              </span>
            );
          }
        },
        {
          field: 'LOSS_SX', headerName: 'LOSS_SX', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "green", fontWeight: "bold" }}>
                {
                  e.data.LOSS_SX?.toLocaleString("en-US", {
                    style: 'percent',
                    maximumFractionDigits: 1,
                    minimumFractionDigits: 1,
                  })}{" "}
              </span>
            );
          }
        },
        { field: 'INS_INPUT', headerName: 'INS_INPUT', resizable: true, width: 80 },
        { field: 'INSPECT_TOTAL_QTY', headerName: 'INSPECT_TOTAL_QTY', resizable: true, width: 80 },
        { field: 'INSPECT_OK_QTY', headerName: 'INSPECT_OK_QTY', resizable: true, width: 80 },
        { field: 'INSPECT_TOTAL_NG', headerName: 'INSPECT_TOTAL_NG', resizable: true, width: 80 },
        {
          field: 'LOSS_SX_KT', headerName: 'LOSS_SX_KT', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "green", fontWeight: "bold" }}>
                {
                  e.data.LOSS_SX_KT?.toLocaleString("en-US", {
                    style: 'percent',
                    maximumFractionDigits: 1,
                    minimumFractionDigits: 1,
                  })}{" "}
              </span>
            );
          }
        },
        { field: 'INS_OUTPUT', headerName: 'INS_OUTPUT', resizable: true, width: 80 },
        {
          field: 'LOSS_KT', headerName: 'LOSS_KT', resizable: true, width: 80, cellRenderer: (e: any) => {
            return (
              <span style={{ color: "green", fontWeight: "bold" }}>
                {
                  e.data.LOSS_KT?.toLocaleString("en-US", {
                    style: 'percent',
                    maximumFractionDigits: 1,
                    minimumFractionDigits: 1,
                  })}{" "}
              </span>
            );
          }
        },
        { field: 'SETTING_START_TIME', headerName: 'SETTING_START_TIME', resizable: true, width: 80 },
        { field: 'MASS_START_TIME', headerName: 'MASS_START_TIME', resizable: true, width: 80 },
        { field: 'MASS_END_TIME', headerName: 'MASS_END_TIME', resizable: true, width: 80 },
        { field: 'EQ_NAME_TT', headerName: 'EQ_NAME_TT', resizable: true, width: 80 },
        { field: 'MACHINE_NAME', headerName: 'MACHINE_NAME', resizable: true, width: 80 },
        { field: 'WORK_SHIFT', headerName: 'WORK_SHIFT', resizable: true, width: 80 },
        { field: 'INS_EMPL', headerName: 'INS_EMPL', resizable: true, width: 80 },
        { field: 'FACTORY', headerName: 'FACTORY', resizable: true, width: 80 },
        { field: 'BOC_KIEM', headerName: 'BOC_KIEM', resizable: true, width: 80 },
        { field: 'LAY_DO', headerName: 'LAY_DO', resizable: true, width: 80 },
        { field: 'MAY_HONG', headerName: 'MAY_HONG', resizable: true, width: 80 },
        { field: 'DAO_NG', headerName: 'DAO_NG', resizable: true, width: 80 },
        { field: 'CHO_LIEU', headerName: 'CHO_LIEU', resizable: true, width: 80 },
        { field: 'CHO_BTP', headerName: 'CHO_BTP', resizable: true, width: 80 },
        { field: 'HET_LIEU', headerName: 'HET_LIEU', resizable: true, width: 80 },
        { field: 'LIEU_NG', headerName: 'LIEU_NG', resizable: true, width: 80 },
        { field: 'HOP_FL', headerName: 'HOP_FL', resizable: true, width: 80 },
        { field: 'CHOT_BAOCAO', headerName: 'CHOT_BAOCAO', resizable: true, width: 80 },
        { field: 'CHUYEN_CODE', headerName: 'CHUYEN_CODE', resizable: true, width: 80 },
        { field: 'CHO_FILM', headerName: 'CHO_FILM', resizable: true, width: 80 },
        { field: 'K_CHO_DUYET', headerName: 'K_CHO_DUYET', resizable: true, width: 80 },
        { field: 'CHA_BAN', headerName: 'CHA_BAN', resizable: true, width: 80 },
        { field: 'KHAC', headerName: 'KHAC', resizable: true, width: 80 },
        { field: 'REMARK', headerName: 'REMARK', resizable: true, width: 80 },
      ],
      headerClass: 'header'
    },
  ];
