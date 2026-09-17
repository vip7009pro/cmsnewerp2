import React from "react";
import { FiSearch, FiArrowRight, FiTrash2, FiDownload, FiCalendar, FiHome, FiCpu } from "react-icons/fi";
import { MACHINE_LIST } from "../../interfaces/khsxInterface";

interface PrecisionLongTermPlanToolbarProps {
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
  onMovePlan: () => void;
  onDeletePlan: () => void;
  onExportExcel: () => void;
}

const PrecisionLongTermPlanToolbar: React.FC<PrecisionLongTermPlanToolbarProps> = ({
  fromDate,
  toDate,
  factory,
  machine,
  machineList,
  onFromDateChange,
  onToDateChange,
  onFactoryChange,
  onMachineChange,
  onSearch,
  onMovePlan,
  onDeletePlan,
  onExportExcel,
}) => {
  return (
    <div className="precision-longterm-toolbar">
      {/* Khối Bộ Lọc Compact */}
      <div className="precision-longterm-toolbar__filters">
        {/* 1. PLAN DATE */}
        <div className="precision-longterm-toolbar__item">
          <FiCalendar size={11} color="#2563eb" />
          <label>PLAN DATE:</label>
          <input
            type="date"
            value={fromDate.slice(0, 10)}
            onChange={(e) => onFromDateChange(e.target.value)}
          />
        </div>

        {/* 2. FACTORY */}
        <div className="precision-longterm-toolbar__item">
          <FiHome size={11} color="#059669" />
          <label>FACTORY:</label>
          <select value={factory} onChange={(e) => onFactoryChange(e.target.value)}>
            <option value="NM1">NM1</option>
            <option value="NM2">NM2</option>
          </select>
        </div>

        {/* 3. MACHINE */}
        <div className="precision-longterm-toolbar__item">
          <FiCpu size={11} color="#d97706" />
          <label>MACHINE:</label>
          <select value={machine} onChange={(e) => onMachineChange(e.target.value)}>
            <option value="ALL">ALL (Tất cả máy)</option>
            {machineList.map((item: MACHINE_LIST, idx: number) => (
              <option key={idx} value={item.EQ_NAME}>
                {item.EQ_NAME}
              </option>
            ))}
          </select>
        </div>

        {/* 4. MOVE TO DATE */}
        <div className="precision-longterm-toolbar__item">
          <FiArrowRight size={11} color="#e11d48" />
          <label>MOVE TO DATE:</label>
          <input
            type="date"
            value={toDate.slice(0, 10)}
            onChange={(e) => onToDateChange(e.target.value)}
          />
        </div>
      </div>

      {/* Dải Nút Hành Động Công Thái Học */}
      <div className="precision-longterm-toolbar__actions">
        <button
          type="button"
          className="btn-action btn-action--primary"
          onClick={onSearch}
          title="Tra cứu kế hoạch và năng lực máy"
        >
          <FiSearch size={12} />
          <span>Tra PLAN</span>
        </button>

        <button
          type="button"
          className="btn-action btn-action--warning"
          onClick={onMovePlan}
          title="Chuyển ngày cho các plan được tích chọn"
        >
          <FiArrowRight size={12} />
          <span>MOVE PLAN</span>
        </button>

        <button
          type="button"
          className="btn-action btn-action--danger"
          onClick={onDeletePlan}
          title="Xóa các plan được tích chọn"
        >
          <FiTrash2 size={12} />
          <span>DELETE PLAN</span>
        </button>

        <button
          type="button"
          className="btn-action btn-action--excel"
          onClick={onExportExcel}
          title="Xuất Excel toàn bộ bảng kế hoạch dài hạn"
        >
          <FiDownload size={12} />
          <span>SAVE Excel</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionLongTermPlanToolbar);
