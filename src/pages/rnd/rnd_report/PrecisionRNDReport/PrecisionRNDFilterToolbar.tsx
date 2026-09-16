import React from "react";
import {
  FiAlertTriangle,
  FiCalendar,
  FiGrid,
  FiLayers,
  FiPieChart,
  FiSearch,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import { RNDReportTab } from "./rndReportTypes";

interface FilterToolbarProps {
  fromDate: string;
  toDate: string;
  custName: string;
  df: boolean;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onCustNameChange: (val: string) => void;
  onDfChange: (val: boolean) => void;
  onSearch: () => void;
  activeTab: RNDReportTab;
  onTabChange: (tab: RNDReportTab) => void;
  company: string;
  codeCount: number;
}

export const PrecisionRNDFilterToolbar: React.FC<FilterToolbarProps> = React.memo(
  ({
    fromDate,
    toDate,
    custName,
    df,
    onFromDateChange,
    onToDateChange,
    onCustNameChange,
    onDfChange,
    onSearch,
    activeTab,
    onTabChange,
    company,
    codeCount,
  }) => {
    const tabs = [
      { id: "all" as RNDReportTab, label: "Xem Toàn Diện", icon: <FiGrid size={12} /> },
      { id: "trending" as RNDReportTab, label: "Xu Hướng Mã Mới", icon: <FiTrendingUp size={12} /> },
      { id: "distribution" as RNDReportTab, label: "Cơ Cấu KH & Loại SP", icon: <FiPieChart size={12} /> },
      ...(company === "PVN"
        ? [{ id: "filmsaving" as RNDReportTab, label: "Tiết Kiệm Film", icon: <FiLayers size={12} /> }]
        : company === "XXX"
        ? [{ id: "filmsaving" as RNDReportTab, label: "Yêu Cầu Thiết Kế", icon: <FiLayers size={12} /> }]
        : []),
      { id: "daofilmerr" as RNDReportTab, label: "Tỉ Trọng Lỗi Dao Film", icon: <FiAlertTriangle size={12} /> },
    ];

    return (
      <div className="precision-rnd-report__toolbar">
        {/* HÀNG 1: BỘ LỌC NGÀY, KHÁCH HÀNG & TÌM KIẾM */}
        <div className="precision-rnd-report__toolbarControls">
          <div className="precision-rnd-report__filterGroup">
            {/* TỪ NGÀY */}
            <div className="precision-rnd-report__inputPill">
              <FiCalendar size={12} color="#64748b" />
              <label>Từ ngày:</label>
              <input
                type="date"
                value={fromDate.slice(0, 10)}
                onChange={(e) => onFromDateChange(e.target.value)}
              />
            </div>

            {/* ĐẾN NGÀY */}
            <div className="precision-rnd-report__inputPill">
              <FiCalendar size={12} color="#64748b" />
              <label>Đến ngày:</label>
              <input
                type="date"
                value={toDate.slice(0, 10)}
                onChange={(e) => onToDateChange(e.target.value)}
              />
            </div>

            {/* KHÁCH HÀNG */}
            <div className="precision-rnd-report__inputPill">
              <FiUser size={12} color="#64748b" />
              <label>Khách hàng:</label>
              <input
                type="text"
                placeholder="Nhập tên khách hàng..."
                value={custName}
                onChange={(e) => onCustNameChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSearch();
                }}
              />
              {codeCount > 0 && (
                <span style={{ fontSize: 10, color: "#2563eb", fontWeight: 700 }}>
                  ({codeCount})
                </span>
              )}
            </div>

            {/* CHECKBOX MẶC ĐỊNH */}
            <label className="precision-rnd-report__checkboxPill">
              <input
                type="checkbox"
                checked={df}
                onChange={(e) => onDfChange(e.target.checked)}
              />
              <span>Mặc định (Default)</span>
            </label>

            {/* NÚT TÌM KIẾM */}
            <button
              type="button"
              className="precision-rnd-report__btnSearch"
              onClick={onSearch}
              title="Tra cứu báo cáo R&D theo điều kiện lọc"
            >
              <FiSearch size={13} />
              <span>Tra Cứu Báo Cáo</span>
            </button>
          </div>
        </div>

        {/* HÀNG 2: THANH CHUYỂN PHÂN HỆ BÁO CÁO (SEGMENT TAB SWITCHER) */}
        <nav className="precision-rnd-report__tabBar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`precision-rnd-report__tabBtn ${
                  isActive ? "precision-rnd-report__tabBtn--active" : ""
                }`}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  }
);

PrecisionRNDFilterToolbar.displayName = "PrecisionRNDFilterToolbar";
