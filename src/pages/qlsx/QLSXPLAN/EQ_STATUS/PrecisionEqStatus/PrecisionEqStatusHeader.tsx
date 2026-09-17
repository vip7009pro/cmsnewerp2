import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaTv, FaPlay, FaPause, FaExpand, FaCompress, FaMoon, FaSun } from "react-icons/fa";

interface PrecisionEqStatusHeaderProps {
  factory: string;
  machineType: string;
  totalMachines: number;
  runningCount: number;
  settingCount: number;
  stopCount: number;
  currentPage: number;
  totalPages: number;
  startIdx: number;
  endIdx: number;
  totalFiltered: number;
  autoSlide: boolean;
  onToggleAutoSlide: () => void;
  fullScreen: boolean;
  onToggleFullScreen: () => void;
  theme: "theme-dark" | "theme-light";
  onToggleTheme: () => void;
  countdownProgress: number; // 0 -> 100%
}

export const PrecisionEqStatusHeader: React.FC<PrecisionEqStatusHeaderProps> = React.memo(({
  factory,
  machineType,
  totalMachines,
  runningCount,
  settingCount,
  stopCount,
  currentPage,
  totalPages,
  startIdx,
  endIdx,
  totalFiltered,
  autoSlide,
  onToggleAutoSlide,
  fullScreen,
  onToggleFullScreen,
  theme,
  onToggleTheme,
  countdownProgress,
}) => {
  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm:ss"));
  const [currentDate, setCurrentDate] = useState(moment().format("DD/MM/YYYY - dddd"));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format("HH:mm:ss"));
      setCurrentDate(moment().format("DD/MM/YYYY - dddd"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const runningRate = totalMachines > 0 ? Math.round(((runningCount + settingCount) / totalMachines) * 100) : 0;

  return (
    <header className="precision-eq-header">
      {/* 1. Bên trái: Brand Logo & Phân xưởng */}
      <div className="header-left">
        <div className="brand-icon-box">
          <FaTv />
        </div>
        <div className="brand-info">
          <span className="brand-title">
            ANDON GIÁM SÁT MÁY - {factory} ({machineType})
          </span>
          <span className="brand-subtitle">HỆ THỐNG TRỰC QUAN HÓA THỜI GIAN THỰC</span>
        </div>
      </div>

      {/* 2. Ở giữa: Đồng hồ số Andon & Thống kê toàn xưởng */}
      <div className="header-center">
        <div className="andon-clock">
          <span className="clock-time">{currentTime}</span>
          <span className="clock-date">{currentDate}</span>
        </div>

        <div className="andon-kpi-group">
          <div className="andon-kpi-badge">
            <span className="badge-title">TỔNG MÁY:</span>
            <span className="badge-num">{totalMachines}</span>
          </div>

          <div className="andon-kpi-badge kpi-running">
            <span className="badge-title">CHẠY (MASS):</span>
            <span className="badge-num">
              {runningCount} ({runningRate}%)
            </span>
          </div>

          <div className="andon-kpi-badge kpi-setting">
            <span className="badge-title">SETTING:</span>
            <span className="badge-num">{settingCount}</span>
          </div>

          <div className="andon-kpi-badge kpi-stop">
            <span className="badge-title">DỪNG (STOP):</span>
            <span className="badge-num">{stopCount}</span>
          </div>
        </div>
      </div>

      {/* 3. Bên phải: Phân trang & Nút điều khiển TV */}
      <div className="header-right">
        <div className="page-indicator-chip">
          <span>
            Trang {currentPage}/{totalPages || 1} (Máy {startIdx} - {endIdx} / {totalFiltered})
          </span>
        </div>

        <button
          className="btn-header-action"
          onClick={onToggleAutoSlide}
          title={autoSlide ? "Tạm dừng tự đổi trang" : "Bật tự động đổi trang TV"}
        >
          {autoSlide ? <FaPause /> : <FaPlay />}
          <span>{autoSlide ? "Dừng Slide" : "Tự Slide"}</span>
        </button>

        <button
          className="btn-header-action"
          onClick={onToggleTheme}
          title="Chuyển chế độ Giao diện Dark / Light"
        >
          {theme === "theme-dark" ? <FaSun /> : <FaMoon />}
        </button>

        <button
          className="btn-header-action"
          onClick={onToggleFullScreen}
          title="Chiếu Toàn Màn Hình TV (Fullscreen)"
        >
          {fullScreen ? <FaCompress /> : <FaExpand />}
          <span>{fullScreen ? "Thu Nhỏ" : "Toàn Màn Hình"}</span>
        </button>
      </div>

      {/* Thanh đếm ngược chuyển trang visual */}
      {autoSlide && (
        <div className="countdown-bar-container">
          <div className="countdown-bar-fill" style={{ width: `${countdownProgress}%` }} />
        </div>
      )}
    </header>
  );
});
