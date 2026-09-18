import React from "react";
import { FiRefreshCw, FiCpu, FiActivity } from "react-icons/fi";

interface PrecisionCapaSxHeaderProps {
  onReload: () => void;
  totalMachines: number;
  totalWorkforce: number;
}

export const PrecisionCapaSxHeader: React.FC<PrecisionCapaSxHeaderProps> = ({
  onReload,
  totalMachines,
  totalWorkforce,
}) => {
  return (
    <header className="precision-capa-header">
      <div className="precision-capa-header__left">
        <span className="precision-capa-header__badge-brand">CMS QLSX</span>
        <div className="precision-capa-header__breadcrumb">
          <span>Kế Hoạch Sản Xuất</span>
          <span>/</span>
          <span className="active">Quản Lý Năng Lực Thiết Bị & Nhân Lực (CAPA)</span>
        </div>
        <div className="precision-capa-header__telemetry">
          <span className="pulse-dot"></span>
          <span>Hệ Thống Sẵn Sàng ({totalMachines} Máy • {totalWorkforce} Nhân Lực)</span>
        </div>
      </div>

      <div className="precision-capa-header__right">
        <button
          type="button"
          className="precision-capa-header__btn-action"
          onClick={onReload}
          title="Đồng bộ lại toàn bộ dữ liệu máy & nhân lực"
        >
          <FiRefreshCw size={12} />
          <span>Tải Lại</span>
        </button>
      </div>
    </header>
  );
};

export default React.memo(PrecisionCapaSxHeader);
