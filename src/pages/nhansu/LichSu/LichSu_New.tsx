import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import Swal from "sweetalert2";
import { RootState } from "../../../redux/store";
import { UserData } from "../../../api/GlobalInterface";
import { generalQuery } from "../../../api/Api";
import { weekdayarray } from "../../../api/services/utilService";
import { SaveExcel } from "../../../api/services/excelService";
import { calcMinutesByRate, calculatePersonalIncomeTax } from "../BangChamCong/OverTimeUtils3";
import { DiemDanhLichSuData } from "../interfaces/nhansuInterface";
import { PhieuLuong } from "../BangChamCong/PhieuLuong";
import AGTable from "../../../components/DataTable/AGTable";

// Precision Stitch Subcomponents & Styling
import "./PrecisionLichSu/PrecisionLichSu.scss";
import PrecisionLichSuHeader from "./PrecisionLichSu/PrecisionLichSuHeader";
import PrecisionLichSuToolbar from "./PrecisionLichSu/PrecisionLichSuToolbar";
import PrecisionLichSuKpi from "./PrecisionLichSu/PrecisionLichSuKpi";
import PrecisionLichSuChart from "./PrecisionLichSu/PrecisionLichSuChart";
import {
  DateCellRenderer,
  WeekdayCellRenderer,
  OnOffCellRenderer,
  CheckTimeCellRenderer,
  FixedTimeCellRenderer,
  MinuteDiffCellRenderer,
  ApprovalStatusCellRenderer,
  EmplBadgeCellRenderer,
} from "./PrecisionLichSu/PrecisionLichSuCells";
import PrecisionLichSuPivotModal from "./PrecisionLichSu/PrecisionLichSuPivotModal";

