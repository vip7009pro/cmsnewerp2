import React from "react";
import { ViewMode, StatusChotFilter, StatusHSFilter } from "./useTinhHinhChotData";
import { BiSearch } from "react-icons/bi";
import { FiFilter, FiX } from "react-icons/fi";
import { AiOutlineDownload } from "react-icons/ai";

interface Props {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchValue: string;
  onSearchChange: (val: string) => void;
  onOpenFilter: () => void;
  activeFilterCount: number;
  statusChotFilter: StatusChotFilter;
  onToggleChotFilter: (val: StatusChotFilter) => void;
  statusHSFilter: StatusHSFilter;
  onToggleHSFilter: (val: StatusHSFilter) => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onRefreshCurrent: () => void;
  isLoading: boolean;
  currentDataLength: number;
  totalDataLength: number;
}

/**
 * Mobile Toolbar 2 Hàng Công Thái Học cho TINH_HINH_CHOT:
 * - Hàng 1: Ô Search 14px chống zoom Safari + Nút Clear [X] + Nút Lọc (Badge) + Segmented Tab [NM1 | NM2 | Song Song]
 * - Hàng 2: Dải thao tác cuộn ngang (Quick filter chip Chưa chốt / Chưa nhập HS, Xuất EX1/EX2, Nút Reload, Bộ đếm ngày)
 */
export const PrecisionTinhHinhChotMobileToolbar: React.FC<Props> = React.memo(
  ({
    viewMode,
    onViewModeChange,
    searchValue,
    onSearchChange,
    onOpenFilter,
    activeFilterCount,
    statusChotFilter,
    onToggleChotFilter,
    statusHSFilter,
    onToggleHSFilter,
    onExportEX1,
    onExportEX2,
    onRefreshCurrent,
    isLoading,
    currentDataLength,
    totalDataLength,
  }) => {
    return (
      <div className="precision-thc__mobileToolbar">
        {/* ===== HÀNG 1: SEARCH + FILTER BUTTON + SEGMENTED SWITCH ===== */}
        <div className="mobile-toolbar-row-top">
          {/* Ô tìm kiếm thông minh */}
          <div className="mobile-search-box">
            <BiSearch className="search-icon" size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm ngày, số lượng..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchValue && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => onSearchChange("")}
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

          {/* Segmented Switch Mini chọn nhà máy */}
          <div className="mini-segmented-switch">
            <button
              type="button"
              className={`mini-seg-btn ${viewMode === "NM1" ? "active" : ""}`}
              onClick={() => onViewModeChange("NM1")}
              title="Chỉ hiển thị Nhà Máy 1"
            >
              NM1
            </button>
            <button
              type="button"
              className={`mini-seg-btn ${viewMode === "NM2" ? "active" : ""}`}
              onClick={() => onViewModeChange("NM2")}
              title="Chỉ hiển thị Nhà Máy 2"
            >
              NM2
            </button>
            <button
              type="button"
              className={`mini-seg-btn ${viewMode === "SPLIT" ? "active" : ""}`}
              onClick={() => onViewModeChange("SPLIT")}
              title="Xem cả 2 nhà máy"
            >
              2 NM
            </button>
          </div>
        </div>

        {/* ===== HÀNG 2: DẢI THAO TÁC CUỘN NGANG ===== */}
        <div className="mobile-toolbar-row-bottom">
          {/* Chip Quick Filter: Tất cả */}
          <button
            type="button"
            className={`quick-filter-chip ${
              statusChotFilter === "ALL" && statusHSFilter === "ALL" ? "active" : ""
            }`}
            onClick={() => {
              onToggleChotFilter("ALL");
              onToggleHSFilter("ALL");
            }}
          >
            Tất cả
          </button>

          {/* Chip Quick Filter: Chưa Chốt */}
          <button
            type="button"
            className={`quick-filter-chip chip--warning ${
              statusChotFilter === "CHUA_CHOT" ? "active" : ""
            }`}
            onClick={() =>
              onToggleChotFilter(statusChotFilter === "CHUA_CHOT" ? "ALL" : "CHUA_CHOT")
            }
          >
            Chưa chốt
          </button>

          {/* Chip Quick Filter: Chưa Nhập HS */}
          <button
            type="button"
            className={`quick-filter-chip chip--amber ${
              statusHSFilter === "CHUA_HS" ? "active" : ""
            }`}
            onClick={() =>
              onToggleHSFilter(statusHSFilter === "CHUA_HS" ? "ALL" : "CHUA_HS")
            }
          >
            Chưa nhập HS
          </button>

          <span className="scroll-divider" />

          {/* Nút Xuất Excel EX1 (Dữ liệu đang lọc) */}
          <button
            type="button"
            className="btn-toolbar-chip btn-toolbar-chip--excel"
            onClick={onExportEX1}
            title="Xuất Excel dữ liệu đang lọc"
          >
            <AiOutlineDownload size={13} />
            <span>EX1</span>
          </button>

          {/* Nút Xuất Excel EX2 (Toàn bộ) */}
          <button
            type="button"
            className="btn-toolbar-chip btn-toolbar-chip--excel-all"
            onClick={onExportEX2}
            title="Xuất toàn bộ dữ liệu ra Excel"
          >
            <AiOutlineDownload size={13} />
            <span>EX2</span>
          </button>

          {/* Nút Tải lại */}
          <button
            type="button"
            className="btn-toolbar-chip btn-toolbar-chip--reload"
            onClick={onRefreshCurrent}
            disabled={isLoading}
            title="Tải lại dữ liệu nhà máy"
          >
            <span className={`material-symbols-outlined reload-icon ${isLoading ? "spinning" : ""}`}>
              sync
            </span>
            <span>Reload</span>
          </button>

          {/* Bộ đếm dữ liệu */}
          <span className="telemetry-count">
            {currentDataLength} / {totalDataLength} ngày
          </span>
        </div>
      </div>
    );
  }
);

PrecisionTinhHinhChotMobileToolbar.displayName = "PrecisionTinhHinhChotMobileToolbar";
export default PrecisionTinhHinhChotMobileToolbar;
