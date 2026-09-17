import React from "react";
import { FiRefreshCw, FiDatabase } from "react-icons/fi";

interface PrecisionLichSuInputLieuHeaderProps {
  totalRecords: number;
  isLoading: boolean;
  onReload: () => void;
}

const PrecisionLichSuInputLieuHeader: React.FC<PrecisionLichSuInputLieuHeaderProps> = ({
  totalRecords,
  isLoading,
  onReload,
}) => {
  return (
    <div className="precision-inputlieu-header">
      <div className="precision-inputlieu-header__left">
        <span className="precision-inputlieu-header__badge-brand">QLSX PRECISION</span>
        <div className="precision-inputlieu-header__breadcrumb">
          <span>Kế Hoạch</span>
          <span className="sep">/</span>
          <span>Sản Xuất</span>
          <span className="sep">/</span>
          <span className="active">Lịch Sử Cấp Liệu Sản Xuất</span>
        </div>
      </div>

      <div className="precision-inputlieu-header__right">
        {/* Telemetry Status */}
        <div className="precision-inputlieu-header__telemetry">
          <span className="pulse-dot" />
          <span>Realtime Tracking</span>
        </div>

        <button
          type="button"
          className="btn-action btn-action--ghost"
          style={{ height: 24, padding: "0 8px", backgroundColor: "#ffffff" }}
          onClick={onReload}
          title="Tải lại dữ liệu theo bộ lọc"
        >
          <FiRefreshCw size={11} className={isLoading ? "spin-animation" : ""} />
          <span>Làm mới</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionLichSuInputLieuHeader);
