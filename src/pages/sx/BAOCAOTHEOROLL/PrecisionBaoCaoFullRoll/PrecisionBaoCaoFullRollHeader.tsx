import React from "react";
import { FiRefreshCw, FiLayers } from "react-icons/fi";

interface PrecisionBaoCaoFullRollHeaderProps {
  totalRows: number;
  isLoading: boolean;
  onReload: () => void;
}

const PrecisionBaoCaoFullRollHeader: React.FC<PrecisionBaoCaoFullRollHeaderProps> = ({
  totalRows,
  isLoading,
  onReload,
}) => {
  return (
    <header className="precision-bcfr-header">
      <div className="precision-bcfr-header__left">
        <span className="precision-bcfr-header__badge-brand">SX PRECISION</span>
        <div className="precision-bcfr-header__breadcrumb">
          <FiLayers size={13} color="#0284c7" />
          <span>Báo Cáo Sản Xuất</span>
          <span>/</span>
          <span className="active">Báo Cáo Full Roll (Roll Production Analytics)</span>
        </div>
        <div className="precision-bcfr-header__telemetry">
          <span className="pulse-dot" />
          <span>Dữ liệu: <strong>{totalRows.toLocaleString("en-US")}</strong> dòng</span>
        </div>
      </div>

      <div className="precision-bcfr-header__right">
        <button
          type="button"
          className="precision-bcfr-header__btn-action"
          onClick={onReload}
          disabled={isLoading}
          title="Tải lại dữ liệu"
        >
          <FiRefreshCw size={11} className={isLoading ? "spin" : ""} />
          <span>{isLoading ? "Đang tải..." : "Làm Mới"}</span>
        </button>
      </div>
    </header>
  );
};

export default React.memo(PrecisionBaoCaoFullRollHeader);
export { PrecisionBaoCaoFullRollHeader };
