import React from "react";
import { FiSearch, FiLayers, FiTrendingDown, FiTarget, FiZap, FiClock } from "react-icons/fi";
import { MACHINE_LIST } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { SxReportTabType } from "./useSxReportData";

interface PrecisionSxReportToolbarProps {
  fromDate: string;
  toDate: string;
  custName: string;
  df: boolean;
  selectedMachine: string;
  machineList: MACHINE_LIST[];
  activeTab: SxReportTabType;
  searchCodeCount: number;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onCustNameChange: (val: string) => void;
  onDfChange: (val: boolean) => void;
  onMachineChange: (val: string) => void;
  onSearch: () => void;
  onTabChange: (tab: SxReportTabType) => void;
  onQuickDateRange: (days: number) => void;
  onYearToDate: () => void;
}

const PrecisionSxReportToolbar: React.FC<PrecisionSxReportToolbarProps> = ({
  fromDate,
  toDate,
  custName,
  df,
  selectedMachine,
  machineList,
  activeTab,
  searchCodeCount,
  onFromDateChange,
  onToDateChange,
  onCustNameChange,
  onDfChange,
  onMachineChange,
  onSearch,
  onTabChange,
  onQuickDateRange,
  onYearToDate,
}) => {
  return (
    <div className="precision-sx-toolbar">
      {/* Hàng điều khiển bộ lọc */}
      <div className="precision-sx-toolbar__controls-row">
        <div className="precision-sx-toolbar__filters-group">
          {/* Từ ngày */}
          <div className="precision-sx-toolbar__date-picker">
            <label>Từ:</label>
            <input
              type="date"
              value={fromDate.slice(0, 10)}
              onChange={(e) => onFromDateChange(e.target.value)}
            />
          </div>

          {/* Đến ngày */}
          <div className="precision-sx-toolbar__date-picker">
            <label>Đến:</label>
            <input
              type="date"
              value={toDate.slice(0, 10)}
              onChange={(e) => onToDateChange(e.target.value)}
            />
          </div>

          {/* Dải chọn nhanh ngày */}
          <div className="precision-sx-toolbar__quick-dates">
            <button
              type="button"
              className="quick-btn"
              onClick={() => onQuickDateRange(12)}
              title="12 ngày gần nhất"
            >
              12D
            </button>
            <button
              type="button"
              className="quick-btn"
              onClick={() => onQuickDateRange(30)}
              title="30 ngày gần nhất"
            >
              30D
            </button>
            <button
              type="button"
              className="quick-btn"
              onClick={() => onQuickDateRange(90)}
              title="90 ngày gần nhất"
            >
              90D
            </button>
            <button
              type="button"
              className="quick-btn"
              onClick={onYearToDate}
              title="Từ đầu năm đến nay"
            >
              YTD
            </button>
          </div>

          {/* Khách hàng */}
          <div className="precision-sx-toolbar__input-pill">
            <label>Cust:</label>
            <input
              type="text"
              placeholder="Khách hàng..."
              value={custName}
              onChange={(e) => onCustNameChange(e.target.value)}
            />
            {searchCodeCount > 0 && <span>({searchCodeCount})</span>}
          </div>

          {/* Máy sản xuất */}
          <div className="precision-sx-toolbar__input-pill">
            <label>Máy:</label>
            <select
              value={selectedMachine}
              onChange={(e) => onMachineChange(e.target.value)}
            >
              {machineList.map((m, idx) => (
                <option key={idx} value={m.EQ_NAME}>
                  {m.EQ_NAME}
                </option>
              ))}
            </select>
          </div>

          {/* Checkbox Default */}
          <label className="precision-sx-toolbar__checkbox-pill">
            <input
              type="checkbox"
              checked={df}
              onChange={(e) => onDfChange(e.target.checked)}
            />
            <span>Mặc định (DF)</span>
          </label>
        </div>

        {/* Nút tìm kiếm */}
        <button
          type="button"
          className="precision-sx-toolbar__btn-search"
          onClick={onSearch}
        >
          <FiSearch size={12} />
          <span>Tra Cứu Dữ Liệu</span>
        </button>
      </div>

      {/* Dải Tab chuyển phân hệ trực quan */}
      <div className="precision-sx-toolbar__nav-tabs">
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === "all" ? "nav-tab-btn--active" : ""}`}
          onClick={() => onTabChange("all")}
        >
          <FiLayers size={12} />
          <span>Toàn Bộ Báo Cáo (Full View)</span>
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === "loss" ? "nav-tab-btn--active" : ""}`}
          onClick={() => onTabChange("loss")}
        >
          <FiTrendingDown size={12} />
          <span>1. Tổn Thất Sản Xuất (Loss Trend)</span>
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === "achive" ? "nav-tab-btn--active" : ""}`}
          onClick={() => onTabChange("achive")}
        >
          <FiTarget size={12} />
          <span>2. Tỷ Lệ Đạt Kế Hoạch (Achievement)</span>
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === "eff" ? "nav-tab-btn--active" : ""}`}
          onClick={() => onTabChange("eff")}
        >
          <FiZap size={12} />
          <span>3. Hiệu Suất Vận Hành & OEE (Efficiency)</span>
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === "leadtime" ? "nav-tab-btn--active" : ""}`}
          onClick={() => onTabChange("leadtime")}
        >
          <FiClock size={12} />
          <span>4. Lead Time & Giao Trễ Hạn (Lead Time Analytics)</span>
        </button>
      </div>
    </div>
  );
};

export { PrecisionSxReportToolbar };
export default React.memo(PrecisionSxReportToolbar);
