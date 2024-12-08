import { IconButton } from "@mui/material";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { AiFillCloseCircle, AiFillDashboard } from "react-icons/ai";
import Swal from "sweetalert2";
import "./DATASX.scss";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotTable from "../../../../components/PivotChart/PivotChart";
import {
  DAILY_YCSX_RESULT,
  LICHSUINPUTLIEU_DATA,
  LICHSUNHAPKHOAO,
  LOSS_TABLE_DATA,
  MACHINE_LIST,
  SX_DATA,
  YCSX_SX_DATA,
} from "../../../../api/GlobalInterface";
import AGTable from "../../../../components/DataTable/AGTable";
import { CustomCellRendererProps } from "ag-grid-react";
import {
  f_getMachineListData,
  f_lichsuinputlieu,
  f_load_nhapkhoao,
  f_loadDataSX_YCSX,
  f_loadDataSXChiThi,
  f_YCSXDailyChiThiData,
} from "../../../../api/GlobalFunction";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
const DATASX = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const getMachineList = async () => {
    setMachine_List(await f_getMachineListData())
  };
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [showhideDailyYCSX, setShowHideDailyYCSX] = useState(false);
  const [inputlieudatatable, setInputLieuDataTable] = useState<LICHSUINPUTLIEU_DATA[]>([]);
  const [showloss, setShowLoss] = useState(false);
  const [khoaodata, setKhoAoData] = useState<LICHSUNHAPKHOAO[]>([]);
  const [losstableinfo, setLossTableInfo] = useState<LOSS_TABLE_DATA>({
    XUATKHO_MET: 0,
    XUATKHO_EA: 0,
    SCANNED_MET: 0,
    SCANNED_EA: 0,
    PROCESS1_RESULT: 0,
    PROCESS2_RESULT: 0,
    PROCESS3_RESULT: 0,
    PROCESS4_RESULT: 0,
    SX_RESULT: 0,
    INSPECTION_INPUT: 0,
    INSPECT_LOSS_QTY: 0,
    INSPECT_MATERIAL_NG: 0,
    INSPECT_OK_QTY: 0,
    INSPECT_PROCESS_NG: 0,
    INSPECT_TOTAL_NG: 0,
    INSPECT_TOTAL_QTY: 0,
    LOSS_THEM_TUI: 0,
    SX_MARKING_QTY: 0,
    INSPECTION_OUTPUT: 0,
    LOSS_INS_OUT_VS_SCANNED_EA: 0,
    LOSS_INS_OUT_VS_XUATKHO_EA: 0,
    NG1: 0,
    NG2: 0,
    NG3: 0,
    NG4: 0,
    SETTING1: 0,
    SETTING2: 0,
    SETTING3: 0,
    SETTING4: 0,
    SCANNED_EA2: 0,
    SCANNED_EA3: 0,
    SCANNED_EA4: 0,
    SCANNED_MET2: 0,
    SCANNED_MET3: 0,
    SCANNED_MET4: 0,
  });
  const [selectbutton, setSelectButton] = useState(true);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [machine, setMachine] = useState("ALL");
  const [factory, setFactory] = useState("ALL");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [truSample, setTruSample] = useState(true);
  const [onlyClose, setOnlyClose] = useState(false);
  const [fullSummary, setFullSummary] = useState(false);
  const [datasxtable, setDataSXTable] = useState<Array<any>>([]);
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [dailyycsx, setDailyYCSX] = useState<DAILY_YCSX_RESULT[]>([]);
  const [totalDailyYCSX, setTotalDailyYCSX] = useState<DAILY_YCSX_RESULT>({
    PLAN_DATE: "",
    TARGET1: 0,
    INPUT1: 0,
    RESULT1: 0,
    LOSS1: 0,
    TARGET2: 0,
    INPUT2: 0,
    RESULT2: 0,
    LOSS2: 0,
    TARGET3: 0,
    INPUT3: 0,
    RESULT3: 0,
    LOSS3: 0,
    TARGET4: 0,
    INPUT4: 0,
    RESULT4: 0,
    LOSS4: 0,
    INSP_QTY: 0,
    INSP_LOSS: 0,
    INSP_NG: 0,
    INSP_OK: 0,
    LOSS_KT: 0
  });
  const selectedYCSX = useRef<YCSX_SX_DATA>({
    YCSX_PENDING: "",
    PHAN_LOAI: "",
    PROD_REQUEST_NO: "",
    G_NAME: "",
    G_NAME_KD: "",
    FACTORY: "",
    EQ1: "",
    EQ2: "",
    EQ3: "",
    EQ4: "",
    PROD_REQUEST_DATE: "",
    PROD_REQUEST_QTY: 0,
    M_NAME: "",
    M_OUTPUT: 0,
    NOT_SCANNED_QTY: 0,
    SCANNED_QTY: 0,
    REMAIN_QTY: 0,
    USED_QTY: 0,
    PD: 0,
    CAVITY: 0,
    WAREHOUSE_ESTIMATED_QTY: 0,
    ESTIMATED_QTY: 0,
    CD1: 0,
    CD2: 0,
    CD3: 0,
    CD4: 0,
    ST1: 0,
    ST2: 0,
    ST3: 0,
    ST4: 0,
    NG1: 0,
    NG2: 0,
    NG3: 0,
    NG4: 0,
    INS_INPUT: 0,
    INSPECT_TOTAL_QTY: 0,
    INSPECT_OK_QTY: 0,
    INSPECT_LOSS_QTY: 0,
    INSPECT_TOTAL_NG: 0,
    INSPECT_MATERIAL_NG: 0,
    INSPECT_PROCESS_NG: 0,
    INS_OUTPUT: 0,
    IQC_IN: 0,
    RETURN_IQC: 0,
    LOSS_SX1: 0,
    LOSS_SX2: 0,
    LOSS_SX3: 0,
    LOSS_SX4: 0,
    LOSS_INSPECT: 0,
    TOTAL_LOSS: 0,
    TOTAL_LOSS2: 0,
    LOSS_THEM_TUI: 0,
    SX_MARKING_QTY: 0,
    NEXT_IN_QTY: 0,
    NOT_BEEP_QTY: 0,
    LOCK_QTY: 0,
    BEEP_QTY: 0,
    TON_KHO_AO: 0,
    NEXT_OUT_QTY: 0,
    RETURN_QTY: 0,
    Setting1: 0,
    Setting2: 0,
    Setting3: 0,
    Setting4: 0,
    UPH1: 0,
    UPH2: 0,
    UPH3: 0,
    UPH4: 0,
    Step1: 0,
    Step2: 0,
    Step3: 0,
    Step4: 0,
    LOSS_SETTING1: 0,
    LOSS_SETTING2: 0,
    LOSS_SETTING3: 0,
    LOSS_SETTING4: 0,
    LOSS_KT: 0
  });
  const fields_datasx_chithi: any = [
    {
      caption: "PHAN_LOAI",
      width: 80,
      dataField: "PHAN_LOAI",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "G_CODE",
      width: 80,
      dataField: "G_CODE",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "PLAN_ID",
      width: 80,
      dataField: "PLAN_ID",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "PLAN_DATE",
      width: 80,
      dataField: "PLAN_DATE",
      allowSorting: true,
      allowFiltering: true,
      dataType: "date",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "PROD_REQUEST_NO",
      width: 80,
      dataField: "PROD_REQUEST_NO",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "G_NAME",
      width: 80,
      dataField: "G_NAME",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "G_NAME_KD",
      width: 80,
      dataField: "G_NAME_KD",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "PLAN_QTY",
      width: 80,
      dataField: "PLAN_QTY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "EQ1",
      width: 80,
      dataField: "EQ1",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "EQ2",
      width: 80,
      dataField: "EQ2",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "PLAN_EQ",
      width: 80,
      dataField: "PLAN_EQ",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "PLAN_FACTORY",
      width: 80,
      dataField: "PLAN_FACTORY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "PROCESS_NUMBER",
      width: 80,
      dataField: "PROCESS_NUMBER",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "STEP",
      width: 80,
      dataField: "STEP",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "M_NAME",
      width: 80,
      dataField: "M_NAME",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "WAREHOUSE_OUTPUT_QTY",
      width: 80,
      dataField: "WAREHOUSE_OUTPUT_QTY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "TOTAL_OUT_QTY",
      width: 80,
      dataField: "TOTAL_OUT_QTY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "USED_QTY",
      width: 80,
      dataField: "USED_QTY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "REMAIN_QTY",
      width: 80,
      dataField: "REMAIN_QTY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "PD",
      width: 80,
      dataField: "PD",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "CAVITY",
      width: 80,
      dataField: "CAVITY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "SETTING_MET",
      width: 80,
      dataField: "SETTING_MET",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "WAREHOUSE_ESTIMATED_QTY",
      width: 80,
      dataField: "WAREHOUSE_ESTIMATED_QTY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "ESTIMATED_QTY",
      width: 80,
      dataField: "ESTIMATED_QTY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "ESTIMATED_QTY_ST",
      width: 80,
      dataField: "ESTIMATED_QTY_ST",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "KETQUASX",
      width: 80,
      dataField: "KETQUASX",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
      area: "data",
    },
    {
      caption: "INS_INPUT",
      width: 80,
      dataField: "INS_INPUT",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
      area: "data",
    },
    {
      caption: "INSPECT_TOTAL_QTY",
      width: 80,
      dataField: "INSPECT_TOTAL_QTY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
      area: "data",
    },
    {
      caption: "INSPECT_OK_QTY",
      width: 80,
      dataField: "INSPECT_OK_QTY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
      area: "data",
    },
    {
      caption: "INSPECT_TOTAL_NG",
      width: 80,
      dataField: "INSPECT_TOTAL_NG",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
      area: "data",
    },
    {
      caption: "INS_OUTPUT",
      width: 80,
      dataField: "INS_OUTPUT",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
      area: "data",
    },
    {
      caption: "SETTING_START_TIME",
      width: 80,
      dataField: "SETTING_START_TIME",
      allowSorting: true,
      allowFiltering: true,
      dataType: "date",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "MASS_START_TIME",
      width: 80,
      dataField: "MASS_START_TIME",
      allowSorting: true,
      allowFiltering: true,
      dataType: "date",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "MASS_END_TIME",
      width: 80,
      dataField: "MASS_END_TIME",
      allowSorting: true,
      allowFiltering: true,
      dataType: "date",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "RPM",
      width: 80,
      dataField: "RPM",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "EQ_NAME_TT",
      width: 80,
      dataField: "EQ_NAME_TT",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "MACHINE_NAME",
      width: 80,
      dataField: "MACHINE_NAME",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
      area: "row",
    },
    {
      caption: "SX_DATE",
      width: 80,
      dataField: "SX_DATE",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "WORK_SHIFT",
      width: 80,
      dataField: "WORK_SHIFT",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "INS_EMPL",
      width: 80,
      dataField: "INS_EMPL",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "FACTORY",
      width: 80,
      dataField: "FACTORY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "BOC_KIEM",
      width: 80,
      dataField: "BOC_KIEM",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "LAY_DO",
      width: 80,
      dataField: "LAY_DO",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "MAY_HONG",
      width: 80,
      dataField: "MAY_HONG",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "DAO_NG",
      width: 80,
      dataField: "DAO_NG",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "CHO_LIEU",
      width: 80,
      dataField: "CHO_LIEU",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "CHO_BTP",
      width: 80,
      dataField: "CHO_BTP",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "HET_LIEU",
      width: 80,
      dataField: "HET_LIEU",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "LIEU_NG",
      width: 80,
      dataField: "LIEU_NG",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "CAN_HANG",
      width: 80,
      dataField: "CAN_HANG",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "HOP_FL",
      width: 80,
      dataField: "HOP_FL",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "CHO_QC",
      width: 80,
      dataField: "CHO_QC",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "CHOT_BAOCAO",
      width: 80,
      dataField: "CHOT_BAOCAO",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "CHUYEN_CODE",
      width: 80,
      dataField: "CHUYEN_CODE",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "KHAC",
      width: 80,
      dataField: "KHAC",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "REMARK",
      width: 80,
      dataField: "REMARK",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
  ];
  const fields_datasx_ycsx: any = [
    {
      caption: "YCSX_PENDING",
      width: 80,
      dataField: "YCSX_PENDING",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "G_CODE",
      width: 80,
      dataField: "G_CODE",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "PHAN_LOAI",
      width: 80,
      dataField: "PHAN_LOAI",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "PROD_REQUEST_NO",
      width: 80,
      dataField: "PROD_REQUEST_NO",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "G_NAME",
      width: 80,
      dataField: "G_NAME",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "G_NAME_KD",
      width: 80,
      dataField: "G_NAME_KD",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "FACTORY",
      width: 80,
      dataField: "FACTORY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "EQ1",
      width: 80,
      dataField: "EQ1",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "EQ2",
      width: 80,
      dataField: "EQ2",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "PROD_REQUEST_DATE",
      width: 80,
      dataField: "PROD_REQUEST_DATE",
      allowSorting: true,
      allowFiltering: true,
      dataType: "date",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "PROD_REQUEST_QTY",
      width: 80,
      dataField: "PROD_REQUEST_QTY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "M_NAME",
      width: 80,
      dataField: "M_NAME",
      allowSorting: true,
      allowFiltering: true,
      dataType: "string",
      summaryType: "count",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "M_OUTPUT",
      width: 80,
      dataField: "M_OUTPUT",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "SCANNED_QTY",
      width: 80,
      dataField: "SCANNED_QTY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "REMAIN_QTY",
      width: 80,
      dataField: "REMAIN_QTY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "USED_QTY",
      width: 80,
      dataField: "USED_QTY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "PD",
      width: 80,
      dataField: "PD",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "CAVITY",
      width: 80,
      dataField: "CAVITY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "WAREHOUSE_ESTIMATED_QTY",
      width: 80,
      dataField: "WAREHOUSE_ESTIMATED_QTY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "ESTIMATED_QTY",
      width: 80,
      dataField: "ESTIMATED_QTY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "CD1",
      width: 80,
      dataField: "CD1",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "CD2",
      width: 80,
      dataField: "CD2",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "INS_INPUT",
      width: 80,
      dataField: "INS_INPUT",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
      area: "data",
    },
    {
      caption: "INSPECT_TOTAL_QTY",
      width: 80,
      dataField: "INSPECT_TOTAL_QTY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
      area: "data",
    },
    {
      caption: "INSPECT_OK_QTY",
      width: 80,
      dataField: "INSPECT_OK_QTY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
      area: "data",
    },
    {
      caption: "INSPECT_LOSS_QTY",
      width: 80,
      dataField: "INSPECT_LOSS_QTY",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "INSPECT_TOTAL_NG",
      width: 80,
      dataField: "INSPECT_TOTAL_NG",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
      area: "data",
    },
    {
      caption: "INSPECT_MATERIAL_NG",
      width: 80,
      dataField: "INSPECT_MATERIAL_NG",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "INSPECT_PROCESS_NG",
      width: 80,
      dataField: "INSPECT_PROCESS_NG",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "INS_OUTPUT",
      width: 80,
      dataField: "INS_OUTPUT",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
      area: "data",
    },
    {
      caption: "LOSS_SX1",
      width: 80,
      dataField: "LOSS_SX1",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "LOSS_SX2",
      width: 80,
      dataField: "LOSS_SX2",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "LOSS_SX3",
      width: 80,
      dataField: "LOSS_SX3",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "LOSS_SX4",
      width: 80,
      dataField: "LOSS_SX4",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "TOTAL_LOSS",
      width: 80,
      dataField: "TOTAL_LOSS",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
    {
      caption: "TOTAL_LOSS2",
      width: 80,
      dataField: "TOTAL_LOSS2",
      allowSorting: true,
      allowFiltering: true,
      dataType: "number",
      summaryType: "sum",
      format: "fixedPoint",
      headerFilter: {
        allowSearch: true,
        height: 500,
        width: 300,
      },
    },
  ];
  const column_datasx_chithi = [
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
        { field: 'PLAN_FACTORY', headerName: 'PLAN_FACTORY', resizable: true, width: 50 },
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
        { field: 'KHAC', headerName: 'KHAC', resizable: true, width: 80 },
        { field: 'REMARK', headerName: 'REMARK', resizable: true, width: 80 },
      ],
      headerClass: 'header'
    },
  ];
  const column_datasx_ycsx = [
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
      field: 'INS_INPUT', headerName: 'INS_INPUT', resizable: true, width: 80, cellRenderer: (e: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {e.data.INS_INPUT?.toLocaleString("en-US")}
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
            {e.data.INS_INPUT?.toLocaleString("en-US")}
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
    { field: 'EQ1', headerName: 'EQ1', resizable: true, width: 40 },
    { field: 'EQ2', headerName: 'EQ2', resizable: true, width: 40 },
    { field: 'EQ3', headerName: 'EQ3', resizable: true, width: 40 },
    { field: 'EQ4', headerName: 'EQ4', resizable: true, width: 40 },
  ];
  const column_daily_datasx_ycsx = [
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
  const column_inputlieudatatable = [
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
  const column_nhapkhoaotable = [
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
  const [selectedDataSource, setSelectedDataSource] =
    useState<PivotGridDataSource>(
      new PivotGridDataSource({
        fields: fields_datasx_chithi,
        store: datasxtable,
      }),
    );
  const getRowStyle = (params: any) => {
    if (params.data.PLAN_DATE === 'TOTAL') {
      return { backgroundColor: '#faf878', fontWeight: 'bold' };
    }
    return null;
  }
  const datasx_dailyycsx = React.useMemo(
    () => (
      <AGTable
        getRowStyle={getRowStyle}
        toolbar={
          <div>
          </div>}
        columns={column_daily_datasx_ycsx}
        data={dailyycsx}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          //console.log(e.data)
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    ),
    [dailyycsx],
  );
  const datasx_chithi2 = React.useMemo(
    () => (
      <AGTable
        toolbar={
          <div>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowHidePivotTable(!showhidePivotTable);
              }}
            >
              <MdOutlinePivotTableChart color="#ff33bb" size={15} />
              PIVOT
            </IconButton>
          </div>}
        columns={column_datasx_chithi}
        data={datasxtable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          if (e.data.PLAN_ID !== undefined) {
            handle_loadlichsuinputlieu(e.data.PLAN_ID);
          }
          //console.log(e.data)
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    ),
    [datasxtable],
  );
  const datasx_ycsx2 = React.useMemo(
    () => (
      <AGTable
        toolbar={
          <div>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                //handle_loaddailyYCSX(selectedYCSX.current.PROD_REQUEST_NO)
                setShowHideDailyYCSX(prev => !prev);
              }}
            >
              <MdOutlinePivotTableChart color="#36e945" size={15} />
              Show Detail
            </IconButton>
          </div>}
        columns={column_datasx_ycsx}
        data={datasxtable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          //console.log(e.data)
          selectedYCSX.current = e.data;         
          handle_loaddailyYCSX(e.data.PROD_REQUEST_NO)
          
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    ),
    [datasxtable],
  );
  const load_nhapkhoao = async (M_LOT_NO: string) => {
    setKhoAoData(await f_load_nhapkhoao({
      FROM_DATE: '2022-01-01',
      TO_DATE: moment().format("YYYY-MM-DD"),
      FACTORY: 'ALL',
      M_LOT_NO: M_LOT_NO
    }));
  };
  const datasx_lichsuxuatlieu2 = React.useMemo(
    () => (
      <AGTable
        toolbar={
          <div>
          </div>}
        columns={column_inputlieudatatable}
        data={inputlieudatatable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          //console.log(e.data)
          load_nhapkhoao(e.data.M_LOT_NO)
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    ),
    [inputlieudatatable],
  );
  const datasx_lichsukhoao = React.useMemo(
    () => (
      <AGTable
        toolbar={
          <div>
          </div>
        }
        showFilter={true}
        columns={column_nhapkhoaotable}
        data={khoaodata}
        onCellEditingStopped={(params: any) => {
        }} onRowClick={(params: any) => {
          //console.log(e.data)
        }} onSelectionChange={(params: any) => {
          console.log(params)
          //tonkhoaodatafilter.current = params!.api.getSelectedRows();          
        }} />
    ),
    [khoaodata],
  );
  const handle_loadlichsuinputlieu = async (PLAN_ID: string) => {
    setInputLieuDataTable(await f_lichsuinputlieu({
      ALLTIME: true,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      PROD_REQUEST_NO: "",
      PLAN_ID: PLAN_ID,
      M_NAME: "",
      M_CODE: "",
      G_NAME: "",
      G_CODE: "",
    }));
  };
  const handle_loaddatasx = async () => {
    Swal.fire({
      title: "Tra data chỉ thị",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    let kq: {
      datasx: SX_DATA[],
      summary: LOSS_TABLE_DATA
    } = {
      datasx: [],
      summary: {
        XUATKHO_MET: 0,
        XUATKHO_EA: 0,
        SCANNED_MET: 0,
        SCANNED_EA: 0,
        PROCESS1_RESULT: 0,
        PROCESS2_RESULT: 0,
        PROCESS3_RESULT: 0,
        PROCESS4_RESULT: 0,
        SX_RESULT: 0,
        INSPECTION_INPUT: 0,
        INSPECT_LOSS_QTY: 0,
        INSPECT_MATERIAL_NG: 0,
        INSPECT_OK_QTY: 0,
        INSPECT_PROCESS_NG: 0,
        INSPECT_TOTAL_NG: 0,
        INSPECT_TOTAL_QTY: 0,
        LOSS_THEM_TUI: 0,
        SX_MARKING_QTY: 0,
        INSPECTION_OUTPUT: 0,
        LOSS_INS_OUT_VS_SCANNED_EA: 0,
        LOSS_INS_OUT_VS_XUATKHO_EA: 0,
        NG1: 0,
        NG2: 0,
        NG3: 0,
        NG4: 0,
        SETTING1: 0,
        SETTING2: 0,
        SETTING3: 0,
        SETTING4: 0,
        SCANNED_EA2: 0,
        SCANNED_EA3: 0,
        SCANNED_EA4: 0,
        SCANNED_MET2: 0,
        SCANNED_MET3: 0,
        SCANNED_MET4: 0,
      }
    }
    kq = await f_loadDataSXChiThi({
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
      TRUSAMPLE: truSample
    });
    setLossTableInfo(kq.summary);
    setDataSXTable(kq.datasx);
    setSelectedDataSource(
      new PivotGridDataSource({
        fields: fields_datasx_chithi,
        store: kq.datasx,
      }),
    );
    setSelectButton(true);
    if (kq.datasx.length > 0) {
      Swal.fire("Thông báo", " Đã tải: " + kq.datasx.length + " dòng", "success",);
    }
  };
  const handle_loaddatasxYCSX = async () => {
    Swal.fire({
      title: "Tra data chỉ thị",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    let kq: {
      datasx: YCSX_SX_DATA[],
      summary: LOSS_TABLE_DATA
    } = {
      datasx: [],
      summary: {
        XUATKHO_MET: 0,
        XUATKHO_EA: 0,
        SCANNED_MET: 0,
        SCANNED_EA: 0,
        PROCESS1_RESULT: 0,
        PROCESS2_RESULT: 0,
        PROCESS3_RESULT: 0,
        PROCESS4_RESULT: 0,
        SX_RESULT: 0,
        INSPECTION_INPUT: 0,
        INSPECT_LOSS_QTY: 0,
        INSPECT_MATERIAL_NG: 0,
        INSPECT_OK_QTY: 0,
        INSPECT_PROCESS_NG: 0,
        INSPECT_TOTAL_NG: 0,
        INSPECT_TOTAL_QTY: 0,
        LOSS_THEM_TUI: 0,
        SX_MARKING_QTY: 0,
        INSPECTION_OUTPUT: 0,
        LOSS_INS_OUT_VS_SCANNED_EA: 0,
        LOSS_INS_OUT_VS_XUATKHO_EA: 0,
        NG1: 0,
        NG2: 0,
        NG3: 0,
        NG4: 0,
        SETTING1: 0,
        SETTING2: 0,
        SETTING3: 0,
        SETTING4: 0,
        SCANNED_EA2: 0,
        SCANNED_EA3: 0,
        SCANNED_EA4: 0,
        SCANNED_MET2: 0,
        SCANNED_MET3: 0,
        SCANNED_MET4: 0,
      }
    }
    kq = await f_loadDataSX_YCSX({
      ALLTIME: alltime,
      FROM_DATE: moment(fromdate).format('YYYYMMDD'),
      TO_DATE: moment(todate).format('YYYYMMDD'),
      PROD_REQUEST_NO: prodrequestno,
      PLAN_ID: plan_id,
      M_NAME: m_name,
      M_CODE: m_code,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      FACTORY: factory,
      PLAN_EQ: machine,
      TRUSAMPLE: truSample,
      ONLYCLOSE: onlyClose
    });
    setLossTableInfo(kq.summary);
    setShowLoss(true);
    setDataSXTable(kq.datasx);
    setSelectedDataSource(
      new PivotGridDataSource({
        fields: fields_datasx_ycsx,
        store: kq.datasx,
      }),
    );
    setSelectButton(false);
    if (kq.datasx.length > 0) {
      Swal.fire("Thông báo", " Đã tải: " + kq.datasx.length + " dòng", "success",);
    }
  };
  const handle_loaddailyYCSX = async (PROD_REQUEST_NO: string) => {
    let kq: {
      datasx: DAILY_YCSX_RESULT[],
      summary: DAILY_YCSX_RESULT
    } = {
      datasx: [],
      summary: {
        PLAN_DATE: "",
        TARGET1: 0,
        INPUT1: 0,
        RESULT1: 0,
        LOSS1: 0,
        TARGET2: 0,
        INPUT2: 0,
        RESULT2: 0,
        LOSS2: 0,
        TARGET3: 0,
        INPUT3: 0,
        RESULT3: 0,
        LOSS3: 0,
        TARGET4: 0,
        INPUT4: 0,
        RESULT4: 0,
        LOSS4: 0,
        INSP_QTY: 0,
        INSP_LOSS: 0,
        INSP_NG: 0,
        INSP_OK: 0,
        LOSS_KT: 0
      }
    }
    kq = await f_YCSXDailyChiThiData(PROD_REQUEST_NO);
    setTotalDailyYCSX(kq.summary);
    setDailyYCSX(kq.datasx);
  }
  useEffect(() => {
    getMachineList();
  }, []);
  return (
    <div className="datasx">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Từ ngày:</b>
                <input
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  type="date"
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Code KD:</b>{" "}
                <input
                  type="text"
                  placeholder="GH63-xxxxxx"
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Code ERP:</b>{" "}
                <input
                  type="text"
                  placeholder="7C123xxx"
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Tên Liệu:</b>{" "}
                <input
                  type="text"
                  placeholder="SJ-203020HC"
                  value={m_name}
                  onChange={(e) => setM_Name(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Mã Liệu CMS:</b>{" "}
                <input
                  type="text"
                  placeholder="A123456"
                  value={m_code}
                  onChange={(e) => setM_Code(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Số YCSX:</b>{" "}
                <input
                  type="text"
                  placeholder="1F80008"
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Số chỉ thị:</b>{" "}
                <input
                  type="text"
                  placeholder="A123456"
                  value={plan_id}
                  onChange={(e) => setPlanID(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>FACTORY:</b>
                <select
                  name="phanloai"
                  value={factory}
                  onChange={(e) => {
                    setFactory(e.target.value);
                  }}
                >
                  <option value="ALL">ALL</option>
                  <option value="NM1">NM1</option>
                  <option value="NM2">NM2</option>
                </select>
              </label>
              <label>
                <b>MACHINE:</b>
                <select
                  name="machine2"
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
          <div className="formbutton">
            <label>
              <b>All Time:</b>
              <input
                type="checkbox"
                name="alltimecheckbox"
                checked={alltime}
                onChange={() => setAllTime(prev => !prev)}
              ></input>
            </label>
            <label>
              <b>Trừ Sample:</b>
              <input
                type="checkbox"
                name="alltimecheckbox"
                checked={truSample}
                onChange={() => setTruSample(prev => !prev)}
              ></input>
            </label>
            <label>
              <b>Only Closed:</b>
              <input
                type="checkbox"
                name="alltimecheckbox"
                checked={onlyClose}
                onChange={() => setOnlyClose(prev => !prev)}
              ></input>
            </label>
            <label>
              <b>Full Summary:</b>
              <input
                type="checkbox"
                name="alltimecheckbox"
                checked={fullSummary}
                onChange={() => setFullSummary(prev => !prev)}
              ></input>
            </label>
            <button
              className="tranhatky"
              onClick={() => {
                handle_loaddatasx();
              }}
            >
              TRA CHỈ THỊ
            </button>
            <button
              className="tranhatky"
              onClick={() => {
                handle_loaddatasxYCSX();
              }}
            >
              TRA YCSX
            </button>
          </div>
        </div>
        {
          <div className="losstable" style={{ backgroundImage: theme.CMS.backgroundImage }}>
            <table>
              <thead>
                <tr>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    1.WH_MET
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    2.WH_EA
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    3.IP1_MET
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    4.IP1_EA
                  </th>
                  {fullSummary && <th style={{ color: "black", fontWeight: "normal" }}>
                    5_1.ST1
                  </th>}
                  {fullSummary && <th style={{ color: "black", fontWeight: "normal" }}>
                    5_2.NG1
                  </th>}
                  <th style={{ color: "black", fontWeight: "bold" }}>5.CD1</th>
                  {fullSummary && <th style={{ color: "black", fontWeight: "normal" }}>
                    6_1.IP2_MET
                  </th>}
                  {fullSummary && <th style={{ color: "black", fontWeight: "normal" }}>
                    6_2.IP2_EA
                  </th>}
                  {fullSummary && <th style={{ color: "black", fontWeight: "normal" }}>
                    6_3.ST2
                  </th>}
                  {fullSummary && <th style={{ color: "black", fontWeight: "normal" }}>
                    6_4.NG2
                  </th>}
                  <th style={{ color: "black", fontWeight: "bold" }}>6.CD2</th>
                  {fullSummary && <th style={{ color: "black", fontWeight: "normal" }}>
                    7_1.IP3_MET
                  </th>}
                  {fullSummary && <th style={{ color: "black", fontWeight: "normal" }}>
                    7_2.IP3_EA
                  </th>}
                  {fullSummary && <th style={{ color: "black", fontWeight: "normal" }}>
                    7_3.ST3
                  </th>}
                  {fullSummary && <th style={{ color: "black", fontWeight: "normal" }}>
                    7_4.NG3
                  </th>}
                  <th style={{ color: "black", fontWeight: "bold" }}>7.CD3</th>
                  {fullSummary && <th style={{ color: "black", fontWeight: "normal" }}>
                    8_1.IP4_MET
                  </th>}
                  {fullSummary && <th style={{ color: "black", fontWeight: "normal" }}>
                    8_2.IP4_EA
                  </th>}
                  {fullSummary && <th style={{ color: "black", fontWeight: "normal" }}>
                    8_3.ST4
                  </th>}
                  {fullSummary && <th style={{ color: "black", fontWeight: "normal" }}>
                    8_4.NG4
                  </th>}
                  <th style={{ color: "black", fontWeight: "bold" }}>8.CD4</th>
                  <th style={{ color: "blue", fontWeight: "bold" }}>
                    9.SX_RESULT
                  </th>
                  <th style={{ color: "blue", fontWeight: "bold" }}>
                    10.INS_INPUT
                  </th>
                  {fullSummary && <th style={{ color: "blue", fontWeight: "normal" }}>
                    10_1.INS_TT_QTY
                  </th>}
                  {fullSummary && <th style={{ color: "blue", fontWeight: "normal" }}>
                    10_2.INS_QTY
                  </th>}
                  {fullSummary && <th style={{ color: "blue", fontWeight: "normal" }}>
                    10_3.MARKING
                  </th>}
                  {fullSummary && <th style={{ color: "blue", fontWeight: "normal" }}>
                    10_4.INS_OK
                  </th>}
                  {fullSummary && <th style={{ color: "blue", fontWeight: "normal" }}>
                    10_5.INS_M_NG
                  </th>}
                  {fullSummary && <th style={{ color: "blue", fontWeight: "normal" }}>
                    10_6.INS_P_NG
                  </th>}
                  {fullSummary && <th style={{ color: "blue", fontWeight: "normal" }}>
                    10_7.INSP_LOSS
                  </th>}
                  {fullSummary && <th style={{ color: "blue", fontWeight: "normal" }}>
                    10_8.THEM_TUI
                  </th>}
                  <th style={{ color: "blue", fontWeight: "bold" }}>
                    11.INS_OUTPUT
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    12.LOSS (11 vs 4) %
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    13.LOSS2 (11 vs2) %
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ fontSize: '0.6rem' }}>
                  <td style={{ color: "blue", fontWeight: "bold" }}>
                    {losstableinfo.XUATKHO_MET.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "blue", fontWeight: "bold" }}>
                    {losstableinfo.XUATKHO_EA.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  <td style={{ color: "#fc2df6", fontWeight: "bold" }}>
                    {losstableinfo.SCANNED_MET.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "#fc2df6", fontWeight: "bold" }}>
                    {losstableinfo.SCANNED_EA.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  {fullSummary && <td style={{ color: "gray", fontWeight: "normal" }}>
                    {losstableinfo.SETTING1.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>}
                  {fullSummary && <td style={{ color: "red", fontWeight: "normal" }}>
                    {losstableinfo.NG1.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>}
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {losstableinfo.PROCESS1_RESULT.toLocaleString("en-US")}
                  </td>
                  {fullSummary && <td style={{ color: "#fc2df6", fontWeight: "bold" }}>
                    {losstableinfo.SCANNED_MET2.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>}
                  {fullSummary && <td style={{ color: "#fc2df6", fontWeight: "bold" }}>
                    {losstableinfo.SCANNED_EA2.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>}
                  {fullSummary && <td style={{ color: "gray", fontWeight: "normal" }}>
                    {losstableinfo.SETTING2.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>}
                  {fullSummary && <td style={{ color: "red", fontWeight: "normal" }}>
                    {losstableinfo.NG2.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>}
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {losstableinfo.PROCESS2_RESULT.toLocaleString("en-US")}
                  </td>
                  {fullSummary && <td style={{ color: "#fc2df6", fontWeight: "bold" }}>
                    {losstableinfo.SCANNED_MET3.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>}
                  {fullSummary && <td style={{ color: "#fc2df6", fontWeight: "bold" }}>
                    {losstableinfo.SCANNED_EA3.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>}
                  {fullSummary && <td style={{ color: "gray", fontWeight: "normal" }}>
                    {losstableinfo.SETTING3.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>}
                  {fullSummary && <td style={{ color: "red", fontWeight: "normal" }}>
                    {losstableinfo.NG3.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>}
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {losstableinfo.PROCESS3_RESULT.toLocaleString("en-US")}
                  </td>
                  {fullSummary && <td style={{ color: "#fc2df6", fontWeight: "bold" }}>
                    {losstableinfo.SCANNED_MET4.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>}
                  {fullSummary && <td style={{ color: "#fc2df6", fontWeight: "bold" }}>
                    {losstableinfo.SCANNED_EA4.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>}
                  {fullSummary && <td style={{ color: "gray", fontWeight: "normal" }}>
                    {losstableinfo.SETTING4.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>}
                  {fullSummary && <td style={{ color: "red", fontWeight: "normal" }}>
                    {losstableinfo.NG4.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>}
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {losstableinfo.PROCESS4_RESULT.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {losstableinfo.SX_RESULT.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {losstableinfo.INSPECTION_INPUT.toLocaleString("en-US")}
                  </td>
                  {fullSummary && <td style={{ color: "gray", fontWeight: "normal" }}>
                    {losstableinfo.INSPECT_TOTAL_QTY.toLocaleString("en-US")}
                  </td>}
                  {fullSummary && <td style={{ color: "gray", fontWeight: "normal" }}>
                    {(losstableinfo.INSPECT_TOTAL_QTY - losstableinfo.SX_MARKING_QTY).toLocaleString("en-US")}
                  </td>}
                  {fullSummary && <td style={{ color: "gray", fontWeight: "normal" }}>
                    {losstableinfo.SX_MARKING_QTY.toLocaleString("en-US")}
                  </td>}
                  {fullSummary && <td style={{ color: "gray", fontWeight: "normal" }}>
                    {losstableinfo.INSPECT_OK_QTY.toLocaleString("en-US")}
                  </td>}
                  {fullSummary && <td style={{ color: "red", fontWeight: "normal" }}>
                    {losstableinfo.INSPECT_MATERIAL_NG.toLocaleString("en-US")}
                  </td>}
                  {fullSummary && <td style={{ color: "red", fontWeight: "normal" }}>
                    {losstableinfo.INSPECT_PROCESS_NG.toLocaleString("en-US")}
                  </td>}
                  {fullSummary && <td style={{ color: "gray", fontWeight: "normal" }}>
                    {losstableinfo.INSPECT_LOSS_QTY.toLocaleString("en-US")}
                  </td>}
                  {fullSummary && <td style={{ color: "gray", fontWeight: "normal" }}>
                    {losstableinfo.LOSS_THEM_TUI.toLocaleString("en-US")}
                  </td>}
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
        <div className="tracuuYCSXTable">
          {selectbutton && <div className="chithi">
            {datasx_chithi2}
          </div>}
          {selectbutton && <div className="lichsuxuatlieu">
            {datasx_lichsuxuatlieu2}
            {datasx_lichsukhoao}
          </div>}
          {!selectbutton && <div className="ycsx">
            {datasx_ycsx2}
          </div>}
          {(!selectbutton) && showhideDailyYCSX &&
            <div className="detailycsxdaily">          
            <div className="ycsxdetail" style={{ fontSize: '0.8rem' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#2d5bd8' }}> Material Tracking</span>
              <div className="losstable">
                <table>
                  <thead>
                    <tr style={{ fontSize: '0.7rem' }}>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        WAREHOUSE OUT
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        NEXT_IN_QTY
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        IQC_IN
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        NOT_SCANNED_QTY
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        SCANNED_QTY
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        REMAIN_QTY
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        USED_QTY
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        LOCK_QTY
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        TON_KHO_SX
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        NEXT_OUT_QTY
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        RETURN_IQC
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        RETURN_QTY
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ fontSize: '0.6rem' }}>
                      <td style={{ color: "#0354cc", fontWeight: "bold" }}>
                        {(selectedYCSX.current.M_OUTPUT).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "#0354cc", fontWeight: "bold" }}>
                        {(selectedYCSX.current.NEXT_IN_QTY).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "#0354cc", fontWeight: "bold" }}>
                        {(selectedYCSX.current.IQC_IN).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "gray", fontWeight: "bold" }}>
                        {(selectedYCSX.current.NOT_SCANNED_QTY).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "#a925e6", fontWeight: "bold" }}>
                        {(selectedYCSX.current.SCANNED_QTY).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "#f11d1d", fontWeight: "bold" }}>
                        {(selectedYCSX.current.REMAIN_QTY).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "#b8052c", fontWeight: "bold" }}>
                        {(selectedYCSX.current.USED_QTY).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "#039e5e", fontWeight: "bold" }}>
                        {(selectedYCSX.current.LOCK_QTY).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "#039e5e", fontWeight: "bold" }}>
                        {(selectedYCSX.current.TON_KHO_AO).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "#2d08d1", fontWeight: "bold" }}>
                        {(selectedYCSX.current.NEXT_OUT_QTY).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "#0354cc", fontWeight: "bold" }}>
                        {(selectedYCSX.current.RETURN_IQC).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "#0692c9", fontWeight: "bold" }}>
                        {(selectedYCSX.current.RETURN_QTY).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="losstable">
                <table>
                  <thead>
                    <tr>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        YCSX NO
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        CODE
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        EA/MET
                      </th>
                      <th style={{ color: "black", fontWeight: "bold" }}>
                        YCSX_QTY
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        SETTING1
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        LOSS1
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        SETTING2
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        LOSS2
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        SETTING3
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        LOSS3
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        SETTING4
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        LOSS4
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        INSPECTION
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        TOTAL
                      </th>
                      <th style={{ color: "black", fontWeight: "normal" }}>
                        UNIT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ fontSize: '0.6rem' }}>
                      <td rowSpan={5} style={{ color: "blue", fontWeight: "normal" }}>
                        {selectedYCSX.current.PROD_REQUEST_NO}
                      </td>
                      <td rowSpan={5} style={{ color: "blue", fontWeight: "normal" }}>
                        {selectedYCSX.current.G_NAME_KD}
                      </td>
                      <td style={{ color: "#0fa4c9", fontWeight: "normal" }}>
                        {(1000 / selectedYCSX.current.PD * selectedYCSX.current.CAVITY).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                      </td>
                      <td style={{ color: "#1f8d0a", fontWeight: "normal" }}>
                        {selectedYCSX.current.PROD_REQUEST_QTY.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "gray", fontWeight: "normal" }}>
                        {selectedYCSX.current.LOSS_SETTING1.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {selectedYCSX.current.LOSS_SX1.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%
                      </td>
                      <td style={{ color: "gray", fontWeight: "normal" }}>
                        {selectedYCSX.current.LOSS_SETTING2.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {selectedYCSX.current.LOSS_SX2.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%
                      </td>
                      <td style={{ color: "gray", fontWeight: "normal" }}>
                        {selectedYCSX.current.LOSS_SETTING3.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {selectedYCSX.current.LOSS_SX3.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%
                      </td>
                      <td style={{ color: "gray", fontWeight: "normal" }}>
                        {selectedYCSX.current.LOSS_SETTING4.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {selectedYCSX.current.LOSS_SX4.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {selectedYCSX.current.LOSS_KT.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                      </td>
                      <td style={{ color: "green", fontWeight: "normal" }}>
                      </td>
                      <td style={{ color: "green", fontWeight: "normal" }}>
                      </td>
                    </tr>
                    <tr style={{ fontSize: '0.6rem' }}>
                      <td style={{ color: "#224950", fontWeight: "normal" }}>
                        NEEDED EA
                      </td>
                      <td style={{ color: "#a16c08", fontWeight: "normal" }}>
                        {selectedYCSX.current.PROD_REQUEST_QTY.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "gray", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SETTING1 * 1000.0 / selectedYCSX.current.PD * selectedYCSX.current.CAVITY).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SX1 * selectedYCSX.current.PROD_REQUEST_QTY / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "gray", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SETTING2 * 1000.0 / selectedYCSX.current.PD * selectedYCSX.current.CAVITY).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SX2 * selectedYCSX.current.PROD_REQUEST_QTY / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "gray", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SETTING3 * 1000.0 / selectedYCSX.current.PD * selectedYCSX.current.CAVITY).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SX3 * selectedYCSX.current.PROD_REQUEST_QTY / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "gray", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SETTING4 * 1000.0 / selectedYCSX.current.PD * selectedYCSX.current.CAVITY).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SX4 * selectedYCSX.current.PROD_REQUEST_QTY / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_KT * selectedYCSX.current.PROD_REQUEST_QTY / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "green", fontWeight: "bold" }}>
                        {(selectedYCSX.current.PROD_REQUEST_QTY * (1 + (selectedYCSX.current.LOSS_SX1 + selectedYCSX.current.LOSS_SX2 + selectedYCSX.current.LOSS_SX3 + selectedYCSX.current.LOSS_KT) / 100) + (selectedYCSX.current.LOSS_SETTING1 + selectedYCSX.current.LOSS_SETTING2 + selectedYCSX.current.LOSS_SETTING3) * 1000.0 / selectedYCSX.current.PD * selectedYCSX.current.CAVITY).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "green", fontWeight: "normal" }}>
                        EA
                      </td>
                    </tr>
                    <tr style={{ fontSize: '0.6rem' }}>
                      <td style={{ color: "#0d8369", fontWeight: "normal" }}>
                        NEEDED MET
                      </td>
                      <td style={{ color: "#a16c08", fontWeight: "normal" }}>
                        {(selectedYCSX.current.PROD_REQUEST_QTY * selectedYCSX.current.PD / selectedYCSX.current.CAVITY / 1000).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "gray", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SETTING1).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SX1 * selectedYCSX.current.PROD_REQUEST_QTY / 100 / 1000 * selectedYCSX.current.PD / selectedYCSX.current.CAVITY).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "gray", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SETTING2).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SX2 * selectedYCSX.current.PROD_REQUEST_QTY / 100 / 1000 * selectedYCSX.current.PD / selectedYCSX.current.CAVITY).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "gray", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SETTING3).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SX3 * selectedYCSX.current.PROD_REQUEST_QTY / 100 / 1000 * selectedYCSX.current.PD / selectedYCSX.current.CAVITY).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "gray", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SETTING4).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SX4 * selectedYCSX.current.PROD_REQUEST_QTY / 100 / 1000 * selectedYCSX.current.PD / selectedYCSX.current.CAVITY).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_KT * selectedYCSX.current.PROD_REQUEST_QTY / 100 / 1000 * selectedYCSX.current.PD / selectedYCSX.current.CAVITY).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "green", fontWeight: "bold" }}>
                        {((selectedYCSX.current.PROD_REQUEST_QTY * (1 + (selectedYCSX.current.LOSS_SX1 + selectedYCSX.current.LOSS_SX2 + selectedYCSX.current.LOSS_SX3 + selectedYCSX.current.LOSS_KT) / 100) + (selectedYCSX.current.LOSS_SETTING1 + selectedYCSX.current.LOSS_SETTING2 + selectedYCSX.current.LOSS_SETTING3) * 1000.0 / selectedYCSX.current.PD * selectedYCSX.current.CAVITY) * selectedYCSX.current.PD / selectedYCSX.current.CAVITY / 1000).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </td>
                      <td style={{ color: "green", fontWeight: "normal" }}>
                        MET
                      </td>
                    </tr>
                    <tr style={{ fontSize: '0.6rem' }}>
                      <td style={{ color: "#cf10a6", fontWeight: "normal" }}>
                        THEORY LOSS %
                      </td>
                      <td style={{ color: "#fc2df6", fontWeight: "normal" }}>
                      </td>
                      <td style={{ color: "gray", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SETTING1 * 1000.0 / selectedYCSX.current.PD * selectedYCSX.current.CAVITY / selectedYCSX.current.PROD_REQUEST_QTY * 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SX1).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%
                      </td>
                      <td style={{ color: "gray", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SETTING2 * 1000.0 / selectedYCSX.current.PD * selectedYCSX.current.CAVITY / selectedYCSX.current.PROD_REQUEST_QTY * 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SX2).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%
                      </td>
                      <td style={{ color: "gray", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SETTING3 * 1000.0 / selectedYCSX.current.PD * selectedYCSX.current.CAVITY / selectedYCSX.current.PROD_REQUEST_QTY * 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SX3).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%
                      </td>
                      <td style={{ color: "gray", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SETTING4 * 1000.0 / selectedYCSX.current.PD * selectedYCSX.current.CAVITY / selectedYCSX.current.PROD_REQUEST_QTY * 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_SX4).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%
                      </td>
                      <td style={{ color: "red", fontWeight: "normal" }}>
                        {(selectedYCSX.current.LOSS_KT).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                      </td>
                      <td style={{ color: "green", fontWeight: "bold" }}>
                        {((selectedYCSX.current.PROD_REQUEST_QTY * (1 + (selectedYCSX.current.LOSS_SX1 + selectedYCSX.current.LOSS_SX2 + selectedYCSX.current.LOSS_SX3 + selectedYCSX.current.LOSS_KT) / 100) + (selectedYCSX.current.LOSS_SETTING1 + selectedYCSX.current.LOSS_SETTING2 + selectedYCSX.current.LOSS_SETTING3) * 1000.0 / selectedYCSX.current.PD * selectedYCSX.current.CAVITY) * 100 / selectedYCSX.current.PROD_REQUEST_QTY - 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                      </td>
                      <td style={{ color: "green", fontWeight: "normal" }}>
                        %
                      </td>
                    </tr>
                    <tr style={{ fontSize: '0.6rem' }}>
                      <td style={{ color: "#cf10a6", fontWeight: "normal" }}>
                        ACTUAL LOSS %
                      </td>
                      <td style={{ color: "#fc2df6", fontWeight: "normal" }}>
                      </td>
                      <td colSpan={2} style={{ color: "red", fontWeight: "bold" }}>
                        {(totalDailyYCSX.LOSS1 * 100).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                      </td>
                      <td colSpan={2} style={{ color: "red", fontWeight: "bold" }}>
                        {(totalDailyYCSX.LOSS2 * 100).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                      </td>
                      <td colSpan={2} style={{ color: "red", fontWeight: "bold" }}>
                        {(totalDailyYCSX.LOSS3 * 100).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                      </td>
                      <td colSpan={2} style={{ color: "red", fontWeight: "bold" }}>
                        {(totalDailyYCSX.LOSS4 * 100).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                      </td>
                      <td style={{ color: "red", fontWeight: "bold" }}>
                        {(totalDailyYCSX.LOSS_KT * 100).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                      </td>
                      <td style={{ color: "green", fontWeight: "bold" }}>
                        {((totalDailyYCSX.LOSS1 + totalDailyYCSX.LOSS2 + totalDailyYCSX.LOSS3 + totalDailyYCSX.LOSS_KT) * 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                      </td>
                      <td style={{ color: "green", fontWeight: "normal" }}>
                        %
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {datasx_dailyycsx}
          </div>
         }
        </div>
        {showhidePivotTable && (
          <div className="pivottable1">
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowHidePivotTable(false);
              }}
            >
              <AiFillCloseCircle color="blue" size={15} />
              Close
            </IconButton>
            <PivotTable
              datasource={selectedDataSource}
              tableID="datasxtablepivot"
            />
          </div>
        )}       
      </div>
    </div>
  );
};
export default DATASX;
