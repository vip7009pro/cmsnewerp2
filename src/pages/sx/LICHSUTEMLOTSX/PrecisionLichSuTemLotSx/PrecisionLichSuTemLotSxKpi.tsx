import React, { useMemo } from "react";
import { TEMLOTSX_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { FaBarcode, FaBoxes, FaRulerCombined, FaIndustry, FaExchangeAlt, FaTools } from "react-icons/fa";

interface PrecisionLichSuTemLotSxKpiProps {
  data: TEMLOTSX_DATA[];
}

export const PrecisionLichSuTemLotSxKpi: React.FC<PrecisionLichSuTemLotSxKpiProps> = ({ data }) => {
  const kpi = useMemo(() => {
    const totalLots = data.length;
    let totalQty = 0;
    let totalMeters = 0;
    let nm1Count = 0;
    let nm1Qty = 0;
    let nm2Count = 0;
    let nm2Qty = 0;
    let pendingLots = 0;
    let transferredLots = 0;
    let settingMeters = 0;
    let ngMeters = 0;

    data.forEach((item) => {
      const qty = Number(item.TEMP_QTY) || 0;
      const met = Number(item.TEMP_MET) || 0;
      totalQty += qty;
      totalMeters += met;

      if (item.FACTORY === "NM1") {
        nm1Count++;
        nm1Qty += qty;
      } else if (item.FACTORY === "NM2") {
        nm2Count++;
        nm2Qty += qty;
      }

      if (item.LOT_STATUS === null || item.LOT_STATUS === undefined || item.LOT_STATUS === "") {
        pendingLots++;
      } else {
        transferredLots++;
      }

      settingMeters += Number(item.SETTING_MET) || 0;
      ngMeters += Number(item.PR_NG) || 0;
    });

    const nm1Rate = totalLots > 0 ? (nm1Count / totalLots) * 100 : 0;
    const nm2Rate = totalLots > 0 ? (nm2Count / totalLots) * 100 : 0;
    const pendingRate = totalLots > 0 ? (pendingLots / totalLots) * 100 : 0;
    const avgMetPerLot = totalLots > 0 ? totalMeters / totalLots : 0;

    return {
      totalLots,
      totalQty,
      totalMeters,
      nm1Count,
      nm1Qty,
      nm2Count,
      nm2Qty,
      nm1Rate,
      nm2Rate,
      pendingLots,
      transferredLots,
      pendingRate,
      settingMeters,
      ngMeters,
      avgMetPerLot,
    };
  }, [data]);

  return (
    <div className="precision-lichsutemlotsx__kpiGrid">
      {/* 1. Tổng Số Tem In */}
      <div className="precision-lichsutemlotsx__kpiCard precision-lichsutemlotsx__kpiCard--purple">
        <div className="precision-lichsutemlotsx__kpiTop">
          <span className="precision-lichsutemlotsx__kpiLabel">Tổng Tem Đã In</span>
          <FaBarcode className="precision-lichsutemlotsx__kpiIcon" style={{ color: "#8b5cf6" }} />
        </div>
        <div className="precision-lichsutemlotsx__kpiValue">{kpi.totalLots.toLocaleString("en-US")}</div>
        <div className="precision-lichsutemlotsx__kpiSub">
          <span>Lượt in tem</span>
          <span style={{ color: "#8b5cf6", fontWeight: 600 }}>100%</span>
        </div>
        <div className="precision-lichsutemlotsx__kpiProgress precision-lichsutemlotsx__kpiProgress--purple">
          <div className="bar" style={{ width: "100%" }} />
        </div>
      </div>

      {/* 2. Tổng Sản Lượng (EA) */}
      <div className="precision-lichsutemlotsx__kpiCard precision-lichsutemlotsx__kpiCard--blue">
        <div className="precision-lichsutemlotsx__kpiTop">
          <span className="precision-lichsutemlotsx__kpiLabel">Tổng Sản Lượng (EA)</span>
          <FaBoxes className="precision-lichsutemlotsx__kpiIcon" style={{ color: "#3b82f6" }} />
        </div>
        <div className="precision-lichsutemlotsx__kpiValue">{kpi.totalQty.toLocaleString("en-US")}</div>
        <div className="precision-lichsutemlotsx__kpiSub">
          <span>TB/Lot: {kpi.totalLots > 0 ? Math.round(kpi.totalQty / kpi.totalLots).toLocaleString("en-US") : 0} EA</span>
          <span style={{ color: "#3b82f6", fontWeight: 600 }}>TEMP QTY</span>
        </div>
        <div className="precision-lichsutemlotsx__kpiProgress precision-lichsutemlotsx__kpiProgress--blue">
          <div className="bar" style={{ width: "100%" }} />
        </div>
      </div>

      {/* 3. Tổng Chiều Dài Mét */}
      <div className="precision-lichsutemlotsx__kpiCard precision-lichsutemlotsx__kpiCard--teal">
        <div className="precision-lichsutemlotsx__kpiTop">
          <span className="precision-lichsutemlotsx__kpiLabel">Tổng Chiều Dài (m)</span>
          <FaRulerCombined className="precision-lichsutemlotsx__kpiIcon" style={{ color: "#14b8a6" }} />
        </div>
        <div className="precision-lichsutemlotsx__kpiValue">
          {kpi.totalMeters.toLocaleString("en-US", { maximumFractionDigits: 1 })}
        </div>
        <div className="precision-lichsutemlotsx__kpiSub">
          <span>TB: {kpi.avgMetPerLot.toFixed(1)} m/lot</span>
          <span style={{ color: "#0d9488", fontWeight: 600 }}>TEMP MET</span>
        </div>
        <div className="precision-lichsutemlotsx__kpiProgress precision-lichsutemlotsx__kpiProgress--teal">
          <div className="bar" style={{ width: "100%" }} />
        </div>
      </div>

      {/* 4. Phân Bổ Nhà Máy */}
      <div className="precision-lichsutemlotsx__kpiCard precision-lichsutemlotsx__kpiCard--emerald">
        <div className="precision-lichsutemlotsx__kpiTop">
          <span className="precision-lichsutemlotsx__kpiLabel">Cơ Cấu Nhà Máy</span>
          <FaIndustry className="precision-lichsutemlotsx__kpiIcon" style={{ color: "#10b981" }} />
        </div>
        <div className="precision-lichsutemlotsx__kpiValue">
          {kpi.nm1Count} <span style={{ fontSize: "11px", fontWeight: 500, color: "#64748b" }}>/</span> {kpi.nm2Count}
        </div>
        <div className="precision-lichsutemlotsx__kpiSub">
          <span>NM1: {kpi.nm1Rate.toFixed(0)}%</span>
          <span>NM2: {kpi.nm2Rate.toFixed(0)}%</span>
        </div>
        <div className="precision-lichsutemlotsx__kpiProgress precision-lichsutemlotsx__kpiProgress--emerald">
          <div className="bar" style={{ width: `${kpi.nm1Rate}%` }} />
        </div>
      </div>

      {/* 5. Trạng Thái Chuyển CĐ */}
      <div className="precision-lichsutemlotsx__kpiCard precision-lichsutemlotsx__kpiCard--amber">
        <div className="precision-lichsutemlotsx__kpiTop">
          <span className="precision-lichsutemlotsx__kpiLabel">Trạng Thái Chuyển CĐ</span>
          <FaExchangeAlt className="precision-lichsutemlotsx__kpiIcon" style={{ color: "#f59e0b" }} />
        </div>
        <div className="precision-lichsutemlotsx__kpiValue">{kpi.pendingLots.toLocaleString("en-US")}</div>
        <div className="precision-lichsutemlotsx__kpiSub">
          <span>Chờ chuyển: {kpi.pendingRate.toFixed(0)}%</span>
          <span style={{ color: "#059669" }}>Đã chuyển: {kpi.transferredLots}</span>
        </div>
        <div className="precision-lichsutemlotsx__kpiProgress precision-lichsutemlotsx__kpiProgress--amber">
          <div className="bar" style={{ width: `${kpi.pendingRate}%` }} />
        </div>
      </div>

      {/* 6. Setting & NG CĐ */}
      <div className="precision-lichsutemlotsx__kpiCard precision-lichsutemlotsx__kpiCard--rose">
        <div className="precision-lichsutemlotsx__kpiTop">
          <span className="precision-lichsutemlotsx__kpiLabel">Cân Chỉnh & NG CĐ</span>
          <FaTools className="precision-lichsutemlotsx__kpiIcon" style={{ color: "#f43f5e" }} />
        </div>
        <div className="precision-lichsutemlotsx__kpiValue">
          {kpi.settingMeters.toLocaleString("en-US", { maximumFractionDigits: 0 })}{" "}
          <span style={{ fontSize: "10px", fontWeight: 500, color: "#64748b" }}>m ST</span>
        </div>
        <div className="precision-lichsutemlotsx__kpiSub">
          <span>NG CĐ: {kpi.ngMeters.toLocaleString("en-US", { maximumFractionDigits: 0 })} m</span>
          <span style={{ color: "#e11d48", fontWeight: 600 }}>SET & NG</span>
        </div>
        <div className="precision-lichsutemlotsx__kpiProgress precision-lichsutemlotsx__kpiProgress--rose">
          <div className="bar" style={{ width: "100%" }} />
        </div>
      </div>
    </div>
  );
};

export default PrecisionLichSuTemLotSxKpi;
