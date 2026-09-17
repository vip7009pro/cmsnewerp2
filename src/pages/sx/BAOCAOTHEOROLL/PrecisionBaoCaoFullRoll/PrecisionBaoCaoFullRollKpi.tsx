import React from "react";
import {
  FiLayers,
  FiCpu,
  FiCheckCircle,
  FiTool,
  FiAlertTriangle,
  FiAward,
} from "react-icons/fi";

interface PrecisionBaoCaoFullRollKpiProps {
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
}

const PrecisionBaoCaoFullRollKpi: React.FC<PrecisionBaoCaoFullRollKpiProps> = ({
  kpiData,
}) => {
  return (
    <section className="precision-bcfr-kpi">
      {/* 1. Tổng Cấp Liệu (Input Met) */}
      <div className="kpi-card kpi-card--blue">
        <div className="kpi-info">
          <span className="kpi-label">Tổng Cấp Liệu</span>
          <div className="kpi-amount">
            {kpiData.inputMet.toLocaleString("en-US")} <span style={{ fontSize: 11, fontWeight: 600 }}>m</span>
          </div>
          <div className="kpi-meta">
            <span>Xuất: <strong className="qty-val">{kpiData.outKhoMet.toLocaleString("en-US")} m</strong></span>
            <span>M²: <strong className="qty-val">{Math.round(kpiData.inputM2).toLocaleString("en-US")}</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiLayers />
        </div>
      </div>

      {/* 2. Đã Dập Thực Tế (Used Met) */}
      <div className="kpi-card kpi-card--emerald">
        <div className="kpi-info">
          <span className="kpi-label">Đã Dập Thực Tế</span>
          <div className="kpi-amount">
            {kpiData.usedMet.toLocaleString("en-US")} <span style={{ fontSize: 11, fontWeight: 600 }}>m</span>
          </div>
          <div className="kpi-meta">
            <span>Yield: <strong className="rate-val">{kpiData.yieldRate.toFixed(1)}%</strong></span>
            <span>Tồn: <strong className="qty-val">{kpiData.remainMet.toLocaleString("en-US")} m</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiCpu />
        </div>
      </div>

      {/* 3. Thành Phẩm Đạt (Result Met & EA) */}
      <div className="kpi-card kpi-card--teal">
        <div className="kpi-info">
          <span className="kpi-label">Thành Phẩm Đạt</span>
          <div className="kpi-amount">
            {kpiData.resultMet.toLocaleString("en-US")} <span style={{ fontSize: 11, fontWeight: 600 }}>m</span>
          </div>
          <div className="kpi-meta">
            <span>EA: <strong className="qty-val" style={{ color: "#0d9488" }}>{kpiData.resultEa.toLocaleString("en-US")}</strong></span>
            <span>M²: <strong className="qty-val">{Math.round(kpiData.resultM2).toLocaleString("en-US")}</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiCheckCircle />
        </div>
      </div>

      {/* 4. Hao Hụt Cân Chỉnh (Setting Loss) */}
      <div className="kpi-card kpi-card--amber">
        <div className="kpi-info">
          <span className="kpi-label">Cân Chỉnh (Setting)</span>
          <div className="kpi-amount">
            {kpiData.settingMet.toLocaleString("en-US")} <span style={{ fontSize: 11, fontWeight: 600 }}>m</span>
          </div>
          <div className="kpi-meta">
            <span>Loss: <strong className="rate-val" style={{ color: "#d97706" }}>{kpiData.settingLossRate.toFixed(2)}%</strong></span>
            <span>EA: <strong className="qty-val">{kpiData.settingEa.toLocaleString("en-US")}</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiTool />
        </div>
      </div>

      {/* 5. Lỗi Hỏng Công Đoạn (PR_NG Loss) */}
      <div className="kpi-card kpi-card--rose">
        <div className="kpi-info">
          <span className="kpi-label">Hỏng Công Đoạn (NG)</span>
          <div className="kpi-amount">
            {kpiData.prNgMet.toLocaleString("en-US")} <span style={{ fontSize: 11, fontWeight: 600 }}>m</span>
          </div>
          <div className="kpi-meta">
            <span>Loss: <strong className="rate-val" style={{ color: "#e11d48" }}>{kpiData.ngLossRate.toFixed(2)}%</strong></span>
            <span>EA: <strong className="qty-val">{kpiData.prNgEa.toLocaleString("en-US")}</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiAlertTriangle />
        </div>
      </div>

      {/* 6. Kiểm Tra Đạt (Inspect OK) */}
      <div className="kpi-card kpi-card--violet">
        <div className="kpi-info">
          <span className="kpi-label">Kiểm Tra Đạt (OK)</span>
          <div className="kpi-amount">
            {kpiData.insOkMet.toLocaleString("en-US")} <span style={{ fontSize: 11, fontWeight: 600 }}>m</span>
          </div>
          <div className="kpi-meta">
            <span>Đạt: <strong className="rate-val" style={{ color: "#7c3aed" }}>{kpiData.insOkRate.toFixed(1)}%</strong></span>
            <span>Tổng: <strong className="qty-val">{kpiData.insTotalMet.toLocaleString("en-US")} m</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiAward />
        </div>
      </div>
    </section>
  );
};

export default React.memo(PrecisionBaoCaoFullRollKpi);
export { PrecisionBaoCaoFullRollKpi };
