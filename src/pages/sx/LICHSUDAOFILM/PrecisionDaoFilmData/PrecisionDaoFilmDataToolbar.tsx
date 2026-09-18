import React from "react";
import {
  FiCalendar,
  FiSearch,
  FiBarChart2,
  FiGrid,
  FiLayers,
  FiFileText,
  FiTool,
  FiSend,
} from "react-icons/fi";
import { DaoFilmMode, DaoFilmView } from "./useDaoFilmData";

interface PrecisionDaoFilmDataToolbarProps {
  mode: DaoFilmMode;
  viewMode: DaoFilmView;
  fromDate: string;
  toDate: string;
  codeKD: string;
  codeCMS: string;
  knifeType: string;
  factory: string;
  planId: string;
  id: string;
  allTime: boolean;
  totalRecords: number;
  loading: boolean;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onCodeKDChange: (val: string) => void;
  onCodeCMSChange: (val: string) => void;
  onKnifeTypeChange: (val: string) => void;
  onFactoryChange: (val: string) => void;
  onPlanIdChange: (val: string) => void;
  onIdChange: (val: string) => void;
  onAllTimeChange: (val: boolean) => void;
  onQuickDate: (days: number) => void;
  onViewModeChange: (val: DaoFilmView) => void;
  onFetchGiaoNhan: () => void;
  onFetchQuanLy: () => void;
  onFetchLichSuXuat: () => void;
}

