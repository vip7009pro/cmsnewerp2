import {
  Button,
  Autocomplete,
  IconButton,
  LinearProgress,
  TextField,
  createFilterOptions,
} from "@mui/material";
import {
  Column,
  Editing,
  FilterRow,
  Pager,
  Scrolling,
  SearchPanel,
  Selection,
  DataGrid,
  Paging,
  Toolbar,
  Item,
  Export,
  ColumnChooser,
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";
import moment from "moment";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { FcSearch } from "react-icons/fc";
import {
  AiFillCloseCircle,
  AiFillEdit,
  AiFillFileAdd,
  AiFillFileExcel,
  AiOutlineLogout,
} from "react-icons/ai";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { generalQuery } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import {
  checkBP,
  CustomResponsiveContainer,
  SaveExcel,
  zeroPad,
} from "../../../api/GlobalFunction";
import { MdOutlineDelete, MdOutlinePivotTableChart } from "react-icons/md";
import "./PoManager.scss";
import { FaFileInvoiceDollar } from "react-icons/fa";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotTable from "../../../components/PivotChart/PivotChart";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { TbLogout } from "react-icons/tb";
import {
  CodeListData,
  CustomerListData,
  POSummaryData,
  POTableData,
  PRICEWITHMOQ,
  UserData,
} from "../../../api/GlobalInterface";
import {
  POManagerDiv,
  TotalPOManagerDiv,
} from "../../../components/StyledComponents/ComponentLib";
const PoManager = () => {
  const showhidesearchdiv = useRef(false);
  const [isPending, startTransition] = useTransition();
  const [selection, setSelection] = useState<any>({
    trapo: true,
    thempohangloat: false,
    them1po: false,
    them1invoice: false,
  });
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company
  );
  const [trigger, setTrigger] = useState(true);
  const [sh, setSH] = useState(true);
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
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>({
    G_CODE: "7A00001A",
    G_NAME: "SELECT CODE",
    G_NAME_KD: "SELECT CODE",
    PROD_LAST_PRICE: 0,
    USE_YN: "Y",
    PO_BALANCE: 0,
  });
  const [selectedCust_CD, setSelectedCust_CD] =
    useState<CustomerListData | null>({
      CUST_CD: "0000",
      CUST_NAME_KD: "SELECT_CUSTOMER",
      CUST_NAME: "SELECT_CUSTOMER VINA",
    });
  const [newpodate, setNewPoDate] = useState(moment().format("YYYY-MM-DD"));
  const [newrddate, setNewRdDate] = useState(moment().format("YYYY-MM-DD"));
  const [newpono, setNewPoNo] = useState("");
  const [newpoqty, setNewPoQty] = useState("");
  const [newpoprice, setNewPoPrice] = useState("");
  const [newporemark, setNewPoRemark] = useState("");
  const [newinvoiceQTY, setNewInvoiceQty] = useState<number>(0);
  const [newinvoicedate, setNewInvoiceDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [newinvoiceRemark, setNewInvoiceRemark] = useState("");
  const [poSummary, setPoSummary] = useState<POSummaryData>({
    total_po_qty: 0,
    total_delivered_qty: 0,
    total_pobalance_qty: 0,
    total_po_amount: 0,
    total_delivered_amount: 0,
    total_pobalance_amount: 0,
  });
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [po_no, setPo_No] = useState("");
  const [material, setMaterial] = useState("");
  const [over, setOver] = useState("");
  const [invoice_no, setInvoice_No] = useState("");
  const [podatatable, setPoDataTable] = useState<Array<POTableData>>([]);
  /*   const [podatatablefilter, setPoDataTableFilter] = useState<
    Array<POTableData>
  >([]); */
  const podatatablefilter = useRef<POTableData[]>([]);
  const clickedRow = useRef<any>(null);
  const [selectedID, setSelectedID] = useState<number | null>();
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [newcodeprice, setNewCodePrice] = useState<PRICEWITHMOQ[]>([]);
  const [columns, setColumns] = useState<Array<any>>([]);
  const [columnsExcel, setColumnsExcel] = useState<Array<any>>([]);
  const autogeneratePO_NO = async (cust_cd: string) => {
    let po_no_to_check: string = cust_cd + "_" + moment.utc().format("YYMMDD");
    let next_po_no: string = po_no_to_check + "_001";
    await generalQuery("checkcustomerpono", {
      CHECK_PO_NO: po_no_to_check,
    })
      .then((response) => {
        console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let arr = response.data.data[0].PO_NO.split("_");
          next_po_no = po_no_to_check + "_" + zeroPad(parseInt(arr[2]) + 1, 3);
          console.log("next_PO_NO", next_po_no);
        } else {
          //Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
    return next_po_no;
  };
  const dongboGiaPO = () => {
    generalQuery("dongbogiasptupo", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
        } else {
          //Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
  };
  const loadprice = (G_CODE?: string, CUST_NAME?: string) => {
    if (G_CODE !== undefined && CUST_NAME !== undefined) {
      generalQuery("loadbanggiamoinhat", {
        ALLTIME: true,
        FROM_DATE: "",
        TO_DATE: "",
        M_NAME: "",
        G_CODE: G_CODE,
        G_NAME: "",
        CUST_NAME_KD: CUST_NAME,
      })
        .then((response) => {
          //console.log(response.data.data);
          if (response.data.tk_status !== "NG") {
            let loaded_data: PRICEWITHMOQ[] = [];
            loaded_data =
              company === "CMS"
                ? response.data.data
                  .map((element: PRICEWITHMOQ, index: number) => {
                    return {
                      ...element,
                      PRICE_DATE:
                        element.PRICE_DATE !== null
                          ? moment
                            .utc(element.PRICE_DATE)
                            .format("YYYY-MM-DD")
                          : "",
                      id: index,
                    };
                  })
                  .filter(
                    (element: PRICEWITHMOQ, index: number) =>
                      element.FINAL === "Y"
                  )
                : response.data.data.map(
                  (element: PRICEWITHMOQ, index: number) => {
                    return {
                      ...element,
                      PRICE_DATE:
                        element.PRICE_DATE !== null
                          ? moment
                            .utc(element.PRICE_DATE)
                            .format("YYYY-MM-DD")
                          : "",
                      id: index,
                    };
                  }
                );
            setNewCodePrice(loaded_data);
          } else {
            /* Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error"); */
          }
        })
        .catch((error) => {
          console.log(error);
          Swal.fire("Thông báo", " Có lỗi : " + error, "error");
        });
    }
  };
  const handleSearchCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handletraPO();
    }
  };
  const showNewPO = () => {
    setSelection({
      ...selection,
      trapo: true,
      thempohangloat: false,
      them1po: !selection.them1po,
      them1invoice: false,
    });
    setSelectedCode({
      G_CODE: "7A00001A",
      G_NAME: "SELECT CODE",
      G_NAME_KD: "SELECT CODE",
      PROD_LAST_PRICE: 0,
      USE_YN: "Y",
      PO_BALANCE: 0,
    });
    setSelectedCust_CD({
      CUST_CD: "0000",
      CUST_NAME_KD: "SELECT_CUSTOMER",
      CUST_NAME: "SELECT_CUSTOMER VINA",
    });
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
            return { ...element, CHECKSTATUS: "Waiting", id: index };
          })
        );
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  const handletraPO = () => {
    setisLoading(true);
    Swal.fire({
      title: "Tra cứu PO",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    generalQuery("traPODataFull", {
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
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: POTableData[] = response.data.data.map(
            (element: POTableData, index: number) => {
              return {
                ...element,
                PO_DATE: element.PO_DATE.slice(0, 10),
                RD_DATE: element.RD_DATE.slice(0, 10),
              };
            }
          );
          let po_summary_temp: POSummaryData = {
            total_po_qty: 0,
            total_delivered_qty: 0,
            total_pobalance_qty: 0,
            total_po_amount: 0,
            total_delivered_amount: 0,
            total_pobalance_amount: 0,
          };
          for (let i = 0; i < loadeddata.length; i++) {
            po_summary_temp.total_po_qty += loadeddata[i].PO_QTY;
            po_summary_temp.total_delivered_qty +=
              loadeddata[i].TOTAL_DELIVERED;
            po_summary_temp.total_pobalance_qty += loadeddata[i].PO_BALANCE;
            po_summary_temp.total_po_amount += loadeddata[i].PO_AMOUNT;
            po_summary_temp.total_delivered_amount +=
              loadeddata[i].DELIVERED_AMOUNT;
            po_summary_temp.total_pobalance_amount +=
              loadeddata[i].BALANCE_AMOUNT;
          }
          let keysArray = Object.getOwnPropertyNames(loadeddata[0]);
          let column_map = keysArray.map((e, index) => {
            return {
              dataField: e,
              caption: e,
              width: 100,
              cellRender: (ele: any) => {
                //console.log(ele);
                if (e === "PROD_PRICE") {
                  return (
                    <span style={{ color: "#ED15FF", fontWeight: "normal" }}>
                      {ele.data[e]?.toFixed(6).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })}
                    </span>
                  );
                } else if (
                  ["PO_QTY", "TOTAL_DELIVERED", "PO_BALANCE"].indexOf(e) > -1 ||
                  e.indexOf("RESULT") > -1
                ) {
                  return (
                    <span style={{ color: "blue", fontWeight: "bold" }}>
                      {ele.data[e]?.toLocaleString("en-US")}
                    </span>
                  );
                } else if (
                  ["PO_AMOUNT", "DELIVERED_AMOUNT", "BALANCE_AMOUNT"].indexOf(
                    e
                  ) > -1 ||
                  e.indexOf("_EA") > -1
                ) {
                  return (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      {ele.data[e]?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  );
                } else {
                  return <span>{ele.data[e]}</span>;
                }
              },
            };
          });
          setColumns(column_map);
          setPoSummary(po_summary_temp);
          setPoDataTable(loadeddata);
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
  const handle_checkPOHangLoat = async () => {
    Swal.fire({
      title: "Đang check PO hàng loạt",
      text: "Đang check, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    let keysArray = Object.getOwnPropertyNames(uploadExcelJson[0]);
    let column_map = keysArray.map((e, index) => {
      return {
        dataField: e,
        caption: e,
        width: 100,
        cellRender: (ele: any) => {
          //console.log(ele);
          if (e === "CHECKSTATUS") {
            if (ele.data[e] === "Waiting") {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {ele.data[e]}
                </span>
              );
            } else if (ele.data[e] === "OK") {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {ele.data[e]}
                </span>
              );
            } else {
              return (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {ele.data[e]}
                </span>
              );
            }
          } else {
            return <span>{ele.data[e]}</span>;
          }
        },
      };
    });
    setColumnsExcel(column_map);
    setisLoading(true);
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      await generalQuery("checkPOExist", {
        G_CODE: uploadExcelJson[i].G_CODE,
        CUST_CD: uploadExcelJson[i].CUST_CD,
        PO_NO: uploadExcelJson[i].PO_NO,
      })
        .then((response) => {
          //console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            err_code = 1;
          } else {
            //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
          }
        })
        .catch((error) => {
          console.log(error);
        });
      let now = moment();
      let po_date = moment(uploadExcelJson[i].PO_DATE);
      if (now < po_date) {
        err_code = 2;
        //tempjson[i].CHECKSTATUS = "NG: Ngày PO không được trước ngày hôm nay";
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
        tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS = "NG: Ngày PO không được trước ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      }
    }
    
    Swal.fire("Thông báo", "Đã hoàn thành check PO hàng loạt", "success");
    setUploadExcelJSon(tempjson);
    setTrigger(!trigger);
  };
  const handle_upPOHangLoat = async () => {
    let keysArray = Object.getOwnPropertyNames(uploadExcelJson[0]);
    let column_map = keysArray.map((e, index) => {
      return {
        dataField: e,
        caption: e,
        width: 100,
        cellRender: (ele: any) => {
          //console.log(ele);
          if (e === "CHECKSTATUS") {
            if (ele.data[e] === "Waiting") {
              return (
                <span style={{ color: "blue", fontWeight: "bold" }}>
                  {ele.data[e]}
                </span>
              );
            } else if (ele.data[e] === "OK") {
              return (
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {ele.data[e]}
                </span>
              );
            } else {
              return (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {ele.data[e]}
                </span>
              );
            }
          } else {
            return <span>{ele.data[e]}</span>;
          }
        },
      };
    });
    setColumnsExcel(column_map);
    let tempjson = uploadExcelJson;
    console.log(tempjson);
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      await generalQuery("checkPOExist", {
        G_CODE: uploadExcelJson[i].G_CODE,
        CUST_CD: uploadExcelJson[i].CUST_CD,
        PO_NO: uploadExcelJson[i].PO_NO,
      })
        .then((response) => {
          console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            err_code = 1;
            //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
      let now = moment();
      let po_date = moment(uploadExcelJson[i].PO_DATE);
      if (now < po_date) {
        err_code = 2;
        //tempjson[i].CHECKSTATUS = "NG: Ngày PO không được trước ngày hôm nay";
      } else {
        //tempjson[i].CHECKSTATUS = "OK";
      }
      await generalQuery("checkGCodeVer", {
        G_CODE: uploadExcelJson[i].G_CODE,
      })
        .then((response) => {
          console.log(response.data.tk_status);
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
        await generalQuery("insert_po", {
          G_CODE: uploadExcelJson[i].G_CODE,
          CUST_CD: uploadExcelJson[i].CUST_CD,
          PO_NO: uploadExcelJson[i].PO_NO,
          EMPL_NO: userData?.EMPL_NO,
          PO_QTY: uploadExcelJson[i].PO_QTY,
          PO_DATE: uploadExcelJson[i].PO_DATE,
          RD_DATE: uploadExcelJson[i].RD_DATE,
          PROD_PRICE: uploadExcelJson[i].PROD_PRICE,
          REMARK: uploadExcelJson[i].REMARK,
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
        tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS = "NG: Ngày PO không được trước ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      }
    }
    Swal.fire("Thông báo", "Đã hoàn thành thêm PO hàng loạt", "success");
    setUploadExcelJSon(tempjson);
  };
  const confirmUpPoHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn thêm PO hàng loạt ?",
      text: "Thêm rồi mà sai, sửa là hơi vất đấy",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn thêm!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành thêm", "Đang thêm PO hàng loạt", "success");
        handle_upPOHangLoat();
      }
    });
  };
  const confirmCheckPoHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn check PO hàng loạt ?",
      text: "Sẽ bắt đầu check po hàng loạt",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn check!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành check", "Đang check PO hàng loạt", "success");
        handle_checkPOHangLoat();
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
      });
    } else if (choose === 2) {
      setSelection({
        ...selection,
        trapo: false,
        thempohangloat: true,
        them1po: false,
        them1invoice: false,
      });
    } else if (choose === 3) {
      setSelection({
        ...selection,
        trapo: false,
        thempohangloat: false,
        them1po: true,
        them1invoice: false,
      });
    }
  };
  const handle_add_1PO = async () => {
    let err_code: number = 0;
    await generalQuery("checkPOExist", {
      G_CODE: selectedCode?.G_CODE,
      CUST_CD: selectedCust_CD?.CUST_CD,
      PO_NO: newpono,
    })
      .then((response) => {
        console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          err_code = 1;
          //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    let now = moment();
    let po_date = moment(newpodate);
    if (now < po_date) {
      err_code = 2;
      //tempjson[i].CHECKSTATUS = "NG: Ngày PO không được trước ngày hôm nay";
    } else {
      //tempjson[i].CHECKSTATUS = "OK";
    }
    if (selectedCode?.USE_YN === "N") {
      err_code = 3;
    }
    if (
      selectedCode?.G_CODE === "" ||
      selectedCust_CD?.CUST_CD === "" ||
      newpono === "" ||
      userData?.EMPL_NO === "" ||
      newpoprice === ""
    ) {
      err_code = 4;
    }
    if (err_code === 0) {
      await generalQuery("insert_po", {
        G_CODE: selectedCode?.G_CODE,
        CUST_CD: selectedCust_CD?.CUST_CD,
        PO_NO: newpono,
        EMPL_NO: userData?.EMPL_NO,
        PO_QTY: newpoqty,
        PO_DATE: newpodate,
        RD_DATE: newrddate,
        PROD_PRICE: newpoprice,
        REMARK: newporemark === undefined ? "" : newporemark,
      })
        .then((response) => {
          console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            Swal.fire("Thông báo", "Thêm PO mới thành công", "success");
          } else {
            Swal.fire(
              "Thông báo",
              "Thêm PO mới thất bại: " + response.data.message,
              "error"
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (err_code === 1) {
      Swal.fire("Thông báo", "NG: Đã tồn tại PO", "error");
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
  const handle_add_1Invoice = async () => {
    let err_code: number = 0;
    await generalQuery("checkPOExist", {
      G_CODE: selectedCode?.G_CODE,
      CUST_CD: selectedCust_CD?.CUST_CD,
      PO_NO: newpono,
    })
      .then((response) => {
        console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
        } else {
          err_code = 1;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    let now = moment();
    let invoicedate = moment(newinvoicedate);
    if (now < invoicedate) {
      err_code = 2;
      //tempjson[i].CHECKSTATUS = "NG: Ngày PO không được trước ngày hôm nay";
    } else {
      //tempjson[i].CHECKSTATUS = "OK";
    }
    if (selectedCode?.USE_YN === "N") {
      err_code = 3;
    }
    if (
      selectedCode?.G_CODE === "" ||
      selectedCust_CD?.CUST_CD === "" ||
      newinvoicedate === "" ||
      userData?.EMPL_NO === "" ||
      newinvoiceQTY === 0
    ) {
      err_code = 4;
    }
    if (selectedCode?.PO_BALANCE !== undefined) {
      Swal.fire(
        "Thông báo",
        "PO BALANCE: " + selectedCode?.PO_BALANCE,
        "success"
      );
      if (selectedCode?.PO_BALANCE < newinvoiceQTY) {
        err_code = 5; //invoice nhieu hon po balance
      }
    }
    if (err_code === 0) {
      await generalQuery("insert_invoice", {
        G_CODE: selectedCode?.G_CODE,
        CUST_CD: selectedCust_CD?.CUST_CD,
        PO_NO: newpono,
        EMPL_NO: userData?.EMPL_NO,
        DELIVERY_QTY: newinvoiceQTY,
        PO_DATE: newpodate,
        RD_DATE: newrddate,
        DELIVERY_DATE: newinvoicedate,
        REMARK: newinvoiceRemark,
      })
        .then((response) => {
          console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            Swal.fire("Thông báo", "Thêm Invoice mới thành công", "success");
          } else {
            Swal.fire(
              "Thông báo",
              "Thêm Invoice mới thất bại: " + response.data.message,
              "error"
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (err_code === 1) {
      Swal.fire("Thông báo", "NG: Không tồn tại PO", "error");
    } else if (err_code === 2) {
      Swal.fire(
        "Thông báo",
        "NG: Ngày Invoice không được trước ngày hôm nay",
        "error"
      );
    } else if (err_code === 3) {
      Swal.fire("Thông báo", "NG: Ver này đã bị khóa", "error");
    } else if (err_code === 4) {
      Swal.fire("Thông báo", "NG: Không để trống thông tin bắt buộc", "error");
    } else if (err_code === 5) {
      Swal.fire("Thông báo", "NG: Invoice QTY nhiều hơn PO BALANCE", "error");
    }
  };
  const clearPOform = () => {
    setNewPoDate(moment().format("YYYY-MM-DD"));
    setNewRdDate(moment().format("YYYY-MM-DD"));
    setNewPoNo("");
    setNewPoQty("");
    setNewPoPrice("");
    setNewPoRemark("");
  };
  const clearInvoiceform = () => {
    setNewPoDate(moment().format("YYYY-MM-DD"));
    setNewRdDate(moment().format("YYYY-MM-DD"));
    setNewPoNo("");
    setNewInvoiceQty(0);
    setNewInvoiceDate("");
    setNewInvoiceRemark("");
  };
  const handle_fillsuaform = () => {
    if (clickedRow.current !== null) {
      setSelection({
        ...selection,
        trapo: true,
        thempohangloat: false,
        them1po: !selection.them1po,
      });
      const selectedCodeFilter: CodeListData = {
        G_CODE:
          clickedRow.current?.G_CODE === undefined
            ? ""
            : clickedRow.current?.G_CODE,
        G_NAME:
          clickedRow.current?.G_NAME === undefined
            ? ""
            : clickedRow.current?.G_NAME,
        G_NAME_KD:
          clickedRow.current?.G_NAME_KD === undefined
            ? ""
            : clickedRow.current?.G_NAME_KD,
        PROD_LAST_PRICE: Number(clickedRow.current?.PROD_PRICE),
        USE_YN: "Y",
        PO_BALANCE: Number(clickedRow.current?.PO_BALANCE),
      };
      const selectedCustomerFilter: CustomerListData = {
        CUST_CD:
          clickedRow.current?.CUST_CD === undefined
            ? ""
            : clickedRow.current?.CUST_CD,
        CUST_NAME_KD:
          clickedRow.current?.CUST_NAME_KD === undefined
            ? ""
            : clickedRow.current?.CUST_NAME_KD,
      };
      setSelectedCode(selectedCodeFilter);
      setSelectedCust_CD(selectedCustomerFilter);
      setNewPoDate(
        clickedRow.current?.PO_DATE === undefined
          ? ""
          : clickedRow.current?.PO_DATE
      );
      setNewRdDate(
        clickedRow.current?.RD_DATE === undefined
          ? ""
          : clickedRow.current?.RD_DATE
      );
      setNewPoQty(
        clickedRow.current?.PO_QTY === undefined
          ? "0"
          : clickedRow.current?.PO_QTY
      );
      setNewPoNo(
        clickedRow.current?.PO_NO === undefined ? "" : clickedRow.current?.PO_NO
      );
      setNewPoPrice(
        clickedRow.current?.PROD_PRICE === undefined
          ? "0"
          : clickedRow.current?.PROD_PRICE
      );
      setNewPoRemark(
        clickedRow.current?.REMARK === undefined
          ? ""
          : clickedRow.current?.REMARK
      );
      setSelectedID(clickedRow.current?.PO_ID);
    } else {
      clearPOform();
      Swal.fire("Thông báo", "Lỗi: Chọn ít nhất 1 PO để sửa", "error");
    }
  };
  const handle_fillsuaformInvoice = () => {
    if (clickedRow.current !== null) {
      setSelection({
        ...selection,
        trapo: true,
        thempohangloat: false,
        them1po: false,
        them1invoice: true,
      });
      const selectedCodeFilter: CodeListData = {
        G_CODE:
          clickedRow.current?.G_CODE === undefined
            ? ""
            : clickedRow.current?.G_CODE,
        G_NAME:
          clickedRow.current?.G_NAME === undefined
            ? ""
            : clickedRow.current?.G_NAME,
        G_NAME_KD:
          clickedRow.current?.G_NAME_KD === undefined
            ? ""
            : clickedRow.current?.G_NAME_KD,
        PROD_LAST_PRICE: Number(clickedRow.current?.PROD_PRICE),
        USE_YN: "Y",
        PO_BALANCE: Number(clickedRow.current?.PO_BALANCE),
      };
      const selectedCustomerFilter: CustomerListData = {
        CUST_CD:
          clickedRow.current?.CUST_CD === undefined
            ? ""
            : clickedRow.current?.CUST_CD,
        CUST_NAME_KD:
          clickedRow.current?.CUST_NAME_KD === undefined
            ? ""
            : clickedRow.current?.CUST_NAME_KD,
      };
      setSelectedCode(selectedCodeFilter);
      setSelectedCust_CD(selectedCustomerFilter);
      setNewPoDate(
        clickedRow.current?.PO_DATE === undefined
          ? ""
          : clickedRow.current?.PO_DATE
      );
      setNewRdDate(
        clickedRow.current?.RD_DATE === undefined
          ? ""
          : clickedRow.current?.RD_DATE
      );
      setNewInvoiceQty(0);
      setNewPoNo(
        clickedRow.current?.PO_NO === undefined ? "" : clickedRow.current?.PO_NO
      );
      setNewInvoiceDate(moment().add(-1, "day").format("YYYY-MM-DD"));
      setNewInvoiceRemark("");
      setSelectedID(clickedRow.current?.PO_ID);
    } else {
      clearPOform();
      Swal.fire("Thông báo", "Lỗi: Chọn ít nhất 1 PO để thêm invoice", "error");
    }
  };
  const updatePO = async () => {
    let err_code: number = 0;
    await generalQuery("checkPOExist", {
      G_CODE: selectedCode?.G_CODE,
      CUST_CD: selectedCust_CD?.CUST_CD,
      PO_NO: newpono,
    })
      .then((response) => {
        console.log(response.data.tk_status);
        if (response.data.tk_status !== "NG") {
          //tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
        } else {
          err_code = 1;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    let now = moment();
    let po_date = moment(newpodate);
    if (now < po_date) {
      err_code = 2;
      //tempjson[i].CHECKSTATUS = "NG: Ngày PO không được trước ngày hôm nay";
    } else {
      //tempjson[i].CHECKSTATUS = "OK";
    }
    if (selectedCode?.USE_YN === "N") {
      err_code = 3;
    }
    if (
      selectedCode?.G_CODE === "" ||
      selectedCust_CD?.CUST_CD === "" ||
      newpono === "" ||
      userData?.EMPL_NO === "" ||
      newpoprice === ""
    ) {
      err_code = 4;
    }
    if (err_code === 0) {
      await generalQuery("update_po", {
        G_CODE: selectedCode?.G_CODE,
        CUST_CD: selectedCust_CD?.CUST_CD,
        PO_NO: newpono,
        EMPL_NO: userData?.EMPL_NO,
        PO_QTY: newpoqty,
        PO_DATE: newpodate,
        RD_DATE: newrddate,
        PROD_PRICE: newpoprice,
        REMARK: newporemark,
        PO_ID: selectedID,
      })
        .then((response) => {
          console.log(response.data.tk_status);
          if (response.data.tk_status !== "NG") {
            Swal.fire("Thông báo", "Update Po thành công", "success");
          } else {
            Swal.fire(
              "Thông báo",
              "Update PO thất bại: " + response.data.message,
              "error"
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (err_code === 1) {
      Swal.fire("Thông báo", "NG: Không tồn tại PO", "error");
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
    } else {
      Swal.fire("Thông báo", "Kiểm tra xem PO có giao hàng chưa?", "error");
    }
  };
  const deletePO = async () => {
    if (podatatablefilter.current.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < podatatablefilter.current.length; i++) {
        if (podatatablefilter.current[i].EMPL_NO === userData?.EMPL_NO) {
          await generalQuery("delete_po", {
            PO_ID: podatatablefilter.current[i].PO_ID,
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
        Swal.fire(
          "Thông báo",
          "Xóa PO thành công (chỉ PO của người đăng nhập)!",
          "success"
        );
      } else {
        Swal.fire(
          "Thông báo",
          "Có lỗi, khả năng xóa phải PO đã có phát sinh giao hàng!",
          "error"
        );
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 PO để xóa !", "error");
    }
  };
  const handleConfirmDeletePO = () => {
    Swal.fire({
      title: "Chắc chắn muốn xóa PO đã chọn ?",
      text: "Sẽ bắt đầu xóa po đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Xóa", "Đang Xóa PO hàng loạt", "success");
        deletePO();
      }
    });
  };
  const filterOptions1 = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });
  const dataSource = new PivotGridDataSource({
    fields: [
      {
        caption: "PO_ID",
        width: 80,
        dataField: "PO_ID",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
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
          width: 250,
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
          width: 250,
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
          width: 250,
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
          width: 250,
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
          width: 250,
        },
      },
      {
        caption: "PO_DATE",
        width: 80,
        dataField: "PO_DATE",
        allowSorting: true,
        allowFiltering: true,
        dataType: "date",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
        },
      },
      {
        caption: "RD_DATE",
        width: 80,
        dataField: "RD_DATE",
        allowSorting: true,
        allowFiltering: true,
        dataType: "date",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
        },
      },
      {
        caption: "PROD_PRICE",
        width: 80,
        dataField: "PROD_PRICE",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
        },
      },
      {
        caption: "PO_QTY",
        width: 80,
        dataField: "PO_QTY",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
        },
      },
      {
        caption: "TOTAL_DELIVERED",
        width: 80,
        dataField: "TOTAL_DELIVERED",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
        },
      },
      {
        caption: "PO_BALANCE",
        width: 80,
        dataField: "PO_BALANCE",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
        },
      },
      {
        caption: "PO_AMOUNT",
        width: 80,
        dataField: "PO_AMOUNT",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "currency",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
        },
      },
      {
        caption: "DELIVERED_AMOUNT",
        width: 80,
        dataField: "DELIVERED_AMOUNT",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "currency",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
        },
      },
      {
        caption: "BALANCE_AMOUNT",
        width: 80,
        dataField: "BALANCE_AMOUNT",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "currency",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
        },
      },
      {
        caption: "TON_KIEM",
        width: 80,
        dataField: "TON_KIEM",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
        },
      },
      {
        caption: "BTP",
        width: 80,
        dataField: "BTP",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
        },
      },
      {
        caption: "TP",
        width: 80,
        dataField: "TP",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
        },
      },
      {
        caption: "BLOCK_QTY",
        width: 80,
        dataField: "BLOCK_QTY",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
        },
      },
      {
        caption: "GRAND_TOTAL_STOCK",
        width: 80,
        dataField: "GRAND_TOTAL_STOCK",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
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
          width: 250,
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
          width: 250,
        },
      },
      {
        caption: "M_NAME_FULLBOM",
        width: 80,
        dataField: "M_NAME_FULLBOM",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
        },
      },
      {
        caption: "PROD_MAIN_MATERIAL",
        width: 80,
        dataField: "PROD_MAIN_MATERIAL",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
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
          width: 250,
        },
      },
      {
        caption: "EMPL_NO",
        width: 80,
        dataField: "EMPL_NO",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
        },
      },
      {
        caption: "POMONTH",
        width: 80,
        dataField: "POMONTH",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
        },
      },
      {
        caption: "POWEEKNUM",
        width: 80,
        dataField: "POWEEKNUM",
        allowSorting: true,
        allowFiltering: true,
        dataType: "number",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
        },
      },
      {
        caption: "OVERDUE",
        width: 80,
        dataField: "OVERDUE",
        allowSorting: true,
        allowFiltering: true,
        dataType: "string",
        summaryType: "count",
        format: "fixedPoint",
        headerFilter: {
          allowSearch: true,
          height: 500,
          width: 250,
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
          width: 250,
        },
      },
    ],
    store: podatatable,
  });
  const poDataTable = React.useMemo(
    () => (
      <div className='datatb'>
        <CustomResponsiveContainer>
          <DataGrid
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={podatatable}
            columnWidth='auto'
            keyExpr='PO_ID'
            height={"75vh"}
            showBorders={true}
            onSelectionChanged={(e) => {
              podatatablefilter.current = e.selectedRowsData;
            }}
            onRowClick={(e) => {
              console.log(e.data);
              clickedRow.current = e.data;
            }}
          >
            <Scrolling
              useNative={true}
              scrollByContent={true}
              scrollByThumb={true}
              showScrollbar='onHover'
              mode='virtual'
            />
            <Selection mode='multiple' selectAllMode='allPages' />
            <Editing
              allowUpdating={false}
              allowAdding={true}
              allowDeleting={false}
              mode='batch'
              confirmDelete={true}
              onChangesChange={(e) => { }}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location='before'>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    showhidesearchdiv.current = !showhidesearchdiv.current;
                    setSH(!showhidesearchdiv.current);
                  }}
                >
                  <TbLogout color='green' size={15} />
                  Show/Hide
                </IconButton>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(podatatable, "PO Table");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  SAVE
                </IconButton>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    /* checkBP(userData?.EMPL_NO, userData?.MAINDEPTNAME, ["KD"], showNewPO); */
                    checkBP(userData, ["KD"], ["ALL"], ["ALL"], showNewPO);
                    clearPOform();
                  }}
                >
                  <AiFillFileAdd color='blue' size={15} />
                  NEW PO
                </IconButton>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    /* checkBP(
              userData?.EMPL_NO,
              userData?.MAINDEPTNAME,
              ["KD"],
              handle_fillsuaformInvoice
            ); */
                    checkBP(
                      userData,
                      ["KD"],
                      ["ALL"],
                      ["ALL"],
                      handle_fillsuaformInvoice
                    );
                    //handle_fillsuaformInvoice();
                  }}
                >
                  <FaFileInvoiceDollar color='lightgreen' size={15} />
                  NEW INV
                </IconButton>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    /*  checkBP(
              userData?.EMPL_NO,
              userData?.MAINDEPTNAME,
              ["KD"],
              handle_fillsuaform
            ); */
                    checkBP(
                      userData,
                      ["KD"],
                      ["ALL"],
                      ["ALL"],
                      handle_fillsuaform
                    );
                    //handle_fillsuaform();
                  }}
                >
                  <AiFillEdit color='orange' size={15} />
                  SỬA PO
                </IconButton>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    /*  checkBP(
              userData?.EMPL_NO,
              userData?.MAINDEPTNAME,
              ["KD"],
              handleConfirmDeletePO
            ); */
                    checkBP(
                      userData,
                      ["KD"],
                      ["ALL"],
                      ["ALL"],
                      handleConfirmDeletePO
                    );
                    //handleConfirmDeletePO();
                  }}
                >
                  <MdOutlineDelete color='red' size={15} />
                  XÓA PO
                </IconButton>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    setShowHidePivotTable(!showhidePivotTable);
                  }}
                >
                  <MdOutlinePivotTableChart color='#ff33bb' size={15} />
                  Pivot
                </IconButton>
              </Item>
              <Item name='searchPanel' />
              <Item name='exportButton' />
              <Item name='columnChooser' />
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
              infoText='Page #{0}. Total: {1} ({2} items)'
              displayMode='compact'
            />
            {columns.map((column, index) => {
              //console.log(column);
              return <Column key={index} {...column}></Column>;
            })}
            <Summary>
              <TotalItem
                alignment='right'
                column='PO_ID'
                summaryType='count'
                valueFormat={"decimal"}
              />
              <TotalItem
                alignment='right'
                column='PO_QTY'
                summaryType='sum'
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment='right'
                column='TOTAL_DELIVERED'
                summaryType='sum'
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment='right'
                column='PO_BALANCE'
                summaryType='sum'
                valueFormat={"thousands"}
              />
              <TotalItem
                alignment='right'
                column='PO_AMOUNT'
                summaryType='sum'
                valueFormat={"currency"}
              />
              <TotalItem
                alignment='right'
                column='DELIVERED_AMOUNT'
                summaryType='sum'
                valueFormat={"currency"}
              />
              <TotalItem
                alignment='right'
                column='BALANCE_AMOUNT'
                summaryType='sum'
                valueFormat={"currency"}
              />
            </Summary>
          </DataGrid>
        </CustomResponsiveContainer>
      </div>
    ),
    [podatatable]
  );
  const excelDataTable = React.useMemo(
    () => (
      <div className='datatb'>
        <CustomResponsiveContainer>
          <DataGrid
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={uploadExcelJson}
            columnWidth='auto'
            keyExpr='id'
            height={"75vh"}
            showBorders={true}
            onSelectionChanged={(e) => { }}
            onRowClick={(e) => {
              //console.log(e.data);
            }}
          >
            <Scrolling
              useNative={true}
              scrollByContent={true}
              scrollByThumb={true}
              showScrollbar='onHover'
              mode='virtual'
            />
            <Selection mode='single' selectAllMode='allPages' />
            <Editing
              allowUpdating={false}
              allowAdding={true}
              allowDeleting={false}
              mode='batch'
              confirmDelete={true}
              onChangesChange={(e) => { }}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location='before'>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    SaveExcel(uploadExcelJson, "MaterialStatus");
                  }}
                >
                  <AiFillFileExcel color='green' size={15} />
                  SAVE
                </IconButton>
                <IconButton
                  className='buttonIcon'
                  onClick={() => {
                    setShowHidePivotTable(!showhidePivotTable);
                  }}
                >
                  <MdOutlinePivotTableChart color='#ff33bb' size={15} />
                  Pivot
                </IconButton>
              </Item>
              <Item name='searchPanel' />
              <Item name='exportButton' />
              <Item name='columnChooser' />
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
              infoText='Page #{0}. Total: {1} ({2} items)'
              displayMode='compact'
            />
            {columnsExcel.map((column, index) => {
              //console.log(column);
              return <Column key={index} {...column}></Column>;
            })}
            <Summary>
              <TotalItem
                alignment='right'
                column='PO_ID'
                summaryType='count'
                valueFormat={"decimal"}
              />
            </Summary>
          </DataGrid>
        </CustomResponsiveContainer>
      </div>
    ),
    [uploadExcelJson, columnsExcel, trigger]
  );
  useEffect(() => {
    getcustomerlist();
    getcodelist("");
    dongboGiaPO();
  }, []);
  return (
    <div className="pomanager">
      <div className='mininavbar'>
        <div
          className='mininavitem'
          onClick={() => setNav(1)}
          style={{
            backgroundColor: selection.trapo === true ? "#02c712" : "#abc9ae",
            color: selection.trapo === true ? "yellow" : "yellow",
          }}
        >
          <span className='mininavtext'>Tra PO</span>
        </div>
        <div
          className='mininavitem'
          onClick={() =>
            /*  checkBP(userData?.EMPL_NO, userData?.MAINDEPTNAME, ["KD"], () => {
              setNav(2);
            }) */
            checkBP(userData, ["KD"], ["ALL"], ["ALL"], () => {
              setNav(2);
            })
          }
          style={{
            backgroundColor:
              selection.thempohangloat === true ? "#02c712" : "#abc9ae",
            color: selection.thempohangloat === true ? "yellow" : "yellow",
          }}
        >
          <span className='mininavtext'>Thêm PO</span>
        </div>
      </div>
      {selection.thempohangloat && (
        <div className='newpo'>
          <div className='batchnewpo'>
            <h3>Thêm PO Hàng Loạt</h3>
            <div className='formupload'>
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                className='selectfilebutton'
                type='file'
                name='upload'
                id='upload'
                onChange={(e: any) => {
                  readUploadFile(e);
                }}
              />
              <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#2639F6' }} onClick={() => {
                confirmCheckPoHangLoat();
              }}>CheckPO</Button>
              <Button color={'success'} variant="contained" size="small" sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#00DF0E' }} onClick={() => {
                confirmUpPoHangLoat();
              }}>Up PO</Button>
            </div>
            <div className='insertPOTable'>
              {excelDataTable}
              {/* <DataGrid
                  sx={{ fontSize: "0.6rem" }}
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
                  editMode="row"
                  getRowHeight={() => "auto"}
                /> */}
            </div>
          </div>
          <div className='singlenewpo'></div>
        </div>
      )}
      {selection.trapo && (
        <div className='tracuuPO'>
          {sh && (
            <div className='tracuuPOform'>
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
                    <b>ID:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type='text'
                      placeholder='12345'
                      value={id}
                      onChange={(e) => setID(e.target.value)}
                    ></input>
                  </label>
                </div>
                <div className='forminputcolumn'>
                  <label>
                    <b>PO NO:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type='text'
                      placeholder='123abc'
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
                      type='text'
                      placeholder='SJ-203020HC'
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                    ></input>
                  </label>
                </div>
                <div className='forminputcolumn'>
                  <label>
                    <b>Over/OK:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type='text'
                      placeholder='OVER'
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
                      type='text'
                      placeholder='số invoice'
                      value={invoice_no}
                      onChange={(e) => setInvoice_No(e.target.value)}
                    ></input>
                  </label>
                </div>
              </div>
              <div className='formbutton'>
                <div className='checkboxdiv'>
                  <label>
                    <b>All Time:</b>
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type='checkbox'
                      name='alltimecheckbox'
                      defaultChecked={alltime}
                      onChange={() => setAllTime(!alltime)}
                    ></input>
                  </label>
                  <label>
                    <b>Chỉ PO Tồn:</b>
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type='checkbox'
                      name='pobalancecheckbox'
                      defaultChecked={justpobalance}
                      onChange={() => setJustPOBalance(!justpobalance)}
                    ></input>
                  </label>
                </div>
                <div className='searchbuttondiv'>
                  <IconButton
                    className='buttonIcon'
                    onClick={() => {
                      handletraPO();
                    }}
                  >
                    <FcSearch color='green' size={30} />
                    Search
                  </IconButton>
                </div>
              </div>
            </div>
          )}
          <div className='tracuuPOTable'>
            <div className='formsummary'>
              <table>
                <thead>
                  <tr>
                    <td>PO QTY</td>
                    <td>DELIVERED QTY</td>
                    <td>PO BALANCE QTY</td>
                    <td>PO AMOUNT</td>
                    <td>DELIVERED AMOUNT</td>
                    <td>PO BALANCE AMOUNT</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ color: "purple", fontWeight: "bold" }}>
                      {poSummary.total_po_qty.toLocaleString("en-US")} EA
                    </td>
                    <td style={{ color: "purple", fontWeight: "bold" }}>
                      {" "}
                      {poSummary.total_delivered_qty.toLocaleString("en-US")} EA
                    </td>
                    <td style={{ color: "purple", fontWeight: "bold" }}>
                      {" "}
                      {poSummary.total_pobalance_qty.toLocaleString("en-US")} EA
                    </td>
                    <td style={{ color: "blue", fontWeight: "bold" }}>
                      {" "}
                      {poSummary.total_po_amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td style={{ color: "blue", fontWeight: "bold" }}>
                      {" "}
                      {poSummary.total_delivered_amount.toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: "USD",
                        }
                      )}
                    </td>
                    <td style={{ color: "blue", fontWeight: "bold" }}>
                      {" "}
                      {poSummary.total_pobalance_amount.toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: "USD",
                        }
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='tablegrid'>
              {poDataTable}
              {/* <DataGrid
                sx={{ fontSize: "0.7rem", flex: 1 }}
                components={{
                  Toolbar: CustomToolbarPOTable,
                  LoadingOverlay: LinearProgress,
                }}
                loading={isLoading}
                rowHeight={30}
                rows={podatatable}
                columns={column_potable}
                rowsPerPageOptions={[
                  5, 10, 50, 100, 500, 1000, 5000, 10000, 100000,
                ]}
                editMode="row"
                getRowId={(row) => row.PO_ID}
                checkboxSelection
                disableSelectionOnClick
                onSelectionModelChange={(ids) => {
                  handlePOSelectionforUpdate(ids);
                }}
              /> */}
            </div>
          </div>
        </div>
      )}
      {selection.them1po && (
        <div className='them1po'>
          <div className='formnho'>
            <div className='dangkyform'>
              <h3>Thêm PO mới</h3>
              <div className='dangkyinput'>
                <div className='dangkyinputbox'>
                  <label>
                    <b>Khách hàng:</b>{" "}
                    <Autocomplete
                      size='small'
                      disablePortal
                      options={customerList}
                      className='autocomplete'
                      filterOptions={filterOptions1}
                      isOptionEqualToValue={(option: any, value: any) =>
                        option.CUST_CD === value.CUST_CD
                      }
                      getOptionLabel={(option: CustomerListData | any) =>
                        `${option.CUST_CD}: ${option.CUST_NAME_KD}`
                      }
                      renderInput={(params) => (
                        <TextField {...params} label='Select customer' />
                      )}
                      value={selectedCust_CD}
                      onChange={(
                        event: any,
                        newValue: CustomerListData | any
                      ) => {
                        (async () => {
                          if (company !== "CMS") {
                            setNewPoNo(
                              await autogeneratePO_NO(newValue.CUST_CD)
                            );
                          }
                          //console.log(await autogeneratePO_NO(newValue.CUST_CD));
                        })();
                        console.log(newValue);
                        loadprice(selectedCode?.G_CODE, newValue.CUST_NAME_KD);
                        setSelectedCust_CD(newValue);
                      }}
                    />
                  </label>
                  <label>
                    <b>Code hàng:</b>{" "}
                    <Autocomplete
                      size='small'
                      disablePortal
                      options={codeList}
                      className='autocomplete'
                      filterOptions={filterOptions1}
                      isOptionEqualToValue={(option: any, value: any) =>
                        option.G_CODE === value.G_CODE
                      }
                      getOptionLabel={(option: CodeListData | any) =>
                        `${option.G_CODE}: ${option.G_NAME_KD}:${option.G_NAME}`
                      }
                      renderInput={(params) => (
                        <TextField {...params} label='Select code' />
                      )}
                      onChange={(event: any, newValue: CodeListData | any) => {
                        console.log(newValue);
                        loadprice(
                          newValue.G_CODE,
                          selectedCust_CD?.CUST_NAME_KD
                        );
                        setSelectedCode(newValue);
                      }}
                      value={selectedCode}
                    />
                  </label>
                  <label>
                    <b>PO Date:</b>
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      className='inputdata'
                      type='date'
                      value={newpodate.slice(0, 10)}
                      onChange={(e) => setNewPoDate(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>RD Date:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      className='inputdata'
                      type='date'
                      value={newrddate.slice(0, 10)}
                      onChange={(e) => setNewRdDate(e.target.value)}
                    ></input>
                  </label>
                </div>
                <div className='dangkyinputbox'>
                  <label>
                    <b>PO NO:</b>{" "}
                    <TextField
                      value={newpono}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewPoNo(e.target.value)
                      }
                      size='small'
                      color='success'
                      className='autocomplete'
                      id='outlined-basic'
                      label='Số PO'
                      variant='outlined'
                    />
                  </label>
                  <label>
                    <b>PO QTY:</b>{" "}
                    <TextField
                      value={newpoqty}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        let tempQTY: number = Number(e.target.value);
                        let tempprice: number = newcodeprice.filter(
                          (e: PRICEWITHMOQ, index: number) => {
                            return tempQTY >= e.MOQ;
                          }
                        )[0]?.PROD_PRICE;
                        if (tempprice !== undefined)
                          setNewPoPrice(tempprice.toString());
                        setNewPoQty(e.target.value);
                      }}
                      size='small'
                      color='success'
                      className='autocomplete'
                      id='outlined-basic'
                      label='PO QTY'
                      variant='outlined'
                    />
                  </label>
                  <label>
                    <b>Price:</b>{" "}
                    <TextField
                      value={newpoprice}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewPoPrice(e.target.value)
                      }
                      size='small'
                      color='success'
                      className='autocomplete'
                      id='outlined-basic'
                      label='Price'
                      variant='outlined'
                    />
                  </label>
                  <label>
                    <b>Remark:</b>{" "}
                    <TextField
                      value={newporemark}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewPoRemark(e.target.value)
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
              </div>
              <div className='dangkybutton'>
                <button
                  className='thembutton'
                  onClick={() => {
                    handle_add_1PO();
                  }}
                >
                  Thêm PO
                </button>
                <button
                  className='suabutton'
                  onClick={() => {
                    updatePO();
                  }}
                >
                  Sửa PO
                </button>
                <button
                  className='xoabutton'
                  onClick={() => {
                    clearPOform();
                  }}
                >
                  Clear
                </button>
                <button
                  className='closebutton'
                  onClick={() => {
                    setSelection({
                      ...selection,
                      trapo: true,
                      thempohangloat: false,
                      them1po: false,
                    });
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selection.them1invoice && (
        <div className='them1invoice'>
          <div className='formnho'>
            <div className='dangkyform'>
              <h3>Thêm Invoice mới</h3>
              <div className='dangkyinput'>
                <div className='dangkyinputbox'>
                  <label>
                    <b>Khách hàng:</b>{" "}
                    <Autocomplete
                      size='small'
                      disablePortal
                      options={customerList}
                      className='autocomplete'
                      getOptionLabel={(option: CustomerListData) =>
                        `${option.CUST_CD}: ${option.CUST_NAME_KD}`
                      }
                      renderInput={(params) => (
                        <TextField {...params} label='Select customer' />
                      )}
                      value={selectedCust_CD}
                      onChange={(
                        event: any,
                        newValue: CustomerListData | null
                      ) => {
                        console.log(newValue);
                        setSelectedCust_CD(newValue);
                      }}
                    />
                  </label>
                  <label>
                    <b>Code hàng:</b>{" "}
                    <Autocomplete
                      size='small'
                      disablePortal
                      options={codeList}
                      className='autocomplete'
                      filterOptions={filterOptions1}
                      getOptionLabel={(option: CodeListData | any) =>
                        `${option.G_CODE}: ${option.G_NAME_KD}:${option.G_NAME}`
                      }
                      renderInput={(params) => (
                        <TextField {...params} label='Select code' />
                      )}
                      onChange={(event: any, newValue: CodeListData | any) => {
                        console.log(newValue);
                        setNewPoPrice(
                          newValue === null
                            ? ""
                            : newValue.PROD_LAST_PRICE.toString()
                        );
                        setSelectedCode(newValue);
                      }}
                      value={selectedCode}
                    />
                  </label>
                  <label>
                    <b>PO Date:</b>
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      className='inputdata'
                      type='date'
                      value={newpodate.slice(0, 10)}
                      onChange={(e) => setNewPoDate(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>RD Date:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      className='inputdata'
                      type='date'
                      value={newrddate.slice(0, 10)}
                      onChange={(e) => setNewRdDate(e.target.value)}
                    ></input>
                  </label>
                </div>
                <div className='dangkyinputbox'>
                  <label>
                    <b>PO NO:</b>{" "}
                    <TextField
                      value={newpono}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewPoNo(e.target.value)
                      }
                      size='small'
                      color='success'
                      className='autocomplete'
                      id='outlined-basic'
                      label='Số PO'
                      variant='outlined'
                    />
                  </label>
                  <label>
                    <b>Invoice QTY:</b>{" "}
                    <TextField
                      value={newinvoiceQTY}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewInvoiceQty(Number(e.target.value))
                      }
                      size='small'
                      color='success'
                      className='autocomplete'
                      id='outlined-basic'
                      label='INVOICE QTY'
                      variant='outlined'
                    />
                  </label>
                  <label>
                    <b>Invoice Date:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      className='inputdata'
                      type='date'
                      value={newinvoicedate.slice(0, 10)}
                      onChange={(e) => setNewInvoiceDate(e.target.value)}
                    ></input>
                  </label>
                  <label>
                    <b>Remark:</b>{" "}
                    <TextField
                      value={newinvoiceRemark}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewInvoiceRemark(e.target.value)
                      }
                      size='small'
                      className='autocomplete'
                      id='outlined-basic'
                      label='Remark'
                      variant='outlined'
                    />
                  </label>
                </div>
              </div>
              <div className='dangkybutton'>
                <button
                  className='thembutton'
                  onClick={() => {
                    handle_add_1Invoice();
                  }}
                >
                  Thêm Invoice
                </button>
                <button
                  className='suabutton'
                  onClick={() => {
                    clearInvoiceform();
                  }}
                >
                  Clear
                </button>
                <button
                  className='closebutton'
                  onClick={() => {
                    setSelection({
                      ...selection,
                      trapo: true,
                      thempohangloat: false,
                      them1po: false,
                      them1invoice: false,
                    });
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showhidePivotTable && (
        <div className='pivottable1'>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              setShowHidePivotTable(false);
            }}
          >
            <AiFillCloseCircle color='blue' size={15} />
            Close
          </IconButton>
          <PivotTable datasource={dataSource} tableID='potablepivot' />
        </div>
      )}
    </div>
  );
};
export default PoManager;
