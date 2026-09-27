import React from "react";
import { FiSearch, FiX, FiFilter, FiList, FiGrid, FiTablet } from "react-icons/fi";
import { PatrolFilterLane, PatrolLayoutMode, PatrolKpiStats } from "./usePatrolData";

interface PrecisionPatrolMobileToolbarProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  filterLane: PatrolFilterLane;
  onFilterLaneChange: (lane: PatrolFilterLane) => void;
  layoutView: PatrolLayoutMode;
  onLayoutChange: (mode: PatrolLayoutMode) => void;
  kpis: PatrolKpiStats;
  filteredCount: number;
  activeFilterCount: number;
  onOpenFilterDrawer: () => void;
}

export const PrecisionPatrolMobileToolbar: React.FC<PrecisionPatrolMobileToolbarProps> = ({
  searchText,
  onSearchChange,
  filterLane,
  onFilterLaneChange,
  layoutView,
  onLayoutChange,
  kpis,
  filteredCount,
  activeFilterCount,
  onOpenFilterDrawer,
}) => {
  return (
    <div className="precision-patrol-mobile-toolbar">
      {/* Hàng 1: Ô tìm kiếm thông minh & nút Bộ Lọc */}
      <div className="toolbar-search-row">
        <div className="search-box">
          <FiSearch className="search-icon" size={15} />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm theo sản phẩm, lỗi, máy, mã NV..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchText && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => onSearchChange("")}
              title="Xóa nội dung tìm kiếm"
            >
              <FiX size={13} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`btn-filter-trigger ${activeFilterCount > 0 ? "has-filter" : ""}`}
          onClick={onOpenFilterDrawer}
          title="Mở bộ lọc ngày & phân hệ"
        >
          <FiFilter size={14} />
          <span>Lọc</span>
          {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
        </button>
      </div>

      {/* Hàng 2: Dải chip lọc phân hệ & chế độ xem cuộn ngang */}
      <div className="toolbar-chips-row">
        <div className="chips-scroll">
          {/* Chip Tất cả */}
          <button
            type="button"
            className={`filter-chip ${filterLane === "ALL" ? "active" : ""}`}
            onClick={() => onFilterLaneChange("ALL")}
          >
            Tất Cả ({kpis.totalIncidents})
          </button>

          {/* Chip PQC3 */}
          <button
            type="button"
            className={`filter-chip chip-pqc ${filterLane === "PQC3" ? "active" : ""}`}
            onClick={() => onFilterLaneChange("PQC3")}
          >
            PQC3 ({kpis.pqcCount})
          </button>

          {/* Chip DTC */}
          <button
            type="button"
            className={`filter-chip chip-dtc ${filterLane === "DTC" ? "active" : ""}`}
            onClick={() => onFilterLaneChange("DTC")}
          >
            DTC ({kpis.dtcCount})
          </button>

          {/* Chip INS */}
          <button
            type="button"
            className={`filter-chip chip-ins ${filterLane === "INS" ? "active" : ""}`}
            onClick={() => onFilterLaneChange("INS")}
          >
            INS ({kpis.insCount})
          </button>

          <span className="chips-divider" />

          {/* Nút chuyển chế độ xem: GRID / LANES */}
          <div className="view-mode-toggle">
            <button
              type="button"
              className={`mode-btn ${layoutView === "GRID" ? "active" : ""}`}
              onClick={() => onLayoutChange("GRID")}
              title="Chế độ lướt dọc trực quan (Grid)"
            >
              <FiGrid size={12} />
              <span>Dọc</span>
            </button>
            <button
              type="button"
              className={`mode-btn ${layoutView === "LANES" ? "active" : ""}`}
              onClick={() => onLayoutChange("LANES")}
              title="Chế độ hàng ngang phân hệ (Lanes)"
            >
              <FiList size={12} />
              <span>Ngang</span>
            </button>
          </div>

          <span className="count-tag">
            {filteredCount}/{kpis.totalIncidents} thẻ
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPatrolMobileToolbar);
