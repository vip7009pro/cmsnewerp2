import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import MACHINE_COMPONENT from "./MACHINE_COMPONENT";
import "./MACHINE.scss";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import YCSXManager from "../../../kinhdoanh/ycsxmanager/YCSXManager";
import moment from "moment";
import { UserContext } from "../../../../api/Context";
import {
  DataGrid,
  GridSelectionModel,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { IconButton, LinearProgress } from "@mui/material";
import {
  AiFillAmazonCircle,
  AiFillEdit,
  AiFillFileAdd,
  AiFillFileExcel,
  AiOutlineCloudUpload,
  AiOutlinePrinter,
} from "react-icons/ai";
import { MdOutlineDelete, MdOutlinePendingActions } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { FcApprove, FcSearch } from "react-icons/fc";
import { SaveExcel } from "../../../../api/GlobalFunction";
import YCSXComponent from "../../../kinhdoanh/ycsxmanager/YCSXComponent/YCSXComponent";
import DrawComponent from "../../../kinhdoanh/ycsxmanager/DrawComponent/DrawComponent";
import { useReactToPrint } from "react-to-print";
import CHITHI_COMPONENT from "../CHITHI/CHITHI_COMPONENT";
const axios = require("axios").default;
interface QLSXPLANDATA {
  id: number,
  PLAN_ID: number;
  PLAN_DATE: string;
  PROD_REQUEST_NO: string;
  PLAN_QTY: number;
  PLAN_EQ: string;
  PLAN_FACTORY: string;
  PLAN_LEADTIME: number;
  INS_EMPL: string;
  INS_DATE: string;
  UPD_EMPL: string;
  UPD_DATE: string;
  G_NAME: string;
  G_NAME_KD: string;
  PROD_REQUEST_DATE: string;
  PROD_REQUEST_QTY: number;
  STEP: string;
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
const MACHINE = () => {
  const [selection, setSelection] = useState<any>({
    tab1: true,
    tab2: false,
    tab3: false,
    tabycsx: false,
    tabbanve: false,
  });
  const setNav = (choose: number) => {
    if (choose === 1) {
      setSelection({ ...selection, tab1: true, tab2: false, tab3: false });
    } else if (choose === 2) {
      setSelection({ ...selection, tab1: false, tab2: true, tab3: false });
    } else if (choose === 3) {
      setSelection({ ...selection, tab1: false, tab2: false, tab3: true });
    }
  };
  const [plandatatable, setPlanDataTable] = useState<QLSXPLANDATA[]>([]);
  const [showplanwindow, setShowPlanWindow] = useState(true);
  const [userData, setUserData] = useContext(UserContext);
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [empl_name, setEmpl_Name] = useState("");
  const [cust_name, setCust_Name] = useState("");
  const [prod_type, setProdType] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [phanloai, setPhanLoai] = useState("00");
  const [material, setMaterial] = useState("");
  const [ycsxdatatable, setYcsxDataTable] = useState<Array<YCSXTableData>>([]);
  const [ycsxdatatablefilter, setYcsxDataTableFilter] = useState<
    Array<YCSXTableData>
  >([]);
  const [qlsxplandatafilter, setQlsxPlanDataFilter] = useState<
    Array<QLSXPLANDATA>
  >([]);

  const [ycsxpendingcheck, setYCSXPendingCheck] = useState(false);
  const [inspectInputcheck, setInspectInputCheck] = useState(false);
  const [ycsxlistrender, setYCSXListRender] = useState<Array<ReactElement>>();
  const [selectedMachine, setSelectedMachine]= useState('FR1');
  const [selectedFactory, setSelectedFactory]= useState('NM1');
  const [showChiThi, setShowChiThi] = useState(true);
  const ycsxprintref = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => ycsxprintref.current,
  });
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
        let upload_url = "http://14.160.33.94:5011/upload";
        const uploadFile = async (e: any) => {
          console.log(file);
          const formData = new FormData();
          formData.append("banve", file);
          formData.append("filename", params.row.G_CODE);
          if (userData.MAINDEPTNAME === "KD") {
            try {
              const response = await axios.post(upload_url, formData);
              //console.log("ket qua");
              //console.log(response);
              if (response.data.tk_status === "OK") {
                //Swal.fire('Thông báo','Upload bản vẽ thành công','success');
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
                      Swal.fire("Thông báo", "Upload bản vẽ thất bại", "error");
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              } else {
                Swal.fire("Thông báo", response.data.message, "error");
              }
              //console.log(response.data);
            } catch (ex) {
              console.log(ex);
            }
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
              <IconButton className='buttonIcon' onClick={uploadFile}>
                <AiOutlineCloudUpload color='yellow' size={25} />
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
  const column_plandatatable =[
    { field: "PLAN_ID", headerName: "PLAN_ID", width: 70 },
    { field: "PLAN_DATE", headerName: "PLAN_DATE", width: 110 },
    { field: "PROD_REQUEST_NO", headerName: "YCSX NO", width: 80 },
    { field: "PROD_REQUEST_DATE", headerName: "YCSX DATE", width: 80 },
    { field: "PROD_REQUEST_QTY", headerName: "YCSX QTY", width: 80 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    { field: "PLAN_EQ", headerName: "PLAN_EQ", width: 80 },
    { field: "PLAN_FACTORY", headerName: "FACTORY", width: 80 },
    { field: "PLAN_QTY", headerName: "PLAN_QTY", width: 80 },
    { field: "STEP", headerName: "STEP", width: 60 },
    { field: "INS_EMPL", headerName: "INS_EMPL", width: 80 },
  ]
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
  const loadQLSXPlan = () => {
    generalQuery("getqlsxplan", { PLAN_DATE: "2022-10-07" })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: QLSXPLANDATA, index: number) => {
              return {
                ...element,
                PLAN_DATE: moment.utc(element.PLAN_DATE).format('YYYY-MM-DD'),
                id: index,
              };
            }
          );
          //console.log(loadeddata);
          setPlanDataTable(loadeddata);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handletraYCSX();
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
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        {/*  <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />  */}
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(ycsxdatatable, "YCSX Table");
          }}
        >
          <AiFillFileExcel color='green' size={25} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />
        <IconButton
          className='buttonIcon'
          onClick={() => {
            handleConfirmSetClosedYCSX();
          }}
        >
          <FaArrowRight color='green' size={25} />
          SET CLOSED
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            handleConfirmSetPendingYCSX();
          }}
        >
          <MdOutlinePendingActions color='red' size={25} />
          SET PENDING
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            if (ycsxdatatablefilter.length > 0) {
              setSelection({
                ...selection,
                tabycsx: ycsxdatatablefilter.length > 0,
              });
              console.log(ycsxdatatablefilter);
              setYCSXListRender(renderYCSX(ycsxdatatablefilter));
            } else {
              Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để in", "error");
            }
          }}
        >
          <AiOutlinePrinter color='#0066ff' size={25} />
          Print YCSX
        </IconButton>
        <IconButton
          className='buttonIcon'
          onClick={() => {
            if (ycsxdatatablefilter.length > 0) {
              setSelection({
                ...selection,
                tabbanve: ycsxdatatablefilter.length > 0,
              });
              setYCSXListRender(renderBanVe(ycsxdatatablefilter));
            } else {
              Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để in", "error");
            }
          }}
        >
          <AiOutlinePrinter color='#ff751a' size={25} />
          Print Bản Vẽ
        </IconButton>
      </GridToolbarContainer>
    );
  }
  function CustomToolbarPLANTABLE() {
    return (
      <GridToolbarContainer>
        {/*  <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />  */}
        <IconButton
          className='buttonIcon'
          onClick={() => {
            SaveExcel(ycsxdatatable, "YCSX Table");
          }}
        >
          <AiFillFileExcel color='green' size={25} />
          SAVE
        </IconButton>
        <GridToolbarQuickFilter />        
        <IconButton
          className='buttonIcon'
          onClick={() => {
            if (ycsxdatatablefilter.length > 0) {
              setShowChiThi(true);
              console.log(ycsxdatatablefilter);
              //setYCSXListRender(renderYCSX(ycsxdatatablefilter));
            } else {
                setShowChiThi(true);
              Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để in", "error");
            }
          }}
        >
          <AiOutlinePrinter color='#0066ff' size={25} />
          Print Chỉ Thị
        </IconButton>      
        <IconButton
          className='buttonIcon'
          onClick={() => {
            if (ycsxdatatablefilter.length > 0) {
              setShowChiThi(true);
              console.log(ycsxdatatablefilter);
              //setYCSXListRender(renderYCSX(ycsxdatatablefilter));
            } else {
              Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để in", "error");
            }
          }}
        >
          <AiOutlinePrinter color='#9066ff' size={25} />
          Print YCKT
        </IconButton>      
      </GridToolbarContainer>
    );
  }
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
  const handleQLSXPlanDataSelectionforUpdate = (ids: GridSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = plandatatable.filter((element: any) =>
      selectedID.has(element.PLAN_ID)
    );
    //console.log(datafilter);
    if (datafilter.length > 0) {
      setQlsxPlanDataFilter(datafilter);
    } else {
        setQlsxPlanDataFilter([]);
      console.log("xoa filter");
    }
  };
  useEffect(() => {
    loadQLSXPlan();
  }, []);
  return (
    <div className='machineplan'>
      <div className='mininavbar'>
        <div className='mininavitem' onClick={() => setNav(1)}>
          <span className='mininavtext'>NM1</span>
        </div>
        <div className='mininavitem' onClick={() => setNav(2)}>
          <span className='mininavtext'>NM2</span>
        </div>
      </div>
      {selection.tab1 && (
        <div className='NM1'>
          <span className='machine_title'>FR-NM1</span>
          <div className='FRlist'>
            <div
              className='machinebutton'
              onClick={() => {
                setShowPlanWindow(true);
                setSelectedFactory("NM1");
                setSelectedMachine("FR1");
              }}
            >
              <MACHINE_COMPONENT
                factory='NM1'
                machine_name='FR1'
                run_stop={1}
                machine_data={plandatatable}
              />
            </div>
            <div
              className='machinebutton'
              onClick={() => {
                setShowPlanWindow(true);
                setSelectedFactory("NM1");
                setSelectedMachine("FR2");
              }}
            >
              <MACHINE_COMPONENT
                factory='NM1'
                machine_name='FR2'
                run_stop={1}
                machine_data={plandatatable}
              />
            </div>
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='FR3'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='FR4'
              run_stop={1}
              machine_data={plandatatable}
            />
          </div>
          <span className='machine_title'>SR-NM1</span>
          <div className='FRlist'>
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='SR1'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='SR2'
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='SR3'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='SR4'
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='SR5'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='SR6'
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='SR7'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='SR8'
              machine_data={plandatatable}
            />
          </div>
          <span className='machine_title'>DC-NM1</span>
          <div className='FRlist'>
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='DC1'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='DC2'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='DC3'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='DC4'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='DC5'
              run_stop={1}
              machine_data={plandatatable}
            />
          </div>
          <span className='machine_title'>ED-NM1</span>
          <div className='EDlist'>
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED1'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED2'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED3'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED4'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED5'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED6'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED7'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED8'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED9'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED10'
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED11'
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED12'
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED13'
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED14'
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED15'
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED16'
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED17'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED18'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED19'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED20'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED21'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED22'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED23'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED24'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED25'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED26'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED27'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED28'
              run_stop={1}
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED29'
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED30'
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED31'
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED32'
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED33'
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED34'
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED35'
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED36'
              machine_data={plandatatable}
            />
            <MACHINE_COMPONENT
              factory='NM1'
              machine_name='ED37'
              machine_data={plandatatable}
            />
          </div>
        </div>
      )}
      {selection.tab2 && (
        <div className='NM2'>
          <span className='machine_title'>FR-NM2</span>
          <div className='FRlist'>
            <MACHINE_COMPONENT factory='NM2' machine_name='FR1' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='FR2' />
            <MACHINE_COMPONENT factory='NM2' machine_name='FR3' />
          </div>
          <span className='machine_title'>ED-NM2</span>
          <div className='EDlist'>
            <MACHINE_COMPONENT factory='NM2' machine_name='ED1' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED2' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED3' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED4' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED5' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED6' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED7' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED8' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED9' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED10' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED11' />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED12' />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED13' />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED14' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED15' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED16' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED17' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED18' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED19' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED20' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED21' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED22' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED23' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED24' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED25' />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED26' />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED27' />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED28' />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED29' />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED30' />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED31' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED32' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED33' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED34' run_stop={1} />
            <MACHINE_COMPONENT factory='NM2' machine_name='ED35' run_stop={1} />
          </div>
        </div>
      )}
      {showplanwindow && (
        <div className='planwindow'>
          <div className='title'>
            {selectedMachine}: {selectedFactory}
            <button
              onClick={() => {
                setShowPlanWindow(false);
              }}
            >
              Close
            </button>
            Plan hiện tại trên máy {selectedMachine}
          </div>
          <div className='content'>
            <div className='ycsxlist'>
              <div className='tracuuYCSX'>
                <div className='tracuuYCSXform'>
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
                        <b>Code CMS:</b>{" "}
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
                          onChange={() =>
                            setYCSXPendingCheck(!ycsxpendingcheck)
                          }
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
                          onChange={() =>
                            setInspectInputCheck(!inspectInputcheck)
                          }
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
                </div>
                <div className='tracuuYCSXTable'>
                  <DataGrid
                    sx={{ fontSize: 12, flex: 1 }}
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
                    onSelectionModelChange={(ids) => {
                      handleYCSXSelectionforUpdate(ids);
                    }}
                  />
                </div>
                {selection.tabycsx && (
                  <div className='printycsxpage'>
                    <div className='buttongroup'>
                      <button
                        onClick={() => {
                          setYCSXListRender(renderYCSX(ycsxdatatablefilter));
                        }}
                      >
                        Render YCSX
                      </button>
                      <button onClick={handlePrint}>Print YCSX</button>
                      <button
                        onClick={() => {
                          setSelection({ ...selection, tabycsx: false });
                        }}
                      >
                        Close
                      </button>
                    </div>
                    <div className='chithirender' ref={ycsxprintref}>
                      {ycsxlistrender}
                    </div>
                  </div>
                )}
                {selection.tabbanve && (
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
                          setSelection({ ...selection, tabbanve: false });
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
                {showChiThi && (
                  <div className='printycsxpage'>
                     <div className='buttongroup'>
                      <button
                        onClick={() => {
                          setYCSXListRender(renderBanVe(ycsxdatatablefilter));
                        }}
                      >
                        Render Chỉ Thị
                      </button>
                      <button onClick={handlePrint}>Print Chỉ Thị</button>
                      <button
                        onClick={() => {
                          setShowChiThi(!showChiThi);
                        }}
                      >
                        Close
                      </button>
                    </div>
                    <CHITHI_COMPONENT />
                  </div>
                )}
              </div>
            </div>
            <div className='planlist'>
              <DataGrid
                sx={{ fontSize: 12, flex: 1 }}
                components={{
                  Toolbar: CustomToolbarPLANTABLE,
                  LoadingOverlay: LinearProgress,
                }}
                loading={isLoading}
                rowHeight={30}
                rows={plandatatable.filter(
                  (element: QLSXPLANDATA, index: number) => {
                    return (
                      element.PLAN_EQ === selectedMachine &&
                      element.PLAN_FACTORY === selectedFactory
                    );
                  }
                )}
                columns={column_plandatatable}
                rowsPerPageOptions={[
                  5, 10, 50, 100, 500, 1000, 5000, 10000, 500000,
                ]}
                editMode='row'
                getRowId={(row) => row.PLAN_ID}
                checkboxSelection
                onSelectionModelChange={(ids) => {
                    handleQLSXPlanDataSelectionforUpdate(ids);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MACHINE;
