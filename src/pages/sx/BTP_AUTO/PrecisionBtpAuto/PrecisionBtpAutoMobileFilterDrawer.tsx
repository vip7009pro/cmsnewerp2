import React from "react";
import { ViewMode, XuongFilter } from "./useBtpAutoData";
import { FiFilter, FiX, FiCheck, FiRotateCcw } from "react-icons/fi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  viewMode: ViewMode;
  onSwitchMode: (mode: ViewMode) => void;
  filterXuong: XuongFilter;
  setFilterXuong: (x: XuongFilter) => void;
  filterFactory: string;
  setFilterFactory: (f: string) => void;
  factoryList: string[];
  onlyPositive: boolean;
  setOnlyPositive: (v: boolean) => void;
  onApply: () => void;
  onReset: () => void;
}

/**
 * Mobile Filter Drawer (Bottom Sheet) cho BTP_AUTO:
 * - Chuẩn Zero-blur GPU-Friendly với nền tối đặc rgba(15, 23, 42, 0.75)
 * - 4 Nhóm điều khiển: Chế độ, Phân xưởng, Nhà máy, Tồn kho
 * - Nút Đặt lại và Áp dụng (Xác nhận)
 */
export const PrecisionBtpAutoMobileFilterDrawer: React.FC<Props> = React.memo(
  ({
    isOpen,
    onClose,
    viewMode,
    onSwitchMode,
    filterXuong,
    setFilterXuong,
    filterFactory,
    setFilterFactory,
    factoryList,
    onlyPositive,
    setOnlyPositive,
    onApply,
    onReset,
  }) => {
    if (!isOpen) return null;

    return (
      <div className="precision-btpauto__filterDrawerOverlay" onClick={onClose}>
        <div
          className="precision-btpauto__filterDrawerSheet"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="drawer-header">
            <div className="drawer-header-left">
              <div className="drawer-icon-wrap">
                <FiFilter size={16} />
              </div>
              <div className="drawer-title-group">
                <span className="drawer-title">Bộ Lọc Dữ Liệu BTP</span>
                <span className="drawer-subtitle">
                  Tùy chỉnh tiêu chí tra cứu kho bán thành phẩm
                </span>
              </div>
            </div>
            <button
              type="button"
              className="drawer-close-btn"
              onClick={onClose}
              title="Đóng bộ lọc"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Body Form Controls */}
          <div className="drawer-body">
            {/* Nhóm 1: Chế Độ Dữ Liệu */}
            <div className="filter-group">
              <label className="filter-label">1. Chế Độ Dữ Liệu</label>
              <div className="filter-options-grid">
                <button
                  type="button"
                  className={`filter-option-btn ${
                    viewMode === "detail" ? "active" : ""
                  }`}
                  onClick={() => onSwitchMode("detail")}
                >
                  📋 Chi Tiết Lot
                </button>
                <button
                  type="button"
                  className={`filter-option-btn ${
                    viewMode === "summary" ? "active" : ""
                  }`}
                  onClick={() => onSwitchMode("summary")}
                >
                  📊 Tổng Hợp Mã
                </button>
              </div>
            </div>

            {/* Nhóm 2: Phân Xưởng */}
            <div className="filter-group">
              <label className="filter-label">2. Phân Xưởng Sản Xuất</label>
              <div className="filter-options-grid filter-options-grid--3">
                <button
                  type="button"
                  className={`filter-option-btn ${
                    filterXuong === "ALL" ? "active" : ""
                  }`}
                  onClick={() => setFilterXuong("ALL")}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  className={`filter-option-btn ${
                    filterXuong === "A" ? "active" : ""
                  }`}
                  onClick={() => setFilterXuong("A")}
                >
                  🏭 Xưởng A
                </button>
                <button
                  type="button"
                  className={`filter-option-btn ${
                    filterXuong === "B" ? "active" : ""
                  }`}
                  onClick={() => setFilterXuong("B")}
                >
                  🏗️ Xưởng B
                </button>
              </div>
            </div>

            {/* Nhóm 3: Nhà Máy */}
            <div className="filter-group">
              <label className="filter-label">3. Nhà Máy</label>
              <div className="filter-select-wrapper">
                <select
                  className="filter-select"
                  value={filterFactory}
                  onChange={(e) => setFilterFactory(e.target.value)}
                >
                  {factoryList.map((f) => (
                    <option key={f} value={f}>
                      {f === "ALL" ? "Tất cả nhà máy" : `Nhà máy ${f}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nhóm 4: Tồn Kho */}
            <div className="filter-group">
              <label className="filter-label">4. Tình Trạng Tồn Kho</label>
              <div className="filter-options-grid">
                <button
                  type="button"
                  className={`filter-option-btn ${!onlyPositive ? "active" : ""}`}
                  onClick={() => setOnlyPositive(false)}
                >
                  Tất cả dòng
                </button>
                <button
                  type="button"
                  className={`filter-option-btn ${onlyPositive ? "active" : ""}`}
                  onClick={() => setOnlyPositive(true)}
                >
                  📦 Chỉ Tồn &gt; 0
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="drawer-footer">
            <button
              type="button"
              className="drawer-btn drawer-btn--reset"
              onClick={onReset}
            >
              <FiRotateCcw size={15} />
              <span>Đặt lại</span>
            </button>
            <button
              type="button"
              className="drawer-btn drawer-btn--apply"
              onClick={onApply}
            >
              <FiCheck size={16} />
              <span>Áp dụng</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

PrecisionBtpAutoMobileFilterDrawer.displayName =
  "PrecisionBtpAutoMobileFilterDrawer";
export default PrecisionBtpAutoMobileFilterDrawer;