export const PrecisionDaoFilmDataToolbar: React.FC<PrecisionDaoFilmDataToolbarProps> = React.memo(
  ({
    mode,
    viewMode,
    fromDate,
    toDate,
    codeKD,
    codeCMS,
    knifeType,
    factory,
    planId,
    id,
    allTime,
    totalRecords,
    loading,
    onFromDateChange,
    onToDateChange,
    onCodeKDChange,
    onCodeCMSChange,
    onKnifeTypeChange,
    onFactoryChange,
    onPlanIdChange,
    onIdChange,
    onAllTimeChange,
    onQuickDate,
    onViewModeChange,
    onFetchGiaoNhan,
    onFetchQuanLy,
    onFetchLichSuXuat,
  }) => {
    return (
      <div className="precision-df-toolbar">
        {/* Row 1: Các bộ lọc tham số */}
        <div className="precision-df-toolbar__row1">
          <div className="precision-df-toolbar__filters">
            {/* Date Range */}
            <div className="precision-df-toolbar__date-group">
              <label>Từ:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => onFromDateChange(e.target.value)}
                disabled={allTime}
              />
              <span className="date-sep">~</span>
              <label>Đến:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => onToDateChange(e.target.value)}
                disabled={allTime}
              />
            </div>

            {/* Quick date presets */}
            <div className="precision-df-toolbar__quick-dates">
              <button type="button" onClick={() => onQuickDate(1)} title="Hôm nay">1D</button>
              <button type="button" onClick={() => onQuickDate(3)} title="3 ngày gần nhất">3D</button>
              <button type="button" onClick={() => onQuickDate(7)} title="7 ngày gần nhất">7D</button>
              <button type="button" onClick={() => onQuickDate(30)} title="30 ngày gần nhất">30D</button>
            </div>

            {/* All Time Checkbox */}
            <label className="precision-df-toolbar__checkbox-alltime">
              <input
                type="checkbox"
                checked={allTime}
                onChange={(e) => onAllTimeChange(e.target.checked)}
              />
              <span>All Time</span>
            </label>

            {/* Code KD */}
            <div className="precision-df-toolbar__input-item">
              <span className="label">Code KD:</span>
              <input
                type="text"
                value={codeKD}
                onChange={(e) => onCodeKDChange(e.target.value)}
                placeholder="GH63-xxxx"
              />
            </div>

            {/* Code CMS / ERP */}
            <div className="precision-df-toolbar__input-item">
              <span className="label">Code ERP:</span>
              <input
                type="text"
                value={codeCMS}
                onChange={(e) => onCodeCMSChange(e.target.value)}
                placeholder="7C123xxx"
              />
            </div>

            {/* Phân Loại */}
            <div className="precision-df-toolbar__input-item">
              <span className="label">Loại:</span>
              <select
                value={knifeType}
                onChange={(e) => onKnifeTypeChange(e.target.value)}
              >
                <option value="All">All</option>
                <option value="CTF">CTF</option>
                <option value="CTP">CTP</option>
                <option value="PVC">PVC</option>
                <option value="PINACLE">PINACLE</option>
              </select>
            </div>

            {/* Nhà Máy */}
            <div className="precision-df-toolbar__input-item">
              <span className="label">NM:</span>
              <select
                value={factory}
                onChange={(e) => onFactoryChange(e.target.value)}
              >
                <option value="All">All</option>
                <option value="NM1">NM1</option>
                <option value="NM2">NM2</option>
              </select>
            </div>

            {/* PLAN_ID */}
            <div className="precision-df-toolbar__input-item">
              <span className="label">PLAN:</span>
              <input
                type="text"
                value={planId}
                onChange={(e) => onPlanIdChange(e.target.value)}
                placeholder="1F80008A"
              />
            </div>
          </div>
        </div>

        {/* Row 2: 3 Nút Chế Độ Tra Cứu & Segmented View Switcher */}
        <div className="precision-df-toolbar__row2">
          <div className="precision-df-toolbar__modes">
            {/* Button 1: Giao Nhận */}
            <button
              type="button"
              className={`precision-df-toolbar__btn-mode ${
                mode === "GIAO_NHAN" ? "precision-df-toolbar__btn-mode--active-gn" : ""
              }`}
              onClick={onFetchGiaoNhan}
              disabled={loading}
              title="Tra cứu lịch sử bàn giao dao film"
            >
              <FiFileText size={13} />
              <span>LS GIAO NHẬN</span>
              {mode === "GIAO_NHAN" && (
                <span className="badge-count">{totalRecords}</span>
              )}
            </button>

            {/* Button 2: Quản Lý Dao Film */}
            <button
              type="button"
              className={`precision-df-toolbar__btn-mode ${
                mode === "QUAN_LY" ? "precision-df-toolbar__btn-mode--active-ql" : ""
              }`}
              onClick={onFetchQuanLy}
              disabled={loading}
              title="Quản lý thông số & tuổi thọ khuôn dao film"
            >
              <FiTool size={13} />
              <span>QL DAO FILM</span>
              {mode === "QUAN_LY" && (
                <span className="badge-count">{totalRecords}</span>
              )}
            </button>

            {/* Button 3: Lịch Sử Xuất Dao Film */}
            <button
              type="button"
              className={`precision-df-toolbar__btn-mode ${
                mode === "XUAT_DAO_FILM" ? "precision-df-toolbar__btn-mode--active-xuat" : ""
              }`}
              onClick={onFetchLichSuXuat}
              disabled={loading}
              title="Lịch sử xuất cấp dao film vào sản xuất"
            >
              <FiSend size={13} />
              <span>LS XUẤT DF</span>
              {mode === "XUAT_DAO_FILM" && (
                <span className="badge-count">{totalRecords}</span>
              )}
            </button>
          </div>

          {/* Segmented View Switcher */}
          <div className="segmented-switch">
            <button
              type="button"
              className={`segmented-switch__btn ${
                viewMode === "all" ? "segmented-switch__btn--active" : ""
              }`}
              onClick={() => onViewModeChange("all")}
              title="Hiển thị toàn bộ KPI, Biểu đồ và Bảng dữ liệu"
            >
              <FiLayers size={11} />
              <span>Toàn Bộ</span>
            </button>
            <button
              type="button"
              className={`segmented-switch__btn ${
                viewMode === "charts" ? "segmented-switch__btn--active" : ""
              }`}
              onClick={() => onViewModeChange("charts")}
              title="Tập trung xem hệ thống biểu đồ phân tích"
            >
              <FiBarChart2 size={11} />
              <span>Biểu Đồ</span>
            </button>
            <button
              type="button"
              className={`segmented-switch__btn ${
                viewMode === "grid" ? "segmented-switch__btn--active" : ""
              }`}
              onClick={() => onViewModeChange("grid")}
              title="Mở rộng tối đa bảng dữ liệu lưới"
            >
              <FiGrid size={11} />
              <span>Bảng Dữ Liệu</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default PrecisionDaoFilmDataToolbar;
