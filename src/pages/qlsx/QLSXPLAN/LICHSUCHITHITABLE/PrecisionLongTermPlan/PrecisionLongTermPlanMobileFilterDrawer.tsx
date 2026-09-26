import React from "react";
import {
  FiFilter,
  FiX,
  FiRotateCcw,
  FiSearch,
  FiArrowRight,
  FiCalendar,
  FiHome,
  FiCpu,
} from "react-icons/fi";
import { MACHINE_LIST } from "../../interfaces/khsxInterface";

interface PrecisionLongTermPlanMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fromDate: string;
  toDate: string;
  factory: string;
  machine: string;
  machineList: MACHINE_LIST[];
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onFactoryChange: (val: string) => void;
  onMachineChange: (val: string) => void;
  onApply: () => void;
  onReset: () => void;
  onMovePlan: () => void;
}

const PrecisionLongTermPlanMobileFilterDrawer: React.FC<
  PrecisionLongTermPlanMobileFilterDrawerProps
> = ({
  isOpen,
  onClose,
  fromDate,
  toDate,
  factory,
  machine,
  machineList,
  onFromDateChange,
  onToDateChange,
  onFactoryChange,
  onMachineChange,
  onApply,
  onReset,
  onMovePlan,
}) => {
  if (!isOpen) return null;

  const handleApplyClick = () => {
    onApply();
    onClose();
  };

  const handleMoveClick = () => {
    onMovePlan();
    onClose();
  };

  return (
    <div
      className="precision-longterm-mobile-drawer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="precision-longterm-mobile-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FiFilter size={18} color="#2563eb" />
            <span>BỘ LỌC KẾ HOẠCH DÀI HẠN (16 NGÀY)</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Đóng"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {/* Nhóm 1: Thông Tin Tra Cứu */}
          <div className="filter-group">
            <span className="group-title">
              <FiCalendar size={13} color="#2563eb" />
              <span>Thời Gian & Nhà Máy</span>
            </span>

            <div className="grid-2col">
              <div className="field-item">
                <label>PLAN DATE (Từ Ngày):</label>
                <input
                  type="date"
                  className="mobile-drawer-input"
                  value={fromDate.slice(0, 10)}
                  onChange={(e) => onFromDateChange(e.target.value)}
                />
              </div>

              <div className="field-item">
                <label>FACTORY (Nhà Máy):</label>
                <select
                  className="mobile-drawer-select"
                  value={factory}
                  onChange={(e) => onFactoryChange(e.target.value)}
                >
                  <option value="NM1">NM1</option>
                  <option value="NM2">NM2</option>
                </select>
              </div>
            </div>

            <div className="field-item">
              <label>
                <FiCpu size={12} color="#d97706" style={{ marginRight: 4 }} />
                MACHINE (Chọn Thiết Bị / Máy):
              </label>
              <select
                className="mobile-drawer-select"
                value={machine}
                onChange={(e) => onMachineChange(e.target.value)}
              >
                <option value="ALL">-- TẤT CẢ MÁY SẢN XUẤT --</option>
                {machineList.map((item: MACHINE_LIST, idx: number) => (
                  <option key={idx} value={item.EQ_NAME}>
                    {item.EQ_NAME}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nhóm 2: Chuyển Ngày Kế Hoạch (Move Plan) */}
          <div className="filter-group">
            <span className="group-title">
              <FiArrowRight size={13} color="#f59e0b" />
              <span>Dời Kế Hoạch Đã Chọn (MOVE PLAN)</span>
            </span>

            <div className="field-item">
              <label>MOVE TO DATE (Ngày Muốn Dời Đến):</label>
              <input
                type="date"
                className="mobile-drawer-input"
                value={toDate.slice(0, 10)}
                onChange={(e) => onToDateChange(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn-drawer-move"
              onClick={handleMoveClick}
              title="Dời các dòng kế hoạch đã chọn sang ngày MOVE TO"
            >
              <FiArrowRight size={15} />
              <span>Dời Kế Hoạch Sang Ngày {toDate.slice(0, 10)}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-drawer-reset"
            onClick={onReset}
            title="Đặt lại về mặc định"
          >
            <FiRotateCcw size={14} />
            <span>Mặc Định</span>
          </button>

          <button
            type="button"
            className="btn-drawer-apply"
            onClick={handleApplyClick}
            title="Áp dụng bộ lọc và tra cứu kế hoạch"
          >
            <FiSearch size={15} />
            <span>Áp Dụng & Tra Cứu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionLongTermPlanMobileFilterDrawer);
