import { Button,} from "@mui/material";

import moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getCompany } from "../../../api/Api";
import "./KHOTP.scss";
import {
  TONKIEMGOP_CMS,
  TONKIEMGOP_KD,
  TONKIEMTACH,
  WH_IN_OUT,
  XUATPACK_DATA,
} from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { f_updateBTP_M100 } from "../../../api/GlobalFunction";
const KHOTP = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [readyRender, setReadyRender] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [cust_name, setCustName] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [capbu, setCapBu] = useState(false);
  const [justbalancecode, setJustBalanceCode] = useState(true);
  const [whdatatable, setWhDataTable] = useState<Array<any>>([]);
  const [sumaryWH, setSummaryWH] = useState("");
  const [buttonselected, setbuttonselected] = useState("GR");
  const column_STOCK_TACH = [
    { field: "KHO_NAME", headerName: "KHO_NAME", width: 90 },
    { field: "LC_NAME", headerName: "LC_NAME", width: 90 },
    { field: "G_CODE", headerName: "G_CODE", width: 90 },
    { field: "G_NAME", headerName: "G_NAME", width: 180 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 180 },
    {
      field: "NHAPKHO",
      headerName: "NHAPKHO",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.data.NHAPKHO?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "XUATKHO",
      headerName: "XUATKHO",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.data.XUATKHO?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TONKHO",
      headerName: "TONKHO",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.TONKHO?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BLOCK_QTY",
      headerName: "BLOCK_QTY",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.BLOCK_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "GRAND_TOTAL_TP",
      headerName: "GRAND_TOTAL_TP",
      width: 150,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.GRAND_TOTAL_TP?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
  ];
  const column_STOCK_CMS = [
    { field: "G_CODE", headerName: "G_CODE", width: 90 },
    { field: "G_NAME", headerName: "G_NAME", width: 180 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 180 },
    {
      field: "CHO_KIEM",
      headerName: "CHO_KIEM",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.data.CHO_KIEM?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_CS_CHECK",
      headerName: "WAIT CS",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.data.CHO_CS_CHECK?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_KIEM_RMA",
      headerName: "WAIT RMA",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.data.CHO_KIEM_RMA?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TONG_TON_KIEM",
      headerName: "TONG_TON_KIEM",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.TONG_TON_KIEM?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BTP",
      headerName: "BTP",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.BTP?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_TP",
      headerName: "TON_TP",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.TON_TP?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "PENDINGXK",
      headerName: "PENDINGXK",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#9031FA" }}>
            <b>{params.data.PENDINGXK?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_TPTT",
      headerName: "TON_TPTT",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.TON_TPTT?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BLOCK_QTY",
      headerName: "BLOCK_QTY",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.BLOCK_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "GRAND_TOTAL_STOCK",
      headerName: "GRAND_TOTAL_STOCK",
      width: 150,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.GRAND_TOTAL_STOCK?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
  ];
  const column_STOCK_KD = [
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 180 },
    {
      field: "CHO_KIEM",
      headerName: "CHO_KIEM",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.data.CHO_KIEM?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_CS_CHECK",
      headerName: "WAIT CS",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.data.CHO_CS_CHECK?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CHO_KIEM_RMA",
      headerName: "WAIT RMA",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>{params.data.CHO_KIEM_RMA?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TONG_TON_KIEM",
      headerName: "TONG_TON_KIEM",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.TONG_TON_KIEM?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BTP",
      headerName: "BTP",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.BTP?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_TP",
      headerName: "TON_TP",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.TON_TP?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "PENDINGXK",
      headerName: "PENDINGXK",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#9031FA" }}>
            <b>{params.data.PENDINGXK?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_TPTT",
      headerName: "TON_TPTT",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.TON_TPTT?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "BLOCK_QTY",
      headerName: "BLOCK_QTY",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.BLOCK_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "GRAND_TOTAL_STOCK",
      headerName: "GRAND_TOTAL_STOCK",
      width: 150,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.GRAND_TOTAL_STOCK?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
  ];
  const column_WH_IN_OUT = [
    { field: "G_CODE", headerName: "G_CODE", width: 90 },
    { field: "G_NAME", headerName: "G_NAME", width: 180 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 150 },
    {
      field: "Customer_ShortName",
      headerName: "Customer_ShortName",
      width: 150,
    },
    { field: "IO_Date", headerName: "IO_Date", width: 150 },
    { field: "INPUT_DATETIME", headerName: "IN_OUT_TIME", width: 150 },
    { field: "IO_Shift", headerName: "IO_Shift", width: 80 },
    { field: "IO_Type", headerName: "IO_Type", width: 80 },
    {
      field: "IO_Status",
      headerName: "IO_Status",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data.IO_Status === "Pending") {
          return (
            <span style={{ color: "red" }}>
              <b>Pending</b>
            </span>
          );
        } else {
          return (
            <span style={{ color: "green" }}>
              <b>Closed</b>
            </span>
          );
        }
      },
    },
    {
      field: "IO_Qty",
      headerName: "IO_Qty",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.IO_Qty?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "IO_Note", headerName: "IO_Note", width: 150 },
    { field: "IO_Number", headerName: "IO_Number", width: 100 },
  ];
  const column_XUATPACK = [
    { field: "G_CODE", headerName: "G_CODE", width: 90 },
    { field: "G_NAME", headerName: "G_NAME", width: 180 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 100 },
    { field: "PROD_MODEL", headerName: "PROD_MODEL", width: 90 },
    { field: "OutID", headerName: "OutID", width: 90 },
    {
      field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 110, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#B008B0" }}>
            <b>{params.data.CUST_NAME_KD}</b>
          </span>
        );
      }
    },
    { field: "Customer_SortName", headerName: "Customer_SortName", width: 110 },
    {
      field: "OUT_DATE", headerName: "OUT_DATE", width: 90, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.OUT_DATE}</b>
          </span>
        );
      }
    },
    { field: "OUT_DATETIME", headerName: "OUT_DATETIME", width: 155 },
    {
      field: "Out_Qty", headerName: "Out_Qty", width: 90, cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>{params.data.Out_Qty?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "SX_DATE", headerName: "SX_DATE", width: 90 },
    { field: "INSPECT_LOT_NO", headerName: "INSPECT_LOT_NO", width: 110 },
    { field: "PROCESS_LOT_NO", headerName: "PROCESS_LOT_NO", width: 110 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 110 },
    { field: "LOTNCC", headerName: "LOTNCC", width: 110 },
    { field: "M_NAME", headerName: "M_NAME", width: 120 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 90 },
    { field: "SX_EMPL", headerName: "SX_EMPL", width: 90 },
    { field: "LINEQC_EMPL", headerName: "LINEQC_EMPL", width: 90 },
    { field: "INSPECT_EMPL", headerName: "INSPECT_EMPL", width: 100 },
    { field: "EXP_DATE", headerName: "EXP_DATE", width: 100 },
    { field: "Outtype", headerName: "Outtype", width: 90 },
  ];
  const [columnDefinition, setColumnDefinition] =
    useState<Array<any>>(column_STOCK_CMS);
  const handletraXuatPack = () => {    
    let inout_qty: number = 0;
    setSummaryWH("");
    setisLoading(true);
    generalQuery("xuatpackkhotp", {
      G_CODE: codeCMS.trim(),
      G_NAME: codeKD.trim(),
      ALLTIME: alltime,
      JUSTBALANCE: justbalancecode,
      CUST_NAME_KD: cust_name.trim(),
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CAPBU: capbu,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data)
          const loadeddata: XUATPACK_DATA[] = response.data.data.map(
            (element: XUATPACK_DATA, index: number) => {
              inout_qty += element.Out_Qty;
              return {
                ...element,
                id: index,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
                G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                OUT_DATE: moment.utc(element.OUT_DATE).format("YYYY-MM-DD"),
                OUT_DATETIME: moment.utc(element.OUT_DATETIME.slice(0, element.OUT_DATETIME.length - 2)).format("YYYY-MM-DD HH:mm:ss"),
                SX_DATE: moment.utc(element.SX_DATE).format("YYYY-MM-DD"),
                EXP_DATE: moment.utc(element.EXP_DATE).format("YYYY-MM-DD"),
              };
            },
          );
          setWhDataTable(loadeddata);
          setReadyRender(true);
          setisLoading(false);
          setSummaryWH(
            "TOTAL QTY: " + inout_qty.toLocaleString("en-US") + "EA",
          );
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
  const handletraWHInOut = (inout: string) => {
    let inout_qty: number = 0;
    setSummaryWH("");
    setisLoading(true);
    generalQuery("trakhotpInOut", {
      G_CODE: codeCMS.trim(),
      G_NAME: codeKD.trim(),
      ALLTIME: alltime,
      JUSTBALANCE: justbalancecode,
      CUST_NAME: cust_name.trim(),
      FROM_DATE: fromdate,
      TO_DATE: todate,
      INOUT: inout,
      CAPBU: capbu,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: WH_IN_OUT[] = response.data.data.map(
            (element: WH_IN_OUT, index: number) => {
              inout_qty += element.IO_Qty;
              return {
                ...element,
                id: index,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                IO_Date: moment.utc(element.IO_Date).format("YYYY-MM-DD"),
                INPUT_DATETIME: moment
                  .utc(element.INPUT_DATETIME)
                  .format("YYYY-MM-DD HH:mm:ss"),
              };
            },
          );
          setWhDataTable(loadeddata);
          setReadyRender(true);
          setisLoading(false);
          setSummaryWH(
            "TOTAL QTY: " + inout_qty.toLocaleString("en-US") + "EA",
          );
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
  const handletraWHSTOCKCMS = async () => {
    await f_updateBTP_M100();
    setSummaryWH("");
    setisLoading(true);
    await generalQuery(getCompany() === "CMS" ? "traSTOCKCMS_NEW" : "traSTOCKCMS", {
      G_CODE: codeCMS.trim(),
      G_NAME: codeKD.trim(),
      ALLTIME: alltime,
      JUSTBALANCE: justbalancecode,
      CUST_NAME: cust_name.trim(),
      FROM_DATE: fromdate,
      TO_DATE: todate,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: TONKIEMGOP_CMS[] = response.data.data.map(
            (element: TONKIEMGOP_CMS, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                id: index,
              };
            },
          );
          setWhDataTable(loadeddata);
          setReadyRender(true);
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
  const handletraWHSTOCKKD = async () => {
    await f_updateBTP_M100();
    setSummaryWH("");
    setisLoading(true);
    await generalQuery(getCompany() === "CMS" ? "traSTOCKKD_NEW" : "traSTOCKKD", {
      G_CODE: codeCMS.trim(),
      G_NAME: codeKD.trim(),
      ALLTIME: alltime,
      JUSTBALANCE: justbalancecode,
      CUST_NAME: cust_name.trim(),
      FROM_DATE: fromdate,
      TO_DATE: todate,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: TONKIEMGOP_KD[] = response.data.data.map(
            (element: TONKIEMGOP_KD, index: number) => {
              return {
                ...element,                
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME_KD?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                id: index,
              };
            },
          );
          setWhDataTable(loadeddata);
          setReadyRender(true);
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
  const handletraWHSTOCKTACH = () => {
    setSummaryWH("");
    setisLoading(true);
    generalQuery("traSTOCKTACH", {
      G_CODE: codeCMS.trim(),
      G_NAME: codeKD.trim(),
      ALLTIME: alltime,
      JUSTBALANCE: justbalancecode,
      CUST_NAME: cust_name.trim(),
      FROM_DATE: fromdate,
      TO_DATE: todate,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: TONKIEMTACH[] = response.data.data.map(
            (element: TONKIEMTACH, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                KHO_NAME: element.KHO_NAME === 'NM1' ? 'SK1' : element.KHO_NAME === 'NM3' ? 'SK3' : element.KHO_NAME,
                id: index,
              };
            },
          );
          setWhDataTable(loadeddata);
          setReadyRender(true);
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
  const warehouseDataTableAG = useMemo(()=> {
    return (
      <AGTable
        toolbar={
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1rem",
              paddingLeft: 20,
              color: "blue",
            }}
          >         
            {sumaryWH}
          </div>}
        columns={columnDefinition}
        data={whdatatable}
        onCellEditingStopped={(e) => {
          //console.log(e.data)
        }} onRowClick={(e) => {
          //console.log(e.data)
        }} onSelectionChange={(e) => {
          //console.log(e!.api.getSelectedRows())
        }}
      />
    )
  },[whdatatable,columnDefinition])
  useEffect(() => { }, []);
  return (
    <div className="khotp">
      <div className="tracuuDataWH">
        <div className="tracuuDataWHform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
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
                <b>Khách:</b>{" "}
                <input
                  type="text"
                  placeholder="SEVT"
                  value={cust_name}
                  onChange={(e) => setCustName(e.target.value)}
                ></input>
              </label>
              <div className="forminputcolumn">
              <label>
                <b>CHỌN:</b>
                <select
                  name="chondatakho"
                  value={buttonselected}
                  onChange={(e) => {
                    setbuttonselected(e.target.value);
                  }}
                >
                  <option value="GR">Nhập Kho</option>
                  <option value="GI">Xuất Kho</option>
                  <option value="GI_PACK">Xuất Pack</option>                 
                  <option value="STOCKG_CODE">Tồn theo G_CODE</option>
                  <option value="STOCKG_NAME_KD">Tồn theo Code KD</option>                  
                  <option value="STOCKG_TACH">Tồn theo vị trí kho</option>                  
                </select>
              </label>              
            </div>
              <label>
                <b>All Time:</b>
                <input
                  type="checkbox"
                  name="alltimecheckbox"
                  defaultChecked={alltime}
                  onChange={() => setAllTime(!alltime)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Tính cả xuất cấp bù:</b>
                <input
                  type="checkbox"
                  name="alltimecheckbox"
                  defaultChecked={capbu}
                  onChange={() => setCapBu(!capbu)}
                ></input>
              </label>
              <label>
                <b>Chỉ code có tồn:</b>
                <input
                  type="checkbox"
                  name="alltimecheckbox"
                  defaultChecked={justbalancecode}
                  onChange={() => setJustBalanceCode(!justbalancecode)}
                ></input>
              </label>
            </div>
            
          </div>
          <div className="formbutton">
            <Button fullWidth={true} color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#31ad00' }} onClick={() => {
              Swal.fire({
                title: "Tra data",
                text: "Đang tra data",
                icon: "info",
                showCancelButton: false,
                allowOutsideClick: false,
                confirmButtonText: "OK",
                showConfirmButton: false,
              });
              setisLoading(true);
              setReadyRender(false);              
              switch (buttonselected) {
                case "GR":
                  setColumnDefinition(column_WH_IN_OUT);
                  handletraWHInOut("IN");                  
                  break;
                case "GI":
                  setColumnDefinition(column_WH_IN_OUT);
                  handletraWHInOut("OUT");
                  break;               
                case "GI_PACK":
                  setColumnDefinition(column_XUATPACK);
                  handletraXuatPack();
                  break;               
                case "STOCKG_CODE":
                  setColumnDefinition(column_STOCK_CMS);
                  handletraWHSTOCKCMS();
                  break;
                case "STOCKG_NAME_KD":
                  setColumnDefinition(column_STOCK_KD);
                  handletraWHSTOCKKD();
                  break;
                case "STOCKG_TACH":
                  setColumnDefinition(column_STOCK_TACH);
                  handletraWHSTOCKTACH();
                  break;
              }

            }}>Load</Button>           
          </div>
        </div>
        <div className="tracuuWHTable">
          {warehouseDataTableAG}          
        </div>
      </div>
    </div>
  );
};
export default KHOTP;
