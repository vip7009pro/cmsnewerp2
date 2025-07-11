import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getCompany } from "../../../api/Api";
import { f_updateBTP_M100, f_updateTONKIEM_M100 } from "../../../api/GlobalFunction";
import "./POandStockFull.scss";
import INSPECTION from "../../qc/inspection/INSPECTION";
import KHOTP from "../../kho/khotp/KHOTP";
import KHOLIEU from "../../kho/kholieu/KHOLIEU";
import KHOTPNEW from "../../kho/khotp_new/KHOTPNEW";
import { AgGridReact } from "ag-grid-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import MyTabs from "../../../components/MyTab/MyTab";
import AGTable from "../../../components/DataTable/AGTable";
import { POFullCMS, POFullSummary } from "../interfaces/kdInterface";
const POandStockFull = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [pofullSummary, setPOFullSummary] = useState<POFullSummary>({
    PO_BALANCE: 0,
    TP: 0,
    BTP: 0,
    CK: 0,
    CNK:0,
    BLOCK: 0,
    TONG_TON: 0,
    THUATHIEU: 0,
  });
  const [isLoading, setisLoading] = useState(false);
  const [codeCMS, setCodeCMS] = useState("");
  const [alltime, setAllTime] = useState(true);
  const [pofulldatatable, setPOFULLDataTable] = useState<Array<any>>([]);
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
            <b>{params.data.PO_QTY?.toLocaleString("en-US")}</b>
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
            <b>{params.data.TOTAL_DELIVERED?.toLocaleString("en-US")}</b>
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
            <b>{params.data.PO_BALANCE?.toLocaleString("en-US")}</b>
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
            <b>{params.data.CHO_KIEM?.toLocaleString("en-US")}</b>
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
            <b>{params.data.CHO_CS_CHECK?.toLocaleString("en-US")}</b>
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
            <b>{params.data.CHO_KIEM_RMA?.toLocaleString("en-US")}</b>
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
            <b>{params.data.TONG_TON_KIEM?.toLocaleString("en-US")}</b>
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
            <b>{params.data.BTP?.toLocaleString("en-US")}</b>
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
            <b>{params.data.TON_TP?.toLocaleString("en-US")}</b>
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
            <b>{params.data.BLOCK_QTY?.toLocaleString("en-US")}</b>
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
            <b>{params.data.GRAND_TOTAL_STOCK?.toLocaleString("en-US")}</b>
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
            <b>{params.data.THUA_THIEU?.toLocaleString("en-US")}</b>
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
            <b>{params.data.PO_QTY?.toLocaleString("en-US")}</b>
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
            <b>{params.data.TOTAL_DELIVERED?.toLocaleString("en-US")}</b>
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
            <b>{params.data.PO_BALANCE?.toLocaleString("en-US")}</b>
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
          <span style={{ color: "black" }}>
            <b>{params.data.CHO_KIEM?.toLocaleString("en-US")}</b>
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
          <span style={{ color: "black" }}>
            <b>{params.data.CHO_CS_CHECK?.toLocaleString("en-US")}</b>
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
          <span style={{ color: "black" }}>
            <b>{params.data.CHO_KIEM_RMA?.toLocaleString("en-US")}</b>
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
          <span style={{ color: "blue" }}>
            <b>{params.data.BTP?.toLocaleString("en-US")}</b>
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
          <span style={{ color: "blue" }}>
            <b>{params.data.TONG_TON_KIEM?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },    
    {
      field: "WAIT_INPUT_WH",
      cellDataType: "number",
      headerName: "CHO_NHAP_KHO",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.WAIT_INPUT_WH?.toLocaleString("en-US")}</b>
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
            <b>{params.data.TON_TP?.toLocaleString("en-US")}</b>
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
            <b>{params.data.BLOCK_QTY?.toLocaleString("en-US")}</b>
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
            <b>{params.data.GRAND_TOTAL_STOCK?.toLocaleString("en-US")}</b>
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
            <b>{params.data.THUA_THIEU?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "USE_YN",
      cellDataType: "number",
      headerName: "STATUS",
      width: 120,
      cellRenderer: (params: any) => {
        if (params.data.USE_YN === "Y")
          return (
            <span style={{ color: "green" }}>
              <b>MỞ</b>
            </span>
          );
        return (
          <span style={{ color: "red" }}>
            <b>KHÓA</b>
          </span>
        );
      },
    },
    /* {
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
    }, */
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
            <b>{params.data.PO_QTY?.toLocaleString("en-US")}</b>
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
            <b>{params.data.TOTAL_DELIVERED?.toLocaleString("en-US")}</b>
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
            <b>{params.data.PO_BALANCE?.toLocaleString("en-US")}</b>
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
            <b>{params.data.CHO_KIEM?.toLocaleString("en-US")}</b>
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
            <b>{params.data.CHO_CS_CHECK?.toLocaleString("en-US")}</b>
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
            <b>{params.data.CHO_KIEM_RMA?.toLocaleString("en-US")}</b>
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
            <b>{params.data.BTP?.toLocaleString("en-US")}</b>
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
            <b>{params.data.TONG_TON_KIEM?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "WAIT_INPUT_WH",
      cellDataType: "number",
      headerName: "CHO_NHAP_KHO",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black" }}>
            <b>{params.data.WAIT_INPUT_WH?.toLocaleString("en-US")}</b>
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
            <b>{params.data.TON_TP?.toLocaleString("en-US")}</b>
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
            <b>{params.data.BLOCK_QTY?.toLocaleString("en-US")}</b>
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
            <b>{params.data.GRAND_TOTAL_STOCK?.toLocaleString("en-US")}</b>
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
            <b>{params.data.THUA_THIEU?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
  ];
  const [columnDefinition, setColumnDefinition] = useState<Array<any>>(
    getCompany() === "CMS" ? column_codeCMS2 : column_codeERP_PVN2
  );
  const gridRef = useRef<AgGridReact<any>>(null);
  const handletraPOFullCMS = async () => {
    Swal.fire({
      title: "Tra data",
      text: "Đang tra data",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    await f_updateBTP_M100();
    await f_updateTONKIEM_M100();
    setisLoading(true);
    //traPOFullCMS2_NEW
    setColumnDefinition(
      getCompany() === "CMS" ? column_codeCMS2 : column_codeERP_PVN2
    );
    generalQuery(
      getCompany() === "CMS" ? "traPOFullCMS_New" : "traPOFullCMS2",
      {
        allcode: alltime,
        codeSearch: codeCMS,
      }
    )
      .then((response) => {
        //console.log(response.data);
        let temp_summary: POFullSummary = {
          PO_BALANCE: 0,
          TP: 0,
          BTP: 0,
          CK: 0,
          CNK:0,
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
              temp_summary.CNK += element.WAIT_INPUT_WH;
              temp_summary.BLOCK += element.BLOCK_QTY;
              temp_summary.TONG_TON += element.GRAND_TOTAL_STOCK;
              temp_summary.THUATHIEU +=
                element.THUA_THIEU < 0 ? element.THUA_THIEU : 0;
              return {
                ...element,
                G_NAME:
                  getAuditMode() == 0
                    ? element?.G_NAME
                    : element?.G_NAME?.search("CNDB") == -1
                    ? element?.G_NAME
                    : "TEM_NOI_BO",
                G_NAME_KD:
                  getAuditMode() == 0
                    ? element?.G_NAME_KD
                    : element?.G_NAME?.search("CNDB") == -1
                    ? element?.G_NAME_KD
                    : "TEM_NOI_BO",
                id: index,
              };
            }
          );
          setPOFullSummary(temp_summary);
          setPOFULLDataTable(loadeddata);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
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
  const handletraPOFullKD = async () => {
    Swal.fire({
      title: "Tra data",
      text: "Đang tra data",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    await f_updateBTP_M100();
    await f_updateTONKIEM_M100();
    setisLoading(true);
    setColumnDefinition(column_codeKD2);
    //traPOFullKD2_NEW
    generalQuery(getCompany() === "CMS" ? "traPOFullKD_NEW" : "traPOFullKD2", {
      allcode: alltime,
      codeSearch: codeCMS,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          let temp_summary: POFullSummary = {
            PO_BALANCE: 0,
            TP: 0,
            BTP: 0,
            CK: 0,
            CNK:0,
            BLOCK: 0,
            TONG_TON: 0,
            THUATHIEU: 0,
          };
          const loadeddata: POFullCMS[] = response.data.data.map(
            (element: POFullCMS, index: number) => {
              temp_summary.PO_BALANCE += element.PO_BALANCE;
              temp_summary.TP += element.TON_TP;
              temp_summary.BTP += element.BTP;
              temp_summary.CK += element.TONG_TON_KIEM;
              temp_summary.CNK += element.WAIT_INPUT_WH;
              temp_summary.BLOCK += element.BLOCK_QTY;
              temp_summary.TONG_TON += element.GRAND_TOTAL_STOCK;
              temp_summary.THUATHIEU +=
                element.THUA_THIEU < 0 ? element.THUA_THIEU : 0;
              return {
                ...element,
                G_NAME:
                  getAuditMode() == 0
                    ? element?.G_NAME
                    : element?.G_NAME?.search("CNDB") == -1
                    ? element?.G_NAME
                    : "TEM_NOI_BO",
                G_NAME_KD:
                  getAuditMode() == 0
                    ? element?.G_NAME_KD
                    : element?.G_NAME?.search("CNDB") == -1
                    ? element?.G_NAME_KD
                    : "TEM_NOI_BO",
                id: index,
              };
            }
          );
          setPOFullSummary(temp_summary);
          setPOFULLDataTable(loadeddata);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success"
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
  const poStockFullAGTable = useMemo(() => {
    return (
      <AGTable
        suppressRowClickSelection={false}
        toolbar={
          <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>            
          </div>}
        columns={columnDefinition}
        data={pofulldatatable}
        onCellEditingStopped={(params: any) => {
          //console.log(e.data)
        }} onRowClick={(params: any) => {
         
          //console.log(e.data) 
        }} onSelectionChange={(params: any) => {
          //setSelectedRows(params!.api.getSelectedRows()[0]);
          //console.log(e!.api.getSelectedRows())
        }} onRowDoubleClick={(params: any) => {
        }}
      />
    )
  }, [pofulldatatable, columnDefinition])

  useEffect(() => {}, []);
  return (
    <div className="poandstockfull">    
      <MyTabs defaultActiveTab={0}>
          <MyTabs.Tab title="PO+TK FULL">
          <div className="tracuuFcst">
            <div className="tracuuFcstTable">
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
                            <td>BTP</td>
                            <td>CK</td>
                            <td>CNK</td>
                            <td>TP</td>
                            <td>BLOCK</td>
                            <td>TONG TON</td>
                            <td>THUA THIEU</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ color: "blue" }}>
                              {pofullSummary.PO_BALANCE?.toLocaleString("en-US")}
                            </td>
                            <td style={{ color: "purple" }}>
                              {pofullSummary.BTP?.toLocaleString("en-US")}
                            </td>
                            <td style={{ color: "purple" }}>
                              {pofullSummary.CK?.toLocaleString("en-US")}
                            </td>
                            <td style={{ color: "purple" }}>
                              {pofullSummary.CNK?.toLocaleString("en-US")}
                            </td>
                            <td style={{ color: "purple" }}>
                              {pofullSummary.TP?.toLocaleString("en-US")}
                            </td>
                            <td style={{ color: "red" }}>
                              {pofullSummary.BLOCK?.toLocaleString("en-US")}
                            </td>
                            <td style={{ color: "blue", fontWeight: "bold" }}>
                              {pofullSummary.TONG_TON?.toLocaleString("en-US")}
                            </td>
                            <td style={{ color: "brown", fontWeight: "bold" }}>
                              {pofullSummary.THUATHIEU?.toLocaleString("en-US")}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>               
              </div>
              {poStockFullAGTable}              
            </div>
          </div>
          </MyTabs.Tab>
          <MyTabs.Tab title="Phòng Kiểm Tra">
          <div className="inspection">
            <INSPECTION />
          </div>
          </MyTabs.Tab>
          <MyTabs.Tab title="Kho Thành Phẩm">
          <div className="inspection">
            {getCompany() === "CMS" && <KHOTP />}
            {getCompany() !== "CMS" && <KHOTPNEW />}
          </div>
          </MyTabs.Tab>
          <MyTabs.Tab title="Kho Liệu">
          <div className="inspection">
            <KHOLIEU />
          </div>
          </MyTabs.Tab>
        </MyTabs>
    </div>
  );
};
export default POandStockFull;
