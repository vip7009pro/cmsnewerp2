import React from "react";
import {
  FiSearch,
  FiX,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiClock,
  FiBarChart2,
  FiEye,
  FiEyeOff,
  FiLayers,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { Assignment, ListAlt } from "@mui/icons-material";

interface PrecisionDataSxMobileToolbarProps {
  quickSearchText: string;
  onQuickSearchChange: (val: string) => void;
  onClearSearch: () => void;
  onLoadChiThi: () => void;
  onLoadYcsx: () => void;
  activeMode: boolean; // true = Chỉ thị, false = YCSX
  loading: boolean;
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
  totalRecords: number;
  filteredRecords: number;
  allTime: boolean;
  onAllTimeChange: (val: boolean) => void;
  truSample: boolean;
  onTruSampleChange: (val: boolean) => void;
  fullSummary: boolean;
  onFullSummaryChange: (val: boolean) => void;
  showLossSummary: boolean;
  onToggleLossSummary: () => void;
  onOpenPivot: () => void;
  showhideDailyYCSX: boolean;
  onToggleDetailYCSX: () => void;
  onExportExcel: () => void;
  onReset: () => void;
}

export const PrecisionDataSxMobileToolbar: React.FC<
  PrecisionDataSxMobileToolbarProps
> = React.memo(({
  quickSearchText,
  onQuickSearchChange,
  onClearSearch,
  onLoadChiThi,
  onLoadYcsx,
  activeMode,
  loading,
  onOpenFilterDrawer,
  activeFilterCount,
  totalRecords,
  filteredRecords,
  allTime,
  onAllTimeChange,
  truSample,
  onTruSampleChange,
  fullSummary,
  onFullSummaryChange,
  showLossSummary,
  onToggleLossSummary,
  onOpenPivot,
  showhideDailyYCSX,
  onToggleDetailYCSX,
  onExportExcel,
  onReset,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (activeMode) {
        onLoadChiThi();
      } else {
        onLoadYcsx();
      }
    }
  };

  return (
    <div className="precision-datasx-mobile-toolbar">
      {/* HÀNG 1: Ô TÌM KIẾM NHANH + TRA CHỈ THỊ + TRA YCSX + BỘ LỌC */}
      <div className="mobile-toolbar-row mobile-toolbar-row--search">
        {/* Search Input Box */}
        <div className="mobile-search-box">
          <FiSearch size={15} className="mobile-search-icon" />
          <input
            type="text"
            className="mobile-search-input"
            placeholder="Tìm mã YCSX, chỉ thị, liệu, code..."
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

        {/* Nút Tra Chỉ Thị */}
        <button
          type="button"
          className={`tb-btn tb-btn--chithi ${activeMode ? "is-active" : ""}`}
          onClick={onLoadChiThi}
          disabled={loading}
          title="Tra cứu dữ liệu Chỉ Thị sản xuất"
        >
          {loading && activeMode ? (
            <FiRefreshCw size={13} className="spin-animation" />
          ) : (
            <Assignment sx={{ fontSize: 15 }} />
          )}
          <span>Chỉ Thị</span>
        </button>

        {/* Nút Tra YCSX */}
        <button
          type="button"
          className={`tb-btn tb-btn--ycsx ${!activeMode ? "is-active" : ""}`}
          onClick={onLoadYcsx}
          disabled={loading}
          title="Tra cứu dữ liệu theo YCSX"
        >
          {loading && !activeMode ? (
            <FiRefreshCw size={13} className="spin-animation" />
          ) : (
            <ListAlt sx={{ fontSize: 15 }} />
          )}
          <span>YCSX</span>
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
          <span>{activeMode ? "CT:" : "YC:"}</span>
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

        {/* Chip Toggle Trừ Sample */}
        <label
          className={`mobile-chip-toggle ${
            truSample ? "mobile-chip-toggle--active" : ""
          }`}
          title="Tự động trừ lượng Sample sản xuất"
        >
          <input
            type="checkbox"
            checked={truSample}
            onChange={(e) => onTruSampleChange(e.target.checked)}
          />
          <span>Trừ Sample</span>
        </label>

        {/* Chip Toggle Full Summary */}
        <label
          className={`mobile-chip-toggle ${
            fullSummary ? "mobile-chip-toggle--active" : ""
          }`}
          title="Bật/Tắt xem chi tiết toàn bộ các cột hao hụt"
        >
          <input
            type="checkbox"
            checked={fullSummary}
            onChange={(e) => onFullSummaryChange(e.target.checked)}
          />
          <span>Full Summary</span>
        </label>

        {/* Nút Toggle Bảng Hao Hụt */}
        <button
          type="button"
          className={`tb-btn tb-btn--summary ${
            showLossSummary ? "tb-btn--summary-active" : ""
          }`}
          onClick={onToggleLossSummary}
          title="Hiện/Ẩn bảng tổng hợp sản lượng & hao hụt"
        >
          <FiBarChart2 size={13} />
          <span>Bảng Hao Hụt</span>
          {showLossSummary ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
        </button>

        {/* Nút Mở Pivot Table Modal */}
        <button
          type="button"
          className="tb-btn tb-btn--pivot"
          onClick={onOpenPivot}
          title="Mở phân tích Pivot Table đa chiều"
        >
          <FiLayers size={13} />
          <span>Pivot Table</span>
        </button>

        {/* Nút Toggle Chi Tiết YCSX (chỉ khi ở chế độ YCSX) */}
        {!activeMode && (
          <button
            type="button"
            className={`tb-btn tb-btn--detail ${
              showhideDailyYCSX ? "tb-btn--detail-active" : ""
            }`}
            onClick={onToggleDetailYCSX}
            title="Hiện/Ẩn chi tiết tiến độ theo ngày và tracking YCSX"
          >
            {showhideDailyYCSX ? <FiEyeOff size={13} /> : <FiEye size={13} />}
            <span>{showhideDailyYCSX ? "Ẩn Chi Tiết" : "Hiện Chi Tiết"}</span>
          </button>
        )}

        {/* Nút Xuất Excel */}
        <button
          type="button"
          className="tb-btn tb-btn--excel"
          onClick={onExportExcel}
          title="Xuất Excel danh sách dữ liệu hiện tại"
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
});

export default PrecisionDataSxMobileToolbar;
