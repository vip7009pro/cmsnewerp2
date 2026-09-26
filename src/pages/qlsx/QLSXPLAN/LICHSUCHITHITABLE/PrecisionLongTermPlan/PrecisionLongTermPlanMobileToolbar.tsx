import React from "react";
import {
  FiSearch,
  FiX,
  FiFilter,
  FiArrowRight,
  FiTrash2,
  FiDownload,
  FiCheckSquare,
  FiActivity,
  FiRefreshCw,
} from "react-icons/fi";

interface PrecisionLongTermPlanMobileToolbarProps {
  quickSearchText: string;
  onQuickSearchChange: (val: string) => void;
  onClearSearch: () => void;
  onSearch: () => void;
  isLoading: boolean;
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
  onMovePlan: () => void;
  onDeletePlan: () => void;
  onExportExcel: () => void;
  onClearSelection: () => void;
  totalPlans: number;
  filteredPlans: number;
  showCapa: boolean;
  onToggleCapa: () => void;
}

const PrecisionLongTermPlanMobileToolbar: React.FC<
  PrecisionLongTermPlanMobileToolbarProps
> = ({
  quickSearchText,
  onQuickSearchChange,
  onClearSearch,
  onSearch,
  isLoading,
  onOpenFilterDrawer,
  activeFilterCount,
  onMovePlan,
  onDeletePlan,
  onExportExcel,
  onClearSelection,
  totalPlans,
  filteredPlans,
  showCapa,
  onToggleCapa,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="precision-longterm-mobile-toolbar">
      {/* HÀNG 1: Ô TÌM KIẾM NHANH + NÚT TRA PLAN + NÚT BỘ LỌC */}
      <div className="mobile-toolbar-row mobile-toolbar-row--search">
        {/* Search Input Box */}
        <div className="mobile-search-box">
          <FiSearch size={15} className="mobile-search-icon" />
          <input
            type="text"
            className="mobile-search-input"
            placeholder="Tìm mã G_CODE, G_NAME, máy..."
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

        {/* Nút Tra Cứu PLAN */}
        <button
          type="button"
          className="tb-btn tb-btn--primary btn-tra-plan"
          onClick={onSearch}
          disabled={isLoading}
          title="Tra cứu kế hoạch 16 ngày"
        >
          {isLoading ? (
            <FiRefreshCw size={13} className="spin-animation" />
          ) : (
            <FiSearch size={13} />
          )}
          <span>{isLoading ? "..." : "Tra PLAN"}</span>
        </button>

        {/* Nút Mở Floating Filter Drawer */}
        <button
          type="button"
          className={`tb-btn tb-btn--filter ${activeFilterCount > 0 ? "tb-btn--filter-active" : ""}`}
          onClick={onOpenFilterDrawer}
          title="Mở bộ lọc kế hoạch"
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
        <div className="mobile-stats-chip" title="Số lượng lệnh hiển thị / Tổng số lệnh">
          <span>Hiện:</span>
          <strong>{filteredPlans}</strong>
          <span>/</span>
          <span>{totalPlans}</span>
        </div>

        {/* Nút MOVE PLAN */}
        <button
          type="button"
          className="tb-btn tb-btn--warning"
          onClick={onMovePlan}
          title="Dời các kế hoạch đã chọn sang ngày MOVE TO"
        >
          <FiArrowRight size={13} />
          <span>MOVE PLAN</span>
        </button>

        {/* Nút DELETE PLAN */}
        <button
          type="button"
          className="tb-btn tb-btn--danger"
          onClick={onDeletePlan}
          title="Xóa các kế hoạch đã chọn"
        >
          <FiTrash2 size={13} />
          <span>DELETE</span>
        </button>

        {/* Nút SAVE Excel */}
        <button
          type="button"
          className="tb-btn tb-btn--excel"
          onClick={onExportExcel}
          title="Xuất Excel bảng kế hoạch đang hiển thị"
        >
          <FiDownload size={13} />
          <span>Xuất Excel</span>
        </button>

        {/* Nút Bỏ Chọn */}
        <button
          type="button"
          className="tb-btn tb-btn--neutral"
          onClick={onClearSelection}
          title="Bỏ chọn tất cả dòng"
        >
          <FiCheckSquare size={13} />
          <span>Bỏ chọn</span>
        </button>

        {/* Nút Toggle Biểu Đồ Capa */}
        <button
          type="button"
          className={`tb-btn tb-btn--capa ${showCapa ? "tb-btn--capa-active" : ""}`}
          onClick={onToggleCapa}
          title={showCapa ? "Ẩn biểu đồ năng lực máy" : "Xem biểu đồ năng lực máy (Capa Analytics)"}
        >
          <FiActivity size={13} />
          <span>{showCapa ? "Ẩn Biểu Đồ" : "Biểu Đồ Capa"}</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionLongTermPlanMobileToolbar);
