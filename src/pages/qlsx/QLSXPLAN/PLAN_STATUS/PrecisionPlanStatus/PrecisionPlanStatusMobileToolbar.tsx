import React from "react";
import {
  FiSearch,
  FiX,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiClock,
  FiBarChart2,
  FiRotateCcw,
} from "react-icons/fi";
import { MdViewAgenda, MdTableChart } from "react-icons/md";
import { FaSyncAlt } from "react-icons/fa";

interface PrecisionPlanStatusMobileToolbarProps {
  quickSearch: string;
  onQuickSearchChange: (val: string) => void;
  onClearSearch: () => void;
  onSearch: () => void;
  loading: boolean;
  viewMode: "cards" | "table";
  onViewModeChange: (mode: "cards" | "table") => void;
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
  totalRecords: number;
  filteredRecords: number;
  alltime: boolean;
  onAllTimeChange: (val: boolean) => void;
  autoRefreshInterval: number;
  onToggleAutoRefresh: () => void;
  onRefresh: () => void;
  onExportExcel: () => void;
  onReset: () => void;
  showKpiSummary: boolean;
  onToggleKpiSummary: () => void;
}

export const PrecisionPlanStatusMobileToolbar: React.FC<
  PrecisionPlanStatusMobileToolbarProps
> = React.memo(({
  quickSearch,
  onQuickSearchChange,
  onClearSearch,
  onSearch,
  loading,
  viewMode,
  onViewModeChange,
  onOpenFilterDrawer,
  activeFilterCount,
  totalRecords,
  filteredRecords,
  alltime,
  onAllTimeChange,
  autoRefreshInterval,
  onToggleAutoRefresh,
  onRefresh,
  onExportExcel,
  onReset,
  showKpiSummary,
  onToggleKpiSummary,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const getAutoRefreshText = () => {
    if (autoRefreshInterval === 0) return "Tự làm mới: Tắt";
    return `Tự động: ${autoRefreshInterval}s`;
  };

  return (
    <div className="precision-plan-status-mobile-toolbar">
      {/* HÀNG 1: Ô TÌM KIẾM NHANH + SWITCH VIEW + NÚT TRA CỨU + NÚT BỘ LỌC */}
      <div className="mobile-toolbar-row mobile-toolbar-row--search">
        {/* Search Input Box */}
        <div className="mobile-search-box">
          <FiSearch size={15} className="mobile-search-icon" />
          <input
            type="text"
            className="mobile-search-input"
            placeholder="Tìm chỉ thị, YCSX, mã hàng, máy..."
            value={quickSearch}
            onChange={(e) => onQuickSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {quickSearch.length > 0 && (
            <button
              type="button"
              className="mobile-search-clear"
              onClick={onClearSearch}
              title="Xóa tìm kiếm"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        {/* Nút Chuyển Chế Độ Xem (Thẻ / Bảng) */}
        <button
          type="button"
          className="tb-btn tb-btn--view-mode"
          onClick={() => onViewModeChange(viewMode === "cards" ? "table" : "cards")}
          title={viewMode === "cards" ? "Chuyển sang chế độ Bảng Grid" : "Chuyển sang chế độ Luồng Thẻ"}
        >
          {viewMode === "cards" ? (
            <>
              <MdTableChart size={15} />
              <span>Bảng</span>
            </>
          ) : (
            <>
              <MdViewAgenda size={15} />
              <span>Thẻ</span>
            </>
          )}
        </button>

        {/* Nút Tra Cứu Tiến Độ */}
        <button
          type="button"
          className="tb-btn tb-btn--query"
          onClick={onSearch}
          disabled={loading}
          title="Tra cứu trạng thái tiến độ chỉ thị sản xuất"
        >
          {loading ? (
            <FiRefreshCw size={13} className="spin-animation" />
          ) : (
            <FiSearch size={14} />
          )}
          <span>Tra Cứu</span>
        </button>

        {/* Nút Mở Bottom Sheet Filter Drawer */}
        <button
          type="button"
          className={`tb-btn tb-btn--filter ${
            activeFilterCount > 0 ? "tb-btn--filter-active" : ""
          }`}
          onClick={onOpenFilterDrawer}
          title="Mở bộ lọc nâng cao"
        >
          <FiFilter size={14} />
          <span>Lọc</span>
          {activeFilterCount > 0 && (
            <span className="filter-badge-count">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* HÀNG 2: DẢI NÚT HÀNH ĐỘNG CUỘN NGANG CÔNG THÁI HỌC */}
      <div className="mobile-toolbar-row mobile-toolbar-row--actions">
        {/* Thống kê số lượng */}
        <div
          className="mobile-stats-chip"
          title="Số lượng chỉ thị đang hiển thị / Tổng số chỉ thị"
        >
          <span>Hiện:</span>
          <strong>{filteredRecords}</strong>
          <span>/</span>
          <span>{totalRecords} CT</span>
        </div>

        {/* Chip Toggle All Time */}
        <label
          className={`mobile-chip-toggle ${
            alltime ? "mobile-chip-toggle--active" : ""
          }`}
          title="Tra cứu toàn bộ thời gian (không giới hạn ngày)"
        >
          <FiClock size={12} />
          <input
            type="checkbox"
            checked={alltime}
            onChange={(e) => onAllTimeChange(e.target.checked)}
          />
          <span>All Time</span>
        </label>

        {/* Chip Tự Động Làm Mới */}
        <button
          type="button"
          className={`mobile-chip-toggle ${
            autoRefreshInterval > 0 ? "mobile-chip-toggle--active" : ""
          }`}
          onClick={onToggleAutoRefresh}
          title="Bật/Tắt chu kỳ tự động tải lại dữ liệu"
        >
          <FaSyncAlt size={10} className={autoRefreshInterval > 0 ? "spin-slow" : ""} />
          <span>{getAutoRefreshText()}</span>
        </button>

        {/* Nút Tải Lại Ngay */}
        <button
          type="button"
          className="tb-btn tb-btn--neutral"
          onClick={onRefresh}
          disabled={loading}
          title="Làm mới dữ liệu ngay lập tức"
        >
          <FiRefreshCw size={12} className={loading ? "spin-animation" : ""} />
          <span>Làm mới</span>
        </button>

        {/* Nút Toggle Mini KPI */}
        <button
          type="button"
          className={`tb-btn tb-btn--summary ${
            showKpiSummary ? "tb-btn--summary-active" : ""
          }`}
          onClick={onToggleKpiSummary}
          title="Hiện/Ẩn tóm tắt các chỉ số KPI sản xuất"
        >
          <FiBarChart2 size={13} />
          <span>Tóm Tắt KPI</span>
        </button>

        {/* Nút Xuất Excel */}
        <button
          type="button"
          className="tb-btn tb-btn--excel"
          onClick={onExportExcel}
          disabled={totalRecords === 0}
          title="Xuất Excel danh sách trạng thái chỉ thị"
        >
          <FiDownload size={13} />
          <span>Xuất Excel</span>
        </button>

        {/* Nút Reset bộ lọc */}
        <button
          type="button"
          className="tb-btn tb-btn--neutral"
          onClick={onReset}
          title="Khôi phục bộ lọc mặc định"
        >
          <FiRotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
});

export default PrecisionPlanStatusMobileToolbar;
