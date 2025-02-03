import { Button, Autocomplete, IconButton, TextField, createFilterOptions } from "@mui/material";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FcSearch } from "react-icons/fc";
import { AiFillCloseCircle, AiFillEdit, AiFillFileAdd, AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";
import { getCompany, getGlobalSetting, getSever, getSocket, getUserData } from "../../../api/Api";
import {
  autoGetProdPrice,
  checkBP,
  f_autogeneratePO_NO,
  f_autopheduyetgia,
  f_checkG_CODE_USE_YN,
  f_checkPOExist,
  f_compareDateToNow,
  f_compareTwoDate,
  f_deletePO,
  f_dongboGiaPO,
  f_getcodelist,
  f_getcustomerlist,
  f_insert_Notification_Data,
  f_insertInvoice,
  f_insertPO,
  f_loadPoDataFull,
  f_loadprice,
  f_readUploadFile,
  f_updatePO,
} from "../../../api/GlobalFunction";
import { MdOutlineDelete, MdOutlinePivotTableChart } from "react-icons/md";
import "./PoManager.scss";
import { FaFileInvoiceDollar } from "react-icons/fa";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotTable from "../../../components/PivotChart/PivotChart";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  CodeListData,
  CustomerListData,
  POSummaryData,
  POTableData,
  PRICEWITHMOQ,
  UserData,
  WEB_SETTING_DATA,
} from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import CustomDialog from "../../../components/Dialog/CustomDialog";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
const PoManager = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const [openNewPODialog, setOpenNewPODialog] = useState(false);
  const [openNewInvoiceDialog, setOpenNewInvoiceDialog] = useState(false);
  const handleOpenNewPODialog = () => {
    setOpenNewPODialog(true);
  };
  const handleCloseNewPODialog = () => {
    setOpenNewPODialog(false);
  };
  const handleOpenNewInvoiceDialog = () => {
    setOpenNewInvoiceDialog(true);
  };
  const handleCloseNewInvoiceDialog = () => {
    setOpenNewInvoiceDialog(false);
  };
  const dataGridRef = useRef<any>(null);
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
  const [newpoBEP, setNewPoBEP] = useState("");
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
  const podatatablefilter = useRef<POTableData[]>([]);
  const clickedRow = useRef<any>(null);
  const [selectedID, setSelectedID] = useState<number | null>();
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [newcodeprice, setNewCodePrice] = useState<PRICEWITHMOQ[]>([]);
  const [columnsExcel, setColumnsExcel] = useState<Array<any>>([]);
  const clearSelection = () => {
    if (dataGridRef.current) {
      dataGridRef.current.instance.clearSelection();
      podatatablefilter.current = [];
    }
  };
  const loadprice = async (G_CODE?: string, CUST_NAME?: string) => {
    setNewCodePrice(await f_loadprice(G_CODE, CUST_NAME));
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
  const loadFile = (e: any) => {
    f_readUploadFile(e, setUploadExcelJSon, setColumnsExcel);
  };
  const handletraPO = async () => {
    if (getCompany() === 'CMS') {
      f_autopheduyetgia();
    }
    Swal.fire({
      title: "Tra cứu PO",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    clearSelection();
    let loadeddata: POTableData[] = [];
    loadeddata = await f_loadPoDataFull(
      {
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
      }
    );
    if (loadeddata.length > 0) {
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
        po_summary_temp.total_delivered_qty += loadeddata[i].TOTAL_DELIVERED;
        po_summary_temp.total_pobalance_qty += loadeddata[i].PO_BALANCE;
        po_summary_temp.total_po_amount += loadeddata[i].PO_AMOUNT;
        po_summary_temp.total_delivered_amount += loadeddata[i].DELIVERED_AMOUNT;
        po_summary_temp.total_pobalance_amount += loadeddata[i].BALANCE_AMOUNT;
      }
      setPoSummary(po_summary_temp);
      setPoDataTable(loadeddata);
      setSH(false);
      Swal.fire("Thông báo", "Đã load " + loadeddata.length + " dòng", "success");
    }
    else {
      setPoDataTable([]);
      Swal.fire("Thông báo", "Không có dữ liệu", "success");
    }
  };
  const handle_checkPOHangLoat = async () => {
    if (uploadExcelJson.length > 0) {
      Swal.fire({
        title: "Đang check PO hàng loạt",
        text: "Đang check, hãy chờ chút",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "OK",
        showConfirmButton: false,
      });
      let tempjson = uploadExcelJson;
      for (let i = 0; i < uploadExcelJson.length; i++) {
        let err_code: number = 0;
        err_code = (await f_checkPOExist(uploadExcelJson[i].G_CODE, uploadExcelJson[i].CUST_CD, uploadExcelJson[i].PO_NO)) ? 1 : 0;
        err_code = f_compareDateToNow(uploadExcelJson[i].PO_DATE) ? 2 : err_code;
        let checkG_CODE: number = await f_checkG_CODE_USE_YN(uploadExcelJson[i].G_CODE);
        err_code = checkG_CODE == 1 ? 3 : checkG_CODE === 2 ? 4 : err_code;
        let tempgia = { prod_price: 0, bep: 0 };
        if (getCompany() !== 'CMS') {
          tempgia = await autoGetProdPrice(uploadExcelJson[i].G_CODE, uploadExcelJson[i].CUST_CD, uploadExcelJson[i].PO_QTY);
          if (tempgia.prod_price !== 0) {
            tempjson[i].PROD_PRICE = tempgia.prod_price;
            tempjson[i].BEP = tempgia.bep;
          }
          else {
            err_code = 5;
          }
        }
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
        else if (err_code === 5) {
          tempjson[i].CHECKSTATUS = "NG: Chưa có giá hoặc chua phê duyệt giá";
        }
      }
      Swal.fire("Thông báo", "Đã hoàn thành check PO hàng loạt", "success");
      setUploadExcelJSon(tempjson);
      setTrigger(!trigger);
    }
    else {
      Swal.fire("Thông báo", "Chưa có dòng nào", "error");
    }
  };
  const handle_upPOHangLoat = async () => {
    let tempjson = uploadExcelJson;
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      err_code = (await f_checkPOExist(uploadExcelJson[i].G_CODE, uploadExcelJson[i].CUST_CD, uploadExcelJson[i].PO_NO)) ? 1 : 0;
      err_code = f_compareDateToNow(uploadExcelJson[i].PO_DATE) ? 2 : err_code;
      let checkG_CODE: number = await f_checkG_CODE_USE_YN(uploadExcelJson[i].G_CODE);
      err_code = checkG_CODE == 1 ? 3 : checkG_CODE === 2 ? 4 : err_code;
      uploadExcelJson[i].CHECKSTATUS !== 'OK' ? err_code = 5 : err_code;
      if (err_code === 0) {
        tempjson[i].CHECKSTATUS = await f_insertPO({
          G_CODE: uploadExcelJson[i].G_CODE,
          CUST_CD: uploadExcelJson[i].CUST_CD,
          PO_NO: uploadExcelJson[i].PO_NO,
          EMPL_NO: userData?.EMPL_NO,
          PO_QTY: uploadExcelJson[i].PO_QTY,
          PO_DATE: uploadExcelJson[i].PO_DATE,
          RD_DATE: uploadExcelJson[i].RD_DATE,
          PROD_PRICE: uploadExcelJson[i].PROD_PRICE,
          BEP: uploadExcelJson[i].BEP ?? 0,
          REMARK: uploadExcelJson[i].REMARK,
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
      else if (err_code === 5) {
        tempjson[i].CHECKSTATUS = "NG: PO chưa được check trước khi up";
      }
    }
    let newNotification: NotificationElement = {
      CTR_CD: '002',
      NOTI_ID: -1,
      NOTI_TYPE: 'success',
      TITLE: 'PO vừa được thêm hàng loạt',
      CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm hàng loạt PO mới`, 
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
    Swal.fire("Thông báo", "Đã hoàn thành thêm PO hàng loạt", "success");
    setUploadExcelJSon(tempjson);
    setTrigger(!trigger);
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
        Swal.fire({
          title: "Up PO",
          text: "Đang up PO hàng loạt",
          icon: "info",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
          showConfirmButton: false,
        });
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
        Swal.fire({
          title: "Check PO",
          text: "Đang check PO hàng loạt",
          icon: "info",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
          showConfirmButton: false,
        });
        handle_checkPOHangLoat();
      }
    });
  };
  const getcustomerlist = async () => {
    setCustomerList(await f_getcustomerlist());
  };
  const getcodelist = async (G_NAME: string) => {
    setCodeList(await f_getcodelist(G_NAME));
  };
  const handle_add_1PO = async () => {
    let err_code: number = 0;
    err_code = (await f_checkPOExist(selectedCode?.G_CODE ?? "", selectedCust_CD?.CUST_CD ?? "", newpono)) ? 1 : 0;
    err_code = f_compareDateToNow(newpodate) ? 2 : err_code;
    err_code = selectedCode?.USE_YN === "N" ? 3 : err_code;
    if (selectedCode?.G_CODE === "" || selectedCust_CD?.CUST_CD === "" || newpono === "" || userData?.EMPL_NO === "" || newpoprice === "") {
      err_code = 4;
    }
    let recheckPrice: number = newcodeprice.filter(
      (e: PRICEWITHMOQ, index: number) => {
        return newpoprice === e.PROD_PRICE.toString();
      }
    ).length ?? 0;
    if (getCompany() !== 'CMS') {
      if (recheckPrice === 0) err_code = 5;
    }
    if (err_code === 0) {
      let kq = await f_insertPO({
        G_CODE: selectedCode?.G_CODE,
        CUST_CD: selectedCust_CD?.CUST_CD,
        PO_NO: newpono,
        EMPL_NO: userData?.EMPL_NO,
        PO_QTY: newpoqty,
        PO_DATE: newpodate,
        RD_DATE: newrddate,
        PROD_PRICE: newpoprice,
        BEP: newpoBEP === "" ? 0 : newpoBEP,
        REMARK: newporemark ?? "",
      });
      if (kq === "OK") {
        Swal.fire("Thông báo", "Thêm PO mới thành công", "success");
        let newNotification: NotificationElement = {
          CTR_CD: '002',
          NOTI_ID: -1,
          NOTI_TYPE: "success",
          TITLE: 'PO mới được thêm',
          CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm PO mới code G_NAME ${selectedCode?.G_CODE} - (${selectedCode?.G_NAME}), với số lượng: ${newpoqty} cho khách hàng ${selectedCust_CD?.CUST_CD} - ${selectedCust_CD?.CUST_NAME_KD} .`, 
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
        setSelection({
          ...selection,
          trapo: true,
          thempohangloat: false,
          them1po: false,
        });
      } else {
        Swal.fire(
          "Thông báo",
          "Thêm PO mới thất bại: " + kq,
          "error"
        );
      }
    } else if (err_code === 1) {
      Swal.fire("Thông báo", "NG: Đã tồn tại PO", "error");
    } else if (err_code === 2) {
      Swal.fire("Thông báo", "NG: Ngày PO không được trước ngày hôm nay", "error");
    } else if (err_code === 3) {
      Swal.fire("Thông báo", "NG: Ver này đã bị khóa", "error");
    } else if (err_code === 4) {
      Swal.fire("Thông báo", "NG: Không để trống thông tin bắt buộc", "error");
    } else if (err_code === 5) {
      Swal.fire("Thông báo", "NG: Giá không tồn tại trong bảng giá", "error");
    }
  };
  const handle_add_1Invoice = async () => {
    let err_code: number = 0;
    err_code = (await f_checkPOExist(selectedCode?.G_CODE ?? "", selectedCust_CD?.CUST_CD ?? "", newpono)) ? 0 : 1;
    err_code = f_compareDateToNow(newinvoicedate) ? 2 : err_code;
    let checkCompareIVDatevsPODate: number = f_compareTwoDate(newinvoicedate, newpodate.substring(0, 10));
    err_code = checkCompareIVDatevsPODate === -1 ? 6 : err_code;
    err_code = selectedCode?.USE_YN === "N" ? 3 : err_code;
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
      let kq = await f_insertInvoice({
        G_CODE: selectedCode?.G_CODE,
        CUST_CD: selectedCust_CD?.CUST_CD,
        PO_NO: newpono,
        EMPL_NO: userData?.EMPL_NO,
        DELIVERY_QTY: newinvoiceQTY,
        PO_DATE: newpodate,
        RD_DATE: newrddate,
        DELIVERY_DATE: newinvoicedate,
        REMARK: newinvoiceRemark,
      });
      if (kq === "OK") {
        let newNotification: NotificationElement = {
          CTR_CD: '002',
          NOTI_ID: -1,
          NOTI_TYPE: "success",
          TITLE: 'Invoice mới',
          CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm Invoice mới code G_NAME ${selectedCode?.G_CODE} - (${selectedCode?.G_NAME}), với số lượng: ${newinvoiceQTY} cho khách hàng ${selectedCust_CD?.CUST_CD} - ${selectedCust_CD?.CUST_NAME_KD} .`, 
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
        Swal.fire("Thông báo", "Thêm Invoice mới thành công", "success");
      } else {
        Swal.fire("Thông báo", "Thêm Invoice mới thất bại: " + kq, "error");
      }
    } else if (err_code === 1) {
      Swal.fire("Thông báo", "NG: Không tồn tại PO", "error");
    } else if (err_code === 2) {
      Swal.fire("Thông báo", "NG: Ngày Invoice không được trước ngày hôm nay", "error");
    } else if (err_code === 3) {
      Swal.fire("Thông báo", "NG: Ver này đã bị khóa", "error");
    } else if (err_code === 4) {
      Swal.fire("Thông báo", "NG: Không để trống thông tin bắt buộc", "error");
    } else if (err_code === 5) {
      Swal.fire("Thông báo", "NG: Invoice QTY nhiều hơn PO BALANCE", "error");
    }
    else if (err_code === 6) {
      Swal.fire("Thông báo", "NG: Ngày Invoice không được trước ngày PO", "error");
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
      handleOpenNewPODialog();
      const selectedCodeFilter: CodeListData = {
        G_CODE: clickedRow.current?.G_CODE ?? "",
        G_NAME: clickedRow.current?.G_NAME ?? "",
        G_NAME_KD: clickedRow.current?.G_NAME_KD ?? "",
        PROD_LAST_PRICE: Number(clickedRow.current?.PROD_PRICE),
        USE_YN: "Y",
        PO_BALANCE: Number(clickedRow.current?.PO_BALANCE),
      };
      const selectedCustomerFilter: CustomerListData = {
        CUST_CD: clickedRow.current?.CUST_CD ?? "",
        CUST_NAME_KD: clickedRow.current?.CUST_NAME_KD ?? "",
      };
      setSelectedCode(selectedCodeFilter);
      setSelectedCust_CD(selectedCustomerFilter);
      setNewPoDate(clickedRow.current?.PO_DATE ?? "");
      setNewRdDate(clickedRow.current?.RD_DATE ?? "");
      setNewPoQty(clickedRow.current?.PO_QTY ?? "0");
      setNewPoNo(clickedRow.current?.PO_NO ?? "");
      setNewPoPrice(clickedRow.current?.PROD_PRICE ?? "0");
      setNewPoBEP(clickedRow.current?.BEP ?? 0);
      setNewPoRemark(clickedRow.current?.REMARK ?? "");
      setSelectedID(clickedRow.current?.PO_ID);
      loadprice(clickedRow.current?.G_CODE, clickedRow.current?.CUST_NAME_KD);
    } else {
      clearPOform();
      Swal.fire("Thông báo", "Lỗi: Chọn ít nhất 1 PO để sửa", "error");
    }
  };
  const handle_fillsuaformInvoice = () => {
    if (clickedRow.current !== null) {
      handleOpenNewInvoiceDialog();
      const selectedCodeFilter: CodeListData = {
        G_CODE: clickedRow.current?.G_CODE ?? "",
        G_NAME: clickedRow.current?.G_NAME ?? "",
        G_NAME_KD: clickedRow.current?.G_NAME_KD ?? "",
        PROD_LAST_PRICE: Number(clickedRow.current?.PROD_PRICE),
        USE_YN: "Y",
        PO_BALANCE: Number(clickedRow.current?.PO_BALANCE),
      };
      const selectedCustomerFilter: CustomerListData = {
        CUST_CD: clickedRow.current?.CUST_CD ?? "",
        CUST_NAME_KD: clickedRow.current?.CUST_NAME_KD ?? "",
      };
      setSelectedCode(selectedCodeFilter);
      setSelectedCust_CD(selectedCustomerFilter);
      setNewPoDate(clickedRow.current?.PO_DATE ?? "");
      setNewRdDate(clickedRow.current?.RD_DATE ?? "");
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
    err_code = (await f_checkPOExist(selectedCode?.G_CODE ?? "", selectedCust_CD?.CUST_CD ?? "", newpono)) ? 0 : 1;
    err_code = f_compareDateToNow(newpodate) ? 2 : err_code;
    err_code = selectedCode?.USE_YN === "N" ? 3 : err_code;
    if (
      selectedCode?.G_CODE === "" ||
      selectedCust_CD?.CUST_CD === "" ||
      newpono === "" ||
      userData?.EMPL_NO === "" ||
      newpoprice === ""
    ) {
      err_code = 4;
    }
    if (newpoqty < clickedRow.current.TOTAL_DELIVERED) {
      err_code = 5;
    }
    if (getCompany() !== 'CMS') {
      if (Number(newpoprice) !== clickedRow.current.PROD_PRICE) {
        err_code = 6;
      }
    }
    if (err_code === 0) {
      let kq = await f_updatePO({
        G_CODE: selectedCode?.G_CODE,
        CUST_CD: selectedCust_CD?.CUST_CD,
        PO_NO: newpono,
        EMPL_NO: userData?.EMPL_NO,
        PO_QTY: newpoqty,
        PO_DATE: newpodate,
        RD_DATE: newrddate,
        PROD_PRICE: newpoprice,
        BEP: newpoBEP === '' ? 0 : newpoBEP,
        REMARK: newporemark,
        PO_ID: selectedID,
      });
      if (kq === "OK") {
        let newNotification: NotificationElement = {
          CTR_CD: '002',
          NOTI_ID: -1,
          NOTI_TYPE: 'info',
          TITLE: 'Update PO',
          CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã update PO po_id: ${selectedID} - ${selectedCode?.G_NAME_KD} - (${selectedCust_CD?.CUST_NAME_KD}) - PO NO: ${newpono} - PO QTY: ${newpoqty} - PO DATE: ${newpodate} - RD DATE: ${newrddate} - PROD PRICE: ${newpoprice} - BEP: ${newpoBEP} - REMARK: ${newporemark}`, 
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
        Swal.fire("Thông báo", "Update Po thành công", "success");
      } else {
        Swal.fire("Thông báo", "Update PO thất bại: " + kq, "error");
      }
    } else if (err_code === 1) {
      Swal.fire("Thông báo", "NG: Không tồn tại PO", "error");
    } else if (err_code === 2) {
      Swal.fire("Thông báo", "NG: Ngày PO không được trước ngày hôm nay", "error");
    } else if (err_code === 3) {
      Swal.fire("Thông báo", "NG: Ver này đã bị khóa", "error");
    } else if (err_code === 4) {
      Swal.fire("Thông báo", "NG: Không để trống thông tin bắt buộc", "error");
    } else if (err_code === 5) {
      Swal.fire("Thông báo", "NG: Số lượng po mới không được nhỏ hơn số lượng đã giao hàng", "error");
    } else if (err_code === 6) {
      Swal.fire("Thông báo", "NG: Không được đổi giá PO, xóa tạo lại PO nhé", "error");
    }
    else {
      Swal.fire("Thông báo", "Kiểm tra xem PO có giao hàng chưa?", "error");
    }
  };
  const deletePO = async () => {
    if (podatatablefilter.current.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < podatatablefilter.current.length; i++) {
        if (podatatablefilter.current[i].EMPL_NO === userData?.EMPL_NO) {
          let kq = await f_deletePO(podatatablefilter.current[i].PO_ID);
          if (kq !== 'OK') err_code = true;
        }
      }
      if (!err_code) {
        let newNotification: NotificationElement = {
          CTR_CD: '002',
          NOTI_ID: -1,
          NOTI_TYPE: 'warning',
          TITLE: 'Xóa PO',
          CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã xóa PO_NO ${podatatablefilter.current.map((x: POTableData) => x.PO_NO).join(', ')} - CODE: ${podatatablefilter.current.map((x: POTableData) => x.G_NAME_KD).join(', ')}`, 
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
  const column_potable = [
    { field: "PO_ID", cellDataType: "number", headerName: "PO_ID", width: 90, headerCheckboxSelection: true, checkboxSelection: true, },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 90 },
    { field: "PO_NO", headerName: "PO_NO", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 120 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 80 },   
    { field: "G_CODE", headerName: "G_CODE", width: 70 },
    { field: "PO_DATE", headerName: "PO_DATE", width: 70 },
    { field: "RD_DATE", headerName: "RD_DATE", width: 70 },
    {
      field: "BEP",
      cellDataType: "number",
      headerName: "BEP",
      width: 60,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#077abdFF" }}>
            <b>
              {params.data.BEP?.toLocaleString("en-US", {
                style: "decimal",
                maximumFractionDigits: 8,
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "PROD_PRICE",
      cellDataType: "number",
      headerName: "PROD_PRICE",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>
              {params.data.PROD_PRICE?.toLocaleString("en-US", {
                style: "decimal",
                maximumFractionDigits: 8,
              })}
            </b>
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
      width: 90,
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
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.PO_BALANCE?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "PO_AMOUNT",
      cellDataType: "number",
      headerName: "PO_AMOUNT",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.PO_AMOUNT?.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "DELIVERED_AMOUNT",
      cellDataType: "number",
      headerName: "DELIVERED_AMOUNT",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.DELIVERED_AMOUNT?.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "BALANCE_AMOUNT",
      cellDataType: "number",
      headerName: "BALANCE_AMOUNT",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.BALANCE_AMOUNT?.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "DELIVERED_BEP_AMOUNT",
      cellDataType: "number",
      headerName: "DELIVERED_BEP_AMOUNT",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#077abdFF" }}>
            <b>
              {params.data.DELIVERED_BEP_AMOUNT?.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    { field: "EMPL_NAME", headerName: "EMPL_NAME", width: 110 },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 80 },
    { field: "M_NAME_FULLBOM", headerName: "M_NAME_FULLBOM", width: 110 },
    {
      field: "PROD_MAIN_MATERIAL",
      headerName: "PROD_MAIN_MATERIAL",
      width: 110,
    },
    { field: "DESCR", headerName: "DESCR", width: 80 },
    { field: "POMONTH", cellDataType: "number", headerName: "POMONTH", width: 80 },
    { field: "POWEEKNUM", cellDataType: "number", headerName: "POWEEKNUM", width: 80 },
    { field: "OVERDUE", headerName: "OVERDUE", width: 80 },
    { field: "REMARK", headerName: "REMARK", width: 110 },
  ];
  const column_potable_cms = [
    { field: "PO_ID", cellDataType: "number", headerName: "PO_ID", width: 90, headerCheckboxSelection: true, checkboxSelection: true, },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 90 },
    { field: "PO_NO", headerName: "PO_NO", width: 80 },
    { field: "G_NAME", headerName: "G_NAME", width: 120 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 80 },
    { field: "DESCR", headerName: "DESCR", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 70 },
    { field: "PO_DATE", headerName: "PO_DATE", width: 70 },
    { field: "RD_DATE", headerName: "RD_DATE", width: 70 },
    /* {
      field: "BEP",
      cellDataType: "number",
      headerName: "BEP",
      width: 60,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#077abdFF" }}>
            <b>
              {params.data.BEP?.toLocaleString("en-US", {
                style: "decimal",
                maximumFractionDigits: 8,
              })}
            </b>
          </span>
        );
      },
    }, */
    {
      field: "PROD_PRICE",
      cellDataType: "number",
      headerName: "PROD_PRICE",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>
              {params.data.PROD_PRICE?.toLocaleString("en-US", {
                style: "decimal",
                maximumFractionDigits: 8,
              })}
            </b>
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
      width: 90,
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
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.data.PO_BALANCE?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "PO_AMOUNT",
      cellDataType: "number",
      headerName: "PO_AMOUNT",
      width: 80,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.PO_AMOUNT?.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "DELIVERED_AMOUNT",
      cellDataType: "number",
      headerName: "DELIVERED_AMOUNT",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.DELIVERED_AMOUNT?.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "BALANCE_AMOUNT",
      cellDataType: "number",
      headerName: "BALANCE_AMOUNT",
      width: 90,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.data.BALANCE_AMOUNT?.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    /* {
      field: "DELIVERED_BEP_AMOUNT",
      cellDataType: "number",
      headerName: "DELIVERED_BEP_AMOUNT",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "#077abdFF" }}>
            <b>
              {params.data.DELIVERED_BEP_AMOUNT?.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    }, */
    { field: "EMPL_NAME", headerName: "EMPL_NAME", width: 110 },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 80 },
    { field: "M_NAME_FULLBOM", headerName: "M_NAME_FULLBOM", width: 110 },
    {
      field: "PROD_MAIN_MATERIAL",
      headerName: "PROD_MAIN_MATERIAL",
      width: 110,
    },
    { field: "POMONTH", cellDataType: "number", headerName: "POMONTH", width: 80 },
    { field: "POWEEKNUM", cellDataType: "number", headerName: "POWEEKNUM", width: 80 },
    { field: "OVERDUE", headerName: "OVERDUE", width: 80 },
    { field: "REMARK", headerName: "REMARK", width: 110 },
  ];
  const poDataAGTable = useMemo(() =>
    <AGTable
      suppressRowClickSelection={false}
      showFilter={true}
      toolbar={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              setSH(prev => !prev);
            }}
          >
            <AiOutlineClose color='green' size={15} />
            Show/Hide
          </IconButton>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              checkBP(userData, ["KD"], ["ALL"], ["ALL"], showNewPO);
              handleOpenNewPODialog();
              clearPOform();
            }}
          >
            <AiFillFileAdd color='blue' size={15} />
            NEW PO
          </IconButton>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              checkBP(
                userData,
                ["KD"],
                ["ALL"],
                ["ALL"],
                handle_fillsuaformInvoice
              );
            }}
          >
            <FaFileInvoiceDollar color='lightgreen' size={15} />
            NEW INV
          </IconButton>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              checkBP(
                userData,
                ["KD"],
                ["ALL"],
                ["ALL"],
                handle_fillsuaform
              );
            }}
          >
            <AiFillEdit color='orange' size={15} />
            SỬA PO
          </IconButton>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              checkBP(
                userData,
                ["KD"],
                ["ALL"],
                ["ALL"],
                handleConfirmDeletePO
              );
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
        </div>
      }
      columns={getCompany() !== 'CMS' ? column_potable : column_potable_cms}
      data={podatatable}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        clickedRow.current = params.data;
        //clickedRow.current = params.data;
        //console.log(e.data) 
      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())
        podatatablefilter.current = params!.api.getSelectedRows();
      }}
    />
    , [podatatable]);
  const excelDataAGTable = useMemo(() =>
    <AGTable
      showFilter={true}
      toolbar={
        <div>
          <IconButton
            className='buttonIcon'
            onClick={() => {
              setShowHidePivotTable(!showhidePivotTable);
            }}
          >
            <MdOutlinePivotTableChart color='#ff33bb' size={15} />
            Pivot
          </IconButton>
        </div>
      }
      columns={columnsExcel}
      data={uploadExcelJson}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //clickedRow.current = params.data;        
      }} onSelectionChange={(params: any) => {
        //setSelectedRows(params!.api.getSelectedRows()[0]);        
      }}
    />
    , [uploadExcelJson, columnsExcel, trigger]);
  useEffect(() => {
    if (getCompany() === 'CMS' && getSever() !== 'http://222.252.1.63:3007') {
      f_autopheduyetgia();
      f_dongboGiaPO();
    }
    getcustomerlist();
    getcodelist("");
  }, []);
  return (
    <div className="pomanager">
      <Tabs className="tabs">
        <TabList className="tablist" style={{ backgroundImage: theme.CMS.backgroundImage, color: 'gray' }}>
          <Tab><span className="mininavtext">Tra PO</span></Tab>
          <Tab><span className="mininavtext">Thêm PO</span></Tab>
        </TabList>
        <TabPanel>
          <div className='tracuuPO'>
            {sh && <div className="tracuuPOform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
              <div className="forminput">
                <div className="forminputcolumn">
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
                <div className="forminputcolumn">
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
              <div className="formbutton">
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
                <IconButton
                  className='buttonIcon'
                  onClick={() => { handletraPO(); }}
                >
                  <FcSearch color='green' size={15} />
                  Search
                </IconButton>
              </div>
            </div>}
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
                          currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                        })}
                      </td>
                      <td style={{ color: "blue", fontWeight: "bold" }}>
                        {" "}
                        {poSummary.total_delivered_amount.toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                          }
                        )}
                      </td>
                      <td style={{ color: "blue", fontWeight: "bold" }}>
                        {" "}
                        {poSummary.total_pobalance_amount.toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number) => ele.ITEM_NAME === 'CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                          }
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className='tablegrid'>
                {poDataAGTable}
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
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
                    loadFile(e);
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
                {excelDataAGTable}
              </div>
            </div>
          </div>
        </TabPanel>
      </Tabs>
      <CustomDialog
        isOpen={openNewPODialog}
        onClose={handleCloseNewPODialog}
        title="Thêm PO mới"
        content={<> <div className='dangkyinput'>
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
                        await f_autogeneratePO_NO(newValue.CUST_CD)
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
                  )[0]?.PROD_PRICE ?? 0;
                  if (tempprice !== undefined) setNewPoPrice(tempprice.toString());
                  let tempBEP: number = newcodeprice.filter(
                    (e: PRICEWITHMOQ, index: number) => {
                      return tempQTY >= e.MOQ;
                    }
                  )[0]?.BEP ?? 0;
                  if (tempBEP !== undefined) setNewPoBEP(tempBEP.toString());
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
                style={{ width: '150px' }}
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
              <TextField
                style={{ width: '150px' }}
                value={newpoBEP}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewPoBEP(e.target.value)
                }
                size='small'
                color='success'
                className='autocomplete'
                id='outlined-basic'
                label='BEP'
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
        </>}
        actions={<div className='dangkybutton'>
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
              handleCloseNewPODialog();
            }}
          >
            Close
          </button>
        </div>}
      />
      <CustomDialog
        isOpen={openNewInvoiceDialog}
        onClose={handleCloseNewInvoiceDialog}
        title="Thêm Invoice mới"
        content={<div className='dangkyinput'>
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
        </div>}
        actions={<div className='dangkybutton'>
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
              handleCloseNewInvoiceDialog();
            }}
          >
            Close
          </button>
        </div>}
      />
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