import React from "react";
import {
  FiCalendar,
  FiClock,
  FiSearch,
  FiCheckSquare,
  FiSquare,
  FiPieChart,
  FiGrid,
  FiLayers,
} from "react-icons/fi";
import { KpiOption, KpiViewTab } from "./useKpiNvSxData";

interface PrecisionKpiNvSxToolbarProps {
  fromDate: string;
  toDate: string;
  option: KpiOption;
  allTime: boolean;
  activeTab: KpiViewTab;
  isLoading: boolean;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onOptionChange: (val: KpiOption) => void;
  onAllTimeToggle: () => void;
  onTabChange: (tab: KpiViewTab) => void;
  onQuickDate: (days: number) => void;
  onLoadData: () => void;
}

const PrecisionKpiNvSxToolbar: React.FC<PrecisionKpiNvSxToolbarProps> = ({
  fromDate,
  toDate,
  option,
  allTime,
  activeTab,
  isLoading,
  onFromDateChange,
  onToDateChange,
  onOptionChange,
  onAllTimeToggle,
  onTabChange,
  onQuickDate,
  onLoadData,
}) => {
  return (
    <div className="precision-kpinvsx__toolbar">
      {/* Hàng 1: Bộ lọc ngày, tùy chọn chu kỳ, all-time và nút load data */}
      <div className="precision-kpinvsx__filterRow">
        <div className="filter-group filter-group--date">
          <div className="filter-item">
            <span className="filter-label">
              <FiCalendar size={12} />
              <span>Từ ngày:</span>
            </span>
            <input
              type="date"
              className="filter-input filter-input--date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              disabled={allTime}
            />
          </div>

          <div className="filter-item">
            <span className="filter-label">
              <FiCalendar size={12} />
              <span>Tới ngày:</span>
            </span>
            <input
              type="date"
              className="filter-input filter-input--date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              disabled={allTime}
            />
          </div>

          {/* Dải nút chọn nhanh ngày */}
          <div className="quick-date-group">
            <button
              type="button"
              className="quick-date-btn"
              onClick={() => onQuickDate(0)}
              title="Chọn hôm nay"
            >
              1D
            </button>
            <button
              type="button"
              className="quick-date-btn"
              onClick={() => onQuickDate(7)}
              title="7 ngày qua"
            >
              7D
            </button>
            <button
              type="button"
              className="quick-date-btn"
              onClick={() => onQuickDate(30)}
              title="30 ngày qua"
            >
              30D
            </button>
            <button
              type="button"
              className="quick-date-btn"
              onClick={() => onQuickDate(90)}
              title="90 ngày qua"
            >
              90D
            </button>
          </div>
        </div>

        <div className="filter-group filter-group--controls">
          {/* Dropdown chọn Option chu kỳ */}
          <div className="filter-item">
            <span className="filter-label">
              <FiClock size={12} />
              <span>Chu kỳ:</span>
            </span>
            <select
              className="filter-select"
              value={option}
              onChange={(e) => onOptionChange(e.target.value as KpiOption)}
            >
              <option value="Daily">Daily (Ngày)</option>
              <option value="Weekly">Weekly (Tuần)</option>
              <option value="Monthly">Monthly (Tháng)</option>
              <option value="Yearly">Yearly (Năm)</option>
            </select>
          </div>

          {/* Checkbox All Time */}
          <button
            type="button"
            className={`alltime-btn ${allTime ? "alltime-btn--active" : ""}`}
            onClick={onAllTimeToggle}
            title="Xem toàn bộ thời gian"
          >
            {allTime ? <FiCheckSquare size={13} /> : <FiSquare size={13} />}
            <span>Toàn Bộ (All Time)</span>
          </button>

          {/* Nút Load Data chính */}
          <button
            type="button"
            className="btn-load-data"
            onClick={onLoadData}
            disabled={isLoading}
          >
            <FiSearch size={13} />
            <span>{isLoading ? "Đang Tra Cứu..." : "Tải Dữ Liệu KPI"}</span>
          </button>
        </div>
      </div>

      {/* Hàng 2: Segmented View Switcher */}
      <div className="precision-kpinvsx__segmentedRow">
        <div className="segmented-control">
          <button
            type="button"
            className={`segmented-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => onTabChange("all")}
          >
            <FiLayers size={13} />
            <span>Xem Toàn Bộ (All)</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${activeTab === "charts" ? "active" : ""}`}
            onClick={() => onTabChange("charts")}
          >
            <FiPieChart size={13} />
            <span>Biểu Đồ & KPI</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${activeTab === "grid" ? "active" : ""}`}
            onClick={() => onTabChange("grid")}
          >
            <FiGrid size={13} />
            <span>Bảng Dữ Liệu Chi Tiết</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export { PrecisionKpiNvSxToolbar };
export default React.memo(PrecisionKpiNvSxToolbar);
