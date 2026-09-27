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
  FiClock,
  FiCheckSquare,
  FiSquare,
} from "react-icons/fi";
import { KpiOption, KpiViewTab } from "./useKpiNvSxData";

interface PrecisionKpiNvSxMobileToolbarProps {
  activeTab: KpiViewTab;
  onTabChange: (tab: KpiViewTab) => void;
  searchKeyword: string;
  onSearchChange: (kw: string) => void;
  option: KpiOption;
  allTime: boolean;
  onAllTimeToggle: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenFilterDrawer: () => void;
  onLoadData: () => void;
  activeFilterCount: number;
  filteredCount: number;
  totalCount: number;
  isLoading: boolean;
}

const PrecisionKpiNvSxMobileToolbar: React.FC<PrecisionKpiNvSxMobileToolbarProps> = ({
  activeTab,
  onTabChange,
  searchKeyword,
  onSearchChange,
  option,
  allTime,
  onAllTimeToggle,
  onExportEX1,
  onExportEX2,
  onOpenFilterDrawer,
  onLoadData,
  activeFilterCount,
  filteredCount,
  totalCount,
  isLoading,
}) => {
  return (
    <div className="precision-kpinvsx__mobileToolbar">
      {/* Hàng 1: Switcher chế độ hiển thị 3 tab */}
      <div className="mobile-toolbar-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === "grid" ? "active" : ""}`}
          onClick={() => onTabChange("grid")}
        >
          <FiGrid size={13} />
          <span>Bảng Dữ Liệu</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === "charts" ? "active" : ""}`}
          onClick={() => onTabChange("charts")}
        >
          <FiPieChart size={13} />
          <span>Biểu Đồ & KPI</span>
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

      {/* Hàng 2: Ô tìm kiếm thông minh + Nút Lọc + Nút Tải KPI */}
      <div className="mobile-toolbar-search-row">
        <div className="search-input-box">
          <FiSearch size={14} className="search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Tìm theo mã NV, ngày, tuần, tháng..."
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
              <FiX size={13} />
            </button>
          )}
        </div>

        <button
          type="button"
          className="btn-trigger-filter"
          onClick={onOpenFilterDrawer}
          title="Mở bộ lọc chu kỳ & thời gian"
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
          onClick={onLoadData}
          disabled={isLoading}
          title="Tải lại dữ liệu KPI"
        >
          <FiSearch size={13} />
          <span>{isLoading ? "Tải..." : "Tải"}</span>
        </button>
      </div>

      {/* Hàng 3: Dải nút thao tác & Quick Filter cuộn ngang */}
      <div className="mobile-toolbar-actions-scroll">
        {/* Quick Filter: Chu kỳ hiện tại */}
        <button
          type="button"
          className="action-pill action-pill--option"
          onClick={onOpenFilterDrawer}
          title="Thay đổi chu kỳ đánh giá KPI"
        >
          <FiClock size={12} />
          <span>Chu kỳ: <strong>{option}</strong></span>
        </button>

        {/* Quick Toggle: All-Time */}
        <button
          type="button"
          className={`action-pill ${allTime ? "active" : ""}`}
          onClick={onAllTimeToggle}
          title="Xem toàn bộ thời gian không giới hạn"
        >
          {allTime ? <FiCheckSquare size={12} /> : <FiSquare size={12} />}
          <span>{allTime ? "All-Time (Bật)" : "All-Time"}</span>
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
          title="Xuất toàn bộ dữ liệu KPI ra Excel"
        >
          <FiFileText size={12} />
          <span>EX2 (Tất cả)</span>
        </button>

        {/* Thống kê đếm */}
        <span className="counter-chip">
          {filteredCount}/{totalCount} dòng
        </span>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKpiNvSxMobileToolbar);
