import React from "react";
import {
  FiSearch,
  FiX,
  FiFilter,
  FiRefreshCw,
  FiLayers,
  FiPieChart,
  FiTrendingUp,
  FiUnlock,
  FiLock,
  FiFileText,
  FiDownload,
  FiAlertTriangle,
  FiShoppingBag,
  FiClock,
} from "react-icons/fi";

interface PrecisionTinhLieuMobileToolbarProps {
  formData: {
    FROM_DATE: string;
    TO_DATE: string;
    ALLTIME: boolean;
    SHORTAGE_ONLY: boolean;
    NEWPO: boolean;
  };
  onFormChange: (keyname: string, value: any) => void;
  currentMode: "DETAIL" | "SUMMARY" | "PLAN";
  onLoadMRP: (mode: "DETAIL" | "SUMMARY" | "PLAN") => void;
  onLockMaterial: () => void;
  onUnLockMaterial: () => void;
  selectedYCSXCount: number;
  company: string;
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  activeFilterCount: number;
  onOpenFilterDrawer: () => void;
}

const PrecisionTinhLieuMobileToolbar: React.FC<PrecisionTinhLieuMobileToolbarProps> = ({
  formData,
  onFormChange,
  currentMode,
  onLoadMRP,
  onLockMaterial,
  onUnLockMaterial,
  selectedYCSXCount,
  company,
  searchKeyword,
  onSearchChange,
  onExportEX1,
  onExportEX2,
  activeFilterCount,
  onOpenFilterDrawer,
}) => {
  return (
    <div className="precision-tinhlieu__mobileToolbar">
      {/* Hàng 1: Search input thông minh + Nút Lọc + Nút Reload */}
      <div className="mobile-toolbar-search-row">
        <div className="search-input-box">
          <FiSearch size={15} className="search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Tìm mã VL, tên VL, PO, YCSX..."
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchKeyword && (
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

        <button
          type="button"
          className={`btn-trigger-filter ${activeFilterCount > 0 ? "active" : ""}`}
          onClick={onOpenFilterDrawer}
          title="Mở bộ lọc MRP nâng cao"
        >
          <FiFilter size={14} />
          <span>Lọc</span>
          {activeFilterCount > 0 && <span className="badge-count">{activeFilterCount}</span>}
        </button>

        <button
          type="button"
          className="btn-trigger-reload"
          onClick={() => onLoadMRP(currentMode)}
          title="Tải lại dữ liệu"
        >
          <FiRefreshCw size={14} />
        </button>
      </div>

      {/* Hàng 2: Segmented Mode Switcher (Chi Tiết / Tổng Hợp / Kế Hoạch) */}
      <div className="mobile-toolbar-mode-row">
        <button
          type="button"
          className={`mode-btn ${currentMode === "DETAIL" ? "active active--blue" : ""}`}
          onClick={() => onLoadMRP("DETAIL")}
        >
          <FiLayers size={13} />
          <span>Chi Tiết (Detail)</span>
        </button>

        <button
          type="button"
          className={`mode-btn ${currentMode === "SUMMARY" ? "active active--purple" : ""}`}
          onClick={() => onLoadMRP("SUMMARY")}
        >
          <FiPieChart size={13} />
          <span>Tổng Hợp (Summary)</span>
        </button>

        {company === "CMS" && (
          <button
            type="button"
            className={`mode-btn ${currentMode === "PLAN" ? "active active--emerald" : ""}`}
            onClick={() => onLoadMRP("PLAN")}
          >
            <FiTrendingUp size={13} />
            <span>Kế Hoạch (15D)</span>
          </button>
        )}
      </div>

      {/* Hàng 3: Dải Pills Lọc Nhanh & Tiện Ích Hành Động Cuộn Ngang */}
      <div className="mobile-toolbar-actions-scroll">
        {/* Quick Filter: Chỉ Liệu Thiếu */}
        <button
          type="button"
          className={`action-pill ${formData.SHORTAGE_ONLY ? "active active--warning" : ""}`}
          onClick={() => onFormChange("SHORTAGE_ONLY", !formData.SHORTAGE_ONLY)}
          title="Chỉ hiển thị các vật liệu thiếu hụt"
        >
          <FiAlertTriangle size={12} />
          <span>{formData.SHORTAGE_ONLY ? "Chỉ Liệu Thiếu ✓" : "Chỉ Liệu Thiếu"}</span>
        </button>

        {/* Quick Filter: Chỉ PO Mới */}
        <button
          type="button"
          className={`action-pill ${formData.NEWPO ? "active" : ""}`}
          onClick={() => onFormChange("NEWPO", !formData.NEWPO)}
          title="Chỉ hiển thị cho PO mới"
        >
          <FiShoppingBag size={12} />
          <span>{formData.NEWPO ? "Chỉ PO Mới ✓" : "Chỉ PO Mới"}</span>
        </button>

        {/* Quick Filter: Toàn Bộ Thời Gian */}
        <button
          type="button"
          className={`action-pill ${formData.ALLTIME ? "active" : ""}`}
          onClick={() => onFormChange("ALLTIME", !formData.ALLTIME)}
          title="Tra cứu toàn bộ thời gian"
        >
          <FiClock size={12} />
          <span>{formData.ALLTIME ? "Tất Cả Ngày ✓" : "Tất Cả Ngày"}</span>
        </button>

        <div className="pill-divider" />

        {/* Thao tác Mở Liệu */}
        {(company === "CMS" || company === "PVN") && (
          <>
            <button
              type="button"
              className={`action-pill action-pill--unlock ${selectedYCSXCount > 0 ? "has-selection" : ""}`}
              onClick={onUnLockMaterial}
              title={
                selectedYCSXCount > 0
                  ? `Mở liệu cho ${selectedYCSXCount} YCSX đã chọn`
                  : "Chọn YCSX trên bảng để mở liệu"
              }
            >
              <FiUnlock size={12} />
              <span>Mở Liệu</span>
              {selectedYCSXCount > 0 && <span className="selection-badge">{selectedYCSXCount}</span>}
            </button>

            <button
              type="button"
              className={`action-pill action-pill--lock ${selectedYCSXCount > 0 ? "has-selection" : ""}`}
              onClick={onLockMaterial}
              title={
                selectedYCSXCount > 0
                  ? `Khóa liệu cho ${selectedYCSXCount} YCSX đã chọn`
                  : "Chọn YCSX trên bảng để khóa liệu"
              }
            >
              <FiLock size={12} />
              <span>Khóa Liệu</span>
              {selectedYCSXCount > 0 && <span className="selection-badge">{selectedYCSXCount}</span>}
            </button>

            <div className="pill-divider" />
          </>
        )}

        {/* Export EX1 */}
        <button
          type="button"
          className="action-pill action-pill--export"
          onClick={onExportEX1}
          title="Xuất Excel các dòng đang lọc"
        >
          <FiFileText size={12} />
          <span>EX1 (Lọc)</span>
        </button>

        {/* Export EX2 */}
        <button
          type="button"
          className="action-pill action-pill--export"
          onClick={onExportEX2}
          title="Xuất Excel toàn bộ kết quả"
        >
          <FiDownload size={12} />
          <span>EX2 (Tất Cả)</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionTinhLieuMobileToolbar);
