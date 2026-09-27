import React from "react";
import {
  FiPackage,
  FiActivity,
  FiCheckCircle,
  FiAlertTriangle,
  FiAlertOctagon,
  FiZap,
  FiX,
} from "react-icons/fi";
import { SX_BAOCAOROLLDATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

interface PrecisionBaoCaoRollMobileKpiProps {
  summarydata: SX_BAOCAOROLLDATA;
  onClose: () => void;
}

export const PrecisionBaoCaoRollMobileKpi: React.FC<PrecisionBaoCaoRollMobileKpiProps> = ({
  summarydata,
  onClose,
}) => {
  const fmt = (val: number, digits = 0) =>
    val?.toLocaleString("en-US", { maximumFractionDigits: digits }) ?? "0";

  const allLoss =
    summarydata.PURE_INPUT > 0
      ? (1 - (summarydata.PURE_OUTPUT * 1.0) / summarydata.PURE_INPUT) * 100
      : 0;

  return (
    <div className="precision-bcr-mobile-kpi">
      <div className="kpi-scroll-container">
        {/* 1. Tổng Input */}
        <div className="mobile-kpi-chip mobile-kpi-chip--blue">
          <div className="chip-icon">
            <FiPackage />
          </div>
          <div className="chip-content">
            <span className="chip-label">TỔNG INPUT (m)</span>
            <span className="chip-value">{fmt(summarydata.INPUT_QTY)}</span>
            <span className="chip-sub">Tồn: {fmt(summarydata.REMAIN_QTY)} m</span>
          </div>
        </div>

        {/* 2. Tổng Used */}
        <div className="mobile-kpi-chip mobile-kpi-chip--emerald">
          <div className="chip-icon">
            <FiActivity />
          </div>
          <div className="chip-content">
            <span className="chip-label">TỔNG USED (m)</span>
            <span className="chip-value">{fmt(summarydata.USED_QTY)}</span>
            <span className="chip-sub">Pure In: {fmt(summarydata.PURE_INPUT)}</span>
          </div>
        </div>

        {/* 3. OK Output */}
        <div className="mobile-kpi-chip mobile-kpi-chip--emerald">
          <div className="chip-icon">
            <FiCheckCircle />
          </div>
          <div className="chip-content">
            <span className="chip-label">OK OUTPUT (m)</span>
            <span className="chip-value">{fmt(summarydata.OK_MET_TT)}</span>
            <span className="chip-sub">
              EA: {fmt(summarydata.OK_EA)} · Out: {fmt(summarydata.PURE_OUTPUT)}
            </span>
          </div>
        </div>

        {/* 4. Setting Loss */}
        <div className="mobile-kpi-chip mobile-kpi-chip--amber">
          <div className="chip-icon">
            <FiAlertTriangle />
          </div>
          <div className="chip-content">
            <span className="chip-label">SETTING LOSS</span>
            <span className="chip-value">{fmt(summarydata.LOSS_ST, 1)}%</span>
            <span className="chip-sub">ST Met: {fmt(summarydata.SETTING_MET)} m</span>
          </div>
        </div>

        {/* 5. SX Loss */}
        <div className="mobile-kpi-chip mobile-kpi-chip--rose">
          <div className="chip-icon">
            <FiAlertOctagon />
          </div>
          <div className="chip-content">
            <span className="chip-label">SX LOSS (NG)</span>
            <span className="chip-value">{fmt(summarydata.LOSS_SX, 1)}%</span>
            <span className="chip-sub">NG Met: {fmt(summarydata.PR_NG)} m</span>
          </div>
        </div>

        {/* 6. All Loss */}
        <div className="mobile-kpi-chip mobile-kpi-chip--purple">
          <div className="chip-icon">
            <FiZap />
          </div>
          <div className="chip-content">
            <span className="chip-label">ALL LOSS</span>
            <span className="chip-value">{fmt(allLoss, 1)}%</span>
            <span className="chip-sub">TT: {fmt(summarydata.LOSS_TT, 1)}%</span>
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

export default React.memo(PrecisionBaoCaoRollMobileKpi);
