import React from "react";
import { FiSearch, FiCalendar, FiBarChart2, FiTable, FiGrid } from "react-icons/fi";
import { MACHINE_LIST } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

interface Props {
  fromDate: string;
  toDate: string;
  factory: string;
  machine: string;
  machineList: MACHINE_LIST[];
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onFactoryChange: (val: string) => void;
  onMachineChange: (val: string) => void;
  onSearch: () => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const PrecisionBaoCaoRollToolbar: React.FC<Props> = ({
  fromDate, toDate, factory, machine, machineList,
  onFromDateChange, onToDateChange, onFactoryChange, onMachineChange,
  onSearch, activeTab, onTabChange,
}) => {
  const tabs = [
    { id: "all", label: "Xem Toàn Diện", icon: <FiGrid size={12} /> },
    { id: "charts", label: "KPI & Biểu Đồ", icon: <FiBarChart2 size={12} /> },
    { id: "table", label: "Bảng Dữ Liệu", icon: <FiTable size={12} /> },
  ];

  return (
    <div className="precision-bcr-toolbar">
      <div className="precision-bcr-toolbar__controls-row">
        <div className="precision-bcr-toolbar__filters-group">
          {/* From Date */}
          <div className="precision-bcr-toolbar__date-picker">
            <FiCalendar size={12} color="#64748b" />
            <label>Từ:</label>
            <input type="date" value={fromDate.slice(0, 10)} onChange={(e) => onFromDateChange(e.target.value)} />
          </div>

          {/* To Date */}
          <div className="precision-bcr-toolbar__date-picker">
            <FiCalendar size={12} color="#64748b" />
            <label>Đến:</label>
            <input type="date" value={toDate.slice(0, 10)} onChange={(e) => onToDateChange(e.target.value)} />
          </div>

          {/* Factory */}
          <div className="precision-bcr-toolbar__select-pill">
            <label>NM:</label>
            <select value={factory} onChange={(e) => onFactoryChange(e.target.value)}>
              <option value="ALL">ALL</option>
              <option value="NM1">NM1</option>
              <option value="NM2">NM2</option>
            </select>
          </div>

          {/* Machine */}
          <div className="precision-bcr-toolbar__select-pill">
            <label>Máy:</label>
            <select value={machine} onChange={(e) => onMachineChange(e.target.value)}>
              {machineList.map((el, idx) => (
                <option key={idx} value={el.EQ_NAME}>{el.EQ_NAME}</option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button type="button" className="precision-bcr-toolbar__btn-search" onClick={onSearch} title="Tra cứu báo cáo">
            <FiSearch size={12} />
            <span>Tra PLAN</span>
          </button>
        </div>
      </div>

      {/* Segment Navigation Tabs */}
      <div className="precision-bcr-toolbar__nav-tabs">
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

const MemoizedPrecisionBaoCaoRollToolbar = React.memo(PrecisionBaoCaoRollToolbar);
export { MemoizedPrecisionBaoCaoRollToolbar as PrecisionBaoCaoRollToolbar };
export default MemoizedPrecisionBaoCaoRollToolbar;
