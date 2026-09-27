import React from "react";
import moment from "moment";
import {
  FaFilter,
  FaTimes,
  FaUndo,
  FaSearch,
  FaCalendarAlt,
  FaIndustry,
} from "react-icons/fa";
import { MACHINE_LIST } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

interface PrecisionBaoCaoRollMobileFilterDrawerProps {
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
  onSearch: () => void;
  onReset: () => void;
}

export const PrecisionBaoCaoRollMobileFilterDrawer: React.FC<
  PrecisionBaoCaoRollMobileFilterDrawerProps
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
  onSearch,
  onReset,
}) => {
  if (!isOpen) return null;

  const handleQuickDays = (days: number) => {
    const to = moment().format("YYYY-MM-DD");
    const from =
      days === 0 ? to : moment().subtract(days, "days").format("YYYY-MM-DD");
    onToDateChange(to);
    onFromDateChange(from);
  };

  const isToday =
    fromDate?.slice(0, 10) === moment().format("YYYY-MM-DD") &&
    toDate?.slice(0, 10) === moment().format("YYYY-MM-DD");

  const handleApply = () => {
    onSearch();
    onClose();
  };

  return (
    <div className="precision-mobile-drawer-backdrop" onClick={onClose}>
      <div
        className="precision-mobile-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thanh kéo trang trí */}
        <div className="drawer-drag-handle" />

        {/* Header Drawer */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FaFilter className="filter-icon" />
            <span>BỘ LỌC BÁO CÁO THEO ROLL</span>
          </div>
          <button
            type="button"
            className="btn-close-drawer"
            onClick={onClose}
            title="Đóng bộ lọc"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Nội Dung Điều Kiện Lọc */}
        <div className="drawer-body">
          {/* Nhóm 1: Khoảng ngày sản xuất / nạp liệu */}
          <div className="filter-section">
            <label className="section-label">
              <FaCalendarAlt size={11} />
              <span>Khoảng ngày sản xuất / nạp liệu:</span>
            </label>
            <div className="date-inputs-row">
              <div className="date-field">
                <span className="field-hint">Từ ngày</span>
                <input
                  type="date"
                  value={fromDate ? fromDate.slice(0, 10) : ""}
                  onChange={(e) => onFromDateChange(e.target.value)}
                />
              </div>
              <div className="date-field">
                <span className="field-hint">Đến ngày</span>
                <input
                  type="date"
                  value={toDate ? toDate.slice(0, 10) : ""}
                  onChange={(e) => onToDateChange(e.target.value)}
                />
              </div>
            </div>

            {/* Quick chọn ngày */}
            <div className="quick-dates-pills">
              <button
                type="button"
                className={`quick-pill ${isToday ? "quick-pill--active" : ""}`}
                onClick={() => handleQuickDays(0)}
              >
                Hôm nay
              </button>
              <button
                type="button"
                className="quick-pill"
                onClick={() => handleQuickDays(3)}
              >
                3 ngày
              </button>
              <button
                type="button"
                className="quick-pill"
                onClick={() => handleQuickDays(7)}
              >
                7 ngày
              </button>
              <button
                type="button"
                className="quick-pill"
                onClick={() => handleQuickDays(30)}
              >
                30 ngày
              </button>
            </div>
          </div>

          {/* Nhóm 2: Nhà máy & Máy sản xuất */}
          <div className="filter-section">
            <label className="section-label">
              <FaIndustry size={11} />
              <span>Khu vực sản xuất:</span>
            </label>
            <div className="text-fields-grid">
              <div className="input-group">
                <span className="field-hint">Nhà máy</span>
                <select
                  value={factory}
                  onChange={(e) => onFactoryChange(e.target.value)}
                >
                  <option value="ALL">ALL (Tất cả NM)</option>
                  <option value="NM1">NM1</option>
                  <option value="NM2">NM2</option>
                </select>
              </div>
              <div className="input-group">
                <span className="field-hint">Máy (Line)</span>
                <select
                  value={machine}
                  onChange={(e) => onMachineChange(e.target.value)}
                >
                  <option value="ALL">ALL (Tất cả máy)</option>
                  {machineList.map((m, idx) => (
                    <option key={idx} value={m.EQ_NAME}>
                      {m.EQ_NAME}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Drawer: Nút Đặt Lại & Nút Áp Dụng */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-drawer-reset"
            onClick={onReset}
            title="Đặt lại bộ lọc về mặc định"
          >
            <FaUndo size={11} />
            <span>Đặt Lại</span>
          </button>
          <button
            type="button"
            className="btn-drawer-apply"
            onClick={handleApply}
            title="Áp dụng bộ lọc và tra cứu báo cáo"
          >
            <FaSearch size={12} />
            <span>Áp Dụng</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionBaoCaoRollMobileFilterDrawer);
