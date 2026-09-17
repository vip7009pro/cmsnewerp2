import React from "react";
import { FiPackage, FiActivity, FiCheckCircle, FiAlertTriangle, FiAlertOctagon, FiZap } from "react-icons/fi";
import { SX_BAOCAOROLLDATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

interface Props {
  summarydata: SX_BAOCAOROLLDATA;
}

const PrecisionBaoCaoRollKpi: React.FC<Props> = ({ summarydata }) => {
  const fmt = (val: number, digits = 0) =>
    val?.toLocaleString("en-US", { maximumFractionDigits: digits });

  const allLoss = summarydata.PURE_INPUT > 0
    ? (1 - (summarydata.PURE_OUTPUT * 1.0) / summarydata.PURE_INPUT) * 100
    : 0;

  return (
    <section className="precision-bcr-kpi-grid">
      {/* 1. Tổng INPUT */}
      <div className="kpi-card kpi-card--blue">
        <div className="kpi-info">
          <span className="kpi-label">Tổng Input (m)</span>
          <div className="kpi-amount">{fmt(summarydata.INPUT_QTY)}</div>
          <div className="kpi-meta">
            <span>Tồn: <strong className="qty-val">{fmt(summarydata.REMAIN_QTY)}</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap"><FiPackage /></div>
      </div>

      {/* 2. Tổng USED */}
      <div className="kpi-card kpi-card--emerald">
        <div className="kpi-info">
          <span className="kpi-label">Tổng Used (m)</span>
          <div className="kpi-amount">{fmt(summarydata.USED_QTY)}</div>
          <div className="kpi-meta">
            <span>Pure In: <strong className="qty-val">{fmt(summarydata.PURE_INPUT)}</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap"><FiActivity /></div>
      </div>

      {/* 3. OK Output */}
      <div className="kpi-card kpi-card--emerald">
        <div className="kpi-info">
          <span className="kpi-label">OK Output</span>
          <div className="kpi-amount">{fmt(summarydata.OK_MET_TT)} m</div>
          <div className="kpi-meta">
            <span>EA: <strong className="qty-val">{fmt(summarydata.OK_EA)}</strong></span>
            <span>·</span>
            <span>Pure Out: <strong className="qty-val">{fmt(summarydata.PURE_OUTPUT)}</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap"><FiCheckCircle /></div>
      </div>

      {/* 4. Setting Loss */}
      <div className="kpi-card kpi-card--amber">
        <div className="kpi-info">
          <span className="kpi-label">Setting Loss</span>
          <div className="kpi-amount">{fmt(summarydata.LOSS_ST, 1)}%</div>
          <div className="kpi-meta">
            <span>ST Met: <strong className="qty-val">{fmt(summarydata.SETTING_MET)}</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap"><FiAlertTriangle /></div>
      </div>

      {/* 5. SX Loss */}
      <div className="kpi-card kpi-card--rose">
        <div className="kpi-info">
          <span className="kpi-label">SX Loss (Process NG)</span>
          <div className="kpi-amount">{fmt(summarydata.LOSS_SX, 1)}%</div>
          <div className="kpi-meta">
            <span>NG: <strong className="qty-val">{fmt(summarydata.PR_NG)}</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap"><FiAlertOctagon /></div>
      </div>

      {/* 6. Total Loss */}
      <div className="kpi-card kpi-card--violet">
        <div className="kpi-info">
          <span className="kpi-label">All Loss (Tổng Hao Hụt)</span>
          <div className="kpi-amount">{fmt(allLoss, 1)}%</div>
          <div className="kpi-meta">
            <span>TT Loss: <strong className="qty-val">{fmt(summarydata.LOSS_TT, 1)}%</strong></span>
          </div>
        </div>
        <div className="kpi-icon-wrap"><FiZap /></div>
      </div>
    </section>
  );
};

const MemoizedPrecisionBaoCaoRollKpi = React.memo(PrecisionBaoCaoRollKpi);
export { MemoizedPrecisionBaoCaoRollKpi as PrecisionBaoCaoRollKpi };
export default MemoizedPrecisionBaoCaoRollKpi;
