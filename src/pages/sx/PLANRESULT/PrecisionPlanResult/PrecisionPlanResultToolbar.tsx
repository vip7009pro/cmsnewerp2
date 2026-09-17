import React from "react";
import { BiSearch } from "react-icons/bi";
import { MACHINE_LIST } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

export type PlanResultTabType = "all" | "kpi" | "charts" | "achivement" | "time";

interface PrecisionPlanResultToolbarProps {
  activeTab: PlanResultTabType;
  onTabChange: (tab: PlanResultTabType) => void;
  fromdate: string;
  setFromDate: (val: string) => void;
  todate: string;
  setToDate: (val: string) => void;
  factory: string;
  setFactory: (val: string) => void;
  machine: string;
  setMachine: (val: string) => void;
  machine_list: MACHINE_LIST[];
  onQuickSelect: (val: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const PrecisionPlanResultToolbar: React.FC<
  PrecisionPlanResultToolbarProps
> = ({
  activeTab,
  onTabChange,
  fromdate,
  setFromDate,
  todate,
  setToDate,
  factory,
  setFactory,
  machine,
  setMachine,
  machine_list,
  onQuickSelect,
  onSearch,
  isLoading,
}) => {
  return (
    <div className="precision-planresult__toolbar">
      {/* HÀNG 1: BỘ LỌC DỮ LIỆU & NÚT TRA CỨU */}
      <div className="toolbar-row">
        <div className="filters-group">
          {/* Quick Select */}
          <div className="filter-item">
            <label>CHỌN NHANH:</label>
            <select
              defaultValue="0"
              onChange={(e) => onQuickSelect(e.target.value)}
            >
              <option value="0">30 NGÀY QUA</option>
              <option value="1">HÔM NAY</option>
              <option value="2">HÔM QUA</option>
            </select>
          </div>

          {/* From Date */}
          <div className="filter-item">
            <label>TỪ NGÀY:</label>
            <input
              type="date"
              value={fromdate.slice(0, 10)}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          {/* To Date */}
          <div className="filter-item">
            <label>ĐẾN NGÀY:</label>
            <input
              type="date"
              value={todate.slice(0, 10)}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          {/* Factory */}
          <div className="filter-item">
            <label>NHÀ MÁY:</label>
            <select
              value={factory}
              onChange={(e) => setFactory(e.target.value)}
            >
              <option value="ALL">TẤT CẢ (ALL)</option>
              <option value="NM1">NHÀ MÁY 1 (NM1)</option>
              <option value="NM2">NHÀ MÁY 2 (NM2)</option>
            </select>
          </div>

          {/* Machine */}
          <div className="filter-item">
            <label>THIẾT BỊ:</label>
            <select
              value={machine}
              onChange={(e) => setMachine(e.target.value)}
            >
              <option value="ALL">TẤT CẢ MÁY</option>
              {machine_list
                .filter((m) => m.EQ_NAME !== "ALL")
                .map((ele, idx) => (
                  <option key={idx} value={ele.EQ_NAME}>
                    {ele.EQ_NAME}
                  </option>
                ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            className="btn-search"
            onClick={onSearch}
            disabled={isLoading}
          >
            <BiSearch size={14} />
            <span>{isLoading ? "ĐANG TẢI..." : "TRA CỨU"}</span>
          </button>
        </div>
      </div>

      {/* HÀNG 2: SEGMENTED TABS SWITCHER */}
      <div className="toolbar-row">
        <div className="segmented-tabs">
          <button
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => onTabChange("all")}
          >
            📑 XEM TOÀN DIỆN (ALL)
          </button>
          <button
            className={`tab-btn ${activeTab === "kpi" ? "active" : ""}`}
            onClick={() => onTabChange("kpi")}
          >
            📊 TỔNG QUAN KPI &amp; GAUGES
          </button>
          <button
            className={`tab-btn ${activeTab === "charts" ? "active" : ""}`}
            onClick={() => onTabChange("charts")}
          >
            📈 BIỂU ĐỒ XU HƯỚNG (TRENDS)
          </button>
          <button
            className={`tab-btn ${activeTab === "achivement" ? "active" : ""}`}
            onClick={() => onTabChange("achivement")}
          >
            📋 BẢNG TIẾN ĐỘ &amp; HAO HỤT
          </button>
          <button
            className={`tab-btn ${activeTab === "time" ? "active" : ""}`}
            onClick={() => onTabChange("time")}
          >
            ⏱️ BẢNG THỜI GIAN MÁY
          </button>
        </div>
      </div>
    </div>
  );
};
