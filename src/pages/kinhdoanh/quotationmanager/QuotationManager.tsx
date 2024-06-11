import {
  Autocomplete,
  Button,
  IconButton,
  TextField,
  createFilterOptions,
} from "@mui/material";
import DataGrid, {
  Column,
  ColumnChooser,
  Editing,
  Export,
  FilterRow,
  Item,
  Pager,
  Paging,
  Scrolling,
  SearchPanel,
  Selection,
  Summary,
  Toolbar,
  TotalItem,
} from "devextreme-react/data-grid";
import moment, { duration } from "moment";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  AiFillCloseCircle,
  AiFillDelete,
  AiFillFileAdd,
  AiFillFileExcel,
  AiOutlineCheckSquare,
  AiOutlineCloudUpload,
  AiOutlineHistory,
  AiOutlinePrinter,
} from "react-icons/ai";
import Swal from "sweetalert2";
import "./QuotationManager.scss";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import {
  MdOutlineManageHistory,
  MdOutlinePivotTableChart,
} from "react-icons/md";
import { CustomResponsiveContainer, SaveExcel, checkBP, weekdayarray } from "../../../api/GlobalFunction";
import { generalQuery, getAuditMode, getCompany, getSever } from "../../../api/Api";
import PivotTable from "../../../components/PivotChart/PivotChart";
import { RootState } from "../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { BiCloudUpload } from "react-icons/bi";
import * as XLSX from "xlsx";
import { FcApproval } from "react-icons/fc";
import { GrUpdate } from "react-icons/gr";
import { TbLogout } from "react-icons/tb";
import QuotationForm from "./QuotationForm/QuotationForm";
import { useReactToPrint } from "react-to-print";
import {
  BANGGIA_DATA,
  BANGGIA_DATA2,
  CodeListDataUpGia,
  CustomerListData,
  UserData,
} from "../../../api/GlobalInterface";
const QuotationManager = () => {
  const dataGridRef = useRef<any>(null);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [trigger, setTrigger] = useState(true);
  const [sh, setSH] = useState(false);
  const showhidesearchdiv = useRef(true);
  const [selectedUploadExcelRow, setSelectedUploadExcelRow] = useState<
    BANGGIA_DATA2[]
  >([]);
  const [selectedBangGiaDocRow, setselectedBangGiaDocRow] = useState<
    BANGGIA_DATA2[]
  >([]);
  const [selectedCode, setSelectedCode] = useState<CodeListDataUpGia | null>({
    G_CODE: "6A00001A",
    G_NAME: "GT-I9500_SJ68-01284A",
    G_NAME_KD: "SJ68-01284A",
    PROD_MAIN_MATERIAL: "ST-5555HC",
  });
  const [selectedCust_CD, setSelectedCust_CD] =
    useState<CustomerListData | null>({
      CUST_CD: "0003",
      CUST_NAME_KD: "PHAN D&D HA NOI",
      CUST_NAME: "PHAN D&D HA NOI",
    });
  const [customerList, setCustomerList] = useState<CustomerListData[]>([
    {
      CUST_CD: "0003",
      CUST_NAME_KD: "PHAN D&D HA NOI",
      CUST_NAME: "PHAN D&D HA NOI",
    },
  ]);
  const [codelist, setCodeList] = useState<CodeListDataUpGia[]>([
    {
      G_CODE: "6A00001A",
      G_NAME: "GT-I9500_SJ68-01284A",
      G_NAME_KD: "SJ68-01284A",
      PROD_MAIN_MATERIAL: "ST-5555HC",
    },
  ]);
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
  const [moq, setMOQ] = useState(1);
  const [newprice, setNewPrice] = useState("");
  const [newbep, setNewBep] = useState("");
  const [newpricedate, setNewPriceDate] = useState(
    moment.utc().format("YYYY-MM-DD"),
  );
  const [banggia, setBangGia] = useState<BANGGIA_DATA[]>([]);
  const [banggia2, setBangGia2] = useState<BANGGIA_DATA2[]>([]);
  const [banggiachung, setBangGiaChung] = useState<Array<any>>([]);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [alltime, setAllTime] = useState(true);
  const [cust_name, setCust_Name] = useState("");
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [m_name, setM_Name] = useState("");
  const [selectbutton, setSelectButton] = useState(false);
  const [showhideupprice, setShowHideUpPrice] = useState(false);
  const [uploadExcelJson, setUploadExcelJSon] = useState<Array<any>>([]);
  const [showhideQuotationForm, setShowHideQuotationForm] = useState(false);
  const clearSelection = () => {
    if (dataGridRef.current) {
      dataGridRef.current.instance.clearSelection();
      setselectedBangGiaDocRow([]);
      //qlsxplandatafilter.current = [];
      //console.log(dataGridRef.current);
    }
  };
  const pheduyetgia = async () => {
    if (selectedBangGiaDocRow.length > 0) {
      let err_code: string = "";
      for (let i = 0; i < selectedBangGiaDocRow.length; i++) {
        await generalQuery("pheduyetgia", {
          ...selectedBangGiaDocRow[i],
          FINAL: selectedBangGiaDocRow[i].FINAL === "Y" ? "N" : "Y",
        })
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
            } else {
              err_code += `Lỗi : ${response.data.message} |`;
              //Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
            }
          })
          .catch((error) => {
            console.log(error);
            Swal.fire("Thông báo", " Có lỗi : " + error, "error");
          });
      }
      if (err_code === "") {
        Swal.fire("Thông báo", "Phê duyệt giá thành công", "success");
        checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadBangGia2);
      } else {
        Swal.fire("Thông báo", " Có lỗi : " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để phê duyệt", "error");
    }
  };
  const handleShowHideSearchBar = () => {
    console.log(showhidesearchdiv.current);
    showhidesearchdiv.current = !showhidesearchdiv.current;
    setSH(!showhidesearchdiv.current);
  };
  const clearuploadrow = () => {
    if (selectedUploadExcelRow.length > 0) {
      let tempexceltable: BANGGIA_DATA2[] = uploadExcelJson;
      for (let j = 0; j < tempexceltable.length; j++) {
        for (let i = 0; i < selectedUploadExcelRow.length; i++) {
          if (selectedUploadExcelRow[i].id === tempexceltable[j].id) {
            tempexceltable.splice(j, 1);
          }
        }
      }
      console.log(tempexceltable);
      setUploadExcelJSon(tempexceltable);
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để clear", "error");
    }
  };
  const uploadgia = async () => {
    if (uploadExcelJson.length > 0) {
      let err_code: string = "";
      for (let i = 0; i < uploadExcelJson.length; i++) {
        await generalQuery("upgiasp", uploadExcelJson[i])
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
            } else {
              err_code += `Lỗi : ${response.data.message} |`;
              //Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
            }
          })
          .catch((error) => {
            console.log(error);
            Swal.fire("Thông báo", " Có lỗi : " + error, "error");
          });
      }
      if (err_code === "") {
        Swal.fire("Thông báo", "Up giá thành công", "success");
      } else {
        Swal.fire("Thông báo", " Có lỗi : " + err_code, "error");
      }
    } else {
      Swal.fire(
        "Thông báo",
        "Thêm dòng hoặc import excel file để up giá",
        "error",
      );
    }
  };
  const filterOptions1 = createFilterOptions({
    matchFrom: "any",
    limit: 100,
  });
  const loadCodeList = () => {
    generalQuery("loadM100UpGia", {})
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: CodeListDataUpGia[] = response.data.data.map(
            (element: CodeListDataUpGia, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          setCodeList(loaded_data);
        } else {
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
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
  const fields_banggia: any = [
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
        width: 300,
      },
    },
    {
      caption: "MOQ",
      width: 80,
      dataField: "MOQ",
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
      caption: "PRICE1",
      width: 80,
      dataField: "PRICE1",
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
      caption: "PRICE2",
      width: 80,
      dataField: "PRICE2",
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
      caption: "PRICE3",
      width: 80,
      dataField: "PRICE3",
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
      caption: "PRICE4",
      width: 80,
      dataField: "PRICE4",
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
      caption: "PRICE5",
      width: 80,
      dataField: "PRICE5",
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
      caption: "PRICE6",
      width: 80,
      dataField: "PRICE6",
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
      caption: "PRICE7",
      width: 80,
      dataField: "PRICE7",
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
      caption: "PRICE8",
      width: 80,
      dataField: "PRICE8",
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
      caption: "PRICE9",
      width: 80,
      dataField: "PRICE9",
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
      caption: "PRICE10",
      width: 80,
      dataField: "PRICE10",
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
      caption: "PRICE11",
      width: 80,
      dataField: "PRICE11",
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
      caption: "PRICE12",
      width: 80,
      dataField: "PRICE12",
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
      caption: "PRICE13",
      width: 80,
      dataField: "PRICE13",
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
      caption: "PRICE14",
      width: 80,
      dataField: "PRICE14",
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
      caption: "PRICE15",
      width: 80,
      dataField: "PRICE15",
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
      caption: "PRICE16",
      width: 80,
      dataField: "PRICE16",
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
      caption: "PRICE17",
      width: 80,
      dataField: "PRICE17",
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
      caption: "PRICE18",
      width: 80,
      dataField: "PRICE18",
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
      caption: "PRICE19",
      width: 80,
      dataField: "PRICE19",
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
      caption: "PRICE20",
      width: 80,
      dataField: "PRICE20",
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
      caption: "PRICE_DATE1",
      width: 80,
      dataField: "PRICE_DATE1",
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
      caption: "PRICE_DATE2",
      width: 80,
      dataField: "PRICE_DATE2",
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
      caption: "PRICE_DATE3",
      width: 80,
      dataField: "PRICE_DATE3",
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
      caption: "PRICE_DATE4",
      width: 80,
      dataField: "PRICE_DATE4",
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
      caption: "PRICE_DATE5",
      width: 80,
      dataField: "PRICE_DATE5",
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
      caption: "PRICE_DATE6",
      width: 80,
      dataField: "PRICE_DATE6",
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
      caption: "PRICE_DATE7",
      width: 80,
      dataField: "PRICE_DATE7",
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
      caption: "PRICE_DATE8",
      width: 80,
      dataField: "PRICE_DATE8",
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
      caption: "PRICE_DATE9",
      width: 80,
      dataField: "PRICE_DATE9",
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
      caption: "PRICE_DATE10",
      width: 80,
      dataField: "PRICE_DATE10",
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
      caption: "PRICE_DATE11",
      width: 80,
      dataField: "PRICE_DATE11",
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
      caption: "PRICE_DATE12",
      width: 80,
      dataField: "PRICE_DATE12",
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
      caption: "PRICE_DATE13",
      width: 80,
      dataField: "PRICE_DATE13",
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
      caption: "PRICE_DATE14",
      width: 80,
      dataField: "PRICE_DATE14",
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
      caption: "PRICE_DATE15",
      width: 80,
      dataField: "PRICE_DATE15",
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
      caption: "PRICE_DATE16",
      width: 80,
      dataField: "PRICE_DATE16",
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
      caption: "PRICE_DATE17",
      width: 80,
      dataField: "PRICE_DATE17",
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
      caption: "PRICE_DATE18",
      width: 80,
      dataField: "PRICE_DATE18",
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
      caption: "PRICE_DATE19",
      width: 80,
      dataField: "PRICE_DATE19",
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
      caption: "PRICE_DATE20",
      width: 80,
      dataField: "PRICE_DATE20",
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
  const fields_banggia2: any = [
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
      caption: "PRICE_DATE",
      width: 80,
      dataField: "PRICE_DATE",
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
      caption: "MOQ",
      width: 80,
      dataField: "MOQ",
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
      caption: "FINAL",
      width: 80,
      dataField: "FINAL",
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
        fields: fields_banggia,
        store: banggia,
      }),
    );
  const banggiaMM = React.useMemo(
    () => (
      <div className="datatb">
        <CustomResponsiveContainer>
          <DataGrid
            style={{ fontSize: "0.7rem" }}
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={banggia}
            columnWidth="auto"
            keyExpr="id"
            height={"70vh"}
            showBorders={true}
            onSelectionChanged={(e) => {
              //console.log(e.selectedRowsData);
              /*  setSelectedRowsDataYCSX(e.selectedRowsData); */
            }}
            onRowClick={(e) => {
              //console.log(e.data);
            }}
          >
            <Scrolling
              useNative={true}
              scrollByContent={true}
              scrollByThumb={true}
              showScrollbar="onHover"
              mode="virtual"
            />
            <Selection mode="multiple" selectAllMode="allPages" />
            <Editing
              allowUpdating={false}
              allowAdding={false}
              allowDeleting={false}
              mode="cell"
              confirmDelete={false}
              onChangesChange={(e) => { }}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location="before">
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    showhidesearchdiv.current = !showhidesearchdiv.current;
                    setSH(!showhidesearchdiv.current);
                  }}
                >
                  <TbLogout color="green" size={15} />
                  Show/Hide
                </IconButton>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(banggia, "PriceTable");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  SAVE
                </IconButton>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    setShowHidePivotTable(!showhidePivotTable);
                  }}
                >
                  <MdOutlinePivotTableChart color="#ff33bb" size={15} />
                  Pivot
                </IconButton>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadBangGia2);
                    loadCodeList();
                    getcustomerlist();
                    setShowHideUpPrice(true);
                  }}
                >
                  <BiCloudUpload color="#070EFA" size={15} />
                  Up Giá
                </IconButton>
              </Item>
              <Item name="searchPanel" />
              <Item name="exportButton" />
              <Item name="columnChooserButton" />
              <Item name="addRowButton" />
              <Item name="saveButton" />
              <Item name="revertButton" />
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
              infoText="Page #{0}. Total: {1} ({2} items)"
              displayMode="compact"
            />
            <Column
              dataField="CUST_NAME_KD"
              caption="CUST_NAME_KD"
              width={100}
            ></Column>
            <Column dataField="G_CODE" caption="G_CODE" width={100}></Column>
            <Column dataField="G_NAME" caption="G_NAME" width={250}></Column>
            <Column
              dataField="G_NAME_KD"
              caption="G_NAME_KD"
              width={100}
            ></Column>
            <Column
              dataField="PROD_MAIN_MATERIAL"
              caption="PROD_MAIN_MATERIAL"
              width={100}
            ></Column>
            <Column dataField="MOQ" caption="MOQ" width={100}></Column>
            <Column
              dataField="PRICE1"
              caption="PRICE1"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE1?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE2"
              caption="PRICE2"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE2?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE3"
              caption="PRICE3"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE3?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE4"
              caption="PRICE4"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE4?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE5"
              caption="PRICE5"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE5?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE6"
              caption="PRICE6"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE6?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE7"
              caption="PRICE7"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE7?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE8"
              caption="PRICE8"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE8?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE9"
              caption="PRICE9"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE9?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE10"
              caption="PRICE10"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE10?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE11"
              caption="PRICE11"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE11?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE12"
              caption="PRICE12"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE12?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE13"
              caption="PRICE13"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE13?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE14"
              caption="PRICE14"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE14?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE15"
              caption="PRICE15"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE15?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE16"
              caption="PRICE16"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE16?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE17"
              caption="PRICE17"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE17?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE18"
              caption="PRICE18"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE18?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE19"
              caption="PRICE19"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE19?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE20"
              caption="PRICE20"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PRICE20?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE_DATE1"
              caption="PRICE_DATE1"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE2"
              caption="PRICE_DATE2"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE3"
              caption="PRICE_DATE3"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE4"
              caption="PRICE_DATE4"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE5"
              caption="PRICE_DATE5"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE6"
              caption="PRICE_DATE6"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE7"
              caption="PRICE_DATE7"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE8"
              caption="PRICE_DATE8"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE9"
              caption="PRICE_DATE9"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE10"
              caption="PRICE_DATE10"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE11"
              caption="PRICE_DATE11"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE12"
              caption="PRICE_DATE12"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE13"
              caption="PRICE_DATE13"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE14"
              caption="PRICE_DATE14"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE15"
              caption="PRICE_DATE15"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE16"
              caption="PRICE_DATE16"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE17"
              caption="PRICE_DATE17"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE18"
              caption="PRICE_DATE18"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE19"
              caption="PRICE_DATE19"
              width={100}
            ></Column>
            <Column
              dataField="PRICE_DATE20"
              caption="PRICE_DATE20"
              width={100}
            ></Column>
            <Summary>
              <TotalItem
                alignment="right"
                column="G_CODE"
                summaryType="count"
                valueFormat={"decimal"}
              />
            </Summary>
          </DataGrid>
        </CustomResponsiveContainer>
      </div>
    ),
    [banggia],
  );
  const banggiaMM2 = React.useMemo(
    () => (
      <div className="datatb">
        <CustomResponsiveContainer>
          <DataGrid
            style={{ fontSize: "0.7rem" }}
            ref={dataGridRef}
            autoNavigateToFocusedRow={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={false}
            cellHintEnabled={true}
            columnResizingMode={"widget"}
            showColumnLines={true}
            dataSource={banggia2}
            columnWidth="auto"
            keyExpr="id"
            height={"70vh"}
            showBorders={true}
            onSelectionChanged={(e) => {
              //console.log(e.selectedRowsData);
              setselectedBangGiaDocRow(e.selectedRowsData);
            }}
            onRowClick={(e) => {
              //console.log(e.data);
            }}
          >
            <Scrolling
              useNative={true}
              scrollByContent={true}
              scrollByThumb={true}
              showScrollbar="onHover"
              mode="virtual"
            />
            <Selection mode="multiple" selectAllMode="allPages" />
            <Editing
              allowUpdating={true}
              allowAdding={false}
              allowDeleting={false}
              mode="cell"
              confirmDelete={false}
              onChangesChange={(e) => { }}
            />
            <Export enabled={true} />
            <Toolbar disabled={false}>
              <Item location="before">
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    showhidesearchdiv.current = !showhidesearchdiv.current;
                    setSH(!showhidesearchdiv.current);
                  }}
                >
                  <TbLogout color="green" size={15} />
                  Show/Hide
                </IconButton>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    SaveExcel(banggia2, "PriceTable");
                  }}
                >
                  <AiFillFileExcel color="green" size={15} />
                  SAVE
                </IconButton>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    setShowHidePivotTable(!showhidePivotTable);
                  }}
                >
                  <MdOutlinePivotTableChart color="#ff33bb" size={15} />
                  Pivot
                </IconButton>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    /* checkBP(
                    userData?.EMPL_NO,
                    userData?.MAINDEPTNAME,
                    ["KD"],
                    loadBangGia2
                  ); */
                    checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadBangGia2);
                    loadCodeList();
                    getcustomerlist();
                    setShowHideUpPrice(true);
                  }}
                >
                  <BiCloudUpload color="#070EFA" size={15} />
                  Up Giá
                </IconButton>
                <IconButton
                  className="buttonIcon"
                  onClick={() => {
                    setShowHideQuotationForm(true);
                  }}
                >
                  <AiOutlinePrinter color="#F900C8" size={15} />
                  In báo giá
                </IconButton>
              </Item>
              <Item name="searchPanel" />
              <Item name="exportButton" />
              <Item name="columnChooserButton" />
              <Item name="addRowButton" />
              <Item name="saveButton" />
              <Item name="revertButton" />
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
              infoText="Page #{0}. Total: {1} ({2} items)"
              displayMode="compact"
            />
            <Column
              dataField="PROD_ID"
              caption="PROD_ID"
              width={50}
            ></Column>
            <Column
              dataField="CUST_NAME_KD"
              caption="CUST_NAME_KD"
              width={100}
            ></Column>
            <Column dataField="CUST_CD" caption="CUST_CD" width={100}></Column>
            <Column dataField="G_CODE" caption="G_CODE" width={100}></Column>
            <Column dataField="G_NAME" caption="G_NAME" width={250}></Column>
            <Column
              dataField="G_NAME_KD"
              caption="G_NAME_KD"
              width={100}
            ></Column>
            <Column
              dataField="PROD_MAIN_MATERIAL"
              caption="PROD_MAIN_MATERIAL"
              width={200}
            ></Column>
            <Column dataField="MOQ" caption="MOQ" width={100}></Column>
            <Column
              dataField="PROD_PRICE"
              caption="PROD_PRICE"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.PROD_PRICE?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="BEP"
              caption="BEP"
              width={100}
              dataType="number"
              format={"decimal"}
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "blue", fontWeight: "normal" }}>
                    {e.data.BEP?.toFixed(6).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="PRICE_DATE"
              caption="PRICE_DATE"
              width={100}
              dataType="date"
              cellRender={(e: any) => {
                return (
                  <span style={{ color: "black", fontWeight: "normal" }}>
                    {moment.utc(e.data.PRICE_DATE).format("YYYY-MM-DD")}
                  </span>
                );
              }}
            ></Column>
            <Column
              dataField="FINAL"
              caption="APPROVAL"
              width={100}
              cellRender={(e: any) => {
                if (e.data.FINAL === "Y") {
                  return (
                    <div
                      style={{
                        color: "white",
                        backgroundColor: "#13DC0C",
                        width: "80px",
                        textAlign: "center",
                      }}
                    >
                      Y
                    </div>
                  );
                } else {
                  return (
                    <div
                      style={{
                        color: "white",
                        backgroundColor: "red",
                        width: "80px",
                        textAlign: "center",
                      }}
                    >
                      Not Approved
                    </div>
                  );
                }
              }}
            ></Column>
            <Column
              dataField="DUPLICATE"
              caption="DUPLICATE"
              width={100}
              cellRender={(e: any) => {
                if (e.data.DUPLICATE ===1) {
                  return (
                    <div
                      style={{
                        color: "white",
                        backgroundColor: "#13DC0C",
                        width: "80px",
                        textAlign: "center",
                      }}
                    >
                      OK
                    </div>
                  );
                } else {
                  return (
                    <div
                      style={{
                        color: "white",
                        backgroundColor: "red",
                        width: "80px",
                        textAlign: "center",
                      }}
                    >
                      NG
                    </div>
                  );
                }
              }}
            ></Column>
            <Column dataField="INS_DATE" caption="INS_DATE" width={120}></Column>
            <Column dataField="INS_EMPL" caption="INS_EMPL" width={80}></Column>
            <Column dataField="UPD_DATE" caption="UPD_DATE" width={120}></Column>
            <Column dataField="UPD_EMPL" caption="UPD_EMPL" width={80}></Column>
            <Summary>
              <TotalItem
                alignment="right"
                column="G_CODE"
                summaryType="count"
                valueFormat={"decimal"}
              />
            </Summary>
          </DataGrid>
        </CustomResponsiveContainer>
      </div>
    ),
    [banggia2],
  );
  const upgiaMM2 = React.useMemo(
    () => (
      <div className="datatb">
        <DataGrid
          style={{ fontSize: "0.7rem" }}
          autoNavigateToFocusedRow={true}
          allowColumnReordering={true}
          allowColumnResizing={true}
          columnAutoWidth={false}
          cellHintEnabled={true}
          columnResizingMode={"widget"}
          showColumnLines={true}
          dataSource={uploadExcelJson}
          columnWidth="auto"
          keyExpr="id"
          height={"70vh"}
          showBorders={true}
          onSelectionChanged={(e) => {
            //console.log(e.selectedRowsData);
            /*  setSelectedRowsDataYCSX(e.selectedRowsData); */
            setSelectedUploadExcelRow(e.selectedRowsData);
          }}
          onRowClick={(e) => {
            //console.log(e.data);
          }}
        >
          <Scrolling
            useNative={true}
            scrollByContent={true}
            scrollByThumb={true}
            showScrollbar="onHover"
            mode="virtual"
          />
          <Selection mode="multiple" selectAllMode="allPages" />
          <Editing
            allowUpdating={false}
            allowAdding={false}
            allowDeleting={true}
            mode="cell"
            confirmDelete={false}
            onChangesChange={(e) => { }}
          />
          <Export enabled={true} />
          <Toolbar disabled={false}>
            <Item location="before">
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  SaveExcel(banggia2, "PriceTable");
                }}
              >
                <AiFillFileExcel color="green" size={15} />
                SAVE
              </IconButton>
            </Item>
            <Item name="searchPanel" />
            <Item name="exportButton" />
            <Item name="columnChooserButton" />
            <Item name="addRowButton" />
            <Item name="saveButton" />
            <Item name="revertButton" />
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
            infoText="Page #{0}. Total: {1} ({2} items)"
            displayMode="compact"
          />
          <Column
            dataField="PROD_ID"
            caption="PROD_ID"
            width={50}
          ></Column>
          <Column
            dataField="CUST_NAME_KD"
            caption="CUST_NAME_KD"
            width={100}
          ></Column>
          <Column dataField="CUST_CD" caption="CUST_CD" width={100}></Column>
          <Column dataField="G_CODE" caption="G_CODE" width={100}></Column>
          <Column dataField="G_NAME" caption="G_NAME" width={250}></Column>
          <Column
            dataField="G_NAME_KD"
            caption="G_NAME_KD"
            width={100}
          ></Column>
          <Column
            dataField="PROD_MAIN_MATERIAL"
            caption="PROD_MAIN_MATERIAL"
            width={200}
          ></Column>
          <Column dataField="MOQ" caption="MOQ" width={100}></Column>
          <Column
            dataField="PROD_PRICE"
            caption="PROD_PRICE"
            width={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.PROD_PRICE?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,
                  })}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="BEP"
            caption="BEP"
            width={100}
            dataType="number"
            format={"decimal"}
            cellRender={(e: any) => {
              return (
                <span style={{ color: "blue", fontWeight: "normal" }}>
                  {e.data.BEP?.toFixed(6).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,
                  })}
                </span>
              );
            }}
          ></Column>
          <Column
            dataField="PRICE_DATE"
            caption="PRICE_DATE"
            width={100}
            dataType="date"
            cellRender={(e: any) => {
              return (
                <span style={{ color: "black", fontWeight: "normal" }}>
                  {moment.utc(e.data.PRICE_DATE).format("YYYY-MM-DD")}
                </span>
              );
            }}
          ></Column>
          <Column dataField="FINAL" caption="APPROVAL" width={100}></Column>
          <Column
            dataField="CHECKSTATUS"
            caption="CHECKSTATUS"
            width={100}
            cellRender={(e: any) => {
              return (
                <span
                  style={{
                    backgroundColor:
                      e.data.CHECKSTATUS === "READY" ? "green" : "red",
                    color: "white",
                    padding: "5px",
                  }}
                >
                  {e.data.CHECKSTATUS}
                </span>
              );
            }}
          ></Column>
          <Summary>
            <TotalItem
              alignment="right"
              column="G_CODE"
              summaryType="count"
              valueFormat={"decimal"}
            />
          </Summary>
        </DataGrid>
      </div>
    ),
    [uploadExcelJson],
  );
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
        setUploadExcelJSon(
          json.map((element: any, index: number) => {
            let temp_fil: CodeListDataUpGia = codelist.filter(
              (ele: CodeListDataUpGia, index: number) =>
                ele.G_CODE === element.G_CODE,
            )[0];
            let temp_filCUST: CustomerListData = customerList.filter(
              (ele: CustomerListData, index: number) =>
                ele.CUST_CD === element.CUST_CD,
            )[0];
            return {
              ...element,
              id: index,
              CUST_NAME_KD:
                temp_filCUST !== undefined ? temp_filCUST.CUST_NAME_KD : "NA",
              G_NAME: temp_fil !== undefined ? temp_fil.G_NAME : "NA",
              G_NAME_KD: temp_fil !== undefined ? temp_fil.G_NAME_KD : "NA",
              PROD_MAIN_MATERIAL:
                temp_fil !== undefined ? temp_fil.PROD_MAIN_MATERIAL : "NA",
              CHECKSTATUS:
                temp_fil !== undefined && temp_filCUST !== undefined
                  ? "READY"
                  : "NG",
              PRICE_DATE:
                element.PRICE_DATE === null
                  ? moment.utc().format("YYYY-MM-DD")
                  : element.PRICE_DATE,
            };
          }),
        );
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
  const loadBangGia = () => {
    generalQuery("loadbanggia", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      M_NAME: m_name,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      CUST_NAME_KD: cust_name,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: BANGGIA_DATA[] = response.data.data.map(
            (element: BANGGIA_DATA, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element?.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element?.G_NAME_KD : element?.G_NAME?.search('CNDB') ==-1 ? element?.G_NAME_KD : 'TEM_NOI_BO',
                PRICE_DATE1:
                  element.PRICE_DATE1 !== null
                    ? moment.utc(element.PRICE_DATE1).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE2:
                  element.PRICE_DATE2 !== null
                    ? moment.utc(element.PRICE_DATE2).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE3:
                  element.PRICE_DATE3 !== null
                    ? moment.utc(element.PRICE_DATE3).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE4:
                  element.PRICE_DATE4 !== null
                    ? moment.utc(element.PRICE_DATE4).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE5:
                  element.PRICE_DATE5 !== null
                    ? moment.utc(element.PRICE_DATE5).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE6:
                  element.PRICE_DATE6 !== null
                    ? moment.utc(element.PRICE_DATE6).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE7:
                  element.PRICE_DATE7 !== null
                    ? moment.utc(element.PRICE_DATE7).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE8:
                  element.PRICE_DATE8 !== null
                    ? moment.utc(element.PRICE_DATE8).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE9:
                  element.PRICE_DATE9 !== null
                    ? moment.utc(element.PRICE_DATE9).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE10:
                  element.PRICE_DATE10 !== null
                    ? moment.utc(element.PRICE_DATE10).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE11:
                  element.PRICE_DATE11 !== null
                    ? moment.utc(element.PRICE_DATE11).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE12:
                  element.PRICE_DATE12 !== null
                    ? moment.utc(element.PRICE_DATE12).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE13:
                  element.PRICE_DATE13 !== null
                    ? moment.utc(element.PRICE_DATE13).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE14:
                  element.PRICE_DATE14 !== null
                    ? moment.utc(element.PRICE_DATE14).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE15:
                  element.PRICE_DATE15 !== null
                    ? moment.utc(element.PRICE_DATE15).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE16:
                  element.PRICE_DATE16 !== null
                    ? moment.utc(element.PRICE_DATE16).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE17:
                  element.PRICE_DATE17 !== null
                    ? moment.utc(element.PRICE_DATE17).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE18:
                  element.PRICE_DATE18 !== null
                    ? moment.utc(element.PRICE_DATE18).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE19:
                  element.PRICE_DATE19 !== null
                    ? moment.utc(element.PRICE_DATE19).format("YYYY-MM-DD")
                    : "",
                PRICE_DATE20:
                  element.PRICE_DATE20 !== null
                    ? moment.utc(element.PRICE_DATE20).format("YYYY-MM-DD")
                    : "",
                id: index,
              };
            },
          );
          setBangGia(loaded_data);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fields_banggia,
              store: loaded_data,
            }),
          );
          clearSelection();
        } else {
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
    setselectedBangGiaDocRow([]);
  };
  const loadBangGia2 = () => {
    generalQuery("loadbanggia2", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      M_NAME: m_name,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      CUST_NAME_KD: cust_name,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: BANGGIA_DATA2[] = response.data.data.map(
            (element: BANGGIA_DATA2, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element.G_NAME : element?.G_NAME?.search('CNDB') ==-1 ? element.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element.G_NAME_KD : element?.G_NAME_KD?.search('CNDB') ==-1 ? element.G_NAME_KD : 'TEM_NOI_BO',
                PRICE_DATE:
                  element.PRICE_DATE !== null
                    ? moment.utc(element.PRICE_DATE).format("YYYY-MM-DD")
                    : "",
                INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
                UPD_DATE: moment.utc(element.UPD_DATE).format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            },
          );
          setBangGia2(loaded_data);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fields_banggia2,
              store: loaded_data,
            }),
          );
          clearSelection();
        } else {
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
  };
  const confirmUpdateGiaHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn update giá hàng loạt ?",
      text: "Hãy suy nghĩ kỹ trước khi làm",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn update!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành update", "Đang update giá hàng loạt", "success");
        updategia();
      }
    });
  };
  const confirmDeleteGiaHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn xóa giá hàng loạt ?",
      text: "Hãy suy nghĩ kỹ trước khi làm",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành xóa", "Đang xóa giá hàng loạt", "success");
        deletegia();
      }
    });
  };
  const updategia = async () => {
    if (selectedBangGiaDocRow.length > 0) {
      let err_code: string = "";
      for (let i = 0; i < selectedBangGiaDocRow.length; i++) {
        await generalQuery("updategia", {
          ...selectedBangGiaDocRow[i],
        })
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
            } else {
              err_code += `Lỗi : ${response.data.message} |`;
              //Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
            }
          })
          .catch((error) => {
            console.log(error);
            Swal.fire("Thông báo", " Có lỗi : " + error, "error");
          });
      }
      if (err_code === "") {
        Swal.fire("Thông báo", "Cập nhật thông tin giá thành công", "success");
        checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadBangGia2);
        setSelectButton(false);
      } else {
        Swal.fire("Thông báo", " Có lỗi : " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để update (Bảng giá dọc)", "error");
    }
  };
  const deletegia = async () => {
    if (selectedBangGiaDocRow.length > 0) {
      let err_code: string = "";
      for (let i = 0; i < selectedBangGiaDocRow.length; i++) {
        await generalQuery("deletegia", {
          ...selectedBangGiaDocRow[i],
        })
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
            } else {
              err_code += `Lỗi : ${response.data.message} |`;
              //Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
            }
          })
          .catch((error) => {
            console.log(error);
            Swal.fire("Thông báo", " Có lỗi : " + error, "error");
          });
      }
      if (err_code === "") {
        Swal.fire("Thông báo", "Xóa thành công", "success");
        checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadBangGia2);
      } else {
        Swal.fire("Thông báo", " Có lỗi : " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để xóa(Bảng giá dọc)", "error");
    }
  };
  const loadBangGiaMoiNhat = () => {
    generalQuery("loadbanggiamoinhat", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      M_NAME: m_name,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      CUST_NAME_KD: cust_name,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: BANGGIA_DATA2[] = response.data.data.map(
            (element: BANGGIA_DATA2, index: number) => {
              return {
                ...element,
                G_NAME: getAuditMode() == 0? element.G_NAME : element.G_NAME?.search('CNDB') ==-1 ? element.G_NAME : 'TEM_NOI_BO',
G_NAME_KD: getAuditMode() == 0? element.G_NAME_KD : element.G_NAME_KD?.search('CNDB') ==-1 ? element.G_NAME_KD : 'TEM_NOI_BO',
                PRICE_DATE:
                  element.PRICE_DATE !== null
                    ? moment.utc(element.PRICE_DATE).format("YYYY-MM-DD")
                    : "",
                    INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
                UPD_DATE: moment.utc(element.UPD_DATE).format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            },
          );
          setBangGia2(loaded_data);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fields_banggia2,
              store: loaded_data,
            }),
          );
          clearSelection();
        } else {
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
  };
  const quotationprintref = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => quotationprintref.current,
  });
  useEffect(() => {
    //loadBangGia();
    console.log("render lai");
    if (getCompany() === 'CMS' && getSever() !=='http://222.252.1.63:3007' ) {
      dongboGiaPO();
    }
  }, [sh]);
  return (
    <div className="quotationmanager">
      <div className="tracuuDataInspection">
        {showhidesearchdiv.current == true && (
          <div className="tracuuDataInspectionform">
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
                  <b>Tên Liệu:</b>{" "}
                  <input
                    type="text"
                    placeholder="SJ-203020HC"
                    value={m_name}
                    onChange={(e) => setM_Name(e.target.value)}
                  ></input>
                </label>
                <label>
                  <b>Tên khách hàng:</b>{" "}
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
                  <b>All Time:</b>
                  <input
                    type="checkbox"
                    name="alltimecheckbox"
                    defaultChecked={alltime}
                    onChange={() => setAllTime(!alltime)}
                  ></input>
                </label>
              </div>
              <div className="forminputcolumn"></div>
            </div>
            <div className="formbutton">
              <div className="buttoncolumn">
                <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#36D334' }} onClick={() => {
                  setSelectButton(false);
                  checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadBangGiaMoiNhat);
                }}>Last Price</Button>
                <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: 'yellow', color: 'black' }} onClick={() => {
                  setSelectButton(true);
                  checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadBangGia);
                }}>Giá Ngang</Button>
                <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: 'yellow', color: 'black' }} onClick={() => {
                  setSelectButton(false);
                  checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadBangGia2);
                }}>Giá Dọc</Button>
              </div>
              <div className="buttoncolumn">
                <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#36D334' }} onClick={() => {
                  checkBP(userData, ["KD"], ["Leader"], ["ALL"], pheduyetgia);
                }}>Approve</Button>
                <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: 'blue', color: 'yellow' }} onClick={() => {
                  setSelectButton(false);
                  checkBP(userData, ["KD"], ["ALL"], ["ALL"], confirmUpdateGiaHangLoat);
                }}>Update</Button>
                <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: 'red', color: 'black' }} onClick={() => {
                  setSelectButton(false);
                  checkBP(userData, ["KD"], ["ALL"], ["ALL"], confirmDeleteGiaHangLoat);
                }}>Delete</Button>
              </div>
            </div>
          </div>
        )}
        <div className="tracuuYCSXTable">
          {selectbutton && banggiaMM}
          {!selectbutton && banggiaMM2}
        </div>
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
              tableID="datasxtablepivot"
            />
          </div>
        )}
        {showhideupprice && (
          <div className="upgia">
            <div className="barbutton">
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  setShowHideUpPrice(false);
                }}
              >
                <AiFillCloseCircle color="blue" size={15} />
                Close
              </IconButton>
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
              {/* <IconButton className="buttonIcon" onClick={() => { }}>
                <AiOutlineCheckSquare color="#EB2EFE" size={15} />
                Check Giá
              </IconButton> */}
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  /*  checkBP(
                   userData?.EMPL_NO,
                   userData?.MAINDEPTNAME,
                   ["KD"],
                   uploadgia
                 );  */
                  checkBP(userData, ["KD"], ["ALL"], ["ALL"], uploadgia);
                }}
              >
                <BiCloudUpload color="#FA0022" size={15} />
                Up Giá
              </IconButton>
              <div className="upgiaform">
                <Autocomplete
                  sx={{ fontSize: 10, width: "150px" }}
                  size="small"
                  disablePortal
                  options={customerList}
                  className="autocomplete1"
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
                  onChange={(event: any, newValue: CustomerListData | any) => {
                    console.log(newValue);
                    setSelectedCust_CD(newValue);
                  }}
                />
              </div>
              <div className="upgiaform">
                <Autocomplete
                  sx={{ fontSize: 10, width: "250px" }}
                  size="small"
                  disablePortal
                  options={codelist}
                  className="autocomplete1"
                  filterOptions={filterOptions1}
                  isOptionEqualToValue={(option: any, value: any) =>
                    option.G_CODE === value.G_CODE
                  }
                  getOptionLabel={(option: CodeListDataUpGia | any) =>
                    `${option.G_CODE}: ${option.G_NAME_KD} : ${option.G_NAME}`
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Select code" />
                  )}
                  onChange={(event: any, newValue: CodeListDataUpGia | any) => {
                    console.log(newValue);
                    setSelectedCode(newValue);
                  }}
                  value={selectedCode}
                />
              </div>
              <div className="upgiaform">
                <TextField
                  value={moq}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setMOQ(Number(e.target.value))
                  }
                  size="small"
                  color="success"
                  className="autocomplete"
                  id="outlined-basic"
                  label="MOQ"
                  variant="outlined"
                />
              </div>
              <div className="upgiaform">
                <TextField
                  value={newprice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewPrice(e.target.value)
                  }
                  size="small"
                  color="success"
                  className="autocomplete"
                  id="outlined-basic"
                  label="Price"
                  variant="outlined"
                />
              </div>
              <div className="upgiaform">
                <TextField
                  value={newbep}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewBep(e.target.value)
                  }
                  size="small"
                  color="success"
                  className="autocomplete"
                  id="outlined-basic"
                  label="BEP"
                  variant="outlined"
                />
              </div>
              <div className="upgiaform">
                <input
                  className="inputdata"
                  placeholder="PriceDate"
                  type="date"
                  value={newpricedate.slice(0, 10)}
                  onChange={(e) => setNewPriceDate(e.target.value)}
                ></input>
              </div>
              <IconButton
                className="buttonIcon"
                onClick={() => {
                  let temp_row: BANGGIA_DATA2 = {
                    PROD_ID: uploadExcelJson.length + 1,
                    id: uploadExcelJson.length + 1,
                    CUST_CD: selectedCust_CD?.CUST_CD,
                    CUST_NAME_KD: selectedCust_CD?.CUST_NAME_KD,
                    FINAL: "",
                    G_CODE: selectedCode?.G_CODE,
                    G_NAME: selectedCode?.G_NAME,
                    G_NAME_KD: selectedCode?.G_NAME_KD,
                    INS_EMPL: "",
                    INS_DATE: "",
                    MOQ: moq,
                    PRICE_DATE: newpricedate,        
                    BEP: Number(newbep),            
                    PROD_PRICE: Number(newprice),
                    PROD_MAIN_MATERIAL: selectedCode?.PROD_MAIN_MATERIAL,
                    REMARK: "",
                    UPD_EMPL: "",
                    UPD_DATE: "",
                    G_WIDTH: 0,
                    G_LENGTH: 0,
                    G_NAME_KT: "",
                    EQ1: "",
                    EQ2: "",
                    EQ3: "",
                    EQ4: "",
                    DUPLICATE: 1,
                  };
                  setUploadExcelJSon([...uploadExcelJson, temp_row]);
                }}
              >
                <AiFillFileAdd color="#F50354" size={15} />
                Add
              </IconButton>
            </div>
            <div className="upgiatable">{upgiaMM2}</div>
          </div>
        )}
        {showhideQuotationForm && (
          <div className="quotation_from">
            {" "}
            <div className="buttondiv">
              <Button onClick={handlePrint}>Print Quotation</Button>
              <Button
                onClick={() => {
                  setShowHideQuotationForm(false);
                }}
              >
                Close
              </Button>
            </div>
            <div className="printpagediv" ref={quotationprintref}>
              <QuotationForm QUOTATION_DATA={selectedBangGiaDocRow} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default QuotationManager;