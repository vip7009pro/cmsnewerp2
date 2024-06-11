import { IconButton, LinearProgress } from "@mui/material";
import moment from "moment";
import { useCallback, useContext, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { FcSearch } from "react-icons/fc";
import { AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getCompany } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { SaveExcel } from "../../../api/GlobalFunction";
import "./POandStockFull.scss";
import INSPECTION from "../../qc/inspection/INSPECTION";
import KHOTP from "../../kho/khotp/KHOTP";
import KHOLIEU from "../../kho/kholieu/KHOLIEU";
import KHOTPNEW from "../../kho/khotp_new/KHOTPNEW";
import { POFullCMS, POFullSummary } from "../../../api/GlobalInterface";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
/* import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css"; */
const POandStockFull = () => {
  const [pofullSummary, setPOFullSummary] = useState<POFullSummary>({
    PO_BALANCE: 0,
    TP: 0,
    BTP: 0,
    CK: 0,
    BLOCK: 0,
    TONG_TON: 0,
    THUATHIEU: 0,
  });
  const [selection, setSelection] = useState<any>({
    trapo: true,
    thempohangloat: false,
    them1po: false,
    them1invoice: false,
    testinvoicetable: false,
    kholieu: false,
  });
  const [isLoading, setisLoading] = useState(false);
  const [codeCMS, setCodeCMS] = useState("");
  const [alltime, setAllTime] = useState(true);
  const [pofulldatatable, setPOFULLDataTable] = useState<Array<any>>([]);
  /* const column_codeCMS = [
    { field: "id", headerName: "No", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 150 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 170 },
    {
      field: "PO_QTY",
      cellDataType: "number",
      headerName: "PO_QTY",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.PO_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TOTAL_DELIVERED",
      cellDataType: "number",
      headerName: "TOTAL_DELIVERED",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.TOTAL_DELIVERED.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "PO_BALANCE",
      cellDataType: "number",
      headerName: "PO_BALANCE",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.PO_BALANCE.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_KIEM",
      cellDataType: "number",
      headerName: "CHO_KIEM",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.CHO_KIEM.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_CS_CHECK",
      cellDataType: "number",
      headerName: "CS",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.CHO_CS_CHECK.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_KIEM_RMA",
      cellDataType: "number",
      headerName: "RMA",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.CHO_KIEM_RMA.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TONG_TON_KIEM",
      cellDataType: "number",
      headerName: "Total TKiem",
      width: 110,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.row.TONG_TON_KIEM.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BTP",
      cellDataType: "number",
      headerName: "BTP",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.row.BTP.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_TP",
      cellDataType: "number",
      headerName: "TON_TP",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.row.TON_TP.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BLOCK_QTY",
      cellDataType: "number",
      headerName: "BLOCK_QTY",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.BLOCK_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "GRAND_TOTAL_STOCK",
      headerName: "GRAND_TOTAL_STOCK",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.row.GRAND_TOTAL_STOCK.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "THUA_THIEU",
      cellDataType: "number",
      headerName: "THUA_THIEU",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.row.THUA_THIEU.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "YCSX_BALANCE",
      cellDataType: "number",
      headerName: "YCSX_BALANCE",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.YCSX_BALANCE?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "YCSX_QTY",
      cellDataType: "number",
      headerName: "YCSX_QTY",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#767676" }}>
            <b>{params.row.YCSX_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "KETQUASX",
      cellDataType: "number",
      headerName: "KETQUASX",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#767676" }}>
            <b>{params.row.KETQUASX?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "NHAPKHO",
      cellDataType: "number",
      headerName: "NHAPKHO",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#767676" }}>
            <b>{params.row.NHAPKHO?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
  ];
  const column_codeERP_PVN = [
    { field: "id", headerName: "No", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 150 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 170 },
    {
      field: "M_7",
      cellDataType: "number",
      headerName: "M_7",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            {params.row?.M_7?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "M_6",
      cellDataType: "number",
      headerName: "M_6",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            {params.row?.M_6?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "M_5",
      cellDataType: "number",
      headerName: "M_5",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            {params.row?.M_5?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "M_4",
      cellDataType: "number",
      headerName: "M_4",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            {params.row?.M_4?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "M_3",
      cellDataType: "number",
      headerName: "M_3",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            {params.row?.M_3?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "M_2",
      cellDataType: "number",
      headerName: "M_2",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            {params.row?.M_2?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "M_1",
      cellDataType: "number",
      headerName: "M_1",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            {params.row?.M_1?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "PO_QTY",
      cellDataType: "number",
      headerName: "PO_QTY",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.PO_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TOTAL_DELIVERED",
      cellDataType: "number",
      headerName: "TOTAL_DELIVERED",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.TOTAL_DELIVERED.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "PO_BALANCE",
      cellDataType: "number",
      headerName: "PO_BALANCE",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.PO_BALANCE.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_KIEM",
      cellDataType: "number",
      headerName: "CHO_KIEM",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.CHO_KIEM.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_CS_CHECK",
      cellDataType: "number",
      headerName: "CS",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.CHO_CS_CHECK.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_KIEM_RMA",
      cellDataType: "number",
      headerName: "RMA",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.CHO_KIEM_RMA.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TONG_TON_KIEM",
      cellDataType: "number",
      headerName: "Total TKiem",
      width: 110,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.row.TONG_TON_KIEM.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BTP",
      cellDataType: "number",
      headerName: "BTP",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.row.BTP.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_TP",
      cellDataType: "number",
      headerName: "TON_TP",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.row.TON_TP.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BLOCK_QTY",
      cellDataType: "number",
      headerName: "BLOCK_QTY",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.BLOCK_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "GRAND_TOTAL_STOCK",
      headerName: "GRAND_TOTAL_STOCK",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.row.GRAND_TOTAL_STOCK.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "THUA_THIEU",
      cellDataType: "number",
      headerName: "THUA_THIEU",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.row.THUA_THIEU.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "YCSX_BALANCE",
      cellDataType: "number",
      headerName: "YCSX_BALANCE",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.YCSX_BALANCE?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "YCSX_QTY",
      cellDataType: "number",
      headerName: "YCSX_QTY",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#767676" }}>
            <b>{params.row.YCSX_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "KETQUASX",
      cellDataType: "number",
      headerName: "KETQUASX",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#767676" }}>
            <b>{params.row.KETQUASX?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "NHAPKHO",
      cellDataType: "number",
      headerName: "NHAPKHO",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#767676" }}>
            <b>{params.row.NHAPKHO?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
  ];
  const column_codeKD = [
    { field: "id", headerName: "No", width: 80 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 170 },
    {
      field: "PO_QTY",
      cellDataType: "number",
      headerName: "PO_QTY",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.PO_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TOTAL_DELIVERED",
      cellDataType: "number",
      headerName: "TOTAL_DELIVERED",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.TOTAL_DELIVERED.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "PO_BALANCE",
      cellDataType: "number",
      headerName: "PO_BALANCE",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.PO_BALANCE.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_KIEM",
      cellDataType: "number",
      headerName: "CHO_KIEM",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.CHO_KIEM.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_CS_CHECK",
      cellDataType: "number",
      headerName: "CHO_CS_CHECK",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.CHO_CS_CHECK.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_KIEM_RMA",
      cellDataType: "number",
      headerName: "CHO_KIEM_RMA",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.CHO_KIEM_RMA.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TONG_TON_KIEM",
      cellDataType: "number",
      headerName: "Total TKiem",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.row.TONG_TON_KIEM.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BTP",
      cellDataType: "number",
      headerName: "BTP",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.row.BTP.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_TP",
      cellDataType: "number",
      headerName: "TON_TP",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.row.TON_TP.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BLOCK_QTY",
      cellDataType: "number",
      headerName: "BLOCK_QTY",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.BLOCK_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "GRAND_TOTAL_STOCK",
      cellDataType: "number",
      headerName: "GRAND_TOTAL_STOCK",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.row.GRAND_TOTAL_STOCK.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "THUA_THIEU",
      cellDataType: "number",
      headerName: "THUA_THIEU",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.THUA_THIEU.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
  ]; */
  const column_codeERP_PVN2 = [
    { field: "id", headerName: "No", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 150 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 170 },
    {
      field: "M_7",
      cellDataType: "number",
      headerName: "M_7",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            {params.data?.M_7?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "M_6",
      cellDataType: "number",
      headerName: "M_6",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            {params.data?.M_6?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "M_5",
      cellDataType: "number",
      headerName: "M_5",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            {params.data?.M_5?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "M_4",
      cellDataType: "number",
      headerName: "M_4",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            {params.data?.M_4?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "M_3",
      cellDataType: "number",
      headerName: "M_3",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            {params.data?.M_3?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "M_2",
      cellDataType: "number",
      headerName: "M_2",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            {params.data?.M_2?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "M_1",
      cellDataType: "number",
      headerName: "M_1",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            {params.data?.M_1?.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "PO_QTY",
      cellDataType: "number",
      headerName: "PO_QTY",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.PO_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TOTAL_DELIVERED",
      cellDataType: "number",
      headerName: "TOTAL_DELIVERED",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.TOTAL_DELIVERED.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "PO_BALANCE",
      cellDataType: "number",
      headerName: "PO_BALANCE",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.PO_BALANCE.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_KIEM",
      cellDataType: "number",
      headerName: "CHO_KIEM",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CHO_KIEM.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_CS_CHECK",
      cellDataType: "number",
      headerName: "CS",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CHO_CS_CHECK.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_KIEM_RMA",
      cellDataType: "number",
      headerName: "RMA",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CHO_KIEM_RMA.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TONG_TON_KIEM",
      cellDataType: "number",
      headerName: "Total TKiem",
      width: 110,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.data.TONG_TON_KIEM.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BTP",
      cellDataType: "number",
      headerName: "BTP",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.data.BTP.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_TP",
      cellDataType: "number",
      headerName: "TON_TP",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.data.TON_TP.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BLOCK_QTY",
      cellDataType: "number",
      headerName: "BLOCK_QTY",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.BLOCK_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "GRAND_TOTAL_STOCK",
      headerName: "GRAND_TOTAL_STOCK",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.GRAND_TOTAL_STOCK.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "THUA_THIEU",
      cellDataType: "number",
      headerName: "THUA_THIEU",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.data.THUA_THIEU.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "YCSX_BALANCE",
      cellDataType: "number",
      headerName: "YCSX_BALANCE",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.YCSX_BALANCE?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "YCSX_QTY",
      cellDataType: "number",
      headerName: "YCSX_QTY",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#767676" }}>
            <b>{params.data.YCSX_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "KETQUASX",
      cellDataType: "number",
      headerName: "KETQUASX",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#767676" }}>
            <b>{params.data.KETQUASX?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "NHAPKHO",
      cellDataType: "number",
      headerName: "NHAPKHO",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#767676" }}>
            <b>{params.data.NHAPKHO?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
  ];
  const column_codeCMS2 = [
    { field: "id", headerName: "No", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 150 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 170 },
    {
      field: "PO_QTY",
      cellDataType: "number",
      headerName: "PO_QTY",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.PO_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TOTAL_DELIVERED",
      cellDataType: "number",
      headerName: "TOTAL_DELIVERED",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.TOTAL_DELIVERED.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "PO_BALANCE",
      cellDataType: "number",
      headerName: "PO_BALANCE",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.PO_BALANCE.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_KIEM",
      cellDataType: "number",
      headerName: "CHO_KIEM",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CHO_KIEM.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_CS_CHECK",
      cellDataType: "number",
      headerName: "CS",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CHO_CS_CHECK.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_KIEM_RMA",
      cellDataType: "number",
      headerName: "RMA",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CHO_KIEM_RMA.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TONG_TON_KIEM",
      cellDataType: "number",
      headerName: "Total TKiem",
      width: 110,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.data.TONG_TON_KIEM.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BTP",
      cellDataType: "number",
      headerName: "BTP",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.data.BTP.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_TP",
      cellDataType: "number",
      headerName: "TON_TP",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.data.TON_TP.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BLOCK_QTY",
      cellDataType: "number",
      headerName: "BLOCK_QTY",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.BLOCK_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "GRAND_TOTAL_STOCK",
      headerName: "GRAND_TOTAL_STOCK",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.GRAND_TOTAL_STOCK.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "THUA_THIEU",
      cellDataType: "number",
      headerName: "THUA_THIEU",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.data.THUA_THIEU.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "YCSX_BALANCE",
      cellDataType: "number",
      headerName: "YCSX_BALANCE",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.YCSX_BALANCE?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "YCSX_QTY",
      cellDataType: "number",
      headerName: "YCSX_QTY",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#767676" }}>
            <b>{params.data.YCSX_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "KETQUASX",
      cellDataType: "number",
      headerName: "KETQUASX",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#767676" }}>
            <b>{params.data.KETQUASX?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "NHAPKHO",
      cellDataType: "number",
      headerName: "NHAPKHO",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#767676" }}>
            <b>{params.data.NHAPKHO?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
  ];
  const column_codeKD2 = [
    { field: "id", headerName: "No", width: 80 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 170 },
    {
      field: "PO_QTY",
      cellDataType: "number",
      headerName: "PO_QTY",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.PO_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TOTAL_DELIVERED",
      cellDataType: "number",
      headerName: "TOTAL_DELIVERED",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.TOTAL_DELIVERED.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "PO_BALANCE",
      cellDataType: "number",
      headerName: "PO_BALANCE",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.PO_BALANCE.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_KIEM",
      cellDataType: "number",
      headerName: "CHO_KIEM",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CHO_KIEM.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_CS_CHECK",
      cellDataType: "number",
      headerName: "CHO_CS_CHECK",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CHO_CS_CHECK.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_KIEM_RMA",
      cellDataType: "number",
      headerName: "CHO_KIEM_RMA",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.CHO_KIEM_RMA.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TONG_TON_KIEM",
      cellDataType: "number",
      headerName: "Total TKiem",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.data.TONG_TON_KIEM.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BTP",
      cellDataType: "number",
      headerName: "BTP",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.data.BTP.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_TP",
      cellDataType: "number",
      headerName: "TON_TP",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.data.TON_TP.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BLOCK_QTY",
      cellDataType: "number",
      headerName: "BLOCK_QTY",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.BLOCK_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "GRAND_TOTAL_STOCK",
      cellDataType: "number",
      headerName: "GRAND_TOTAL_STOCK",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.GRAND_TOTAL_STOCK.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "THUA_THIEU",
      cellDataType: "number",
      headerName: "THUA_THIEU",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.THUA_THIEU.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
  ];
  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(getCompany() === 'CMS' ? column_codeCMS2 : column_codeERP_PVN2);
  const rowStyle = { backgroundColor: 'transparent', height: '20px' };
  const getRowStyle = (params: any) => {
    return { backgroundColor: 'white', fontSize: '0.6rem' };
    /* if (params.data.M_ID % 2 === 0) {
        return { backgroundColor: 'white', fontSize:'0.6rem'};
    }
    else {
      return { backgroundColor: '#fbfbfb',fontSize:'0.6rem' };
    } */
  };
  const onSelectionChanged = useCallback(() => {
    const selectedrow = gridRef.current!.api.getSelectedRows();
    //setCodeDataTableFilter(selectedrow);    
  }, []);
 /*  function setIdText(id: string, value: string | number | undefined) {
    document.getElementById(id)!.textContent =
      value == undefined ? "undefined" : value + "";
  } */
  const setHeaderHeight = useCallback((value?: number) => {
    gridRef.current!.api.setGridOption("headerHeight", value);
    //setIdText("headerHeight", value);
  }, []);
  const gridRef = useRef<AgGridReact<any>>(null);
  const defaultColDef = useMemo(() => {
    return {
      initialWidth: 100,
      wrapHeaderText: true,
      autoHeaderHeight: false,
      editable: true,
      floatingFilter: true,
      filter: true,
    };
  }, []);
  const handletraPOFullCMS = () => {
    setisLoading(true);
    setColumnDefinition(getCompany() === 'CMS' ? column_codeCMS2 : column_codeERP_PVN2);
    generalQuery(getCompany() === "CMS" ? "traPOFullCMS" : "traPOFullCMS2", {
      allcode: alltime,
      codeSearch: codeCMS,
    })
      .then((response) => {
        //console.log(response.data);
        let temp_summary: POFullSummary = {
          PO_BALANCE: 0,
          TP: 0,
          BTP: 0,
          CK: 0,
          BLOCK: 0,
          TONG_TON: 0,
          THUATHIEU: 0,
        };
        if (response.data.tk_status !== "NG") {
          const loadeddata: POFullCMS[] = response.data.data.map(
            (element: POFullCMS, index: number) => {
              temp_summary.PO_BALANCE += element.PO_BALANCE;
              temp_summary.TP += element.TON_TP;
              temp_summary.BTP += element.BTP;
              temp_summary.CK += element.TONG_TON_KIEM;
              temp_summary.BLOCK += element.BLOCK_QTY;
              temp_summary.TONG_TON += element.GRAND_TOTAL_STOCK;
              temp_summary.THUATHIEU +=
                element.THUA_THIEU < 0 ? element.THUA_THIEU : 0;
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                id: index,
              };
            },
          );
          setPOFullSummary(temp_summary);
          setPOFULLDataTable(loadeddata);
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
  const handletraPOFullKD = () => {
    setisLoading(true);
    setColumnDefinition(column_codeKD2);
    generalQuery(getCompany() === "CMS" ? "traPOFullKD" : "traPOFullKD2", {
      allcode: alltime,
      codeSearch: codeCMS,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: POFullCMS[] = response.data.data.map(
            (element: POFullCMS, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                id: index,
              };
            },
          );
          setPOFULLDataTable(loadeddata);
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
  const setNav = (choose: number) => {
    if (choose === 1) {
      setSelection({
        ...selection,
        trapo: true,
        thempohangloat: false,
        them1po: false,
        them1invoice: false,
        testinvoicetable: false,
        kholieu: false,
      });
    } else if (choose === 2) {
      setSelection({
        ...selection,
        trapo: false,
        thempohangloat: true,
        them1po: false,
        them1invoice: false,
        testinvoicetable: false,
        kholieu: false,
      });
    } else if (choose === 3) {
      setSelection({
        ...selection,
        trapo: false,
        thempohangloat: false,
        them1po: false,
        them1invoice: false,
        testinvoicetable: true,
        kholieu: false,
      });
    } else if (choose === 4) {
      setSelection({
        ...selection,
        trapo: false,
        thempohangloat: false,
        them1po: false,
        them1invoice: false,
        testinvoicetable: false,
        kholieu: true,
      });
    }
  };
  useEffect(() => { }, []);
  return (
    <div className="poandstockfull">
      <div className="mininavbar">
        <div
          className="mininavitem"
          onClick={() => setNav(1)}
          style={{
            backgroundColor: selection.trapo === true ? "#02c712" : "#abc9ae",
            color: selection.trapo === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">PO+TK FULL</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(2)}
          style={{
            backgroundColor:
              selection.thempohangloat === true ? "#02c712" : "#abc9ae",
            color: selection.thempohangloat === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">Phòng Kiểm Tra</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(3)}
          style={{
            backgroundColor:
              selection.testinvoicetable === true ? "#02c712" : "#abc9ae",
            color: selection.testinvoicetable === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">Kho Thành Phẩm</span>
        </div>
        <div
          className="mininavitem"
          onClick={() => setNav(4)}
          style={{
            backgroundColor: selection.kholieu === true ? "#02c712" : "#abc9ae",
            color: selection.kholieu === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">Kho Liệu</span>
        </div>
      </div>
      {selection.trapo && (
        <div className="tracuuFcst">
          <div className="tracuuFcstTable">
            {/*  <DataGrid
              components={{
                Toolbar: CustomToolbarPOTable,
                LoadingOverlay: LinearProgress,
              }}
              sx={{ fontSize: "0.7rem" }}
              loading={isLoading}
              rowHeight={30}
              rows={pofulldatatable}
              columns={columnDefinition}
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
              ]}
              editMode="row"
            /> */}
            <div className="toolbar">
              <div className="searchdiv">
                <div className="forminput">
                  <div className="forminputcolumn">
                    <label>
                      <b>Code:</b>{" "}
                      <input
                        type="text"
                        placeholder="Nhập code vào đây"
                        value={codeCMS}
                        onChange={(e) => setCodeCMS(e.target.value)}
                      ></input>
                    </label>
                    <label>
                      <b>Chỉ code tồn PO</b>
                      <input
                        type="checkbox"
                        name="alltimecheckbox"
                        defaultChecked={alltime}
                        onChange={() => setAllTime(!alltime)}
                      ></input>
                    </label>
                    <button
                      className="traxuatkiembutton"
                      onClick={() => {
                        handletraPOFullCMS();
                      }}
                    >
                      Search(G_CODE)
                    </button>
                    <button
                      className="traxuatkiembutton"
                      onClick={() => {
                        handletraPOFullKD();
                      }}
                    >
                      Search(KD)
                    </button>
                  </div>
                  <div className="forminputcolumn">
                    <table>
                      <thead>
                        <tr>
                          <td>PO BALANCE</td>
                          <td>TP</td>
                          <td>BTP</td>
                          <td>CK</td>
                          <td>BLOCK</td>
                          <td>TONG TON</td>
                          <td>THUA THIEU</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ color: "blue" }}>
                            {pofullSummary.PO_BALANCE.toLocaleString("en-US")}
                          </td>
                          <td style={{ color: "purple" }}>
                            {pofullSummary.TP.toLocaleString("en-US")}
                          </td>
                          <td style={{ color: "purple" }}>
                            {pofullSummary.BTP.toLocaleString("en-US")}
                          </td>
                          <td style={{ color: "purple" }}>
                            {pofullSummary.CK.toLocaleString("en-US")}
                          </td>
                          <td style={{ color: "red" }}>
                            {pofullSummary.BLOCK.toLocaleString("en-US")}
                          </td>
                          <td style={{ color: "blue", fontWeight: "bold" }}>
                            {pofullSummary.TONG_TON.toLocaleString("en-US")}
                          </td>
                          <td style={{ color: "brown", fontWeight: "bold" }}>
                            {pofullSummary.THUATHIEU.toLocaleString("en-US")}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  SaveExcel(pofulldatatable, "Ton kho full Table");
                }}
              >
                <AiFillFileExcel color="green" size={15} />
                SAVE
              </IconButton>
            </div>
            <div
              className="ag-theme-quartz" // applying the grid theme
              style={{ height: '100%' }} // the grid will fill the size of the parent container
            >
              <AgGridReact
                rowData={pofulldatatable}
                columnDefs={columnDefinition}
                rowHeight={25}
                defaultColDef={defaultColDef}
                ref={gridRef}
                onGridReady={() => {
                  setHeaderHeight(20);
                }}
                columnHoverHighlight={true}
                rowStyle={rowStyle}
                getRowStyle={getRowStyle}
                getRowId={(params: any) => params.data.id}
                rowSelection={"multiple"}
                rowMultiSelectWithClick={true}
                suppressRowClickSelection={true}
                enterNavigatesVertically={true}
                enterNavigatesVerticallyAfterEdit={true}
                stopEditingWhenCellsLoseFocus={true}
                enableCellTextSelection={true} 
                rowBuffer={10}
                debounceVerticalScrollbar={false}               
                floatingFiltersHeight={23}
                onSelectionChanged={onSelectionChanged}
                onRowClicked={(params: any) => {
                  //setClickedRows(params.data)
                  //console.log(params.data)
                }}
                onCellEditingStopped={(params: any) => {
                  //console.log(params)
                }}
              />
            </div>
          </div>
        </div>
      )}
      {selection.thempohangloat && (
        <div className="inspection">
          <INSPECTION />
        </div>
      )}
      {selection.testinvoicetable && (
        <div className="inspection">
          {getCompany() === "CMS" && <KHOTP />}
          {getCompany() !== "CMS" && <KHOTPNEW />}
        </div>
      )}
      {selection.kholieu && (
        <div className="inspection">
          <KHOLIEU />
        </div>
      )}
    </div>
  );
};
export default POandStockFull;
