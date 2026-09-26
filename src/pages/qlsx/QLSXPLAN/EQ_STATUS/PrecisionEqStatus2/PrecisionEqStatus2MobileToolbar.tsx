import React from "react";
import { FiSearch, FiX, FiFilter, FiRotateCcw } from "react-icons/fi";

interface PrecisionEqStatus2MobileToolbarProps {
  searchString: string;
  onSearchChange: (val: string) => void;
  onClearSearch: () => void;
  factoryFilter: string;
  onFactoryChange: (fac: string) => void;
  isCmsCompany: boolean;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  activeFilter: string;
  onActiveFilterChange: (act: string) => void;
  activeFilterCount: number;
  onOpenFilterDrawer: () => void;
  onResetAllFilters: () => void;
}

export const PrecisionEqStatus2MobileToolbar: React.FC<
  PrecisionEqStatus2MobileToolbarProps
> = React.memo(({
  searchString,
  onSearchChange,
  onClearSearch,
  factoryFilter,
  onFactoryChange,
  isCmsCompany,
  statusFilter,
  onStatusFilterChange,
  activeFilter,
  onActiveFilterChange,
  activeFilterCount,
  onOpenFilterDrawer,
  onResetAllFilters,
}) => {
  return (
    <div className="eqs2_mobile_toolbar">
      {/* HÀNG 1: Ô Tìm Kiếm Thông Minh & Nút Mở Bộ Lọc */}
      <div className="eqs2_toolbar_row eqs2_toolbar_row--main">
        <div className="eqs2_search_input_wrap">
          <FiSearch className="search-icon" size={16} />
          <input
            type="text"
            className="eqs2_search_input"
            placeholder="Tìm theo sản phẩm, plan, mã máy..."
            value={searchString}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchString && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={onClearSearch}
              title="Xóa tìm kiếm"
            >
              <FiX size={15} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`btn-filter-trigger ${activeFilterCount > 0 ? "has-filter" : ""}`}
          onClick={onOpenFilterDrawer}
        >
          <FiFilter size={15} />
          <span>Bộ Lọc</span>
          {activeFilterCount > 0 && (
            <span className="filter-badge">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* HÀNG 2: Dải Cuộn Ngang Thao Tác & Lọc Nhanh */}
      <div className="eqs2_toolbar_row eqs2_toolbar_row--scroll">
        {/* Switcher Phân Xưởng */}
        <div className="eqs2_segmented_control">
          <button
            type="button"
            className={`seg-btn ${factoryFilter === "ALL" ? "is-active" : ""}`}
            onClick={() => onFactoryChange("ALL")}
          >
            Tất cả
          </button>
          <button
            type="button"
            className={`seg-btn ${factoryFilter === "NM1" ? "is-active" : ""}`}
            onClick={() => onFactoryChange("NM1")}
          >
            NM1
          </button>
          {isCmsCompany && (
            <button
              type="button"
              className={`seg-btn ${factoryFilter === "NM2" ? "is-active" : ""}`}
              onClick={() => onFactoryChange("NM2")}
            >
              NM2
            </button>
          )}
        </div>

        <span className="scroll-divider" />

        {/* Quick Filter: Trạng Thái Vận Hành */}
        <button
          type="button"
          className={`quick-chip ${statusFilter === "ALL" ? "is-active" : ""}`}
          onClick={() => onStatusFilterChange("ALL")}
        >
          Tất cả TT
        </button>
        <button
          type="button"
          className={`quick-chip chip-run ${statusFilter === "MASS" ? "is-active" : ""}`}
          onClick={() => onStatusFilterChange(statusFilter === "MASS" ? "ALL" : "MASS")}
        >
          <span className="dot dot-run" />
          Chạy
        </button>
        <button
          type="button"
          className={`quick-chip chip-set ${statusFilter === "SETTING" ? "is-active" : ""}`}
          onClick={() => onStatusFilterChange(statusFilter === "SETTING" ? "ALL" : "SETTING")}
        >
          <span className="dot dot-set" />
          Setting
        </button>
        <button
          type="button"
          className={`quick-chip chip-stop ${statusFilter === "STOP" ? "is-active" : ""}`}
          onClick={() => onStatusFilterChange(statusFilter === "STOP" ? "ALL" : "STOP")}
        >
          <span className="dot dot-stop" />
          Dừng
        </button>

        <span className="scroll-divider" />

        {/* Quick Filter: Thiết Bị OK / NG */}
        <button
          type="button"
          className={`quick-chip ${activeFilter === "OK" ? "is-active" : ""}`}
          onClick={() => onActiveFilterChange(activeFilter === "OK" ? "ALL" : "OK")}
        >
          Máy OK
        </button>
        <button
          type="button"
          className={`quick-chip chip-ng ${activeFilter === "NG" ? "is-active" : ""}`}
          onClick={() => onActiveFilterChange(activeFilter === "NG" ? "ALL" : "NG")}
        >
          Máy NG
        </button>

        {/* Nút Reset Bộ Lọc Nhanh */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            className="btn-quick-reset"
            onClick={onResetAllFilters}
            title="Đặt lại toàn bộ bộ lọc"
          >
            <FiRotateCcw size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
});

export default PrecisionEqStatus2MobileToolbar;
