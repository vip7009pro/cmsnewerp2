import React from "react";
import { ViewMode, XuongFilter } from "./useBtpAutoData";
import { BiSearch } from "react-icons/bi";
import { FiFilter, FiX, FiBox } from "react-icons/fi";
import { AiOutlineDownload } from "react-icons/ai";

interface Props {
  searchKeyword: string;
  setSearchKeyword: (val: string) => void;
  viewMode: ViewMode;
  onSwitchMode: (mode: ViewMode) => void;
  onOpenFilter: () => void;
  activeFilterCount: number;
  filterXuong: XuongFilter;
  onSelectXuong: (x: XuongFilter) => void;
  onlyPositive: boolean;
  onToggleOnlyPositive: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenGiaoNhan: () => void;
  filteredCount: number;
  totalCount: number;
  isLoading: boolean;
}

/**
 * Mobile Toolbar 2 Hàng Công Thái Học cho BTP_AUTO:
 * - Hàng 1: Ô Search 14px chống zoom Safari + Clear button [X] + Nút Lọc (Badge) + Switch Detail/Summary
 * - Hàng 2: Dải thao tác cuộn ngang (Quick filter Xưởng, Toggle Tồn > 0, Xuất EX1/EX2, QLGN, Bộ đếm)
 */
export const PrecisionBtpAutoMobileToolbar: React.FC<Props> = React.memo(
  ({
    searchKeyword,
    setSearchKeyword,
    viewMode,
    onSwitchMode,
    onOpenFilter,
    activeFilterCount,
    filterXuong,
    onSelectXuong,
    onlyPositive,
    onToggleOnlyPositive,
    onExportEX1,
    onExportEX2,
    onOpenGiaoNhan,
    filteredCount,
    totalCount,
    isLoading,
  }) => {
    return (
      <div className="precision-btpauto__mobileToolbar">
        {/* ===== HÀNG 1: SEARCH + FILTER BUTTON + SEGMENTED SWITCH ===== */}
        <div className="mobile-toolbar-row-top">
          {/* Ô tìm kiếm thông minh */}
          <div className="mobile-search-box">
            <BiSearch className="search-icon" size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm G_CODE, G_NAME, LOT..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            {searchKeyword && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchKeyword("")}
                title="Xóa tìm kiếm"
              >
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Nút Mở Filter Drawer */}
          <button
            type="button"
            className={`btn-mobile-filter ${activeFilterCount > 0 ? "has-filters" : ""}`}
            onClick={onOpenFilter}
            title="Mở bộ lọc nâng cao"
          >
            <FiFilter size={15} />
            <span className="btn-text">LỌC</span>
            {activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
          </button>

          {/* Segmented Switch Mini (Detail / Summary) */}
          <div className="mini-segmented-switch">
            <button
              type="button"
              className={`mini-seg-btn ${viewMode === "detail" ? "active" : ""}`}
              onClick={() => onSwitchMode("detail")}
              disabled={isLoading}
              title="Xem bảng chi tiết lot"
            >
              Detail
            </button>
            <button
              type="button"
              className={`mini-seg-btn ${viewMode === "summary" ? "active" : ""}`}
              onClick={() => onSwitchMode("summary")}
              disabled={isLoading}
              title="Xem tổng hợp mã hàng"
            >
              Summary
            </button>
          </div>
        </div>

        {/* ===== HÀNG 2: ACTION CHIPS CUỘN NGANG ===== */}
        <div className="mobile-toolbar-row-actions">
          {/* Nhóm chip chọn xưởng nhanh */}
          <div className="action-chip-group">
            <button
              type="button"
              className={`quick-chip ${filterXuong === "ALL" ? "active" : ""}`}
              onClick={() => onSelectXuong("ALL")}
            >
              Tất cả
            </button>
            <button
              type="button"
              className={`quick-chip ${filterXuong === "A" ? "active" : ""}`}
              onClick={() => onSelectXuong("A")}
            >
              Xưởng A
            </button>
            <button
              type="button"
              className={`quick-chip ${filterXuong === "B" ? "active" : ""}`}
              onClick={() => onSelectXuong("B")}
            >
              Xưởng B
            </button>
          </div>

          <div className="action-sep" />

          {/* Chip toggle Tồn > 0 */}
          <button
            type="button"
            className={`quick-chip quick-chip--stock ${onlyPositive ? "active" : ""}`}
            onClick={onToggleOnlyPositive}
            title="Chỉ hiển thị các dòng có tồn kho"
          >
            {onlyPositive ? "✓ Tồn > 0" : "Tồn > 0"}
          </button>

          <div className="action-sep" />

          {/* Nhóm nút xuất Excel */}
          <div className="action-excel-group">
            <button
              type="button"
              className="btn-mini-export btn-mini-export--ex1"
              onClick={onExportEX1}
              title="Xuất dữ liệu đang lọc"
            >
              <AiOutlineDownload size={13} />
              <span>EX1</span>
            </button>
            <button
              type="button"
              className="btn-mini-export btn-mini-export--ex2"
              onClick={onExportEX2}
              title="Xuất toàn bộ dữ liệu"
            >
              <AiOutlineDownload size={13} />
              <span>EX2</span>
            </button>
          </div>

          <div className="action-sep" />

          {/* Nút QLGN */}
          <button
            type="button"
            className="btn-mini-gn"
            onClick={onOpenGiaoNhan}
            title="Quản lý giao nhận Dao/Film"
          >
            <FiBox size={13} />
            <span>QLGN</span>
          </button>

          {/* Bộ đếm dữ liệu */}
          <div className="mobile-row-counter">
            <span>
              <strong>{filteredCount}</strong>/{totalCount}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

PrecisionBtpAutoMobileToolbar.displayName = "PrecisionBtpAutoMobileToolbar";
export default PrecisionBtpAutoMobileToolbar;
