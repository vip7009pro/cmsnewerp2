import React from "react";
import moment from "moment";
import {
  FiFilter,
  FiX,
  FiRotateCcw,
  FiCheck,
  FiCalendar,
  FiLayers,
  FiTool,
  FiTag,
  FiSliders,
} from "react-icons/fi";
import { DaoFilmMode } from "./useDaoFilmData";

interface PrecisionDaoFilmDataMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: DaoFilmMode;
  fromDate: string;
  toDate: string;
  allTime: boolean;
  codeKD: string;
  codeCMS: string;
  knifeType: string;
  factory: string;
  planId: string;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onAllTimeChange: (val: boolean) => void;
  onCodeKDChange: (val: string) => void;
  onCodeCMSChange: (val: string) => void;
  onKnifeTypeChange: (val: string) => void;
  onFactoryChange: (val: string) => void;
  onPlanIdChange: (val: string) => void;
  onQuickDate: (days: number) => void;
  onApply: () => void;
  onReset: () => void;
}

export const PrecisionDaoFilmDataMobileFilterDrawer: React.FC<
  PrecisionDaoFilmDataMobileFilterDrawerProps
> = ({
  isOpen,
  onClose,
  mode,
  fromDate,
  toDate,
  allTime,
  codeKD,
  codeCMS,
  knifeType,
  factory,
  planId,
  onFromDateChange,
  onToDateChange,
  onAllTimeChange,
  onCodeKDChange,
  onCodeCMSChange,
  onKnifeTypeChange,
  onFactoryChange,
  onPlanIdChange,
  onQuickDate,
  onApply,
  onReset,
}) => {
  if (!isOpen) return null;

  const isToday =
    fromDate?.slice(0, 10) === moment().format("YYYY-MM-DD") &&
    toDate?.slice(0, 10) === moment().format("YYYY-MM-DD") &&
    !allTime;

  const handleApplyClick = () => {
    onApply();
    onClose();
  };

  return (
    <div className="precision-mobile-drawer-backdrop" onClick={onClose}>
      <div className="precision-mobile-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Thanh kéo trang trí */}
        <div className="drawer-drag-handle" />

        {/* Header Drawer */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FiFilter className="filter-icon" />
            <span>BỘ LỌC DAO FILM</span>
          </div>
          <button
            type="button"
            className="btn-close-drawer"
            onClick={onClose}
            title="Đóng bộ lọc"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Thân Bộ Lọc */}
        <div className="drawer-body">
          {/* Nhóm 1: Khoảng ngày */}
          <div className="filter-section">
            <label className="section-label">
              <FiCalendar size={13} />
              <span>Khoảng ngày giao nhận / sử dụng:</span>
            </label>

            <div className="date-inputs-row">
              <div className="date-field">
                <span className="field-hint">Từ ngày</span>
                <input
                  type="date"
                  value={fromDate ? fromDate.slice(0, 10) : ""}
                  onChange={(e) => onFromDateChange(e.target.value)}
                  disabled={allTime}
                />
              </div>
              <div className="date-field">
                <span className="field-hint">Đến ngày</span>
                <input
                  type="date"
                  value={toDate ? toDate.slice(0, 10) : ""}
                  onChange={(e) => onToDateChange(e.target.value)}
                  disabled={allTime}
                />
              </div>
            </div>

            {/* Quick chọn ngày */}
            <div className="quick-dates-pills">
              <button
                type="button"
                className={`quick-pill ${isToday ? "quick-pill--active" : ""}`}
                onClick={() => onQuickDate(1)}
              >
                Hôm nay
              </button>
              <button
                type="button"
                className="quick-pill"
                onClick={() => onQuickDate(3)}
              >
                3 ngày
              </button>
              <button
                type="button"
                className="quick-pill"
                onClick={() => onQuickDate(7)}
              >
                7 ngày
              </button>
              <button
                type="button"
                className="quick-pill"
                onClick={() => onQuickDate(30)}
              >
                30 ngày
              </button>
              <button
                type="button"
                className={`quick-pill ${allTime ? "quick-pill--active" : ""}`}
                onClick={() => onAllTimeChange(!allTime)}
              >
                {allTime ? "✓ All Time" : "All Time"}
              </button>
            </div>
          </div>

          {/* Nhóm 2: Nhà máy & Phân loại dao */}
          <div className="filter-section">
            <label className="section-label">
              <FiSliders size={13} />
              <span>Nhà máy & Loại khuôn dao:</span>
            </label>

            <div className="filter-grid-2">
              <div className="filter-field">
                <span className="field-hint">Nhà máy</span>
                <select
                  value={factory}
                  onChange={(e) => onFactoryChange(e.target.value)}
                >
                  <option value="All">Tất cả nhà máy</option>
                  <option value="NM1">Nhà máy 1 (NM1)</option>
                  <option value="NM2">Nhà máy 2 (NM2)</option>
                </select>
              </div>

              <div className="filter-field">
                <span className="field-hint">Loại dao</span>
                <select
                  value={knifeType}
                  onChange={(e) => onKnifeTypeChange(e.target.value)}
                >
                  <option value="All">Tất cả loại</option>
                  <option value="CTF">CTF</option>
                  <option value="CTP">CTP</option>
                  <option value="PVC">PVC</option>
                  <option value="PINACLE">PINACLE</option>
                </select>
              </div>
            </div>
          </div>

          {/* Nhóm 3: Code KD & Code ERP */}
          <div className="filter-section">
            <label className="section-label">
              <FiTag size={13} />
              <span>Mã sản phẩm:</span>
            </label>

            <div className="filter-grid-2">
              <div className="filter-field">
                <span className="field-hint">Code KD</span>
                <input
                  type="text"
                  placeholder="GH63-xxxx..."
                  value={codeKD}
                  onChange={(e) => onCodeKDChange(e.target.value)}
                />
              </div>

              <div className="filter-field">
                <span className="field-hint">Code ERP</span>
                <input
                  type="text"
                  placeholder="7C123xxx..."
                  value={codeCMS}
                  onChange={(e) => onCodeCMSChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Nhóm 4: Plan ID / Lệnh Sản Xuất */}
          <div className="filter-section">
            <label className="section-label">
              <FiLayers size={13} />
              <span>Chỉ thị kế hoạch (Plan ID):</span>
            </label>

            <div className="filter-field">
              <input
                type="text"
                placeholder="Nhập Plan ID (VD: 1F80008A...)"
                value={planId}
                onChange={(e) => onPlanIdChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-drawer-reset"
            onClick={onReset}
          >
            <FiRotateCcw size={12} />
            <span>Đặt lại</span>
          </button>

          <button
            type="button"
            className="btn-drawer-apply"
            onClick={handleApplyClick}
          >
            <FiCheck size={13} />
            <span>Áp dụng bộ lọc</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDaoFilmDataMobileFilterDrawer);
