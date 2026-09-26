import React from "react";
import {
  FiSearch,
  FiX,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiClock,
} from "react-icons/fi";

interface PrecisionLichSuInputLieuMobileToolbarProps {
  quickSearchText: string;
  onQuickSearchChange: (val: string) => void;
  onClearSearch: () => void;
  onSearch: () => void;
  isLoading: boolean;
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
  allTime: boolean;
  onAllTimeChange: (val: boolean) => void;
  onExportExcel: () => void;
  onReset: () => void;
  totalRecords: number;
  filteredRecords: number;
}

const PrecisionLichSuInputLieuMobileToolbar: React.FC<
  PrecisionLichSuInputLieuMobileToolbarProps
> = ({
  quickSearchText,
  onQuickSearchChange,
  onClearSearch,
  onSearch,
  isLoading,
  onOpenFilterDrawer,
  activeFilterCount,
  allTime,
  onAllTimeChange,
  onExportExcel,
  onReset,
  totalRecords,
  filteredRecords,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="precision-inputlieu-mobile-toolbar">
      {/* HÀNG 1: Ô TÌM KIẾM NHANH + NÚT TRA CỨU + NÚT BỘ LỌC */}
      <div className="mobile-toolbar-row mobile-toolbar-row--search">
        {/* Search Input Box */}
        <div className="mobile-search-box">
          <FiSearch size={15} className="mobile-search-icon" />
          <input
            type="text"
            className="mobile-search-input"
            placeholder="Tìm mã YCSX, PLAN, liệu, lot..."
            value={quickSearchText}
            onChange={(e) => onQuickSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {quickSearchText.length > 0 && (
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

        {/* Nút Tra Cứu Lịch Sử Cấp Liệu */}
        <button
          type="button"
          className="tb-btn tb-btn--primary btn-tra-lieu"
          onClick={onSearch}
          disabled={isLoading}
          title="Tra cứu lịch sử cấp liệu"
        >
          {isLoading ? (
            <FiRefreshCw size={13} className="spin-animation" />
          ) : (
            <FiSearch size={13} />
          )}
          <span>{isLoading ? "..." : "Tra Lịch Sử"}</span>
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
          title="Số lượng bản ghi đang lọc / Tổng số bản ghi"
        >
          <span>Hiện:</span>
          <strong>{filteredRecords}</strong>
          <span>/</span>
          <span>{totalRecords}</span>
        </div>

        {/* Chip Toggle All Time */}
        <label
          className={`mobile-chip-toggle ${
            allTime ? "mobile-chip-toggle--active" : ""
          }`}
          title="Tra cứu toàn bộ thời gian (không giới hạn ngày)"
        >
          <FiClock size={12} />
          <input
            type="checkbox"
            checked={allTime}
            onChange={(e) => onAllTimeChange(e.target.checked)}
          />
          <span>All Time</span>
        </label>

        {/* Nút SAVE Excel */}
        <button
          type="button"
          className="tb-btn tb-btn--excel"
          onClick={onExportExcel}
          title="Xuất Excel danh sách cấp liệu đang lọc"
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
          <FiRefreshCw size={12} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionLichSuInputLieuMobileToolbar);
