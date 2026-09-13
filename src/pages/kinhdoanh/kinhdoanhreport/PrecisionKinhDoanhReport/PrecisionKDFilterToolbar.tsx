import React from "react";
import { FiSearch, FiCalendar, FiBarChart2, FiTable, FiAlertTriangle, FiPackage, FiGrid } from "react-icons/fi";
import { getCompany } from "../../../../api/Api";

interface PrecisionKDFilterToolbarProps {
  fromDate: string;
  toDate: string;
  df: boolean;
  inNhanh: boolean;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onDfChange: (checked: boolean) => void;
  onInNhanhChange: (checked: boolean) => void;
  onSearch: () => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const PrecisionKDFilterToolbar: React.FC<PrecisionKDFilterToolbarProps> = ({
  fromDate,
  toDate,
  df,
  inNhanh,
  onFromDateChange,
  onToDateChange,
  onDfChange,
  onInNhanhChange,
  onSearch,
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "all", label: "Xem Toàn Diện", icon: <FiGrid size={12} /> },
    { id: "summary", label: "Doanh Thu & Chốt Số", icon: <FiBarChart2 size={12} /> },
    { id: "tables", label: "Bảng Biểu Khách Hàng", icon: <FiTable size={12} /> },
    { id: "overdue", label: "Phân Tích Trễ Hạn", icon: <FiAlertTriangle size={12} /> },
    { id: "po", label: "Đơn Hàng PO & Dự Báo", icon: <FiPackage size={12} /> },
  ];

  return (
    <div className="precision-kd-toolbar">
      {/* Hàng điều khiển bộ lọc ngày tháng */}
      <div className="precision-kd-toolbar__controls-row">
        <div className="precision-kd-toolbar__filters-group">
          {/* From Date */}
          <div className="precision-kd-toolbar__date-picker">
            <FiCalendar size={12} color="#64748b" />
            <label>Từ ngày:</label>
            <input
              type="date"
              value={fromDate.slice(0, 10)}
              onChange={(e) => onFromDateChange(e.target.value)}
            />
          </div>

          {/* To Date */}
          <div className="precision-kd-toolbar__date-picker">
            <FiCalendar size={12} color="#64748b" />
            <label>Đến ngày:</label>
            <input
              type="date"
              value={toDate.slice(0, 10)}
              onChange={(e) => onToDateChange(e.target.value)}
            />
          </div>

          {/* Default Filter Checkbox */}
          <label className="precision-kd-toolbar__checkbox-pill">
            <input
              type="checkbox"
              checked={df}
              onChange={(e) => onDfChange(e.target.checked)}
            />
            <span>Mặc định (Default)</span>
          </label>

          {/* In Nhanh Checkbox (Chỉ PVN) */}
          {getCompany() === "PVN" && (
            <label className="precision-kd-toolbar__checkbox-pill">
              <input
                type="checkbox"
                checked={inNhanh}
                onChange={(e) => onInNhanhChange(e.target.checked)}
              />
              <span>In nhanh</span>
            </label>
          )}

          {/* Nút Tìm kiếm Tra cứu */}
          <button
            type="button"
            className="precision-kd-toolbar__btn-search"
            onClick={onSearch}
            title="Tra cứu dữ liệu báo cáo"
          >
            <FiSearch size={12} />
            <span>Tra Cứu Dữ Liệu</span>
          </button>
        </div>
      </div>

      {/* Hàng chuyển đổi nhanh phân hệ báo cáo (Segment Jump Tabs) */}
      <div className="precision-kd-toolbar__nav-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`nav-tab-btn ${activeTab === t.id ? "nav-tab-btn--active" : ""}`}
            onClick={() => onTabChange(t.id)}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PrecisionKDFilterToolbar);
