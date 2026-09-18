import React from "react";
import {
  FiSearch, FiCalendar, FiGrid, FiPieChart, FiClock,
} from "react-icons/fi";

export type WHVLTab = "all" | "popular" | "longterm";

interface PrecisionKhoVLToolbarProps {
  fromDate: string;
  toDate: string;
  df: boolean;
  moc1: number;
  moc2: number;
  activeTab: WHVLTab;
  onFromDateChange: (v: string) => void;
  onToDateChange: (v: string) => void;
  onDfChange: (v: boolean) => void;
  onMoc1Change: (v: number) => void;
  onMoc2Change: (v: number) => void;
  onSearch: () => void;
  onTabChange: (t: WHVLTab) => void;
}

const tabs: { id: WHVLTab; label: string; icon: React.ReactNode }[] = [
  { id: "all",      label: "Toàn Diện",             icon: <FiGrid size={12} /> },
  { id: "popular",  label: "Theo Độ Thông Dụng",    icon: <FiPieChart size={12} /> },
  { id: "longterm", label: "Tồn Kho Dài Hạn",       icon: <FiClock size={12} /> },
];

const PrecisionKhoVLToolbar: React.FC<PrecisionKhoVLToolbarProps> = ({
  fromDate, toDate, df, moc1, moc2, activeTab,
  onFromDateChange, onToDateChange, onDfChange,
  onMoc1Change, onMoc2Change, onSearch, onTabChange,
}) => {
  return (
    <div className="precision-khovl__toolbar">
      {/* Hàng điều khiển bộ lọc */}
      <div className="precision-khovl__toolbar-controls">
        {/* From Date */}
        <div className="precision-khovl__toolbar-date-picker">
          <FiCalendar size={12} color="#64748b" />
          <label>Từ ngày:</label>
          <input
            type="date"
            value={fromDate.slice(0, 10)}
            onChange={(e) => onFromDateChange(e.target.value)}
          />
        </div>

        {/* To Date */}
        <div className="precision-khovl__toolbar-date-picker">
          <FiCalendar size={12} color="#64748b" />
          <label>Đến ngày:</label>
          <input
            type="date"
            value={toDate.slice(0, 10)}
            onChange={(e) => onToDateChange(e.target.value)}
          />
        </div>

        {/* Mốc 1 */}
        <div className="precision-khovl__toolbar-moc-picker">
          <label>Mốc 1 (tháng):</label>
          <input
            type="number"
            value={moc1}
            min={1}
            max={24}
            onChange={(e) => onMoc1Change(Number(e.target.value))}
          />
        </div>

        {/* Mốc 2 */}
        <div className="precision-khovl__toolbar-moc-picker">
          <label>Mốc 2 (tháng):</label>
          <input
            type="number"
            value={moc2}
            min={1}
            max={36}
            onChange={(e) => onMoc2Change(Number(e.target.value))}
          />
        </div>

        {/* Default checkbox */}
        <label className="precision-khovl__toolbar-checkbox">
          <input
            type="checkbox"
            checked={df}
            onChange={(e) => onDfChange(e.target.checked)}
          />
          <span>Mặc định (Default)</span>
        </label>

        {/* Search Button */}
        <button
          type="button"
          className="precision-khovl__toolbar-btn-search"
          onClick={onSearch}
          title="Tra cứu dữ liệu kho"
        >
          <FiSearch size={12} />
          <span>Tra Cứu</span>
        </button>
      </div>

      {/* Segment tabs */}
      <div className="precision-khovl__toolbar-tabs">
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

export default React.memo(PrecisionKhoVLToolbar);
