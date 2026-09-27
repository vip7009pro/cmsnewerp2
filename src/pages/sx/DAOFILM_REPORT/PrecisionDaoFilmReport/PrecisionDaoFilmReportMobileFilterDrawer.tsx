import moment from "moment";
import React, { useState } from "react";
import { FiCalendar, FiCheck, FiRotateCcw, FiX } from "react-icons/fi";

interface PrecisionDaoFilmReportMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fromDate: string;
  toDate: string;
  useAllTime: boolean;
  onApply: (newFromDate: string, newToDate: string, newUseAllTime: boolean) => void;
  onReset: () => void;
}

export const PrecisionDaoFilmReportMobileFilterDrawer: React.FC<
  PrecisionDaoFilmReportMobileFilterDrawerProps
> = ({ isOpen, onClose, fromDate, toDate, useAllTime, onApply, onReset }) => {
  const [draftFromDate, setDraftFromDate] = useState<string>(fromDate);
  const [draftToDate, setDraftToDate] = useState<string>(toDate);
  const [draftUseAllTime, setDraftUseAllTime] = useState<boolean>(useAllTime);

  if (!isOpen) return null;

  const handleQuickDate = (days: number) => {
    setDraftUseAllTime(false);
    const end = moment().format("YYYY-MM-DD");
    const start = moment().subtract(days - 1, "days").format("YYYY-MM-DD");
    setDraftFromDate(start);
    setDraftToDate(end);
  };

  const handleSetAllTime = () => {
    setDraftUseAllTime(true);
  };

  const handleReset = () => {
    setDraftUseAllTime(true);
    setDraftFromDate(moment().format("YYYY-MM-DD"));
    setDraftToDate(moment().format("YYYY-MM-DD"));
    onReset();
    onClose();
  };

  const handleApply = () => {
    onApply(draftFromDate, draftToDate, draftUseAllTime);
    onClose();
  };

  return (
    <div className="precision-dfr-drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <FiCalendar size={16} className="drawer-icon" />
            <span className="drawer-title">Bộ Lọc Dữ Liệu Báo Cáo</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            title="Đóng bộ lọc"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {/* Nhóm 1: Chọn Chế Độ Thời Gian */}
          <div className="filter-group">
            <label className="group-label">Phạm vi thời gian</label>

            {/* Switch / Card Chọn All Time */}
            <div
              className={`alltime-option-card ${draftUseAllTime ? "alltime-option-card--active" : ""}`}
              onClick={() => setDraftUseAllTime(!draftUseAllTime)}
            >
              <div className="checkbox-custom">
                {draftUseAllTime && <FiCheck size={12} color="#ffffff" />}
              </div>
              <div className="option-text">
                <span className="option-title">Toàn bộ lịch sử (All-Time)</span>
                <span className="option-desc">Từ 2020-01-01 đến ngày hiện tại</span>
              </div>
            </div>

            {/* Quick date pills khi không dùng All-time */}
            <div className="quick-date-row">
              <button
                type="button"
                className={`quick-pill ${
                  !draftUseAllTime &&
                  draftFromDate === moment().format("YYYY-MM-DD") &&
                  draftToDate === moment().format("YYYY-MM-DD")
                    ? "quick-pill--active"
                    : ""
                }`}
                onClick={() => handleQuickDate(1)}
              >
                Hôm nay
              </button>

              <button
                type="button"
                className="quick-pill"
                onClick={() => handleQuickDate(3)}
              >
                3 ngày
              </button>

              <button
                type="button"
                className="quick-pill"
                onClick={() => handleQuickDate(7)}
              >
                7 ngày
              </button>

              <button
                type="button"
                className="quick-pill"
                onClick={() => handleQuickDate(30)}
              >
                30 ngày
              </button>

              <button
                type="button"
                className={`quick-pill ${draftUseAllTime ? "quick-pill--active" : ""}`}
                onClick={handleSetAllTime}
              >
                Tất cả
              </button>
            </div>
          </div>

          {/* Nhóm 2: Khoảng Ngày Tùy Chọn */}
          <div className="filter-group">
            <label className="group-label">Khoảng ngày tùy chọn</label>
            <div className="date-inputs-grid">
              <div className="date-field">
                <span className="field-label">Từ ngày:</span>
                <input
                  type="date"
                  className="date-input"
                  value={draftFromDate}
                  disabled={draftUseAllTime}
                  onChange={(e) => {
                    setDraftUseAllTime(false);
                    setDraftFromDate(e.target.value);
                  }}
                />
              </div>

              <div className="date-field">
                <span className="field-label">Đến ngày:</span>
                <input
                  type="date"
                  className="date-input"
                  value={draftToDate}
                  disabled={draftUseAllTime}
                  onChange={(e) => {
                    setDraftUseAllTime(false);
                    setDraftToDate(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-drawer btn-drawer--reset"
            onClick={handleReset}
          >
            <FiRotateCcw size={13} />
            <span>Đặt lại</span>
          </button>

          <button
            type="button"
            className="btn-drawer btn-drawer--apply"
            onClick={handleApply}
          >
            <FiCheck size={14} />
            <span>Áp dụng & Tải dữ liệu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDaoFilmReportMobileFilterDrawer);
