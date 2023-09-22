import {
  Autocomplete,
  IconButton,
  LinearProgress,
  TextField,
} from "@mui/material";
import {
  DataGrid,
  GridSelectionModel,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import moment from "moment";
import React, { useContext, useEffect, useState, useTransition } from "react";
import {
  AiFillFileExcel,
  AiOutlineCloudUpload,
  AiOutlinePrinter,
} from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import { UserContext } from "../../../../api/Context";
import { SaveExcel } from "../../../../api/GlobalFunction";
import "./DATASX.scss";
import { MACHINE_LIST } from "../../../../api/GlobalInterface";

interface SX_DATA {
  G_CODE: string;
  PHAN_LOAI: string;
  PLAN_ID: string;
  PLAN_DATE: string;
  PROD_REQUEST_NO: string;
  G_NAME: string;
  G_NAME_KD: string;
  PLAN_QTY: number;
  EQ1: string;
  EQ2: string;
  PLAN_EQ: string;
  PLAN_FACTORY: string;
  PROCESS_NUMBER: number;
  STEP: number;
  M_NAME: string;
  WAREHOUSE_OUTPUT_QTY: number;
  TOTAL_OUT_QTY: number;
  USED_QTY: number;
  REMAIN_QTY: number;
  PD: number;
  CAVITY: number;
  SETTING_MET_TC: number;
  SETTING_MET: number;
  WAREHOUSE_ESTIMATED_QTY: number;
  ESTIMATED_QTY_ST: number;
  ESTIMATED_QTY: number;
  KETQUASX: number;
  LOSS_SX_ST: number;
  LOSS_SX: number;
  INS_INPUT: number;
  LOSS_SX_KT: number;
  INS_OUTPUT: number;
  LOSS_KT: number;
  SETTING_START_TIME: string;
  MASS_START_TIME: string;
  MASS_END_TIME: string;
  RPM: number;
  EQ_NAME_TT: string;
  SX_DATE: string;
  WORK_SHIFT: string;
  INS_EMPL: string;
  FACTORY: string;
  BOC_KIEM: number;
  LAY_DO: number;
  MAY_HONG: number;
  DAO_NG: number;
  CHO_LIEU: number;
  CHO_BTP: number;
  HET_LIEU: number;
  LIEU_NG: number;
  CAN_HANG: number;
  HOP_FL: number;
  CHO_QC: number;
  CHOT_BAOCAO: number;
  CHUYEN_CODE: number;
  KHAC: number;
  REMARK: string;
}
interface YCSX_SX_DATA {
  YCSX_STATUS: string;
  PHAN_LOAI: string;
  PROD_REQUEST_NO: string;
  G_NAME: string;
  G_NAME_KD: string;
  FACTORY: string;
  EQ1: string;
  EQ2: string;
  PROD_REQUEST_DATE: string;
  PROD_REQUEST_QTY: number;
  M_NAME: string;
  M_OUTPUT: number;
  SCANNED_QTY: number;
  REMAIN_QTY: number;
  USED_QTY: number;
  PD: number;
  CAVITY: number;
  WAREHOUSE_ESTIMATED_QTY: number;
  ESTIMATED_QTY: number;
  CD1: number;
  CD2: number;
  INS_INPUT: number;
  INS_OUTPUT: number;
  LOSS_SX1: number;
  LOSS_SX2: number;
  LOSS_SX3: number;
  LOSS_SX4: number;
  TOTAL_LOSS: number;
  TOTAL_LOSS2: number;
}
interface LOSS_TABLE_DATA {
  XUATKHO_MET: number;
  XUATKHO_EA: number;
  SCANNED_MET: number;
  SCANNED_EA: number;
  PROCESS1_RESULT: number;
  PROCESS2_RESULT: number;
  SX_RESULT: number;
  INSPECTION_INPUT: number;
  INSPECTION_OUTPUT: number;
  LOSS_INS_OUT_VS_SCANNED_EA: number;
  LOSS_INS_OUT_VS_XUATKHO_EA: number;
}
const DATASX = () => {
  const [showloss, setShowLoss] = useState(false);
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const getMachineList = () => {
    generalQuery("getmachinelist", {})
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: MACHINE_LIST[] = response.data.data.map(
            (element: MACHINE_LIST, index: number) => {
              return {
                ...element,
              };
            }
          );
          loadeddata.push(
            { EQ_NAME: "ALL" },
            { EQ_NAME: "NO" },
            { EQ_NAME: "NA" }
          );
          console.log(loadeddata);
          setMachine_List(loadeddata);
        } else {
          //Swal.fire("Thông báo", "Lỗi BOM SX: " + response.data.message, "error");
          setMachine_List([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [losstableinfo, setLossTableInfo] = useState<LOSS_TABLE_DATA>({
    XUATKHO_MET: 0,
    XUATKHO_EA: 0,
    SCANNED_MET: 0,
    SCANNED_EA: 0,
    PROCESS1_RESULT: 0,
    PROCESS2_RESULT: 0,
    SX_RESULT: 0,
    INSPECTION_INPUT: 0,
    INSPECTION_OUTPUT: 0,
    LOSS_INS_OUT_VS_SCANNED_EA: 0,
    LOSS_INS_OUT_VS_XUATKHO_EA: 0,
  });
  const [selectionModel_INPUTSX, setSelectionModel_INPUTSX] = useState<any>([]);
  const [readyRender, setReadyRender] = useState(false);
  const [selection, setSelection] = useState<any>({
    trapo: true,
    thempohangloat: false,
    them1po: false,
    them1invoice: false,
    themycsx: false,
    suaycsx: false,
    inserttableycsx: false,
    renderycsx: false,
    renderbanve: false,
    amazontab: false,
  });
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [machine, setMachine] = useState("ALL");
  const [factory, setFactory] = useState("ALL");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [id, setID] = useState("");
  const [datasxtable, setDataSXTable] = useState<Array<any>>([]);
  const [sumaryINSPECT, setSummaryInspect] = useState("");
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const column_datasx = [
    { field: "PHAN_LOAI", headerName: "PHAN_LOAI", minWidth: 120, flex: 1 },
    { field: "PLAN_ID", headerName: "PLAN_ID", minWidth: 120, flex: 1 },
    { field: "PLAN_DATE", headerName: "PLAN_DATE", minWidth: 120, flex: 1 },
    {
      field: "PROD_REQUEST_NO",
      headerName: "PROD_REQUEST_NO",
      minWidth: 120,
      flex: 1,
    },
    { field: "G_CODE", headerName: "G_CODE", minWidth: 120, flex: 1 },
    { field: "G_NAME", headerName: "G_NAME", minWidth: 120, flex: 1 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", minWidth: 120, flex: 1 },
    {
      field: "PLAN_QTY",
      headerName: "PLAN_QTY",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.PLAN_QTY.toLocaleString("en-US")}
          </span>
        );
      },
    },
    { field: "PLAN_EQ", headerName: "PLAN_EQ", minWidth: 120, flex: 1 },
    {
      field: "PLAN_FACTORY",
      headerName: "PLAN_FACTORY",
      minWidth: 120,
      flex: 1,
    },
    {
      field: "PROCESS_NUMBER",
      headerName: "PROCESS_NUMBER",
      minWidth: 120,
      flex: 1,
    },
    { field: "STEP", headerName: "STEP", minWidth: 120, flex: 1 },
    { field: "M_NAME", headerName: "M_NAME", minWidth: 120, flex: 1 },
    {
      field: "WAREHOUSE_OUTPUT_QTY",
      headerName: "WAREHOUSE_OUTPUT_QTY",
      minWidth: 150,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.WAREHOUSE_OUTPUT_QTY !== null) {
          return (
            <span style={{ color: "blue", fontWeight: "bold" }}>
              {params.row.WAREHOUSE_OUTPUT_QTY.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "TOTAL_OUT_QTY",
      headerName: "TOTAL_OUT_QTY",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.TOTAL_OUT_QTY !== null) {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.row.TOTAL_OUT_QTY.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "USED_QTY",
      headerName: "USED_QTY",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.USED_QTY !== null) {
          return (
            <span style={{ color: "green", fontWeight: "bold" }}>
              {params.row.USED_QTY.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "REMAIN_QTY",
      headerName: "REMAIN_QTY",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.REMAIN_QTY !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.REMAIN_QTY.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    { field: "PD", headerName: "PD", minWidth: 120, flex: 1 },
    { field: "CAVITY", headerName: "CAVITY", minWidth: 120, flex: 1 },
    {
      field: "SETTING_MET_TC",
      headerName: "SETTING_MET_TC",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.SETTING_MET_TC !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.SETTING_MET_TC.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "SETTING_MET",
      headerName: "SETTING_MET",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.SETTING_MET !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.SETTING_MET.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "WAREHOUSE_ESTIMATED_QTY",
      headerName: "WAREHOUSE_ESTIMATED_QTY",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.WAREHOUSE_ESTIMATED_QTY !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.WAREHOUSE_ESTIMATED_QTY.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "ESTIMATED_QTY_ST",
      headerName: "ESTIMATED_QTY_ST",
      minWidth: 150,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.ESTIMATED_QTY_ST !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.ESTIMATED_QTY_ST.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "ESTIMATED_QTY",
      headerName: "ESTIMATED_QTY",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.ESTIMATED_QTY !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.ESTIMATED_QTY.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "KETQUASX",
      headerName: "KETQUASX",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.KETQUASX !== null) {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.row.KETQUASX.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "LOSS_SX_ST",
      headerName: "LOSS_SX_ST",
      minWidth: 120,
      flex: 1,
      valueGetter: (params: any) => {
        if (
          params.row.KETQUASX !== null &&
          params.row.ESTIMATED_QTY_ST !== null
        ) {
          return (
            1 -
            params.row.KETQUASX / params.row.ESTIMATED_QTY_ST
          ).toLocaleString("en-US", { style: "percent" });
        } else {
          return "0%";
        }
      },
    },
    {
      field: "LOSS_SX",
      headerName: "LOSS_SX",
      minWidth: 120,
      flex: 1,
      valueGetter: (params: any) => {
        if (params.row.KETQUASX !== null && params.row.ESTIMATED_QTY !== null) {
          return (
            1 -
            params.row.KETQUASX / params.row.ESTIMATED_QTY
          ).toLocaleString("en-US", { style: "percent" });
        } else {
          return "0%";
        }
      },
    },
    {
      field: "INS_INPUT",
      headerName: "INS_INPUT",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.INS_INPUT !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.INS_INPUT.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "LOSS_SX_KT",
      headerName: "LOSS_SX_KT",
      minWidth: 120,
      flex: 1,
      valueGetter: (params: any) => {
        if (params.row.KETQUASX !== null && params.row.INS_INPUT !== null) {
          return (
            1 -
            params.row.INS_INPUT / params.row.KETQUASX
          ).toLocaleString("en-US", { style: "percent" });
        } else {
          return "0%";
        }
      },
    },
    {
      field: "INS_OUTPUT",
      headerName: "INS_OUTPUT",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.INS_OUTPUT !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.INS_OUTPUT.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "LOSS_KT",
      headerName: "LOSS_KT",
      minWidth: 120,
      flex: 1,
      valueGetter: (params: any) => {
        if (params.row.INS_INPUT !== null && params.row.INS_OUTPUT !== null) {
          return (
            1 -
            params.row.INS_OUTPUT / params.row.INS_INPUT
          ).toLocaleString("en-US", { style: "percent" });
        } else {
          return "0%";
        }
      },
    },
    {
      field: "SETTING_START_TIME",
      headerName: "SETTING_START_TIME",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "MASS_START_TIME",
      headerName: "MASS_START_TIME",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "MASS_END_TIME",
      headerName: "MASS_END_TIME",
      minWidth: 150,
      flex: 1,
    },
    { field: "RPM", headerName: "RPM", minWidth: 120, flex: 1 },
    { field: "EQ_NAME_TT", headerName: "EQ_NAME_TT", minWidth: 120, flex: 1 },
    { field: "SX_DATE", headerName: "SX_DATE", minWidth: 120, flex: 1 },
    { field: "WORK_SHIFT", headerName: "WORK_SHIFT", minWidth: 120, flex: 1 },
    { field: "INS_EMPL", headerName: "INS_EMPL", minWidth: 120, flex: 1 },
    { field: "FACTORY", headerName: "FACTORY", minWidth: 120, flex: 1 },
    { field: "BOC_KIEM", headerName: "BOC_KIEM", minWidth: 120, flex: 1 },
    { field: "LAY_DO", headerName: "LAY_DO", minWidth: 120, flex: 1 },
    { field: "MAY_HONG", headerName: "MAY_HONG", minWidth: 120, flex: 1 },
    { field: "DAO_NG", headerName: "DAO_NG", minWidth: 120, flex: 1 },
    { field: "CHO_LIEU", headerName: "CHO_LIEU", minWidth: 120, flex: 1 },
    { field: "CHO_BTP", headerName: "CHO_BTP", minWidth: 120, flex: 1 },
    { field: "HET_LIEU", headerName: "HET_LIEU", minWidth: 120, flex: 1 },
    { field: "LIEU_NG", headerName: "LIEU_NG", minWidth: 120, flex: 1 },
    { field: "CAN_HANG", headerName: "CAN_HANG", minWidth: 120, flex: 1 },
    { field: "HOP_FL", headerName: "HOP_FL", minWidth: 120, flex: 1 },
    { field: "CHO_QC", headerName: "CHO_QC", minWidth: 120, flex: 1 },
    { field: "CHOT_BAOCAO", headerName: "CHOT_BAOCAO", minWidth: 120, flex: 1 },
    { field: "CHUYEN_CODE", headerName: "CHUYEN_CODE", minWidth: 120, flex: 1 },
    { field: "KHAC", headerName: "KHAC", minWidth: 120, flex: 1 },
    { field: "REMARK", headerName: "REMARK", minWidth: 120, flex: 1 },
  ];
  const column_ycsxdatasx = [
    { field: "YCSX_STATUS", headerName: "YCSX_STATUS", minWidth: 120, flex: 1 },
    { field: "PHAN_LOAI", headerName: "PHAN_LOAI", minWidth: 120, flex: 1 },
    { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 180 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    { field: "FACTORY", headerName: "FACTORY", width: 80 },
    { field: "EQ1", headerName: "EQ1", width: 80 },
    { field: "EQ2", headerName: "EQ2", width: 80 },
    { field: "PROD_REQUEST_DATE", headerName: "YCSX_DATE", width: 120 },
    { field: "PROD_REQUEST_QTY", headerName: "YCSX_QTY", width: 80 },
    { field: "M_NAME", headerName: "M_NAME", width: 150 },
    {
      field: "M_OUTPUT",
      headerName: "M_OUTPUT",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.M_OUTPUT !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.M_OUTPUT.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "SCANNED_QTY",
      headerName: "SCANNED_QTY",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.SCANNED_QTY !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.SCANNED_QTY.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "REMAIN_QTY",
      headerName: "REMAIN_QTY",
      width: 110,
      renderCell: (params: any) => {
        if (params.row.REMAIN_QTY !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.REMAIN_QTY.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "USED_QTY",
      headerName: "USED_QTY",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.USED_QTY !== null) {
          return (
            <span style={{ color: "blue" }}>
              {params.row.USED_QTY.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    { field: "PD", headerName: "PD", width: 80 },
    { field: "CAVITY", headerName: "CAVITY", width: 80 },
    {
      field: "WAREHOUSE_ESTIMATED_QTY",
      headerName: "WAREHOUSE_ESTIMATED_QTY",
      width: 150,
      renderCell: (params: any) => {
        if (params.row.WAREHOUSE_ESTIMATED_QTY !== null) {
          return (
            <span style={{ color: "green" }}>
              {params.row.WAREHOUSE_ESTIMATED_QTY.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "ESTIMATED_QTY",
      headerName: "ESTIMATED_QTY",
      width: 120,
      renderCell: (params: any) => {
        if (params.row.ESTIMATED_QTY !== null) {
          return (
            <span style={{ color: "green" }}>
              {params.row.ESTIMATED_QTY.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "CD1",
      headerName: "CD1",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.CD1 !== null) {
          return (
            <span style={{ color: "green" }}>
              {params.row.CD1.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "LOSS_SX1",
      headerName: "LOSS_SX1",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.LOSS_SX1 !== null) {
          return (
            <span style={{ color: "red" }}>
              {params.row.LOSS_SX1.toLocaleString("en-US", {
                style: "percent",
              })}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "CD2",
      headerName: "CD2",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.CD2 !== null) {
          return (
            <span style={{ color: "green" }}>
              {params.row.CD2.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "LOSS_SX2",
      headerName: "LOSS_SX2",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.LOSS_SX2 !== null) {
          return (
            <span style={{ color: "red" }}>
              {params.row.LOSS_SX2.toLocaleString("en-US", {
                style: "percent",
              })}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "INS_INPUT",
      headerName: "INS_INPUT",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.INS_INPUT !== null) {
          return (
            <span style={{ color: "green" }}>
              {params.row.INS_INPUT.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "LOSS_SX3",
      headerName: "LOSS_SX3",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.LOSS_SX3 !== null) {
          return (
            <span style={{ color: "red" }}>
              {params.row.LOSS_SX3.toLocaleString("en-US", {
                style: "percent",
              })}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "INS_OUTPUT",
      headerName: "INS_OUTPUT",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.INS_OUTPUT !== null) {
          return (
            <span style={{ color: "green" }}>
              {params.row.INS_OUTPUT.toLocaleString("en-US")}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "LOSS_SX4",
      headerName: "LOSS_SX4",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.LOSS_SX4 !== null) {
          return (
            <span style={{ color: "red" }}>
              {params.row.LOSS_SX4.toLocaleString("en-US", {
                style: "percent",
              })}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "TOTAL_LOSS",
      headerName: "TOTAL_LOSS",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.TOTAL_LOSS !== null) {
          return (
            <span style={{ color: "red", fontWeight: "bold", fontSize: 16 }}>
              {params.row.TOTAL_LOSS.toLocaleString("en-US", {
                style: "percent",
              })}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "TOTAL_LOSS2",
      headerName: "TOTAL_LOSS2",
      minWidth: 120,
      flex: 1,
      renderCell: (params: any) => {
        if (params.row.TOTAL_LOSS2 !== null) {
          return (
            <span style={{ color: "red", fontWeight: "bold", fontSize: 16 }}>
              {params.row.TOTAL_LOSS2.toLocaleString("en-US", {
                style: "percent",
              })}
            </span>
          );
        } else {
          return <></>;
        }
      },
    },
  ];
  const [columnDefinition, setColumnDefinition] =
    useState<Array<any>>(column_datasx);
  function CustomToolbarLICHSUINPUTSX() {
    return (
      <GridToolbarContainer>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(datasxtable, "Data SX Table");
          }}
        >
          <AiFillFileExcel color='green' size={25} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
        <div className='div' style={{ fontSize: 20, fontWeight: "bold" }}>
          DATA SẢN XUẤT
        </div>
      </GridToolbarContainer>
    );
  }
  const handle_loaddatasx = () => {
    generalQuery("loadDataSX", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      PROD_REQUEST_NO: prodrequestno,
      PLAN_ID: plan_id,
      M_NAME: m_name,
      M_CODE: m_code,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      FACTORY: factory,
      PLAN_EQ: machine,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: SX_DATA[] = response.data.data.map(
            (element: SX_DATA, index: number) => {
              return {
                ...element,
                PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
                SETTING_START_TIME:
                  element.SETTING_START_TIME === null
                    ? ""
                    : moment
                        .utc(element.SETTING_START_TIME)
                        .format("YYYY-MM-DD HH:mm:ss"),
                MASS_START_TIME:
                  element.MASS_START_TIME === null
                    ? ""
                    : moment
                        .utc(element.MASS_START_TIME)
                        .format("YYYY-MM-DD HH:mm:ss"),
                MASS_END_TIME:
                  element.MASS_END_TIME === null
                    ? ""
                    : moment
                        .utc(element.MASS_END_TIME)
                        .format("YYYY-MM-DD HH:mm:ss"),
                SX_DATE:
                  element.SX_DATE === null
                    ? ""
                    : moment.utc(element.SX_DATE).format("YYYY-MM-DD"),
                LOSS_SX_ST:
                  element.KETQUASX !== null && element.ESTIMATED_QTY_ST !== null
                    ? element.ESTIMATED_QTY_ST !== 0
                      ? 1 - element.KETQUASX / element.ESTIMATED_QTY_ST
                      : -9999999999999999
                    : 0,
                LOSS_SX:
                  element.KETQUASX !== null && element.ESTIMATED_QTY !== null
                    ? element.ESTIMATED_QTY !== 0
                      ? 1 - element.KETQUASX / element.ESTIMATED_QTY
                      : -9999999999999999
                    : 0,
                LOSS_SX_KT:
                  element.KETQUASX !== null && element.INS_INPUT !== null
                    ? element.KETQUASX !== 0
                      ? 1 - element.INS_INPUT / element.KETQUASX
                      : -9999999999999999
                    : 0,
                LOSS_KT:
                  element.INS_INPUT !== null && element.INS_OUTPUT !== null
                    ? element.INS_INPUT !== 0
                      ? 1 - element.INS_OUTPUT / element.INS_INPUT
                      : -9999999999999999
                    : 0,
                id: index,
              };
            }
          );

          //setShowLoss(false);
          let temp_loss_info: LOSS_TABLE_DATA = {
            XUATKHO_MET: 0,
            XUATKHO_EA: 0,
            SCANNED_MET: 0,
            SCANNED_EA: 0,
            PROCESS1_RESULT: 0,
            PROCESS2_RESULT: 0,
            SX_RESULT: 0,
            INSPECTION_INPUT: 0,
            INSPECTION_OUTPUT: 0,
            LOSS_INS_OUT_VS_SCANNED_EA: 0,
            LOSS_INS_OUT_VS_XUATKHO_EA: 0,
          };

          for (let i = 0; i < loaded_data.length; i++) {
            temp_loss_info.XUATKHO_MET += loaded_data[i].WAREHOUSE_OUTPUT_QTY;
            temp_loss_info.XUATKHO_EA += loaded_data[i].WAREHOUSE_ESTIMATED_QTY;
            temp_loss_info.SCANNED_MET += loaded_data[i].USED_QTY;
            temp_loss_info.SCANNED_EA += loaded_data[i].ESTIMATED_QTY;
            temp_loss_info.PROCESS1_RESULT +=
              loaded_data[i].PROCESS_NUMBER === 1 && loaded_data[i].STEP === 0
                ? loaded_data[i].KETQUASX
                : 0;
            temp_loss_info.PROCESS2_RESULT +=
              loaded_data[i].PROCESS_NUMBER === 2 && loaded_data[i].STEP === 0
                ? loaded_data[i].KETQUASX
                : 0;
            temp_loss_info.INSPECTION_INPUT += loaded_data[i].INS_INPUT;
            temp_loss_info.INSPECTION_OUTPUT += loaded_data[i].INS_OUTPUT;
          }
          temp_loss_info.LOSS_INS_OUT_VS_SCANNED_EA =
            1 - temp_loss_info.INSPECTION_OUTPUT / temp_loss_info.SCANNED_EA;
          temp_loss_info.LOSS_INS_OUT_VS_XUATKHO_EA =
            1 - temp_loss_info.INSPECTION_OUTPUT / temp_loss_info.XUATKHO_EA;

          setLossTableInfo(temp_loss_info);
          setDataSXTable(loaded_data);
          setReadyRender(true);
          setisLoading(false);
        } else {
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_loaddatasxYCSX = () => {
    generalQuery("loadDataSX_YCSX", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      PROD_REQUEST_NO: prodrequestno,
      PLAN_ID: plan_id,
      M_NAME: m_name,
      M_CODE: m_code,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      FACTORY: factory,
      PLAN_EQ: machine,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: YCSX_SX_DATA[] = response.data.data.map(
            (element: YCSX_SX_DATA, index: number) => {
              return {
                ...element,
                PROD_REQUEST_DATE: moment
                  .utc(element.PROD_REQUEST_DATE)
                  .format("YYYY-MM-DD"),
                id: index,
              };
            }
          );
          let temp_loss_info: LOSS_TABLE_DATA = {
            XUATKHO_MET: 0,
            XUATKHO_EA: 0,
            SCANNED_MET: 0,
            SCANNED_EA: 0,
            PROCESS1_RESULT: 0,
            PROCESS2_RESULT: 0,
            SX_RESULT: 0,
            INSPECTION_INPUT: 0,
            INSPECTION_OUTPUT: 0,
            LOSS_INS_OUT_VS_SCANNED_EA: 0,
            LOSS_INS_OUT_VS_XUATKHO_EA: 0,
          };

          for (let i = 0; i < loaded_data.length; i++) {
            temp_loss_info.XUATKHO_MET += loaded_data[i].M_OUTPUT;
            temp_loss_info.XUATKHO_EA += loaded_data[i].WAREHOUSE_ESTIMATED_QTY;
            temp_loss_info.SCANNED_MET += loaded_data[i].USED_QTY;
            temp_loss_info.SCANNED_EA += loaded_data[i].ESTIMATED_QTY;
            temp_loss_info.PROCESS1_RESULT += loaded_data[i].CD1;
            temp_loss_info.PROCESS2_RESULT += loaded_data[i].CD2;
            temp_loss_info.SX_RESULT +=
              loaded_data[i].EQ2 === "NO" ||
              loaded_data[i].EQ2 === "NA" ||
              loaded_data[i].EQ2 === null
                ? loaded_data[i].CD1
                : loaded_data[i].CD2;
            temp_loss_info.INSPECTION_INPUT += loaded_data[i].INS_INPUT;
            temp_loss_info.INSPECTION_OUTPUT += loaded_data[i].INS_OUTPUT;
            temp_loss_info.LOSS_INS_OUT_VS_SCANNED_EA =
              1 - temp_loss_info.INSPECTION_OUTPUT / temp_loss_info.SCANNED_EA;
            temp_loss_info.LOSS_INS_OUT_VS_XUATKHO_EA =
              1 - temp_loss_info.INSPECTION_OUTPUT / temp_loss_info.XUATKHO_EA;
          }
          setLossTableInfo(temp_loss_info);
          setShowLoss(true);
          setDataSXTable(loaded_data);
          setReadyRender(true);
          setisLoading(false);
        } else {
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
  };
  useEffect(() => {
    getMachineList();
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className='datasx'>
      <div className='tracuuDataInspection'>
        <div className='tracuuDataInspectionform'>
          <div className='forminput'>
            <div className='forminputcolumn'>
              <label>
                <b>Từ ngày:</b>
                <input
                  type='date'
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  type='date'
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Code KD:</b>{" "}
                <input
                  type='text'
                  placeholder='GH63-xxxxxx'
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Code ERP:</b>{" "}
                <input
                  type='text'
                  placeholder='7C123xxx'
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Tên Liệu:</b>{" "}
                <input
                  type='text'
                  placeholder='SJ-203020HC'
                  value={m_name}
                  onChange={(e) => setM_Name(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Mã Liệu CMS:</b>{" "}
                <input
                  type='text'
                  placeholder='A123456'
                  value={m_code}
                  onChange={(e) => setM_Code(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>Số YCSX:</b>{" "}
                <input
                  type='text'
                  placeholder='1F80008'
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Số chỉ thị:</b>{" "}
                <input
                  type='text'
                  placeholder='A123456'
                  value={plan_id}
                  onChange={(e) => setPlanID(e.target.value)}
                ></input>
              </label>
            </div>
            <div className='forminputcolumn'>
              <label>
                <b>FACTORY:</b>
                <select
                  name='phanloai'
                  value={factory}
                  onChange={(e) => {
                    setFactory(e.target.value);
                  }}
                >
                  <option value='ALL'>ALL</option>
                  <option value='NM1'>NM1</option>
                  <option value='NM2'>NM2</option>
                </select>
              </label>

              <label>
                <b>MACHINE:</b>
                <select
                  name='machine2'
                  value={machine}
                  onChange={(e) => {
                    setMachine(e.target.value);
                  }}
                  style={{ width: 150, height: 30 }}
                >
                  {machine_list.map((ele: MACHINE_LIST, index: number) => {
                    return (
                      <option key={index} value={ele.EQ_NAME}>
                        {ele.EQ_NAME}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>
          </div>
          <div className='formbutton'>
            <label>
              <b>All Time:</b>
              <input
                type='checkbox'
                name='alltimecheckbox'
                defaultChecked={alltime}
                onChange={() => setAllTime(!alltime)}
              ></input>
            </label>
            <button
              className='tranhatky'
              onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_datasx);
                handle_loaddatasx();
              }}
            >
              TRA CHỈ THỊ
            </button>
            <button
              className='tranhatky'
              onClick={() => {
                setisLoading(true);
                setReadyRender(false);
                setColumnDefinition(column_ycsxdatasx);
                handle_loaddatasxYCSX();
              }}
            >
              TRA YCSX
            </button>
          </div>
        </div>
        {
          <div className='losstable'>
            <table>
              <thead>
                <tr>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    1.XUAT KHO MET
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    2.XUAT KHO EA
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    3.USED MET
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    4.USED EA
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    5.PROCESS 1 RESULT
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    6.PROCESS 2 RESULT
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    6.SX RESULT
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    7.INSPECTION INPUT
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    8.INSPECTION OUTPUT
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    9.TOTAL_LOSS (8 vs 4) %
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    10.TOTAL_LOSS2 (8 vs2) %
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ color: "blue", fontWeight: "bold" }}>
                    {losstableinfo.XUATKHO_MET.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "blue", fontWeight: "bold" }}>
                    {losstableinfo.XUATKHO_EA.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "#fc2df6", fontWeight: "bold" }}>
                    {losstableinfo.SCANNED_MET.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "#fc2df6", fontWeight: "bold" }}>
                    {losstableinfo.SCANNED_EA.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {losstableinfo.PROCESS1_RESULT.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {losstableinfo.PROCESS2_RESULT.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {losstableinfo.SX_RESULT.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {losstableinfo.INSPECTION_INPUT.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {losstableinfo.INSPECTION_OUTPUT.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "#b56600", fontWeight: "bold" }}>
                    {(
                      losstableinfo.LOSS_INS_OUT_VS_SCANNED_EA * 100
                    ).toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "red", fontWeight: "bold" }}>
                    {(
                      losstableinfo.LOSS_INS_OUT_VS_XUATKHO_EA * 100
                    ).toLocaleString("en-US")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        }
        <div className='tracuuYCSXTable'>
          {readyRender && (
            <DataGrid
              sx={{ fontSize: 12, flex: 1 }}
              components={{
                Toolbar: CustomToolbarLICHSUINPUTSX,
                LoadingOverlay: LinearProgress,
              }}
              getRowId={(row) => row.id}
              loading={isLoading}
              rowHeight={30}
              rows={datasxtable}
              columns={columnDefinition}
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default DATASX;
