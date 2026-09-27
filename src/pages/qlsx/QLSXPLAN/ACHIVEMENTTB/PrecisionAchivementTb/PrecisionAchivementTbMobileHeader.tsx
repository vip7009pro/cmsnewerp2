import React from "react";
import moment from "moment";
import { AiOutlineBarChart } from "react-icons/ai";
import { IoReload } from "react-icons/io5";

interface PrecisionAchivementTbMobileHeaderProps {
  factory: string;
  machine: string;
  fromdate: string;
  showKpi: boolean;
  onToggleKpi: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  totalOrders: number;
}

export const PrecisionAchivementTbMobileHeader: React.FC<
  PrecisionAchivementTbMobileHeaderProps
> = ({
  factory,
  machine,
  fromdate,
  showKpi,
  onToggleKpi,
  onRefresh,
  isLoading,
  totalOrders,
}) => {
  const formattedDate = moment(fromdate).isValid()
    ? moment(fromdate).format("DD/MM")
    : fromdate;

  return (
    <div className="precision-achivementtb__mobileHeader">
      <div className="mobileHeader-left">
        <span className="brand-badge">03. QLSX</span>
        <span className="pulse-dot" title="Live realtime" />
        <div className="mobileHeader-title">
          <span className="title-text">TỶ LỆ ĐẠT KH</span>
          <div className="sub-info-tags">
            <span className="info-chip info-chip--factory">{factory}</span>
            <span className="info-chip info-chip--machine">
              {machine === "ALL" ? "TẤT CẢ MÁY" : machine}
            </span>
            <span className="info-chip info-chip--date">{formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="mobileHeader-right">
        {/* Nút bật/tắt dải Micro-KPI */}
        <button
          type="button"
          className={`mobile-header-btn ${showKpi ? "active" : ""}`}
          onClick={onToggleKpi}
          title="Bật/Tắt dải chỉ số KPI nhanh"
        >
          <AiOutlineBarChart size={16} />
          <span className="btn-label">KPI</span>
        </button>

        {/* Nút Làm Mới */}
        <button
          type="button"
          className={`mobile-header-btn ${isLoading ? "spinning" : ""}`}
          onClick={onRefresh}
          disabled={isLoading}
          title="Tải lại dữ liệu"
        >
          <IoReload size={15} />
        </button>
      </div>
    </div>
  );
};
