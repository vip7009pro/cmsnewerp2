import { IconButton } from "@mui/material";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Swal from "sweetalert2";
import "./KHOTPNEW.scss";
import { generalQuery, getAuditMode, getUserData } from "../../../api/Api";
import { checkBP } from "../../../api/GlobalFunction";
import PivotTable from "../../../components/PivotChart/PivotChart";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import {
  KTP_IN,
  KTP_OUT,
  STOCK_G_CODE,
  STOCK_G_NAME_KD,
  STOCK_PROD_REQUEST_NO,
} from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { MdOutlinePivotTableChart } from "react-icons/md";

const KHOTPNEW = () => {
  const dataGridRef = useRef<any>(null);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const columnKTP_IN = [
    { field: 'IN_DATE', headerName: 'IN_DATE', resizable: true, width: 70 },
    { field: 'FACTORY', headerName: 'FACTORY', resizable: true, width: 50 },
    { field: 'AUTO_ID', headerName: 'AUTO_ID', resizable: true, width: 50 },
    { field: 'INSPECT_OUTPUT_ID', headerName: 'INSPECT_OUTPUT_ID', resizable: true, width: 100 },
    { field: 'PACK_ID', headerName: 'PACK_ID', resizable: true, width: 60 },
    { field: 'EMPL_NAME', headerName: 'EMPL_NAME', resizable: true, width: 100 },
    { field: 'PROD_REQUEST_NO', headerName: 'PROD_REQUEST_NO', resizable: true, width: 100 },
    { field: 'CUST_NAME_KD', headerName: 'CUST_NAME_KD', resizable: true, width: 100 },
    { field: 'G_CODE', headerName: 'G_CODE', resizable: true, width: 70 },
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', resizable: true, width: 80 },
    { field: 'G_NAME', headerName: 'G_NAME', resizable: true, width: 150 },
    { field: 'PROD_TYPE', headerName: 'PROD_TYPE', resizable: true, width: 70 },
    { field: 'PLAN_ID', headerName: 'PLAN_ID', resizable: true, width: 70 },
    { field: 'IN_QTY', headerName: 'IN_QTY', resizable: true, width: 70, cellRenderer: (params: any) => {
      return <span style={{color: params.data.USE_YN !=='DA GIAO' ? 'green' : 'red', fontWeight:'bold'}}>{params.value.toLocaleString('en-US')}</span>
    } },
    { field: 'USE_YN', headerName: 'USE_YN', resizable: true, width: 80 },
    { field: 'EMPL_GIAO', headerName: 'EMPL_GIAO', resizable: true, width: 70 },
    { field: 'EMPL_NHAN', headerName: 'EMPL_NHAN', resizable: true, width: 70 },
    { field: 'INS_DATE', headerName: 'INS_DATE', resizable: true, width: 70 },
    { field: 'INS_EMPL', headerName: 'INS_EMPL', resizable: true, width: 70 },
    { field: 'UPD_DATE', headerName: 'UPD_DATE', resizable: true, width: 70 },
    { field: 'UPD_EMPL', headerName: 'UPD_EMPL', resizable: true, width: 70 },
    { field: 'STATUS', headerName: 'STATUS', resizable: true, width: 60 },
    { field: 'REMARK', headerName: 'REMARK', resizable: true, width: 50 }
  ]
  const columnKTP_OUT = [
    { field: 'OUT_DATE', headerName: 'OUT_DATE', resizable: true, width: 100, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'FACTORY', headerName: 'FACTORY', resizable: true, width: 60 },
    { field: 'AUTO_ID', headerName: 'AUTO_ID', resizable: true, width: 50 },
    { field: 'INSPECT_OUTPUT_ID', headerName: 'INSP_OUT_ID', resizable: true, width: 70 },
    { field: 'PACK_ID', headerName: 'PACK_ID', resizable: true, width: 50 },
    { field: 'EMPL_NAME', headerName: 'EMPL_NAME', resizable: true, width: 100 },
    { field: 'PROD_REQUEST_NO', headerName: 'PROD_REQUEST_NO', resizable: true, width: 100 },
    { field: 'G_CODE', headerName: 'G_CODE', resizable: true, width: 50 },
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', resizable: true, width: 80 },
    { field: 'G_NAME', headerName: 'G_NAME', resizable: true, width: 150 },
    { field: 'PROD_TYPE', headerName: 'PROD_TYPE', resizable: true, width: 60 },
    { field: 'PLAN_ID', headerName: 'PLAN_ID', resizable: true, width: 50 },
    { field: 'CUST_CD', headerName: 'CUST_CD', resizable: true, width: 50 },
    { field: 'OUT_QTY', headerName: 'OUT_QTY', resizable: true, width: 50, cellRenderer: (params: any) => {
      return <span style={{color: 'blue', fontWeight:'bold'}}>{params.data.OUT_QTY.toLocaleString('en-US')}</span>
    }  },
    { field: 'CUST_NAME_KD', headerName: 'CUST_NAME_KD', resizable: true, width: 100 },
    { field: 'OUT_TYPE', headerName: 'OUT_TYPE', resizable: true, width: 60},
    { field: 'USE_YN', headerName: 'USE_YN', resizable: true, width: 80 , cellRenderer: (params: any) => {
      return <span style={{color: params.data.USE_YN ==='COMPLETED' ? 'green' : 'red', fontWeight:'bold'}}>{params.value}</span>
    } },
    { field: 'INS_DATE', headerName: 'INS_DATE', resizable: true, width: 70 },
    { field: 'INS_EMPL', headerName: 'INS_EMPL', resizable: true, width: 70 },
    { field: 'UPD_DATE', headerName: 'UPD_DATE', resizable: true, width: 70 },
    { field: 'UPD_EMPL', headerName: 'UPD_EMPL', resizable: true, width: 70 },
    { field: 'STATUS', headerName: 'STATUS', resizable: true, width: 50 },
    { field: 'REMARK', headerName: 'REMARK', resizable: true, width: 60 },
    { field: 'AUTO_ID_IN', headerName: 'ID_IN', resizable: true, width: 50 },
    { field: 'OUT_PRT_SEQ', headerName: 'PRT_SEQ', resizable: true, width: 50 },
    { field: 'PO_NO', headerName: 'PO_NO', resizable: true, width: 50 }
  ]
  const columnSTOCKFULL = [
    { field: 'IN_DATE', headerName: 'IN_DATE', resizable: true, width: 70 },
    { field: 'FACTORY', headerName: 'FACTORY', resizable: true, width: 50 },
    { field: 'AUTO_ID', headerName: 'AUTO_ID', resizable: true, width: 50 },
    { field: 'INSPECT_OUTPUT_ID', headerName: 'INSPECT_OUTPUT_ID', resizable: true, width: 100 },
    { field: 'PACK_ID', headerName: 'PACK_ID', resizable: true, width: 60 },
    { field: 'EMPL_NAME', headerName: 'EMPL_NAME', resizable: true, width: 100 },
    { field: 'PROD_REQUEST_NO', headerName: 'PROD_REQUEST_NO', resizable: true, width: 100 },
    { field: 'CUST_NAME_KD', headerName: 'CUST_NAME_KD', resizable: true, width: 100 },
    { field: 'G_CODE', headerName: 'G_CODE', resizable: true, width: 70 },
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', resizable: true, width: 80 },
    { field: 'G_NAME', headerName: 'G_NAME', resizable: true, width: 150 },
    { field: 'PROD_TYPE', headerName: 'PROD_TYPE', resizable: true, width: 70 },
    { field: 'PLAN_ID', headerName: 'PLAN_ID', resizable: true, width: 70 },
    { field: 'IN_QTY', headerName: 'IN_QTY', resizable: true, width: 70, cellRenderer: (params: any) => {
      return <span style={{color: params.data.USE_YN !=='DA GIAO' ? 'green' : 'red', fontWeight:'bold'}}>{params.value.toLocaleString('en-US')}</span>
    } },
    { field: 'USE_YN', headerName: 'USE_YN', resizable: true, width: 80 },
    { field: 'EMPL_GIAO', headerName: 'EMPL_GIAO', resizable: true, width: 70 },
    { field: 'EMPL_NHAN', headerName: 'EMPL_NHAN', resizable: true, width: 70 },
    { field: 'INS_DATE', headerName: 'INS_DATE', resizable: true, width: 70 },
    { field: 'INS_EMPL', headerName: 'INS_EMPL', resizable: true, width: 70 },
    { field: 'UPD_DATE', headerName: 'UPD_DATE', resizable: true, width: 70 },
    { field: 'UPD_EMPL', headerName: 'UPD_EMPL', resizable: true, width: 70 },
    { field: 'STATUS', headerName: 'STATUS', resizable: true, width: 60 },
    { field: 'REMARK', headerName: 'REMARK', resizable: true, width: 50 }
  ]
  const columnSTOCKG_CODE = [
    { field: 'G_CODE', headerName: 'G_CODE', resizable: true, width: 100 },
    { field: 'G_NAME', headerName: 'G_NAME', resizable: true, width: 200 },
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', resizable: true, width: 200 },
    { field: 'PROD_TYPE', headerName: 'PROD_TYPE', resizable: true, width: 100 },
    { field: 'STOCK', headerName: 'STOCK', resizable: true, width: 100, cellRenderer: (params: any) => {
      return <span style={{color:'green', fontWeight:'bold'}}>{params.value.toLocaleString('en-US')}</span>
    } },
    { field: 'BLOCK_QTY', headerName: 'BLOCK_QTY', resizable: true, width: 100, cellRenderer: (params: any) => {
      return <span style={{color:'red', fontWeight:'bold'}}>{params.value.toLocaleString('en-US')}</span>
    } },
    { field: 'TOTAL_STOCK', headerName: 'TOTAL_STOCK', resizable: true, width: 100, cellRenderer: (params: any) => {
      return <span style={{color:'blue', fontWeight:'bold'}}>{params.value.toLocaleString('en-US')}</span>
    } }

  ]
  const columnSTOCKG_NAME_KD = [
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', resizable: true, width: 60 },
    { field: 'STOCK', headerName: 'STOCK', resizable: true, width: 100, cellRenderer: (params: any) => {
      return <span style={{color:'green', fontWeight:'bold'}}>{params.value.toLocaleString('en-US')}</span>
    } },
    { field: 'BLOCK_QTY', headerName: 'BLOCK_QTY', resizable: true, width: 100, cellRenderer: (params: any) => {
      return <span style={{color:'red', fontWeight:'bold'}}>{params.value.toLocaleString('en-US')}</span>
    } },
    { field: 'TOTAL_STOCK', headerName: 'TOTAL_STOCK', resizable: true, width: 100, cellRenderer: (params: any) => {
      return <span style={{color:'blue', fontWeight:'bold'}}>{params.value.toLocaleString('en-US')}</span>
    } }

  ]
  const columnSTOCK_YCSX = [
    { field: 'CUST_NAME_KD', headerName: 'CUST_NAME_KD', resizable: true, width: 100 },
    { field: 'PROD_REQUEST_NO', headerName: 'PROD_REQUEST_NO', resizable: true, width: 100 },
    { field: 'G_CODE', headerName: 'G_CODE', resizable: true, width: 60 },
    { field: 'G_NAME', headerName: 'G_NAME', resizable: true, width: 150 },
    { field: 'G_NAME_KD', headerName: 'G_NAME_KD', resizable: true, width: 80 },
    { field: 'PROD_TYPE', headerName: 'PROD_TYPE', resizable: true, width: 60 },
    { field: 'STOCK', headerName: 'STOCK', resizable: true, width: 100, cellRenderer: (params: any) => {
      return <span style={{color:'green', fontWeight:'bold'}}>{params.value.toLocaleString('en-US')}</span>
    } },
    { field: 'BLOCK_QTY', headerName: 'BLOCK_QTY', resizable: true, width: 100, cellRenderer: (params: any) => {
      return <span style={{color:'red', fontWeight:'bold'}}>{params.value.toLocaleString('en-US')}</span>
    } },
    { field: 'TOTAL_STOCK', headerName: 'TOTAL_STOCK', resizable: true, width: 100, cellRenderer: (params: any) => {
      return <span style={{color:'blue', fontWeight:'bold'}}>{params.value.toLocaleString('en-US')}</span>
    } }
  ] 
  const [columns, setColumns] = useState<Array<any>>(columnKTP_IN);
  const [whDataTable, setWhDataTable] = useState<any>([]);
  const [fromdate, setFromDate] = useState(moment.utc().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [factory, setFactory] = useState("ALL");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [custName, setCustName] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [plxk, setPLXK] = useState("ALL");
  const [kdEmpl, setKDEMPL] = useState("");
  const [prod_type, setProdType] = useState("ALL");
  const [buttonselected, setbuttonselected] = useState("GR");
  const [trigger, setTrigger] = useState(false);
  const selectedOUTRow = useRef<KTP_OUT[]>([]);

  const ktp_in_fields: any = [
    {
      caption: "IN_DATE",
      width: 80,
      dataField: "IN_DATE",
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
      caption: "PROD_TYPE",
      width: 80,
      dataField: "PROD_TYPE",
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
      caption: "AUTO_ID",
      width: 80,
      dataField: "AUTO_ID",
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
      caption: "INSPECT_OUTPUT_ID",
      width: 80,
      dataField: "INSPECT_OUTPUT_ID",
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
      caption: "PACK_ID",
      width: 80,
      dataField: "PACK_ID",
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
      caption: "EMPL_NAME",
      width: 80,
      dataField: "EMPL_NAME",
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
      caption: "CUST_NAME_KD",
      width: 80,
      dataField: "CUST_NAME_KD",
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
      caption: "IN_QTY",
      width: 80,
      dataField: "IN_QTY",
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
      caption: "USE_YN",
      width: 80,
      dataField: "USE_YN",
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
      caption: "EMPL_GIAO",
      width: 80,
      dataField: "EMPL_GIAO",
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
      caption: "EMPL_NHAN",
      width: 80,
      dataField: "EMPL_NHAN",
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
      caption: "INS_DATE",
      width: 80,
      dataField: "INS_DATE",
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
      caption: "UPD_DATE",
      width: 80,
      dataField: "UPD_DATE",
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
      caption: "UPD_EMPL",
      width: 80,
      dataField: "UPD_EMPL",
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
      caption: "STATUS",
      width: 80,
      dataField: "STATUS",
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
  const ktp_out_fields: any = [
    {
      caption: "OUT_DATE",
      width: 80,
      dataField: "OUT_DATE",
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
      caption: "PROD_TYPE",
      width: 80,
      dataField: "PROD_TYPE",
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
      caption: "PO_NO",
      width: 80,
      dataField: "PO_NO",
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
      caption: "AUTO_ID",
      width: 80,
      dataField: "AUTO_ID",
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
      caption: "INSPECT_OUTPUT_ID",
      width: 80,
      dataField: "INSPECT_OUTPUT_ID",
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
      caption: "PACK_ID",
      width: 80,
      dataField: "PACK_ID",
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
      caption: "EMPL_NAME",
      width: 80,
      dataField: "EMPL_NAME",
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
      caption: "CUST_CD",
      width: 80,
      dataField: "CUST_CD",
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
      caption: "OUT_QTY",
      width: 80,
      dataField: "OUT_QTY",
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
      caption: "CUST_NAME_KD",
      width: 80,
      dataField: "CUST_NAME_KD",
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
      caption: "OUT_TYPE",
      width: 80,
      dataField: "OUT_TYPE",
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
      caption: "USE_YN",
      width: 80,
      dataField: "USE_YN",
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
      caption: "INS_DATE",
      width: 80,
      dataField: "INS_DATE",
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
      caption: "UPD_DATE",
      width: 80,
      dataField: "UPD_DATE",
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
      caption: "UPD_EMPL",
      width: 80,
      dataField: "UPD_EMPL",
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
      caption: "STATUS",
      width: 80,
      dataField: "STATUS",
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
    {
      caption: "AUTO_ID_IN",
      width: 80,
      dataField: "AUTO_ID_IN",
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
      caption: "OUT_PRT_SEQ",
      width: 80,
      dataField: "OUT_PRT_SEQ",
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

  const [selectedDataSource, setSelectedDataSource] =
    useState<PivotGridDataSource>(
      new PivotGridDataSource({
        fields: ktp_in_fields,
        store: whDataTable,
      }),
    );

  const clearSelection = () => {
    if (dataGridRef.current) {
      dataGridRef.current.instance.clearSelection();
      selectedOUTRow.current = [];
      console.log(dataGridRef.current);
    }
  };
  const loadKTP_IN = () => {
    generalQuery("loadKTP_IN", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      OUT_TYPE: plxk,
      FACTORY: factory,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      PROD_TYPE: prod_type,
      PROD_REQUEST_NO: prodrequestno,
      KD_EMPL_NAME: kdEmpl,
      CUST_NAME_KD: custName,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: KTP_IN, index: number) => {
              return {
                ...element,
                IN_DATE: moment.utc(element.IN_DATE).format("YYYY-MM-DD"),
                INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD"),
                UPD_DATE:
                  element.UPD_DATE !== null
                    ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD")
                    : "",
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          
          setWhDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          
          setWhDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadKTP_OUT = () => {
    generalQuery("loadKTP_OUT", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      OUT_TYPE: plxk,
      FACTORY: factory,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      PROD_TYPE: prod_type,
      PROD_REQUEST_NO: prodrequestno,
      KD_EMPL_NAME: kdEmpl,
      CUST_NAME_KD: custName,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: KTP_OUT, index: number) => {
              return {
                ...element,
                OUT_DATE: moment.utc(element.OUT_DATE).format("YYYY-MM-DD"),
                INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD"),
                UPD_DATE:
                  element.UPD_DATE !== null
                    ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD")
                    : "",
                id: index,
              };
            },
          );
          //console.log(loadeddata);
         
          setWhDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          
          setWhDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadSTOCKFULL = () => {
    generalQuery("loadStockFull", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      OUT_TYPE: plxk,
      FACTORY: factory,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      PROD_TYPE: prod_type,
      PROD_REQUEST_NO: prodrequestno,
      KD_EMPL_NAME: kdEmpl,
      CUST_NAME_KD: custName,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: KTP_IN, index: number) => {
              return {
                ...element,
                IN_DATE: moment.utc(element.IN_DATE).format("YYYY-MM-DD"),
                INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD"),
                UPD_DATE:
                  element.UPD_DATE !== null
                    ? moment.utc(element.UPD_DATE).format("YYYY-MM-DD")
                    : "",
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          
          setWhDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          );
        } else {
         
          setWhDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadSTOCK_G_CODE = () => {
    generalQuery("loadSTOCKG_CODE", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      OUT_TYPE: plxk,
      FACTORY: factory,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      PROD_TYPE: prod_type,
      PROD_REQUEST_NO: prodrequestno,
      KD_EMPL_NAME: kdEmpl,
      CUST_NAME_KD: custName,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: STOCK_G_CODE, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          
          setWhDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          
          setWhDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadSTOCK_G_NAME_KD = () => {
    generalQuery("loadSTOCKG_NAME_KD", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      OUT_TYPE: plxk,
      FACTORY: factory,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      PROD_TYPE: prod_type,
      PROD_REQUEST_NO: prodrequestno,
      KD_EMPL_NAME: kdEmpl,
      CUST_NAME_KD: custName,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: STOCK_G_NAME_KD, index: number) => {
              return {
                ...element,          
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME_KD?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          
          setWhDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          );
        } else {
         
          setWhDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadSTOCK_YCSX = () => {
    generalQuery("loadSTOCK_YCSX", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      OUT_TYPE: plxk,
      FACTORY: factory,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      PROD_TYPE: prod_type,
      PROD_REQUEST_NO: prodrequestno,
      KD_EMPL_NAME: kdEmpl,
      CUST_NAME_KD: custName,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: STOCK_PROD_REQUEST_NO, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                id: index,
              };
            },
          );
          //console.log(loadeddata);
         
          setWhDataTable(loadeddata);
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          
          setWhDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };  
  const duyetHuy = async ()=> {
    if(selectedOUTRow.current.length>0)
    {
      for(let i=0;i<selectedOUTRow.current.length;i++)
      {
        //chuyen P -> X, them remark Xuat Huy  O660
        await generalQuery("updatePheDuyetHuyO660", {
          AUTO_ID: selectedOUTRow.current[i].AUTO_ID,
          AUTO_ID_IN: selectedOUTRow.current[i].AUTO_ID_IN
        })
          .then((response) => {            
            if (response.data.tk_status !== "NG") {
              
            } else {
              
            }
          })
          .catch((error) => {
            console.log(error);
          }); 
      }   
      Swal.fire('Thông báo','Duyệt thành công','success');
    }
    else {
      Swal.fire('Thông báo','Chọn ít nhất một dòng để thực hiện','error');
    }
  }
  const cancelHuy = async ()=> {
    if(selectedOUTRow.current.length>0)
    {
      for(let i=0;i<selectedOUTRow.current.length;i++)
      {
        //chuyen P -> X, them remark Xuat Huy  O660
        await generalQuery("cancelPheDuyetHuyO660", {
          AUTO_ID: selectedOUTRow.current[i].AUTO_ID,
          AUTO_ID_IN: selectedOUTRow.current[i].AUTO_ID_IN
        })
          .then((response) => {            
            if (response.data.tk_status !== "NG") {
              
            } else {
              
            }
          })
          .catch((error) => {
            console.log(error);
          }); 
      }   
      Swal.fire('Thông báo','Hủy xuất thành công','success');         
    }
    else {
      Swal.fire('Thông báo','Chọn ít nhất một dòng để thực hiện');
    }
  }
  const whAGTable = React.useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        toolbar={
          <div>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowHidePivotTable(!showhidePivotTable);
              }}
            >
              <MdOutlinePivotTableChart color="#ff33bb" size={15} />
              Pivot
            </IconButton>
          </div>}
        columns={columns}
        data={whDataTable}
        onCellEditingStopped={(params: any) => {
          //console.log(e.data)
        }} onRowClick={(params: any) => {
          //console.log(e.data) 
        }} onSelectionChange={(params: any) => {
          //console.log(params)
          //setSelectedRows(params!.api.getSelectedRows()[0]);
          //console.log(e!.api.getSelectedRows())
          selectedOUTRow.current = params!.api.getSelectedRows();
        }}
      />
    )
  }, [whDataTable, columns])
  useEffect(() => {
    //loadKTP_IN();
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className="khotpnew">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform">
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>From date:</b>
                <input
                  onKeyDown={(e) => {}}
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>To date:</b>
                <input
                  onKeyDown={(e) => {}}
                  type="date"
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>

              <label>
                <b>PL xuất Kho:</b>{" "}
                <select
                  name="vendor"
                  value={plxk}
                  onChange={(e) => {
                    setPLXK(e.target.value);
                  }}
                >
                  <option value="ALL">ALL</option>
                  <option value="N">NORMAL</option>
                  <option value="F">FREE</option>
                  <option value="L">THAY LOT</option>
                  <option value="D">XUẤT HỦY</option>
                  <option value="O">KHÁC</option>
                </select>
              </label>
            </div>

            <div className="forminputcolumn">
              <label>
                <b>Nhà máy:</b>{" "}
                <select
                  name="vendor"
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
                <b>Tên sản phẩm:</b>{" "}
                <input
                  type="text"
                  placeholder="Tên sản phẩm"
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Code ERP:</b>{" "}
                <input
                  type="text"
                  placeholder="Code ERP"
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                ></input>
              </label>
              <label>
                <b>PL sản phẩm:</b>
                <select
                  name="phanloaisanpham"
                  value={prod_type}
                  onChange={(e) => {
                    setProdType(e.target.value);
                  }}
                >
                  <option value="ALL">ALL</option>
                  <option value="TSP">TSP</option>
                  <option value="OLED">OLED</option>
                  <option value="UV">UV</option>
                  <option value="TAPE">TAPE</option>
                  <option value="LABEL">LABEL</option>
                  <option value="RIBBON">RIBBON</option>
                  <option value="SPT">SPT</option>
                </select>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>YCSX:</b>{" "}
                <input
                  type="text"
                  placeholder="YCSX"
                  value={prodrequestno}
                  onChange={(e) => setProdRequestNo(e.target.value)}
                ></input>
              </label>
              <label>
                <b>NV KD:</b>{" "}
                <input
                  type="text"
                  placeholder="Tên nhân viên kinh doanh"
                  value={kdEmpl}
                  onChange={(e) => setKDEMPL(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Khách hàng:</b>{" "}
                <input
                  type="text"
                  placeholder="Khách hàng"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                ></input>
              </label>
              <label>
                <b>CHỌN:</b>
                <select
                  name="phanloaisanpham"
                  value={buttonselected}
                  onChange={(e) => {
                    setbuttonselected(e.target.value);
                    switch (e.target.value) {
                      case "GR":
                        setColumns(columnKTP_IN);
                        setWhDataTable([]);
                        break;
                      case "GI":
                        setColumns(columnKTP_OUT);
                        setWhDataTable([]);
                        break;
                      case "STOCKFULL":
                        setColumns(columnSTOCKFULL);  
                        setWhDataTable([]);
                        break;
                      case "STOCKG_CODE":
                        setColumns(columnSTOCKG_CODE);
                        setWhDataTable([]);
                        break;
                      case "STOCKG_NAME_KD":
                        setColumns(columnSTOCKG_NAME_KD);
                        setWhDataTable([]);
                        break;
                      case "STOCK_YCSX":
                        setColumns(columnSTOCK_YCSX);
                        setWhDataTable([]);
                        break;
                      default:
                        setColumns(columnKTP_IN);
                        setWhDataTable([]);
                        break;
                    } 
                  }}
                >
                  <option value="GR">Nhập Kho</option>
                  <option value="GI">Xuất Kho</option>
                  <option value="STOCKFULL">Tồn chi tiết</option>
                  <option value="STOCKG_CODE">Tồn theo G_CODE</option>
                  <option value="STOCKG_NAME_KD">Tồn theo Code KD</option>
                  <option value="STOCK_YCSX">Tồn theo YCSX</option>
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
                defaultChecked={alltime}
                onChange={() => setAllTime(!alltime)}
              ></input>
            </label>
            <button
              className="tranhatky"
              onClick={() => {
                switch (buttonselected) {
                  case "GR":
                    loadKTP_IN();
                    setSelectedDataSource(
                      new PivotGridDataSource({
                        fields: ktp_in_fields,
                        store: whDataTable,
                      }),
                    );
                    break;
                  case "GI":
                    loadKTP_OUT();
                    setSelectedDataSource(
                      new PivotGridDataSource({
                        fields: ktp_out_fields,
                        store: whDataTable,
                      }),
                    );
                    break;
                  case "STOCKFULL":
                    loadSTOCKFULL();
                    setSelectedDataSource(
                      new PivotGridDataSource({
                        fields: ktp_in_fields,
                        store: whDataTable,
                      }),
                    );
                    break;
                  case "STOCKG_CODE":
                    loadSTOCK_G_CODE();
                    break;
                  case "STOCKG_NAME_KD":
                    loadSTOCK_G_NAME_KD();
                    break;
                  case "STOCK_YCSX":
                    loadSTOCK_YCSX();
                    break;
                }
                setTrigger(!trigger);
                clearSelection();
              }}
            >
              Search
            </button>
            <button
              className="tranhatky"
              onClick={() => {
                switch (buttonselected) {
                  case "GR":

                    break;
                  case "GI":
                    Swal.fire({
                      title: "Duyệt hủy hàng",
                      text: "Chắc chắn muốn phê duyệt hủy hàng ?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Vẫn duyệt!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        checkBP(getUserData(), ["Korean"], ["ALL"], ["ALL"], () => {
                          duyetHuy();  
                        })
                      }
                    });                    

                    break;
                  case "STOCKFULL":
                    
                    break;
                  case "STOCKG_CODE":
                    
                    break;
                  case "STOCKG_NAME_KD":
                    
                    break;
                  case "STOCK_YCSX":
                    
                    break;
                }
                setTrigger(!trigger);
              }}
            >
              Duyệt hủy
            </button>
            <button
              className="tranhatky"
              onClick={() => {
                switch (buttonselected) {
                  case "GR":

                    break;
                  case "GI":
                    Swal.fire({
                      title: "Cancel hủy hàng",
                      text: "Chắc chắn muốn cancel hủy hàng ?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Vẫn cancel!",
                    }).then((result) => {
                      if (result.isConfirmed) {   
                        checkBP(getUserData(), ["Korean"], ["ALL"], ["ALL"], () => {
                          cancelHuy();
                        }) 
                      }
                    }); 
                    
                    break;
                  case "STOCKFULL":
                    
                    break;
                  case "STOCKG_CODE":
                    
                    break;
                  case "STOCKG_NAME_KD":
                    
                    break;
                  case "STOCK_YCSX":
                    
                    break;
                }
                setTrigger(!trigger);
              }}
            >
              Cancel hủy
            </button>
          </div>
        </div>       
        {whAGTable}
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
              tableID="invoicetablepivot"
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default KHOTPNEW;
