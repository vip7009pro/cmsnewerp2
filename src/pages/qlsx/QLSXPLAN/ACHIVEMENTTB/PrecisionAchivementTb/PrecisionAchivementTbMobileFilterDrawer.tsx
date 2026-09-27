import React from "react";
import moment from "moment";
import { IoClose } from "react-icons/io5";
import { FiRefreshCw, FiCheck } from "react-icons/fi";
import { MACHINE_LIST } from "../../interfaces/khsxInterface";

interface PrecisionAchivementTbMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fromdate: string;
  setFromDate: (val: string) => void;
  factory: string;
  setFactory: (val: string) => void;
  machine: string;
  setMachine: (val: string) => void;
  machine_list: MACHINE_LIST[];
  onApply: () => void;
  onReset: () => void;
}

export const PrecisionAchivementTbMobileFilterDrawer: React.FC<
  PrecisionAchivementTbMobileFilterDrawerProps
> = ({
  isOpen,
  onClose,
  fromdate,
  setFromDate,
  factory,
  setFactory,
  machine,
  setMachine,
  machine_list,
  onApply,
  onReset,
}) => {
  if (!isOpen) return null;

  const today = moment().format("YYYY-MM-DD");
  const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
  const beforeYesterday = moment().subtract(2, "days").format("YYYY-MM-DD");

  return (
    <div className="precision-mobile-drawer-overlay" onClick={onClose}>
      <div
        className="precision-mobile-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thanh kéo trang trí */}
        <div className="drawer-handle-bar" />

        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <span className="drawer-title">BỘ LỌC TỶ LỆ ĐẠT KHSX</span>
            <span className="drawer-subtitle">
              Tùy chỉnh ngày, xưởng và thiết bị sản xuất
            </span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            title="Đóng bộ lọc"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Thân bộ lọc */}
        <div className="drawer-body">
          {/* Nhóm 1: Ngày kế hoạch */}
          <div className="filter-group">
            <label className="filter-group-label">NGÀY KẾ HOẠCH (PLAN DATE)</label>
            <input
              type="date"
              className="filter-date-input"
              value={fromdate.slice(0, 10)}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <div className="quick-date-pills">
              <button
                type="button"
                className={`date-pill ${fromdate === today ? "active" : ""}`}
                onClick={() => setFromDate(today)}
              >
                Hôm nay
              </button>
              <button
                type="button"
                className={`date-pill ${fromdate === yesterday ? "active" : ""}`}
                onClick={() => setFromDate(yesterday)}
              >
                Hôm qua
              </button>
              <button
                type="button"
                className={`date-pill ${
                  fromdate === beforeYesterday ? "active" : ""
                }`}
                onClick={() => setFromDate(beforeYesterday)}
              >
                Hôm kia
              </button>
            </div>
          </div>

          {/* Nhóm 2: Phân xưởng */}
          <div className="filter-group">
            <label className="filter-group-label">PHÂN XƯỞNG (FACTORY)</label>
            <div className="segmented-selector">
              <button
                type="button"
                className={`segment-btn ${factory === "NM1" ? "active" : ""}`}
                onClick={() => setFactory("NM1")}
              >
                NHÀ MÁY 1 (NM1)
              </button>
              <button
                type="button"
                className={`segment-btn ${factory === "NM2" ? "active" : ""}`}
                onClick={() => setFactory("NM2")}
              >
                NHÀ MÁY 2 (NM2)
              </button>
            </div>
          </div>

          {/* Nhóm 3: Thiết bị */}
          <div className="filter-group">
            <label className="filter-group-label">THIẾT BỊ / MÁY DẬP</label>
            <select
              className="filter-select-input"
              value={machine}
              onChange={(e) => setMachine(e.target.value)}
            >
              <option value="ALL">TẤT CẢ MÁY (ALL)</option>
              {machine_list
                .filter((m) => m.EQ_NAME !== "ALL")
                .map((m, idx) => (
                  <option key={idx} value={m.EQ_NAME}>
                    {m.EQ_NAME}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Footer Thao Tác */}
        <div className="drawer-footer">
          <button
            type="button"
            className="drawer-btn drawer-btn--reset"
            onClick={onReset}
          >
            <FiRefreshCw size={14} />
            <span>ĐẶT LẠI</span>
          </button>
          <button
            type="button"
            className="drawer-btn drawer-btn--apply"
            onClick={onApply}
          >
            <FiCheck size={16} />
            <span>ÁP DỤNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
