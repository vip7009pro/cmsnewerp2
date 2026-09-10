import React, { memo } from "react";
import {
  FiDollarSign,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiActivity,
} from "react-icons/fi";
import { MdCalculate } from "react-icons/md";

interface Props {
  activeTab: number;
  onTabChange: (tabIndex: number) => void;
  priceCount?: number;
  auditCount?: number;
  approvedCount?: number;
  approvedRate?: string;
  duplicateCount?: number;
  exchangeRate?: number | string;
}

const PrecisionQuotationHeader: React.FC<Props> = ({
  activeTab,
  onTabChange,
  priceCount = 3842,
  auditCount = 128,
  approvedCount = 3710,
  approvedRate = "96.5%",
  duplicateCount = 14,
  exchangeRate = "25,480",
}) => {
  return (
    <div className="precision-quotation__header">
      {/* 3 Primary Business Sub-Tabs */}
      <div className="precision-quotation__tabs-group">
        <button
          className={`precision-quotation__tab-btn${activeTab === 0 ? " precision-quotation__tab-btn--active" : ""}`}
          onClick={() => onTabChange(0)}
        >
          <FiDollarSign />
          <span>1. Quản lý giá (Price Master)</span>
          {priceCount > 0 && (
            <span className="precision-quotation__tab-badge">
              {priceCount.toLocaleString()}
            </span>
          )}
        </button>

        <button
          className={`precision-quotation__tab-btn${activeTab === 1 ? " precision-quotation__tab-btn--active" : ""}`}
          onClick={() => onTabChange(1)}
        >
          <MdCalculate />
          <span>2. Tính báo giá (Costing & BOM)</span>
        </button>

        <button
          className={`precision-quotation__tab-btn${activeTab === 2 ? " precision-quotation__tab-btn--active" : ""}`}
          onClick={() => onTabChange(2)}
        >
          <FiClock />
          <span>3. Lịch sử xóa giá (Audit Log)</span>
          {auditCount > 0 && (
            <span className="precision-quotation__tab-badge precision-quotation__tab-badge--rose">
              {auditCount.toLocaleString()}
            </span>
          )}
        </button>
      </div>

      {/* Header KPIs Cards Strip */}
      <div className="precision-quotation__kpis">
        {/* KPI 1: Approved Price */}
        <div className="precision-quotation__kpi-card precision-quotation__kpi-card--emerald">
          <div className="precision-quotation__kpi-icon">
            <FiCheckCircle />
          </div>
          <div className="precision-quotation__kpi-content">
            <span className="precision-quotation__kpi-label">ĐÃ DUYỆT GIÁ (Y)</span>
            <span className="precision-quotation__kpi-val">
              {approvedCount.toLocaleString()} SP <small>({approvedRate})</small>
            </span>
          </div>
        </div>

        {/* KPI 2: Duplicate Alert */}
        <div className="precision-quotation__kpi-card precision-quotation__kpi-card--rose">
          <div className="precision-quotation__kpi-icon">
            <FiAlertTriangle />
          </div>
          <div className="precision-quotation__kpi-content">
            <span className="precision-quotation__kpi-label">TRÙNG MÃ (NG)</span>
            <span className="precision-quotation__kpi-val">
              {duplicateCount} Dòng <small style={{ color: "#e11d48", fontWeight: 700 }}>(Cần xử lý)</small>
            </span>
          </div>
        </div>

        {/* KPI 3: Exchange Rate */}
        <div className="precision-quotation__kpi-card precision-quotation__kpi-card--blue">
          <div className="precision-quotation__kpi-icon">
            <FiActivity />
          </div>
          <div className="precision-quotation__kpi-content">
            <span className="precision-quotation__kpi-label">TỈ GIÁ USD/VND</span>
            <span className="precision-quotation__kpi-val">
              {exchangeRate} <small>VND</small>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PrecisionQuotationHeader);
