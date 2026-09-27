import React, { useMemo } from "react";
import { FiList, FiTrendingUp, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

interface PrecisionTinhLieuMobileKpiProps {
  data: any[];
  currentMode: "DETAIL" | "SUMMARY" | "PLAN";
}

const PrecisionTinhLieuMobileKpi: React.FC<PrecisionTinhLieuMobileKpiProps> = ({
  data,
  currentMode,
}) => {
  const stats = useMemo(() => {
    const totalRows = data.length;
    if (totalRows === 0) {
      return {
        totalRows: 0,
        uniqueMaterials: 0,
        totalNeedQty: 0,
        totalStockQty: 0,
        shortageRows: 0,
        totalShortageQty: 0,
        yesCount: 0,
        noCount: 0,
        pendingCount: 0,
        unlockRatio: "0%",
      };
    }

    const uniqueMats = new Set<string>();
    let sumNeedQty = 0;
    let sumStockQty = 0;
    let sumShortageQty = 0;
    let shortageRows = 0;
    let yesCount = 0;
    let noCount = 0;
    let pendingCount = 0;

    for (let i = 0; i < totalRows; i++) {
      const item = data[i];
      if (item.M_NAME) uniqueMats.add(item.M_NAME);

      const need = Number(item.NEED_M_QTY) || 0;
      sumNeedQty += need;

      const stock = Number(item.STOCK_M || item.TOTAL_STOCK || 0);
      sumStockQty += stock;

      const shortage = Number(item.M_SHORTAGE) || 0;
      if (shortage > 0) {
        sumShortageQty += shortage;
        shortageRows++;
      }

      if (item.MATERIAL_YN === "Y") yesCount++;
      else if (item.MATERIAL_YN === "N") noCount++;
      else if (item.MATERIAL_YN) pendingCount++;
    }

    const hasStatus = yesCount + noCount + pendingCount > 0;
    const unlockRatio = hasStatus
      ? `${((yesCount / (yesCount + noCount + pendingCount)) * 100).toFixed(0)}%`
      : "100%";

    return {
      totalRows,
      uniqueMaterials: uniqueMats.size,
      totalNeedQty: sumNeedQty,
      totalStockQty: sumStockQty,
      shortageRows,
      totalShortageQty: sumShortageQty,
      yesCount,
      noCount,
      pendingCount,
      unlockRatio,
    };
  }, [data]);

  return (
    <div className="precision-tinhlieu__mobileKpi">
      <div className="mobile-kpi-scroll">
        {/* Card 1: Tổng & Danh mục */}
        <div className="mobile-kpi-pill mobile-kpi-pill--blue">
          <div className="kpi-icon">
            <FiList size={13} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Tổng Bản Ghi</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{stats.totalRows.toLocaleString()}</span>
              <span className="kpi-sub">({stats.uniqueMaterials} mã VL)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Nhu Cầu Cấp Liệu / Tồn Kho */}
        <div className="mobile-kpi-pill mobile-kpi-pill--purple">
          <div className="kpi-icon">
            <FiTrendingUp size={13} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">
              {currentMode === "PLAN" ? "Tồn Sẵn Có" : "Nhu Cầu Cấp Liệu"}
            </span>
            <div className="kpi-value-row">
              <span className="kpi-value" style={{ color: "#7c3aed" }}>
                {currentMode === "PLAN"
                  ? Math.round(stats.totalStockQty).toLocaleString()
                  : Math.round(stats.totalNeedQty).toLocaleString()}
              </span>
              <span className="kpi-sub">m</span>
            </div>
          </div>
        </div>

        {/* Card 3: Cảnh báo Thiếu Liệu / Khóa */}
        <div className="mobile-kpi-pill mobile-kpi-pill--rose">
          <div className="kpi-icon">
            <FiAlertCircle size={13} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">
              {currentMode === "SUMMARY" ? "Mã Thiếu Hụt" : "YCSX Khóa Liệu"}
            </span>
            <div className="kpi-value-row">
              {currentMode === "SUMMARY" ? (
                stats.shortageRows > 0 ? (
                  <span className="kpi-value" style={{ color: "#e11d48" }}>
                    {stats.shortageRows} mã
                  </span>
                ) : (
                  <span className="kpi-value" style={{ color: "#059669" }}>
                    Đủ 100%
                  </span>
                )
              ) : stats.noCount > 0 ? (
                <span className="kpi-value" style={{ color: "#e11d48" }}>
                  {stats.noCount} khóa
                </span>
              ) : (
                <span className="kpi-value" style={{ color: "#059669" }}>
                  Sẵn sàng
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 4: Tỷ lệ mở liệu */}
        <div className="mobile-kpi-pill mobile-kpi-pill--emerald">
          <div className="kpi-icon">
            <FiCheckCircle size={13} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Tỷ Lệ Mở Liệu</span>
            <div className="kpi-value-row">
              <span className="kpi-value" style={{ color: "#059669" }}>
                {stats.unlockRatio}
              </span>
              <span className="kpi-sub">({stats.yesCount} Mở)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionTinhLieuMobileKpi);
