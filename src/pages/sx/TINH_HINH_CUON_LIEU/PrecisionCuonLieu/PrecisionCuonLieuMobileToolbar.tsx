import React from "react";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaFileExcel,
  FaTable,
  FaCalendarDay,
  FaCalendarWeek,
} from "react-icons/fa";

interface PrecisionCuonLieuMobileToolbarProps {
  quickSearchText: string;
  onQuickSearchChange: (text: string) => void;
  onOpenFilter: () => void;
  activeFilterCount: number;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  dailyGraph: boolean;
  onToggleDailyWeekly: (isDaily: boolean) => void;
  totalRows: number;
  filteredRows: number;
}

export const PrecisionCuonLieuMobileToolbar: React.FC<
  PrecisionCuonLieuMobileToolbarProps
> = ({
  quickSearchText,
  onQuickSearchChange,
  onOpenFilter,
  activeFilterCount,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  dailyGraph,
  onToggleDailyWeekly,
  totalRows,
  filteredRows,
}) => {
  return (
    <div className="precision-cuonlieu-mobile-toolbar">
      {/* Hàng 1: Ô Search Thông Minh 14px chống zoom + Nút Mở Bộ Lọc */}
      <div className="toolbar-search-row">
        <div className="mobile-search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="mobile-search-input"
            placeholder="Lọc nhanh (Lot, Mã hàng, Tên liệu, YCSX...)"
            value={quickSearchText}
            onChange={(e) => onQuickSearchChange(e.target.value)}
          />
          {quickSearchText && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => onQuickSearchChange("")}
              title="Xóa tìm kiếm"
            >
              <FaTimes size={11} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`btn-mobile-filter-trigger ${
            activeFilterCount > 0 ? "btn-mobile-filter-trigger--active" : ""
          }`}
          onClick={onOpenFilter}
          title="Mở bảng lọc điều kiện nâng cao"
        >
          <FaFilter size={12} />
          <span>Bộ Lọc</span>
          {activeFilterCount > 0 && (
            <span className="filter-count-badge">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Hàng 2: Dải Nút Thao Tác Cuộn Ngang Công Thái Học */}
      <div className="toolbar-actions-scroll">
        {/* Nút Xuất Excel EX1 */}
        <button
          type="button"
          className="btn-mobile-action btn-mobile-action--excel"
          onClick={onExportEX1}
          title="Xuất Excel danh sách đang hiển thị"
        >
          <FaFileExcel size={11} />
          <span>EX1 (Lọc)</span>
        </button>

        {/* Nút Xuất Excel EX2 */}
        <button
          type="button"
          className="btn-mobile-action btn-mobile-action--excel-all"
          onClick={onExportEX2}
          title="Xuất Excel toàn bộ dữ liệu cuộn liệu"
        >
          <FaFileExcel size={11} />
          <span>EX2 (Tất cả)</span>
        </button>

        {/* Nút Mở Pivot Table */}
        <button
          type="button"
          className="btn-mobile-action btn-mobile-action--pivot"
          onClick={onOpenPivot}
          title="Mở phân tích Pivot Table"
        >
          <FaTable size={11} />
          <span>PIVOT</span>
        </button>

        {/* Nút Chuyển đổi Biểu đồ Ngày / Tuần */}
        <button
          type="button"
          className="btn-mobile-action btn-mobile-action--chart-mode"
          onClick={() => onToggleDailyWeekly(!dailyGraph)}
          title={`Chuyển chế độ biểu đồ: Hiện tại đang ${dailyGraph ? "Theo Ngày" : "Theo Tuần"}`}
        >
          {dailyGraph ? <FaCalendarDay size={11} /> : <FaCalendarWeek size={11} />}
          <span>{dailyGraph ? "BĐ: Ngày" : "BĐ: Tuần"}</span>
        </button>

        {/* Badge Số Dòng */}
        <span className="mobile-rows-count">
          <strong>{filteredRows.toLocaleString("en-US")}</strong> / {totalRows.toLocaleString("en-US")} cuộn
        </span>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCuonLieuMobileToolbar);
