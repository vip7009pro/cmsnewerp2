import { IconButton, LinearProgress } from "@mui/material";
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
import { useContext, useEffect, useState, useTransition } from "react";
import { FcSearch } from "react-icons/fc";
import { AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { generalQuery, getAuditMode } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { checkBP, SaveExcel } from "../../../api/GlobalFunction";
import { MdOutlineDelete } from "react-icons/md";
import "./ShortageKD.scss";
import { UserData } from "../../../api/GlobalInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { ShortageData } from "../../../api/GlobalInterface";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
const ShortageKD = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [selection, setSelection] = useState<any>({
    trapo: true,
    thempohangloat: false,
    them1po: false,
    them1invoice: false,
    testinvoicetable: false,
  });
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
  const [alltime, setAllTime] = useState(true);
  const [po_no, setPo_No] = useState("");
  const [material, setMaterial] = useState("");
  const [over, setOver] = useState("");
  const [invoice_no, setInvoice_No] = useState("");
  const [shortagedatatable, setShortageDataTable] = useState<
    Array<ShortageData>
  >([]);
  const [shortagedatatablefilter, setShortageDataTableFilter] = useState<
    Array<ShortageData>
  >([]);
  const column_shortage = [
    { field: "ST_ID", headerName: "ST_ID", width: 50 },
    { field: "PLAN_DATE", headerName: "PLAN_DATE", width: 100 },
    { field: "CUST_NAME_KD", headerName: "KHACH", width: 100 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 180 },
    {
      field: "PO_BALANCE",
      headerName: "TON PO",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {params.row.PO_BALANCE.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "TON_TP",
      headerName: "TON_TP",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {params.row.TON_TP.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "BTP",
      headerName: "BTP",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {params.row.BTP.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "TONG_TON_KIEM",
      headerName: "T_KIEM",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {params.row.TONG_TON_KIEM.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "D1_9H",
      headerName: "D1_9H",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {params.row.D1_9H.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "D1_13H",
      headerName: "D1_13H",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {params.row.D1_9H.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "D1_19H",
      headerName: "D1_19H",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {params.row.D1_9H.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "D1_21H",
      headerName: "D1_21H",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {params.row.D1_9H.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "D1_23H",
      headerName: "D1_23H",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {params.row.D1_9H.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "D2_9H",
      headerName: "D2_9H",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {params.row.D1_9H.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "D2_13H",
      headerName: "D2_13H",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {params.row.D1_9H.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "D2_21H",
      headerName: "D2_21H",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {params.row.D1_9H.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "D3_SANG",
      headerName: "D3_SANG",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "black", fontWeight: "bold" }}>
            {params.row.D1_9H.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "D3_CHIEU",
      headerName: "D3_CHIEU",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "black", fontWeight: "bold" }}>
            {params.row.D1_9H.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "D4_SANG",
      headerName: "D4_SANG",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "black", fontWeight: "bold" }}>
            {params.row.D1_9H.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "D4_CHIEU",
      headerName: "D4_CHIEU",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "black", fontWeight: "bold" }}>
            {params.row.D1_9H.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "TODAY_TOTAL",
      headerName: "TODAY_TOTAL",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#b63dfc", fontWeight: "bold" }}>
            {params.row.TODAY_TOTAL.toLocaleString("en-US")}
          </span>
        );
      },
    },
    {
      field: "TODAY_THIEU",
      headerName: "TODAY_THIEU",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#f21400", fontWeight: "bold" }}>
            {params.row.TODAY_THIEU.toLocaleString("en-US")}
          </span>
        );
      },
    },
    { field: "PRIORITY", headerName: "PRIORITY", width: 100 },
  ];
  const column_excel_shortage = [
    { field: "G_CODE", headerName: "G_CODE", width: 100 },
    { field: "CUST_CD", headerName: "CUST_CD", width: 100 },
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 100 },
    { field: "PLAN_DATE", headerName: "PLAN_DATE", width: 100 },
    { field: "D1_9H", headerName: "D1_9H", width: 100 },
    { field: "D1_13H", headerName: "D1_13H", width: 100 },
    { field: "D1_19H", headerName: "D1_19H", width: 100 },
    { field: "D1_21H", headerName: "D1_21H", width: 100 },
    { field: "D1_23H", headerName: "D1_23H", width: 100 },
    { field: "D2_9H", headerName: "D2_9H", width: 100 },
    { field: "D2_13H", headerName: "D2_13H", width: 100 },
    { field: "D2_21H", headerName: "D2_21H", width: 100 },
    { field: "D3_SANG", headerName: "D3_SANG", width: 100 },
    { field: "D3_CHIEU", headerName: "D3_CHIEU", width: 100 },
    { field: "D4_SANG", headerName: "D4_SANG", width: 100 },
    { field: "D4_CHIEU", headerName: "D4_CHIEU", width: 100 },
    { field: "PRIORITY", headerName: "PRIORITY", width: 100 },
    { field: "CHECKSTATUS", headerName: "CHECKSTATUS", width: 100 },
  ];
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <button
          className="saveexcelbutton"
          onClick={() => {
            SaveExcel(uploadExcelJson, "Uploaded Plan");
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
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <IconButton
          className="buttonIcon"
          onClick={() => {
            SaveExcel(shortagedatatable, "Shortage Table");
          }}
        >
          <AiFillFileExcel color="green" size={15} />
          SAVE
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            /* checkBP(userData?.EMPL_NO,userData?.MAINDEPTNAME,['KD'], handleConfirmDeletePlan); */
            checkBP(
              userData,
              ["KD"],
              ["ALL"],
              ["ALL"],
              handleConfirmDeletePlan,
            );
            //handleConfirmDeletePlan();
          }}
        >
          <MdOutlineDelete color="red" size={15} />
          XÓA PLAN
        </IconButton>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }
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
              D1_9H:
                element.D1_9H === undefined || element.D1_9H === ""
                  ? 0
                  : element.D1_9H,
              D1_13H:
                element.D1_13H === undefined || element.D1_13H === ""
                  ? 0
                  : element.D1_13H,
              D1_19H:
                element.D1_19H === undefined || element.D1_19H === ""
                  ? 0
                  : element.D1_19H,
              D1_21H:
                element.D1_21H === undefined || element.D1_21H === ""
                  ? 0
                  : element.D1_21H,
              D1_23H:
                element.D1_23H === undefined || element.D1_23H === ""
                  ? 0
                  : element.D1_23H,
              D1_OTHER:
                element.D1_OTHER === undefined || element.D1_OTHER === ""
                  ? 0
                  : element.D1_OTHER,
              D2_9H:
                element.D2_9H === undefined || element.D2_9H === ""
                  ? 0
                  : element.D2_9H,
              D2_13H:
                element.D2_13H === undefined || element.D2_13H === ""
                  ? 0
                  : element.D2_13H,
              D2_21H:
                element.D2_21H === undefined || element.D2_21H === ""
                  ? 0
                  : element.D2_21H,
              D3_SANG:
                element.D3_SANG === undefined || element.D3_SANG === ""
                  ? 0
                  : element.D3_SANG,
              D3_CHIEU:
                element.D3_CHIEU === undefined || element.D3_CHIEU === ""
                  ? 0
                  : element.D3_CHIEU,
              D4_SANG:
                element.D4_SANG === undefined || element.D4_SANG === ""
                  ? 0
                  : element.D4_SANG,
              D4_CHIEU:
                element.D4_CHIEU === undefined || element.D4_CHIEU === ""
                  ? 0
                  : element.D4_CHIEU,
              PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
            };
          }),
        );
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  const handle_checkShortageHangLoat = async () => {
    setisLoading(true);
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      await generalQuery("checkShortageExist", {
        G_CODE: uploadExcelJson[i].G_CODE,
        CUST_CD: uploadExcelJson[i].CUST_CD,
        PLAN_DATE: uploadExcelJson[i].PLAN_DATE,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            err_code = 1; //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PLAN";
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      let now = moment();
      let plandate = moment(uploadExcelJson[i].PLAN_DATE);
      if (now < plandate) {
        err_code = 2;
        //tempjson[i].CHECKSTATUS = "NG: Ngày PLAN không được trước ngày hôm nay";
      } else {
        //tempjson[i].CHECKSTATUS = "OK";
      }
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
        tempjson[i].CHECKSTATUS = "NG:Plan đã tồn tại";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS = "NG: Ngày Plan không được sau ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      } else if (err_code === 5) {
        tempjson[i].CHECKSTATUS = "NG: Giao hàng nhiều hơn PO";
      }
    }
    setisLoading(false);
    Swal.fire("Thông báo", "Đã hoàn thành check Plan hàng loạt", "success");
    console.log(tempjson);
    setUploadExcelJSon(tempjson);
  };
  const handle_upShortageHangLoat = async () => {
    setisLoading(true);
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      await generalQuery("checkShortageExist", {
        G_CODE: uploadExcelJson[i].G_CODE,
        CUST_CD: uploadExcelJson[i].CUST_CD,
        PLAN_DATE: uploadExcelJson[i].PLAN_DATE,
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            err_code = 1; //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PLAN";
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      let now = moment();
      let plandate = moment(uploadExcelJson[i].PLAN_DATE);
      if (now < plandate) {
        err_code = 2;
        //tempjson[i].CHECKSTATUS = "NG: Ngày PLAN không được trước ngày hôm nay";
      } else {
        //tempjson[i].CHECKSTATUS = "OK";
      }
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
        await generalQuery("insert_shortage", {
          REMARK: uploadExcelJson[i].REMARK,
          G_CODE: uploadExcelJson[i].G_CODE,
          CUST_CD: uploadExcelJson[i].CUST_CD,
          PLAN_DATE: uploadExcelJson[i].PLAN_DATE,
          EMPL_NO: userData?.EMPL_NO,
          D1_9H: uploadExcelJson[i].D1_9H,
          D1_13H: uploadExcelJson[i].D1_13H,
          D1_19H: uploadExcelJson[i].D1_19H,
          D1_21H: uploadExcelJson[i].D1_21H,
          D1_23H: uploadExcelJson[i].D1_23H,
          D1_OTHER: uploadExcelJson[i].D1_OTHER,
          D2_9H: uploadExcelJson[i].D2_9H,
          D2_13H: uploadExcelJson[i].D2_13H,
          D2_21H: uploadExcelJson[i].D2_21H,
          D3_SANG: uploadExcelJson[i].D3_SANG,
          D3_CHIEU: uploadExcelJson[i].D3_CHIEU,
          D4_SANG: uploadExcelJson[i].D4_SANG,
          D4_CHIEU: uploadExcelJson[i].D4_CHIEU,
          PRIORITY: uploadExcelJson[i].PRIORITY,
          INS_EMPL: userData?.EMPL_NO,
          UPD_EMPL: userData?.EMPL_NO,
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
        tempjson[i].CHECKSTATUS = "NG:Plan đã tồn tại";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS = "NG: Ngày Plan không được sau ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      } else if (err_code === 5) {
        tempjson[i].CHECKSTATUS = "NG: Giao hàng nhiều hơn PO";
      }
    }
    setisLoading(false);
    Swal.fire("Thông báo", "Đã hoàn thành check Plan hàng loạt", "success");
    setUploadExcelJSon(tempjson);
  };
  const confirmUpShortageHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn thêm Plan hàng loạt ?",
      text: "Thêm rồi mà sai, sửa là hơi vất đấy",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn thêm!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành thêm", "Đang thêm Plan hàng loạt", "success");
        handle_upShortageHangLoat();
      }
    });
  };
  const confirmCheckShortageHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn check Plan hàng loạt ?",
      text: "Sẽ bắt đầu check Plan hàng loạt",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn check!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành check", "Đang check Plan hàng loạt", "success");
        handle_checkShortageHangLoat();
      }
    });
  };
  const handleShortageSelectionforUpdate = (ids: GridRowSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = shortagedatatable.filter((element: any) =>
      selectedID.has(element.ST_ID),
    );
    if (datafilter.length > 0) {
      setShortageDataTableFilter(datafilter);
    } else {
      setShortageDataTableFilter([]);
    }
  };
  const deletePlan = async () => {
    if (shortagedatatablefilter.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < shortagedatatablefilter.length; i++) {
        await generalQuery("delete_shortage", {
          ST_ID: shortagedatatablefilter[i].ST_ID,
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
      if (!err_code) {
        Swal.fire(
          "Thông báo",
          "Xóa Plan thành công (chỉ Plan của người đăng nhập)!",
          "success",
        );
        handletraShortage();
      } else {
        Swal.fire("Thông báo", "Có lỗi SQL!", "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 Plan để xóa !", "error");
    }
  };
  const handleConfirmDeletePlan = () => {
    Swal.fire({
      title: "Chắc chắn muốn xóa Plan đã chọn ?",
      text: "Sẽ chỉ xóa Plan do bạn up lên",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Xóa", "Đang Xóa Plan hàng loạt", "success");
        /* checkBP(userData?.EMPL_NO,userData?.MAINDEPTNAME,['KD'], deletePlan); */
        checkBP(userData, ["KD"], ["ALL"], ["ALL"], deletePlan);
        //deletePlan();
      }
    });
  };
  const handletraShortage = () => {
    generalQuery("traShortageKD", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name,
      ST_ID: id,
    })
      .then((response) => {
        //console.log(response.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: ShortageData[] = response.data.data.map(
            (element: ShortageData, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
                PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
              };
            },
          );
          setShortageDataTable(loadeddata);
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
  useEffect(() => {}, []);
  return (
    (<div className="shortage">      
      <Tabs className="tabs">
        <TabList className="tablist" style={{backgroundImage: theme.CMS.backgroundImage, color: 'gray'}}>
          <Tab>
            <span className="mininavtext">Tra Shortage</span>
          </Tab>
          <Tab>
            <span className="mininavtext">Thêm Shortage</span>
          </Tab>
        </TabList>
        <TabPanel>
        <div className="tracuuPlan">
          <div className="tracuuPlanform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
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
                  <b>Tên nhân viên:</b>{" "}
                  <input
                    type="text"
                    placeholder="Trang"
                    value={empl_name}
                    onChange={(e) => setEmpl_Name(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Khách:</b>{" "}
                  <input
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
                    type="text"
                    placeholder="TSP"
                    value={prod_type}
                    onChange={(e) => setProdType(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>ID:</b>{" "}
                  <input
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
                    type="text"
                    placeholder="123abc"
                    value={po_no}
                    onChange={(e) => setPo_No(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Vật liệu:</b>{" "}
                  <input
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
                    type="text"
                    placeholder="OVER"
                    value={over}
                    onChange={(e) => setOver(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Invoice No:</b>{" "}
                  <input
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
                <b>All Time:</b>
                <input
                  type="checkbox"
                  name="alltimecheckbox"
                  defaultChecked={alltime}
                  onChange={() => setAllTime(!alltime)}
                ></input>
              </label>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  handletraShortage();
                }}
              >
                <FcSearch color="green" size={30} />
                Search
              </IconButton>
            </div>
          </div>
          <div className="tracuuPlanTable" style={{ backgroundImage: theme.CMS.backgroundImage }}>
            <DataGrid
              slots={{
                toolbar: CustomToolbarPOTable,
                
              }}
              sx={{ fontSize: "0.7rem" }}
              loading={isLoading}
              rowHeight={30}
              rows={shortagedatatable}
              columns={column_shortage}
              pageSizeOptions={[
                5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
              ]}
              editMode="row"
              getRowId={(row) => row.ST_ID}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(ids) => {
                handleShortageSelectionforUpdate(ids);
              }}
            />
          </div>
        </div>
        </TabPanel>
        <TabPanel>
        <div className="newplan">
          <div className="batchnewplan">
            <h3>Thêm Shortage Hàng Loạt</h3>
            <form className="formupload">
              <label htmlFor="upload">
                <b>Chọn file Excel: </b>
                <input
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
                  confirmCheckShortageHangLoat();
                }}
              >
                Check
              </div>
              <div
                className="uppobutton"
                onClick={(e) => {
                  e.preventDefault();
                  confirmUpShortageHangLoat();
                }}
              >
                Up Shortage
              </div>
            </form>
            <div className="insertPlanTable">
              {true && (
                <DataGrid
                  sx={{ fontSize: "0.7rem" }}
                  slots={{
                    toolbar: CustomToolbar,
                    
                  }}
                  loading={isLoading}
                  rowHeight={35}
                  rows={uploadExcelJson}
                  columns={column_excel_shortage}
                  pageSizeOptions={[
                    5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
                  ]}
                  editMode="row"
                />
              )}
            </div>
          </div>
        </div>

        </TabPanel>
      </Tabs>     
    </div>)
  );
};
export default ShortageKD;
