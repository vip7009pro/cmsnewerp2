import React from "react";
import { BtpKpiData, ViewMode } from "./useBtpAutoData";

interface Props {
  kpiData: BtpKpiData;
  viewMode: ViewMode;
  dataLength: number;
}

/**
 * Dashboard 5 Micro-cards KPI realtime cho BTP_AUTO.
 * - Tổng BTP Tồn Kho (blue)
 * - Phân Bổ Xưởng A (green)
 * - Phân Bổ Xưởng B (amber)
 * - Số Lot & Mã Hàng (purple)
 * - Phân Bổ Nhà Máy (rose)
 */
const PrecisionBtpAutoKpi: React.FC<Props> = React.memo(
  ({ kpiData, viewMode, dataLength }) => {
    const pctA =
      kpiData.totalBtp > 0
        ? ((kpiData.totalXA / kpiData.totalBtp) * 100).toFixed(1)
        : "0";
    const pctB =
      kpiData.totalBtp > 0
        ? ((kpiData.totalXB / kpiData.totalBtp) * 100).toFixed(1)
        : "0";

    const factoryEntries = Object.entries(kpiData.factoryBreakdown);
    const factoryText =
      factoryEntries.length > 0
        ? factoryEntries
            .slice(0, 3)
            .map(([k, v]) => `${k}: ${v.toLocaleString("en-US")}`)
            .join(" · ")
        : "—";

    return (
      <div className="precision-btpauto__kpiRow">
        {/* Card 1: Tổng BTP */}
        <div className="precision-btpauto__kpiCard precision-btpauto__kpiCard--blue">
          <div className="precision-btpauto__kpiTop">
            <span className="precision-btpauto__kpiLabel">Tổng BTP Tồn</span>
            <span className="precision-btpauto__kpiIcon">📦</span>
          </div>
          <span className="precision-btpauto__kpiValue">
            {kpiData.totalBtp.toLocaleString("en-US")}
          </span>
          <span className="precision-btpauto__kpiSub">
            {viewMode === "detail" ? "EA (chi tiết)" : "EA (tổng hợp)"}
          </span>
        </div>

        {/* Card 2: Xưởng A */}
        <div className="precision-btpauto__kpiCard precision-btpauto__kpiCard--green">
          <div className="precision-btpauto__kpiTop">
            <span className="precision-btpauto__kpiLabel">Xưởng A</span>
            <span className="precision-btpauto__kpiIcon">🏭</span>
          </div>
          <span className="precision-btpauto__kpiValue">
            {kpiData.totalXA.toLocaleString("en-US")}
          </span>
          <span className="precision-btpauto__kpiSub">{pctA}% tổng BTP</span>
        </div>

        {/* Card 3: Xưởng B */}
        <div className="precision-btpauto__kpiCard precision-btpauto__kpiCard--amber">
          <div className="precision-btpauto__kpiTop">
            <span className="precision-btpauto__kpiLabel">Xưởng B</span>
            <span className="precision-btpauto__kpiIcon">🏗️</span>
          </div>
          <span className="precision-btpauto__kpiValue">
            {kpiData.totalXB.toLocaleString("en-US")}
          </span>
          <span className="precision-btpauto__kpiSub">{pctB}% tổng BTP</span>
        </div>

        {/* Card 4: Số Lot & Mã Hàng */}
        <div className="precision-btpauto__kpiCard precision-btpauto__kpiCard--purple">
          <div className="precision-btpauto__kpiTop">
            <span className="precision-btpauto__kpiLabel">
              {viewMode === "detail" ? "Lot & Mã Hàng" : "Mã Hàng"}
            </span>
            <span className="precision-btpauto__kpiIcon">🔢</span>
          </div>
          <span className="precision-btpauto__kpiValue">
            {dataLength.toLocaleString("en-US")}
          </span>
          <span className="precision-btpauto__kpiSub">
            {kpiData.uniqueGCodes} mã hàng khác nhau
          </span>
        </div>

        {/* Card 5: Phân Bổ Nhà Máy */}
        <div className="precision-btpauto__kpiCard precision-btpauto__kpiCard--rose">
          <div className="precision-btpauto__kpiTop">
            <span className="precision-btpauto__kpiLabel">Phân Bổ NM</span>
            <span className="precision-btpauto__kpiIcon">📊</span>
          </div>
          <span className="precision-btpauto__kpiValue">
            {factoryEntries.length > 0
              ? `${factoryEntries.length} NM`
              : "—"}
          </span>
          <span className="precision-btpauto__kpiSub">{factoryText}</span>
        </div>
      </div>
    );
  }
);

PrecisionBtpAutoKpi.displayName = "PrecisionBtpAutoKpi";
export default PrecisionBtpAutoKpi;
