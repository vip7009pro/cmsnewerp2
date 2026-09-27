import React, { useState, useEffect } from "react";
import moment from "moment";
import { FiX, FiCheck, FiRotateCcw, FiCalendar, FiLayers, FiActivity } from "react-icons/fi";
import { PatrolFilterLane } from "./usePatrolData";

interface PrecisionPatrolMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isLive: boolean;
  fromDate: string;
  toDate: string;
  filterLane: PatrolFilterLane;
  autoRefresh: boolean;
  onApply: (params: {
    isLive: boolean;
    fromDate: string;
    toDate: string;
    filterLane: PatrolFilterLane;
    autoRefresh: boolean;
  }) => void;
  onReset: () => void;
}

export const PrecisionPatrolMobileFilterDrawer: React.FC<PrecisionPatrolMobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  isLive,
  fromDate,
  toDate,
  filterLane,
  autoRefresh,
  onApply,
  onReset,
}) => {
  const [draftLive, setDraftLive] = useState(isLive);
  const [draftFromDate, setDraftFromDate] = useState(fromDate);
  const [draftToDate, setDraftToDate] = useState(toDate);
  const [draftLane, setDraftLane] = useState<PatrolFilterLane>(filterLane);
  const [draftAutoRefresh, setDraftAutoRefresh] = useState(autoRefresh);

  useEffect(() => {
    if (isOpen) {
      setDraftLive(isLive);
      setDraftFromDate(fromDate);
      setDraftToDate(toDate);
      setDraftLane(filterLane);
      setDraftAutoRefresh(autoRefresh);
    }
  }, [isOpen, isLive, fromDate, toDate, filterLane, autoRefresh]);

  if (!isOpen) return null;

  const handleQuickDate = (days: number) => {
    setDraftLive(false);
    const end = moment().format("YYYY-MM-DD");
    const start = moment().subtract(days - 1, "days").format("YYYY-MM-DD");
    setDraftFromDate(start);
    setDraftToDate(end);
  };

  const handleYesterday = () => {
    setDraftLive(false);
    const yest = moment().subtract(1, "days").format("YYYY-MM-DD");
    setDraftFromDate(yest);
    setDraftToDate(yest);
  };

  const handleApply = () => {
    onApply({
      isLive: draftLive,
      fromDate: draftFromDate,
      toDate: draftToDate,
      filterLane: draftLane,
      autoRefresh: draftAutoRefresh,
    });
    onClose();
  };

  const handleResetInternal = () => {
    setDraftLive(true);
    const today = moment().format("YYYY-MM-DD");
    setDraftFromDate(today);
    setDraftToDate(today);
    setDraftLane("ALL");
    setDraftAutoRefresh(true);
    onReset();
    onClose();
  };

  return (
    <div className="precision-patrol-drawer-overlay" onClick={onClose}>
      <div
        className="precision-patrol-drawer-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FiCalendar className="title-icon" size={16} />
            <span>Bộ Lọc Patrol & Thời Gian</span>
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

        {/* Drawer Body */}
        <div className="drawer-body">
          {/* Nhóm 1: Chế độ Live vs Lịch Sử */}
          <div className="filter-group">
            <label className="group-label">Chế độ giám sát</label>
            <div className="mode-toggle-group">
              <button
                type="button"
                className={`toggle-option ${draftLive ? "active-live" : ""}`}
                onClick={() => {
                  setDraftLive(true);
                  const today = moment().format("YYYY-MM-DD");
                  setDraftFromDate(today);
                  setDraftToDate(today);
                }}
              >
                <span className={`status-indicator ${draftLive ? "pulse" : ""}`} />
                <span>Live Hôm Nay</span>
              </button>
              <button
                type="button"
                className={`toggle-option ${!draftLive ? "active-history" : ""}`}
                onClick={() => setDraftLive(false)}
              >
                <span>Tra Cứu Lịch Sử</span>
              </button>
            </div>
          </div>

          {/* Nhóm 2: Khoảng thời gian tra cứu (Nếu chọn Lịch Sử) */}
          {!draftLive && (
            <div className="filter-group date-picker-group">
              <label className="group-label">Khoảng ngày tra cứu</label>
              
              <div className="quick-dates-row">
                <button
                  type="button"
                  className="quick-btn"
                  onClick={() => handleQuickDate(1)}
                >
                  Hôm nay
                </button>
                <button
                  type="button"
                  className="quick-btn"
                  onClick={handleYesterday}
                >
                  Hôm qua
                </button>
                <button
                  type="button"
                  className="quick-btn"
                  onClick={() => handleQuickDate(3)}
                >
                  3 ngày
                </button>
                <button
                  type="button"
                  className="quick-btn"
                  onClick={() => handleQuickDate(7)}
                >
                  7 ngày
                </button>
              </div>

              <div className="inputs-date-pair">
                <div className="date-field">
                  <span className="field-hint">Từ ngày:</span>
                  <input
                    type="date"
                    className="mobile-date-input"
                    value={draftFromDate}
                    onChange={(e) => setDraftFromDate(e.target.value)}
                  />
                </div>
                <div className="date-field">
                  <span className="field-hint">Đến ngày:</span>
                  <input
                    type="date"
                    className="mobile-date-input"
                    value={draftToDate}
                    onChange={(e) => setDraftToDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Nhóm 3: Phân hệ sự cố */}
          <div className="filter-group">
            <label className="group-label">
              <FiLayers style={{ marginRight: "4px" }} />
              Phân hệ sự cố
            </label>
            <div className="lanes-selector">
              <button
                type="button"
                className={`lane-btn ${draftLane === "ALL" ? "active" : ""}`}
                onClick={() => setDraftLane("ALL")}
              >
                Tất Cả
              </button>
              <button
                type="button"
                className={`lane-btn ${draftLane === "PQC3" ? "active" : ""}`}
                onClick={() => setDraftLane("PQC3")}
              >
                Lỗi PQC3
              </button>
              <button
                type="button"
                className={`lane-btn ${draftLane === "DTC" ? "active" : ""}`}
                onClick={() => setDraftLane("DTC")}
              >
                Độ Tin Cậy DTC
              </button>
              <button
                type="button"
                className={`lane-btn ${draftLane === "INS" ? "active" : ""}`}
                onClick={() => setDraftLane("INS")}
              >
                Ngoại Quan INS
              </button>
            </div>
          </div>

          {/* Nhóm 4: Tùy chọn làm mới tự động */}
          <div className="filter-group">
            <label className="group-label">
              <FiActivity style={{ marginRight: "4px" }} />
              Tự động làm mới
            </label>
            <div className="switch-row">
              <span className="switch-desc">Tự động cập nhật dữ liệu sau mỗi 10 giây</span>
              <button
                type="button"
                className={`toggle-switch ${draftAutoRefresh ? "on" : "off"}`}
                onClick={() => setDraftAutoRefresh((prev) => !prev)}
              >
                <span className="switch-thumb" />
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Actions */}
        <div className="drawer-actions">
          <button
            type="button"
            className="btn-drawer-reset"
            onClick={handleResetInternal}
          >
            <FiRotateCcw size={14} />
            <span>Mặc Định</span>
          </button>

          <button
            type="button"
            className="btn-drawer-apply"
            onClick={handleApply}
          >
            <FiCheck size={16} />
            <span>Áp Dụng Lọc</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPatrolMobileFilterDrawer);
