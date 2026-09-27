import React from "react";
import { LOSS_TABLE_DATA_ROLL } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { PipelineSummary } from "./useCuonLieuData";
import {
  FaWarehouse,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBoxes,
  FaRoute,
  FaTimes,
} from "react-icons/fa";

interface PrecisionCuonLieuMobileKpiProps {
  lossTableInfo: LOSS_TABLE_DATA_ROLL;
  pipelineSummary: PipelineSummary;
  extraKpi: {
    totalLots: number;
    avgMetPerLot: number;
    passRate: number;
    totalInspectOkEA: number;
    totalInsOutputEA: number;
    uniquePlans: number;
    uniqueMaterials: number;
  };
  onClose: () => void;
}

export const PrecisionCuonLieuMobileKpi: React.FC<PrecisionCuonLieuMobileKpiProps> = ({
  lossTableInfo,
  pipelineSummary,
  extraKpi,
  onClose,
}) => {
  const formatNum = (val: number) => (val || 0).toLocaleString("en-US");
  const lossKtPercent = (lossTableInfo.TOTAL_LOSS_KT || 0) * 100;
  const lossTotalPercent = (lossTableInfo.TOTAL_LOSS || 0) * 100;

  return (
    <div className="precision-cuonlieu-mobile-kpi">
      <div className="kpi-scroll-container">
        {/* Card 1: Xuất Kho */}
        <div className="mobile-kpi-chip mobile-kpi-chip--blue">
          <FaWarehouse className="chip-icon" />
          <div className="chip-content">
            <span className="chip-label">XUẤT KHO</span>
            <span className="chip-value">
              {formatNum(lossTableInfo.XUATKHO_MET)} m
            </span>
            <span className="chip-sub">
              {formatNum(extraKpi.totalLots)} cuộn • {formatNum(Math.round(extraKpi.avgMetPerLot))}m/c
            </span>
          </div>
        </div>

        {/* Card 2: Kiểm Đạt */}
        <div className="mobile-kpi-chip mobile-kpi-chip--emerald">
          <FaCheckCircle className="chip-icon" />
          <div className="chip-content">
            <span className="chip-label">KIỂM ĐẠT</span>
            <span className="chip-value">
              {formatNum(lossTableInfo.INSPECTION_OK)} m
            </span>
            <span className="chip-sub">
              Vào {formatNum(lossTableInfo.INSPECTION_INPUT)}m • Đạt {extraKpi.passRate.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Card 3: Tổn Thất KT */}
        <div
          className={`mobile-kpi-chip ${
            lossKtPercent <= 2
              ? "mobile-kpi-chip--emerald"
              : lossKtPercent <= 5
              ? "mobile-kpi-chip--amber"
              : "mobile-kpi-chip--rose"
          }`}
        >
          <FaExclamationTriangle className="chip-icon" />
          <div className="chip-content">
            <span className="chip-label">TỔN THẤT KT</span>
            <span className="chip-value">{lossKtPercent.toFixed(2)}%</span>
            <span className="chip-sub">Tổng loss {lossTotalPercent.toFixed(2)}%</span>
          </div>
        </div>

        {/* Card 4: Sản Lượng EA */}
        <div className="mobile-kpi-chip mobile-kpi-chip--purple">
          <FaBoxes className="chip-icon" />
          <div className="chip-content">
            <span className="chip-label">SẢN LƯỢNG EA</span>
            <span className="chip-value">
              {formatNum(extraKpi.totalInspectOkEA)} EA
            </span>
            <span className="chip-sub">
              {formatNum(extraKpi.uniquePlans)} Plans • {formatNum(extraKpi.uniqueMaterials)} loại
            </span>
          </div>
        </div>

        {/* Card 5: Pipeline tiến độ chuỗi công đoạn */}
        <div className="mobile-kpi-chip mobile-kpi-chip--pipeline">
          <FaRoute className="chip-icon" />
          <div className="chip-content">
            <span className="chip-label">TIẾN ĐỘ CÔNG ĐOẠN (ĐÃ XONG)</span>
            <div className="pipeline-inline-stages">
              <span className="stage-mini">XK: <strong>{pipelineSummary.xuatKho.pass}</strong></span>
              <span className="stage-sep">›</span>
              <span className="stage-mini">FR: <strong>{pipelineSummary.vaoFR.pass}</strong></span>
              <span className="stage-sep">›</span>
              <span className="stage-mini">SR: <strong>{pipelineSummary.vaoSR.pass}</strong></span>
              <span className="stage-sep">›</span>
              <span className="stage-mini">DC: <strong>{pipelineSummary.vaoDC.pass}</strong></span>
              <span className="stage-sep">›</span>
              <span className="stage-mini">ED: <strong>{pipelineSummary.vaoED.pass}</strong></span>
              <span className="stage-sep">›</span>
              <span className="stage-mini">GN: <strong>{pipelineSummary.confirmGiaoNhan.pass}</strong></span>
              <span className="stage-sep">›</span>
              <span className="stage-mini">VàoKT: <strong>{pipelineSummary.vaoKiem.pass}</strong></span>
              <span className="stage-sep">›</span>
              <span className="stage-mini">RaKT: <strong>{pipelineSummary.raKiem.pass}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Nút đóng nhanh dải KPI để giải phóng không gian */}
      <button
        type="button"
        className="btn-close-mobile-kpi"
        onClick={onClose}
        title="Đóng thanh KPI để mở rộng bảng dữ liệu"
      >
        <FaTimes size={11} />
      </button>
    </div>
  );
};

export default React.memo(PrecisionCuonLieuMobileKpi);
