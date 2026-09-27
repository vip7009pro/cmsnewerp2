import React from "react";
import {
  FiFilter,
  FiX,
  FiRotateCcw,
  FiCalendar,
  FiCheck,
  FiTag,
} from "react-icons/fi";
import { FaIndustry } from "react-icons/fa";
import { BiLayer, BiImport, BiExport } from "react-icons/bi";
import { AiOutlineSwapRight } from "react-icons/ai";

interface PrecisionKhoAoMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: "TON" | "LS_IN" | "LS_OUT";
  onTabChange: (tab: "TON" | "LS_IN" | "LS_OUT") => void;
  fromdate: string;
  setFromDate: (val: string) => void;
  todate: string;
  setToDate: (val: string) => void;
  factory: string;
  setFactory: (val: string) => void;
  nextPlan: string;
  setNextPlan: (val: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export const PrecisionKhoAoMobileFilterDrawer: React.FC<
  PrecisionKhoAoMobileFilterDrawerProps
> = React.memo(({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  fromdate,
  setFromDate,
  todate,
  setToDate,
  factory,
  setFactory,
  nextPlan,
  setNextPlan,
  onApply,
  onReset,
}) => {
  if (!isOpen) return null;

  const handleApply = () => {
    onApply();
    onClose();
  };

  return (
    <div
      className="precision-khoao-mobile-drawer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="precision-khoao-mobile-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FiFilter size={18} color="#0284c7" />
            <span>BỘ LỌC KHO SX MAIN (KHO ẢO)</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Đóng bộ lọc"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Drawer Body Scroll */}
        <div className="drawer-body">
          {/* Nhóm 1: Chế Độ Kho / Tab */}
          <div className="drawer-section">
            <label className="section-label">
              <FiTag size={13} color="#64748b" />
              <span>CHẾ ĐỘ XEM / TAB</span>
            </label>
            <div className="mode-toggle-group">
              <button
                type="button"
                className={`mode-btn ${activeTab === "TON" ? "active" : ""}`}
                onClick={() => onTabChange("TON")}
              >
                <BiLayer size={14} />
                <span>TỒN KHO MAIN</span>
              </button>

              <button
                type="button"
                className={`mode-btn ${activeTab === "LS_IN" ? "active" : ""}`}
                onClick={() => onTabChange("LS_IN")}
              >
                <BiImport size={14} />
                <span>LỊCH SỬ NHẬP</span>
              </button>

              <button
                type="button"
                className={`mode-btn ${activeTab === "LS_OUT" ? "active" : ""}`}
                onClick={() => onTabChange("LS_OUT")}
              >
                <BiExport size={14} />
                <span>LỊCH SỬ XUẤT</span>
              </button>
            </div>
          </div>

          {/* Nhóm 2: Nhà máy / Xưởng */}
          <div className="drawer-section">
            <label className="section-label">
              <FaIndustry size={13} color="#64748b" />
              <span>NHÀ MÁY / PHÂN XƯỞNG</span>
            </label>
            <div className="factory-toggle-group">
              <button
                type="button"
                className={`factory-btn ${factory === "ALL" ? "active" : ""}`}
                onClick={() => setFactory("ALL")}
              >
                TẤT CẢ (ALL)
              </button>
              <button
                type="button"
                className={`factory-btn ${factory === "NM1" ? "active" : ""}`}
                onClick={() => setFactory("NM1")}
              >
                NHÀ MÁY 1 (NM1)
              </button>
              <button
                type="button"
                className={`factory-btn ${factory === "NM2" ? "active" : ""}`}
                onClick={() => setFactory("NM2")}
              >
                NHÀ MÁY 2 (NM2)
              </button>
            </div>
          </div>

          {/* Nhóm 3: Khoảng thời gian tra cứu */}
          <div className="drawer-section">
            <div className="section-label-row">
              <label className="section-label">
                <FiCalendar size={13} color="#64748b" />
                <span>KHOẢNG THỜI GIAN</span>
              </label>
              {activeTab === "TON" && (
                <span className="section-note">
                  * Tồn kho chỉ xem thời điểm hiện tại
                </span>
              )}
            </div>

            <div className="date-inputs-row">
              <div className="input-group">
                <label className="sub-label">Từ ngày</label>
                <input
                  type="date"
                  className="drawer-date-input"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                  disabled={activeTab === "TON"}
                />
              </div>

              <div className="input-group">
                <label className="sub-label">Đến ngày</label>
                <input
                  type="date"
                  className="drawer-date-input"
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                  disabled={activeTab === "TON"}
                />
              </div>
            </div>
          </div>

          {/* Nhóm 4: Chỉ thị tiếp nhận (NEXT PLAN) */}
          <div className="drawer-section">
            <label className="section-label">
              <AiOutlineSwapRight size={14} color="#64748b" />
              <span>CHỈ THỊ TIẾP NHẬN (NEXT PLAN)</span>
            </label>
            <div className="input-group">
              <input
                type="text"
                className="drawer-text-input"
                placeholder="Nhập mã chỉ thị tiếp nhận (VD: 1234567)..."
                value={nextPlan}
                onChange={(e) => setNextPlan(e.target.value.toUpperCase())}
              />
              <span className="input-help-text">
                Áp dụng khi chọn cuộn liệu tại tab TỒN KHO MAIN để xuất sang chỉ thị khác.
              </span>
            </div>
          </div>
        </div>

        {/* Drawer Footer Buttons */}
        <div className="drawer-footer">
          <button
            type="button"
            className="drawer-reset-btn"
            onClick={onReset}
          >
            <FiRotateCcw size={15} />
            <span>Đặt lại</span>
          </button>

          <button
            type="button"
            className="drawer-apply-btn"
            onClick={handleApply}
          >
            <FiCheck size={16} />
            <span>Áp dụng bộ lọc</span>
          </button>
        </div>
      </div>
    </div>
  );
});
