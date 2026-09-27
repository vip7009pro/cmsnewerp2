import React from "react";
import {
  FiLayers,
  FiCpu,
  FiCheckCircle,
  FiTool,
  FiAlertTriangle,
  FiAward,
  FiX,
} from "react-icons/fi";

interface PrecisionBaoCaoFullRollMobileKpiProps {
  kpiData: {
    inputMet: number;
    outKhoMet: number;
    inputM2: number;
    usedMet: number;
    remainMet: number;
    yieldRate: number;
    resultMet: number;
    resultEa: number;
    resultM2: number;
    settingMet: number;
    settingEa: number;
    settingLossRate: number;
    prNgMet: number;
    prNgEa: number;
    ngLossRate: number;
    insTotalMet: number;
    insOkMet: number;
    insOkRate: number;
  };
  onClose: () => void;
}

export const PrecisionBaoCaoFullRollMobileKpi: React.FC<PrecisionBaoCaoFullRollMobileKpiProps> = ({
  kpiData,
  onClose,
}) => {
  const fmt = (val: number, digits = 0) =>
    val?.toLocaleString("en-US", { maximumFractionDigits: digits }) ?? "0";

  return (
    <div className="precision-bcr-mobile-kpi">
      <div className="kpi-scroll-container">
        {/* 1. Tổng Cấp Liệu */}
        <div className="mobile-kpi-chip mobile-kpi-chip--blue">
          <div className="chip-icon">
            <FiLayers />
          </div>
          <div className="chip-content">
            <span className="chip-label">CẤP LIỆU (m)</span>
            <span className="chip-value">{fmt(kpiData.inputMet)}</span>
            <span className="chip-sub">Xuất: {fmt(kpiData.outKhoMet)} m</span>
          </div>
        </div>

        {/* 2. Đã Dập */}
        <div className="mobile-kpi-chip mobile-kpi-chip--emerald">
          <div className="chip-icon">
            <FiCpu />
          </div>
          <div className="chip-content">
            <span className="chip-label">ĐÃ DẬP (m)</span>
            <span className="chip-value">{fmt(kpiData.usedMet)}</span>
            <span className="chip-sub">Yield: {fmt(kpiData.yieldRate, 1)}%</span>
          </div>
        </div>

        {/* 3. Thành Phẩm Đạt */}
        <div className="mobile-kpi-chip mobile-kpi-chip--emerald">
          <div className="chip-icon">
            <FiCheckCircle />
          </div>
          <div className="chip-content">
            <span className="chip-label">THÀNH PHẨM (m)</span>
            <span className="chip-value">{fmt(kpiData.resultMet)}</span>
            <span className="chip-sub">EA: {fmt(kpiData.resultEa)}</span>
          </div>
        </div>

        {/* 4. Cân Chỉnh (Setting) */}
        <div className="mobile-kpi-chip mobile-kpi-chip--amber">
          <div className="chip-icon">
            <FiTool />
          </div>
          <div className="chip-content">
            <span className="chip-label">CÂN CHỈNH</span>
            <span className="chip-value">{fmt(kpiData.settingLossRate, 1)}%</span>
            <span className="chip-sub">ST Met: {fmt(kpiData.settingMet)} m</span>
          </div>
        </div>

        {/* 5. Lỗi Công Đoạn (NG) */}
        <div className="mobile-kpi-chip mobile-kpi-chip--rose">
          <div className="chip-icon">
            <FiAlertTriangle />
          </div>
          <div className="chip-content">
            <span className="chip-label">LỖI CĐ (NG)</span>
            <span className="chip-value">{fmt(kpiData.ngLossRate, 1)}%</span>
            <span className="chip-sub">NG Met: {fmt(kpiData.prNgMet)} m</span>
          </div>
        </div>

        {/* 6. Kiểm Tra Đạt */}
        <div className="mobile-kpi-chip mobile-kpi-chip--purple">
          <div className="chip-icon">
            <FiAward />
          </div>
          <div className="chip-content">
            <span className="chip-label">KIỂM OK RATE</span>
            <span className="chip-value">{fmt(kpiData.insOkRate, 1)}%</span>
            <span className="chip-sub">OK: {fmt(kpiData.insOkMet)} m</span>
          </div>
        </div>
      </div>

      {/* Nút đóng nhanh giải phóng không gian */}
      <button
        type="button"
        className="btn-close-mobile-kpi"
        onClick={onClose}
        title="Đóng dải KPI"
      >
        <FiX size={13} />
      </button>
    </div>
  );
};

export default React.memo(PrecisionBaoCaoFullRollMobileKpi);
