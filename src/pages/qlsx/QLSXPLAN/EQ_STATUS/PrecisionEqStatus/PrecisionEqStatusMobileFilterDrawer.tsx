import React from "react";
import {
  FiFilter,
  FiX,
  FiRotateCcw,
  FiTv,
  FiSliders,
  FiCheckSquare,
  FiSun,
  FiMoon,
  FiCheck,
} from "react-icons/fi";
import { FaIndustry } from "react-icons/fa";

interface PrecisionEqStatusMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  factory: string;
  setFactory: (val: string) => void;
  machine: string;
  setMachine: (val: string) => void;
  eqSeries: string[];
  machineNumber: number;
  setMachineNumber: (val: number) => void;
  showTime: number;
  setShowTime: (val: number) => void;
  onlyRunning: boolean;
  setOnlyRunning: (val: boolean) => void;
  autoSlide: boolean;
  setAutoSlide: (val: boolean | ((prev: boolean) => boolean)) => void;
  theme: "theme-dark" | "theme-light";
  onToggleTheme: () => void;
  searchString: string;
  setSearchString: (val: string) => void;
  onReset: () => void;
}

export const PrecisionEqStatusMobileFilterDrawer: React.FC<
  PrecisionEqStatusMobileFilterDrawerProps
> = React.memo(({
  isOpen,
  onClose,
  factory,
  setFactory,
  machine,
  setMachine,
  eqSeries,
  machineNumber,
  setMachineNumber,
  showTime,
  setShowTime,
  onlyRunning,
  setOnlyRunning,
  autoSlide,
  setAutoSlide,
  theme,
  onToggleTheme,
  searchString,
  setSearchString,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="precision-eq-mobile-drawer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="precision-eq-mobile-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FiFilter size={18} color="#0284c7" />
            <span>BỘ LỌC &amp; CẤU HÌNH ANDON MÁY</span>
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

        {/* Drawer Body */}
        <div className="drawer-body">
          {/* Nhóm 1: Phân Xưởng & Nhóm Thiết Bị */}
          <div className="filter-group">
            <span className="group-title">
              <FaIndustry size={13} color="#0284c7" />
              <span>Phân Xưởng &amp; Nhóm Máy</span>
            </span>

            <div className="grid-2col">
              <div className="field-item">
                <label>Phân xưởng (Factory):</label>
                <div className="factory-segment-picker">
                  <button
                    type="button"
                    className={`segment-btn ${factory === "NM1" ? "active" : ""}`}
                    onClick={() => setFactory("NM1")}
                  >
                    NM1
                  </button>
                  <button
                    type="button"
                    className={`segment-btn ${factory === "NM2" ? "active" : ""}`}
                    onClick={() => setFactory("NM2")}
                  >
                    NM2
                  </button>
                </div>
              </div>

              <div className="field-item">
                <label>Loại thiết bị (Series):</label>
                <select
                  className="mobile-drawer-select"
                  value={machine}
                  onChange={(e) => setMachine(e.target.value)}
                >
                  {eqSeries.map((ele: string, idx: number) => (
                    <option key={idx} value={ele}>
                      {ele}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Nhóm 2: Cấu Hình Hiển Thị & Trình Chiếu TV */}
          <div className="filter-group">
            <span className="group-title">
              <FiTv size={14} color="#059669" />
              <span>Cấu Hình Hiển Thị &amp; Slide TV</span>
            </span>

            <div className="grid-2col">
              <div className="field-item">
                <label>Số máy / trang:</label>
                <select
                  className="mobile-drawer-select"
                  value={machineNumber}
                  onChange={(e) => setMachineNumber(Number(e.target.value))}
                >
                  <option value={4}>4 máy / trang</option>
                  <option value={6}>6 máy / trang</option>
                  <option value={8}>8 máy / trang</option>
                  <option value={12}>12 máy / trang</option>
                  <option value={16}>16 máy / trang</option>
                  <option value={20}>20 máy / trang</option>
                </select>
              </div>

              <div className="field-item">
                <label>Thời gian slide (giây):</label>
                <input
                  type="number"
                  min={3}
                  max={120}
                  className="mobile-drawer-input"
                  value={showTime}
                  onChange={(e) => {
                    const val = Math.max(3, Number(e.target.value) || 10);
                    setShowTime(val);
                    localStorage.setItem("showtimeout", val.toString());
                  }}
                />
              </div>
            </div>
          </div>

          {/* Nhóm 3: Trạng Thái & Chế Độ */}
          <div className="filter-group">
            <span className="group-title">
              <FiSliders size={14} color="#ea580c" />
              <span>Tùy Chọn Lọc &amp; Giao Diện</span>
            </span>

            {/* Checkbox Chỉ máy chạy */}
            <label className="mobile-drawer-checkbox">
              <input
                type="checkbox"
                checked={onlyRunning}
                onChange={(e) => setOnlyRunning(e.target.checked)}
              />
              <span className="checkbox-text">
                <FiCheckSquare size={14} color="#10b981" />
                <span>Chỉ hiển thị máy đang chạy (MASS / SETTING)</span>
              </span>
            </label>

            {/* Checkbox Tự slide */}
            <label className="mobile-drawer-checkbox">
              <input
                type="checkbox"
                checked={autoSlide}
                onChange={(e) => setAutoSlide(e.target.checked)}
              />
              <span className="checkbox-text">
                <FiTv size={14} color="#0284c7" />
                <span>Tự động chuyển trang TV (Auto Slide)</span>
              </span>
            </label>

            {/* Chế độ Giao diện Dark / Light */}
            <div className="field-item" style={{ marginTop: 8 }}>
              <label>Chế độ giao diện:</label>
              <div className="theme-toggle-row">
                <button
                  type="button"
                  className={`theme-btn ${theme === "theme-dark" ? "active" : ""}`}
                  onClick={() => {
                    if (theme !== "theme-dark") onToggleTheme();
                  }}
                >
                  <FiMoon size={13} />
                  <span>Dark Mode (Mặc định TV)</span>
                </button>
                <button
                  type="button"
                  className={`theme-btn ${theme === "theme-light" ? "active" : ""}`}
                  onClick={() => {
                    if (theme !== "theme-light") onToggleTheme();
                  }}
                >
                  <FiSun size={13} />
                  <span>Light Mode</span>
                </button>
              </div>
            </div>
          </div>

          {/* Nhóm 4: Tìm Kiếm Từ Khóa */}
          <div className="filter-group">
            <span className="group-title">
              <FiFilter size={14} color="#8b5cf6" />
              <span>Lọc Theo Từ Khóa</span>
            </span>

            <div className="field-item">
              <label>Mã hàng, Chỉ thị hoặc Tên máy:</label>
              <input
                type="text"
                className="mobile-drawer-input"
                placeholder="VD: ED01, 7C123, Chỉ thị SX..."
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-drawer-reset"
            onClick={onReset}
            title="Khôi phục mặc định"
          >
            <FiRotateCcw size={14} />
            <span>Đặt lại</span>
          </button>

          <button
            type="button"
            className="btn-drawer-apply"
            onClick={onClose}
            title="Áp dụng cấu hình và đóng"
          >
            <FiCheck size={16} />
            <span>Áp Dụng</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default PrecisionEqStatusMobileFilterDrawer;
