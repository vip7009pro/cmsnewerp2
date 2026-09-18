import React from "react";
import { FiRefreshCw, FiLayers } from "react-icons/fi";
import { DaoFilmMode } from "./useDaoFilmData";

interface PrecisionDaoFilmDataHeaderProps {
  mode: DaoFilmMode;
  totalRecords: number;
  loading: boolean;
  onReload: () => void;
}

export const PrecisionDaoFilmDataHeader: React.FC<PrecisionDaoFilmDataHeaderProps> = React.memo(
  ({ mode, totalRecords, loading, onReload }) => {
    const getModeLabel = () => {
      switch (mode) {
        case "GIAO_NHAN":
          return { label: "01. Lịch Sử Giao Nhận", cls: "precision-df-header__mode-badge--gn" };
        case "QUAN_LY":
          return { label: "02. Quản Lý Dao Film", cls: "precision-df-header__mode-badge--ql" };
        case "XUAT_DAO_FILM":
          return { label: "03. Lịch Sử Xuất Dao Film", cls: "precision-df-header__mode-badge--xuat" };
        default:
          return { label: "Dữ Liệu Dao Film", cls: "" };
      }
    };

    const modeInfo = getModeLabel();

    return (
      <div className="precision-df-header">
        <div className="precision-df-header__left">
          <span className="precision-df-header__badge-brand">SX PRECISION</span>
          <div className="precision-df-header__breadcrumb">
            <span>Sản Xuất</span>
            <span>/</span>
            <span>Khuôn Mẫu & Phim</span>
            <span>/</span>
            <span className="active">Quản Lý & Lịch Sử Dao Film</span>
          </div>
          <div className="precision-df-header__telemetry">
            <span className="pulse-dot" />
            <span>{loading ? "Đang đồng bộ..." : `${totalRecords.toLocaleString("en-US")} records`}</span>
          </div>
          <div className={`precision-df-header__mode-badge ${modeInfo.cls}`}>
            <FiLayers size={12} />
            <span>{modeInfo.label}</span>
          </div>
        </div>

        <div className="precision-df-header__right">
          <button
            type="button"
            className="precision-df-header__btn-action"
            onClick={onReload}
            title="Tải lại dữ liệu theo chế độ hiện tại"
            disabled={loading}
          >
            <FiRefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span>Tải Lại</span>
          </button>
        </div>
      </div>
    );
  }
);

export default PrecisionDaoFilmDataHeader;
