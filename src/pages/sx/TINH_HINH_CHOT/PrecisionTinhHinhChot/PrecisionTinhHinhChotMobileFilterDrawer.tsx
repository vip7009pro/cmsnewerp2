import React from "react";
import moment from "moment";
import { ViewMode, StatusChotFilter, StatusHSFilter } from "./useTinhHinhChotData";
import { FiX, FiCheck, FiRotateCcw, FiCalendar } from "react-icons/fi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  statusChotFilter: StatusChotFilter;
  onStatusChotChange: (val: StatusChotFilter) => void;
  statusHSFilter: StatusHSFilter;
  onStatusHSChange: (val: StatusHSFilter) => void;
  dateFrom: string;
  setDateFrom: (val: string) => void;
  dateTo: string;
  setDateTo: (val: string) => void;
  onReset: () => void;
}

/**
 * Filter Drawer chuẩn Bottom Sheet Zero-Blur cho TINH_HINH_CHOT:
 * - Backdrop đặc rgba(15, 23, 42, 0.75) ZERO BLUR - bảo vệ GPU di động
 * - Lọc 4 nhóm nghiệp vụ: Nhà Máy, Trạng Thái Chốt, Trạng Thái Nhập HS, Khoảng Ngày
 * - Nút Đặt lại và nút Áp dụng
 */
export const PrecisionTinhHinhChotMobileFilterDrawer: React.FC<Props> = React.memo(
  ({
    isOpen,
    onClose,
    viewMode,
    onViewModeChange,
    statusChotFilter,
    onStatusChotChange,
    statusHSFilter,
    onStatusHSChange,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    onReset,
  }) => {
    if (!isOpen) return null;

    const handleSelectQuickDate = (days: number) => {
      const to = moment().format("YYYY-MM-DD");
      const from = moment().subtract(days - 1, "days").format("YYYY-MM-DD");
      setDateFrom(from);
      setDateTo(to);
    };

    return (
      <div className="precision-thc__drawerBackdrop" onClick={onClose}>
        <div
          className="precision-thc__drawerContent"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Drawer */}
          <div className="drawer-header">
            <div className="drawer-title-group">
              <span className="drawer-title">BỘ LỌC TÌNH HÌNH CHỐT BC</span>
              <span className="drawer-subtitle">Tùy biến điều kiện hiển thị</span>
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

          {/* Body Drawer Cuộn */}
          <div className="drawer-body">
            {/* Nhóm 1: Nhà Máy */}
            <div className="filter-group">
              <label className="group-label">1. Nhà Máy Hiển Thị</label>
              <div className="pill-grid">
                <button
                  type="button"
                  className={`pill-btn ${viewMode === "NM1" ? "active" : ""}`}
                  onClick={() => onViewModeChange("NM1")}
                >
                  Nhà Máy 1 (NM1)
                </button>
                <button
                  type="button"
                  className={`pill-btn ${viewMode === "NM2" ? "active" : ""}`}
                  onClick={() => onViewModeChange("NM2")}
                >
                  Nhà Máy 2 (NM2)
                </button>
                <button
                  type="button"
                  className={`pill-btn ${viewMode === "SPLIT" ? "active" : ""}`}
                  onClick={() => onViewModeChange("SPLIT")}
                >
                  Cả 2 Nhà Máy (Song Song)
                </button>
              </div>
            </div>

            {/* Nhóm 2: Trạng Thái Chốt Báo Cáo */}
            <div className="filter-group">
              <label className="group-label">2. Tình Trạng Chốt Báo Cáo</label>
              <div className="pill-grid">
                <button
                  type="button"
                  className={`pill-btn ${statusChotFilter === "ALL" ? "active" : ""}`}
                  onClick={() => onStatusChotChange("ALL")}
                >
                  Tất cả trạng thái
                </button>
                <button
                  type="button"
                  className={`pill-btn pill-btn--warning ${
                    statusChotFilter === "CHUA_CHOT" ? "active" : ""
                  }`}
                  onClick={() => onStatusChotChange("CHUA_CHOT")}
                >
                  ⚠️ Còn lệnh chưa chốt ({">"}0)
                </button>
                <button
                  type="button"
                  className={`pill-btn pill-btn--success ${
                    statusChotFilter === "DA_CHOT" ? "active" : ""
                  }`}
                  onClick={() => onStatusChotChange("DA_CHOT")}
                >
                  ✅ Đã chốt hoàn tất (100%)
                </button>
              </div>
            </div>

            {/* Nhóm 3: Trạng Thái Nhập Hiệu Suất */}
            <div className="filter-group">
              <label className="group-label">3. Tình Trạng Nhập Hiệu Suất</label>
              <div className="pill-grid">
                <button
                  type="button"
                  className={`pill-btn ${statusHSFilter === "ALL" ? "active" : ""}`}
                  onClick={() => onStatusHSChange("ALL")}
                >
                  Tất cả hiệu suất
                </button>
                <button
                  type="button"
                  className={`pill-btn pill-btn--amber ${
                    statusHSFilter === "CHUA_HS" ? "active" : ""
                  }`}
                  onClick={() => onStatusHSChange("CHUA_HS")}
                >
                  ⏳ Còn lệnh chưa nhập HS
                </button>
                <button
                  type="button"
                  className={`pill-btn pill-btn--cyan ${
                    statusHSFilter === "DA_HS" ? "active" : ""
                  }`}
                  onClick={() => onStatusHSChange("DA_HS")}
                >
                  🎯 Đã nhập đủ hiệu suất
                </button>
              </div>
            </div>

            {/* Nhóm 4: Khoảng Thời Gian Sản Xuất */}
            <div className="filter-group">
              <label className="group-label">
                <FiCalendar style={{ marginRight: 4 }} />
                4. Khoảng Ngày Sản Xuất (SX_DATE)
              </label>
              <div className="date-inputs-row">
                <div className="date-field">
                  <span className="field-hint">Từ ngày</span>
                  <input
                    type="date"
                    className="date-input"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <span className="date-sep">➜</span>
                <div className="date-field">
                  <span className="field-hint">Đến ngày</span>
                  <input
                    type="date"
                    className="date-input"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>

              {/* Nút chọn nhanh ngày */}
              <div className="quick-dates-row">
                <button
                  type="button"
                  className="quick-date-btn"
                  onClick={() => handleSelectQuickDate(1)}
                >
                  Hôm nay
                </button>
                <button
                  type="button"
                  className="quick-date-btn"
                  onClick={() => handleSelectQuickDate(7)}
                >
                  7 ngày
                </button>
                <button
                  type="button"
                  className="quick-date-btn"
                  onClick={() => handleSelectQuickDate(30)}
                >
                  30 ngày
                </button>
                {(dateFrom || dateTo) && (
                  <button
                    type="button"
                    className="quick-date-btn clear-date"
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                    }}
                  >
                    Xóa ngày
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Footer Drawer */}
          <div className="drawer-footer">
            <button
              type="button"
              className="btn-drawer-reset"
              onClick={onReset}
            >
              <FiRotateCcw size={14} />
              <span>Đặt lại</span>
            </button>
            <button
              type="button"
              className="btn-drawer-apply"
              onClick={onClose}
            >
              <FiCheck size={16} />
              <span>Áp dụng bộ lọc</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

PrecisionTinhHinhChotMobileFilterDrawer.displayName = "PrecisionTinhHinhChotMobileFilterDrawer";
export default PrecisionTinhHinhChotMobileFilterDrawer;
