import {
  Autocomplete,
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
import { generalQuery, getAuditMode, getGlobalSetting } from "../../../api/Api";
import { UserContext } from "../../../api/Context";
import { checkBP, CustomResponsiveContainer, SaveExcel, zeroPad } from "../../../api/GlobalFunction";
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
  WEB_SETTING_DATA,
} from "../../../api/GlobalInterface";

const PoManager2 = () => {
  const [isPending, startTransition] = useTransition();
  const [selection, setSelection] = useState<any>({
    trapo: true,
    thempohangloat: false,
    them1po: false,
    them1invoice: false,
  });

  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const company: string = useSelector(
    (state: RootState) => state.totalSlice.company,
  );
  const [showhidesearchdiv, setShowHideSearchDiv] = useState(true);
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
  const [justpobalance, setJustPOBalance] = useState(true);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>({
    G_CODE: "7A00001A",
    G_NAME: "SELECT CODE",
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
    moment().format("YYYY-MM-DD"),
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
  const [podatatablefilter, setPoDataTableFilter] = useState<
    Array<POTableData>
  >([]);
  const [selectedID, setSelectedID] = useState<number | null>();
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [newcodeprice, setNewCodePrice] = useState<PRICEWITHMOQ[]>([]);

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
                        element.FINAL === "Y",
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
                    },
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
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handletraPO();
    }
  };
  const column_potable = [
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 120 },
    { field: "PO_NO", headerName: "PO_NO", width: 110 },
    { field: "G_NAME", headerName: "G_NAME", width: 150 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    { field: "G_CODE", headerName: "G_CODE", width: 100 },
    { field: "PO_DATE", type: "date", headerName: "PO_DATE", width: 100 },
    { field: "RD_DATE", type: "date", headerName: "RD_DATE", width: 100 },
    {
      field: "PROD_PRICE",
      type: "number",
      headerName: "PROD_PRICE",
      width: 100,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>
              {params.row.PROD_PRICE.toLocaleString("en-US", {
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
      type: "number",
      headerName: "PO_QTY",
      width: 100,
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
      type: "number",
      headerName: "TOTAL_DELIVERED",
      width: 110,
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
      type: "number",
      headerName: "PO_BALANCE",
      width: 100,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.PO_BALANCE.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "PO_AMOUNT",
      type: "number",
      headerName: "PO_AMOUNT",
      width: 100,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.row.PO_AMOUNT.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "DELIVERED_AMOUNT",
      type: "number",
      headerName: "DELIVERED_AMOUNT",
      width: 100,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.row.DELIVERED_AMOUNT.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "BALANCE_AMOUNT",
      type: "number",
      headerName: "BALANCE_AMOUNT",
      width: 100,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            <b>
              {params.row.BALANCE_AMOUNT.toLocaleString("en-US", {
                style: "currency",
                currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
              })}
            </b>
          </span>
        );
      },
    },
    /* {
      field: "TON_KIEM",
      type: "number",
      headerName: "TON_KIEM",
      width: 100,
      renderCell: (params: any) => {
        return <span>{params.row.TON_KIEM.toLocaleString("en-US")}</span>;
      },
    },
    {
      field: "BTP",
      type: "number",
      headerName: "BTP",
      width: 90,
      renderCell: (params: any) => {
        return <span>{params.row.BTP.toLocaleString("en-US")}</span>;
      },
    },
    {
      field: "TP",
      type: "number",
      headerName: "TP",
      width: 90,
      renderCell: (params: any) => {
        return <span>{params.row.TP.toLocaleString("en-US")}</span>;
      },
    },
    {
      field: "BLOCK_QTY",
      type: "number",
      headerName: "BLOCK_QTY",
      width: 90,
      renderCell: (params: any) => {
        return <span>{params.row.BLOCK_QTY.toLocaleString("en-US")}</span>;
      },
    },
    {
      field: "GRAND_TOTAL_STOCK",
      type: "number",
      headerName: "GRAND_TOTAL_STOCK",
      width: 90,
      renderCell: (params: any) => {
        return (
          <span>
            <b>{params.row.GRAND_TOTAL_STOCK.toLocaleString("en-US")}</b>
          </span>
        );
      },
    }, */
    { field: "EMPL_NAME", headerName: "EMPL_NAME", width: 150 },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 90 },
    { field: "M_NAME_FULLBOM", headerName: "M_NAME_FULLBOM", width: 110 },
    {
      field: "PROD_MAIN_MATERIAL",
      headerName: "PROD_MAIN_MATERIAL",
      width: 110,
    },
    { field: "POMONTH", type: "number", headerName: "POMONTH", width: 80 },
    { field: "POWEEKNUM", type: "number", headerName: "POWEEKNUM", width: 80 },
    { field: "OVERDUE", headerName: "OVERDUE", width: 80 },
    { field: "REMARK", headerName: "REMARK", width: 110 },
    { field: "PO_ID", type: "number", headerName: "PO_ID", width: 90 },
  ];
  const column_excel2 = [
    { field: "CUST_CD", headerName: "CUST_CD", width: 120 },
    { field: "G_CODE", headerName: "G_CODE", width: 120 },
    { field: "PO_NO", headerName: "PO_NO", width: 120 },
    {
      field: "PO_QTY",
      type: "number",
      headerName: "PO_QTY",
      width: 120,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.PO_QTY.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "PO_DATE", headerName: "PO_DATE", width: 200 },
    { field: "RD_DATE", headerName: "RD_DATE", width: 200 },
    {
      field: "PROD_PRICE",
      type: "number",
      headerName: "PROD_PRICE",
      width: 200,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "gray" }}>
            <b>
              {params.row.PROD_PRICE.toLocaleString("en-US", {
                style: "decimal",
                maximumFractionDigits: 8,
              })}
            </b>
          </span>
        );
      },
    },
    {
      field: "CHECKSTATUS",
      headerName: "CHECKSTATUS",
      width: 200,
      renderCell: (params: any) => {
        if (params.row.CHECKSTATUS.slice(0, 2) === "OK")
          return (
            <span style={{ color: "green" }}>
              <b>{params.row.CHECKSTATUS}</b>
            </span>
          );
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.CHECKSTATUS}</b>
          </span>
        );
      },
    },
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
            SaveExcel(uploadExcelJson, "Uploaded PO");
          }}
        >
          Save Excel
        </button>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }
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
  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            setShowHideSearchDiv(!showhidesearchdiv);
          }}
        >
          <TbLogout color="green" size={15} />
          Show/Hide
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            SaveExcel(podatatable, "PO Table");
          }}
        >
          <AiFillFileExcel color="green" size={15} />
          SAVE
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            /* checkBP(userData?.EMPL_NO, userData?.MAINDEPTNAME, ["KD"], showNewPO); */
            checkBP(userData, ["KD"], ["ALL"], ["ALL"], showNewPO);
            clearPOform();
          }}
        >
          <AiFillFileAdd color="blue" size={15} />
          NEW PO
        </IconButton>
        <IconButton
          className="buttonIcon"
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
              handle_fillsuaformInvoice,
            );
            //handle_fillsuaformInvoice();
          }}
        >
          <FaFileInvoiceDollar color="lightgreen" size={15} />
          NEW INV
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            /*  checkBP(
              userData?.EMPL_NO,
              userData?.MAINDEPTNAME,
              ["KD"],
              handle_fillsuaform
            ); */
            checkBP(userData, ["KD"], ["ALL"], ["ALL"], handle_fillsuaform);

            //handle_fillsuaform();
          }}
        >
          <AiFillEdit color="orange" size={15} />
          SỬA PO
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            /*  checkBP(
              userData?.EMPL_NO,
              userData?.MAINDEPTNAME,
              ["KD"],
              handleConfirmDeletePO
            ); */
            checkBP(userData, ["KD"], ["ALL"], ["ALL"], handleConfirmDeletePO);
            //handleConfirmDeletePO();
          }}
        >
          <MdOutlineDelete color="red" size={15} />
          XÓA PO
        </IconButton>
        <GridToolbarQuickFilter />
        <IconButton
          className="buttonIcon"
          onClick={() => {
            setShowHidePivotTable(!showhidePivotTable);
          }}
        >
          <MdOutlinePivotTableChart color="#ff33bb" size={15} />
          Pivot
        </IconButton>
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
            return { ...element, id: index, CHECKSTATUS: "Waiting" };
          }),
        );
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  const handletraPO = () => {
    setisLoading(true);
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
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
              };
            },
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
          setPoSummary(po_summary_temp);
          setPoDataTable(loadeddata);
          setisLoading(false);
          setShowHideSearchDiv(false);
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
  const handle_checkPOHangLoat = async () => {
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
          console.log(response.data.tk_status);
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
        tempjson[i].CHECKSTATUS = "NG: Ngày PO không được trước ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      }
    }
    setisLoading(false);
    Swal.fire("Thông báo", "Đã hoàn thành check PO hàng loạt", "success");
    setUploadExcelJSon(tempjson);
  };
  const handle_upPOHangLoat = async () => {
    let tempjson = uploadExcelJson;
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
              "error",
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
        "error",
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
        "success",
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
              "error",
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
        "error",
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
  const handlePOSelectionforUpdate = (ids: GridSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = podatatable.filter((element: any) =>
      selectedID.has(element.PO_ID),
    );
    if (datafilter.length > 0) {
      setPoDataTableFilter(datafilter);
    } else {
      setPoDataTableFilter([]);
    }
  };
  const handle_fillsuaform = () => {
    if (podatatablefilter.length === 1) {
      setSelection({
        ...selection,
        trapo: true,
        thempohangloat: false,
        them1po: !selection.them1po,
      });
      const selectedCodeFilter: CodeListData = {
        G_CODE: podatatablefilter[podatatablefilter.length - 1].G_CODE,
        G_NAME: podatatablefilter[podatatablefilter.length - 1].G_NAME,
        PROD_LAST_PRICE: Number(
          podatatablefilter[podatatablefilter.length - 1].PROD_PRICE,
        ),
        USE_YN: "Y",
        PO_BALANCE: Number(
          podatatablefilter[podatatablefilter.length - 1].PO_BALANCE,
        ),
      };
      const selectedCustomerFilter: CustomerListData = {
        CUST_CD: podatatablefilter[podatatablefilter.length - 1].CUST_CD,
        CUST_NAME_KD:
          podatatablefilter[podatatablefilter.length - 1].CUST_NAME_KD,
      };
      setSelectedCode(selectedCodeFilter);
      setSelectedCust_CD(selectedCustomerFilter);
      setNewPoDate(podatatablefilter[podatatablefilter.length - 1].PO_DATE);
      setNewRdDate(podatatablefilter[podatatablefilter.length - 1].RD_DATE);
      setNewPoQty(
        podatatablefilter[podatatablefilter.length - 1].PO_QTY.toString(),
      );
      setNewPoNo(podatatablefilter[podatatablefilter.length - 1].PO_NO);
      setNewPoPrice(podatatablefilter[podatatablefilter.length - 1].PROD_PRICE);
      setNewPoRemark(podatatablefilter[podatatablefilter.length - 1].REMARK);
      setSelectedID(podatatablefilter[podatatablefilter.length - 1].PO_ID);
    } else if (podatatablefilter.length === 0) {
      clearPOform();
      Swal.fire("Thông báo", "Lỗi: Chọn ít nhất 1 PO để sửa", "error");
    } else {
      Swal.fire("Thông báo", "Lỗi: Chỉ tích chọn 1 dòng để sửa thôi", "error");
    }
  };
  const handle_fillsuaformInvoice = () => {
    if (podatatablefilter.length === 1) {
      setSelection({
        ...selection,
        trapo: true,
        thempohangloat: false,
        them1po: false,
        them1invoice: true,
      });
      const selectedCodeFilter: CodeListData = {
        G_CODE: podatatablefilter[podatatablefilter.length - 1].G_CODE,
        G_NAME: podatatablefilter[podatatablefilter.length - 1].G_NAME,
        PROD_LAST_PRICE: Number(
          podatatablefilter[podatatablefilter.length - 1].PROD_PRICE,
        ),
        USE_YN: "Y",
        PO_BALANCE: Number(
          podatatablefilter[podatatablefilter.length - 1].PO_BALANCE,
        ),
      };
      const selectedCustomerFilter: CustomerListData = {
        CUST_CD: podatatablefilter[podatatablefilter.length - 1].CUST_CD,
        CUST_NAME_KD:
          podatatablefilter[podatatablefilter.length - 1].CUST_NAME_KD,
      };
      setSelectedCode(selectedCodeFilter);
      setSelectedCust_CD(selectedCustomerFilter);
      setNewPoDate(podatatablefilter[podatatablefilter.length - 1].PO_DATE);
      setNewRdDate(podatatablefilter[podatatablefilter.length - 1].RD_DATE);
      setNewInvoiceQty(0);
      setNewPoNo(podatatablefilter[podatatablefilter.length - 1].PO_NO);
      setNewInvoiceDate(moment().add(-1, "day").format("YYYY-MM-DD"));
      setNewInvoiceRemark("");
      setSelectedID(podatatablefilter[podatatablefilter.length - 1].PO_ID);
    } else if (podatatablefilter.length === 0) {
      clearPOform();
      Swal.fire("Thông báo", "Lỗi: Chọn ít nhất 1 PO để thêm invoice", "error");
    } else {
      Swal.fire("Thông báo", "Lỗi: Chỉ tích chọn 1 dòng thêm thôi", "error");
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
              "error",
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
        "error",
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
    if (podatatablefilter.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < podatatablefilter.length; i++) {
        if (podatatablefilter[i].EMPL_NO === userData?.EMPL_NO) {
          await generalQuery("delete_po", {
            PO_ID: podatatablefilter[i].PO_ID,
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
          "success",
        );
      } else {
        Swal.fire(
          "Thông báo",
          "Có lỗi, khả năng xóa phải PO đã có phát sinh giao hàng!",
          "error",
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
  useEffect(() => {
    getcustomerlist();
    getcodelist("");
    //dongboGiaPO();
  }, []);
  return (
    <div className="pomanager">
      <div className="mininavbar">
        <div
          className="mininavitem"
          onClick={() => setNav(1)}
          style={{
            backgroundColor: selection.trapo === true ? "#02c712" : "#abc9ae",
            color: selection.trapo === true ? "yellow" : "yellow",
          }}
        >
          <span className="mininavtext">Tra PO</span>
        </div>
        <div
          className="mininavitem"
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
          <span className="mininavtext">Thêm PO</span>
        </div>
      </div>
      {selection.thempohangloat && (
        <div className="newpo">
          <div className="batchnewpo">
            <h3>Thêm PO Hàng Loạt</h3>
            <div className="formupload">
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
                  confirmCheckPoHangLoat();
                }}
              >
                Check PO
              </div>
              <div
                className="uppobutton"
                onClick={(e) => {
                  e.preventDefault();
                  confirmUpPoHangLoat();
                }}
              >
                Up PO
              </div>
            </div>
            <div className="insertPOTable">
              {true && (
                <DataGrid
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
                />
              )}
            </div>
          </div>
          <div className="singlenewpo"></div>
        </div>
      )}
      {selection.trapo && (
        <div className="tracuuPO">
          {showhidesearchdiv && (
            <div className="tracuuPOform">
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
                <div className="checkboxdiv">
                  <label>
                    <b>All Time:</b>
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
                  <label>
                    <b>Chỉ PO Tồn:</b>
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      type="checkbox"
                      name="pobalancecheckbox"
                      defaultChecked={justpobalance}
                      onChange={() => setJustPOBalance(!justpobalance)}
                    ></input>
                  </label>
                </div>
                <div className="searchbuttondiv">
                  <IconButton
                    className="buttonIcon"
                    onClick={() => {
                      handletraPO();
                    }}
                  >
                    <FcSearch color="green" size={30} />
                    Search
                  </IconButton>
                </div>
              </div>
            </div>
          )}
          <div className="tracuuPOTable">
            <div className="formsummary">
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
                        currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                      })}
                    </td>
                    <td style={{ color: "blue", fontWeight: "bold" }}>
                      {" "}
                      {poSummary.total_delivered_amount.toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                        },
                      )}
                    </td>
                    <td style={{ color: "blue", fontWeight: "bold" }}>
                      {" "}
                      {poSummary.total_pobalance_amount.toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: getGlobalSetting()?.filter((ele: WEB_SETTING_DATA, index: number)=> ele.ITEM_NAME==='CURRENCY')[0]?.CURRENT_VALUE ?? "USD",
                        },
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="tablegrid">
              <DataGrid
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
              />
            </div>
          </div>
        </div>
      )}
      {selection.them1po && (
        <div className="them1po">
          <div className="formnho">
            <div className="dangkyform">
              <h3>Thêm PO mới</h3>
              <div className="dangkyinput">
                <div className="dangkyinputbox">
                  <label>
                    <b>Khách hàng:</b>{" "}
                    <Autocomplete
                      size="small"
                      disablePortal
                      options={customerList}
                      className="autocomplete"
                      filterOptions={filterOptions1}
                      isOptionEqualToValue={(option: any, value: any) =>
                        option.CUST_CD === value.CUST_CD
                      }
                      getOptionLabel={(option: CustomerListData | any) =>
                        `${option.CUST_CD}: ${option.CUST_NAME_KD}`
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Select customer" />
                      )}
                      value={selectedCust_CD}
                      onChange={(
                        event: any,
                        newValue: CustomerListData | any,
                      ) => {
                        (async () => {
                          if (company !== "CMS") {
                            setNewPoNo(
                              await autogeneratePO_NO(newValue.CUST_CD),
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
                      size="small"
                      disablePortal
                      options={codeList}
                      className="autocomplete"
                      filterOptions={filterOptions1}
                      isOptionEqualToValue={(option: any, value: any) =>
                        option.G_CODE === value.G_CODE
                      }
                      getOptionLabel={(option: CodeListData | any) =>
                        `${option.G_CODE}: ${option.G_NAME}`
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Select code" />
                      )}
                      onChange={(event: any, newValue: CodeListData | any) => {
                        console.log(newValue);
                        loadprice(
                          newValue.G_CODE,
                          selectedCust_CD?.CUST_NAME_KD,
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
                      className="inputdata"
                      type="date"
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
                      className="inputdata"
                      type="date"
                      value={newrddate.slice(0, 10)}
                      onChange={(e) => setNewRdDate(e.target.value)}
                    ></input>
                  </label>
                </div>
                <div className="dangkyinputbox">
                  <label>
                    <b>PO NO:</b>{" "}
                    <TextField
                      value={newpono}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewPoNo(e.target.value)
                      }
                      size="small"
                      color="success"
                      className="autocomplete"
                      id="outlined-basic"
                      label="Số PO"
                      variant="outlined"
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
                          },
                        )[0]?.PROD_PRICE;
                        if (tempprice !== undefined)
                          setNewPoPrice(tempprice.toString());
                        setNewPoQty(e.target.value);
                      }}
                      size="small"
                      color="success"
                      className="autocomplete"
                      id="outlined-basic"
                      label="PO QTY"
                      variant="outlined"
                    />
                  </label>
                  <label>
                    <b>Price:</b>{" "}
                    <TextField
                      value={newpoprice}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewPoPrice(e.target.value)
                      }
                      size="small"
                      color="success"
                      className="autocomplete"
                      id="outlined-basic"
                      label="Price"
                      variant="outlined"
                    />
                  </label>
                  <label>
                    <b>Remark:</b>{" "}
                    <TextField
                      value={newporemark}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewPoRemark(e.target.value)
                      }
                      size="small"
                      color="success"
                      className="autocomplete"
                      id="outlined-basic"
                      label="Remark"
                      variant="outlined"
                    />
                  </label>
                </div>
              </div>
              <div className="dangkybutton">
                <button
                  className="thembutton"
                  onClick={() => {
                    handle_add_1PO();
                  }}
                >
                  Thêm PO
                </button>
                <button
                  className="suabutton"
                  onClick={() => {
                    updatePO();
                  }}
                >
                  Sửa PO
                </button>
                <button
                  className="xoabutton"
                  onClick={() => {
                    clearPOform();
                  }}
                >
                  Clear
                </button>
                <button
                  className="closebutton"
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
        <div className="them1invoice">
          <div className="formnho">
            <div className="dangkyform">
              <h3>Thêm Invoice mới</h3>
              <div className="dangkyinput">
                <div className="dangkyinputbox">
                  <label>
                    <b>Khách hàng:</b>{" "}
                    <Autocomplete
                      size="small"
                      disablePortal
                      options={customerList}
                      className="autocomplete"
                      getOptionLabel={(option: CustomerListData) =>
                        `${option.CUST_CD}: ${option.CUST_NAME_KD}`
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Select customer" />
                      )}
                      value={selectedCust_CD}
                      onChange={(
                        event: any,
                        newValue: CustomerListData | null,
                      ) => {
                        console.log(newValue);
                        setSelectedCust_CD(newValue);
                      }}
                    />
                  </label>
                  <label>
                    <b>Code hàng:</b>{" "}
                    <Autocomplete
                      size="small"
                      disablePortal
                      options={codeList}
                      className="autocomplete"
                      filterOptions={filterOptions1}
                      getOptionLabel={(option: CodeListData | any) =>
                        `${option.G_CODE}: ${option.G_NAME}`
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Select code" />
                      )}
                      onChange={(event: any, newValue: CodeListData | any) => {
                        console.log(newValue);
                        setNewPoPrice(
                          newValue === null
                            ? ""
                            : newValue.PROD_LAST_PRICE.toString(),
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
                      className="inputdata"
                      type="date"
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
                      className="inputdata"
                      type="date"
                      value={newrddate.slice(0, 10)}
                      onChange={(e) => setNewRdDate(e.target.value)}
                    ></input>
                  </label>
                </div>
                <div className="dangkyinputbox">
                  <label>
                    <b>PO NO:</b>{" "}
                    <TextField
                      value={newpono}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewPoNo(e.target.value)
                      }
                      size="small"
                      color="success"
                      className="autocomplete"
                      id="outlined-basic"
                      label="Số PO"
                      variant="outlined"
                    />
                  </label>
                  <label>
                    <b>Invoice QTY:</b>{" "}
                    <TextField
                      value={newinvoiceQTY}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewInvoiceQty(Number(e.target.value))
                      }
                      size="small"
                      color="success"
                      className="autocomplete"
                      id="outlined-basic"
                      label="INVOICE QTY"
                      variant="outlined"
                    />
                  </label>
                  <label>
                    <b>Invoice Date:</b>{" "}
                    <input
                      onKeyDown={(e) => {
                        handleSearchCodeKeyDown(e);
                      }}
                      className="inputdata"
                      type="date"
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
                      size="small"
                      className="autocomplete"
                      id="outlined-basic"
                      label="Remark"
                      variant="outlined"
                    />
                  </label>
                </div>
              </div>
              <div className="dangkybutton">
                <button
                  className="thembutton"
                  onClick={() => {
                    handle_add_1Invoice();
                  }}
                >
                  Thêm Invoice
                </button>
                <button
                  className="suabutton"
                  onClick={() => {
                    clearInvoiceform();
                  }}
                >
                  Clear
                </button>
                <button
                  className="closebutton"
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
          <PivotTable datasource={dataSource} tableID="potablepivot" />
        </div>
      )}
    </div>
  );
};
export default PoManager2;
