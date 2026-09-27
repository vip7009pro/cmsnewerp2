import React from "react";
import {
  FiSearch,
  FiX,
  FiFilter,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiLock,
  FiClock,
  FiFileText,
} from "react-icons/fi";

interface PrecisionBLOCKMobileToolbarProps {
  quickFilterText: string;
  setQuickFilterText: (v: string) => void;
  onSearch: () => void;
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
  onlyPending: boolean;
  onToggleOnlyPending: () => void;
  onSetPass: (val: string) => void;
  onSetClose: (val: string) => void;
  onUpdateNCR: () => void;
  onExportExcel: (type: "EX1" | "EX2") => void;
  selectedCount: number;
  totalCount: number;
}

export const PrecisionBLOCKMobileToolbar: React.FC<PrecisionBLOCKMobileToolbarProps> = ({
  quickFilterText,
  setQuickFilterText,
  onSearch,
  onOpenFilterDrawer,
  activeFilterCount,
  onlyPending,
  onToggleOnlyPending,
  onSetPass,
  onSetClose,
  onUpdateNCR,
  onExportExcel,
  selectedCount,
  totalCount,
}) => {
  return (
    <div className="precision-block-mobile-toolbar">
      {/* Hàng 1: Ô Search nhanh (14px chống zoom iOS) + Nút Tìm + Nút Bộ Lọc */}
      <div className="toolbar-search-row">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" size={14} />
          <input
            type="text"
            className="search-input"
            placeholder="Lọc nhanh Lot, Code, Defect..."
            value={quickFilterText}
            onChange={(e) => setQuickFilterText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
          />
          {quickFilterText && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => setQuickFilterText("")}
              title="Xóa tìm kiếm"
            >
              <FiX size={12} />
            </button>
          )}
        </div>

        <button
          type="button"
          className="btn-search-trigger"
          onClick={onSearch}
          title="Tra cứu dữ liệu Blocking"
        >
          <FiSearch size={13} />
          <span>Tra Data</span>
        </button>

        <button
          type="button"
          className={`btn-filter-trigger ${activeFilterCount > 0 ? "has-filters" : ""}`}
          onClick={onOpenFilterDrawer}
          title="Mở bộ lọc nâng cao"
        >
          <FiFilter size={13} />
          <span>Lọc</span>
          {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
        </button>
      </div>

      {/* Hàng 2: Dải chips thao tác cuộn ngang công thái học */}
      <div className="toolbar-chips-scroll">
        {/* Toggle Lọc Pending nhanh */}
        <button
          type="button"
          className={`chip-btn ${onlyPending ? "chip-btn--active-pending" : ""}`}
          onClick={onToggleOnlyPending}
          title="Bật/Tắt chỉ lọc lô PENDING"
        >
          <span>Pending: {onlyPending ? "BẬT" : "TẤT CẢ"}</span>
        </button>

        {/* Thao tác Phê Duyệt */}
        <button
          type="button"
          className="chip-btn chip-btn--pass"
          onClick={() => onSetPass("Y")}
          title="SET PASS cho dòng đã chọn"
        >
          <FiCheckCircle size={11} />
          <span>PASS</span>
        </button>

        <button
          type="button"
          className="chip-btn chip-btn--fail"
          onClick={() => onSetPass("N")}
          title="SET FAIL cho dòng đã chọn"
        >
          <FiXCircle size={11} />
          <span>FAIL</span>
        </button>

        <button
          type="button"
          className="chip-btn chip-btn--ncr"
          onClick={onUpdateNCR}
          title="Cập nhật NCR ID cho dòng đã chọn"
        >
          <FiRefreshCw size={11} />
          <span>NCR</span>
        </button>

        <button
          type="button"
          className="chip-btn chip-btn--closed"
          onClick={() => onSetClose("C")}
          title="Chuyển trạng thái sang CLOSED"
        >
          <FiLock size={11} />
          <span>Closed</span>
        </button>

        <button
          type="button"
          className="chip-btn chip-btn--pending"
          onClick={() => onSetClose("P")}
          title="Chuyển trạng thái sang PENDING"
        >
          <FiClock size={11} />
          <span>Pending</span>
        </button>

        {/* Xuất Excel */}
        <button
          type="button"
          className="chip-btn chip-btn--excel"
          onClick={() => onExportExcel("EX1")}
          title="Xuất Excel dòng chọn/lọc"
        >
          <FiFileText size={11} />
          <span>EX1</span>
        </button>

        <button
          type="button"
          className="chip-btn chip-btn--excel"
          onClick={() => onExportExcel("EX2")}
          title="Xuất Excel toàn bộ"
        >
          <FiFileText size={11} />
          <span>EX2</span>
        </button>

        {/* Counter Badge */}
        <div className="chip-counter">
          {selectedCount > 0 ? (
            <span className="selected-text">{selectedCount} đã chọn</span>
          ) : (
            <span>{totalCount} dòng</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrecisionBLOCKMobileToolbar;
