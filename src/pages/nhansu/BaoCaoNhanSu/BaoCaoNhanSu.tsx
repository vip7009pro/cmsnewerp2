import { useEffect, useState } from "react";
import { generalQuery } from "../../../api/Api";
import "./BaoCaoNhanSu.scss";
import "./PrecisionBaoCaoNhanSu/PrecisionBaoCaoNhanSu.scss";
import Swal from "sweetalert2";
import { SaveExcel } from "../../../api/services/excelService";
import { weekdayarray } from "../../../api/services/utilService";
import moment from "moment";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import {
  DIEMDANHFULLSUMMARY,
  DIEMDANHMAINDEPT,
  DiemDanhFullData,
  DiemDanhHistoryData,
  DiemDanhNhomData,
  DiemDanhNhomDataSummary,
  MainDeptData,
} from "../interfaces/nhansuInterface";
import { UserData } from "../../../api/GlobalInterface";
// Precision Subcomponents
import PrecisionBaoCaoHeader from "./PrecisionBaoCaoNhanSu/PrecisionBaoCaoHeader";
import PrecisionBaoCaoToolbar from "./PrecisionBaoCaoNhanSu/PrecisionBaoCaoToolbar";
import PrecisionBaoCaoKpi from "./PrecisionBaoCaoNhanSu/PrecisionBaoCaoKpi";
import PrecisionBaoCaoTrendChart from "./PrecisionBaoCaoNhanSu/PrecisionBaoCaoTrendChart";
import PrecisionBaoCaoMainDept from "./PrecisionBaoCaoNhanSu/PrecisionBaoCaoMainDept";
import PrecisionBaoCaoShiftMatrix from "./PrecisionBaoCaoNhanSu/PrecisionBaoCaoShiftMatrix";
import PrecisionBaoCaoSubDept from "./PrecisionBaoCaoNhanSu/PrecisionBaoCaoSubDept";
import PrecisionBaoCaoFullTable from "./PrecisionBaoCaoNhanSu/PrecisionBaoCaoFullTable";
import PrecisionBaoCaoPivotModal from "./PrecisionBaoCaoNhanSu/PrecisionBaoCaoPivotModal";

