import React from "react";
import { FiRefreshCw, FiEye, FiEyeOff } from "react-icons/fi";

interface PrecisionCapaSx2HeaderProps {
  onReload: () => void;
  totalMachines: number;
  totalWorkforce: number;
  isMobile?: boolean;
  showKpi?: boolean;
  onToggleKpi?: () => void;
  isLoading?: boolean;
}

export const PrecisionCapaSx2Header: React.FC<PrecisionCapaSx2HeaderProps> = ({
  onReload,
  totalMachines,
  totalWorkforce,
  isMobile = false,
  showKpi = true,
  onToggleKpi,
  isLoading = false,
}) => {
  return (
    <header className={`precision-capa-header ${isMobile ? "precision-capa-header--mobile" : ""}`}>
      <div className="precision-capa-header__left">
        <span className="precision-capa-header__badge-brand">
          {isMobile ? "CAPA 2" : "CMS QLSX"}
        </span>

        {!isMobile && (
          <div className="precision-capa-header__breadcrumb">
            <span>Kế Hoạch Sản Xuất</span>
            <span>/</span>
            <span className="active">Quản Lý Năng Lực Thiết Bị & Nhân Lực (CAPA 2)</span>
          </div>
        )}

        <div className="precision-capa-header__telemetry">
          <span className="pulse-dot"></span>
          <span>
            {isMobile
              ? `${totalMachines} Máy • ${totalWorkforce} NL`
              : `Hệ Thống Sẵn Sàng (${totalMachines} Máy • ${totalWorkforce} Nhân Lực)`}
          </span>
        </div>
      </div>

      <div className="precision-capa-header__right">
        {isMobile && onToggleKpi && (
          <button
            type="button"
            className={`precision-capa-header__btn-action ${showKpi ? "precision-capa-header__btn-action--active" : ""}`}
            onClick={onToggleKpi}
            title={showKpi ? "Ẩn khối KPI chỉ số" : "Hiện khối KPI chỉ số"}
          >
            {showKpi ? <FiEyeOff size={13} /> : <FiEye size={13} />}
            <span>KPI</span>
          </button>
        )}

        <button
          type="button"
          className="precision-capa-header__btn-action"
          onClick={onReload}
          disabled={isLoading}
          title="Đồng bộ lại toàn bộ dữ liệu máy & năng lực"
        >
          <FiRefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
          {!isMobile && <span>{isLoading ? "Đang Tải..." : "Tải Lại"}</span>}
        </button>
      </div>
    </header>
  );
};

export default React.memo(PrecisionCapaSx2Header);
