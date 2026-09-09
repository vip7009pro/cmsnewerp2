import React, { useCallback, useEffect, useMemo, useState } from "react";
import { generalQuery } from "../../../../api/Api";
import { SaveExcel } from "../../../../api/services/excelService";
import { weekdayarray } from "../../../../api/services/utilService";
import AGTable from "../../../../components/DataTable/AGTable";
import moment from "moment";
import {
  ApprovalStatusCellRenderer,
  DetailReasonCellRenderer,
  LeaveCodeCellRenderer,
  LeaveDateCellRenderer,
  LeaveShiftCellRenderer,
  LeaveTypeBadgeCellRenderer,
  RequestDateCellRenderer,
  WeekdayCellRenderer,
} from "./PrecisionDangKyCells";

interface PrecisionDangKyHistoryProps {
  reloadTrigger?: number;
}

export const PrecisionDangKyHistory: React.FC<PrecisionDangKyHistoryProps> = ({
  reloadTrigger = 0,
}) => {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [filterReason, setFilterReason] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Mặc định toàn thời gian (từ 2010 đến hết năm sau)
  const fromDate = "2010-01-01";
  const toDate = moment().add(1, "years").endOf("year").format("YYYY-MM-DD");

  // Load dữ liệu lịch sử từ API mydiemdanhnhom toàn thời gian
  const loadHistory = useCallback(() => {
    setIsLoading(true);
    generalQuery("mydiemdanhnhom", { from_date: fromDate, to_date: toDate })
      .then((response) => {
        if (response.data.tk_status !== "NG" && Array.isArray(response.data.data)) {
          // CHỈ LỌC CÁC NGÀY CÓ ĐƠN NGHỈ (REASON_NAME HOẶC OFF_ID KHÔNG NULL)
          const leaveRecords = response.data.data.filter((item: any) => {
            const hasReason =
              item.REASON_NAME !== null &&
              item.REASON_NAME !== undefined &&
              String(item.REASON_NAME).trim() !== "";
            const hasOffId =
              item.OFF_ID !== null &&
              item.OFF_ID !== undefined &&
              String(item.OFF_ID).trim() !== "";
            return hasReason || hasOffId;
          });

          // Sắp xếp mới nhất lên đầu
          leaveRecords.sort((a: any, b: any) => {
            const timeA = a.DATE_COLUMN ? new Date(a.DATE_COLUMN).getTime() : 0;
            const timeB = b.DATE_COLUMN ? new Date(b.DATE_COLUMN).getTime() : 0;
            return timeB - timeA;
          });

          const formatted = leaveRecords.map((item: any, index: number) => {
            const dateVal = item.DATE_COLUMN
              ? moment.utc(item.DATE_COLUMN).format("YYYY-MM-DD")
              : item.APPLY_DATE
              ? moment.utc(item.APPLY_DATE).format("YYYY-MM-DD")
              : "";
            const dayOfWeek = dateVal ? weekdayarray[new Date(dateVal).getDay()] : "";
            const reqDate = item.REQUEST_DATE
              ? moment.utc(item.REQUEST_DATE).format("YYYY-MM-DD")
              : "";

            return {
              ...item,
              id: index + 1,
              DATE_COLUMN: dateVal,
              WEEKDAY: dayOfWeek,
              REQUEST_DATE: reqDate,
            };
          });

          setHistoryData(formatted);
        } else {
          setHistoryData([]);
        }
      })
      .catch((err) => {
        console.error("Lỗi tải lịch sử nghỉ phép toàn thời gian:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [fromDate, toDate]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory, reloadTrigger]);

  // Lọc dữ liệu theo từ khóa tìm kiếm, kiểu nghỉ và trạng thái duyệt
  const filteredData = useMemo(() => {
    let list = [...historyData];

    // Lọc theo kiểu nghỉ
    if (filterReason !== "all") {
      list = list.filter((item) => {
        if (!item.REASON_NAME) return false;
        return item.REASON_NAME.toLowerCase().includes(filterReason.toLowerCase());
      });
    }

    // Lọc theo trạng thái duyệt (1: Đã duyệt, 2/0: Chờ duyệt, 3: Đã hủy)
    if (filterStatus === "approved") {
      list = list.filter((item) => item.APPROVAL_STATUS === 1);
    } else if (filterStatus === "pending") {
      list = list.filter((item) => item.APPROVAL_STATUS === 0 || item.APPROVAL_STATUS === 2);
    } else if (filterStatus === "canceled") {
      list = list.filter((item) => item.APPROVAL_STATUS === 3);
    }

    // Lọc theo từ khóa
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      list = list.filter((item) => {
        return (
          (item.OFF_ID && String(item.OFF_ID).toLowerCase().includes(q)) ||
          (item.DATE_COLUMN && item.DATE_COLUMN.toLowerCase().includes(q)) ||
          (item.WEEKDAY && item.WEEKDAY.toLowerCase().includes(q)) ||
          (item.REASON_NAME && item.REASON_NAME.toLowerCase().includes(q)) ||
          (item.REMARK && item.REMARK.toLowerCase().includes(q)) ||
          (item.REQUEST_DATE && item.REQUEST_DATE.toLowerCase().includes(q))
        );
      });
    }

    return list;
  }, [historyData, filterReason, filterStatus, searchKeyword]);

  // Xuất Excel EX1: Dữ liệu đang lọc
  const handleExportEX1 = () => {
    if (filteredData.length === 0) return;
    const dateStr = moment().format("YYYYMMDD_HHmmss");
    SaveExcel(filteredData, `NS3_LichSuNghiPhep_DangLoc_${dateStr}`);
  };

  // Xuất Excel EX2: Toàn bộ dữ liệu
  const handleExportEX2 = () => {
    if (historyData.length === 0) return;
    const dateStr = moment().format("YYYYMMDD_HHmmss");
    SaveExcel(historyData, `NS3_LichSuNghiPhep_ToanThoiGian_${dateStr}`);
  };

  // Định nghĩa các cột AG-Grid High-Density cho Lịch Sử Nghỉ Phép
  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: "STT",
        width: 48,
        cellStyle: { textAlign: "center", color: "#64748b", fontWeight: 600, fontSize: "11px" },
      },
      {
        field: "OFF_ID",
        headerName: "MÃ ĐƠN",
        width: 95,
        cellRenderer: LeaveCodeCellRenderer,
      },
      {
        field: "DATE_COLUMN",
        headerName: "NGÀY NGHỈ",
        width: 100,
        cellRenderer: LeaveDateCellRenderer,
      },
      {
        field: "WEEKDAY",
        headerName: "THỨ",
        width: 75,
        cellRenderer: WeekdayCellRenderer,
      },
      {
        field: "REASON_NAME",
        headerName: "KIỂU NGHỈ",
        width: 130,
        cellRenderer: LeaveTypeBadgeCellRenderer,
      },
      {
        field: "CA_NGHI",
        headerName: "CA NGHỈ",
        width: 75,
        cellRenderer: LeaveShiftCellRenderer,
      },
      {
        field: "REMARK",
        headerName: "LÝ DO / BÀN GIAO",
        minWidth: 160,
        flex: 1,
        cellRenderer: DetailReasonCellRenderer,
      },
      {
        field: "REQUEST_DATE",
        headerName: "NGÀY LÀM ĐƠN",
        width: 105,
        cellRenderer: RequestDateCellRenderer,
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
              placeholder="Tìm mã đơn, ngày, lý do..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          <select
            className="type-select"
            value={filterReason}
            onChange={(e) => setFilterReason(e.target.value)}
            title="Lọc theo kiểu nghỉ"
          >
            <option value="all">Tất cả kiểu nghỉ</option>
            <option value="Phép năm">Phép năm</option>
            <option value="Nửa phép">Nửa phép</option>
            <option value="Việc riêng">Việc riêng</option>
            <option value="ốm">Nghỉ ốm (BHXH)</option>
            <option value="Chế độ">Chế độ</option>
          </select>

          <select
            className="type-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            title="Lọc theo trạng thái duyệt"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="approved">Đã duyệt</option>
            <option value="pending">Chờ duyệt</option>
            <option value="canceled">Đã hủy</option>
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
              title="Xuất toàn bộ lịch sử nghỉ phép ra Excel"
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
            Lịch sử nghỉ: <strong>{filteredData.length} / {historyData.length}</strong> đơn (Toàn thời gian)
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
