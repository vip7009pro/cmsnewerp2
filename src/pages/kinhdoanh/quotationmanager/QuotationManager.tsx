import {
  Autocomplete,
  Button,
  IconButton,
  TextField,
  createFilterOptions,
} from "@mui/material";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AiFillCloseCircle, AiFillFileAdd, AiFillFileExcel, AiOutlinePrinter } from "react-icons/ai";
import Swal from "sweetalert2";
import "./QuotationManager.scss";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { MdOutlinePivotTableChart } from "react-icons/md";
import { SaveExcel, checkBP} from "../../../api/GlobalFunction";
import { generalQuery, getAuditMode, getCompany, getSever } from "../../../api/Api";
import PivotTable from "../../../components/PivotChart/PivotChart";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { BiCloudUpload } from "react-icons/bi";
import * as XLSX from "xlsx";
import { TbLogout } from "react-icons/tb";
import QuotationForm from "./QuotationForm/QuotationForm";
import { useReactToPrint } from "react-to-print";
import {
  UserData,
} from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { useForm } from "react-hook-form";
import { BANGGIA_DATA, BANGGIA_DATA2, CodeListDataUpGia, CustomerListData } from "../interfaces/kdInterface";
import { f_getcustomerlist } from "../utils/kdUtils";
const QuotationManager = () => {
  const {register,handleSubmit,watch, formState:{errors}} = useForm( {
    defaultValues:{
      fromdate:moment().format("YYYY-MM-DD"),
      todate:moment().format("YYYY-MM-DD"),
      codeKD:"",
      codeCMS:"",
      m_name:"",
      cust_name:"",
      alltime:true,
    }
  }) 
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [sh, setSH] = useState(false);
  const showhidesearchdiv = useRef(true);
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
  const getcustomerlist = async () => {
    setCustomerList(await f_getcustomerlist())   
  };

  const [moq, setMOQ] = useState(1);
  const [newprice, setNewPrice] = useState("");
  const [newbep, setNewBep] = useState("");
  const [newpricedate, setNewPriceDate] = useState( moment.utc().format("YYYY-MM-DD"), );
  const [banggia, setBangGia] = useState<BANGGIA_DATA[]>([]);
  const [banggia2, setBangGia2] = useState<BANGGIA_DATA2[]>([]);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [showhideupprice, setShowHideUpPrice] = useState(false);
  const [uploadExcelJson, setUploadExcelJSon] = useState<Array<any>>([]);
  const [showhideQuotationForm, setShowHideQuotationForm] = useState(false);
  const [rows, setRows] = useState<Array<any>>([]);

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
  const dongboGiaPO = async() => {
    await generalQuery("dongbogiasptupo", {})
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
  const fields_banggia: any = useMemo(() => [
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
  ],[]);
  const fields_banggia2: any = useMemo(() => [
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
  ],[]);
  const [selectedDataSource, setSelectedDataSource] =
    useState<PivotGridDataSource>(
      new PivotGridDataSource({
        fields: fields_banggia,
        store: banggia,
      }),
    );
  const column_giangang= useMemo(()=>[
  { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 90 },
  { field: "G_CODE", headerName: "G_CODE", width: 90 },
  { field: "G_NAME", headerName: "G_NAME", width: 90 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 90 },
  { field: "PROD_MAIN_MATERIAL", headerName: "PROD_MAIN_MATERIAL", width: 90 },
  { field: "MOQ", headerName: "MOQ", width: 90 },
  { field: "PRICE1", headerName: "PRICE1", width: 90 },
  { field: "PRICE2", headerName: "PRICE2", width: 90 },
  { field: "PRICE3", headerName: "PRICE3", width: 90 },
  { field: "PRICE4", headerName: "PRICE4", width: 90 },
  { field: "PRICE5", headerName: "PRICE5", width: 90 },
  { field: "PRICE6", headerName: "PRICE6", width: 90 },
  { field: "PRICE7", headerName: "PRICE7", width: 90 },
  { field: "PRICE8", headerName: "PRICE8", width: 90 },
  { field: "PRICE9", headerName: "PRICE9", width: 90 },
  { field: "PRICE10", headerName: "PRICE10", width: 90 },
  { field: "PRICE11", headerName: "PRICE11", width: 90 },
  { field: "PRICE12", headerName: "PRICE12", width: 90 },
  { field: "PRICE13", headerName: "PRICE13", width: 90 },
  { field: "PRICE14", headerName: "PRICE14", width: 90 },
  { field: "PRICE15", headerName: "PRICE15", width: 90 },
  { field: "PRICE16", headerName: "PRICE16", width: 90 },
  { field: "PRICE17", headerName: "PRICE17", width: 90 },
  { field: "PRICE18", headerName: "PRICE18", width: 90 },
  { field: "PRICE19", headerName: "PRICE19", width: 90 },
  { field: "PRICE20", headerName: "PRICE20", width: 90 },
  { field: "PRICE_DATE1", headerName: "PRICE_DATE1", width: 90 },
  { field: "PRICE_DATE2", headerName: "PRICE_DATE2", width: 90 },
  { field: "PRICE_DATE3", headerName: "PRICE_DATE3", width: 90 },
  { field: "PRICE_DATE4", headerName: "PRICE_DATE4", width: 90 },
  { field: "PRICE_DATE5", headerName: "PRICE_DATE5", width: 90 },
  { field: "PRICE_DATE6", headerName: "PRICE_DATE6", width: 90 },
  { field: "PRICE_DATE7", headerName: "PRICE_DATE7", width: 90 },
  { field: "PRICE_DATE8", headerName: "PRICE_DATE8", width: 90 },
  { field: "PRICE_DATE9", headerName: "PRICE_DATE9", width: 90 },
  { field: "PRICE_DATE10", headerName: "PRICE_DATE10", width: 90 },
  { field: "PRICE_DATE11", headerName: "PRICE_DATE11", width: 90 },
  { field: "PRICE_DATE12", headerName: "PRICE_DATE12", width: 90 },
  { field: "PRICE_DATE13", headerName: "PRICE_DATE13", width: 90 },
  { field: "PRICE_DATE14", headerName: "PRICE_DATE14", width: 90 },
  { field: "PRICE_DATE15", headerName: "PRICE_DATE15", width: 90 },
  { field: "PRICE_DATE16", headerName: "PRICE_DATE16", width: 90 },
  { field: "PRICE_DATE17", headerName: "PRICE_DATE17", width: 90 },
  { field: "PRICE_DATE18", headerName: "PRICE_DATE18", width: 90 },
  { field: "PRICE_DATE19", headerName: "PRICE_DATE19", width: 90 },
  { field: "PRICE_DATE20", headerName: "PRICE_DATE20", width: 90 } 
  ],[]);
  const column_gia_doc = useMemo(()=>[
  { field: "PROD_ID", headerName: "PROD_ID", width: 100, headerCheckboxSelection: true, checkboxSelection: true  },
  { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 90 },  
  { field: "CUST_CD", headerName: "CUST_CD", width: 50 },
  { field: "G_CODE", headerName: "G_CODE", width: 60 },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 90 },
  { field: "G_NAME", headerName: "G_NAME", width: 90 },
  { field: "PROD_MAIN_MATERIAL", headerName: "MATERIAL", width: 70 },
  { field: "DESCR", headerName: "DESCR", width: 120 },
  { field: "PRICE_DATE", headerName: "PRICE_DATE", width: 70 },
  { field: "MOQ", headerName: "MOQ", width: 60 },
  { field: "PROD_PRICE", headerName: "PROD_PRICE", width: 70, cellRenderer:(e: any) => {
    return (
      <span style={{ color: "blue", fontWeight: "normal" }}>
        {e.data.PROD_PRICE?.toFixed(6).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        })}
      </span>
    );
  } },
  { field: "BEP", headerName: "BEP", width: 60, cellRenderer:(e: any) => {
    return (
      <span style={{ color: "blue", fontWeight: "normal" }}>
        {e.data.BEP?.toFixed(6).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        })}
      </span>
    );
  }  },  
  { field: "FINAL", headerName: "APPROVAL", width: 90, cellRenderer:(e: any) => {
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
  }  },
  { field: "DUPLICATE", headerName: "DUPLICATE", width: 90,cellRenderer:(e: any) => {
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
  } },
  { field: "INS_DATE", headerName: "INS_DATE", width: 95 },
  { field: "INS_EMPL", headerName: "INS_EMPL", width: 60 },
  { field: "UPD_DATE", headerName: "UPD_DATE", width: 95 },
  { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 60 },
  ],[]);
  const [columns, setColumns] = useState<Array<any>>(column_gia_doc);
  const priceTableDataAG = useMemo(() =>
    <AGTable      
      showFilter={true}
      toolbar={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
         
        </div>
      }
      columns={columns}
      data={rows}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //clickedRow.current = params.data;
        //clickedRow.current = params.data;
        //console.log(e.data) 
      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())
        setselectedBangGiaDocRow(params!.api.getSelectedRows());
      }}
    />
    , [rows, columns]);  
  const columns_uploadexcel = useMemo(()=>[
    { field: "PROD_ID", headerName: "PROD_ID", width: 50 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 100 },
    { field: "CUST_CD", headerName: "CUST_CD", width: 60 },
    { field: "G_CODE", headerName: "G_CODE", width: 70 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 90 },
    { field: "G_NAME", headerName: "G_NAME", width: 120 },
    { field: "PROD_MAIN_MATERIAL", headerName: "MATERIAL", width: 90 },
    { field: "MOQ", headerName: "MOQ", width: 90 },
    { field: "PROD_PRICE", headerName: "PROD_PRICE", width: 90, cellRenderer:(e: any) => {
      return (
        <span style={{ color: "blue", fontWeight: "normal" }}>
          {e.data.PROD_PRICE?.toFixed(6).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          })}
        </span>
      );
    } },
    { field: "BEP", headerName: "BEP", width: 90, cellRenderer: (e: any) => {
      return (
        <span style={{ color: "blue", fontWeight: "normal" }}>
          {e.data.BEP?.toFixed(6).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          })}
        </span>
      );
    } },
    { field: "PRICE_DATE", headerName: "PRICE_DATE", width: 90, cellRenderer: (e: any) => {
      return (
        <span style={{ color: "black", fontWeight: "normal" }}>
          {moment.utc(e.data.PRICE_DATE).format("YYYY-MM-DD")}
        </span>
      );
    } },
    { field: "CHECKSTATUS", headerName: "CHECKSTATUS", width: 90, cellRenderer: (e: any) => {
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
    } },
    { field: "EDIT", headerName: "EDIT", width: 90, cellRenderer:(e: any) => {
      return (
        <button
          style={{
            color: "white",
            backgroundColor: "red",
            width: "80px",
            textAlign: "center",
          }}
          onClick={() => {
            setUploadExcelJSon(uploadExcelJson.filter((item) => item.PROD_ID !== e.data.PROD_ID));
          }}
        >
          Delete
        </button>
      );
    }},
  ],[uploadExcelJson]);
  const uploadPriceTableDataAG = useMemo(() =>
    <AGTable      
      showFilter={true}
      toolbar={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>          
         
        </div>
      }
      columns={columns_uploadexcel}
      data={uploadExcelJson}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //clickedRow.current = params.data;
        //clickedRow.current = params.data;
        //console.log(e.data) 
      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())
        setselectedBangGiaDocRow(params!.api.getSelectedRows());
      }}
    />
    , [uploadExcelJson, columns_uploadexcel]);
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
  const loadBangGia = useCallback(async() => {
   await generalQuery("loadbanggia", {
      ALLTIME: watch("alltime"),
      FROM_DATE: watch("fromdate"),
      TO_DATE: watch("todate"),
      M_NAME: watch("m_name"),
      G_CODE: watch("codeCMS"),
      G_NAME: watch("codeKD"),
      CUST_NAME_KD: watch("cust_name"),
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
          setRows(loaded_data);
          setColumns(column_giangang);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fields_banggia,
              store: loaded_data,
            }),
          );
          
        } else {
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
    setselectedBangGiaDocRow([]);
  },[]);
  const loadBangGia2 = useCallback(async() => {
    await generalQuery("loadbanggia2", {
      ALLTIME: watch("alltime"),
      FROM_DATE: watch("fromdate"),
      TO_DATE: watch("todate"),
      M_NAME: watch("m_name"),
      G_CODE: watch("codeCMS"),
      G_NAME: watch("codeKD"),
      CUST_NAME_KD: watch("cust_name"),
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
          setRows(loaded_data);
          setColumns(column_gia_doc);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fields_banggia2,
              store: loaded_data,
            }),
          );
          
        } else {
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
  },[]);
  const confirmUpdateGiaHangLoat = useCallback(() => {
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
  },[]);
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
  const updategia = useCallback(async () => {
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
        
      } else {
        Swal.fire("Thông báo", " Có lỗi : " + err_code, "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để update (Bảng giá dọc)", "error");
    }
  },[selectedBangGiaDocRow]);
  const deletegia = useCallback(async () => {
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
  },[selectedBangGiaDocRow]);
  const loadBangGiaMoiNhat = useCallback(async() => {
    await generalQuery("loadbanggiamoinhat", {
      ALLTIME: watch("alltime"),
      FROM_DATE: watch("fromdate"),
      TO_DATE: watch("todate"),
      M_NAME: watch("m_name"),
      G_CODE: watch("codeCMS"),
      G_NAME: watch("codeKD"),
      CUST_NAME_KD: watch("cust_name"),
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
          setRows(loaded_data);
          setColumns(column_gia_doc);
          setSelectedDataSource(
            new PivotGridDataSource({
              fields: fields_banggia2,
              store: loaded_data,
            }),
          );
          
        } else {
          Swal.fire("Thông báo", " Có lỗi : " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Thông báo", " Có lỗi : " + error, "error");
      });
  },[]);
  const quotationprintref = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => quotationprintref.current,
  });
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  useEffect(() => {
    //loadBangGia();
    getcustomerlist();
    if (getCompany() === 'CMS' && getSever() !=='http://222.252.1.63:3007' && (getSever() !=='http://222.252.1.214:3007' || getSever() !== 'https://erp.printvietnam.com.vn:3007')) {
      dongboGiaPO();
    }
  }, [sh]);
  return (
    <div className="quotationmanager">
      <div className="tracuuDataInspection">
        {showhidesearchdiv.current == true && (
          <div className="tracuuDataInspectionform"  style={{ backgroundImage: theme.CMS.backgroundImage }}>
            <div className="forminput">
              <div className="forminputcolumn">
                <label>
                  <b>Từ ngày:</b>
                  <input type="date" {...register('fromdate')} ></input>
                </label>
                <label>
                  <b>Tới ngày:</b>{" "}
                  <input type="date" {...register('todate')} ></input>
                </label>
              </div>
              <div className="forminputcolumn">
                <label>
                  <b>Code KD:</b>{" "}
                  <input type="text" placeholder="GH63-xxxxxx" {...register('codeKD')} ></input>
                </label>
                <label>
                  <b>Code ERP:</b>{" "}
                  <input type="text" placeholder="7C123xxx" {...register('codeCMS')} ></input>
                </label>
              </div>
              <div className="forminputcolumn">
                <label>
                  <b>Tên Liệu:</b>{" "}
                  <input type="text" placeholder="SJ-203020HC" {...register('m_name')} ></input>
                </label>
                <label>
                  <b>Tên khách hàng:</b>{" "}
                  <input type="text" placeholder="SEVT" {...register('cust_name')} ></input>
                </label>
              </div>
              <div className="forminputcolumn">
                <label>
                  <b>All Time:</b>
                  <input type="checkbox" {...register('alltime')} ></input>
                </label>
              </div>
              <div className="forminputcolumn"></div>
            </div>
            <div className="formbutton">
              <div className="buttoncolumn">
                <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#36D334' }} onClick={() => {
                  
                  checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadBangGiaMoiNhat);
                }}>Last Price</Button>
                <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: 'yellow', color: 'black' }} onClick={() => {
                  
                  checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadBangGia);
                }}>Giá Ngang</Button>
                <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: 'yellow', color: 'black' }} onClick={() => {
                  
                  checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadBangGia2);
                }}>Giá Dọc</Button>
              </div>
              <div className="buttoncolumn">
                <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: '#36D334' }} onClick={() => {
                  checkBP(userData, ["KD"], ["Leader"], ["ALL"], pheduyetgia);
                }}>Approve</Button>
                <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: 'blue', color: 'yellow' }} onClick={() => {
                  
                  checkBP(userData, ["KD"], ["ALL"], ["ALL"], confirmUpdateGiaHangLoat);
                }}>Update</Button>
                <Button color={'primary'} variant="contained" size="small" fullWidth={true} sx={{ fontSize: '0.7rem', padding: '3px', backgroundColor: 'red', color: 'black' }} onClick={() => {
                  
                  checkBP(userData, ["KD"], ["ALL"], ["ALL"], confirmDeleteGiaHangLoat);
                }}>Delete</Button>
              </div>
            </div>
          </div>
        )}
        <div className="tracuuYCSXTable">          
          {priceTableDataAG}
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
            <div className="upgiatable">{uploadPriceTableDataAG}</div>
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