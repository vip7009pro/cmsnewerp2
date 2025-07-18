import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { generalQuery } from "../../../api/Api";
import "./BaoCaoNhanSu.scss";
import Swal from "sweetalert2";
import {
  CustomResponsiveContainer,
  SaveExcel,
  weekdayarray,
} from "../../../api/GlobalFunction";
import moment from "moment";
import { IconButton } from "@mui/material";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { MdOutlinePivotTableChart } from "react-icons/md";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import { AiFillCloseCircle } from "react-icons/ai";
import PivotTable from "../../../components/PivotChart/PivotChart";
import {
  DIEMDANHFULLSUMMARY,
  DIEMDANHMAINDEPT,
  DiemDanhFullData,
  DiemDanhHistoryData,
  DiemDanhNhomData,
  DiemDanhNhomDataSummary,
  MainDeptData,  
} from "../interfaces/nhansuInterface";
import { getlang } from "../../../components/String/String";
import NSDailyGraph from "../../../components/Chart/NHANSU/NSDailyGraph";
import ChartDiemDanhMAINDEPT from "../../../components/Chart/NHANSU/ChartDiemDanhMAINDEPT";
import ChartDiemDanhSUBDEPT from "../../../components/Chart/NHANSU/ChartDiemDanhSUBDEPT";
import AGTable from "../../../components/DataTable/AGTable";
import { UserData } from "../../../api/GlobalInterface";
const BaoCaoNhanSu = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const glbLang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang,
  );
  const [isLoading, setisLoading] = useState(false);
  const [ddmaindepttb, setddmaindepttb] = useState<Array<DIEMDANHMAINDEPT>>([]);
  const [diemdanhnhomtable, setDiemDanhNhomTable] = useState<
    Array<DiemDanhNhomDataSummary>
  >([]);
  const [diemdanhfullsummary, setDiemDanhFullSummary] = useState<
    Array<DIEMDANHFULLSUMMARY>
  >([]);
  const [piechartdata, setPieChartData] = useState<Array<DiemDanhNhomData>>([]);
  const [fromdate, setFromDate] = useState(
    moment().add(-8, "day").format("YYYY-MM-DD"),
  );
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [ca, setCa] = useState(6);
  const [nhamay, setNhaMay] = useState(0);
  const [maindeptcode, setmaindeptcode] = useState(0);
  const [maindepttable, setMainDeptTable] = useState<Array<MainDeptData>>([]);
  const [diemdanh_historyTable, setDiemDanh_HistoryTable] = useState<
    Array<DiemDanhHistoryData>
  >([]);
  const [diemdanhFullTable, setDiemDanhFullTable] = useState<
    Array<DiemDanhFullData>
  >([]);
  const column_ddmaindepttb = [
    {
      field: "MAINDEPTNAME",
      headerName: "BP Chính",
      width: 120,
      renderCell: (params: any) => {
        return (
          <div className="onoffdiv">
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.row.MAINDEPTNAME}
            </span>
          </div>
        );
      },
    },
    {
      field: "COUNT_TOTAL",
      headerName: "Tổng",
      width: 120,
      renderCell: (params: any) => {
        return (
          <div className="onoffdiv">
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.row.COUNT_TOTAL}
            </span>
          </div>
        );
      },
    },
    {
      field: "COUT_ON",
      headerName: "Đi làm",
      width: 120,
      renderCell: (params: any) => {
        return (
          <div className="onoffdiv">
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.row.COUT_ON}
            </span>
          </div>
        );
      },
    },
    {
      field: "COUT_OFF",
      headerName: "Nghỉ làm",
      width: 120,
      renderCell: (params: any) => {
        return (
          <div className="onoffdiv">
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.row.COUT_OFF}
            </span>
          </div>
        );
      },
    },
    {
      field: "COUNT_CDD",
      headerName: "Chưa điểm danh",
      width: 120,
      renderCell: (params: any) => {
        return (
          <div className="onoffdiv">
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.row.COUNT_CDD}
            </span>
          </div>
        );
      },
    },
    {
      field: "ON_RATE",
      headerName: "Tỉ lệ đi làm",
      width: 120,
      renderCell: (params: any) => {
        return (
          <div className="onoffdiv">
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.row.ON_RATE.toLocaleString("en-US", {
                style: "decimal",
                maximumFractionDigits: 2,
              })}{" "}
              %
            </span>
          </div>
        );
      },
    },
  ];
  const columns_diemdanhnhom = [
    {
      field: "MAINDEPTNAME",
      headerName: "BP Chính",
      width: 120,
      renderCell: (params: any) => {
        return (
          <div className="onoffdiv">
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.row.MAINDEPTNAME}
            </span>
          </div>
        );
      },
    },
    {
      field: "SUBDEPTNAME",
      headerName: "BP Phụ",
      width: 120,
      renderCell: (params: any) => {
        return (
          <div className="onoffdiv">
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.row.SUBDEPTNAME}
            </span>
          </div>
        );
      },
    },
    {
      field: "TOTAL_ALL",
      headerName: "Tổng",
      width: 90,
      renderCell: (params: any) => {
        return (
          <div className="onoffdiv">
            <span style={{ fontWeight: "bold", color: "blue" }}>
              {params.row.TOTAL_ALL}
            </span>
          </div>
        );
      },
    },
    {
      field: "TOTAL_ON",
      headerName: "Đi Làm",
      width: 90,
      renderCell: (params: any) => {
        return (
          <div className="onoffdiv">
            <span style={{ fontWeight: "bold", color: "green" }}>
              {params.row.TOTAL_ON}
            </span>
          </div>
        );
      },
    },
    {
      field: "TOTAL_OFF",
      headerName: "Nghỉ Làm",
      width: 90,
      renderCell: (params: any) => {
        return (
          <div className="onoffdiv">
            <span style={{ fontWeight: "bold", color: "red" }}>
              {params.row.TOTAL_OFF}
            </span>
          </div>
        );
      },
    },
    {
      field: "TOTAL_CDD",
      headerName: "Chưa ĐD",
      width: 90,
      renderCell: (params: any) => {
        return (
          <div className="onoffdiv">
            <span style={{ fontWeight: "bold", color: "black" }}>
              {params.row.TOTAL_CDD}
            </span>
          </div>
        );
      },
    },
    {
      field: "ON_RATE",
      headerName: "TL ĐI LÀM",
      width: 120,
      renderCell: (params: any) => {
        return (
          <div className="onoffdiv">
            <span style={{ fontWeight: "bold", color: "black" }}>
              {(
                (params.row.TOTAL_ON / params.row.TOTAL_ALL) *
                100
              ).toLocaleString("en-US", {
                style: "decimal",
                maximumFractionDigits: 2,
              })}
              %
            </span>
          </div>
        );
      },
    },
  ];
  const columns_diemdanhfull = [
    {
      field: "DATE_COLUMN",
      headerName: "DATE_COLUMN",
      width: 120,
    },
    {
      field: "WEEKDAY",
      headerName: "WEEKDAY",
      width: 120,
      renderCell: (params: any) => {
        if (params.row.WEEKDAY === "Sunday") {
          return (
            <div className="onoffdiv">
              <span style={{ fontWeight: "bold", color: "red" }}>
                {params.row.WEEKDAY}
              </span>
            </div>
          );
        } else {
          return (
            <div className="onoffdiv">
              <span style={{ fontWeight: "bold", color: "#4268F4" }}>
                {params.row.WEEKDAY}
              </span>
            </div>
          );
        }
      },
    },
    {
      field: "ON_OFF",
      headerName: "ON_OFF",
      width: 150,
      renderCell: (params: any) => {
        if (params.row.ON_OFF === 1) {
          return (
            <div className="onoffdiv">
              <span style={{ fontWeight: "bold", color: "green" }}>Đi làm</span>
            </div>
          );
        } else if (params.row.ON_OFF === 0) {
          return (
            <div className="onoffdiv">
              <span style={{ fontWeight: "bold", color: "red" }}>Nghỉ làm</span>
            </div>
          );
        } else {
          return (
            <div className="onoffdiv">
              <span style={{ fontWeight: "bold", color: "#754EFA" }}>
                Chưa điểm danh
              </span>
            </div>
          );
        }
      },
    },
    {
      field: "PHE_DUYET",
      headerName: "PHE_DUYET",
      width: 120,
      renderCell: (params: any) => {
        if (params.row.APPROVAL_STATUS === 0) {
          return (
            <div className="onoffdiv">
              <span style={{ fontWeight: "bold", color: "red" }}>Từ chối</span>
            </div>
          );
        } else if (params.row.APPROVAL_STATUS === 1) {
          return (
            <div className="onoffdiv">
              <span style={{ fontWeight: "bold", color: "green" }}>
                Phê duyệt
              </span>
            </div>
          );
        } else if (params.row.APPROVAL_STATUS === 2) {
          return (
            <div className="onoffdiv">
              <span style={{ fontWeight: "bold", color: "white" }}>
                Chờ duyệt
              </span>
            </div>
          );
        } else {
          return <div className="onoffdiv"></div>;
        }
      },
    },
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 120 },
    { field: "CMS_ID", headerName: "NS_ID", width: 120 },
    { field: "MIDLAST_NAME", headerName: "MIDLAST_NAME", width: 170 },
    { field: "FIRST_NAME", headerName: "FIRST_NAME", width: 120 },
    { field: "CA_NGHI", headerName: "CA_NGHI", width: 100 },
    { field: "OVERTIME_INFO", headerName: "OVERTIME_INFO", width: 120 },
    { field: "OVERTIME", headerName: "OVERTIME", width: 100 },
    { field: "REASON_NAME", headerName: "REASON_NAME", width: 120 },
    { field: "REMARK", headerName: "REMARK", width: 170 },
    { field: "XACNHAN", headerName: "XACNHAN", width: 120 },
    { field: "PHONE_NUMBER", headerName: "PHONE_NUMBER", width: 120 },
    { field: "SEX_NAME", headerName: "SEX_NAME", width: 120 },
    { field: "WORK_STATUS_NAME", headerName: "WORK_STATUS_NAME", width: 120 },
    { field: "FACTORY_NAME", headerName: "FACTORY_NAME", width: 120 },
    { field: "JOB_NAME", headerName: "JOB_NAME", width: 120 },
    { field: "WORK_SHIF_NAME", headerName: "WORK_SHIF_NAME", width: 120 },
    {
      field: "WORK_POSITION_NAME",
      headerName: "WORK_POSITION_NAME",
      width: 120,
    },
    { field: "SUBDEPTNAME", headerName: "SUBDEPTNAME", width: 120 },
    { field: "MAINDEPTNAME", headerName: "MAINDEPTNAME", width: 120 },
    {
      field: "REQUEST_DATE",
      headerName: "REQUEST_DATE",
      width: 120,
    },
    { field: "OFF_ID", headerName: "OFF_ID", width: 120 },
  ];
  function CustomToolbar3() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarQuickFilter />
        <IconButton
          className="buttonIcon"
          onClick={() => {
            setShowHidePivotTable(true);
          }}
        >
          <MdOutlinePivotTableChart color="#ff33bb" size={15} />
          Pivot
        </IconButton>
        <button
          className="saveexcelbutton"
          onClick={() => {
            SaveExcel(diemdanhFullTable, "DiemdanhHistoryFull");
          }}
        >
          Save Excel
        </button>
      </GridToolbarContainer>
    );
  }
  const addTotal = (tabledata: Array<DiemDanhNhomDataSummary>) => {
    var TOTAL_ALL: number = 0;
    var TOTAL_OFF: number = 0;
    var TOTAL_ON: number = 0;
    var TOTAL_CDD: number = 0;
    var TOTAL_NM1: number = 0;
    var TOTAL_NM2: number = 0;
    var ON_NM1: number = 0;
    var ON_NM2: number = 0;
    var OFF_NM1: number = 0;
    var OFF_NM2: number = 0;
    var CDD_NM1: number = 0;
    var CDD_NM2: number = 0;
    for (var i = 0; i < tabledata.length; i++) {
      var obj = tabledata[i];
      TOTAL_ALL += obj.TOTAL_ALL;
      TOTAL_ON += obj.TOTAL_ON;
      TOTAL_OFF += obj.TOTAL_OFF;
      TOTAL_CDD += obj.TOTAL_CDD;
      TOTAL_NM1 += obj.TOTAL_NM1;
      TOTAL_NM2 += obj.TOTAL_NM2;
      ON_NM1 += obj.ON_NM1;
      ON_NM2 += obj.ON_NM2;
      OFF_NM1 += obj.OFF_NM1;
      OFF_NM2 += obj.OFF_NM2;
      CDD_NM1 += obj.CDD_NM1;
      CDD_NM2 += obj.CDD_NM2;
    }
    var grandTotalOBJ: DiemDanhNhomDataSummary = {
      id: "GRAND_TOTAL",
      MAINDEPTNAME: "GRAND_TOTAL",
      SUBDEPTNAME: "GRAND_TOTAL",
      TOTAL_ALL: TOTAL_ALL,
      TOTAL_ON: TOTAL_ON,
      TOTAL_OFF: TOTAL_OFF,
      TOTAL_CDD: TOTAL_CDD,
      TOTAL_NM1: TOTAL_NM1,
      TOTAL_NM2: TOTAL_NM2,
      ON_NM1: ON_NM1,
      ON_NM2: ON_NM2,
      OFF_NM1: OFF_NM1,
      OFF_NM2: OFF_NM2,
      CDD_NM1: CDD_NM1,
      CDD_NM2: CDD_NM2,
    };
    tabledata.push(grandTotalOBJ);
    return tabledata;
  };
  const handleSearch2 = () => {
    setisLoading(true);
    generalQuery("getmaindeptlist", { from_date: fromdate })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          setMainDeptTable(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    generalQuery("diemdanhsummarynhom", { todate: todate })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          setPieChartData(response.data.data);
          let totalAdded: DiemDanhNhomDataSummary[] = addTotal(response.data.data);
          setDiemDanhNhomTable(totalAdded);
          setisLoading(false);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    generalQuery("diemdanhhistorynhom", {
      start_date: fromdate,
      end_date: todate,
      MAINDEPTCODE: maindeptcode,
      WORK_SHIFT_CODE: ca,
      FACTORY_CODE: nhamay,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const newdiemdanhtb: Array<DiemDanhHistoryData> =
            response.data.data.map((obj: { APPLY_DATE: string | any[] }) => {
              return { ...obj, APPLY_DATE: obj.APPLY_DATE.slice(0, 10) };
            });
          setDiemDanh_HistoryTable(newdiemdanhtb);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    generalQuery("diemdanhfull", { from_date: fromdate, to_date: todate })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: DiemDanhFullData[] = response.data.data.map(
            (element: DiemDanhFullData, index: number) => {
              return {
                ...element,
                DATE_COLUMN: moment(element.DATE_COLUMN)
                  .utc()
                  .format("YYYY-MM-DD"),
                APPLY_DATE:
                  element.APPLY_DATE === null
                    ? ""
                    : moment(element.APPLY_DATE).utc().format("YYYY-MM-DD"),
                WEEKDAY: weekdayarray[new Date(element.DATE_COLUMN).getDay()],
                id: index,
              };
            },
          );
          setDiemDanhFullTable(loaded_data);
          setisLoading(false);
          Swal.fire(
            "Thông báo",
            "Đã load " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    generalQuery("getddmaindepttb", {
      FROM_DATE: moment().format("YYYY-MM-DD"),
      TO_DATE: moment().format("YYYY-MM-DD"),
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let temp_total: DIEMDANHMAINDEPT = {
            id: 1111,
            MAINDEPTNAME: "TOTAL",
            COUNT_TOTAL: 0,
            COUT_ON: 0,
            COUT_OFF: 0,
            COUNT_CDD: 0,
            ON_RATE: 0,
          };
          let loadeddata = response.data.data.map(
            (element: DIEMDANHMAINDEPT, index: number) => {
              temp_total = {
                ...temp_total,
                COUNT_TOTAL: temp_total.COUNT_TOTAL + element.COUNT_TOTAL,
                COUT_ON: temp_total.COUT_ON + element.COUT_ON,
                COUT_OFF: temp_total.COUT_OFF + element.COUT_OFF,
                COUNT_CDD: temp_total.COUNT_CDD + element.COUNT_CDD,
              };
              return {
                ...element,
                id: index,
              };
            },
          );
          temp_total = {
            ...temp_total,
            ON_RATE: (temp_total.COUT_ON / temp_total.COUNT_TOTAL) * 100,
          };
          loadeddata = [...loadeddata, temp_total];
          //console.log(loadeddata);
          setddmaindepttb(loadeddata);
          setisLoading(false);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadDiemDanhFullSummaryTable = () => {
    generalQuery("loadDiemDanhFullSummaryTable", {
      FROM_DATE: moment().format("YYYY-MM-DD"),
      TO_DATE: moment().format("YYYY-MM-DD"),
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loaded_data: DIEMDANHFULLSUMMARY[] = response.data.data.map(
            (element: DIEMDANHFULLSUMMARY, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          let totalRow: DIEMDANHFULLSUMMARY = {
            id: -1,
            MAINDEPTNAME: "TOTAL",
            COUNT_TOTAL: 0,
            COUNT_ON: 0,
            COUNT_OFF: 0,
            COUNT_CDD: 0,
            T1_TOTAL: 0,
            T1_ON: 0,
            T1_OFF: 0,
            T1_CDD: 0,
            T2_TOTAL: 0,
            T2_ON: 0,
            T2_OFF: 0,
            T2_CDD: 0,
            HC_TOTAL: 0,
            HC_ON: 0,
            HC_OFF: 0,
            HC_CDD: 0,
            ON_RATE: 0,
            TOTAL: 0,
            PHEP_NAM: 0,
            NUA_PHEP: 0,
            NGHI_VIEC_RIENG: 0,
            NGHI_OM: 0,
            CHE_DO: 0,
            KHONG_LY_DO: 0
          }
          for (let i = 0; i < loaded_data.length; i++) {
            totalRow.T1_CDD += loaded_data[i].T1_CDD;
            totalRow.T1_OFF += loaded_data[i].T1_OFF;
            totalRow.T1_ON += loaded_data[i].T1_ON;
            totalRow.T1_TOTAL += loaded_data[i].T1_TOTAL;
            totalRow.T2_CDD += loaded_data[i].T2_CDD;
            totalRow.T2_OFF += loaded_data[i].T2_OFF;
            totalRow.T2_ON += loaded_data[i].T2_ON;
            totalRow.T2_TOTAL += loaded_data[i].T2_TOTAL;
            totalRow.HC_CDD += loaded_data[i].HC_CDD;
            totalRow.HC_OFF += loaded_data[i].HC_OFF;
            totalRow.HC_ON += loaded_data[i].HC_ON;
            totalRow.HC_TOTAL += loaded_data[i].HC_TOTAL;
            totalRow.COUNT_CDD += loaded_data[i].COUNT_CDD;
            totalRow.COUNT_OFF += loaded_data[i].COUNT_OFF;
            totalRow.COUNT_ON += loaded_data[i].COUNT_ON;
            totalRow.COUNT_TOTAL += loaded_data[i].COUNT_TOTAL;
            totalRow.TOTAL += loaded_data[i].TOTAL;
            totalRow.PHEP_NAM += loaded_data[i].PHEP_NAM;
            totalRow.NUA_PHEP += loaded_data[i].NUA_PHEP;
            totalRow.NGHI_VIEC_RIENG += loaded_data[i].NGHI_VIEC_RIENG;
            totalRow.NGHI_OM += loaded_data[i].NGHI_OM;
            totalRow.CHE_DO += loaded_data[i].CHE_DO;
            totalRow.KHONG_LY_DO += loaded_data[i].KHONG_LY_DO;
          }
          totalRow.ON_RATE = totalRow.COUNT_ON / totalRow.COUNT_TOTAL * 100;
          setDiemDanhFullSummary([...loaded_data, totalRow]);
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSearch = () => {
    handleSearch2();
    loadDiemDanhFullSummaryTable();
  };
  const subdeptchartMM = useMemo(() => {
    return (
      <ChartDiemDanhSUBDEPT diemdanhMainDeptData={diemdanhnhomtable.filter(
        (ele: DiemDanhNhomDataSummary, index: number) =>
          ele.MAINDEPTNAME !== "GRAND_TOTAL",
      )} />
    );
  }, [ddmaindepttb]);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const dataSource = new PivotGridDataSource({
    fields: [
      {
        caption: "DATE_COLUMN",
        width: 80,
        dataField: "DATE_COLUMN",
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
          width: 300,
        },
      },
      {
        caption: "NS_ID",
        width: 80,
        dataField: "CMS_ID",
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
        caption: "MIDLAST_NAME",
        width: 80,
        dataField: "MIDLAST_NAME",
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
        caption: "FIRST_NAME",
        width: 80,
        dataField: "FIRST_NAME",
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
        caption: "PHONE_NUMBER",
        width: 80,
        dataField: "PHONE_NUMBER",
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
        caption: "SEX_NAME",
        width: 80,
        dataField: "SEX_NAME",
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
        caption: "WORK_STATUS_NAME",
        width: 80,
        dataField: "WORK_STATUS_NAME",
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
        caption: "FACTORY_NAME",
        width: 80,
        dataField: "FACTORY_NAME",
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
        caption: "JOB_NAME",
        width: 80,
        dataField: "JOB_NAME",
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
        caption: "WORK_SHIF_NAME",
        width: 80,
        dataField: "WORK_SHIF_NAME",
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
        caption: "WORK_POSITION_NAME",
        width: 80,
        dataField: "WORK_POSITION_NAME",
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
        caption: "SUBDEPTNAME",
        width: 80,
        dataField: "SUBDEPTNAME",
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
        caption: "MAINDEPTNAME",
        width: 80,
        dataField: "MAINDEPTNAME",
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
        caption: "REQUEST_DATE",
        width: 80,
        dataField: "REQUEST_DATE",
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
        caption: "APPLY_DATE",
        width: 80,
        dataField: "APPLY_DATE",
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
        caption: "APPROVAL_STATUS",
        width: 80,
        dataField: "APPROVAL_STATUS",
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
        caption: "OFF_ID",
        width: 80,
        dataField: "OFF_ID",
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
        caption: "CA_NGHI",
        width: 80,
        dataField: "CA_NGHI",
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
        caption: "ON_OFF",
        width: 80,
        dataField: "ON_OFF",
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
        caption: "OVERTIME_INFO",
        width: 80,
        dataField: "OVERTIME_INFO",
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
        caption: "OVERTIME",
        width: 80,
        dataField: "OVERTIME",
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
        caption: "REASON_NAME",
        width: 80,
        dataField: "REASON_NAME",
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
        caption: "XACNHAN",
        width: 80,
        dataField: "XACNHAN",
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
        caption: "WEEKDAY",
        width: 80,
        dataField: "WEEKDAY",
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
    ],
    store: diemdanhFullTable,
  });
  const mainDeptSummaryColumns = [
    {
      field: "MAINDEPTNAME",
      headerName: "MAINDEPTNAME",
      width: 80,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "black", fontWeight: "bold" }}>
            {params.value}
          </span>
        );
      }
    },
    {
      headerName:'TOTAL',
      children:[
        {
          field: "COUNT_TOTAL",
          headerName: "TOTAL",
          width: 40,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "blue", fontWeight: "bold" }}>
                {params.value}
              </span>
            );
          },
        },
        {
          field: "COUNT_ON",
          headerName: "ON",
          width: 50,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "blue", fontWeight: "normal" }}>
                {params.value}
              </span>
            );
          },
        },
        {
          field: "COUNT_OFF",
          headerName: "OFF",
          width: 50,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "blue", fontWeight: "normal" }}>
                {params.value}
              </span>
            );
          },
        },
        {
          field: "COUNT_CDD",
          headerName: "CDD",
          width: 50,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "blue", fontWeight: "normal" }}>
                {params.value}
              </span>
            );
          },
        },
      ],
      headerClass:'header'  
    },
    {
      headerName:'TEAM 1',
      children:[
        {
          field: "T1_TOTAL",
          headerName: "T1_TOTAL",
          width: 70,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "green", fontWeight: "bold" }}>
                {params.value}
              </span>
            );
          },
        },
        {
          field: "T1_ON",
          headerName: "T1_ON",
          width: 70,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "green", fontWeight: "normal" }}>
                {params.value}
              </span>
            );
          },
        },
        {
          field: "T1_OFF",
          headerName: "T1_OFF",
          width: 70,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "green", fontWeight: "normal" }}>
                {params.value}
              </span>
            );
          },
        },
        {
          field: "T1_CDD",
          headerName: "T1_CDD",
          width: 70,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "green", fontWeight: "normal" }}>
                {params.value}
              </span>
            );
          },
        },
      ],
      headerClass:'header'       

    },
    {
      headerName:'TEAM 2',
      children:[
        {
          field: "T2_TOTAL",
          headerName: "T2_TOTAL",
          width: 70,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "#F705FB", fontWeight: "bold" }}>
                {params.value}
              </span>
            );
          },
        },
        {
          field: "T2_ON",
          headerName: "T2_ON",
          width: 70,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "#F705FB", fontWeight: "normal" }}>
                {params.value}
              </span>
            );
          },
        },
        {
          field: "T2_OFF",
          headerName: "T2_OFF",
          width: 70,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "#F705FB", fontWeight: "normal" }}>
                {params.value}
              </span>
            );
          },
        },
        {
          field: "T2_CDD",
          headerName: "T2_CDD",
          width: 70,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "#F705FB", fontWeight: "normal" }}>
                {params.value}
              </span>
            );
          },
        },
      ],
      headerClass:'header'       

    },
    {
      headerName:'HANH CHINH',
      children:[
        {
          field: "HC_TOTAL",
          headerName: "HC_TOTAL",
          width: 70,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "#01C0A3", fontWeight: "bold" }}>
                {params.value}
              </span>
            );
          },
        },
        {
          field: "HC_ON",
          headerName: "HC_ON",
          width: 70,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "#01C0A3", fontWeight: "normal" }}>
                {params.value}
              </span>
            );
          },
        },
        {
          field: "HC_OFF",
          headerName: "HC_OFF",
          width: 70,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "#01C0A3", fontWeight: "normal" }}>
                {params.value}
              </span>
            );
          },
        },
        {
          field: "HC_CDD",
          headerName: "HC_CDD",
          width: 70,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "#01C0A3", fontWeight: "normal" }}>
                {params.value}
              </span>
            );
          },
        },        
      ],
      headerClass:'header'       

    },
    {
      headerName:'TEAM 2',
      children:[
        
      ],
      headerClass:'header'       

    },
    
    {
      field: "ON_RATE",
      headerName: "ON_RATE",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>
            {(params.value / 100).toLocaleString('en-US', { style: 'percent' })}
          </span>
        );
      },
    },
    {
      headerName:'CHI TIET NGHI',
      children:[
        {
          field: "TOTAL",
          headerName: "TOTAL",
          width: 70,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "red", fontWeight: "bold" }}>
                {params.value}
              </span>
            );
          },
        },
        {
          field: "PHEP_NAM",
          headerName: "PHEP_NAM",
          width: 70,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "red", fontWeight: "normal" }}>
                {params.value}
              </span>
            );
          },
        },
        {
          field: "NUA_PHEP",
          headerName: "NUA_PHEP",
          width: 70,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "red", fontWeight: "normal" }}>
                {params.value}
              </span>
            );
          },
        },
        {
          field: "NGHI_VIEC_RIENG",
          headerName: "VIECRIENG",
          width: 70,
          editable: false,
          cellRenderer: (params: any) => {
            return (
              <span style={{ color: "red", fontWeight: "normal" }}>
                {params.value}
              </span>
            );
          },
        },        
      ],
      headerClass:'header' 
    },
    
    
  ]
  const mainDeptSummaryAGTable = useMemo(() =>
    <AGTable
      suppressRowClickSelection={false}
      showFilter={true}
      toolbar={
        <></>
      }
      columns={mainDeptSummaryColumns}
      data={diemdanhfullsummary}
      onCellEditingStopped={(params: any) => {
        //console.log(e.data)
      }} onRowClick={(params: any) => {
        //console.log(params.data)
      }} onSelectionChange={(params: any) => {
        //console.log(params)
        //setSelectedRows(params!.api.getSelectedRows()[0]);
        //console.log(e!.api.getSelectedRows())            
      }}
    />
    , [diemdanhfullsummary, mainDeptSummaryColumns]);
  useEffect(() => {
    handleSearch2();
    loadDiemDanhFullSummaryTable();
  }, []);
  return (
    (<div className="baocaonhansu">
      <div className="baocao1">
        <div className="filterform">
          <label>
            <b>{getlang("bophan", glbLang!)}:</b>
            <select
              name="bophan"
              value={maindeptcode}
              onChange={(e) => {
                setmaindeptcode(Number(e.target.value));
              }}
            >
              <option value={0}>Tất cả</option>
              {maindepttable.map((element, index) => (
                <option key={index} value={element.MAINDEPTCODE}>
                  {element.MAINDEPTNAME}
                </option>
              ))}
            </select>
          </label>
          <label>
            <b>{getlang("nhamay", glbLang!)}:</b>
            <select
              name="nhamay"
              value={nhamay}
              onChange={(e) => {
                setNhaMay(Number(e.target.value));
              }}
            >
              <option value={0}>Tất cả</option>
              <option value={1}>Nhà máy 1</option>
              <option value={2}>Nhà máy 2</option>
            </select>
          </label>
          <label>
            <b>{getlang("calamviec", glbLang!)}:</b>
            <select
              name="ca"
              value={ca}
              onChange={(e) => {
                setCa(Number(e.target.value));
              }}
            >
              <option value={6}>Tất cả</option>
              <option value={1}>Ca 1</option>
              <option value={2}>Ca 2</option>
              <option value={3}>Hành chính</option>
              <option value={4}>Ca 1 + Hành Chính</option>
              <option value={5}>Ca 2 + Hành Chính</option>
            </select>
          </label>
          <label>
            <b>From:</b>
            <input
              type="date"
              value={fromdate.slice(0, 10)}
              onChange={(e) => setFromDate(e.target.value)}
            ></input>
          </label>
          <label>
            <b>To:</b>
            <input
              type="date"
              value={todate.slice(0, 10)}
              onChange={(e) => setToDate(e.target.value)}
            ></input>
          </label>
          <button
            className="searchbutton"
            onClick={() => {
              handleSearch();
            }}
          >
            Search
          </button>
        </div>
        <h3>{getlang("bieudotrendingdilam", glbLang!)}</h3>
        <div className="diemdanhhistorychart">
          <NSDailyGraph dldata={diemdanh_historyTable} processColor="#a9ec71" materialColor="#FF0000" />
        </div>
        <h3>{getlang("nhanlucbophanchinh", glbLang!)}</h3>
        <div className="maindept_tableOK">
          <div className="tiledilamtable">
            <DataGrid
              sx={{ width: "100%" }}
              slots={{
              }}
              style={{ padding: "20px" }}
              loading={isLoading}
              rows={ddmaindepttb}
              rowHeight={30}
              columns={column_ddmaindepttb}
              hideFooterPagination
              hideFooter
            />
          </div>
          <div className="titrongphongbangraph">
            <CustomResponsiveContainer>
              <ChartDiemDanhMAINDEPT />
            </CustomResponsiveContainer>
          </div>
        </div>
        <h3>{getlang("nhanlucbophanchinh", glbLang!)}</h3>
        <div className="maindeptsummarydiv" style={{ width: '100%', height: '380px' }}>{mainDeptSummaryAGTable}</div>
        <h3>{getlang("nhanlucbophanphu", glbLang!)}</h3>
        <div className="maindept_table">
          <div className="tiledilamtable">
            <DataGrid
              slots={{
              }}
              style={{ padding: "20px" }}
              loading={isLoading}
              rows={diemdanhnhomtable}
              columns={columns_diemdanhnhom}
              getRowHeight={() => "auto"}
              hideFooterPagination
              hideFooter
            />
          </div>
          <div className="titrongphongbangraph" style={{ width: "100%", height: "100%" }}>
            {subdeptchartMM}
          </div>
        </div>
        <h3>{getlang("lichsudilamfullinfo", glbLang!)}</h3>
        <div className="maindept_table">
          <DataGrid
            slots={{
              toolbar: CustomToolbar3,
            }}
            style={{ padding: "20px" }}
            loading={isLoading}
            rowHeight={35}
            rows={diemdanhFullTable}
            columns={columns_diemdanhfull}
            pageSizeOptions={[5, 10, 30, 50, 100, 500, 1000, 5000, 10000]}
            editMode="row"
            getRowHeight={() => "auto"}
          />
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
            <PivotTable datasource={dataSource} tableID="invoicetablepivot" />
          </div>
        )}
      </div>
    </div>)
  );
};
export default BaoCaoNhanSu;
