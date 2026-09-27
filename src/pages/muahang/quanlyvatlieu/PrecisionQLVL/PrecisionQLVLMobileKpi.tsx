import React, { useMemo } from "react";
import { FiPackage, FiFileText, FiAward, FiDollarSign } from "react-icons/fi";
import { MATERIAL_TABLE_DATA } from "../../interfaces/muaInterface";

interface PrecisionQLVLMobileKpiProps {
  data: MATERIAL_TABLE_DATA[];
}

const PrecisionQLVLMobileKpi: React.FC<PrecisionQLVLMobileKpiProps> = ({ data }) => {
  const stats = useMemo(() => {
    const total = data.length;
    if (total === 0) {
      return {
        total: 0,
        active: 0,
        docRate: "0.0",
        hasDocs: 0,
        fscCount: 0,
        avgPrice: "0.00",
      };
    }

    let active = 0;
    let hasDocs = 0;
    let fscCount = 0;
    let priceSum = 0;
    let priceCount = 0;

    for (let i = 0; i < total; i++) {
      const item = data[i];
      if (item.USE_YN === "Y") active++;

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
    }

    const docRate = ((hasDocs / total) * 100).toFixed(1);
    const avgPrice = priceCount > 0 ? (priceSum / priceCount).toFixed(2) : "0.00";

    return {
      total,
      active,
      docRate,
      hasDocs,
      fscCount,
      avgPrice,
    };
  }, [data]);

  return (
    <div className="precision-qlvl__mobileKpi">
      <div className="mobile-kpi-scroll">
        {/* Card 1: Tổng & Đang dùng */}
        <div className="mobile-kpi-pill mobile-kpi-pill--blue">
          <div className="kpi-icon">
            <FiPackage size={13} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Tổng Danh Mục</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{stats.total}</span>
              <span className="kpi-sub">({stats.active} Active)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Hồ Sơ Kỹ Thuật */}
        <div className="mobile-kpi-pill mobile-kpi-pill--emerald">
          <div className="kpi-icon">
            <FiFileText size={13} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Hồ Sơ (MSDS/TDS)</span>
            <div className="kpi-value-row">
              <span className="kpi-value" style={{ color: "#059669" }}>
                {stats.docRate}%
              </span>
              <span className="kpi-sub">({stats.hasDocs} mã)</span>
            </div>
          </div>
        </div>

        {/* Card 3: Chuẩn FSC */}
        <div className="mobile-kpi-pill mobile-kpi-pill--indigo">
          <div className="kpi-icon">
            <FiAward size={13} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Chứng Nhận FSC</span>
            <div className="kpi-value-row">
              <span className="kpi-value" style={{ color: "#4f46e5" }}>
                {stats.fscCount}
              </span>
              <span className="kpi-sub">Đạt Chuẩn</span>
            </div>
          </div>
        </div>

        {/* Card 4: Giá TB */}
        <div className="mobile-kpi-pill mobile-kpi-pill--amber">
          <div className="kpi-icon">
            <FiDollarSign size={13} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Giá TB / m²</span>
            <div className="kpi-value-row">
              <span className="kpi-value" style={{ color: "#d97706" }}>
                ${stats.avgPrice}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionQLVLMobileKpi);
