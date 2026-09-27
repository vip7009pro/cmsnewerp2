import React from "react";
import {
  FiX,
  FiRotateCcw,
  FiCheck,
  FiCalendar,
  FiClock,
  FiCheckSquare,
  FiSquare,
} from "react-icons/fi";
import { KpiOption } from "./useKpiNvSxData";

interface PrecisionKpiNvSxMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fromDate: string;
  toDate: string;
  option: KpiOption;
  allTime: boolean;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onOptionChange: (val: KpiOption) => void;
  onAllTimeToggle: () => void;
  onQuickDate: (days: number) => void;
  onApply: () => void;
  onReset: () => void;
}

const PrecisionKpiNvSxMobileFilterDrawer: React.FC<PrecisionKpiNvSxMobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  fromDate,
  toDate,
  option,
  allTime,
  onFromDateChange,
  onToDateChange,
  onOptionChange,
  onAllTimeToggle,
  onQuickDate,
  onApply,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="precision-kpinvsx__filterDrawerBackdrop" onClick={onClose}>
      <div
        className="precision-kpinvsx__filterDrawerPanel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thanh kéo handle indicator */}
        <div className="drawer-drag-handle" />

        {/* Header Drawer */}
        <div className="drawer-header">
          <div className="title-area">
            <span className="drawer-title">BỘ LỌC CHU KỲ & THỜI GIAN KPI</span>
            <span className="drawer-subtitle">Tùy biến điều kiện trích xuất dữ liệu nhân viên</span>
          </div>
          <button
            type="button"
            className="btn-drawer-close"
            onClick={onClose}
            title="Đóng bộ lọc"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Nội dung lọc cuộn mượt mà */}
        <div className="drawer-body">
          {/* Nhóm 1: Chu kỳ thống kê KPI */}
          <div className="filter-section">
            <div className="section-label">
              <FiClock size={13} />
              <span>Chu Kỳ Đánh Giá KPI</span>
            </div>

            <div className="option-pill-grid">
              {(
                [
                  { key: "Daily", label: "Hàng Ngày (Daily)" },
                  { key: "Weekly", label: "Hàng Tuần (Weekly)" },
                  { key: "Monthly", label: "Hàng Tháng (Monthly)" },
                  { key: "Yearly", label: "Hàng Năm (Yearly)" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  className={`option-btn ${option === opt.key ? "selected" : ""}`}
                  onClick={() => onOptionChange(opt.key)}
                >
                  <span className="option-check-circle" />
                  <span className="option-btn-text">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Nhóm 2: Khoảng thời gian */}
          <div className="filter-section">
            <div className="section-label">
              <FiCalendar size={13} />
              <span>Khoảng Thời Gian Trích Xuất</span>
            </div>

            <div className="time-quick-row">
              <button
                type="button"
                className={`alltime-toggle-btn ${allTime ? "active" : ""}`}
                onClick={onAllTimeToggle}
              >
                {allTime ? <FiCheckSquare size={14} /> : <FiSquare size={14} />}
                <span>Toàn bộ thời gian (All Time)</span>
              </button>

              <div className="quick-buttons">
                <button
                  type="button"
                  className="quick-btn"
                  onClick={() => onQuickDate(0)}
                  title="Hôm nay"
                >
                  1D
                </button>
                <button
                  type="button"
                  className="quick-btn"
                  onClick={() => onQuickDate(7)}
                  title="7 ngày qua"
                >
                  7D
                </button>
                <button
                  type="button"
                  className="quick-btn"
                  onClick={() => onQuickDate(30)}
                  title="30 ngày qua"
                >
                  30D
                </button>
                <button
                  type="button"
                  className="quick-btn"
                  onClick={() => onQuickDate(90)}
                  title="90 ngày qua"
                >
                  90D
                </button>
              </div>
            </div>

            <div className="date-inputs-grid">
              <div className="input-group">
                <span className="field-title">Từ Ngày</span>
                <input
                  type="date"
                  className="date-field"
                  disabled={allTime}
                  value={fromDate}
                  onChange={(e) => onFromDateChange(e.target.value)}
                />
              </div>
              <div className="input-group">
                <span className="field-title">Đến Ngày</span>
                <input
                  type="date"
                  className="date-field"
                  disabled={allTime}
                  value={toDate}
                  onChange={(e) => onToDateChange(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-reset"
            onClick={onReset}
          >
            <FiRotateCcw size={13} />
            <span>Mặc Định</span>
          </button>

          <button
            type="button"
            className="btn-apply"
            onClick={() => {
              onApply();
              onClose();
            }}
          >
            <FiCheck size={14} />
            <span>Áp Dụng Lọc</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKpiNvSxMobileFilterDrawer);
