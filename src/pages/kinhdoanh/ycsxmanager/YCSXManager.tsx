import {
  Autocomplete,
  Button,
  IconButton,
  LinearProgress,
  TextField,
  createFilterOptions, 
} from "@mui/material";
import {
  DataGrid,
  GridSelectionModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import moment from "moment";
import React, { useContext, useEffect, useState, useTransition } from "react";
import { FcApprove, FcSearch } from "react-icons/fc";
import {
  AiFillAmazonCircle,
  AiFillEdit,
  AiFillFileAdd,
  AiFillFileExcel,
  AiOutlineCloudUpload,
  AiOutlinePrinter,
} from "react-icons/ai";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { generalQuery, uploadQuery } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { SaveExcel } from "../../../api/GlobalFunction";
import { MdOutlineDelete, MdOutlinePendingActions } from "react-icons/md";
import "./YCSXManager.scss";
import { FaArrowRight } from "react-icons/fa";
import { ReactElement, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import YCSXComponent from "./YCSXComponent/YCSXComponent";
import DrawComponent from "./DrawComponent/DrawComponent";
import TraAMZ from "./TraAMZ/TraAMZ";
import { UserData } from "../../../redux/slices/globalSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import axios from "axios";
import { TbLogout } from "react-icons/tb";
import Draggable from "devextreme-react/draggable";
interface POBALANCETDYCSX {
  G_CODE: string;
  PO_BALANCE: number;
}
interface TONKHOTDYCSX {
  G_CODE: string;
  CHO_KIEM: number;
  CHO_CS_CHECK: number;
  CHO_KIEM_RMA: number;
  TONG_TON_KIEM: number;
  BTP: number;
  TON_TP: number;
  BLOCK_QTY: number;
  GRAND_TOTAL_STOCK: number;
}
interface FCSTTDYCSX {
  G_CODE: string;
  W1: number;
  W2: number;
  W3: number;
  W4: number;
  W5: number;
  W6: number;
  W7: number;
  W8: number;
}
interface YCSXTableData {
  DESCR?: string;
  PDBV_EMPL?: string;
  PDBV_DATE?: string;
  PDBV?: string;
  BANVE?: string;
  PROD_MAIN_MATERIAL?: string;
  PROD_TYPE?: string;
  EMPL_NO: string;
  CUST_CD: string;
  G_CODE: string;
  G_NAME: string;
  EMPL_NAME: string;
  CUST_NAME_KD: string;
  PROD_REQUEST_NO: string;
  PROD_REQUEST_DATE: string;
  PROD_REQUEST_QTY: number;
  LOT_TOTAL_INPUT_QTY_EA: number;
  LOT_TOTAL_OUTPUT_QTY_EA: number;
  INSPECT_BALANCE: number;
  SHORTAGE_YCSX: number;
  YCSX_PENDING: number;
  PHAN_LOAI: string;
  REMARK: string;
  PO_TDYCSX: number;
  TOTAL_TKHO_TDYCSX: number;
  TKHO_TDYCSX: number;
  BTP_TDYCSX: number;
  CK_TDYCSX: number;
  BLOCK_TDYCSX: number;
  FCST_TDYCSX: number;
  W1: number;
  W2: number;
  W3: number;
  W4: number;
  W5: number;
  W6: number;
  W7: number;
  W8: number;
  PDUYET: number;
  LOAIXH: string;
}
interface CodeListData {
  G_CODE: string;
  G_NAME: string;
  PROD_LAST_PRICE?: number;
  USE_YN: string;
  PO_BALANCE?: number;
}
interface CustomerListData {
  CUST_CD: string;
  CUST_NAME_KD: string;
  CUST_NAME?: string;
}
interface UploadAmazonData {
  G_CODE?: string;
  PROD_REQUEST_NO?: string;
  NO_IN?: string;
  ROW_NO?: number;
  DATA1?: string;
  DATA2?: string;
  DATA3?: string;
  DATA4?: string;
  STATUS?: string;
  INLAI_COUNT?: number;
  REMARK?: string;
}
interface PONOLIST {
  G_CODE: string,
  CUST_CD: string,
  PO_NO: string,
  PO_DATE: string,
  RD_DATE: string,
  PO_QTY: number,
}
const YCSXManager = () => {  
  const [showhidesearchdiv, setShowHideSearchDiv]= useState(true);
  const [ycsxlistrender, setYCSXListRender] = useState<Array<ReactElement>>();
  const ycsxprintref = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => ycsxprintref.current,
  });
  const renderYCSX = (ycsxlist: YCSXTableData[]) => {
    return ycsxlist.map((element, index) => (
      <YCSXComponent
        key={index}
        PROD_REQUEST_NO={element.PROD_REQUEST_NO}
        G_CODE={element.G_CODE}
        PO_TDYCSX={element.PO_TDYCSX}
        TOTAL_TKHO_TDYCSX={element.TOTAL_TKHO_TDYCSX}
        TKHO_TDYCSX={element.TKHO_TDYCSX}
        BTP_TDYCSX={element.BTP_TDYCSX}
        CK_TDYCSX={element.CK_TDYCSX}
        BLOCK_TDYCSX={element.BLOCK_TDYCSX}
        FCST_TDYCSX={element.FCST_TDYCSX}
        PDBV={element.PDBV}
        PDBV_EMPL={element.PDBV_EMPL}
        PDBV_DATE={element.PDBV_DATE}
        DESCR={element.DESCR}
      />
    ));
  };
  const renderBanVe = (ycsxlist: YCSXTableData[]) => {
    return ycsxlist.map((element, index) =>
      element.BANVE === "Y" ? (
        <DrawComponent
          key={index}
          G_CODE={element.G_CODE}
          PDBV={element.PDBV}
          PROD_REQUEST_NO={element.PROD_REQUEST_NO}
          PDBV_EMPL={element.PDBV_EMPL}
          PDBV_DATE={element.PDBV_DATE}
        />
      ) : (
        <div>Code: {element.G_NAME} : Không có bản vẽ</div>
      )
    );
  };
  const [file, setFile] = useState<any>();
  const [isPending, startTransition] = useTransition();
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

  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const [uploadExcelJson, setUploadExcelJSon] = useState<Array<any>>([]);
  const [ponolist, setPONOLIST] = useState<Array<PONOLIST>>([]);
  const [isLoading, setisLoading] = useState(false);
  const [column_excel, setColumn_Excel] = useState<Array<any>>([]);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [empl_name, setEmpl_Name] = useState("");
  const [cust_name, setCust_Name] = useState("");
  const [prod_type, setProdType] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>({
    G_CODE: "6A00001B",
    G_NAME: "GT-I9500_SJ68-01284A",
    PROD_LAST_PRICE: 0,
    USE_YN: "N",
  });
  const [selectedCust_CD, setSelectedCust_CD] =
    useState<CustomerListData | null>({
      CUST_CD: "0000",
      CUST_NAME_KD: "SEOJIN",
    });
  const [selectedPoNo, setSelectedPoNo] = useState<PONOLIST | null>({
    CUST_CD:'',
    G_CODE:'',
    PO_NO:'',
    PO_DATE: '',
    RD_DATE:'',
    PO_QTY:0
  });
  const [deliverydate, setNewDeliveryDate] = useState(moment().format("YYYY-MM-DD"));
  const [pono, setPONO] = useState('');
  const [newycsxqty, setNewYcsxQty] = useState("");
  const [newycsxremark, setNewYcsxRemark] = useState("");
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [phanloai, setPhanLoai] = useState("00");
  const [newphanloai, setNewPhanLoai] = useState("TT");
  const [loaisx, setLoaiSX] = useState("01");
  const [loaixh, setLoaiXH] = useState("02");
  const [material, setMaterial] = useState("");
  const [ycsxdatatable, setYcsxDataTable] = useState<Array<YCSXTableData>>([]);
  const [ycsxdatatablefilter, setYcsxDataTableFilter] = useState<
    Array<YCSXTableData>
  >([]);
  const [ycsxdatatablefilterexcel, setYcsxDataTableFilterExcel] = useState<
    Array<any>
  >([]);
  const [selectedID, setSelectedID] = useState<string | null>();
  const [ycsxpendingcheck, setYCSXPendingCheck] = useState(false);
  const [inspectInputcheck, setInspectInputCheck] = useState(false);
  const [progressvalue, setProgressValue] = useState(0);
  const [id_congviec, setID_CongViec] = useState("");
  const [cavityAmazon, setCavityAmazon] = useState(0);
  const [prod_model, setProd_Model] = useState("");
  const [AMZ_check_flag, setAMZ_Check_Flag] = useState(false);
  const column_ycsxtable = [
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 250,
      renderCell: (params: any) => {
        if (params.row.PDBV === "P" || params.row.PDBV === null)
          return <span style={{ color: "red" }}>{params.row.G_NAME}</span>;
        return <span style={{ color: "green" }}>{params.row.G_NAME}</span>;
      },
    },
    { field: "EMPL_NAME", headerName: "PIC KD", width: 150 },
    { field: "CUST_NAME_KD", headerName: "KHÁCH", width: 120 },
    { field: "PROD_REQUEST_NO", headerName: "SỐ YCSX", width: 80 },
    { field: "PROD_REQUEST_DATE", headerName: "NGÀY YCSX", width: 80 },
    {
      field: "PROD_REQUEST_QTY",
      type: "number",
      headerName: "SL YCSX",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#009933" }}>
            <b>{params.row.PROD_REQUEST_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "LOT_TOTAL_INPUT_QTY_EA",
      type: "number",
      headerName: "NHẬP KIỂM",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#cc0099" }}>
            <b>{params.row.LOT_TOTAL_INPUT_QTY_EA.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "LOT_TOTAL_OUTPUT_QTY_EA",
      type: "number",
      headerName: "XUẤT KIỂM",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#cc0099" }}>
            <b>{params.row.LOT_TOTAL_OUTPUT_QTY_EA.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "INSPECT_BALANCE",
      type: "number",
      headerName: "TỒN KIỂM",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#cc0099" }}>
            <b>{params.row.INSPECT_BALANCE.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "SHORTAGE_YCSX",
      type: "number",
      headerName: "TỒN YCSX",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.SHORTAGE_YCSX.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "YCSX_PENDING",
      headerName: "YCSX_PENDING",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.YCSX_PENDING === 1)
          return (
            <span style={{ color: "red" }}>
              <b>PENDING</b>
            </span>
          );
        else
          return (
            <span style={{ color: "green" }}>
              <b>CLOSED</b>
            </span>
          );
      },
    },
    {
      field: "PHAN_LOAI",
      headerName: "PHAN_LOAI",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.PHAN_LOAI === "01")
          return (
            <span style={{ color: "black" }}>
              <b>Thông thường</b>
            </span>
          );
        else if (params.row.PHAN_LOAI === "02")
          return (
            <span style={{ color: "black" }}>
              <b>SDI</b>
            </span>
          );
        else if (params.row.PHAN_LOAI === "03")
          return (
            <span style={{ color: "black" }}>
              <b>GC</b>
            </span>
          );
        else if (params.row.PHAN_LOAI === "04")
          return (
            <span style={{ color: "black" }}>
              <b>SAMPLE</b>
            </span>
          );
      },
    },
    { field: "REMARK", headerName: "REMARK", width: 120 },
    { field: "PO_NO", headerName: "PO_NO", width: 120 },
    {
      field: "PO_TDYCSX",
      type: "number",
      headerName: "PO_TDYCSX",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#6600ff" }}>
            <b>{params.row.PO_TDYCSX.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TOTAL_TKHO_TDYCSX",
      type: "number",
      headerName: "TOTAL_TKHO_TDYCSX",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#6600ff" }}>
            <b>{params.row.TOTAL_TKHO_TDYCSX.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TKHO_TDYCSX",
      type: "number",
      headerName: "TKHO_TDYCSX",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.TKHO_TDYCSX.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "BTP_TDYCSX",
      type: "number",
      headerName: "BTP_TDYCSX",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.BTP_TDYCSX.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "CK_TDYCSX",
      type: "number",
      headerName: "CK_TDYCSX",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.CK_TDYCSX.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "BLOCK_TDYCSX",
      type: "number",
      headerName: "BLOCK_TDYCSX",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.BLOCK_TDYCSX.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "FCST_TDYCSX",
      type: "number",
      headerName: "FCST_TDYCSX",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#6600ff" }}>
            <b>{params.row.FCST_TDYCSX.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "W1",
      type: "number",
      headerName: "W1",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.W1.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "W2",
      type: "number",
      headerName: "W2",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.W2.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "W3",
      type: "number",
      headerName: "W3",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.W3.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "W4",
      type: "number",
      headerName: "W4",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.W4.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "W5",
      type: "number",
      headerName: "W5",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.W5.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "W6",
      type: "number",
      headerName: "W6",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.W6.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "W7",
      type: "number",
      headerName: "W7",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.W7.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "W8",
      type: "number",
      headerName: "W8",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.row.W8.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "PDUYET",
      headerName: "PDUYET",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.PDUYET === 1)
          return (
            <span style={{ color: "green" }}>
              <b>Đã Duyệt</b>
            </span>
          );
        else
          return (
            <span style={{ color: "red" }}>
              <b>Không Duyệt</b>
            </span>
          );
      },
    },
    {
      field: "",
      headerName: "G_NAME",
      width: 250,
      renderCell: (params: any) => {
        if (params.row.PDBV === "P" || params.row.PDBV === null)
          return <span style={{ color: "red" }}>{params.row.G_NAME}</span>;
        return <span style={{ color: "green" }}>{params.row.G_NAME}</span>;
      },
    },
    {
      field: "BANVE",
      headerName: "BANVE",
      width: 250,
      renderCell: (params: any) => {
        let file: any = null;
        const uploadFile2 = async (e: any) => {
          console.log(file);
          if (userData?.MAINDEPTNAME === "KD") {
            uploadQuery(file, params.row.G_CODE + ".pdf", "banve")
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  generalQuery("update_banve_value", {
                    G_CODE: params.row.G_CODE,
                    banvevalue: "Y",
                  })
                    .then((response) => {
                      if (response.data.tk_status !== "NG") {
                        Swal.fire(
                          "Thông báo",
                          "Upload bản vẽ thành công",
                          "success"
                        );
                        let tempycsxdatatable = ycsxdatatable.map(
                          (element, index) => {
                            return element.PROD_REQUEST_NO ===
                              params.row.PROD_REQUEST_NO
                              ? { ...element, BANVE: "Y" }
                              : element;
                          }
                        );
                        setYcsxDataTable(tempycsxdatatable);
                      } else {
                        Swal.fire(
                          "Thông báo",
                          "Upload bản vẽ thất bại",
                          "error"
                        );
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                } else {
                  Swal.fire(
                    "Thông báo",
                    "Upload file thất bại:" + response.data.message,
                    "error"
                  );
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            Swal.fire(
              "Thông báo",
              "Chỉ bộ phận kinh doanh upload được bản vẽ",
              "error"
            );
          }
        };

        let hreftlink = "/banve/" + params.row.G_CODE + ".pdf";
        if (params.row.BANVE === "Y")
          return (
            <span style={{ color: "green" }}>
              <b>
                <a target='_blank' rel='noopener noreferrer' href={hreftlink}>
                  LINK
                </a>
              </b>
            </span>
          );
        else
          return (
            <div className='uploadfile'>
              <IconButton className='buttonIcon' onClick={uploadFile2}>
                <AiOutlineCloudUpload color='yellow' size={15} />
                Upload
              </IconButton>
              <input
                accept='.pdf'
                type='file'
                onChange={(e: any) => {
                  file = e.target.files[0];
                  console.log(file);
                }}
              />
            </div>
          );
      },
    },
    {
      field: "PDBV",
      headerName: "PD BANVE",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.PDBV === "P" || params.row.PDBV === null)
          return (
            <span style={{ color: "red" }}>
              <b>PENDING</b>
            </span>
          );
        return (
          <span style={{ color: "green" }}>
            <b>APPROVED</b>
          </span>
        );
      },
    },
  ];
  const column_excel2 = [
    { field: "id", headerName: "id", width: 180 },
    { field: "PROD_REQUEST_DATE", headerName: "NGAY YC", width: 120 },
    { field: "CODE_50", headerName: "CODE_50", width: 80 },
    { field: "CODE_55", headerName: "CODE_55", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 100 },
    { field: "RIV_NO", headerName: "RIV_NO", width: 80 },
    {
      field: "PROD_REQUEST_QTY",
      headerName: "SL YCSX",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.PROD_REQUEST_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "CUST_CD", headerName: "CUST_CD", width: 80 },
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 120 },
    { field: "REMK", headerName: "REMK", width: 150 },
    { field: "DELIVERY_DT", headerName: "NGAY GH", width: 120 },
    { field: "PO_NO", headerName: "PO_NO", width: 120 },
    { field: "PHANLOAI", headerName: "PHANLOAI", width: 80 },
    {
      field: "CHECKSTATUS",
      headerName: "CHECKSTATUS",
      width: 200,
      renderCell: (params: any) => {
        if (params.row.CHECKSTATUS.slice(0, 2) === "OK") {
          return (
            <span style={{ color: "green" }}>
              <b>{params.row.CHECKSTATUS}</b>
            </span>
          );
        } else if (params.row.CHECKSTATUS.slice(0, 2) === "NG") {
          return (
            <span style={{ color: "red" }}>
              <b>{params.row.CHECKSTATUS}</b>
            </span>
          );
        } else {
          return (
            <span style={{ color: "yellow" }}>
              <b>{params.row.CHECKSTATUS}</b>
            </span>
          );
        }
      },
    },
  ];
  const column_excel_amazon = [
    { field: "id", headerName: "id", width: 50 },
    { field: "DATA", headerName: "DATA", width: 320 },
    {
      field: "CHECKSTATUS",
      headerName: "CHECKSTATUS",
      width: 120,
      renderCell: (params: any) => {
        if (params.row.CHECKSTATUS.slice(0, 2) === "OK") {
          return (
            <span style={{ color: "green" }}>
              <b>{params.row.CHECKSTATUS}</b>
            </span>
          );
        } else if (params.row.CHECKSTATUS.slice(0, 2) === "NG") {
          return (
            <span style={{ color: "red" }}>
              <b>{params.row.CHECKSTATUS}</b>
            </span>
          );
        } else {
          return (
            <span style={{ color: "yellow" }}>{params.row.CHECKSTATUS}</span>
          );
        }
      },
    },
  ];
  const handle_AddPlan = async (
    PROD_REQUEST_NO: string,
    PROD_REQUEST_QTY: number,
    PLAN_EQ: string,
    G_CODE: string
  ) => {
    await generalQuery("addPlanQLSX", {
      PLAN_ID: PROD_REQUEST_NO + "A",
      PLAN_DATE: moment().format("YYYY-MM-DD"),
      PROD_REQUEST_NO: PROD_REQUEST_NO,
      PLAN_QTY: PROD_REQUEST_QTY,
      PLAN_EQ: PLAN_EQ,
      PLAN_FACTORY: "NM1",
      PLAN_LEADTIME: 0,
      STEP: 0,
      PLAN_ORDER: 1,
      PROCESS_NUMBER: 1,
      G_CODE: G_CODE,
      NEXT_PLAN_ID: "X",
    })
      .then((response) => {
        console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadPONO = (G_CODE?: string, CUST_CD?: string) => {
    if(G_CODE !== undefined && CUST_CD !== undefined)
    {
       generalQuery("loadpono", {
        G_CODE: G_CODE,
        CUST_CD: CUST_CD
       })
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            const loaded_data : PONOLIST[] = response.data.data.map((element: PONOLIST, index: number)=> {
            return element;
            })
            //console.log(loaded_data);
            setPONOLIST(loaded_data);            
          } else { 
            setPONOLIST([]);
            //console.log('Không có PO nào cho code này và khách này');           
            //Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
          }
        })
        .catch((error) => {
          console.log(error);
          Swal.fire("Thông báo", " Có lỗi : " + error, "error");
        });
      
    }

  }
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <button
          className='saveexcelbutton'
          onClick={() => {
            SaveExcel(uploadExcelJson, "Uploaded PO");
          }}
        >
          Save Excel
        </button>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }
  function CustomToolbarAmazon() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <button
          className='saveexcelbutton'
          onClick={() => {
            SaveExcel(uploadExcelJson, "Uploaded Amazon");
          }}
        >
          Save Excel
        </button>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        {/*  <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />  */}
        <IconButton
          className='buttonIcon'
          onClick={() => {
            setShowHideSearchDiv(!showhidesearchdiv);
          }}
        >
          <TbLogout color='green' size={15} />
          Show/Hide
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(ycsxdatatable, "YCSX Table");
          }}
        >
          <AiFillFileExcel color='green' size={15} />
          SAVE
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            setSelection({
              ...selection,
              trapo: true,
              thempohangloat: false,
              them1po: !selection.them1po,
              them1invoice: false,
              themycsx: true,
              suaycsx: false,
              inserttableycsx: false,
            });
            clearYCSXform();
          }}
        >
          <AiFillFileAdd color='blue' size={15} />
          NEW YCSX
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            handle_fillsuaform();
          }}
        >
          <AiFillEdit color='orange' size={15} />
          SỬA YCSX
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            handleConfirmDeleteYCSX();
          }}
        >
          <MdOutlineDelete color='red' size={15} />
          XÓA YCSX
        </IconButton>
        <GridToolbarQuickFilter />
        <IconButton
          className='buttonIcon'
          onClick={() => {
            handleConfirmSetClosedYCSX();
          }}
        >
          <FaArrowRight color='green' size={15} />
          SET CLOSED
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            handleConfirmSetPendingYCSX();
          }}
        >
          <MdOutlinePendingActions color='red' size={15} />
          SET PENDING
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            if (ycsxdatatablefilter.length > 0) {
              setSelection({
                ...selection,
                renderycsx: ycsxdatatablefilter.length > 0,
              });
              console.log(ycsxdatatablefilter);
              setYCSXListRender(renderYCSX(ycsxdatatablefilter));
            } else {
              Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để in", "error");
            }
          }}
        >
          <AiOutlinePrinter color='#0066ff' size={15} />
          Print YCSX
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            if (ycsxdatatablefilter.length > 0) {
            } else {
              Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để check", "error");
            }
          }}
        >
          <AiOutlinePrinter color='#00701a' size={15} />
          Check Bản Vẽ
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            if (ycsxdatatablefilter.length > 0) {
              setSelection({
                ...selection,
                renderbanve: ycsxdatatablefilter.length > 0,
              });
              setYCSXListRender(renderBanVe(ycsxdatatablefilter));
            } else {
              Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để in", "error");
            }
          }}
        >
          <AiOutlinePrinter color='#ff751a' size={15} />
          Print Bản Vẽ
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            handleConfirmPDuyetYCSX();
          }}
        >
          <FcApprove color='red' size={15} />
          Phê Duyệt
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            handleGoToAmazon();
          }}
        >
          <AiFillAmazonCircle color='red' size={15} />
          Up Amazon
        </IconButton>
      </GridToolbarContainer>
    );
  }
  const handleGoToAmazon = () => {
    console.log(ycsxdatatablefilter.length);
    if (ycsxdatatablefilter.length === 1) {
      setProdRequestNo(
        ycsxdatatablefilter[ycsxdatatablefilter.length - 1].PROD_REQUEST_NO
      );
      handle_findAmazonCodeInfo(
        ycsxdatatablefilter[ycsxdatatablefilter.length - 1].PROD_REQUEST_NO
      );
      setNav(3);
    } else if (ycsxdatatablefilter.length > 1) {
      Swal.fire("Thông báo", "Chỉ chọn 1 YCSX để qua Amazon", "error");
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để qua Amazon", "error");
    }
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handletraYCSX();
    }
  };
  const monthArray = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
  ];
  const dayArray = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
  ];
  const createHeader = async () => {
    //lay gio he thong
    let giohethong: string = "";
    await generalQuery("getSystemDateTime", {})
      .then((response) => {
        //console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          giohethong = response.data.data[0].SYSTEM_DATETIME.slice(0, 10);
        } else {
          Swal.fire(
            "Thông báo",
            "Không lấy được giờ hệ thống: " + response.data.message,
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
    //let year:number = moment(giohethong).year();
    let month: number = moment(giohethong).month();
    let day: number = moment(giohethong).date();
    let yearstr = giohethong.substring(3, 4);
    let monthstr = monthArray[month];
    let daystr = dayArray[day - 1];
    return yearstr + monthstr + daystr;
  };
  const zeroPad = (num: number, places: number) =>
    String(num).padStart(places, "0");
  const process_lot_no_generate = async (machinename: string) => {
    let in_date: string = moment().format("YYYYMMDD");
    let NEXT_PROCESS_LOT_NO: string = machinename + (await createHeader());
    await generalQuery("getLastProcessLotNo", {
      machine: machinename,
      in_date: in_date,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          console.log(response.data.data);
          NEXT_PROCESS_LOT_NO += zeroPad(
            Number(response.data.data[0].SEQ_NO) + 1,
            3
          );
        } else {
          NEXT_PROCESS_LOT_NO += "001";
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return NEXT_PROCESS_LOT_NO;
  };
  const readUploadFile = (e: any) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        console.log("Vao day");
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
              PHANLOAI: "TT",
            };
          })
        );
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  const handleAmazonData = (
    amazon_data: { id: number; DATA: string; CHECKSTATUS: string }[],
    cavity: number,
    G_CODE: string,
    PROD_REQUEST_NO: string,
    NO_IN: string
  ) => {
    let handled_Amazon_Table: UploadAmazonData[] = [];
    if (amazon_data.length % cavity !== 0) {
      Swal.fire("Thông báo", "Số dòng lẻ so với cavity", "error");
    } else {
      for (let i = 1; i <= amazon_data.length / cavity; i++) {
        let temp_amazon_row: UploadAmazonData = {};
        temp_amazon_row.G_CODE = G_CODE;
        temp_amazon_row.PROD_REQUEST_NO = PROD_REQUEST_NO;
        temp_amazon_row.NO_IN = NO_IN;
        temp_amazon_row.ROW_NO = i;
        if (cavity === 1) {
          temp_amazon_row.DATA1 = amazon_data[i].DATA;
        } else if (cavity === 2) {
          temp_amazon_row.DATA1 = amazon_data[i * cavity - 2].DATA;
          temp_amazon_row.DATA2 = amazon_data[i * cavity - 1].DATA;
        } else if (cavity === 3) {
          temp_amazon_row.DATA1 = amazon_data[i * cavity - 3].DATA;
          temp_amazon_row.DATA2 = amazon_data[i * cavity - 2].DATA;
          temp_amazon_row.DATA3 = amazon_data[i * cavity - 1].DATA;
        } else if (cavity === 4) {
          temp_amazon_row.DATA1 = amazon_data[i * cavity - 4].DATA;
          temp_amazon_row.DATA2 = amazon_data[i * cavity - 3].DATA;
          temp_amazon_row.DATA3 = amazon_data[i * cavity - 2].DATA;
          temp_amazon_row.DATA4 = amazon_data[i * cavity - 1].DATA;
        }
        temp_amazon_row.INLAI_COUNT = 0;
        temp_amazon_row.REMARK = "";
        handled_Amazon_Table.push(temp_amazon_row);
        //console.log(temp_amazon_row);
      }
    }
    //console.log(handled_Amazon_Table);
    return handled_Amazon_Table;
  };
  const checkDuplicateAMZ = async () => {
    let isDuplicated: boolean = false;
    Swal.fire({
      title: "Check trùng",
      text: "Đang check trùng AMZ DATA",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    await generalQuery("checktrungAMZ_Full", {})
      .then((response) => {
        console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          isDuplicated = true;
          Swal.fire(
            "Thông báo",
            "Yêu cầu có data trùng: " +
              response.data.data[0].PROD_REQUEST_NO +
              "______ ID công việc của data trùng: " +
              response.data.data[0].NO_IN,
            "error"
          );
        } else {
          Swal.fire("Thông báo", "Không có dòng trùng", "success");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return isDuplicated;
  };
  const upAmazonData = async () => {
    let isDuplicated: boolean = false;
    isDuplicated = await checkDuplicateAMZ();
    if (!isDuplicated) {
      let uploadAmazonData = handleAmazonData(
        uploadExcelJson,
        cavityAmazon,
        codeCMS,
        prodrequestno,
        id_congviec
      );
      //console.log(uploadAmazonData);
      let checkIDcongViecTonTai: boolean = false;
      await generalQuery("checkIDCongViecAMZ", {
        NO_IN: id_congviec,
      })
        .then((response) => {
          console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            checkIDcongViecTonTai = true;
          } else {
            checkIDcongViecTonTai = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      //if (!AMZ_check_flag) {
      if (false) {
        Swal.fire("Thông báo", "Hãy check data trước khi up", "error");
      } else {
        if (!checkIDcongViecTonTai) {
          for (let i = 0; i < uploadAmazonData.length; i++) {
            await generalQuery("insertData_Amazon", {
              G_CODE: uploadAmazonData[i].G_CODE,
              PROD_REQUEST_NO: uploadAmazonData[i].PROD_REQUEST_NO,
              NO_IN: uploadAmazonData[i].NO_IN,
              ROW_NO: uploadAmazonData[i].ROW_NO,
              DATA_1:
                uploadAmazonData[i].DATA1 === undefined
                  ? ""
                  : uploadAmazonData[i].DATA1,
              DATA_2:
                uploadAmazonData[i].DATA2 === undefined
                  ? ""
                  : uploadAmazonData[i].DATA2,
              DATA_3:
                uploadAmazonData[i].DATA3 === undefined
                  ? ""
                  : uploadAmazonData[i].DATA3,
              DATA_4:
                uploadAmazonData[i].DATA4 === undefined
                  ? ""
                  : uploadAmazonData[i].DATA4,
              PRINT_STATUS: "",
              INLAI_COUNT: 0,
              REMARK: "0109",
              INS_EMPL: userData?.EMPL_NO,
            })
              .then((response) => {
                console.log(response.data.tk_status);
                if (response.data.tk_status !== "NG") {
                  setProgressValue((i + 1) * 2);
                } else {
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
          checkDuplicateAMZ();
          //Swal.fire("Thông báo", "Upload data Amazon Hoàn thành", "success");
        } else {
          Swal.fire("Thông báo", "ID công việc đã tồn tại", "error");
        }
      }
    }
  };
  const checkAmazonData = async (
    amazon_data: { id: number; DATA: string; CHECKSTATUS: string }[]
  ) => {
    //Swal.fire("Thông báo","Bắt đầu check Amazon Data","success");
    let err_code: string = "0";
    for (let i = 0; i < amazon_data.length; i++) {
      await generalQuery("check_amazon_data", {
        DATA: amazon_data[i].DATA,
      })
        .then((response) => {
          setProgressValue(i + 1);
          if (response.data.tk_status !== "NG") {
            amazon_data = amazon_data.map((ele, index) => {
              return ele === amazon_data[i]
                ? { ...ele, CHECKSTATUS: "NG" }
                : ele;
              err_code = "NG";
            });
            setUploadExcelJSon(amazon_data);
          } else {
            amazon_data = amazon_data.map((ele, index) => {
              return ele === amazon_data[i]
                ? { ...ele, CHECKSTATUS: "OK" }
                : ele;
            });
            setUploadExcelJSon(amazon_data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (err_code === "0") {
      setAMZ_Check_Flag(true);
    } else {
      setAMZ_Check_Flag(false);
      Swal.fire("Thông báo", " Có lỗi trùng data", "warning");
    }
  };
  const checkAmazonData2 = async (
    amazon_data: { id: number; DATA: string; CHECKSTATUS: string }[]
  ) => {
    //Swal.fire("Thông báo","Bắt đầu check Amazon Data","success");
    let segment: number = 100;
    for (let i = segment; i < amazon_data.length; i += segment + 1) {
      for (let j = segment; j > 1; j--) {
        generalQuery("check_amazon_data", {
          DATA: amazon_data[i - j].DATA,
        })
          .then((response) => {
            setProgressValue(i - j);
            if (response.data.tk_status !== "NG") {
              amazon_data = amazon_data.map((ele, index) => {
                return ele === amazon_data[i - j]
                  ? { ...ele, CHECKSTATUS: "NG" }
                  : ele;
              });
              setUploadExcelJSon(amazon_data);
            } else {
              amazon_data = amazon_data.map((ele, index) => {
                return ele === amazon_data[i - j]
                  ? { ...ele, CHECKSTATUS: "OK" }
                  : ele;
              });
              setUploadExcelJSon(amazon_data);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      await generalQuery("check_amazon_data", {
        DATA: amazon_data[i].DATA,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            setProgressValue(i);
            amazon_data = amazon_data.map((ele, index) => {
              return ele === amazon_data[i]
                ? { ...ele, CHECKSTATUS: "NG" }
                : ele;
            });
            setUploadExcelJSon(amazon_data);
          } else {
            amazon_data = amazon_data.map((ele, index) => {
              return ele === amazon_data[i]
                ? { ...ele, CHECKSTATUS: "OK" }
                : ele;
            });
            setUploadExcelJSon(amazon_data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const readUploadFileAmazon = (e: any) => {
    e.preventDefault();
    if (e.target.files) {
      console.log(e.target.files[0].name);
      let filename: string = e.target.files[0].name;
      let checkmodel: boolean =
        filename.search(prod_model) === -1 ? false : true;
      let checkIDCV: boolean =
        filename.search(id_congviec) === -1 ? false : true;
      if (!checkmodel) {
        Swal.fire("Thông báo", "Nghi vấn sai model", "error");
      } else if (!checkIDCV) {
        Swal.fire("Thông báo", "Không đúng ID công việc đã nhập", "error");
      } else {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          XLSX.utils.sheet_add_aoa(worksheet, [[worksheet.A1.v]], {
            origin: -1,
          });
          XLSX.utils.sheet_add_aoa(worksheet, [["DATA"]], { origin: "A1" });
          const newworksheet = worksheet;
          console.log(worksheet);
          let json: any = XLSX.utils.sheet_to_json(newworksheet);
          console.log(json);
          /* check trung */
          let valueArray = json.map((element: any) => element.DATA);
          //console.log(valueArray);
          var isDuplicate = valueArray.some(function (item: any, idx: number) {
            return valueArray.indexOf(item) !== idx;
          });
          console.log(isDuplicate);
          if (isDuplicate) {
            Swal.fire("Thông báo", "Có giá trị trùng lặp !", "error");
          } else {
            const keys = Object.keys(json[0]);
            let uploadexcelcolumn = keys.map((element, index) => {
              return {
                field: element,
                headerName: element,
                width: 450,
              };
            });
            uploadexcelcolumn.push({
              field: "CHECKSTATUS",
              headerName: "CHECKSTATUS",
              width: 350,
            });
            setColumn_Excel(uploadexcelcolumn);
            let newjson = json.map((element: any, index: number) => {
              return { ...element, id: index, CHECKSTATUS: "Waiting" };
            });
            setUploadExcelJSon(newjson);
          }
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    }
  };
  const handletraYCSX = () => {
    setisLoading(true);
    generalQuery("traYCSXDataFull", {
      alltime: alltime,
      start_date: fromdate,
      end_date: todate,
      cust_name: cust_name,
      codeCMS: codeCMS,
      codeKD: codeKD,
      prod_type: prod_type,
      empl_name: empl_name,
      phanloai: phanloai,
      ycsx_pending: ycsxpendingcheck,
      inspect_inputcheck: inspectInputcheck,
      prod_request_no: prodrequestno,
      material: material,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          //console.log(response.data.data);
          const loadeddata: YCSXTableData[] = response.data.data.map(
            (element: YCSXTableData, index: number) => {
              return {
                ...element,
                PO_TDYCSX:
                  element.PO_TDYCSX === undefined || element.PO_TDYCSX === null
                    ? 0
                    : element.PO_TDYCSX,
                TOTAL_TKHO_TDYCSX:
                  element.TOTAL_TKHO_TDYCSX === undefined ||
                  element.TOTAL_TKHO_TDYCSX === null
                    ? 0
                    : element.TOTAL_TKHO_TDYCSX,
                TKHO_TDYCSX:
                  element.TKHO_TDYCSX === undefined ||
                  element.TKHO_TDYCSX === null
                    ? 0
                    : element.TKHO_TDYCSX,
                BTP_TDYCSX:
                  element.BTP_TDYCSX === undefined ||
                  element.BTP_TDYCSX === null
                    ? 0
                    : element.BTP_TDYCSX,
                CK_TDYCSX:
                  element.CK_TDYCSX === undefined || element.CK_TDYCSX === null
                    ? 0
                    : element.CK_TDYCSX,
                BLOCK_TDYCSX:
                  element.BLOCK_TDYCSX === undefined ||
                  element.BLOCK_TDYCSX === null
                    ? 0
                    : element.BLOCK_TDYCSX,
                FCST_TDYCSX:
                  element.FCST_TDYCSX === undefined ||
                  element.FCST_TDYCSX === null
                    ? 0
                    : element.FCST_TDYCSX,
                W1:
                  element.W1 === undefined || element.W1 === null
                    ? 0
                    : element.W1,
                W2:
                  element.W2 === undefined || element.W2 === null
                    ? 0
                    : element.W2,
                W3:
                  element.W3 === undefined || element.W3 === null
                    ? 0
                    : element.W3,
                W4:
                  element.W4 === undefined || element.W4 === null
                    ? 0
                    : element.W4,
                W5:
                  element.W5 === undefined || element.W5 === null
                    ? 0
                    : element.W5,
                W6:
                  element.W6 === undefined || element.W6 === null
                    ? 0
                    : element.W6,
                W7:
                  element.W7 === undefined || element.W7 === null
                    ? 0
                    : element.W7,
                W8:
                  element.W8 === undefined || element.W8 === null
                    ? 0
                    : element.W8,
                PROD_REQUEST_QTY:
                  element.PROD_REQUEST_QTY === undefined ||
                  element.PROD_REQUEST_QTY === null
                    ? 0
                    : element.PROD_REQUEST_QTY,
              };
            }
          );
          setYcsxDataTable(loadeddata);
          setShowHideSearchDiv(false);
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
  const handle_checkYCSXHangLoat = async () => {
    setisLoading(true);
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      await generalQuery("checkGCodeVer", {
        G_CODE: uploadExcelJson[i].G_CODE,
      })
        .then((response) => {
          //console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            console.log(response.data.data);
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
        tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS =
          "NG: Ngày giao hàng dự kiến không được trước ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      }
    }
    setisLoading(false);
    Swal.fire("Thông báo", "Đã hoàn thành check YCSX hàng loạt", "success");
    setUploadExcelJSon(tempjson);
  };
  const handle_upYCSXHangLoat = async () => {
    setisLoading(true);
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      await generalQuery("checkGCodeVer", {
        G_CODE: uploadExcelJson[i].G_CODE,
      })
        .then((response) => {
          //console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            console.log(response.data.data);
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
        console.log("vao den day");
        let err_code1: number = 0;
        let last_prod_request_no: string = "";
        let next_prod_request_no: string = "";
        let next_header = await createHeader();
        let pobalance_tdycsx: POBALANCETDYCSX = {
          G_CODE: "",
          PO_BALANCE: 0,
        };
        let tonkho_tdycsx: TONKHOTDYCSX = {
          G_CODE: "",
          CHO_KIEM: 0,
          CHO_CS_CHECK: 0,
          CHO_KIEM_RMA: 0,
          TONG_TON_KIEM: 0,
          BTP: 0,
          TON_TP: 0,
          BLOCK_QTY: 0,
          GRAND_TOTAL_STOCK: 0,
        };
        let fcst_tdycsx: FCSTTDYCSX = {
          G_CODE: "",
          W1: 0,
          W2: 0,
          W3: 0,
          W4: 0,
          W5: 0,
          W6: 0,
          W7: 0,
          W8: 0,
        };
        await generalQuery("checkLastYCSX", {})
          .then((response) => {
            console.log(response.data.tk_status);
            if (response.data.tk_status !== "NG") {
              last_prod_request_no = response.data.data[0].PROD_REQUEST_NO;
              next_prod_request_no =
                next_header +
                zeroPad(Number(last_prod_request_no.substring(3, 7)) + 1, 4);
            } else {
              next_prod_request_no = next_header + "0001";
            }
          })
          .catch((error) => {
            console.log(error);
          });
        //check PO Balance, Ton Kho, FCST tai thoi diem YCSX
        await generalQuery("checkpobalance_tdycsx", {
          G_CODE: uploadExcelJson[i].G_CODE,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              console.log(response.data.data);
              pobalance_tdycsx = response.data.data[0];
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
        await generalQuery("checktonkho_tdycsx", {
          G_CODE: uploadExcelJson[i].G_CODE,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              console.log(response.data.data);
              tonkho_tdycsx = response.data.data[0];
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
        await generalQuery("checkfcst_tdycsx", {
          G_CODE: uploadExcelJson[i].G_CODE,
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              console.log(response.data.data);
              fcst_tdycsx = response.data.data[0];
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
        //console.log(await process_lot_no_generate(phanloai));
        if (
          uploadExcelJson[i].G_CODE === "" ||
          uploadExcelJson[i].CUST_CD === "" ||
          uploadExcelJson[i].PROD_REQUEST_QTY === "" ||
          userData?.EMPL_NO === ""
        ) {
          err_code1 = 4;
        }
        console.log("err_Code1 = " + err_code1);
        if (err_code1 === 0) {
          if (uploadExcelJson[i].PHANLOAI === "TT") {
            await generalQuery("insert_ycsx", {
              G_CODE: uploadExcelJson[i].G_CODE,
              CUST_CD: uploadExcelJson[i].CUST_CD,
              REMK: uploadExcelJson[i].REMK,
              PROD_REQUEST_DATE: moment().format("YYYYMMDD"),
              PROD_REQUEST_NO: next_prod_request_no,
              CODE_50: uploadExcelJson[i].CODE_50,
              CODE_03: "01",
              CODE_55: uploadExcelJson[i].CODE_55,
              RIV_NO: "A",
              PROD_REQUEST_QTY: uploadExcelJson[i].PROD_REQUEST_QTY,
              EMPL_NO: userData?.EMPL_NO,
              USE_YN: "Y",
              DELIVERY_DT: uploadExcelJson[i].DELIVERY_DT,
              PO_NO: uploadExcelJson[i].PO_NO === undefined? '': uploadExcelJson[i].PO_NO,
              INS_EMPL: userData?.EMPL_NO,
              UPD_EMPL: userData?.EMPL_NO,
              YCSX_PENDING: 1,
              G_CODE2: uploadExcelJson[i].G_CODE,
              PO_TDYCSX: pobalance_tdycsx.PO_BALANCE,
              TKHO_TDYCSX: tonkho_tdycsx.TON_TP,
              FCST_TDYCSX:
                fcst_tdycsx.W1 +
                fcst_tdycsx.W2 +
                fcst_tdycsx.W3 +
                fcst_tdycsx.W4 +
                fcst_tdycsx.W5 +
                fcst_tdycsx.W6 +
                fcst_tdycsx.W7 +
                fcst_tdycsx.W8,
              W1: fcst_tdycsx.W1,
              W2: fcst_tdycsx.W2,
              W3: fcst_tdycsx.W3,
              W4: fcst_tdycsx.W4,
              W5: fcst_tdycsx.W5,
              W6: fcst_tdycsx.W6,
              W7: fcst_tdycsx.W7,
              W8: fcst_tdycsx.W8,
              BTP_TDYCSX: tonkho_tdycsx.BTP,
              CK_TDYCSX: tonkho_tdycsx.TONG_TON_KIEM,
              PDUYET:
                pobalance_tdycsx.PO_BALANCE > 0 || loaisx === "04" ? 1 : 0,
              BLOCK_TDYCSX: tonkho_tdycsx.BLOCK_QTY,
            })
              .then((response) => {
                console.log(response.data.tk_status);
                if (response.data.tk_status !== "NG") {
                  //Swal.fire("Thông báo", "Thêm YCSX mới thành công", "success");
                  tempjson[i].CHECKSTATUS = "OK: Thêm YCSX mới thành công";
                } else {
                  //Swal.fire("Thông báo", "Thêm YCSX mới thất bại: " +response.data.message , "error");
                  tempjson[i].CHECKSTATUS =
                    "NG: Thêm YCSX mới thất bại" + response.data.message;
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            let next_process_lot_no_p501: string =
              await process_lot_no_generate(newphanloai);
            await generalQuery("insert_ycsx", {
              G_CODE: uploadExcelJson[i].G_CODE,
              CUST_CD: uploadExcelJson[i].CUST_CD,
              REMK: next_process_lot_no_p501,
              PROD_REQUEST_DATE: moment().format("YYYYMMDD"),
              PROD_REQUEST_NO: next_prod_request_no,
              CODE_50: uploadExcelJson[i].CODE_50,
              CODE_03: "01",
              CODE_55: uploadExcelJson[i].CODE_55,
              RIV_NO: "A",
              PROD_REQUEST_QTY: uploadExcelJson[i].PROD_REQUEST_QTY,
              EMPL_NO: userData?.EMPL_NO,
              USE_YN: "Y",
              DELIVERY_DT: uploadExcelJson[i].DELIVERY_DT,
              PO_NO: uploadExcelJson[i].PO_NO === undefined?'':uploadExcelJson[i].PO_NO,
              INS_EMPL: userData?.EMPL_NO,
              UPD_EMPL: userData?.EMPL_NO,
              YCSX_PENDING: 1,
              G_CODE2: uploadExcelJson[i].G_CODE,
              PO_TDYCSX: pobalance_tdycsx.PO_BALANCE,
              TKHO_TDYCSX: tonkho_tdycsx.TON_TP,
              FCST_TDYCSX:
                fcst_tdycsx.W1 +
                fcst_tdycsx.W2 +
                fcst_tdycsx.W3 +
                fcst_tdycsx.W4 +
                fcst_tdycsx.W5 +
                fcst_tdycsx.W6 +
                fcst_tdycsx.W7 +
                fcst_tdycsx.W8,
              W1: fcst_tdycsx.W1,
              W2: fcst_tdycsx.W2,
              W3: fcst_tdycsx.W3,
              W4: fcst_tdycsx.W4,
              W5: fcst_tdycsx.W5,
              W6: fcst_tdycsx.W6,
              W7: fcst_tdycsx.W7,
              W8: fcst_tdycsx.W8,
              BTP_TDYCSX: tonkho_tdycsx.BTP,
              CK_TDYCSX: tonkho_tdycsx.TONG_TON_KIEM,
              PDUYET: pobalance_tdycsx.PO_BALANCE > 0 ? 1 : 0,
              BLOCK_TDYCSX: tonkho_tdycsx.BLOCK_QTY,
            })
              .then((response) => {
                console.log(response.data.tk_status);
                if (response.data.tk_status !== "NG") {
                  //Swal.fire("Thông báo", "Thêm YCSX mới thành công", "success");
                  tempjson[i].CHECKSTATUS = "OK: Thêm YCSX mới thành công";
                } else {
                  //Swal.fire("Thông báo", "Thêm YCSX mới thất bại: " +response.data.message , "error");
                  tempjson[i].CHECKSTATUS =
                    "NG: Thêm YCSX mới thất bại" + response.data.message;
                }
              })
              .catch((error) => {
                console.log(error);
              });
            let next_p500_in_no: string = "";
            //get process_in_no P500
            await generalQuery("checkProcessInNoP500", {})
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  console.log(response.data.data);
                  next_p500_in_no = zeroPad(
                    Number(response.data.data[0].PROCESS_IN_NO) + 1,
                    3
                  );
                } else {
                  next_p500_in_no = "001";
                }
              })
              .catch((error) => {
                console.log(error);
              });
            // them P500
            await generalQuery("insert_p500", {
              in_date: moment().format("YYYYMMDD"),
              next_process_in_no: next_p500_in_no,
              PROD_REQUEST_DATE: moment().format("YYYYMMDD"),
              PROD_REQUEST_NO: next_prod_request_no,
              G_CODE: uploadExcelJson[i].G_CODE,
              EMPL_NO: userData?.EMPL_NO,
              phanloai: newphanloai,
              PLAN_ID: next_prod_request_no + "A",
            })
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  console.log(response.data.data);
                  pobalance_tdycsx = response.data.data[0];
                } else {
                }
              })
              .catch((error) => {
                console.log(error);
              });
            // them P501
            await generalQuery("insert_p501", {
              in_date: moment().format("YYYYMMDD"),
              next_process_in_no: next_p500_in_no,
              EMPL_NO: userData?.EMPL_NO,
              next_process_lot_no: next_process_lot_no_p501,
              next_process_prt_seq: next_process_lot_no_p501.substring(5, 8),
              PROD_REQUEST_DATE: moment().format("YYYYMMDD"),
              PROD_REQUEST_NO: next_prod_request_no,
              PLAN_ID: next_prod_request_no + "A",
            })
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  console.log(response.data.data);
                  pobalance_tdycsx = response.data.data[0];
                } else {
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      } else if (err_code === 1) {
        tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS =
          "NG: Ngày giao hàng dự kiến không được trước ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      }
    }
    setisLoading(false);
    Swal.fire("Thông báo", "Đã hoàn thành Up YCSX hàng loạt", "success");
    setUploadExcelJSon(tempjson);
  };
  const confirmUpYcsxHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn thêm YCSX hàng loạt ?",
      text: "Thêm rồi mà sai, sửa là hơi vất đấy",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn thêm!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành thêm", "Đang thêm YCSX hàng loạt", "success");
        handle_upYCSXHangLoat();
      }
    });
  };
  const confirmCheckYcsxHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn check YCSX hàng loạt ?",
      text: "Sẽ bắt đầu check ycsx hàng loạt",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn check!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành check", "Đang check YCSX hàng loạt", "success");
        handle_checkYCSXHangLoat();
      }
    });
  };
  const getcustomerlist = () => {
    generalQuery("selectcustomerList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setCustomerList(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getcodelist = (G_NAME: string) => {
    generalQuery("selectcodeList", { G_NAME: G_NAME })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          if (!isPending) {
            startTransition(() => {
              setCodeList(response.data.data);
            });
          }
        } else {
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
        inserttableycsx: false,
        amazontab: false,
        traamazdata: false,
      });
    } else if (choose === 2) {
      setSelection({
        ...selection,
        trapo: false,
        thempohangloat: true,
        them1po: true,
        them1invoice: false,
        themycsx: false,
        suaycsx: false,
        inserttableycsx: true,
        amazontab: false,
        traamazdata: false,
      });
      setUploadExcelJSon([]);
    } else if (choose === 3) {
      setSelection({
        ...selection,
        trapo: false,
        thempohangloat: false,
        them1po: false,
        them1invoice: false,
        inserttableycsx: false,
        amazontab: true,
        traamazdata: false,
      });
      setUploadExcelJSon([]);
    } else if (choose === 4) {
      setSelection({
        ...selection,
        trapo: false,
        thempohangloat: false,
        them1po: false,
        them1invoice: false,
        inserttableycsx: false,
        amazontab: false,
        traamazdata: true,
      });
      setUploadExcelJSon([]);
    }
  };
  const handle_add_1YCSX = async () => {
    let err_code: number = 0;
    let last_prod_request_no: string = "";
    let next_prod_request_no: string = "";
    let next_header = await createHeader();
    let pobalance_tdycsx: POBALANCETDYCSX = {
      G_CODE: "",
      PO_BALANCE: 0,
    };
    let tonkho_tdycsx: TONKHOTDYCSX = {
      G_CODE: "",
      CHO_KIEM: 0,
      CHO_CS_CHECK: 0,
      CHO_KIEM_RMA: 0,
      TONG_TON_KIEM: 0,
      BTP: 0,
      TON_TP: 0,
      BLOCK_QTY: 0,
      GRAND_TOTAL_STOCK: 0,
    };
    let fcst_tdycsx: FCSTTDYCSX = {
      G_CODE: "",
      W1: 0,
      W2: 0,
      W3: 0,
      W4: 0,
      W5: 0,
      W6: 0,
      W7: 0,
      W8: 0,
    };
    await generalQuery("checkLastYCSX", {})
      .then((response) => {
        console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          last_prod_request_no = response.data.data[0].PROD_REQUEST_NO;
          next_prod_request_no =
            next_header +
            zeroPad(Number(last_prod_request_no.substring(3, 7)) + 1, 4);
        } else {
          next_prod_request_no = next_header + "0001";
        }
      })
      .catch((error) => {
        console.log(error);
      });
    //check PO Balance, Ton Kho, FCST tai thoi diem YCSX
    await generalQuery("checkpobalance_tdycsx", {
      G_CODE: selectedCode?.G_CODE,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          console.log(response.data.data);
          pobalance_tdycsx = response.data.data[0];
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    await generalQuery("checktonkho_tdycsx", {
      G_CODE: selectedCode?.G_CODE,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          console.log(response.data.data);
          tonkho_tdycsx = response.data.data[0];
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    await generalQuery("checkfcst_tdycsx", {
      G_CODE: selectedCode?.G_CODE,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          console.log(response.data.data);
          fcst_tdycsx = response.data.data[0];
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    //console.log(await process_lot_no_generate(phanloai));
    if (selectedCode?.USE_YN === "N") {
      err_code = 3; // ver bi khoa
    }
    if (
      selectedCode?.G_CODE === "" ||
      selectedCust_CD?.CUST_CD === "" ||
      newycsxqty === "" ||
      userData?.EMPL_NO === ""
    ) {
      err_code = 4;
    }
    if (err_code === 0) {
      if (newphanloai === "TT") {
        await generalQuery("insert_ycsx", {
          G_CODE: selectedCode?.G_CODE,
          CUST_CD: selectedCust_CD?.CUST_CD,
          REMK: newycsxremark,
          PROD_REQUEST_DATE: moment().format("YYYYMMDD"),
          PROD_REQUEST_NO: next_prod_request_no,
          CODE_50: loaixh,
          CODE_03: "01",
          CODE_55: loaisx,
          RIV_NO: "A",
          PROD_REQUEST_QTY: newycsxqty,
          EMPL_NO: userData?.EMPL_NO,
          USE_YN: "Y",
          DELIVERY_DT: moment(deliverydate).format("YYYYMMDD"),
          PO_NO: selectedPoNo?.PO_NO === undefined? '': selectedPoNo?.PO_NO,
          INS_EMPL: userData?.EMPL_NO,
          UPD_EMPL: userData?.EMPL_NO,
          YCSX_PENDING: 1,
          G_CODE2: selectedCode?.G_CODE,
          PO_TDYCSX: pobalance_tdycsx.PO_BALANCE,
          TKHO_TDYCSX: tonkho_tdycsx.TON_TP,
          FCST_TDYCSX:
            fcst_tdycsx.W1 +
            fcst_tdycsx.W2 +
            fcst_tdycsx.W3 +
            fcst_tdycsx.W4 +
            fcst_tdycsx.W5 +
            fcst_tdycsx.W6 +
            fcst_tdycsx.W7 +
            fcst_tdycsx.W8,
          W1: fcst_tdycsx.W1,
          W2: fcst_tdycsx.W2,
          W3: fcst_tdycsx.W3,
          W4: fcst_tdycsx.W4,
          W5: fcst_tdycsx.W5,
          W6: fcst_tdycsx.W6,
          W7: fcst_tdycsx.W7,
          W8: fcst_tdycsx.W8,
          BTP_TDYCSX: tonkho_tdycsx.BTP,
          CK_TDYCSX: tonkho_tdycsx.TONG_TON_KIEM,
          PDUYET: pobalance_tdycsx.PO_BALANCE > 0 || loaisx === "04" ? 1 : 0,
          BLOCK_TDYCSX: tonkho_tdycsx.BLOCK_QTY,
        })
          .then((response) => {
            console.log(response.data.tk_status);
            if (response.data.tk_status !== "NG") {
              Swal.fire("Thông báo", "Thêm YCSX mới thành công", "success");
            } else {
              Swal.fire(
                "Thông báo",
                "Thêm YCSX mới thất bại: " + response.data.message,
                "error"
              );
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        let next_process_lot_no_p501: string = await process_lot_no_generate(
          newphanloai
        );
        await generalQuery("insert_ycsx", {
          G_CODE: selectedCode?.G_CODE,
          CUST_CD: selectedCust_CD?.CUST_CD,
          REMK: next_process_lot_no_p501,
          PROD_REQUEST_DATE: moment().format("YYYYMMDD"),
          PROD_REQUEST_NO: next_prod_request_no,
          CODE_50: loaixh,
          CODE_03: "01",
          CODE_55: loaisx,
          RIV_NO: "A",
          PROD_REQUEST_QTY: newycsxqty,
          EMPL_NO: userData?.EMPL_NO,
          USE_YN: "Y",
          DELIVERY_DT: moment(deliverydate).format("YYYYMMDD"),
          PO_NO: selectedPoNo?.PO_NO === undefined? '': selectedPoNo?.PO_NO,
          INS_EMPL: userData?.EMPL_NO,
          UPD_EMPL: userData?.EMPL_NO,
          YCSX_PENDING: 1,
          G_CODE2: selectedCode?.G_CODE,
          PO_TDYCSX: pobalance_tdycsx.PO_BALANCE,
          TKHO_TDYCSX: tonkho_tdycsx.TON_TP,
          FCST_TDYCSX:
            fcst_tdycsx.W1 +
            fcst_tdycsx.W2 +
            fcst_tdycsx.W3 +
            fcst_tdycsx.W4 +
            fcst_tdycsx.W5 +
            fcst_tdycsx.W6 +
            fcst_tdycsx.W7 +
            fcst_tdycsx.W8,
          W1: fcst_tdycsx.W1,
          W2: fcst_tdycsx.W2,
          W3: fcst_tdycsx.W3,
          W4: fcst_tdycsx.W4,
          W5: fcst_tdycsx.W5,
          W6: fcst_tdycsx.W6,
          W7: fcst_tdycsx.W7,
          W8: fcst_tdycsx.W8,
          BTP_TDYCSX: tonkho_tdycsx.BTP,
          CK_TDYCSX: tonkho_tdycsx.TONG_TON_KIEM,
          PDUYET: pobalance_tdycsx.PO_BALANCE > 0 ? 1 : 0,
          BLOCK_TDYCSX: tonkho_tdycsx.BLOCK_QTY,
        })
          .then((response) => {
            console.log(response.data.tk_status);
            if (response.data.tk_status !== "NG") {
              Swal.fire("Thông báo", "Thêm YCSX mới thành công", "success");
            } else {
              Swal.fire(
                "Thông báo",
                "Thêm YCSX mới thất bại: " + response.data.message,
                "error"
              );
            }
          })
          .catch((error) => {
            console.log(error);
          });
        let next_p500_in_no: string = "";
        //get process_in_no P500
        await generalQuery("checkProcessInNoP500", {})
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              console.log(response.data.data);
              next_p500_in_no = zeroPad(
                Number(response.data.data[0].PROCESS_IN_NO) + 1,
                3
              );
            } else {
              next_p500_in_no = "001";
            }
          })
          .catch((error) => {
            console.log(error);
          });
        // them P500
        await generalQuery("insert_p500", {
          in_date: moment().format("YYYYMMDD"),
          next_process_in_no: next_p500_in_no,
          PROD_REQUEST_DATE: moment().format("YYYYMMDD"),
          PROD_REQUEST_NO: next_prod_request_no,
          G_CODE: selectedCode?.G_CODE,
          EMPL_NO: userData?.EMPL_NO,
          phanloai: newphanloai,
          PLAN_ID: next_prod_request_no + "A",
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              console.log(response.data.data);
              pobalance_tdycsx = response.data.data[0];
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
        // them P501
        await generalQuery("insert_p501", {
          in_date: moment().format("YYYYMMDD"),
          next_process_in_no: next_p500_in_no,
          EMPL_NO: userData?.EMPL_NO,
          next_process_lot_no: next_process_lot_no_p501,
          next_process_prt_seq: next_process_lot_no_p501.substring(5, 8),
          PROD_REQUEST_DATE: moment().format("YYYYMMDD"),
          PROD_REQUEST_NO: next_prod_request_no,
          PLAN_ID: next_prod_request_no + "A",
        })
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              console.log(response.data.data);
              pobalance_tdycsx = response.data.data[0];
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else if (err_code === 1) {
      //Swal.fire("Thông báo", "NG: Đã tồn tại PO" , "error");
    } else if (err_code === 2) {
      Swal.fire(
        "Thông báo",
        "NG: Ngày PO không được trước ngày hôm nay",
        "error"
      );
    } else if (err_code === 3) {
      Swal.fire("Thông báo", "NG: Ver này đã bị khóa", "error");
    } else if (err_code === 4) {
      Swal.fire("Thông báo", "NG: Không để trống thông tin bắt buộc", "error");
    }
  };
  const clearYCSXform = () => {
    setNewDeliveryDate(moment().format("YYYY-MM-DD"));
    setNewYcsxQty("");
    setNewYcsxRemark("");
    setNewPhanLoai("TT");
    setLoaiSX("01");
    setLoaiXH("02");
  };
  const handleYCSXSelectionforUpdate = (ids: GridSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = ycsxdatatable.filter((element: any) =>
      selectedID.has(element.PROD_REQUEST_NO)
    );
    if (datafilter.length > 0) {
      setYcsxDataTableFilter(datafilter);
    } else {
      setYcsxDataTableFilter([]);
      console.log("xoa filter");
    }
  };
  const handleYCSXSelectionforUpdateExcel = (ids: GridSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = uploadExcelJson.filter((element: any) =>
      selectedID.has(element.id)
    );
    //console.log(datafilter);
    if (datafilter.length > 0) {
      setYcsxDataTableFilterExcel(datafilter);
    } else {
      setYcsxDataTableFilterExcel([]);
    }
  };
  const handle_fillsuaform = () => {
    if (ycsxdatatablefilter.length === 1) {
      setSelection({
        ...selection,
        trapo: true,
        thempohangloat: false,
        them1po: !selection.them1po,
        themycsx: false,
        suaycsx: true,
        inserttableycsx: false,
      });
      const selectedCodeFilter: CodeListData = {
        G_CODE: ycsxdatatablefilter[ycsxdatatablefilter.length - 1].G_CODE,
        G_NAME: ycsxdatatablefilter[ycsxdatatablefilter.length - 1].G_NAME,
        USE_YN: "Y",
      };
      const selectedCustomerFilter: CustomerListData = {
        CUST_CD: ycsxdatatablefilter[ycsxdatatablefilter.length - 1].CUST_CD,
        CUST_NAME_KD:
          ycsxdatatablefilter[ycsxdatatablefilter.length - 1].CUST_NAME_KD,
      };
      setSelectedCode(selectedCodeFilter);
      setSelectedCust_CD(selectedCustomerFilter);
      setNewYcsxQty(
        ycsxdatatablefilter[
          ycsxdatatablefilter.length - 1
        ].PROD_REQUEST_QTY.toString()
      );
      setNewYcsxRemark(
        ycsxdatatablefilter[ycsxdatatablefilter.length - 1].REMARK
      );
      setSelectedID(
        ycsxdatatablefilter[ycsxdatatablefilter.length - 1].PROD_REQUEST_NO
      );
      if (
        ycsxdatatablefilter[ycsxdatatablefilter.length - 1].REMARK.substring(
          0,
          2
        ) !== "RB" &&
        ycsxdatatablefilter[ycsxdatatablefilter.length - 1].REMARK.substring(
          0,
          2
        ) !== "HQ"
      ) {
        setNewPhanLoai("TT");
      }
      setNewPhanLoai(
        ycsxdatatablefilter[ycsxdatatablefilter.length - 1].REMARK.substring(
          0,
          2
        )
      );
      setLoaiSX(ycsxdatatablefilter[ycsxdatatablefilter.length - 1].PHAN_LOAI);
      setLoaiXH(ycsxdatatablefilter[ycsxdatatablefilter.length - 1].LOAIXH);
    } else if (ycsxdatatablefilter.length === 0) {
      clearYCSXform();
      Swal.fire("Thông báo", "Lỗi: Chọn ít nhất 1 YCSX để sửa", "error");
    } else {
      Swal.fire("Thông báo", "Lỗi: Chỉ tích chọn 1 dòng để sửa thôi", "error");
    }
  };
  const updateYCSX = async () => {
    if (
      userData?.EMPL_NO === "LVT1906" ||
      userData?.EMPL_NO === "lvt1906" ||
      userData?.EMPL_NO === "nhu1903" ||
      userData?.EMPL_NO === "NHU1903"
    ) {
      let err_code: number = 0;
      await generalQuery("checkYcsxExist", {
        PROD_REQUEST_NO: selectedID,
      })
        .then((response) => {
          console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
          } else {
            err_code = 1;
            //tempjson[i].CHECKSTATUS = "NG: Không tồn tại YCSX";
          }
        })
        .catch((error) => {
          console.log(error);
        });
      if (
        selectedCode?.G_CODE === "" ||
        selectedCust_CD?.CUST_CD === "" ||
        newycsxqty === ""
      ) {
        err_code = 4;
      }
      if (err_code === 0) {
        await generalQuery("update_ycsx", {
          G_CODE: selectedCode?.G_CODE,
          CUST_CD: selectedCust_CD?.CUST_CD,
          PROD_REQUEST_NO: selectedID,
          REMK: newycsxremark,
          CODE_50: loaixh,
          CODE_55: loaisx,
          PROD_REQUEST_QTY: newycsxqty,
          EMPL_NO: userData?.EMPL_NO,
          DELIVERY_DT: moment(deliverydate).format("YYYYMMDD"),
        })
          .then((response) => {
            console.log(response.data.tk_status);
            if (response.data.tk_status !== "NG") {
              Swal.fire("Thông báo", "Update YCSX thành công", "success");
            } else {
              Swal.fire(
                "Thông báo",
                "Update YCSX thất bại: " + response.data.message,
                "error"
              );
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (err_code === 1) {
        Swal.fire("Thông báo", "NG: Không tồn tại YCSX", "error");
      } else if (err_code === 4) {
        Swal.fire(
          "Thông báo",
          "NG: Không để trống thông tin bắt buộc",
          "error"
        );
      }
    } else {
      Swal.fire("Thông báo", "Không đủ quyền hạn để sửa !", "error");
    }
  };
  const deleteYCSX = async () => {
    if (ycsxdatatablefilter.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < ycsxdatatablefilter.length; i++) {
        if (ycsxdatatablefilter[i].EMPL_NO === userData?.EMPL_NO) {
          let checkO300: boolean = false;
          await generalQuery("checkYCSXQLSXPLAN", {
            PROD_REQUEST_NO: ycsxdatatablefilter[i].PROD_REQUEST_NO,
          })
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
                checkO300 = true;
                err_code = true;
                //Swal.fire("Thông báo", "Delete YCSX thành công", "success");
              } else {
                //Swal.fire("Thông báo", "Update YCSX thất bại: " +response.data.message , "error");
              }
            })
            .catch((error) => {
              console.log(error);
            });
          console.log("O300", checkO300);
          if (checkO300) {
            Swal.fire(
              "Thông báo",
              "Xóa YCSX thất bại, ycsx đã được xuất liệu: ",
              "error"
            );
          } else {
            await generalQuery("delete_ycsx", {
              PROD_REQUEST_NO: ycsxdatatablefilter[i].PROD_REQUEST_NO,
            })
              .then((response) => {
                console.log(response.data.tk_status);
                if (response.data.tk_status !== "NG") {
                  //Swal.fire("Thông báo", "Delete YCSX thành công", "success");
                } else {
                  //Swal.fire("Thông báo", "Update YCSX thất bại: " +response.data.message , "error");
                  err_code = true;
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      }
      if (!err_code) {
        Swal.fire(
          "Thông báo",
          "Xóa YCSX thành công (chỉ PO của người đăng nhập)!",
          "success"
        );
      } else {
        Swal.fire(
          "Thông báo",
          "Có lỗi: Có thể ycsx này đã được đăng ký xuất liệu",
          "error"
        );
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để xóa !", "error");
    }
  };
  const setPDuyetYCSX = async (pduyet_value: number) => {
    if (
      userData?.EMPL_NO === "LVT1906" ||
      userData?.EMPL_NO === "lvt1906" ||
      empl_name === "pd"
    ) {
      if (ycsxdatatablefilter.length >= 1) {
        let err_code: boolean = false;
        for (let i = 0; i < ycsxdatatablefilter.length; i++) {
          await generalQuery("pheduyet_ycsx", {
            PROD_REQUEST_NO: ycsxdatatablefilter[i].PROD_REQUEST_NO,
            PDUYET: pduyet_value,
          })
            .then((response) => {
              console.log(response.data.tk_status);
              if (response.data.tk_status !== "NG") {
              } else {
                err_code = true;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
        if (!err_code) {
          Swal.fire("Thông báo", "SET PDuyet YCSX thành công !", "success");
        } else {
          Swal.fire("Thông báo", "Có lỗi SQL: ", "error");
        }
      } else {
        Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để PDuyet !", "error");
      }
    } else {
      Swal.fire("Thông báo", "Không đủ quyền hạn phê duyệt !", "error");
    }
  };
  const setPendingYCSX = async (pending_value: number) => {
    if (ycsxdatatablefilter.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < ycsxdatatablefilter.length; i++) {
        await generalQuery("setpending_ycsx", {
          PROD_REQUEST_NO: ycsxdatatablefilter[i].PROD_REQUEST_NO,
          YCSX_PENDING: pending_value,
        })
          .then((response) => {
            console.log(response.data.tk_status);
            if (response.data.tk_status !== "NG") {
            } else {
              err_code = true;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (!err_code) {
        Swal.fire(
          "Thông báo",
          "SET YCSX thành công (chỉ PO của người đăng nhập)!",
          "success"
        );
      } else {
        Swal.fire("Thông báo", "Có lỗi SQL: ", "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để SET !", "error");
    }
  };
  const handleConfirmDeleteYCSX = () => {
    Swal.fire({
      title: "Chắc chắn muốn xóa YCSX đã chọn ?",
      text: "Sẽ bắt đầu xóa YCSX đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        //Swal.fire("Thông báo", "Không thể xóa YCSX", "error");
        Swal.fire("Tiến hành Xóa", "Đang Xóa YCSX hàng loạt", "success");
        deleteYCSX();
      }
    });
  };
  const handleConfirmSetPendingYCSX = () => {
    Swal.fire({
      title: "Chắc chắn muốn SET PENDING YCSX đã chọn ?",
      text: "Sẽ bắt đầu SET PENDING YCSX đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Tiến hành SET PENDING",
          "Đang SET PENDING YCSX hàng loạt",
          "success"
        );
        setPendingYCSX(1);
      }
    });
  };
  const handleConfirmSetClosedYCSX = () => {
    Swal.fire({
      title: "Chắc chắn muốn SET CLOSED YCSX đã chọn ?",
      text: "Sẽ bắt đầu SET CLOSED YCSX đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Tiến hành SET CLOSED",
          "Đang SET CLOSED YCSX hàng loạt",
          "success"
        );
        setPendingYCSX(0);
      }
    });
  };
  const handleConfirmPDuyetYCSX = () => {
    Swal.fire({
      title: "Chắc chắn muốn SET Phê duyệt YCSX đã chọn ?",
      text: "Sẽ bắt đầu SET Phê duyệt YCSX đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Phê duyệt!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Tiến hành SET Phê duyệt",
          "Đang SET Phê duyệt YCSX hàng loạt",
          "success"
        );
        setPDuyetYCSX(1);
      }
    });
  };
  const handle_InsertYCSXTable = () => {
    let newycsx_row = {
      PROD_REQUEST_DATE: moment().format("YYYYMMDD"),
      CODE_50: loaixh,
      CODE_55: loaisx,
      PHANLOAI: newphanloai,
      RIV_NO: "A",
      PROD_REQUEST_QTY: newycsxqty,
      G_CODE: selectedCode?.G_CODE,
      CUST_CD: selectedCust_CD?.CUST_CD,
      EMPL_NO: userData?.EMPL_NO,
      REMK: newycsxremark,
      DELIVERY_DT: moment(deliverydate).format("YYYYMMDD"),
      PO_NO: selectedPoNo?.PO_NO,
      CHECKSTATUS: "Waiting",
      id: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
    };
    if (newycsx_row.PROD_REQUEST_QTY === "" || newycsx_row.REMK === "") {
      Swal.fire(
        "Thông báo",
        "Không được để trống thông tin cần thiết",
        "error"
      );
    } else {
      setUploadExcelJSon([...uploadExcelJson, newycsx_row]);
    }
  };
  const handle_DeleteYCSX_Excel = () => {
    if (ycsxdatatablefilterexcel.length > 0) {
      let datafilter = [...uploadExcelJson];
      for (let i = 0; i < ycsxdatatablefilterexcel.length; i++) {
        for (let j = 0; j < datafilter.length; j++) {
          if (ycsxdatatablefilterexcel[i].id === datafilter[j].id) {
            datafilter.splice(j, 1);
          }
        }
      }
      setUploadExcelJSon(datafilter);
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất một dòng để xóa", "error");
    }
  };
  const handle_findAmazonCodeInfo = async (prod_request_no: string) => {
    console.log(prod_request_no);
    await generalQuery("get_ycsxInfo2", { ycsxno: prod_request_no })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          console.log(response.data.data);
          setCodeKD(response.data.data[0].G_NAME);
          setCodeCMS(response.data.data[0].G_CODE);
          setProd_Model(response.data.data[0].PROD_MODEL);
          generalQuery("get_cavityAmazon", {
            g_code: response.data.data[0].G_CODE,
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                console.log(response.data.data);
                setCavityAmazon(response.data.data[0].CAVITY_PRINT);
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const filterOptions1 = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });
  
  //console.log(userData);
  useEffect(() => {
    getcustomerlist();
    getcodelist("");
  }, []);
  return (
    <div className='ycsxmanager'>
      <div className='mininavbar'>
        <div
          className='mininavitem'
          onClick={() => setNav(1)}
          style={{
            backgroundColor: selection.trapo === true ? "#02c712" : "#abc9ae",
            color: selection.trapo === true ? "yellow" : "yellow",
          }}
        >
          <span className='mininavtext'>Tra YCSX</span>
        </div>
        <div
          className='mininavitem'
          onClick={() => setNav(2)}
          style={{
            backgroundColor:
              selection.thempohangloat === true ? "#02c712" : "#abc9ae",
            color: selection.thempohangloat === true ? "yellow" : "yellow",
          }}
        >
          <span className='mininavtext'>ADD YCSX</span>
        </div>
        <div
          className='mininavitem'
          onClick={() => setNav(3)}
          style={{
            backgroundColor:
              selection.amazontab === true ? "#02c712" : "#abc9ae",
            color: selection.amazontab === true ? "yellow" : "yellow",
          }}
        >
          <span className='mininavtext'>Add AMZ Data</span>
        </div>
        <div
          className='mininavitem'
          onClick={() => setNav(4)}
          style={{
            backgroundColor:
              selection.traamazdata === true ? "#02c712" : "#abc9ae",
            color: selection.traamazdata === true ? "yellow" : "yellow",
          }}
        >
          <span className='mininavtext'>TRA AMZ Data</span>
        </div>
      </div>
      {selection.them1po && (       
           <div className='them1ycsx'>
          <div className='formnho'>
            <div className='dangkyform'>              
              <div className='dangkyinput'>
                <div className="dangkyinputbox">
                <label>
                    <b>Khách hàng:</b>{" "}
                    <Autocomplete
                      sx={{fontSize:'0.6rem',}}                      
                      ListboxProps={{ style: { fontSize:'0.7rem',} }}
                      size='small'
                      disablePortal
                      options={customerList}
                      className='autocomplete1'
                      getOptionLabel={(option: CustomerListData) => {
                        return `${option.CUST_CD}: ${option.CUST_NAME_KD}`;
                      }}
                      renderInput={(params) => (
                        <TextField  {...params} fullWidth={true} label='Select customer' />
                      )}
                      value={selectedCust_CD}
                      onChange={(
                        event: any,
                        newValue: CustomerListData | null
                      ) => {
                        console.log(newValue);
                        setSelectedCust_CD(newValue);
                        loadPONO(selectedCode?.G_CODE, newValue?.CUST_CD);
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.CUST_CD === value.CUST_CD
                      }
                    />
                  </label>
                  <label>
                    <b>Code hàng:</b>{" "}
                    <Autocomplete
                      sx={{fontSize:'0.6rem',}}
                      ListboxProps={{ style: { fontSize:'0.7rem' } }}
                      size='small'
                      disablePortal
                      options={codeList}
                      className='autocomplete1'
                      filterOptions={filterOptions1}
                      getOptionLabel={(option: CodeListData | any) =>
                        `${option.G_CODE}: ${option.G_NAME}`
                      }
                      renderInput={(params) => (
                        <TextField {...params} label='Select code' />
                      )}
                      onChange={(event: any, newValue: CodeListData | any) => {
                        console.log(newValue);
                        setSelectedCode(newValue);
                        loadPONO(newValue?.G_CODE,selectedCust_CD?.CUST_CD);
                      }}
                      value={selectedCode}
                      isOptionEqualToValue={(option: any, value: any) =>
                        option.G_CODE === value.G_CODE
                      }
                    />
                  </label>

                </div>
                <div className='dangkyinputbox'>
                  
                  <label>
                    <b>Delivery Date:</b>
                    <input
                      className='inputdata'
                      type='date'
                      value={deliverydate.slice(0, 10)}
                      onChange={(e) => setNewDeliveryDate(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Loại hàng</b>
                    <select
                      name='phanloaihang'
                      value={newphanloai}
                      onChange={(e) => {
                        setNewPhanLoai(e.target.value);
                      }}
                    >
                      <option value='TT'>Hàng Thường (TT)</option>
                      <option value='SP'>Sample sang FL (SP)</option>
                      <option value='RB'>Ribbon (RB)</option>
                      <option value='HQ'>Hàn Quốc (HQ)</option>
                      <option value='VN'>Việt Nam (VN)</option>
                      <option value='AM'>Amazon (AM)</option>
                      <option value='DL'>Đổi LOT (DL)</option>
                      <option value='M4'>NM4 (M4)</option>
                      {/* <option value='SL'>Slitting (SL)</option> */}
                    </select>
                  </label>
                </div>
                <div className="dangkyinputbox">
                <label>
                    <b>Loại sản xuất</b>
                    <select
                      name='loasx'
                      value={loaisx}
                      onChange={(e) => {
                        setLoaiSX(e.target.value);
                      }}
                    >
                      <option value='01'>Thông Thường</option>
                      <option value='02'>SDI</option>
                      <option value='03'>ETC</option>
                      <option value='04'>SAMPLE</option>
                    </select>
                  </label>
                  <label>
                    <b>Loại xuất hàng</b>
                    <select
                      name='loaixh'
                      value={loaixh}
                      onChange={(e) => {
                        setLoaiXH(e.target.value);
                      }}
                    >
                      <option value='01'>GC</option>
                      <option value='02'>SK</option>
                      <option value='03'>KD</option>
                      <option value='04'>VN</option>
                      <option value='05'>SAMPLE</option>
                      <option value='06'>Vai bac 4</option>
                      <option value='07'>ETC</option>
                    </select>
                  </label>
                </div>
                <div className='dangkyinputbox'>                 
                  <label>
                    <b>YCSX QTY:</b>{" "}
                    <TextField
                      value={newycsxqty}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewYcsxQty(e.target.value)
                      }
                      size='small'
                      color='success'
                      className='autocomplete'
                      id='outlined-basic'
                      label='YCSX QTY'
                      variant='outlined'
                    />
                  </label>
                  <label>
                    <b>Remark:</b>{" "}
                    <TextField
                      value={newycsxremark}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewYcsxRemark(e.target.value)
                      }
                      size='small'
                      color='success'
                      className='autocomplete'
                      id='outlined-basic'
                      label='Remark'
                      variant='outlined'
                    />
                  </label>
                </div>
                <div className='dangkyinputbox'>
                  <label>
                    <b>PO NO</b>
                    <Autocomplete
                      size='small'
                      disablePortal
                      options={ponolist}
                      className='pono_autocomplete'
                      getOptionLabel={(option: PONOLIST | any) => {
                        return `${moment.utc(option.PO_DATE).isValid()? moment.utc(option.PO_DATE).format('YYYY-MM-DD'): ''}| ${option.PO_NO}`;
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label='Select PO NO' />
                      )}
                      value={selectedPoNo}
                      onChange={(
                        event: any,
                        newValue: PONOLIST | null
                      ) => {
                        console.log(newValue);
                        setSelectedPoNo(newValue);
                        setNewDeliveryDate(newValue?.RD_DATE===undefined? moment.utc().format('YYYY-MM-DD'): newValue?.RD_DATE);
                        setNewYcsxQty(newValue?.PO_QTY === undefined? '' : newValue?.PO_QTY.toString());

                        
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.PO_NO === value.PO_NO
                      }
                    />
                  </label>                 
                </div>
              </div>
              <div className='dangkybutton'>
                {selection.themycsx && (
                  <button
                    className='thembutton'
                    onClick={() => {
                      handle_add_1YCSX();
                    }}
                  >
                    Add
                  </button>
                )}
                {selection.inserttableycsx && (
                  <button
                    className='thembutton'
                    onClick={() => {
                      handle_InsertYCSXTable();
                    }}
                  >
                    Insert
                  </button>
                )}
                {selection.suaycsx && (
                  <button
                    className='suabutton'
                    onClick={() => {
                      updateYCSX();
                    }}
                  >
                    Update
                  </button>
                )}
                <button
                  className='xoabutton'
                  onClick={() => {
                    clearYCSXform();
                  }}
                >
                  Clear
                </button>
                <button
                  className='closebutton'
                  onClick={() => {
                    setSelection({ ...selection, them1po: false });
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
       
       
      )}
      {selection.thempohangloat && (
        <div className='newycsx'>         
          <div className='batchnewycsx'>
            <form className='formupload'>
              <label htmlFor='upload'>
                <b>Chọn file Excel: </b>
                <input
                  className='selectfilebutton'
                  type='file'
                  name='upload'
                  id='upload'
                  onChange={(e: any) => {
                    readUploadFile(e);
                  }}
                />
              </label>
              <div className='ycsxbutton'>
                <div
                  className='checkpobutton'
                  onClick={(e) => {
                    e.preventDefault();
                    confirmCheckYcsxHangLoat();
                  }}
                >
                  Check YCSX
                </div>
                <div
                  className='uppobutton'
                  onClick={(e) => {
                    e.preventDefault();
                    confirmUpYcsxHangLoat();
                  }}
                >
                  Up YCSX
                </div>
                <div
                  className='clearobutton'
                  onClick={(e) => {
                    e.preventDefault();
                    handle_DeleteYCSX_Excel();
                  }}
                >
                  Clear YCSX
                </div>
              </div>
            </form>
            <div className='insertYCSXTable'>
              {true && (
                <DataGrid
                  sx={{ fontSize: "0.7rem" }}
                  components={{
                    Toolbar: CustomToolbar,
                    LoadingOverlay: LinearProgress,
                  }}
                  loading={isLoading}
                  rowHeight={35}
                  rows={uploadExcelJson}
                  columns={column_excel2}
                  rowsPerPageOptions={[
                    5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
                  ]}
                  editMode='row'
                  getRowHeight={() => "auto"}
                  checkboxSelection
                  onSelectionModelChange={(ids) => {
                    handleYCSXSelectionforUpdateExcel(ids);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {selection.trapo && (
        <div className='tracuuYCSX'>
          {showhidesearchdiv && <div className='tracuuYCSXform'>
            <div className='forminput'>
              <div className='forminputcolumn'>
                <label>
                  <b>Từ ngày:</b>
                  <input
                    onKeyDown={(e) => {
                      handleSearchCodeKeyDown(e);
                    }}
                    type='date'
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
                    onKeyDown={(e) => {
                      handleSearchCodeKeyDown(e);
                    }}
                    type='text'
                    placeholder='GH63-xxxxxx'
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
                    type='text'
                    placeholder='7C123xxx'
                    value={codeCMS}
                    onChange={(e) => setCodeCMS(e.target.value)}
                  ></input>
                </label>
              </div>
              <div className='forminputcolumn'>
                <label>
                  <b>Tên nhân viên:</b>{" "}
                  <input
                    onKeyDown={(e) => {
                      handleSearchCodeKeyDown(e);
                    }}
                    type='text'
                    placeholder='Trang'
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
                    type='text'
                    placeholder='SEVT'
                    value={cust_name}
                    onChange={(e) => setCust_Name(e.target.value)}
                  ></input>
                </label>
              </div>
              <div className='forminputcolumn'>
                <label>
                  <b>Loại sản phẩm:</b>{" "}
                  <input
                    onKeyDown={(e) => {
                      handleSearchCodeKeyDown(e);
                    }}
                    type='text'
                    placeholder='TSP'
                    value={prod_type}
                    onChange={(e) => setProdType(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Số YCSX:</b>{" "}
                  <input
                    onKeyDown={(e) => {
                      handleSearchCodeKeyDown(e);
                    }}
                    type='text'
                    placeholder='12345'
                    value={prodrequestno}
                    onChange={(e) => setProdRequestNo(e.target.value)}
                  ></input>
                </label>
              </div>
              <div className='forminputcolumn'>
                <label>
                  <b>Phân loại:</b>
                  <select
                    name='phanloai'
                    value={phanloai}
                    onChange={(e) => {
                      setPhanLoai(e.target.value);
                    }}
                  >
                    <option value='00'>ALL</option>
                    <option value='01'>Thông thường</option>
                    <option value='02'>SDI</option>
                    <option value='03'>GC</option>
                    <option value='04'>SAMPLE</option>
                    <option value='22'>NOT SAMPLE</option>
                  </select>
                </label>
                <label>
                  <b>Vật liệu:</b>{" "}
                  <input
                    onKeyDown={(e) => {
                      handleSearchCodeKeyDown(e);
                    }}
                    type='text'
                    placeholder='SJ-203020HC'
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                  ></input>
                </label>
              </div>
              <div className='forminputcolumn'>
                <label>
                  <b>YCSX Pending:</b>
                  <input
                    onKeyDown={(e) => {
                      handleSearchCodeKeyDown(e);
                    }}
                    type='checkbox'
                    name='alltimecheckbox'
                    defaultChecked={ycsxpendingcheck}
                    onChange={() => setYCSXPendingCheck(!ycsxpendingcheck)}
                  ></input>
                </label>
                <label>
                  <b>Vào kiểm:</b>
                  <input
                    onKeyDown={(e) => {
                      handleSearchCodeKeyDown(e);
                    }}
                    type='checkbox'
                    name='alltimecheckbox'
                    defaultChecked={inspectInputcheck}
                    onChange={() => setInspectInputCheck(!inspectInputcheck)}
                  ></input>
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
              <IconButton
                className='buttonIcon'
                onClick={() => {
                  handletraYCSX();
                }}
              >
                <FcSearch color='green' size={30} />
                Search
              </IconButton>
            </div>
          </div>}
          <div className='tracuuYCSXTable'>
            <DataGrid
              sx={{ fontSize: "0.7rem" }}
              components={{
                Toolbar: CustomToolbarPOTable,
                LoadingOverlay: LinearProgress,
              }}
              loading={isLoading}
              rowHeight={30}
              rows={ycsxdatatable}
              columns={column_ycsxtable}
              rowsPerPageOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
              ]}
              editMode='row'
              getRowId={(row) => row.PROD_REQUEST_NO}
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={(ids) => {
                handleYCSXSelectionforUpdate(ids);
              }}
            />
          </div>
        </div>
      )}
      {selection.renderycsx && (
        <div className='printycsxpage'>
          <div className='buttongroup'>
            <Button
              onClick={() => {
                setYCSXListRender(renderYCSX(ycsxdatatablefilter));
              }}
            >
              Render YCSX
            </Button>
            <Button onClick={handlePrint}>Print YCSX</Button>
            <Button
              onClick={() => {
                setSelection({ ...selection, renderycsx: false });
              }}
            >
              Close
            </Button>
          </div>
          <div className='ycsxrender' ref={ycsxprintref}>
            {ycsxlistrender}
          </div>
        </div>
      )}
      {selection.renderbanve && (
        <div className='printycsxpage'>
          <div className='buttongroup'>
            <button
              onClick={() => {
                setYCSXListRender(renderBanVe(ycsxdatatablefilter));
              }}
            >
              Render Bản Vẽ
            </button>
            <button onClick={handlePrint}>Print Bản Vẽ</button>
            <button
              onClick={() => {
                setSelection({ ...selection, renderbanve: false });
              }}
            >
              Close
            </button>
          </div>
          <div className='ycsxrender' ref={ycsxprintref}>
            {ycsxlistrender}
          </div>
        </div>
      )}
      {selection.amazontab && (
        <div className='amazonetab'>
          <div className='newamazon'>            
            <div className='amazonInputform'>
              <div className='forminput'>
                <div className='forminputcolumn'>
                  <label>
                    <b>Số YCSX:</b>{" "}
                    <input
                      type='text'
                      placeholder='1F80008'
                      value={prodrequestno}
                      onChange={(e) => {
                        setProdRequestNo(e.target.value);
                        handle_findAmazonCodeInfo(e.target.value);
                      }}
                    ></input>
                  </label>
                  <label>
                    <b>ID Công việc:</b>{" "}
                    <input
                      type='text'
                      placeholder='CG7607845474986040938'
                      value={id_congviec}
                      onChange={(e) => setID_CongViec(e.target.value)}
                    ></input>
                  </label>
                </div>
                <div className='forminputcolumn'>
                  <div className='prod_request_info'>
                    <div style={{ color: "green" }}>Code KD: {codeKD}</div>
                    <div style={{ color: "red" }}>Code ERP: {codeCMS}</div>
                    <div style={{ color: "blue" }}>
                      Cavity Amazon: {cavityAmazon}
                    </div>
                    <div style={{ color: "black" }}>Model: {prod_model}</div>
                  </div>
                </div>
              </div>
              <form className='formupload'>
                <label htmlFor='upload'>
                  <b>Chọn file Excel: </b>
                  <input
                    className='selectfilebutton'
                    type='file'
                    name='upload'
                    id='upload'
                    onChange={(e: any) => {
                      readUploadFileAmazon(e);
                    }}
                  />
                </label>
                <div
                  className='uppobutton'
                  onClick={(e) => {
                    e.preventDefault();
                    upAmazonData();
                  }}
                >
                  Up
                </div>
                <div
                  className='checkpobutton'
                  onClick={(e) => {
                    e.preventDefault();
                    checkDuplicateAMZ();
                  }}
                >
                  Check
                </div>
                <div
                  className='clearobutton'
                  onClick={(e) => {
                    e.preventDefault();
                    setUploadExcelJSon([]);
                  }}
                >
                  Clear
                </div>
                {progressvalue}/{uploadExcelJson.length}
              </form>
            </div>
            <div className='batchnewycsx'>             
              <div className='insertYCSXTable'>
                {true && (
                  <DataGrid
                    sx={{ fontSize: "0.7rem" }}
                    components={{
                      Toolbar: CustomToolbarAmazon,
                      LoadingOverlay: LinearProgress,
                    }}
                    loading={isLoading}
                    rowHeight={35}
                    rows={uploadExcelJson}
                    columns={column_excel_amazon}
                    rowsPerPageOptions={[
                      5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
                    ]}
                    editMode='row'
                    getRowHeight={() => "auto"}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {selection.traamazdata && (
        <div className='traamazdata'>
          <TraAMZ />
        </div>
      )}
    </div>
  );
};
export default YCSXManager;
