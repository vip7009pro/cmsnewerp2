import React from "react";
import { LOSS_TABLE_DATA_ROLL } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { PipelineSummary } from "./useCuonLieuData";
import TimelineIcon from "@mui/icons-material/Timeline";

interface PrecisionCuonLieuKpiProps {
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
}

export const PrecisionCuonLieuKpi: React.FC<PrecisionCuonLieuKpiProps> = ({
  lossTableInfo,
  pipelineSummary,
  extraKpi,
}) => {
  const formatNum = (val: number) => (val || 0).toLocaleString("en-US");
  const formatPercent = (val: number) =>
    ((val || 0) * 100).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + "%";

  // Xác định màu sắc trạng thái tổn thất
  const lossKtPercent = (lossTableInfo.TOTAL_LOSS_KT || 0) * 100;
  const lossBadgeClass =
    lossKtPercent <= 2 ? "success" : lossKtPercent <= 5 ? "warning" : "danger";

  return (
    <div className="precision-cuonlieu__kpiContainer">
      {/* Cụm 4 Micro-Cards KPI */}
      <div className="precision-cuonlieu__kpiGrid">
        {/* Card 1: Tổng Mét Xuất Kho & Quy Mô Cuộn */}
        <div className="kpi-card blue">
          <div className="kpi-header">
            <span className="kpi-title">1. Xuất Kho Vật Liệu</span>
            <span className="kpi-badge neutral">
              {formatNum(extraKpi.totalLots)} Cuộn Liệu
            </span>
          </div>
          <div className="kpi-main-stat">
            {formatNum(lossTableInfo.XUATKHO_MET)} <span className="unit">mét</span>
          </div>
          <div className="kpi-breakdown">
            <div className="stat-item">
              <span>Bình Quân:</span>
              <span className="val blue">
                {formatNum(Math.round(extraKpi.avgMetPerLot))} m/cuộn
              </span>
            </div>
            <div className="stat-item">
              <span>Số Chủng Loại:</span>
              <span className="val">{formatNum(extraKpi.uniqueMaterials)} loại</span>
            </div>
          </div>
        </div>

        {/* Card 2: Kiểm Tra Ngoại Quan & Thành Phẩm */}
        <div className="kpi-card emerald">
          <div className="kpi-header">
            <span className="kpi-title">2. Ngoại Quan & Thành Phẩm</span>
            <span className="kpi-badge success">INSPECTION</span>
          </div>
          <div className="kpi-main-stat">
            {formatNum(lossTableInfo.INSPECTION_OK)} <span className="unit">m đạt</span>
          </div>
          <div className="kpi-breakdown">
            <div className="stat-item">
              <span>Vào Kiểm:</span>
              <span className="val">{formatNum(lossTableInfo.INSPECTION_INPUT)} m</span>
            </div>
            <div className="stat-item">
              <span>Thực Xuất:</span>
              <span className="val emerald">
                {formatNum(lossTableInfo.INSPECTION_OUTPUT)} m
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Tỷ Lệ Tổn Thất & Hiệu Suất */}
        <div className="kpi-card amber">
          <div className="kpi-header">
            <span className="kpi-title">3. Tổn Thất & Hiệu Suất</span>
            <span className={`kpi-badge ${lossBadgeClass}`}>
              LOSS {formatPercent(lossTableInfo.TOTAL_LOSS_KT)}
            </span>
          </div>
          <div className="kpi-main-stat">
            <span
              style={{
                color:
                  lossKtPercent <= 2
                    ? "#059669"
                    : lossKtPercent <= 5
                    ? "#d97706"
                    : "#dc2626",
              }}
            >
              {formatPercent(lossTableInfo.TOTAL_LOSS_KT)}
            </span>
            <span className="unit">tổn thất KT</span>
          </div>
          <div className="kpi-breakdown">
            <div className="stat-item">
              <span>Tổn Thất Tổng:</span>
              <span className="val amber">
                {formatPercent(lossTableInfo.TOTAL_LOSS)}
              </span>
            </div>
            <div className="stat-item">
              <span>Tỷ Lệ Đạt:</span>
              <span className="val emerald">{extraKpi.passRate.toFixed(1)}%</span>
            </div>
          </div>
          <div className="kpi-progress">
            <div
              className="progress-bar"
              style={{
                width: `${Math.min(100, Math.max(0, extraKpi.passRate))}%`,
                backgroundColor:
                  extraKpi.passRate >= 98
                    ? "#10b981"
                    : extraKpi.passRate >= 95
                    ? "#f59e0b"
                    : "#ef4444",
              }}
            />
          </div>
        </div>

        {/* Card 4: Sản Lượng EA & Quy Mô Chỉ Thị */}
        <div className="kpi-card purple">
          <div className="kpi-header">
            <span className="kpi-title">4. Sản Lượng Chi Tiết (EA)</span>
            <span className="kpi-badge neutral">OUTPUT EA</span>
          </div>
          <div className="kpi-main-stat">
            {formatNum(extraKpi.totalInspectOkEA)} <span className="unit">EA đạt</span>
          </div>
          <div className="kpi-breakdown">
            <div className="stat-item">
              <span>Chỉ Thị SX:</span>
              <span className="val blue">{formatNum(extraKpi.uniquePlans)} Plans</span>
            </div>
            <div className="stat-item">
              <span>Thực Xuất EA:</span>
              <span className="val purple">
                {formatNum(extraKpi.totalInsOutputEA)} EA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Pipeline Strip: Dây chuyền công đoạn cuộn liệu */}
      <div className="precision-cuonlieu__pipelineStrip">
        <div className="strip-label">
          <TimelineIcon className="pulse-icon" style={{ fontSize: "1rem" }} />
          <span>DÂY CHUYỀN CÔNG ĐOẠN CUỘN LIỆU:</span>
        </div>

        <div className="stage-chips">
          {/* Trạm 1: Xuất Kho */}
          <div className="stage-chip" title="Trạng thái Xuất kho vật liệu">
            <span className="stage-name">1. Xuất Kho:</span>
            <span className="stage-counts">
              <span className="count-pass" title="Đã xuất">{pipelineSummary.xuatKho.pass}Y</span>
              {pipelineSummary.xuatKho.warn > 0 && (
                <span className="count-pending" title="Dở dang">{pipelineSummary.xuatKho.warn}R</span>
              )}
              <span className="count-none" title="Chưa xuất">{pipelineSummary.xuatKho.none}N</span>
            </span>
          </div>

          <span className="stage-arrow">→</span>

          {/* Trạm 2: FR */}
          <div className="stage-chip" title="Vào công đoạn cuộn trước FR">
            <span className="stage-name">2. FR:</span>
            <span className="stage-counts">
              <span className="count-pass">{pipelineSummary.vaoFR.pass}Y</span>
              {pipelineSummary.vaoFR.warn > 0 && (
                <span className="count-pending">{pipelineSummary.vaoFR.warn}R</span>
              )}
              <span className="count-none">{pipelineSummary.vaoFR.none}N</span>
            </span>
          </div>

          <span className="stage-arrow">→</span>

          {/* Trạm 3: SR */}
          <div className="stage-chip" title="Vào công đoạn cuộn sau SR">
            <span className="stage-name">3. SR:</span>
            <span className="stage-counts">
              <span className="count-pass">{pipelineSummary.vaoSR.pass}Y</span>
              {pipelineSummary.vaoSR.warn > 0 && (
                <span className="count-pending">{pipelineSummary.vaoSR.warn}R</span>
              )}
              <span className="count-none">{pipelineSummary.vaoSR.none}N</span>
            </span>
          </div>

          <span className="stage-arrow">→</span>

          {/* Trạm 4: DC */}
          <div className="stage-chip" title="Vào dập cắt DC">
            <span className="stage-name">4. DC:</span>
            <span className="stage-counts">
              <span className="count-pass">{pipelineSummary.vaoDC.pass}Y</span>
              {pipelineSummary.vaoDC.warn > 0 && (
                <span className="count-pending">{pipelineSummary.vaoDC.warn}R</span>
              )}
              <span className="count-none">{pipelineSummary.vaoDC.none}N</span>
            </span>
          </div>

          <span className="stage-arrow">→</span>

          {/* Trạm 5: ED */}
          <div className="stage-chip" title="Vào công đoạn kết thúc ED">
            <span className="stage-name">5. ED:</span>
            <span className="stage-counts">
              <span className="count-pass">{pipelineSummary.vaoED.pass}Y</span>
              {pipelineSummary.vaoED.warn > 0 && (
                <span className="count-pending">{pipelineSummary.vaoED.warn}R</span>
              )}
              <span className="count-none">{pipelineSummary.vaoED.none}N</span>
            </span>
          </div>

          <span className="stage-arrow">→</span>

          {/* Trạm 6: Giao Nhận */}
          <div className="stage-chip" title="Xác nhận giao nhận giữa SX và QC">
            <span className="stage-name">6. Giao Nhận:</span>
            <span className="stage-counts">
              <span className="count-pass">{pipelineSummary.confirmGiaoNhan.pass}Y</span>
              {pipelineSummary.confirmGiaoNhan.warn > 0 && (
                <span className="count-pending">{pipelineSummary.confirmGiaoNhan.warn}R</span>
              )}
              <span className="count-none">{pipelineSummary.confirmGiaoNhan.none}N</span>
            </span>
          </div>

          <span className="stage-arrow">→</span>

          {/* Trạm 7: Vào Kiểm */}
          <div className="stage-chip" title="Đã vào trạm kiểm tra ngoại quan">
            <span className="stage-name">7. Vào KT:</span>
            <span className="stage-counts">
              <span className="count-pass">{pipelineSummary.vaoKiem.pass}Y</span>
              {pipelineSummary.vaoKiem.warn > 0 && (
                <span className="count-pending">{pipelineSummary.vaoKiem.warn}R</span>
              )}
              <span className="count-none">{pipelineSummary.vaoKiem.none}N</span>
            </span>
          </div>

          <span className="stage-arrow">→</span>

          {/* Trạm 8: Ra Kiểm */}
          <div className="stage-chip" title="Hoàn thành ra trạm kiểm tra">
            <span className="stage-name">8. Ra KT:</span>
            <span className="stage-counts">
              <span className="count-pass">{pipelineSummary.raKiem.pass}Y</span>
              {pipelineSummary.raKiem.warn > 0 && (
                <span className="count-pending">{pipelineSummary.raKiem.warn}R</span>
              )}
              <span className="count-none">{pipelineSummary.raKiem.none}N</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCuonLieuKpi);
