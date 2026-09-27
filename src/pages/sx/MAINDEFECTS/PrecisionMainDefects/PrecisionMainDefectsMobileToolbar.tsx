import React from "react";
import {
  FiFilter,
  FiSearch,
  FiPieChart,
  FiGrid,
  FiLayers,
  FiX,
  FiDownload,
  FiFileText,
  FiCamera,
  FiCheckCircle,
} from "react-icons/fi";

interface PrecisionMainDefectsMobileToolbarProps {
  activeTab: "all" | "charts" | "grid";
  onTabChange: (tab: "all" | "charts" | "grid") => void;
  quickSearch: string;
  onQuickSearchChange: (kw: string) => void;
  imageYn: string;
  onImageYnChange: (val: string) => void;
  useYn: string;
  onUseYnChange: (val: string) => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenFilterDrawer: () => void;
  onSearch: () => void;
  activeFilterCount: number;
  filteredCount: number;
  totalCount: number;
}

const PrecisionMainDefectsMobileToolbar: React.FC<PrecisionMainDefectsMobileToolbarProps> = ({
  activeTab,
  onTabChange,
  quickSearch,
  onQuickSearchChange,
  imageYn,
  onImageYnChange,
  useYn,
  onUseYnChange,
  onExportEX1,
  onExportEX2,
  onOpenFilterDrawer,
  onSearch,
  activeFilterCount,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="precision-maindefects__mobileToolbar">
      {/* Hàng 1: Switcher chế độ hiển thị 3 tab */}
      <div className="mobile-toolbar-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === "grid" ? "active" : ""}`}
          onClick={() => onTabChange("grid")}
        >
          <FiGrid size={13} />
          <span>Bảng Tiêu Chuẩn</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === "charts" ? "active" : ""}`}
          onClick={() => onTabChange("charts")}
        >
          <FiPieChart size={13} />
          <span>Biểu Đồ Recharts</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => onTabChange("all")}
        >
          <FiLayers size={13} />
          <span>Tất Cả</span>
        </button>
      </div>

      {/* Hàng 2: Ô tìm kiếm thông minh + Nút Lọc + Nút Tải */}
      <div className="mobile-toolbar-search-row">
        <div className="search-input-box">
          <FiSearch size={14} className="search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Tìm mã lỗi, G_CODE, Model, Test..."
            value={quickSearch}
            onChange={(e) => onQuickSearchChange(e.target.value)}
          />
          {quickSearch && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onQuickSearchChange("")}
              title="Xóa tìm kiếm"
            >
              <FiX size={13} />
            </button>
          )}
        </div>

        <button
          type="button"
          className="btn-trigger-filter"
          onClick={onOpenFilterDrawer}
          title="Mở bộ lọc nâng cao"
        >
          <FiFilter size={13} />
          <span>Bộ Lọc</span>
          {activeFilterCount > 0 && (
            <span className="badge-count">{activeFilterCount}</span>
          )}
        </button>

        <button
          type="button"
          className="btn-trigger-search"
          onClick={onSearch}
          title="Tải lại dữ liệu"
        >
          <FiSearch size={13} />
          <span>Tải</span>
        </button>
      </div>

      {/* Hàng 3: Dải nút thao tác & Quick Filter cuộn ngang */}
      <div className="mobile-toolbar-actions-scroll">
        {/* Quick Filter: Có hình ảnh */}
        <button
          type="button"
          className={`action-pill ${imageYn === "YES" ? "active" : ""}`}
          onClick={() => onImageYnChange(imageYn === "YES" ? "All" : "YES")}
          title="Lọc nhanh chỉ tiêu chuẩn có hình ảnh"
        >
          <FiCamera size={12} />
          <span>{imageYn === "YES" ? "Có Ảnh (Bật)" : "Có Ảnh"}</span>
        </button>

        {/* Quick Filter: Đang áp dụng USE_YN */}
        <button
          type="button"
          className={`action-pill ${useYn === "Y" ? "active" : ""}`}
          onClick={() => onUseYnChange(useYn === "Y" ? "All" : "Y")}
          title="Lọc nhanh chỉ tiêu chuẩn đang áp dụng (USE_YN = Y)"
        >
          <FiCheckCircle size={12} />
          <span>{useYn === "Y" ? "Áp Dụng (Bật)" : "Đang Áp Dụng"}</span>
        </button>

        {/* Xuất file EX1 */}
        <button
          type="button"
          className="action-pill action-pill--excel"
          onClick={onExportEX1}
          title="Xuất danh sách đang lọc ra Excel"
        >
          <FiDownload size={12} />
          <span>EX1 (Lọc)</span>
        </button>

        {/* Xuất file EX2 */}
        <button
          type="button"
          className="action-pill action-pill--excel"
          onClick={onExportEX2}
          title="Xuất toàn bộ tiêu chuẩn ra Excel"
        >
          <FiFileText size={12} />
          <span>EX2 (Tất cả)</span>
        </button>

        {/* Thống kê đếm */}
        <span className="counter-chip">
          {filteredCount}/{totalCount} lỗi
        </span>
      </div>
    </div>
  );
};

export default React.memo(PrecisionMainDefectsMobileToolbar);
