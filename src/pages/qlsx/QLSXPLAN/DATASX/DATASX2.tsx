import { IconButton } from "@mui/material";
import DataGrid, {
  Column,
  ColumnChooser,
  Editing,
  Export,
  FilterRow,
  Item,
  Pager,
  Paging,
  Scrolling,
  SearchPanel,
  Selection,
  Summary,
  Toolbar,
  TotalItem,
} from "devextreme-react/data-grid";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import { SaveExcel } from "../../../../api/GlobalFunction";
import "./DATASX.scss";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotTable from "../../../../components/PivotChart/PivotChart";
import {
  LICHSUINPUTLIEU_DATA,
  LOSS_TABLE_DATA,
  MACHINE_LIST,
  SX_DATA,
  YCSX_SX_DATA,
} from "../../../../api/GlobalInterface";
import { checkEQvsPROCESS } from "../Machine/MACHINE";
const DATASX2 = () => {
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
            },
          );
          loadeddata.push(
            { EQ_NAME: "ALL" },
            { EQ_NAME: "NO" },
            { EQ_NAME: "NA" },
          );
          //console.log(loadeddata);
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
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [inputlieudatatable, setInputLieuDataTable] = useState<
    LICHSUINPUTLIEU_DATA[]
  >([]);
  const [showloss, setShowLoss] = useState(false);
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
    INSPECT_LOSS_QTY:0,
    INSPECT_MATERIAL_NG:0,
    INSPECT_OK_QTY:0,
    INSPECT_PROCESS_NG:0,
    INSPECT_TOTAL_NG:0,
    INSPECT_TOTAL_QTY:0,
    LOSS_THEM_TUI:0,
    SX_MARKING_QTY:0,
    INSPECTION_OUTPUT: 0,
    LOSS_INS_OUT_VS_SCANNED_EA: 0,
    LOSS_INS_OUT_VS_XUATKHO_EA: 0,
    NG1:0,
    NG2:0,
    NG3:0,
    NG4:0,
    SETTING1:0,
    SETTING2:0,
    SETTING3:0,
    SETTING4:0
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
  const [onlyClose, setOnlyClose] = useState(true);
  const [id, setID] = useState("");
  const [datasxtable, setDataSXTable] = useState<Array<any>>([]);
  const [m_name, setM_Name] = useState("");
  const [m_code, setM_Code] = useState("");
  const [selectedRowsDataCHITHI, setSelectedRowsDataCHITHI] = useState<
    Array<SX_DATA>
  >([]);
  const [selectedRowsDataYCSX, setSelectedRowsDataYCSX] = useState<
    Array<YCSX_SX_DATA>
  >([]);
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
  const [selectedDataSource, setSelectedDataSource] =
    useState<PivotGridDataSource>(
      new PivotGridDataSource({
        fields: fields_datasx_chithi,
        store: datasxtable,
      }),
    );
  const datasx_chithi = React.useMemo(
    () => (
      <div className="datatb">
        <DataGrid
          style={{ fontSize: "0.7rem" }}
          autoNavigateToFocusedRow={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={false}
          cellHintEnabled={true}
          columnResizingMode={"widget"}
          showColumnLines={true}
          dataSource={datasxtable}
          columnWidth="auto"
          keyExpr="id"
          height={"70vh"}
          showBorders={true}
          onSelectionChanged={(e) => {
            //console.log(e.selectedRowsData);
            setSelectedRowsDataCHITHI(e.selectedRowsData);
          }}
          onRowClick={(e) => {
            //console.log(e.data);
            if (e.data.PLAN_ID !== undefined) {
              handle_loadlichsuinputlieu(e.data.PLAN_ID);
            }
          }}
        >
          <Scrolling
            useNative={true}
            scrollByContent={true}
            scrollByThumb={true}
            showScrollbar="onHover"
            mode="virtual"
          />
          <Selection mode="multiple" selectAllMode="allPages" />
          <Editing
            allowUpdating={false}
            allowAdding={false}
            allowDeleting={false}
            mode="cell"
            confirmDelete={false}
            onChangesChange={(e) => { }}
          />
          <Export enabled={true} />
          <Toolbar disabled={false}>
            <Item location="before">
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  SaveExcel(datasxtable, "SXDATATABLE");
                }}
              >
                <AiFillFileExcel color="green" size={15} />
                SAVE
              </IconButton>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  setShowHidePivotTable(!showhidePivotTable);
                }}
              >
                <MdOutlinePivotTableChart color="#ff33bb" size={15} />
                Pivot
              </IconButton>
            </Item>
            <Item name="searchPanel" />
            <Item name="exportButton" />
            <Item name="columnChooserButton" />
            <Item name="addRowButton" />
            <Item name="saveButton" />
            <Item name="revertButton" />
          </Toolbar>
          <FilterRow visible={true} />
          <SearchPanel visible={true} />
          <ColumnChooser enabled={true} />
          <Paging defaultPageSize={15} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={[5, 10, 15, 20, 100, 1000, 10000, "all"]}
            showNavigationButtons={true}
            showInfo={true}
            infoText="Page #{0}. Total: {1} ({2} items)"
            displayMode="compact"
          />
          <Column
            dataField="PHAN_LOAI"
            caption="PHAN_LOAI"
            minWidth={100}
          ></Column>
          <Column dataField="G_CODE" caption="G_CODE" minWidth={100}></Column>
          <Column dataField="PLAN_ID" caption="PLAN_ID" minWidth={100}></Column>
          <Column
            dataField="PLAN_DATE"
            caption="PLAN_DATE"
            minWidth={100}
          ></Column>
          <Column
            dataField="PROD_REQUEST_NO"
            caption="PROD_REQUEST_NO"
            minWidth={100}
          ></Column>
          <Column dataField="G_NAME" caption="G_NAME" width={150}></Column>
          <Column
            dataField="G_NAME_KD"
            caption="G_NAME_KD"
            width={120}
          ></Column>
          <Column
            dataField="PLAN_QTY"
            caption="PLAN_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {e.data.PLAN_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column dataField="EQ1" caption="EQ1" minWidth={100}></Column>
          <Column dataField="EQ2" caption="EQ2" minWidth={100}></Column>
          <Column dataField="PLAN_EQ" caption="PLAN_EQ" minWidth={100}></Column>
          <Column
            dataField="PLAN_FACTORY"
            caption="PLAN_FACTORY"
            minWidth={100}
          ></Column>
          <Column
            dataField="PROCESS_NUMBER"
            caption="PROCESS_NUMBER"
            minWidth={100}
          ></Column>
          <Column dataField="STEP" caption="STEP" minWidth={100}></Column>
          <Column dataField="M_NAME" caption="M_NAME" minWidth={100}></Column>
          <Column
            dataField="WAREHOUSE_OUTPUT_QTY"
            caption="WAREHOUSE_OUTPUT_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {e.data.WAREHOUSE_OUTPUT_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="TOTAL_OUT_QTY"
            caption="TOTAL_OUT_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {e.data.TOTAL_OUT_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="USED_QTY"
            caption="USED_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {e.data.USED_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="REMAIN_QTY"
            caption="REMAIN_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {e.data.REMAIN_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column dataField="PD" caption="PD" minWidth={100}></Column>
          <Column dataField="CAVITY" caption="CAVITY" minWidth={100}></Column>
          <Column
            dataField="SETTING_MET_TC"
            caption="SETTING_MET_TC"
            width={150}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#B42ED8", fontWeight: "bold" }}>
                  {e.data.SETTING_MET_TC?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="SETTING_DM_SX"
            caption="SETTING_DM_SX"
            width={150}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#B42ED8", fontWeight: "bold" }}>
                  {e.data.SETTING_DM_SX?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="SETTING_MET"
            caption="SETTING_MET"
            width={120}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#B42ED8", fontWeight: "bold" }}>
                  {e.data.SETTING_MET?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="NG_MET"
            caption="NG_MET"
            width={120}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#B42ED8", fontWeight: "bold" }}>
                  {e.data.NG_MET?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="WAREHOUSE_ESTIMATED_QTY"
            caption="WAREHOUSE_ESTIMATED_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#DF6709", fontWeight: "bold" }}>
                  {e.data.WAREHOUSE_ESTIMATED_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="ESTIMATED_QTY"
            caption="ESTIMATED_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#DF6709", fontWeight: "bold" }}>
                  {e.data.ESTIMATED_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="ESTIMATED_QTY_ST"
            caption="ESTIMATED_QTY_ST"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#DF6709", fontWeight: "bold" }}>
                  {e.data.ESTIMATED_QTY_ST?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="SETTING_EA"
            caption="SETTING_EA"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#DF6709", fontWeight: "bold" }}>
                  {e.data.SETTING_EA?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="NG_EA"
            caption="NG_EA"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#DF6709", fontWeight: "bold" }}>
                  {e.data.NG_EA?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          
          <Column
            dataField="KETQUASX"
            caption="KETQUASX"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {e.data.KETQUASX?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="KETQUASX_TP"
            caption="KETQUASX_TP"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {e.data.KETQUASX_TP?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="LOSS_SX_ST"
            caption="LOSS_SX_ST"
            minWidth={100}
            dataType="number"
            format={"percent"}
            cellRender={(e: any) => {
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
            }}
          ></Column>
          <Column
            dataField="LOSS_SX"
            caption="LOSS_SX"
            minWidth={100}
            dataType="number"
            format={"percent"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {e.data.LOSS_SX?.toLocaleString("en-US", {
                    style: 'percent',
                    maximumFractionDigits: 1,
                    minimumFractionDigits: 1,
                  })}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="INS_INPUT"
            caption="INS_INPUT"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#DF6709", fontWeight: "bold" }}>
                  {e.data.INS_INPUT?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="INSPECT_TOTAL_QTY"
            caption="INSPECT_TOTAL_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#DF6709", fontWeight: "bold" }}>
                  {e.data.INSPECT_TOTAL_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="INSPECT_OK_QTY"
            caption="INSPECT_OK_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#DF6709", fontWeight: "bold" }}>
                  {e.data.INSPECT_OK_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="INSPECT_TOTAL_NG"
            caption="INSPECT_TOTAL_NG"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#DF6709", fontWeight: "bold" }}>
                  {e.data.INSPECT_TOTAL_NG?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="LOSS_SX_KT"
            caption="LOSS_SX_KT"
            minWidth={100}
            dataType="number"
            format={"percent"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {e.data.LOSS_SX_KT?.toLocaleString("en-US", {
                    style: 'percent',
                    maximumFractionDigits: 1,
                    minimumFractionDigits: 1,
                  })}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="INS_OUTPUT"
            caption="INS_OUTPUT"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#DF6709", fontWeight: "bold" }}>
                  {e.data.INS_OUTPUT?.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="LOSS_KT"
            caption="LOSS_KT"
            minWidth={100}
            dataType="number"
            format={"percent"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {e.data.LOSS_KT?.toLocaleString("en-US", {
                    style: 'percent',
                    maximumFractionDigits: 1,
                    minimumFractionDigits: 1,
                  })}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="SETTING_START_TIME"
            caption="SETTING_START_TIME"
            width={150}
          ></Column>
          <Column
            dataField="MASS_START_TIME"
            caption="MASS_START_TIME"
            width={150}
          ></Column>
          <Column
            dataField="MASS_END_TIME"
            caption="MASS_END_TIME"
            width={150}
          ></Column>
          <Column dataField="RPM" caption="RPM" minWidth={100}></Column>
          <Column
            dataField="EQ_NAME_TT"
            caption="EQ_NAME_TT"
            minWidth={100}
          ></Column>
          <Column
            dataField="MACHINE_NAME"
            caption="MACHINE_NAME"
            minWidth={100}
          ></Column>
          <Column dataField="SX_DATE" caption="SX_DATE" minWidth={100}></Column>
          <Column
            dataField="WORK_SHIFT"
            caption="WORK_SHIFT"
            minWidth={100}
          ></Column>
          <Column
            dataField="INS_EMPL"
            caption="INS_EMPL"
            minWidth={100}
          ></Column>
          <Column dataField="FACTORY" caption="FACTORY" minWidth={100}></Column>
          <Column
            dataField="BOC_KIEM"
            caption="BOC_KIEM"
            minWidth={100}
          ></Column>
          <Column dataField="LAY_DO" caption="LAY_DO" minWidth={100}></Column>
          <Column
            dataField="MAY_HONG"
            caption="MAY_HONG"
            minWidth={100}
          ></Column>
          <Column dataField="DAO_NG" caption="DAO_NG" minWidth={100}></Column>
          <Column
            dataField="CHO_LIEU"
            caption="CHO_LIEU"
            minWidth={100}
          ></Column>
          <Column dataField="CHO_BTP" caption="CHO_BTP" minWidth={100}></Column>
          <Column
            dataField="HET_LIEU"
            caption="HET_LIEU"
            minWidth={100}
          ></Column>
          <Column dataField="LIEU_NG" caption="LIEU_NG" minWidth={100}></Column>
          <Column
            dataField="CAN_HANG"
            caption="CAN_HANG"
            minWidth={100}
          ></Column>
          <Column dataField="HOP_FL" caption="HOP_FL" minWidth={100}></Column>
          <Column dataField="CHO_QC" caption="CHO_QC" minWidth={100}></Column>
          <Column
            dataField="CHOT_BAOCAO"
            caption="CHOT_BAOCAO"
            minWidth={100}
          ></Column>
          <Column
            dataField="CHUYEN_CODE"
            caption="CHUYEN_CODE"
            minWidth={100}
          ></Column>
          <Column dataField="KHAC" caption="KHAC" minWidth={100}></Column>
          <Column dataField="REMARK" caption="REMARK" minWidth={100}></Column>
          <Summary>
            <TotalItem
              alignment="right"
              column="PHAN_LOAI"
              summaryType="count"
              valueFormat={"decimal"}
            />
            <TotalItem
              alignment="right"
              column="WAREHOUSE_OUTPUT_QTY"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="TOTAL_OUT_QTY"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="USED_QTY"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="REMAIN_QTY"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="SETTING_MET_TC"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="SETTING_DM_SX"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="SETTING_MET"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="WAREHOUSE_ESTIMATED_QTY"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="ESTIMATED_QTY_ST"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="ESTIMATED_QTY"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="KETQUASX"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="INS_INPUT"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="INS_OUTPUT"
              summaryType="sum"
              valueFormat={"thousands"}
            />
          </Summary>
        </DataGrid>
      </div>
    ),
    [datasxtable],
  );
  const datasx_ycsx = React.useMemo(
    () => (
      <div className="datatb">
        <DataGrid
          style={{ fontSize: "0.7rem" }}
          autoNavigateToFocusedRow={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={false}
          cellHintEnabled={true}
          columnResizingMode={"widget"}
          showColumnLines={true}
          dataSource={datasxtable}
          columnWidth="auto"
          keyExpr="id"
          height={"70vh"}
          showBorders={true}
          onSelectionChanged={(e) => {
            //console.log(e.selectedRowsData);
            setSelectedRowsDataYCSX(e.selectedRowsData);
          }}
          onRowClick={(e) => {
            //console.log(e.data);
          }}
        >
          <Scrolling
            useNative={true}
            scrollByContent={true}
            scrollByThumb={true}
            showScrollbar="onHover"
            mode="virtual"
          />
          <Selection mode="multiple" selectAllMode="allPages" />
          <Editing
            allowUpdating={false}
            allowAdding={false}
            allowDeleting={false}
            mode="cell"
            confirmDelete={false}
            onChangesChange={(e) => { }}
          />
          <Export enabled={true} />
          <Toolbar disabled={false}>
            <Item location="before">
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  SaveExcel(datasxtable, "SXDATATABLE");
                }}
              >
                <AiFillFileExcel color="green" size={15} />
                SAVE
              </IconButton>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  setShowHidePivotTable(!showhidePivotTable);
                }}
              >
                <MdOutlinePivotTableChart color="#ff33bb" size={15} />
                Pivot
              </IconButton>
            </Item>
            <Item name="searchPanel" />
            <Item name="exportButton" />
            <Item name="columnChooserButton" />
            <Item name="addRowButton" />
            <Item name="saveButton" />
            <Item name="revertButton" />
          </Toolbar>
          <FilterRow visible={true} />
          <SearchPanel visible={true} />
          <ColumnChooser enabled={true} />
          <Paging defaultPageSize={15} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={[5, 10, 15, 20, 100, 1000, 10000, "all"]}
            showNavigationButtons={true}
            showInfo={true}
            infoText="Page #{0}. Total: {1} ({2} items)"
            displayMode="compact"
          />
          <Column
            dataField="YCSX_PENDING"
            caption="YCSX_STATUS"
            minWidth={100}
            cellRender={(e: any) => {
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
            }}
          ></Column>
          <Column dataField="G_CODE" caption="G_CODE" minWidth={100}></Column>
          <Column
            dataField="PHAN_LOAI"
            caption="PHAN_LOAI"
            minWidth={100}
          ></Column>
          <Column
            dataField="PROD_REQUEST_NO"
            caption="PROD_REQUEST_NO"
            minWidth={100}
          ></Column>
          <Column dataField="G_NAME" caption="G_NAME" minWidth={100}></Column>
          <Column
            dataField="G_NAME_KD"
            caption="G_NAME_KD"
            minWidth={100}
          ></Column>
          <Column dataField="FACTORY" caption="FACTORY" minWidth={100}></Column>
          <Column dataField="EQ1" caption="EQ1" minWidth={100}></Column>
          <Column dataField="EQ2" caption="EQ2" minWidth={100}></Column>
          <Column dataField="EQ3" caption="EQ3" minWidth={100}></Column>
          <Column dataField="EQ4" caption="EQ4" minWidth={100}></Column>
          <Column
            dataField="PROD_REQUEST_DATE"
            caption="PROD_REQUEST_DATE"
            minWidth={100}
          ></Column>
          <Column
            dataField="PROD_REQUEST_QTY"
            caption="PROD_REQUEST_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {e.data.PROD_REQUEST_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column dataField="M_NAME" caption="M_NAME" minWidth={100}></Column>
          <Column
            dataField="M_OUTPUT"
            caption="M_OUTPUT"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {e.data.M_OUTPUT?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="SCANNED_QTY"
            caption="SCANNED_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {e.data.SCANNED_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="REMAIN_QTY"
            caption="REMAIN_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {e.data.REMAIN_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="USED_QTY"
            caption="USED_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {e.data.USED_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column dataField="PD" caption="PD" minWidth={100}></Column>
          <Column dataField="CAVITY" caption="CAVITY" minWidth={100}></Column>
          <Column
            dataField="WAREHOUSE_ESTIMATED_QTY"
            caption="WAREHOUSE_ESTIMATED_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {e.data.WAREHOUSE_ESTIMATED_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="ESTIMATED_QTY"
            caption="ESTIMATED_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {e.data.ESTIMATED_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="CD1"
            caption="CD1"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#FF00D4", fontWeight: "bold" }}>
                  {e.data.CD1?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="CD2"
            caption="CD2"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#FF00D4", fontWeight: "bold" }}>
                  {e.data.CD2?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="CD3"
            caption="CD3"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#FF00D4", fontWeight: "bold" }}>
                  {e.data.CD3?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="CD4"
            caption="CD4"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#FF00D4", fontWeight: "bold" }}>
                  {e.data.CD4?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="INS_INPUT"
            caption="INS_INPUT"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {e.data.INS_INPUT?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="INSPECT_TOTAL_QTY"
            caption="INSPECT_TOTAL_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {e.data.INSPECT_TOTAL_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="INSPECT_OK_QTY"
            caption="INSPECT_OK_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {e.data.INSPECT_OK_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="INSPECT_LOSS_QTY"
            caption="INSPECT_LOSS_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {e.data.INSPECT_LOSS_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="INSPECT_TOTAL_NG"
            caption="INSPECT_TOTAL_NG"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {e.data.INSPECT_TOTAL_NG?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="INSPECT_MATERIAL_NG"
            caption="INSPECT_MATERIAL_NG"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {e.data.INSPECT_MATERIAL_NG?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="INSPECT_PROCESS_NG"
            caption="INSPECT_PROCESS_NG"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "black", fontWeight: "bold" }}>
                  {e.data.INSPECT_PROCESS_NG?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="INS_OUTPUT"
            caption="INS_OUTPUT"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {e.data.INS_OUTPUT?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="LOSS_SX1"
            caption="LOSS_SX1"
            minWidth={100}
            dataType="number"
            format={"percent"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#F58A02", fontWeight: "bold" }}>
                  {parseInt((e.data.LOSS_SX1 * 100).toString())?.toLocaleString(
                    "en-US",
                    { maximumFractionDigits: 0, minimumFractionDigits: 0 },
                  )}{" "}
                  %
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="LOSS_SX2"
            caption="LOSS_SX2"
            minWidth={100}
            dataType="number"
            format={"percent"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#F58A02", fontWeight: "bold" }}>
                  {parseInt((e.data.LOSS_SX2 * 100).toString())?.toLocaleString(
                    "en-US",
                    { maximumFractionDigits: 0, minimumFractionDigits: 0 },
                  )}{" "}
                  %
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="LOSS_SX3"
            caption="LOSS_SX3"
            minWidth={100}
            dataType="number"
            format={"percent"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#F58A02", fontWeight: "bold" }}>
                  {parseInt((e.data.LOSS_SX3 * 100).toString())?.toLocaleString(
                    "en-US",
                    { maximumFractionDigits: 0, minimumFractionDigits: 0 },
                  )}{" "}
                  %
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="LOSS_SX4"
            caption="LOSS_SX4"
            minWidth={100}
            dataType="number"
            format={"percent"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#F58A02", fontWeight: "bold" }}>
                  {parseInt((e.data.LOSS_SX4 * 100).toString())?.toLocaleString(
                    "en-US",
                    { maximumFractionDigits: 0, minimumFractionDigits: 0 },
                  )}{" "}
                  %
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="LOSS_INSPECT"
            caption="LOSS_INSPECT"
            minWidth={100}
            dataType="number"
            format={"percent"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#F58A02", fontWeight: "bold" }}>
                  {parseInt(
                    (e.data.LOSS_INSPECT * 100).toString(),
                  )?.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}{" "}
                  %
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="TOTAL_LOSS"
            caption="TOTAL_LOSS"
            minWidth={100}
            dataType="number"
            format={"percent"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#0027EA", fontWeight: "bold" }}>
                  {parseInt(
                    (e.data.TOTAL_LOSS * 100).toString(),
                  )?.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}{" "}
                  %
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="TOTAL_LOSS2"
            caption="TOTAL_LOSS2"
            minWidth={100}
            dataType="number"
            format={"percent"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "#0027EA", fontWeight: "bold" }}>
                  {parseInt(
                    (e.data.TOTAL_LOSS2 * 100).toString(),
                  )?.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}{" "}
                  %
                </span>
              );
            }}
          ></Column>
          <Summary>
            <TotalItem
              alignment="right"
              column="PHAN_LOAI"
              summaryType="count"
              valueFormat={"decimal"}
            />
            <TotalItem
              alignment="right"
              column="M_OUTPUT"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="SCANNED_QTY"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="REMAIN_QTY"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="USED_QTY"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="WAREHOUSE_ESTIMATED_QTY"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="ESTIMATED_QTY"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="CD1"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="CD2"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="INS_INPUT"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="INS_OUTPUT"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="INSPECT_TOTAL_QTY"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="INSPECT_OK_QTY"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="INSPECT_LOSS_QTY"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="INSPECT_TOTAL_NG"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="INSPECT_MATERIAL_NG"
              summaryType="sum"
              valueFormat={"thousands"}
            />
            <TotalItem
              alignment="right"
              column="INSPECT_PROCESS_NG"
              summaryType="sum"
              valueFormat={"thousands"}
            />
          </Summary>
        </DataGrid>
      </div>
    ),
    [datasxtable],
  );
  const datasx_lichsuxuatlieu = React.useMemo(
    () => (
      <div className="datatb2">
        <DataGrid
          style={{ fontSize: "0.7rem" }}
          autoNavigateToFocusedRow={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={false}
          cellHintEnabled={true}
          columnResizingMode={"widget"}
          showColumnLines={true}
          dataSource={inputlieudatatable}
          columnWidth="auto"
          keyExpr="id"
          height={"70vh"}
          showBorders={true}
          onSelectionChanged={(e) => {
            //console.log(e.selectedRowsData);
            //setSelectedRowsDataYCSX(e.selectedRowsData);
          }}
          onRowClick={(e) => {
            //console.log(e.data);
          }}
        >
          <Scrolling
            useNative={true}
            scrollByContent={true}
            scrollByThumb={true}
            showScrollbar="onHover"
            mode="virtual"
          />
          <Editing
            allowUpdating={false}
            allowAdding={false}
            allowDeleting={false}
            mode="cell"
            confirmDelete={false}
            onChangesChange={(e) => { }}
          />
          <Export enabled={true} />
          <Toolbar disabled={false}>
            <Item location="before">
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  SaveExcel(inputlieudatatable, "LICHSUINPUTLIEU");
                }}
              >
                <AiFillFileExcel color="green" size={15} />
                SAVE
              </IconButton>
            </Item>
            <Item name="searchPanel" />
            <Item name="exportButton" />
            <Item name="columnChooserButton" />
            <Item name="addRowButton" />
            <Item name="saveButton" />
            <Item name="revertButton" />
          </Toolbar>
          <FilterRow visible={true} />
          <SearchPanel visible={true} />
          <ColumnChooser enabled={true} />
          <Paging defaultPageSize={15} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={[5, 10, 15, 20, 100, 1000, 10000, "all"]}
            showNavigationButtons={true}
            showInfo={true}
            infoText="Page #{0}. Total: {1} ({2} items)"
            displayMode="compact"
          />
          <Column dataField="PLAN_ID" caption="PLAN_ID" minWidth={100}></Column>
          <Column dataField="M_NAME" caption="M_NAME" width={150}></Column>
          <Column
            dataField="WIDTH_CD"
            caption="WIDTH_CD"
            minWidth={100}
          ></Column>
          <Column
            dataField="INPUT_QTY"
            caption="INPUT_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {e.data.INPUT_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="USED_QTY"
            caption="USED_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {e.data.USED_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="REMAIN_QTY"
            caption="REMAIN_QTY"
            minWidth={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {e.data.REMAIN_QTY?.toLocaleString("en-US")}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="PROD_REQUEST_NO"
            caption="PROD_REQUEST_NO"
            minWidth={100}
          ></Column>
          <Column dataField="G_NAME" caption="G_NAME" minWidth={100}></Column>
          <Column dataField="G_CODE" caption="G_CODE" minWidth={100}></Column>
          <Column
            dataField="G_NAME_KD"
            caption="G_NAME_KD"
            minWidth={100}
          ></Column>
          <Column dataField="M_CODE" caption="M_CODE" minWidth={100}></Column>
          <Column
            dataField="M_LOT_NO"
            caption="M_LOT_NO"
            minWidth={100}
          ></Column>
          <Column dataField="EMPL_NO" caption="EMPL_NO" minWidth={100}></Column>
          <Column
            dataField="EQUIPMENT_CD"
            caption="EQUIPMENT_CD"
            minWidth={100}
          ></Column>
          <Column
            dataField="INS_DATE"
            caption="INS_DATE"
            minWidth={100}
          ></Column>
          <Summary>
            <TotalItem
              alignment="right"
              column="PLAN_ID"
              summaryType="count"
              valueFormat={"decimal"}
            />
            <TotalItem
              alignment="right"
              column="INPUT_QTY"
              summaryType="sum"
              valueFormat={"decimal"}
            />
            <TotalItem
              alignment="right"
              column="USED_QTY"
              summaryType="sum"
              valueFormat={"decimal"}
            />
            <TotalItem
              alignment="right"
              column="REMAIN_QTY"
              summaryType="sum"
              valueFormat={"decimal"}
            />
          </Summary>
        </DataGrid>
      </div>
    ),
    [inputlieudatatable],
  );
  const handle_loadlichsuinputlieu = (PLAN_ID: string) => {
    generalQuery("lichsuinputlieusanxuat_full", {
      ALLTIME: true,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      PROD_REQUEST_NO: "",
      PLAN_ID: PLAN_ID,
      M_NAME: "",
      M_CODE: "",
      G_NAME: "",
      G_CODE: "",
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: LICHSUINPUTLIEU_DATA[] = response.data.data.map(
            (element: LICHSUINPUTLIEU_DATA, index: number) => {
              return {
                ...element,
                INS_DATE: moment(element.INS_DATE)
                  .utc()
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            },
          );
          setInputLieuDataTable(loaded_data);
        } else {
          setInputLieuDataTable([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_loaddatasx = () => {
    Swal.fire({
      title: "Tra data chỉ thị",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
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
      TRUSAMPLE: truSample
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: SX_DATA[] = response.data.data.map(
            (element: SX_DATA, index: number) => {
              return {
                ...element,
                PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
                SETTING_START_TIME: element.SETTING_START_TIME === null ? "" : moment.utc(element.SETTING_START_TIME).format("YYYY-MM-DD HH:mm:ss"),
                MASS_START_TIME: element.MASS_START_TIME === null ? "" : moment.utc(element.MASS_START_TIME).format("YYYY-MM-DD HH:mm:ss"),
                MASS_END_TIME: element.MASS_END_TIME === null ? "" : moment.utc(element.MASS_END_TIME).format("YYYY-MM-DD HH:mm:ss"),
                SX_DATE: element.SX_DATE === null ? "" : moment.utc(element.SX_DATE).format("YYYY-MM-DD"),
                LOSS_SX_ST: (element.ESTIMATED_QTY_ST ?? 0) !== 0 ? 1 - (element.KETQUASX ?? 0) * 1.0 / (element.ESTIMATED_QTY_ST ?? 0) : 0,
                LOSS_SX: (element.ESTIMATED_QTY ?? 0) !== 0 ? 1 - (element.KETQUASX ?? 0) * 1.0 / (element.ESTIMATED_QTY ?? 0) : 0,
                LOSS_SX_KT: (element.KETQUASX ?? 0) !== 0 ? 1 - (element.INS_INPUT ?? 0) * 1.0 / (element.KETQUASX ?? 0) : 0,
                LOSS_KT: (element.INS_INPUT ?? 0) !== 0 ? 1 - (element.INS_OUTPUT ?? 0) * 1.0 / (element.INS_INPUT ?? 0) : 0,
                id: index,
              };
            },
          );
          //setShowLoss(false);
          let temp_loss_info: LOSS_TABLE_DATA = {
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
            INSPECT_LOSS_QTY:0,
            INSPECT_MATERIAL_NG:0,
            INSPECT_OK_QTY:0,
            INSPECT_PROCESS_NG:0,
            INSPECT_TOTAL_NG:0,
            INSPECT_TOTAL_QTY:0,
            LOSS_THEM_TUI:0,
            SX_MARKING_QTY:0,
            INSPECTION_OUTPUT: 0,
            LOSS_INS_OUT_VS_SCANNED_EA: 0,
            LOSS_INS_OUT_VS_XUATKHO_EA: 0,
            NG1:0,
            NG2:0,
            NG3:0,
            NG4:0,
            SETTING1:0,
            SETTING2:0,
            SETTING3:0,
            SETTING4:0
          };
          for (let i = 0; i < loaded_data.length; i++) {
            temp_loss_info.XUATKHO_MET += loaded_data[i].WAREHOUSE_OUTPUT_QTY;
            temp_loss_info.XUATKHO_EA += loaded_data[i].WAREHOUSE_ESTIMATED_QTY;
            temp_loss_info.SCANNED_MET += loaded_data[i].PROCESS_NUMBER === 1 ? loaded_data[i].USED_QTY : 0;
            temp_loss_info.SCANNED_EA += loaded_data[i].PROCESS_NUMBER === 1 ? loaded_data[i].ESTIMATED_QTY : 0;
            temp_loss_info.PROCESS1_RESULT += loaded_data[i].PROCESS_NUMBER === 1 && loaded_data[i].STEP === 0 ? loaded_data[i].KETQUASX : 0;
            temp_loss_info.PROCESS2_RESULT += loaded_data[i].PROCESS_NUMBER === 2 && loaded_data[i].STEP === 0 ? loaded_data[i].KETQUASX : 0;
            temp_loss_info.PROCESS3_RESULT += loaded_data[i].PROCESS_NUMBER === 3 && loaded_data[i].STEP === 0 ? loaded_data[i].KETQUASX : 0;
            temp_loss_info.PROCESS4_RESULT += loaded_data[i].PROCESS_NUMBER === 4 && loaded_data[i].STEP === 0 ? loaded_data[i].KETQUASX : 0;

            temp_loss_info.NG1 += loaded_data[i].PROCESS_NUMBER === 1 && loaded_data[i].STEP === 0 ? loaded_data[i].NG_EA : 0;
            temp_loss_info.NG2 += loaded_data[i].PROCESS_NUMBER === 2 && loaded_data[i].STEP === 0 ? loaded_data[i].NG_EA : 0;
            temp_loss_info.NG3 += loaded_data[i].PROCESS_NUMBER === 3 && loaded_data[i].STEP === 0 ? loaded_data[i].NG_EA : 0;
            temp_loss_info.NG4 += loaded_data[i].PROCESS_NUMBER === 4 && loaded_data[i].STEP === 0 ? loaded_data[i].NG_EA : 0;

            temp_loss_info.SETTING1 += loaded_data[i].PROCESS_NUMBER === 1 && loaded_data[i].STEP === 0 ? loaded_data[i].SETTING_EA : 0;
            temp_loss_info.SETTING2 += loaded_data[i].PROCESS_NUMBER === 2 && loaded_data[i].STEP === 0 ? loaded_data[i].SETTING_EA : 0;
            temp_loss_info.SETTING3 += loaded_data[i].PROCESS_NUMBER === 3 && loaded_data[i].STEP === 0 ? loaded_data[i].SETTING_EA : 0;
            temp_loss_info.SETTING4 += loaded_data[i].PROCESS_NUMBER === 4 && loaded_data[i].STEP === 0 ? loaded_data[i].SETTING_EA : 0;

            temp_loss_info.INSPECTION_INPUT += loaded_data[i].INS_INPUT;            
            temp_loss_info.INSPECT_TOTAL_QTY+=loaded_data[i].INSPECT_TOTAL_QTY
            temp_loss_info.INSPECT_OK_QTY+=loaded_data[i].INSPECT_OK_QTY
            temp_loss_info.LOSS_THEM_TUI+=loaded_data[i].LOSS_THEM_TUI
            temp_loss_info.INSPECT_LOSS_QTY+=loaded_data[i].INSPECT_LOSS_QTY
            temp_loss_info.INSPECT_TOTAL_NG+=loaded_data[i].INSPECT_TOTAL_NG
            temp_loss_info.INSPECT_MATERIAL_NG+=loaded_data[i].INSPECT_MATERIAL_NG
            temp_loss_info.INSPECT_PROCESS_NG+=loaded_data[i].INSPECT_PROCESS_NG
            temp_loss_info.SX_MARKING_QTY+=loaded_data[i].SX_MARKING_QTY           
            temp_loss_info.INSPECTION_OUTPUT += loaded_data[i].INS_OUTPUT;
            temp_loss_info.SX_RESULT += loaded_data[i].KETQUASX_TP ?? 0;
          }
          temp_loss_info.LOSS_INS_OUT_VS_SCANNED_EA = 1 - temp_loss_info.INSPECTION_OUTPUT / temp_loss_info.SCANNED_EA;
          temp_loss_info.LOSS_INS_OUT_VS_XUATKHO_EA = 1 - temp_loss_info.INSPECTION_OUTPUT / temp_loss_info.XUATKHO_EA;
          setLossTableInfo(temp_loss_info);
          setDataSXTable(loaded_data);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fields_datasx_chithi,
              store: loaded_data,
            }),
          );
          setSelectButton(true);
          Swal.fire(
            "Thông báo",
            " Đã tải: " + loaded_data.length + " dòng",
            "success",
          );
        } else {
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_loaddatasxYCSX = () => {
    Swal.fire({
      title: "Tra data chỉ thị",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    generalQuery("loadDataSX_YCSX", {
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
            },
          );
          let temp_loss_info: LOSS_TABLE_DATA = {
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
            INSPECT_LOSS_QTY:0,
            INSPECT_MATERIAL_NG:0,
            INSPECT_OK_QTY:0,
            INSPECT_PROCESS_NG:0,
            INSPECT_TOTAL_NG:0,
            INSPECT_TOTAL_QTY:0,
            LOSS_THEM_TUI:0,
            SX_MARKING_QTY:0,
            INSPECTION_OUTPUT: 0,
            LOSS_INS_OUT_VS_SCANNED_EA: 0,
            LOSS_INS_OUT_VS_XUATKHO_EA: 0,
            NG1:0,
            NG2:0,
            NG3:0,
            NG4:0,
            SETTING1:0,
            SETTING2:0,
            SETTING3:0,
            SETTING4:0
          };
          let maxprocess:number =1;
          for (let i = 0; i < loaded_data.length; i++) {
            maxprocess = checkEQvsPROCESS(loaded_data[i].EQ1,loaded_data[i].EQ2,loaded_data[i].EQ3,loaded_data[i].EQ4);
            temp_loss_info.XUATKHO_MET += loaded_data[i].M_OUTPUT;
            temp_loss_info.XUATKHO_EA += loaded_data[i].WAREHOUSE_ESTIMATED_QTY;
            temp_loss_info.SCANNED_MET += loaded_data[i].USED_QTY;
            temp_loss_info.SCANNED_EA += loaded_data[i].ESTIMATED_QTY;
            temp_loss_info.PROCESS1_RESULT += loaded_data[i].CD1;
            temp_loss_info.PROCESS2_RESULT += loaded_data[i].CD2;
            temp_loss_info.PROCESS3_RESULT += loaded_data[i].CD3;
            temp_loss_info.PROCESS4_RESULT += loaded_data[i].CD4;

            
            temp_loss_info.NG1 += loaded_data[i].NG1;
            temp_loss_info.NG2 += loaded_data[i].NG2;
            temp_loss_info.NG3 += loaded_data[i].NG3;
            temp_loss_info.NG4 += loaded_data[i].NG4;

            temp_loss_info.SETTING1 += loaded_data[i].ST1;
            temp_loss_info.SETTING2 += loaded_data[i].ST2;
            temp_loss_info.SETTING3 += loaded_data[i].ST3;
            temp_loss_info.SETTING4 += loaded_data[i].ST4;

            temp_loss_info.SX_RESULT += maxprocess==1 ? loaded_data[i].CD1: maxprocess==2 ? loaded_data[i].CD2 :maxprocess==3 ? loaded_data[i].CD3 : loaded_data[i].CD4,
            temp_loss_info.INSPECTION_INPUT += loaded_data[i].INS_INPUT;         
            temp_loss_info.INSPECT_TOTAL_QTY+=loaded_data[i].INSPECT_TOTAL_QTY
            temp_loss_info.INSPECT_OK_QTY+=loaded_data[i].INSPECT_OK_QTY
            temp_loss_info.LOSS_THEM_TUI+=loaded_data[i].LOSS_THEM_TUI
            temp_loss_info.INSPECT_LOSS_QTY+=loaded_data[i].INSPECT_LOSS_QTY
            temp_loss_info.INSPECT_TOTAL_NG+=loaded_data[i].INSPECT_TOTAL_NG
            temp_loss_info.INSPECT_MATERIAL_NG+=loaded_data[i].INSPECT_MATERIAL_NG
            temp_loss_info.INSPECT_PROCESS_NG+=loaded_data[i].INSPECT_PROCESS_NG
            temp_loss_info.SX_MARKING_QTY+=loaded_data[i].SX_MARKING_QTY   
            temp_loss_info.INSPECTION_OUTPUT += loaded_data[i].INS_OUTPUT;
            temp_loss_info.LOSS_INS_OUT_VS_SCANNED_EA = 1 - temp_loss_info.INSPECTION_OUTPUT / temp_loss_info.SCANNED_EA;
            temp_loss_info.LOSS_INS_OUT_VS_XUATKHO_EA = 1 - temp_loss_info.INSPECTION_OUTPUT / temp_loss_info.XUATKHO_EA;
          }
          setLossTableInfo(temp_loss_info);
          setShowLoss(true);
          setDataSXTable(loaded_data);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fields_datasx_ycsx,
              store: loaded_data,
            }),
          );
          setSelectButton(false);
          Swal.fire(
            "Thông báo",
            " Đã tải: " + loaded_data.length + " dòng",
            "success",
          );
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
    <div className="datasx">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform">
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
          <div className="losstable">
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
                    3.USED_MET
                  </th>
                  
                  <th style={{ color: "black", fontWeight: "bold" }}>
                    4.USED_EA
                  </th>
                  <th style={{ color: "black", fontWeight: "normal" }}>
                    5_1.ST1
                  </th>
                  <th style={{ color: "black", fontWeight: "normal" }}>
                    5_2.NG1
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>5.CD1</th>
                  <th style={{ color: "black", fontWeight: "normal" }}>
                    6_1.ST2
                  </th>
                  <th style={{ color: "black", fontWeight: "normal" }}>
                    6_2.NG2
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>6.CD2</th>
                  <th style={{ color: "black", fontWeight: "normal" }}>
                    7_1.ST3
                  </th>
                  <th style={{ color: "black", fontWeight: "normal" }}>
                    7_2.NG3
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>7.CD3</th>
                  <th style={{ color: "black", fontWeight: "normal" }}>
                    8_1.ST4
                  </th>
                  <th style={{ color: "black", fontWeight: "normal" }}>
                    8_2.NG4
                  </th>
                  <th style={{ color: "black", fontWeight: "bold" }}>8.CD4</th>
                  <th style={{ color: "blue", fontWeight: "bold" }}>
                    9.SX_RESULT
                  </th>
                  <th style={{ color: "blue", fontWeight: "bold" }}>
                    10.INS_INPUT
                  </th>
                  <th style={{ color: "blue", fontWeight: "normal" }}>
                    10_1.INS_TT_QTY
                  </th>
                  <th style={{ color: "blue", fontWeight: "normal" }}>
                    10_2.INS_QTY
                  </th>
                  <th style={{ color: "blue", fontWeight: "normal" }}>
                    10_3.MARKING
                  </th>
                  <th style={{ color: "blue", fontWeight: "normal" }}>
                    10_4.INS_OK
                  </th>
                  <th style={{ color: "blue", fontWeight: "normal" }}>
                    10_5.INS_M_NG
                  </th>
                  <th style={{ color: "blue", fontWeight: "normal" }}>
                    10_6.INS_P_NG
                  </th>
                  <th style={{ color: "blue", fontWeight: "normal" }}>
                    10_7.INSP_LOSS
                  </th>
                  <th style={{ color: "blue", fontWeight: "normal" }}>
                    10_8.THEM_TUI
                  </th>
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
                <tr style={{fontSize:'0.6rem'}}>
                  <td style={{ color: "blue", fontWeight: "bold" }}>
                    {losstableinfo.XUATKHO_MET.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "blue", fontWeight: "bold" }}>
                    {losstableinfo.XUATKHO_EA.toLocaleString("en-US", {minimumFractionDigits:0, maximumFractionDigits:0})}
                  </td>
                  <td style={{ color: "#fc2df6", fontWeight: "bold" }}>
                    {losstableinfo.SCANNED_MET.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "#fc2df6", fontWeight: "bold" }}>
                    {losstableinfo.SCANNED_EA.toLocaleString("en-US", {minimumFractionDigits:0, maximumFractionDigits:0})}
                  </td>
                  <td style={{ color: "gray", fontWeight: "normal" }}>
                    {losstableinfo.SETTING1.toLocaleString("en-US", {minimumFractionDigits:0, maximumFractionDigits:0})}
                  </td>
                  <td style={{ color: "red", fontWeight: "normal" }}>
                    {losstableinfo.NG1.toLocaleString("en-US", {minimumFractionDigits:0, maximumFractionDigits:0})}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {losstableinfo.PROCESS1_RESULT.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "gray", fontWeight: "normal" }}>
                    {losstableinfo.SETTING2.toLocaleString("en-US", {minimumFractionDigits:0, maximumFractionDigits:0})}
                  </td>
                  <td style={{ color: "red", fontWeight: "normal" }}>
                    {losstableinfo.NG2.toLocaleString("en-US", {minimumFractionDigits:0, maximumFractionDigits:0})}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {losstableinfo.PROCESS2_RESULT.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "gray", fontWeight: "normal" }}>
                    {losstableinfo.SETTING3.toLocaleString("en-US", {minimumFractionDigits:0, maximumFractionDigits:0})}
                  </td>
                  <td style={{ color: "red", fontWeight: "normal" }}>
                    {losstableinfo.NG3.toLocaleString("en-US", {minimumFractionDigits:0, maximumFractionDigits:0})}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {losstableinfo.PROCESS3_RESULT.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "gray", fontWeight: "normal" }}>
                    {losstableinfo.SETTING4.toLocaleString("en-US", {minimumFractionDigits:0, maximumFractionDigits:0})}
                  </td>
                  <td style={{ color: "red", fontWeight: "normal" }}>
                    {losstableinfo.NG4.toLocaleString("en-US", {minimumFractionDigits:0, maximumFractionDigits:0})}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {losstableinfo.PROCESS4_RESULT.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {losstableinfo.SX_RESULT.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "green", fontWeight: "bold" }}>
                    {losstableinfo.INSPECTION_INPUT.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "gray", fontWeight: "normal" }}>
                    {losstableinfo.INSPECT_TOTAL_QTY.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "gray", fontWeight: "normal" }}>
                    {(losstableinfo.INSPECT_TOTAL_QTY-losstableinfo.SX_MARKING_QTY).toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "gray", fontWeight: "normal" }}>
                    {losstableinfo.SX_MARKING_QTY.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "gray", fontWeight: "normal" }}>
                    {losstableinfo.INSPECT_OK_QTY.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "red", fontWeight: "normal" }}>
                    {losstableinfo.INSPECT_MATERIAL_NG.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "red", fontWeight: "normal" }}>
                    {losstableinfo.INSPECT_PROCESS_NG.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "gray", fontWeight: "normal" }}>
                    {losstableinfo.INSPECT_LOSS_QTY.toLocaleString("en-US")}
                  </td>
                  <td style={{ color: "gray", fontWeight: "normal" }}>
                    {losstableinfo.LOSS_THEM_TUI.toLocaleString("en-US")}
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
        <div className="tracuuYCSXTable">
          {selectbutton && datasx_chithi}
          {!selectbutton && datasx_ycsx}
          {selectbutton && datasx_lichsuxuatlieu}
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
export default DATASX2;
