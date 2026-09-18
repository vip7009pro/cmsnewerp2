import React from "react";
import moment from "moment";
import { FiCalendar, FiHome, FiGrid, FiUsers, FiClock, FiLayers } from "react-icons/fi";

interface PrecisionCapaSxToolbarProps {
  planDate: string;
  factory: string;
  activeTab: string;
  onPlanDateChange: (date: string) => void;
  onFactoryChange: (factory: string) => void;
  onTabChange: (tab: string) => void;
}

export const PrecisionCapaSxToolbar: React.FC<PrecisionCapaSxToolbarProps> = ({
  planDate,
  factory,
  activeTab,
  onPlanDateChange,
  onFactoryChange,
  onTabChange,
}) => {
  const handleQuickDate = (offsetDays: number) => {
    const newDate = moment().add(offsetDays, "days").format("YYYY-MM-DD");
    onPlanDateChange(newDate);
  };

  const isToday = planDate === moment().format("YYYY-MM-DD");
  const isTomorrow = planDate === moment().add(1, "days").format("YYYY-MM-DD");
  const isPlus3 = planDate === moment().add(3, "days").format("YYYY-MM-DD");
  const isPlus7 = planDate === moment().add(7, "days").format("YYYY-MM-DD");

  return (
    <div className="precision-capa-toolbar">
      {/* Hàng 1: Bộ lọc Ngày & Nhà máy */}
      <div className="precision-capa-toolbar__controls-row">
        <div className="precision-capa-toolbar__filters-group">
          {/* Bộ chọn Ngày Kế Hoạch */}
          <div className="precision-capa-toolbar__date-picker">
            <FiCalendar size={12} color="#64748b" />
            <label>Ngày Kế Hoạch:</label>
            <input
              type="date"
              value={planDate}
              onChange={(e) => onPlanDateChange(e.target.value)}
            />
          </div>

          {/* Dải nút chọn nhanh ngày */}
          <div className="precision-capa-toolbar__quick-dates">
            <button
              type="button"
              className={`quick-date-btn ${isToday ? "quick-date-btn--active" : ""}`}
              onClick={() => handleQuickDate(0)}
            >
              Hôm Nay
            </button>
            <button
              type="button"
              className={`quick-date-btn ${isTomorrow ? "quick-date-btn--active" : ""}`}
              onClick={() => handleQuickDate(1)}
            >
              Ngày Mai
            </button>
            <button
              type="button"
              className={`quick-date-btn ${isPlus3 ? "quick-date-btn--active" : ""}`}
              onClick={() => handleQuickDate(3)}
            >
              +3 Ngày
            </button>
            <button
              type="button"
              className={`quick-date-btn ${isPlus7 ? "quick-date-btn--active" : ""}`}
              onClick={() => handleQuickDate(7)}
            >
              +7 Ngày
            </button>
          </div>

          {/* Chọn Nhà Máy */}
          <div className="precision-capa-toolbar__select-box">
            <FiHome size={12} color="#64748b" />
            <label>Nhà Máy:</label>
            <select
              value={factory}
              onChange={(e) => onFactoryChange(e.target.value)}
            >
              <option value="NM1">Nhà Máy 1 (NM1)</option>
              <option value="NM2">Nhà Máy 2 (NM2)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hàng 2: Segmented Tabs chuyển đổi phân hệ hiển thị */}
      <div className="precision-capa-toolbar__nav-tabs">
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === "all" ? "nav-tab-btn--active" : ""}`}
          onClick={() => onTabChange("all")}
        >
          <FiGrid size={12} />
          <span>Toàn Bộ Tổng Quan</span>
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === "workforce" ? "nav-tab-btn--active" : ""}`}
          onClick={() => onTabChange("workforce")}
        >
          <FiUsers size={12} />
          <span>Nhân Lực & Thiết Bị</span>
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === "leadtime" ? "nav-tab-btn--active" : ""}`}
          onClick={() => onTabChange("leadtime")}
        >
          <FiClock size={12} />
          <span>Cân Đối Năng Lực & Lead Time</span>
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === "plans" ? "nav-tab-btn--active" : ""}`}
          onClick={() => onTabChange("plans")}
        >
          <FiLayers size={12} />
          <span>Kế Hoạch Năng Lực 4 Dòng Máy</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCapaSxToolbar);