const LichSu_New: React.FC = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  // Filter & Timeline States
  const [fromDate, setFromDate] = useState<string>(moment().format("YYYY-MM-01"));
  const [toDate, setToDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [isDefaultMonth, setIsDefaultMonth] = useState<boolean>(true);
  const [quickSearch, setQuickSearch] = useState<string>("");
  const [showPivotModal, setShowPivotModal] = useState<boolean>(false);

  // Table Data & Salary
  const [diemdanhnhomtable, setDiemDanhNhomTable] = useState<DiemDanhLichSuData[]>([]);
  const [, setPhieuLuong] = useState<PhieuLuong | null>(null);

  // Timeline Chart States
  const [attendanceTimeline, setAttendanceTimeline] = useState<
    Array<{ date: string; label: string; hours: number }>
  >([]);
  const [attendanceTimelineLoading, setAttendanceTimelineLoading] = useState(false);
  const [attendanceTimelineError, setAttendanceTimelineError] = useState<string | null>(null);

  // 1. Fetch Timeline Chart Data
  const _rangeDays = (fromYmd: string, toYmd: string) => {
    const start = moment(fromYmd, "YYYY-MM-DD", true);
    const end = moment(toYmd, "YYYY-MM-DD", true);
    if (!start.isValid() || !end.isValid()) return [] as moment.Moment[];
    const s = start.isAfter(end) ? end.clone() : start.clone();
    const e = start.isAfter(end) ? start.clone() : end.clone();
    const days: moment.Moment[] = [];
    const cur = s.clone();
    while (cur.isSameOrBefore(e, "day")) {
      days.push(cur.clone());
      cur.add(1, "day");
    }
    return days;
  };

  const fetchAttendanceTimeline = async (fromYmd?: string, toYmd?: string) => {
    try {
      setAttendanceTimelineLoading(true);
      setAttendanceTimelineError(null);
      const fDate = fromYmd && fromYmd.trim().length === 10 ? fromYmd.trim() : moment().startOf("month").format("YYYY-MM-DD");
      const tDate = toYmd && toYmd.trim().length === 10 ? toYmd.trim() : moment().endOf("month").format("YYYY-MM-DD");
      const days = _rangeDays(fDate, tDate);
      const baseData = days.map((d) => ({
        date: d.format("YYYY-MM-DD"),
        label: d.format("DD/MM"),
        hours: 0,
      }));

      const response = await generalQuery("mydiemdanhnhom", { from_date: fDate, to_date: tDate });
      if (response.data.tk_status === "NG") {
        setAttendanceTimeline(baseData);
        setAttendanceTimelineError(response.data.message || "Load failed");
        return;
      }

      const rows: any[] = response.data.data || [];
      const parseTime = (dStr: string, tStr: string) => {
        const clean = String(tStr || "").trim();
        if (!clean || clean === "OFF") return null;
        return moment(`${dStr} ${clean}`, ["YYYY-MM-DD HH:mm", "YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD H:mm", "YYYY-MM-DD H:mm:ss"], true);
      };
      const toHours = (mins: number) => Math.round((mins / 60) * 100) / 100;

      const idxByDate = new Map<string, number>();
      for (let i = 0; i < baseData.length; i++) idxByDate.set(baseData[i].date, i);

      for (const row of rows) {
        const dateStr = moment(row.DATE_COLUMN).utc().format("YYYY-MM-DD");
        const idx = idxByDate.get(dateStr);
        if (idx === undefined) continue;
        const inM = parseTime(dateStr, row.IN_TIME);
        const outMRaw = parseTime(dateStr, row.OUT_TIME);
        if (!inM || !outMRaw || !inM.isValid() || !outMRaw.isValid()) continue;
        const outM = outMRaw.isBefore(inM) ? outMRaw.clone().add(1, "day") : outMRaw;
        const diffMinutes = Math.max(0, outM.diff(inM, "minutes"));
        baseData[idx] = { ...baseData[idx], hours: toHours(Math.max(0, diffMinutes - 60)) };
      }
      setAttendanceTimeline(baseData);
    } catch (e: any) {
      setAttendanceTimelineError(String(e?.message || e));
    } finally {
      setAttendanceTimelineLoading(false);
    }
  };

  // 2. Fetch Attendance Table Data
  const handleSearch = (from?: string, to?: string) => {
    const queryFrom = from ?? fromDate;
    const queryTo = to ?? toDate;

    generalQuery("mydiemdanhnhom", { from_date: queryFrom, to_date: queryTo })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loaded_data: DiemDanhLichSuData[] = response.data.data.map(
            (element: DiemDanhLichSuData, index: number) => {
              const ratetb = calcMinutesByRate(element.IN_TIME, element.OUT_TIME, moment(element.DATE_COLUMN).utc().format("YYYY-MM-DD"));
              return {
                ...element,
                EMPL_NO: userData?.EMPL_NO,
                DATE_COLUMN: moment(element.DATE_COLUMN).utc().format("YYYY-MM-DD"),
                REQUEST_DATE: element.REQUEST_DATE === null ? "" : moment(element.REQUEST_DATE).utc().format("YYYY-MM-DD"),
                APPLY_DATE: element.APPLY_DATE === null ? "" : moment(element.APPLY_DATE).utc().format("YYYY-MM-DD"),
                WEEKDAY: weekdayarray[new Date(element.DATE_COLUMN).getDay()],
                CHECK1: element.CHECK1 !== null ? moment.utc(element.CHECK1).format("HH:mm:ss") : "",
                CHECK2: element.CHECK2 !== null ? moment.utc(element.CHECK2).format("HH:mm:ss") : "",
                CHECK3: element.CHECK3 !== null ? moment.utc(element.CHECK3).format("HH:mm:ss") : "",
                L100: element.REASON_NAME === "Phép năm" ? 480 : element.REASON_NAME === "Nửa phép" ? 240 + Math.min(ratetb["100%"], 240) : ratetb["100%"],
                L130: ratetb["130%"],
                L150: ratetb["150%"],
                L200: ratetb["200%"],
                L210: ratetb["210%"],
                L270: ratetb["270%"],
                L300: ratetb["300%"],
                L390: ratetb["390%"],
                id: index,
              };
            }
          );

          setDiemDanhNhomTable(loaded_data);
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    handleSearch();
    fetchAttendanceTimeline(moment().startOf("month").format("YYYY-MM-DD"), moment().endOf("month").format("YYYY-MM-DD"));
  }, []);

  // 3. Quick Search Filtering
  const filteredData = useMemo(() => {
    if (!quickSearch.trim()) return diemdanhnhomtable;
    const term = quickSearch.toLowerCase();
    return diemdanhnhomtable.filter((row) => {
      const matchDate = row.DATE_COLUMN?.toLowerCase().includes(term);
      const matchWeekday = row.WEEKDAY?.toLowerCase().includes(term);
      const matchReason = row.REASON_NAME?.toLowerCase().includes(term);
      const matchRemark = row.REMARK?.toLowerCase().includes(term);
      const matchEmpl = row.EMPL_NO?.toLowerCase().includes(term);
      const matchId = String(row.CMS_ID || "").toLowerCase().includes(term);
      const matchStatus = row.ON_OFF === 1 ? "đi làm".includes(term) : "nghỉ làm".includes(term);
      return matchDate || matchWeekday || matchReason || matchRemark || matchEmpl || matchId || matchStatus;
    });
  }, [diemdanhnhomtable, quickSearch]);

  // 4. AGTable Columns Definition
  const columns = useMemo(() => [
    { field: "DATE_COLUMN", headerName: "DATE", width: 90, cellRenderer: DateCellRenderer },
    { field: "WEEKDAY", headerName: "WEEKDAY", width: 85, cellRenderer: WeekdayCellRenderer },
    { field: "ON_OFF", headerName: "ON_OFF", width: 80, cellRenderer: OnOffCellRenderer },
    { field: "CHECK1", headerName: "CHECK1", width: 75, cellRenderer: CheckTimeCellRenderer },
    { field: "CHECK2", headerName: "CHECK2", width: 75, cellRenderer: CheckTimeCellRenderer },
    { field: "CHECK3", headerName: "CHECK3", width: 70, cellRenderer: CheckTimeCellRenderer },
    { field: "IN_TIME", headerName: "FIXED_IN", width: 70, cellRenderer: FixedTimeCellRenderer },
    { field: "OUT_TIME", headerName: "FIXED_OUT", width: 70, cellRenderer: FixedTimeCellRenderer },
    { field: "EARLY_IN_MINUTES", headerName: "DI_SOM", width: 65, cellRenderer: (p: any) => MinuteDiffCellRenderer(p, "early_in") },
    { field: "LATE_IN_MINUTES", headerName: "DI_MUON", width: 65, cellRenderer: (p: any) => MinuteDiffCellRenderer(p, "late_in") },
    { field: "EARLY_OUT_MINUTES", headerName: "VE_SOM", width: 65, cellRenderer: (p: any) => MinuteDiffCellRenderer(p, "early_out") },
    { field: "OVERTIME_MINUTES", headerName: "TANG_CA", width: 65, cellRenderer: (p: any) => MinuteDiffCellRenderer(p, "ot") },
    { field: "WORKING_MINUTES", headerName: "HANH_CHINH", width: 85, cellRenderer: (p: any) => MinuteDiffCellRenderer(p, "working") },
    { field: "FINAL_OVERTIMES", headerName: "FIX_TANG_CA", width: 80, cellRenderer: (p: any) => MinuteDiffCellRenderer(p, "ot") },
    { field: "PHE_DUYET", headerName: "PHE_DUYET", width: 80, cellRenderer: ApprovalStatusCellRenderer },
    { field: "REASON_NAME", headerName: "REASON_NAME", width: 90 },
    { field: "REMARK", headerName: "REMARK", width: 90 },
    { field: "EMPL_NO", headerName: "EMPL_NO", width: 75, cellRenderer: (p: any) => EmplBadgeCellRenderer(p, false) },
    { field: "CMS_ID", headerName: "NS_ID", width: 75, cellRenderer: (p: any) => EmplBadgeCellRenderer(p, true) },
    { field: "MIDLAST_NAME", headerName: "MIDLAST_NAME", width: 110 },
    { field: "FIRST_NAME", headerName: "FIRST_NAME", width: 70 },
    { field: "CA_NGHI", headerName: "CA_NGHI", width: 70 },
    { field: "OVERTIME_INFO", headerName: "OVERTIME_INFO", width: 95 },
    { field: "OVERTIME", headerName: "OVERTIME", width: 70 },
    { field: "XACNHAN", headerName: "XACNHAN", width: 70 },
    { field: "PHONE_NUMBER", headerName: "PHONE_NUMBER", width: 90 },
    { field: "SEX_NAME", headerName: "SEX_NAME", width: 50 },
    { field: "REQUEST_DATE", headerName: "REQUEST_DATE", width: 90 },
    { field: "OFF_ID", headerName: "OFF_ID", width: 80 },
  ], []);

  return (
    <div className="precision-lichsu">
      {/* 1. Header Banner */}
      <PrecisionLichSuHeader userData={userData} />

      {/* 2. Operational Toolbar */}
      <PrecisionLichSuToolbar
        fromDate={fromDate}
        toDate={toDate}
        isDefaultMonth={isDefaultMonth}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onDefaultMonthChange={(checked) => {
          setIsDefaultMonth(checked);
          if (checked) {
            const m1 = moment().startOf("month").format("YYYY-MM-DD");
            const m2Today = moment().format("YYYY-MM-DD");
            setFromDate(m1);
            setToDate(m2Today);
            handleSearch(m1, m2Today);
            fetchAttendanceTimeline(m1, moment().endOf("month").format("YYYY-MM-DD"));
          }
        }}
        onSearch={() => {
          if (isDefaultMonth) {
            const m1 = moment().startOf("month").format("YYYY-MM-DD");
            const m2Today = moment().format("YYYY-MM-DD");
            handleSearch(m1, m2Today);
            fetchAttendanceTimeline(m1, moment().endOf("month").format("YYYY-MM-DD"));
          } else {
            handleSearch(fromDate, toDate);
            fetchAttendanceTimeline(fromDate, toDate);
          }
        }}
        onExportEx1={() => SaveExcel(filteredData, "LichSuDiLam_DangLoc")}
        onExportEx2={() => SaveExcel(diemdanhnhomtable, "LichSuDiLam_TatCa")}
        onOpenPivot={() => setShowPivotModal(true)}
      />

      {/* 3. Realtime KPI Cards */}
      <PrecisionLichSuKpi data={diemdanhnhomtable} />

      {/* 4. Attendance Timeline Chart */}
      <PrecisionLichSuChart
        timelineData={attendanceTimeline}
        isLoading={attendanceTimelineLoading}
        errorMessage={attendanceTimelineError}
        isDefaultMonth={isDefaultMonth}
        fromDate={fromDate}
        toDate={toDate}
        onRefresh={() => {
          if (isDefaultMonth) {
            fetchAttendanceTimeline(moment().startOf("month").format("YYYY-MM-DD"), moment().endOf("month").format("YYYY-MM-DD"));
          } else {
            fetchAttendanceTimeline(fromDate, toDate);
          }
        }}
      />

      {/* 5. AGTable Grid Container */}
      <div className="precision-lichsu__gridCard">
        <div className="precision-lichsu__gridToolbar">
          <div className="search-box">
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#94a3b8" }}>
              search
            </span>
            <input
              type="text"
              placeholder="Tìm nhanh ngày, thứ, trạng thái, mã NV..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
            />
          </div>

          <div className="toolbar-actions">
            <button
              type="button"
              className="precision-lichsu__btn precision-lichsu__btn--excel precision-lichsu__btn--sm"
              onClick={() => SaveExcel(filteredData, "LichSuDiLam_DangLoc")}
              title="Xuất bảng tính danh sách đang lọc"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>download</span>
              <span>EX1 ({filteredData.length})</span>
            </button>
            <button
              type="button"
              className="precision-lichsu__btn precision-lichsu__btn--excel precision-lichsu__btn--sm"
              onClick={() => SaveExcel(diemdanhnhomtable, "LichSuDiLam_TatCa")}
              title="Xuất toàn bộ danh sách"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>file_download</span>
              <span>EX2 ({diemdanhnhomtable.length})</span>
            </button>
            <button
              type="button"
              className="precision-lichsu__btn precision-lichsu__btn--pivot precision-lichsu__btn--sm"
              onClick={() => setShowPivotModal(true)}
              title="Mở bảng phân tích"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>pivot_table_chart</span>
              <span>PIVOT</span>
            </button>
          </div>
        </div>

        <div className="precision-lichsu__gridBody">
          <AGTable
            suppressRowClickSelection={false}
            columns={columns}
            data={filteredData}
          />
        </div>
      </div>

      {/* 6. Pivot Modal */}
      <PrecisionLichSuPivotModal
        open={showPivotModal}
        onClose={() => setShowPivotModal(false)}
        data={diemdanhnhomtable}
      />
    </div>
  );
};

export default LichSu_New;