const BaoCaoNhanSu = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const glbLang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang,
  );

  // State declarations (100% preserved from original)
  const [isLoading, setisLoading] = useState(false);
  const [ddmaindepttb, setddmaindepttb] = useState<Array<DIEMDANHMAINDEPT>>([]);
  const [diemdanhnhomtable, setDiemDanhNhomTable] = useState<Array<DiemDanhNhomDataSummary>>([]);
  const [diemdanhfullsummary, setDiemDanhFullSummary] = useState<Array<DIEMDANHFULLSUMMARY>>([]);
  const [piechartdata, setPieChartData] = useState<Array<DiemDanhNhomData>>([]);
  const [fromdate, setFromDate] = useState(moment().add(-8, "day").format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [ca, setCa] = useState(6);
  const [nhamay, setNhaMay] = useState(0);
  const [maindeptcode, setmaindeptcode] = useState(0);
  const [maindepttable, setMainDeptTable] = useState<Array<MainDeptData>>([]);
  const [diemdanh_historyTable, setDiemDanh_HistoryTable] = useState<Array<DiemDanhHistoryData>>([]);
  const [diemdanhFullTable, setDiemDanhFullTable] = useState<Array<DiemDanhFullData>>([]);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);

  // Logic: addTotal - preserved 100% from original
  const addTotal = (tabledata: Array<DiemDanhNhomDataSummary>) => {
    var TOTAL_ALL: number = 0, TOTAL_OFF: number = 0, TOTAL_ON: number = 0, TOTAL_CDD: number = 0;
    var TOTAL_NM1: number = 0, TOTAL_NM2: number = 0;
    var ON_NM1: number = 0, ON_NM2: number = 0, OFF_NM1: number = 0, OFF_NM2: number = 0;
    var CDD_NM1: number = 0, CDD_NM2: number = 0;
    for (var i = 0; i < tabledata.length; i++) {
      var obj = tabledata[i];
      TOTAL_ALL += obj.TOTAL_ALL; TOTAL_ON += obj.TOTAL_ON; TOTAL_OFF += obj.TOTAL_OFF;
      TOTAL_CDD += obj.TOTAL_CDD; TOTAL_NM1 += obj.TOTAL_NM1; TOTAL_NM2 += obj.TOTAL_NM2;
      ON_NM1 += obj.ON_NM1; ON_NM2 += obj.ON_NM2; OFF_NM1 += obj.OFF_NM1;
      OFF_NM2 += obj.OFF_NM2; CDD_NM1 += obj.CDD_NM1; CDD_NM2 += obj.CDD_NM2;
    }
    var grandTotalOBJ: DiemDanhNhomDataSummary = {
      id: "GRAND_TOTAL", MAINDEPTNAME: "GRAND_TOTAL", SUBDEPTNAME: "GRAND_TOTAL",
      TOTAL_ALL, TOTAL_ON, TOTAL_OFF, TOTAL_CDD, TOTAL_NM1, TOTAL_NM2,
      ON_NM1, ON_NM2, OFF_NM1, OFF_NM2, CDD_NM1, CDD_NM2,
    };
    tabledata.push(grandTotalOBJ);
    return tabledata;
  };

  // API: handleSearch2 - preserved 100%
  const handleSearch2 = () => {
    setisLoading(true);
    generalQuery("getmaindeptlist", { from_date: fromdate })
      .then((response) => {
        if (response.data.tk_status !== "NG") { setMainDeptTable(response.data.data); }
      }).catch((error) => { console.log(error); });

    generalQuery("diemdanhsummarynhom", { todate: todate })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setPieChartData(response.data.data);
          let totalAdded: DiemDanhNhomDataSummary[] = addTotal(response.data.data);
          setDiemDanhNhomTable(totalAdded);
          setisLoading(false);
        } else { Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error"); }
      }).catch((error) => { console.log(error); });

    generalQuery("diemdanhhistorynhom", {
      start_date: fromdate, end_date: todate,
      MAINDEPTCODE: maindeptcode, WORK_SHIFT_CODE: ca, FACTORY_CODE: nhamay,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const newdiemdanhtb: Array<DiemDanhHistoryData> =
            response.data.data.map((obj: { APPLY_DATE: string | any[] }) => {
              return { ...obj, APPLY_DATE: obj.APPLY_DATE.slice(0, 10) };
            });
          setDiemDanh_HistoryTable(newdiemdanhtb);
        } else { Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error"); }
      }).catch((error) => { console.log(error); });

    generalQuery("diemdanhfull", { from_date: fromdate, to_date: todate })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loaded_data: DiemDanhFullData[] = response.data.data.map(
            (element: DiemDanhFullData, index: number) => ({
              ...element,
              DATE_COLUMN: moment(element.DATE_COLUMN).utc().format("YYYY-MM-DD"),
              APPLY_DATE: element.APPLY_DATE === null ? "" : moment(element.APPLY_DATE).utc().format("YYYY-MM-DD"),
              WEEKDAY: weekdayarray[new Date(element.DATE_COLUMN).getDay()],
              id: index,
            }),
          );
          setDiemDanhFullTable(loaded_data);
          setisLoading(false);
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else { Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error"); }
      }).catch((error) => { console.log(error); });

    generalQuery("getddmaindepttb", { FROM_DATE: moment().format("YYYY-MM-DD"), TO_DATE: moment().format("YYYY-MM-DD") })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          let temp_total: DIEMDANHMAINDEPT = { id: 1111, MAINDEPTNAME: "TOTAL", COUNT_TOTAL: 0, COUT_ON: 0, COUT_OFF: 0, COUNT_CDD: 0, ON_RATE: 0 };
          let loadeddata = response.data.data.map(
            (element: DIEMDANHMAINDEPT, index: number) => {
              temp_total = {
                ...temp_total,
                COUNT_TOTAL: temp_total.COUNT_TOTAL + element.COUNT_TOTAL,
                COUT_ON: temp_total.COUT_ON + element.COUT_ON,
                COUT_OFF: temp_total.COUT_OFF + element.COUT_OFF,
                COUNT_CDD: temp_total.COUNT_CDD + element.COUNT_CDD,
              };
              return { ...element, id: index };
            },
          );
          temp_total = { ...temp_total, ON_RATE: (temp_total.COUT_ON / temp_total.COUNT_TOTAL) * 100 };
          loadeddata = [...loadeddata, temp_total];
          setddmaindepttb(loadeddata);
          setisLoading(false);
        } else { Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error"); }
      }).catch((error) => { console.log(error); });
  };

  // API: loadDiemDanhFullSummaryTable - preserved 100%
  const loadDiemDanhFullSummaryTable = () => {
    generalQuery("loadDiemDanhFullSummaryTable", { FROM_DATE: moment().format("YYYY-MM-DD"), TO_DATE: moment().format("YYYY-MM-DD") })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loaded_data: DIEMDANHFULLSUMMARY[] = response.data.data.map(
            (element: DIEMDANHFULLSUMMARY, index: number) => ({ ...element, id: index }),
          );
          let totalRow: DIEMDANHFULLSUMMARY = {
            id: -1, MAINDEPTNAME: "TOTAL", COUNT_TOTAL: 0, COUNT_ON: 0, COUNT_OFF: 0, COUNT_CDD: 0,
            T1_TOTAL: 0, T1_ON: 0, T1_OFF: 0, T1_CDD: 0,
            T2_TOTAL: 0, T2_ON: 0, T2_OFF: 0, T2_CDD: 0,
            HC_TOTAL: 0, HC_ON: 0, HC_OFF: 0, HC_CDD: 0,
            ON_RATE: 0, TOTAL: 0, PHEP_NAM: 0, NUA_PHEP: 0,
            NGHI_VIEC_RIENG: 0, NGHI_OM: 0, CHE_DO: 0, KHONG_LY_DO: 0,
          };
          for (let i = 0; i < loaded_data.length; i++) {
            totalRow.T1_CDD += loaded_data[i].T1_CDD; totalRow.T1_OFF += loaded_data[i].T1_OFF;
            totalRow.T1_ON += loaded_data[i].T1_ON; totalRow.T1_TOTAL += loaded_data[i].T1_TOTAL;
            totalRow.T2_CDD += loaded_data[i].T2_CDD; totalRow.T2_OFF += loaded_data[i].T2_OFF;
            totalRow.T2_ON += loaded_data[i].T2_ON; totalRow.T2_TOTAL += loaded_data[i].T2_TOTAL;
            totalRow.HC_CDD += loaded_data[i].HC_CDD; totalRow.HC_OFF += loaded_data[i].HC_OFF;
            totalRow.HC_ON += loaded_data[i].HC_ON; totalRow.HC_TOTAL += loaded_data[i].HC_TOTAL;
            totalRow.COUNT_CDD += loaded_data[i].COUNT_CDD; totalRow.COUNT_OFF += loaded_data[i].COUNT_OFF;
            totalRow.COUNT_ON += loaded_data[i].COUNT_ON; totalRow.COUNT_TOTAL += loaded_data[i].COUNT_TOTAL;
            totalRow.TOTAL += loaded_data[i].TOTAL; totalRow.PHEP_NAM += loaded_data[i].PHEP_NAM;
            totalRow.NUA_PHEP += loaded_data[i].NUA_PHEP; totalRow.NGHI_VIEC_RIENG += loaded_data[i].NGHI_VIEC_RIENG;
            totalRow.NGHI_OM += loaded_data[i].NGHI_OM; totalRow.CHE_DO += loaded_data[i].CHE_DO;
            totalRow.KHONG_LY_DO += loaded_data[i].KHONG_LY_DO;
          }
          totalRow.ON_RATE = (totalRow.COUNT_ON / totalRow.COUNT_TOTAL) * 100;
          setDiemDanhFullSummary([...loaded_data, totalRow]);
        } else { Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error"); }
      }).catch((error) => { console.log(error); });
  };

  const handleSearch = () => {
    handleSearch2();
    loadDiemDanhFullSummaryTable();
  };

  // Export handlers
  const handleExportEX1 = (filteredData: DiemDanhFullData[]) => {
    SaveExcel(filteredData, "DiemdanhHistoryFull_Filtered");
  };
  const handleExportEX2 = (allData: DiemDanhFullData[]) => {
    SaveExcel(allData, "DiemdanhHistoryFull");
  };

  useEffect(() => {
    handleSearch2();
    loadDiemDanhFullSummaryTable();
  }, []);

  return (
    <div className="precision-baocao">
      <PrecisionBaoCaoHeader totalCount={ddmaindepttb.length} />

      <PrecisionBaoCaoToolbar
        maindeptcode={maindeptcode}
        setmaindeptcode={setmaindeptcode}
        nhamay={nhamay}
        setNhaMay={setNhaMay}
        ca={ca}
        setCa={setCa}
        fromdate={fromdate}
        setFromDate={setFromDate}
        todate={todate}
        setToDate={setToDate}
        maindepttable={maindepttable}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      <PrecisionBaoCaoKpi
        mainDeptData={ddmaindepttb}
        fullSummaryData={diemdanhfullsummary}
      />

      <PrecisionBaoCaoTrendChart
        data={diemdanh_historyTable}
        fromDate={fromdate}
        toDate={todate}
      />

      <PrecisionBaoCaoMainDept
        data={ddmaindepttb}
        isLoading={isLoading}
      />

      <PrecisionBaoCaoShiftMatrix
        data={diemdanhfullsummary}
        isLoading={isLoading}
      />

      <PrecisionBaoCaoSubDept
        data={diemdanhnhomtable}
        isLoading={isLoading}
      />

      <PrecisionBaoCaoFullTable
        data={diemdanhFullTable}
        onExportEX1={handleExportEX1}
        onExportEX2={handleExportEX2}
        onOpenPivot={() => setShowHidePivotTable(true)}
        isLoading={isLoading}
      />

      <PrecisionBaoCaoPivotModal
        isOpen={showhidePivotTable}
        onClose={() => setShowHidePivotTable(false)}
        data={diemdanhFullTable}
      />
    </div>
  );
};
export default BaoCaoNhanSu;
