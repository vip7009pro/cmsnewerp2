import React from "react";
import { FiLayers, FiEdit3, FiPieChart, FiList } from "react-icons/fi";

interface ToolbarProps {
  activeTab: "all" | "studio" | "analytics" | "feed";
  onTabChange: (tab: "all" | "studio" | "analytics" | "feed") => void;
  totalPosts: number;
}

const PrecisionAddInfoToolbar: React.FC<ToolbarProps> = ({
  activeTab,
  onTabChange,
  totalPosts,
}) => {
  return (
    <div className="precision-addinfo__toolbar">
      {/* Segmented Navigation Tabs */}
      <div className="precision-addinfo__segmentTabs">
        <button
          type="button"
          className={`precision-addinfo__tabBtn ${activeTab === "all" ? "isActive" : ""}`}
          onClick={() => onTabChange("all")}
        >
          <FiLayers size={13} />
          <span>Tổng Quan Toàn Diện</span>
        </button>

        <button
          type="button"
          className={`precision-addinfo__tabBtn ${activeTab === "studio" ? "isActive" : ""}`}
          onClick={() => onTabChange("studio")}
        >
          <FiEdit3 size={13} />
          <span>Soạn Thảo & Đăng Tin</span>
        </button>

        <button
          type="button"
          className={`precision-addinfo__tabBtn ${activeTab === "analytics" ? "isActive" : ""}`}
          onClick={() => onTabChange("analytics")}
        >
          <FiPieChart size={13} />
          <span>Báo Cáo & Biểu Đồ</span>
        </button>

        <button
          type="button"
          className={`precision-addinfo__tabBtn ${activeTab === "feed" ? "isActive" : ""}`}
          onClick={() => onTabChange("feed")}
        >
          <FiList size={13} />
          <span>Bài Viết Đã Đăng</span>
          <span className="count-badge">{totalPosts}</span>
        </button>
      </div>

      <div className="precision-addinfo__quickFilters">
        <span style={{ fontSize: "11px", color: "#64748b" }}>
          Hệ thống phát hành thông cáo, chỉ thị & tin tức nội bộ tự động
        </span>
      </div>
    </div>
  );
};

export default React.memo(PrecisionAddInfoToolbar);
