import React, { useMemo } from "react";
import { FiPackage, FiFileText, FiAward, FiDollarSign } from "react-icons/fi";
import { MATERIAL_TABLE_DATA } from "../interfaces/muaInterface";

interface PrecisionQLVLKpiProps {
  data: MATERIAL_TABLE_DATA[];
}

const PrecisionQLVLKpi: React.FC<PrecisionQLVLKpiProps> = ({ data }) => {
  const kpiStats = useMemo(() => {
    const total = data.length;
    if (total === 0) {
      return {
        total: 0,
        active: 0,
        locked: 0,
        hasDocs: 0,
        needDocs: 0,
        docRate: "0.0",
        fscCount: 0,
        noFscCount: 0,
        avgPrice: "0.00",
        avgSlitting: "0.000",
      };
    }

    let active = 0;
    let locked = 0;
    let hasDocs = 0;
    let fscCount = 0;
    let priceSum = 0;
    let priceCount = 0;
    let slittingSum = 0;
    let slittingCount = 0;

    for (let i = 0; i < total; i++) {
      const item = data[i];
      if (item.USE_YN === "Y") active++;
      else locked++;

      const hasDoc =
        (item.TDS_VER && item.TDS_VER > 0) ||
        (item.SGS_VER && item.SGS_VER > 0) ||
        (item.MSDS_VER && item.MSDS_VER > 0) ||
        item.TDS === "Y";
      if (hasDoc) hasDocs++;

      if (item.FSC === "Y") fscCount++;

      if (item.SSPRICE && item.SSPRICE > 0) {
        priceSum += item.SSPRICE;
        priceCount++;
      }
      if (item.SLITTING_PRICE && item.SLITTING_PRICE > 0) {
        slittingSum += item.SLITTING_PRICE;
        slittingCount++;
      }
    }

    const docRate = ((hasDocs / total) * 100).toFixed(1);
    const avgPrice = priceCount > 0 ? (priceSum / priceCount).toFixed(2) : "0.00";
    const avgSlitting = slittingCount > 0 ? (slittingSum / slittingCount).toFixed(3) : "0.000";

    return {
      total,
      active,
      locked,
      hasDocs,
      needDocs: total - hasDocs,
      docRate,
      fscCount,
      noFscCount: total - fscCount,
      avgPrice,
      avgSlitting,
    };
  }, [data]);

  return (
    <div className="precision-qlvl__kpiGrid">
      {/* Card 1: Tổng Danh Mục Vật Liệu */}
      <div className="precision-qlvl__kpiCard precision-qlvl__kpiCard--blue">
        <div className="precision-qlvl__kpiInfo">
          <span className="precision-qlvl__kpiLabel">Tổng Danh Mục Vật Liệu</span>
          <div className="precision-qlvl__kpiValueRow">
            <span className="precision-qlvl__kpiValue">{kpiStats.total.toLocaleString("en-US")}</span>
            <span className="precision-qlvl__kpiUnit">Mã</span>
          </div>
          <div className="precision-qlvl__kpiSub">
            <span style={{ color: "#059669", fontWeight: 700 }}>{kpiStats.active} Sử Dụng</span>
            <span>•</span>
            <span style={{ color: "#e11d48", fontWeight: 600 }}>{kpiStats.locked} Khóa</span>
          </div>
        </div>
        <div className="precision-qlvl__kpiIcon">
          <FiPackage />
        </div>
      </div>

      {/* Card 2: Hồ Sơ Kỹ Thuật (MSDS / TDS / SGS) */}
      <div className="precision-qlvl__kpiCard precision-qlvl__kpiCard--emerald">
        <div className="precision-qlvl__kpiInfo">
          <span className="precision-qlvl__kpiLabel">Hồ Sơ MSDS / TDS / SGS</span>
          <div className="precision-qlvl__kpiValueRow">
            <span className="precision-qlvl__kpiValue" style={{ color: "#059669" }}>{kpiStats.docRate}%</span>
            <span className="precision-qlvl__kpiUnit">Có Hồ Sơ</span>
          </div>
          <div className="precision-qlvl__kpiSub">
            <span style={{ color: "#059669", fontWeight: 600 }}>{kpiStats.hasDocs} Đã Có</span>
            <span>•</span>
            <span style={{ color: "#d97706", fontWeight: 600 }}>{kpiStats.needDocs} Chưa Có</span>
          </div>
        </div>
        <div className="precision-qlvl__kpiIcon">
          <FiFileText />
        </div>
      </div>

      {/* Card 3: Tiêu Chuẩn Chứng Chỉ FSC */}
      <div className="precision-qlvl__kpiCard precision-qlvl__kpiCard--indigo">
        <div className="precision-qlvl__kpiInfo">
          <span className="precision-qlvl__kpiLabel">Tiêu Chuẩn Chứng Chỉ FSC</span>
          <div className="precision-qlvl__kpiValueRow">
            <span className="precision-qlvl__kpiValue" style={{ color: "#4f46e5" }}>{kpiStats.fscCount.toLocaleString("en-US")}</span>
            <span className="precision-qlvl__kpiUnit">Mã Đạt FSC</span>
          </div>
          <div className="precision-qlvl__kpiSub">
            <span style={{ color: "#4f46e5", fontWeight: 600 }}>FSC Y: {kpiStats.fscCount}</span>
            <span>•</span>
            <span style={{ color: "#64748b" }}>FSC N: {kpiStats.noFscCount}</span>
          </div>
        </div>
        <div className="precision-qlvl__kpiIcon">
          <FiAward />
        </div>
      </div>

      {/* Card 4: Đơn Giá & Phí Xẻ Slitting TB */}
      <div className="precision-qlvl__kpiCard precision-qlvl__kpiCard--amber">
        <div className="precision-qlvl__kpiInfo">
          <span className="precision-qlvl__kpiLabel">Giá TB & Phí Xẻ Slitting</span>
          <div className="precision-qlvl__kpiValueRow">
            <span className="precision-qlvl__kpiValue" style={{ color: "#d97706" }}>${kpiStats.avgPrice}</span>
            <span className="precision-qlvl__kpiUnit">/ m² TB</span>
          </div>
          <div className="precision-qlvl__kpiSub">
            <span style={{ color: "#64748b" }}>Slitting TB:</span>
            <strong style={{ color: "#0f172a", fontFamily: "JetBrains Mono" }}>${kpiStats.avgSlitting}</strong>
          </div>
        </div>
        <div className="precision-qlvl__kpiIcon">
          <FiDollarSign />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionQLVLKpi);
