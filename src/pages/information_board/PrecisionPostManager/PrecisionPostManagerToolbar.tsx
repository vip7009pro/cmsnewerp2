import React from "react";
import { FiLayers, FiTable, FiPieChart, FiPlusCircle, FiCalendar } from "react-icons/fi";

interface ToolbarProps {
  activeTab: "all" | "table" | "analytics";
  onTabChange: (tab: "all" | "table" | "analytics") => void;
  fromDate: string;
  onFromDateChange: (val: string) => void;
  toDate: string;
  onToDateChange: (val: string) => void;
  allTime: boolean;
  onAllTimeChange: (val: boolean) => void;
  onOpenAddModal: () => void;
  totalPosts: number;
}

const PrecisionPostManagerToolbar: React.FC<ToolbarProps> = ({
  activeTab,
  onTabChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  allTime,
  onAllTimeChange,
  onOpenAddModal,
  totalPosts,
}) => {
  return (
    <div className="precision-postmanager__toolbar">
      {/* 1. Segmented Navigation Tabs */}
      <div className="precision-postmanager__segmentTabs">
        <button
          type="button"
          className={`precision-postmanager__tabBtn ${activeTab === "all" ? "isActive" : ""}`}
          onClick={() => onTabChange("all")}
        >
          <FiLayers size={13} />
          <span>Tổng Quan Toàn Diện</span>
        </button>

        <button
          type="button"
          className={`precision-postmanager__tabBtn ${activeTab === "table" ? "isActive" : ""}`}
          onClick={() => onTabChange("table")}
        >
          <FiTable size={13} />
          <span>Bảng Danh Sách Bài Đăng</span>
          <span className="count-badge">{totalPosts}</span>
        </button>

        <button
          type="button"
          className={`precision-postmanager__tabBtn ${activeTab === "analytics" ? "isActive" : ""}`}
          onClick={() => onTabChange("analytics")}
        >
          <FiPieChart size={13} />
          <span>Báo Cáo & Biểu Đồ</span>
        </button>
      </div>

      {/* 2. Bộ Lọc Thời Gian & Nút Đăng Tin Mới */}
      <div className="precision-postmanager__filterGroup">
        <div className="filter-item">
          <FiCalendar size={12} color="#0284c7" />
          <span>Từ:</span>
          <input
            type="date"
            value={fromDate}
            disabled={allTime}
            onChange={(e) => onFromDateChange(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <span>Đến:</span>
          <input
            type="date"
            value={toDate}
            disabled={allTime}
            onChange={(e) => onToDateChange(e.target.value)}
          />
        </div>

        <label className="filter-item" style={{ cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={allTime}
            onChange={(e) => onAllTimeChange(e.target.checked)}
          />
          <span style={{ fontWeight: 600 }}>Tất Cả Thời Gian</span>
        </label>

        <button
          type="button"
          className="precision-postmanager__btn precision-postmanager__btn--primary"
          onClick={onOpenAddModal}
          title="Mở giao diện soạn thảo và đăng tin mới"
        >
          <FiPlusCircle size={13} />
          <span>Đăng Tin Mới</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPostManagerToolbar);
