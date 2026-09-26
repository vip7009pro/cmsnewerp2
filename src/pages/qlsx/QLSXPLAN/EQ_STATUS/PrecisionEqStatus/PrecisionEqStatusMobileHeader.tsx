import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaTv, FaPlay, FaPause, FaExpand, FaCompress, FaMoon, FaSun } from "react-icons/fa";

interface PrecisionEqStatusMobileHeaderProps {
  factory: string;
  machineType: string;
  totalMachines: number;
  runningCount: number;
  settingCount: number;
  stopCount: number;
  currentPage: number;
  totalPages: number;
  autoSlide: boolean;
  onToggleAutoSlide: () => void;
  fullScreen: boolean;
  onToggleFullScreen: () => void;
  theme: "theme-dark" | "theme-light";
  onToggleTheme: () => void;
  countdownProgress: number;
}

export const PrecisionEqStatusMobileHeader: React.FC<
  PrecisionEqStatusMobileHeaderProps
> = React.memo(({
  factory,
  machineType,
  totalMachines,
  runningCount,
  settingCount,
  stopCount,
  currentPage,
  totalPages,
  autoSlide,
  onToggleAutoSlide,
  fullScreen,
  onToggleFullScreen,
  theme,
  onToggleTheme,
  countdownProgress,
}) => {
  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm:ss"));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format("HH:mm:ss"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const runningRate =
    totalMachines > 0
      ? Math.round(((runningCount + settingCount) / totalMachines) * 100)
      : 0;

  return (
    <header className="precision-eq-mobile-header">
      {/* Hàng 1: Info xưởng, Đồng hồ và Các nút điều khiển */}
      <div className="mobile-header-top-row">
        <div className="mobile-brand-box">
          <div className="mobile-brand-icon">
            <FaTv size={14} />
          </div>
          <div className="mobile-brand-text">
            <span className="mobile-brand-title">
              {factory} ({machineType})
            </span>
            <span className="mobile-clock-time">{currentTime}</span>
          </div>
        </div>

        <div className="mobile-header-actions">
          {/* Nút Auto-Slide */}
          <button
            type="button"
            className={`mobile-head-btn ${autoSlide ? "btn--active-slide" : ""}`}
            onClick={onToggleAutoSlide}
            title={autoSlide ? "Dừng tự động chuyển trang" : "Bật tự động chuyển trang"}
          >
            {autoSlide ? <FaPause size={10} /> : <FaPlay size={10} />}
            <span>{autoSlide ? "Dừng" : "Slide"}</span>
          </button>

          {/* Nút Đổi Theme */}
          <button
            type="button"
            className="mobile-head-btn"
            onClick={onToggleTheme}
            title="Đổi giao diện Sáng / Tối"
          >
            {theme === "theme-dark" ? <FaSun size={12} /> : <FaMoon size={12} />}
          </button>

          {/* Nút Fullscreen */}
          <button
            type="button"
            className="mobile-head-btn"
            onClick={onToggleFullScreen}
            title="Toàn màn hình TV"
          >
            {fullScreen ? <FaCompress size={12} /> : <FaExpand size={12} />}
          </button>
        </div>
      </div>

      {/* Hàng 2: Thanh Micro KPI cuộn ngang thích ứng */}
      <div className="mobile-header-kpi-row">
        <div className="mobile-kpi-chip kpi-total">
          <span className="kpi-label">Tổng:</span>
          <strong className="kpi-val">{totalMachines}</strong>
        </div>

        <div className="mobile-kpi-chip kpi-running">
          <span className="kpi-label">Chạy:</span>
          <strong className="kpi-val">{runningCount}</strong>
          <span className="kpi-pct">({runningRate}%)</span>
        </div>

        <div className="mobile-kpi-chip kpi-setting">
          <span className="kpi-label">Setting:</span>
          <strong className="kpi-val">{settingCount}</strong>
        </div>

        <div className="mobile-kpi-chip kpi-stop">
          <span className="kpi-label">Dừng:</span>
          <strong className="kpi-val">{stopCount}</strong>
        </div>

        <div className="mobile-kpi-chip kpi-page">
          <span className="kpi-label">Trang:</span>
          <strong className="kpi-val">
            {currentPage}/{totalPages || 1}
          </strong>
        </div>
      </div>

      {/* Thanh tiến độ đếm ngược chuyển trang visual */}
      {autoSlide && (
        <div className="mobile-countdown-bar">
          <div
            className="mobile-countdown-fill"
            style={{ width: `${countdownProgress}%` }}
          />
        </div>
      )}
    </header>
  );
});

export default PrecisionEqStatusMobileHeader;
