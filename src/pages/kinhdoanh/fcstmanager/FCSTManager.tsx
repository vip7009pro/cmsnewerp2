import { IconButton } from "@mui/material";
import {
  DataGrid,
  GridRowSelectionModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { FcSearch } from "react-icons/fc";
import { AiFillCloseCircle, AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { generalQuery, getAuditMode, getGlobalSetting, getSocket, getUserData } from "../../../api/Api";
import { checkBP, f_insert_Notification_Data, SaveExcel } from "../../../api/GlobalFunction";
import { MdOutlineDelete, MdOutlinePivotTableChart } from "react-icons/md";
import "./FCSTManager.scss";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotTable from "../../../components/PivotChart/PivotChart";
import { UserData, WEB_SETTING_DATA } from "../../../api/GlobalInterface";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { TbLogout } from "react-icons/tb";
import { FCSTTableData } from "../../../api/GlobalInterface";
import { Tab, TabList, Tabs, TabPanel } from "react-tabs";
import AGTable from "../../../components/DataTable/AGTable";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";

const FCSTManager = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [showhidesearchdiv, setShowHideSearchDiv] = useState(true);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [uploadExcelJson, setUploadExcelJSon] = useState<Array<any>>([]);
  const [isLoading, setisLoading] = useState(false);
  const [column_excel, setColumn_Excel] = useState<Array<any>>([]);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [empl_name, setEmpl_Name] = useState("");
  const [cust_name, setCust_Name] = useState("");
  const [prod_type, setProdType] = useState("");
  const [id, setID] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [justpobalance, setJustPOBalance] = useState(true);
  const [po_no, setPo_No] = useState("");
  const [material, setMaterial] = useState("");
  const [over, setOver] = useState("");
  const [invoice_no, setInvoice_No] = useState("");
  const [fcstdatatable, setFCSTDataTable] = useState<Array<FCSTTableData>>([]);
  const fcstdatatablefilter = useRef<Array<FCSTTableData>>([]);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [trigger, setTrigger] = useState(true);
  const column_fcsttable:any = [
    { field: "FCST_ID", headerName: "FCST_ID", width: 80,  headerCheckboxSelection: true, checkboxSelection: true,  },
    { field: "FCSTYEAR", headerName: "FCSTYEAR", width: 80 },
    { field: "FCSTWEEKNO", headerName: "FCSTWEEKNO", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 250,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.G_NAME}</b>
          </span>
        );
      },
    },
    { field: "DESCR", headerName: "DESCR", width: 120 },
    { field: "EMPL_NAME", headerName: "EMPL_NAME", width: 150 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 80 },
    { field: "PROD_PROJECT", headerName: "PROD_PROJECT", width: 80 },
    { field: "PROD_MODEL", headerName: "PROD_MODEL", width: 80 },
    {
      field: "PROD_MAIN_MATERIAL",
      headerName: "PROD_MAIN_MATERIAL",
      width: 80,
    },
    {
      field: "PROD_PRICE",
      type: "number",
      headerName: "PROD_PRICE",
      width: 80,
    },
    {
      field: "W1",
      type: "number",
      headerName: "W1",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W1.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W2",
      type: "number",
      headerName: "W2",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W2.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W3",
      type: "number",
      headerName: "W3",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W3.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W4",
      type: "number",
      headerName: "W4",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W4.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W5",
      type: "number",
      headerName: "W5",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W5.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W6",
      type: "number",
      headerName: "W6",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W6.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W7",
      type: "number",
      headerName: "W7",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W7.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W8",
      type: "number",
      headerName: "W8",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W8.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W9",
      type: "number",
      headerName: "W9",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W9.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W10",
      type: "number",
      headerName: "W10",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W10.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W11",
      type: "number",
      headerName: "W11",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W11.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W12",
      type: "number",
      headerName: "W12",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W12.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W13",
      type: "number",
      headerName: "W13",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W13.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W14",
      type: "number",
      headerName: "W14",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W14.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W15",
      type: "number",
      headerName: "W15",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W15.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W16",
      type: "number",
      headerName: "W16",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W16.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W17",
      type: "number",
      headerName: "W17",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W17.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W18",
      type: "number",
      headerName: "W18",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W18.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W19",
      type: "number",
      headerName: "W19",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W19.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W20",
      type: "number",
      headerName: "W20",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W20.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W21",
      type: "number",
      headerName: "W21",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W21.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W22",
      type: "number",
      headerName: "W22",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W22.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W1A",
      type: "number",
      headerName: "W1A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W1A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W2A",
      type: "number",
      headerName: "W2A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W2A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W3A",
      type: "number",
      headerName: "W3A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W3A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W4A",
      type: "number",
      headerName: "W4A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W4A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W5A",
      type: "number",
      headerName: "W5A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W5A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W6A",
      type: "number",
      headerName: "W6A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W6A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W7A",
      type: "number",
      headerName: "W7A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W7A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W8A",
      type: "number",
      headerName: "W8A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W8A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W9A",
      type: "number",
      headerName: "W9A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W9A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W10A",
      type: "number",
      headerName: "W10A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W10A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W11A",
      type: "number",
      headerName: "W11A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W11A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W12A",
      type: "number",
      headerName: "W12A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W12A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W13A",
      type: "number",
      headerName: "W13A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W13A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W14A",
      type: "number",
      headerName: "W14A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W14A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W15A",
      type: "number",
      headerName: "W15A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W15A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W16A",
      type: "number",
      headerName: "W16A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W16A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W17A",
      type: "number",
      headerName: "W17A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W17A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W18A",
      type: "number",
      headerName: "W18A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W18A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W19A",
      type: "number",
      headerName: "W19A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W19A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W20A",
      type: "number",
      headerName: "W20A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W20A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W21A",
      type: "number",
      headerName: "W21A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W21A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "W22A",
      type: "number",
      headerName: "W22A",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.W22A.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
  ];
  const column_excelplan2: any = [
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 50 },
    { field: "CUST_CD", headerName: "CUST_CD", width: 50 },
    { field: "G_CODE", headerName: "G_CODE", width: 50 },
    { field: "PROD_PRICE", headerName: "PROD_PRICE", width: 50 },
    { field: "YEAR", headerName: "YEAR", width: 50 },
    { field: "WEEKNO", headerName: "WEEKNO", width: 50 },
    {
      field: "W1",
      type: "number",
      headerName: "W1",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W1.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W2",
      type: "number",
      headerName: "W2",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W2.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W3",
      type: "number",
      headerName: "W3",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W3.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W4",
      type: "number",
      headerName: "W4",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W4.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W5",
      type: "number",
      headerName: "W5",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W5.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W6",
      type: "number",
      headerName: "W6",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W6.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W7",
      type: "number",
      headerName: "W7",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W7.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W8",
      type: "number",
      headerName: "W8",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W8.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W9",
      type: "number",
      headerName: "W9",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W9.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W10",
      type: "number",
      headerName: "W10",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W10.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W11",
      type: "number",
      headerName: "W11",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W11.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W12",
      type: "number",
      headerName: "W12",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W12.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W13",
      type: "number",
      headerName: "W13",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W13.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W14",
      type: "number",
      headerName: "W14",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W14.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W15",
      type: "number",
      headerName: "W15",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W15.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W16",
      type: "number",
      headerName: "W16",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W16.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W17",
      type: "number",
      headerName: "W17",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W17.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W18",
      type: "number",
      headerName: "W18",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W18.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W19",
      type: "number",
      headerName: "W19",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W19.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W20",
      type: "number",
      headerName: "W20",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W20.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W21",
      type: "number",
      headerName: "W21",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W21.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W22",
      type: "number",
      headerName: "W22",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.W22.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHECKSTATUS",
      headerName: "CHECKSTATUS",
      width: 200,
      cellRenderer: (params: any) => {
        if (params.data.CHECKSTATUS.slice(0, 2) === "OK")
          return (
            <span style={{ color: "green" }}>
              <b>{params.data.CHECKSTATUS}</b>
            </span>
          );
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.CHECKSTATUS}</b>
          </span>
        );
      },
    },
  ];
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handletraFcst();
    }
  }; 
  const readUploadFile = (e: any) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any = XLSX.utils.sheet_to_json(worksheet);
        const keys = Object.keys(json[0]);
        let uploadexcelcolumn = keys.map((element, index) => {
          return {
            field: element,
            headerName: element,
            width: 150,
          };
        });
        uploadexcelcolumn.push({
          field: "CHECKSTATUS",
          headerName: "CHECKSTATUS",
          width: 350,
        });
        setColumn_Excel(uploadexcelcolumn);
        setUploadExcelJSon(
          json.map((element: any, index: number) => {
            return {
              ...element,
              id: index,
              CHECKSTATUS: "Waiting",
              W1:
                element.W1 === undefined || element.W1 === "" ? 0 : element.W1,
              W2:
                element.W2 === undefined || element.W2 === "" ? 0 : element.W2,
              W3:
                element.W3 === undefined || element.W3 === "" ? 0 : element.W3,
              W4:
                element.W4 === undefined || element.W4 === "" ? 0 : element.W4,
              W5:
                element.W5 === undefined || element.W5 === "" ? 0 : element.W5,
              W6:
                element.W6 === undefined || element.W6 === "" ? 0 : element.W6,
              W7:
                element.W7 === undefined || element.W7 === "" ? 0 : element.W7,
              W8:
                element.W8 === undefined || element.W8 === "" ? 0 : element.W8,
              W9:
                element.W9 === undefined || element.W9 === "" ? 0 : element.W9,
              W10:
                element.W10 === undefined || element.W10 === ""
                  ? 0
                  : element.W10,
              W11:
                element.W11 === undefined || element.W11 === ""
                  ? 0
                  : element.W11,
              W12:
                element.W12 === undefined || element.W12 === ""
                  ? 0
                  : element.W12,
              W13:
                element.W13 === undefined || element.W13 === ""
                  ? 0
                  : element.W13,
              W14:
                element.W14 === undefined || element.W14 === ""
                  ? 0
                  : element.W14,
              W15:
                element.W15 === undefined || element.W15 === ""
                  ? 0
                  : element.W15,
              W16:
                element.W16 === undefined || element.W16 === ""
                  ? 0
                  : element.W16,
              W17:
                element.W17 === undefined || element.W17 === ""
                  ? 0
                  : element.W17,
              W18:
                element.W18 === undefined || element.W18 === ""
                  ? 0
                  : element.W18,
              W19:
                element.W19 === undefined || element.W19 === ""
                  ? 0
                  : element.W19,
              W20:
                element.W20 === undefined || element.W20 === ""
                  ? 0
                  : element.W20,
              W21:
                element.W21 === undefined || element.W21 === ""
                  ? 0
                  : element.W21,
              W22:
                element.W22 === undefined || element.W22 === ""
                  ? 0
                  : element.W22,
              W1A:
                element.W1A === undefined || element.W1A === ""
                  ? 0
                  : element.W1A,
              W2A:
                element.W2A === undefined || element.W2A === ""
                  ? 0
                  : element.W2A,
              W3A:
                element.W3A === undefined || element.W3A === ""
                  ? 0
                  : element.W3A,
              W4A:
                element.W4A === undefined || element.W4A === ""
                  ? 0
                  : element.W4A,
              W5A:
                element.W5A === undefined || element.W5A === ""
                  ? 0
                  : element.W5A,
              W6A:
                element.W6A === undefined || element.W6A === ""
                  ? 0
                  : element.W6A,
              W7A:
                element.W7A === undefined || element.W7A === ""
                  ? 0
                  : element.W7A,
              W8A:
                element.W8A === undefined || element.W8A === ""
                  ? 0
                  : element.W8A,
              W9A:
                element.W9A === undefined || element.W9A === ""
                  ? 0
                  : element.W9A,
              W10A:
                element.W10A === undefined || element.W10A === ""
                  ? 0
                  : element.W10A,
              W11A:
                element.W11A === undefined || element.W11A === ""
                  ? 0
                  : element.W11A,
              W12A:
                element.W12A === undefined || element.W12A === ""
                  ? 0
                  : element.W12A,
              W13A:
                element.W13A === undefined || element.W13A === ""
                  ? 0
                  : element.W13A,
              W14A:
                element.W14A === undefined || element.W14A === ""
                  ? 0
                  : element.W14A,
              W15A:
                element.W15A === undefined || element.W15A === ""
                  ? 0
                  : element.W15A,
              W16A:
                element.W16A === undefined || element.W16A === ""
                  ? 0
                  : element.W16A,
              W17A:
                element.W17A === undefined || element.W17A === ""
                  ? 0
                  : element.W17A,
              W18A:
                element.W18A === undefined || element.W18A === ""
                  ? 0
                  : element.W18A,
              W19A:
                element.W19A === undefined || element.W19A === ""
                  ? 0
                  : element.W19A,
              W20A:
                element.W20A === undefined || element.W20A === ""
                  ? 0
                  : element.W20A,
              W21A:
                element.W21A === undefined || element.W21A === ""
                  ? 0
                  : element.W21A,
              W22A:
                element.W22A === undefined || element.W22A === ""
                  ? 0
                  : element.W22A,
            };
          }),
        );
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  const handletraFcst = () => {
    setisLoading(true);
    generalQuery("traFcstDataFull", {
      alltime: alltime,
      justPoBalance: justpobalance,
      start_date: fromdate,
      end_date: todate,
      cust_name: cust_name,
      codeCMS: codeCMS,
      codeKD: codeKD,
      prod_type: prod_type,
      empl_name: empl_name,
      po_no: po_no,
      over: over,
      id: id,
      material: material,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: FCSTTableData[] = response.data.data.map(
            (element: FCSTTableData, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
                G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
              };
            },
          );
          setFCSTDataTable(loadeddata);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_checkFcstHangLoat = async () => {
    setisLoading(true);
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      await generalQuery("checkFcstExist", {
        FCSTYEAR: uploadExcelJson[i].YEAR,
        FCSTWEEKNO: uploadExcelJson[i].WEEKNO,
        G_CODE: uploadExcelJson[i].G_CODE,
        CUST_CD: uploadExcelJson[i].CUST_CD,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            err_code = 1; //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại FCST";
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });

      await generalQuery("checkGCodeVer", {
        G_CODE: uploadExcelJson[i].G_CODE,
      })
        .then((response) => {
          //console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            //console.log(response.data.data);
            if (response.data.data[0].USE_YN === "Y") {
              //tempjson[i].CHECKSTATUS = "OK";
            } else {
              //tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
              err_code = 3;
            }
          } else {
            //tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
            err_code = 4;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      if (err_code === 0) {
        tempjson[i].CHECKSTATUS = "OK";
      } else if (err_code === 1) {
        tempjson[i].CHECKSTATUS = "NG:FCST đã tồn tại";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS = "NG: Ngày FCST không được sau ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      } else if (err_code === 5) {
        tempjson[i].CHECKSTATUS = "NG: Giao hàng nhiều hơn PO";
      }
    }
    setisLoading(false);
    Swal.fire("Thông báo", "Đã hoàn thành check FCST hàng loạt", "success");
    setUploadExcelJSon(tempjson);
    setTrigger(!trigger);
  };
  const handle_upFcstHangLoat = async () => {
    setisLoading(true);
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      await generalQuery("checkFcstExist", {
        FCSTYEAR: uploadExcelJson[i].YEAR,
        FCSTWEEKNO: uploadExcelJson[i].WEEKNO,
        G_CODE: uploadExcelJson[i].G_CODE,
        CUST_CD: uploadExcelJson[i].CUST_CD,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            err_code = 1; //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại FCST";
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });

      await generalQuery("checkGCodeVer", {
        G_CODE: uploadExcelJson[i].G_CODE,
      })
        .then((response) => {
          //console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            //console.log(response.data.data);
            if (response.data.data[0].USE_YN === "Y") {
              //tempjson[i].CHECKSTATUS = "OK";
            } else {
              //tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
              err_code = 3;
            }
          } else {
            //tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
            err_code = 4;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      if (err_code === 0) {
        await generalQuery("insert_fcst", {
          EMPL_NO: uploadExcelJson[i].EMPL_NO,
          CUST_CD: uploadExcelJson[i].CUST_CD,
          G_CODE: uploadExcelJson[i].G_CODE,
          PROD_PRICE: uploadExcelJson[i].PROD_PRICE,
          YEAR: uploadExcelJson[i].YEAR,
          WEEKNO: uploadExcelJson[i].WEEKNO,
          W1: uploadExcelJson[i].W1,
          W2: uploadExcelJson[i].W2,
          W3: uploadExcelJson[i].W3,
          W4: uploadExcelJson[i].W4,
          W5: uploadExcelJson[i].W5,
          W6: uploadExcelJson[i].W6,
          W7: uploadExcelJson[i].W7,
          W8: uploadExcelJson[i].W8,
          W9: uploadExcelJson[i].W9,
          W10: uploadExcelJson[i].W10,
          W11: uploadExcelJson[i].W11,
          W12: uploadExcelJson[i].W12,
          W13: uploadExcelJson[i].W13,
          W14: uploadExcelJson[i].W14,
          W15: uploadExcelJson[i].W15,
          W16: uploadExcelJson[i].W16,
          W17: uploadExcelJson[i].W17,
          W18: uploadExcelJson[i].W18,
          W19: uploadExcelJson[i].W19,
          W20: uploadExcelJson[i].W20,
          W21: uploadExcelJson[i].W21,
          W22: uploadExcelJson[i].W22,
        })
          .then((response) => {
            console.log(response.data.tk_status);
            if (response.data.tk_status !== "NG") {
              tempjson[i].CHECKSTATUS = "OK";
            } else {
              err_code = 5;
              tempjson[i].CHECKSTATUS = "NG: Lỗi SQL: " + response.data.message;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (err_code === 1) {
        tempjson[i].CHECKSTATUS = "NG:FCST đã tồn tại";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS = "NG: Ngày FCST không được sau ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      } else if (err_code === 5) {
        tempjson[i].CHECKSTATUS = "NG: Giao hàng nhiều hơn PO";
      }
    }
    setisLoading(false);
    let newNotification: NotificationElement = {
      CTR_CD: '002',
      NOTI_ID: -1,
      NOTI_TYPE: "success",
      TITLE: 'Thêm FCST mới',
      CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm forecast mới`, 
      SUBDEPTNAME: "KD",
      MAINDEPTNAME: "KD",
      INS_EMPL: 'NHU1903',
      INS_DATE: '2024-12-30',
      UPD_EMPL: 'NHU1903',
      UPD_DATE: '2024-12-30',
    }  
    if(await f_insert_Notification_Data(newNotification))
    {
      getSocket().emit("notification_panel", newNotification);
    }
    Swal.fire("Thông báo", "Đã hoàn thành check Plan hàng loạt", "success");
    setUploadExcelJSon(tempjson);
  };
  const confirmUpFcstHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn thêm FCST hàng loạt ?",
      text: "Thêm rồi mà sai, sửa là hơi vất đấy",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn thêm!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành thêm", "Đang thêm FCST hàng loạt", "success");
        handle_upFcstHangLoat();
      }
    });
  };
  const confirmCheckFcstHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn check FCST hàng loạt ?",
      text: "Sẽ bắt đầu check FCST hàng loạt",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn check!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành check", "Đang check FCST hàng loạt", "success");
        handle_checkFcstHangLoat();
      }
    });
  };
  const deleteFcst = async () => {
    if (fcstdatatablefilter.current.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < fcstdatatablefilter.current.length; i++) {
        if (fcstdatatablefilter.current[i].EMPL_NO === userData?.EMPL_NO) {
          await generalQuery("delete_fcst", {
            FCST_ID: fcstdatatablefilter.current[i].FCST_ID,
          })
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
                //Swal.fire("Thông báo", "Delete Po thành công", "success");
              } else {
                //Swal.fire("Thông báo", "Update PO thất bại: " +response.data.message , "error");
                err_code = true;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
      if (!err_code) {

        let newNotification: NotificationElement = {
          CTR_CD: '002',
          NOTI_ID: -1,
          NOTI_TYPE: 'warning',
          TITLE: 'Xóa FCST',
          CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã xóa FCST`, 
          SUBDEPTNAME: "KD",
          MAINDEPTNAME: "KD",
          INS_EMPL: 'NHU1903',
          INS_DATE: '2024-12-30',
          UPD_EMPL: 'NHU1903',
          UPD_DATE: '2024-12-30',
        }  
        if(await f_insert_Notification_Data(newNotification))
        {
          getSocket().emit("notification_panel",newNotification);
        }
        Swal.fire(
          "Thông báo",
          "Xóa FCST thành công (chỉ FCST của người đăng nhập)!",
          "success",
        );
      } else {
        Swal.fire("Thông báo", "Có lỗi SQL!", "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 FCST để xóa !", "error");
    }
  };
  const handleConfirmDeleteFcst = () => {
    Swal.fire({
      title: "Chắc chắn muốn xóa FCST đã chọn ?",
      text: "Sẽ chỉ xóa FCST do bạn up lên",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Xóa", "Đang Xóa FCST hàng loạt", "success");
        //checkBP(userData?.EMPL_NO,userData?.MAINDEPTNAME,['KD'], deleteFcst);
        checkBP(userData, ["KD"], ["ALL"], ["ALL"], deleteFcst);
        //deleteFcst();
      }
    });
  };
  const fcstDataAGTable = useMemo(() =>
    <AGTable
      suppressRowClickSelection={false}
      showFilter={true}
      toolbar={
        <>       
         <IconButton
          className="buttonIcon"
          onClick={() => {
            //checkBP(userData?.EMPL_NO,userData?.MAINDEPTNAME,['KD'], handleConfirmDeleteFcst);
            checkBP(
              userData,
              ["KD"],
              ["ALL"],
              ["ALL"],
              handleConfirmDeleteFcst,
            );
            //handleConfirmDeleteFcst();
          }}
        >
          <MdOutlineDelete color="red" size={15} />
          XÓA FCST
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
        </>
      }
      columns={column_fcsttable}
      data={fcstdatatable}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //clickedRow.current = params.data;
        //console.log(e.data) 
      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())
        fcstdatatablefilter.current = params!.api.getSelectedRows();
      }}
    />
    , [fcstdatatable]);
  const fcstDataAGTableExcel = useMemo(() =>
    <AGTable
      suppressRowClickSelection={false}
      showFilter={true}
      toolbar={
        <>       
        </>
      }
      columns={column_excelplan2}
      data={uploadExcelJson}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //clickedRow.current = params.data;
        //console.log(e.data) 
      }} onSelectionChange={(params: any) => {
        //fcstdatatablefilter.current = params!.api.getSelectedRows();
      }}
    />
    , [uploadExcelJson, trigger]);

  useEffect(() => { }, []);
  return (
    <div className="fcstmanager">
     <Tabs className="tabs">
        <TabList className="tablist" style={{backgroundImage: theme.CMS.backgroundImage, color: 'gray'}}>
          <Tab>
            <span className="mininavtext">Tra FCST</span>
          </Tab>
          <Tab>
            <span className="mininavtext">Thêm FCST</span>
          </Tab>
        </TabList>
        <TabPanel>
        <div className="tracuuFcst">
          {showhidesearchdiv && (
            <div className="tracuuFcstform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
              <div className="forminput">
                <div className="forminputcolumn">
                  <label>
                    <b>Từ ngày:</b>
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type="date"
                      value={fromdate.slice(0, 10)}
                      onChange={(e) => setFromDate(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Tới ngày:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
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
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type="text"
                      placeholder="GH63-xxxxxx"
                      value={codeKD}
                      onChange={(e) => setCodeKD(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Code ERP:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type="text"
                      placeholder="7C123xxx"
                      value={codeCMS}
                      onChange={(e) => setCodeCMS(e.target.value)}
                    ></input>
                  </label>
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b>Tên nhân viên:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type="text"
                      placeholder="Trang"
                      value={empl_name}
                      onChange={(e) => setEmpl_Name(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Khách:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type="text"
                      placeholder="SEVT"
                      value={cust_name}
                      onChange={(e) => setCust_Name(e.target.value)}
                    ></input>
                  </label>
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b>Loại sản phẩm:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type="text"
                      placeholder="TSP"
                      value={prod_type}
                      onChange={(e) => setProdType(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>ID:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type="text"
                      placeholder="12345"
                      value={id}
                      onChange={(e) => setID(e.target.value)}
                    ></input>
                  </label>
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b>PO NO:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type="text"
                      placeholder="123abc"
                      value={po_no}
                      onChange={(e) => setPo_No(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Vật liệu:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type="text"
                      placeholder="SJ-203020HC"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                    ></input>
                  </label>
                </div>
                <div className="forminputcolumn">
                  <label>
                    <b>Over/OK:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type="text"
                      placeholder="OVER"
                      value={over}
                      onChange={(e) => setOver(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Invoice No:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type="text"
                      placeholder="số invoice"
                      value={invoice_no}
                      onChange={(e) => setInvoice_No(e.target.value)}
                    ></input>
                  </label>
                </div>
              </div>
              <div className="formbutton">
                <label>
                  <b style={{fontSize: '0.6rem'}}>All Time:</b>
                  <input
                    onKeyDown={(e) => {
                      handleSearchCodeKeyDown(e);
                    }}
                    type="checkbox"
                    name="alltimecheckbox"
                    defaultChecked={alltime}
                    onChange={() => setAllTime(!alltime)}
                  ></input>
                </label>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    handletraFcst();
                  }}
                >
                  <FcSearch color="green" size={30} />
                  Search
                </IconButton>
              </div>
            </div>
          )}
          <div className="tracuuFcstTable" style={{ backgroundImage: theme.CMS.backgroundImage }}>
            {fcstDataAGTable}            
          </div>
        </div>
        </TabPanel>
        <TabPanel>
        <div className="newfcst">
          <div className="batchnewplan">
            <h3>Thêm FCST Hàng Loạt</h3>
            <form className="formupload">
              <label htmlFor="upload">
                <b>Chọn file Excel: </b>
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  className="selectfilebutton"
                  type="file"
                  name="upload"
                  id="upload"
                  onChange={(e: any) => {
                    readUploadFile(e);
                  }}
                />
              </label>
              <div
                className="checkpobutton"
                onClick={(e) => {
                  e.preventDefault();
                  confirmCheckFcstHangLoat();
                }}
              >
                Check FCST
              </div>
              <div
                className="uppobutton"
                onClick={(e) => {
                  e.preventDefault();
                  confirmUpFcstHangLoat();
                }}
              >
                Up FCST
              </div>
            </form>
            <div className="insertPlanTable">
              {fcstDataAGTableExcel}              
            </div>
          </div>
        </div>
        </TabPanel>
      </Tabs> 
    </div>
  );
};
export default FCSTManager;
