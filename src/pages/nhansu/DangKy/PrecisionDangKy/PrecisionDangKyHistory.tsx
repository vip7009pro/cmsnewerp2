import React, { useCallback, useEffect, useMemo, useState } from "react";
import { generalQuery, getUserData } from "../../../../api/Api";
import { SaveExcel } from "../../../../api/services/excelService";
import { weekdayarray } from "../../../../api/services/utilService";
import AGTable from "../../../../components/DataTable/AGTable";
import moment from "moment";
import {
  ApprovalStatusCellRenderer,
  DateRangeCellRenderer,
  DetailReasonCellRenderer,
  RecordTypeCellRenderer,
} from "./PrecisionDangKyCells";

interface PrecisionDangKyHistoryProps {
  reloadTrigger?: number;
}

export const PrecisionDangKyHistory: React.FC<PrecisionDangKyHistoryProps> = ({
  reloadTrigger = 0,
}) => {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");
  const [fromDate, setFromDate] = useState<string>(moment().startOf("month").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState<string>(moment().endOf("month").format("YYYY-MM-DD"));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load dữ liệu lịch sử từ API
  const loadHistory = useCallback(() => {
    setIsLoading(true);
    generalQuery("mydiemdanhnhom", { from_date: fromDate, to_date: toDate })
      .then((response) => {
        if (response.data.tk_status !== "NG" && Array.isArray(response.data.data)) {
          const formatted = response.data.data.map((item: any, index: number) => {
            const dateVal = item.DATE_COLUMN
              ? moment.utc(item.DATE_COLUMN).format("YYYY-MM-DD")
              : "";
            const dayOfWeek = dateVal ? weekdayarray[new Date(dateVal).getDay()] : "";
            const check1 = item.CHECK1 ? moment.utc(item.CHECK1).format("HH:mm") : "";
            const check2 = item.CHECK2 ? moment.utc(item.CHECK2).format("HH:mm") : "";
            const timeSpan = check1 && check2 ? `${check1} - ${check2}` : check1 || check2 || "—";

            return {
              ...item,
              id: index + 1,
              DATE_COLUMN: dateVal,
              WEEKDAY: dayOfWeek,
              TIME_SPAN: timeSpan,
            };
          });
          setHistoryData(formatted);
        } else {
          setHistoryData([]);
        }
      })
      .catch((err) => {
        console.error("Lỗi tải lịch sử đăng ký:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [fromDate, toDate]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory, reloadTrigger]);

  // Lọc dữ liệu theo search và loại đơn
  const filteredData = useMemo(() => {
    let list = [...historyData];

    if (filterType === "leave") {
      list = list.filter((item) => item.REASON_NAME || item.OFF_ID);
    } else if (filterType === "ot") {
      list = list.filter((item) => item.OVER_START || item.OVER_FINISH);
    } else if (filterType === "attendance") {
      list = list.filter((item) => item.CONFIRM_WORKTIME);
    }

    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      list = list.filter((item) => {
        return (
          (item.DATE_COLUMN && item.DATE_COLUMN.toLowerCase().includes(q)) ||
          (item.WEEKDAY && item.WEEKDAY.toLowerCase().includes(q)) ||
          (item.REASON_NAME && item.REASON_NAME.toLowerCase().includes(q)) ||
          (item.REMARK && item.REMARK.toLowerCase().includes(q)) ||
          (item.CONFIRM_WORKTIME && item.CONFIRM_WORKTIME.toLowerCase().includes(q))
        );
      });
    }

    return list;
  }, [historyData, filterType, searchKeyword]);

  // Xuất Excel EX1: Dữ liệu đang lọc
  const handleExportEX1 = () => {
    if (filteredData.length === 0) return;
    const dateStr = moment().format("YYYYMMDD_HHmmss");
    SaveExcel(filteredData, `NS3_LichSuDangKy_DangLoc_${dateStr}`);
  };

  // Xuất Excel EX2: Toàn bộ dữ liệu
  const handleExportEX2 = () => {
    if (historyData.length === 0) return;
    const dateStr = moment().format("YYYYMMDD_HHmmss");
    SaveExcel(historyData, `NS3_LichSuDangKy_TatCa_${dateStr}`);
  };

  // Định nghĩa các cột AG-Grid High-Density
  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: "STT",
        width: 48,
        cellStyle: { textAlign: "center", color: "#64748b", fontWeight: 600, fontSize: "11px" },
      },
      {
        field: "DATE_COLUMN",
        headerName: "NGÀY / THỨ",
        width: 115,
        cellRenderer: DateRangeCellRenderer,
      },
      {
        field: "TYPE",
        headerName: "LOẠI NGHIỆP VỤ",
        width: 135,
        cellRenderer: RecordTypeCellRenderer,
      },
      {
        field: "TIME_SPAN",
        headerName: "GIỜ VÀO - RA",
        width: 105,
        cellStyle: { fontFamily: "JetBrains Mono, monospace", fontSize: "11px", fontWeight: 600, color: "#0f172a" },
      },
      {
        field: "REMARK",
        headerName: "CHI TIẾT / LÝ DO",
        minWidth: 160,
        flex: 1,
        cellRenderer: DetailReasonCellRenderer,
      },
      {
        field: "APPROVAL_STATUS",
        headerName: "TRẠNG THÁI",
        width: 105,
        cellRenderer: ApprovalStatusCellRenderer,
      },
    ],
    []
  );

  return (
    <div className="precision-dangky__rightPanel">
      {/* THANH LỌC NHANH TRÊN BẢNG (GRID TOOLBAR) */}
      <div className="precision-dangky__gridToolbar">
        <div className="toolbar-left">
          <div className="search-box">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Lọc nhanh lịch sử..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          <select
            className="type-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Tất cả loại đơn</option>
            <option value="leave">Nghỉ phép</option>
            <option value="ot">Tăng ca (OT)</option>
            <option value="attendance">Xác nhận công</option>
          </select>

          <div className="grid-actions">
            <button
              type="button"
              className="grid-btn grid-btn--excel"
              onClick={handleExportEX1}
              title="Xuất các dòng đang lọc ra Excel"
            >
              <span className="material-symbols-outlined">description</span>
              <span>EX1</span>
              <span className="badge">Đang lọc</span>
            </button>

            <button
              type="button"
              className="grid-btn grid-btn--excel"
              onClick={handleExportEX2}
              title="Xuất toàn bộ lịch sử ra Excel"
            >
              <span className="material-symbols-outlined">file_download</span>
              <span>EX2</span>
              <span className="badge">Tất cả</span>
            </button>

            <button
              type="button"
              className="grid-btn grid-btn--refresh"
              onClick={loadHistory}
              title="Làm mới dữ liệu từ máy chủ"
            >
              <span className="material-symbols-outlined">refresh</span>
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        <div className="toolbar-right">
          <span>
            Đang hiển thị: <strong>{filteredData.length} / {historyData.length}</strong> đơn
          </span>
        </div>
      </div>

      {/* KHUNG BODY CHỨA AG-GRID CHUẨN HÓA (ẨN TOOLBAR XANH LÁ) */}
      <div className="precision-dangky__gridBody">
        <AGTable
          rowHeight={36}
          columns={columns}
          data={filteredData}
          suppressRowClickSelection={false}
          // TUYỆT ĐỐI KHÔNG truyền prop toolbar để tránh render toolbar xanh lá cũ
        />
      </div>
    </div>
  );
};

export default React.memo(PrecisionDangKyHistory);
