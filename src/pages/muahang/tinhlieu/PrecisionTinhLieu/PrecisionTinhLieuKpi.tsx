import React, { useMemo } from "react";
import { FiList, FiTrendingUp, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

interface PrecisionTinhLieuKpiProps {
  data: any[];
  currentMode: "DETAIL" | "SUMMARY" | "PLAN";
}

const PrecisionTinhLieuKpi: React.FC<PrecisionTinhLieuKpiProps> = ({
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

      // Nhu cầu
      const need = Number(item.NEED_M_QTY) || 0;
      sumNeedQty += need;

      // Tồn kho
      const stock = Number(item.STOCK_M || item.TOTAL_STOCK || 0);
      sumStockQty += stock;

      // Thiếu
      const shortage = Number(item.M_SHORTAGE) || 0;
      if (shortage > 0) {
        sumShortageQty += shortage;
        shortageRows++;
      }

      // Trạng thái khóa / mở liệu
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
    <div className="precision-tinhlieu__kpiGrid">
      {/* 1. Tổng Dòng & Số Mã Liệu */}
      <div className="precision-tinhlieu__kpiCard precision-tinhlieu__kpiCard--blue">
        <div className="precision-tinhlieu__kpiIcon">
          <FiList size={18} />
        </div>
        <div className="precision-tinhlieu__kpiContent">
          <span className="precision-tinhlieu__kpiLabel">Tổng Số Bản Ghi</span>
          <span className="precision-tinhlieu__kpiValue">
            {stats.totalRows.toLocaleString()} <span style={{ fontSize: 11, fontWeight: 500 }}>dòng</span>
          </span>
          <span className="precision-tinhlieu__kpiSub">
            Danh mục: <b>{stats.uniqueMaterials.toLocaleString()}</b> mã vật liệu
          </span>
        </div>
      </div>

      {/* 2. Tổng Nhu Cầu Liệu */}
      <div className="precision-tinhlieu__kpiCard precision-tinhlieu__kpiCard--purple">
        <div className="precision-tinhlieu__kpiIcon">
          <FiTrendingUp size={18} />
        </div>
        <div className="precision-tinhlieu__kpiContent">
          <span className="precision-tinhlieu__kpiLabel">
            {currentMode === "PLAN" ? "Tổng Lượng Tồn Sẵn Có" : "Tổng Nhu Cầu Cấp Liệu"}
          </span>
          <span className="precision-tinhlieu__kpiValue">
            {currentMode === "PLAN"
              ? stats.totalStockQty.toLocaleString()
              : stats.totalNeedQty.toLocaleString()}{" "}
            <span style={{ fontSize: 11, fontWeight: 500 }}>m / m²</span>
          </span>
          <span className="precision-tinhlieu__kpiSub">
            {currentMode === "SUMMARY"
              ? `Tồn kho thực tế: ${stats.totalStockQty.toLocaleString()} m`
              : "Tổng lượng liệu tính theo BOM & PO"}
          </span>
        </div>
      </div>

      {/* 3. Tình Trạng Thiếu Liệu (Shortage) */}
      <div className="precision-tinhlieu__kpiCard precision-tinhlieu__kpiCard--rose">
        <div className="precision-tinhlieu__kpiIcon">
          <FiAlertCircle size={18} />
        </div>
        <div className="precision-tinhlieu__kpiContent">
          <span className="precision-tinhlieu__kpiLabel">Vật Liệu Cần Bổ Sung</span>
          <span className="precision-tinhlieu__kpiValue">
            {currentMode === "SUMMARY" ? (
              stats.shortageRows > 0 ? (
                <span style={{ color: "#e11d48" }}>{stats.shortageRows} mã thiếu</span>
              ) : (
                <span style={{ color: "#059669" }}>Đầy đủ 100%</span>
              )
            ) : stats.noCount > 0 ? (
              <span style={{ color: "#e11d48" }}>{stats.noCount} YCSX khóa</span>
            ) : (
              <span style={{ color: "#059669" }}>Đã sẵn sàng</span>
            )}
          </span>
          <span className="precision-tinhlieu__kpiSub">
            {currentMode === "SUMMARY"
              ? `Lượng thiếu: ${stats.totalShortageQty.toLocaleString()} m`
              : `Khóa liệu: ${stats.noCount} • Chờ: ${stats.pendingCount}`}
          </span>
        </div>
      </div>

      {/* 4. Trạng Thái Cấp Liệu YCSX */}
      <div className="precision-tinhlieu__kpiCard precision-tinhlieu__kpiCard--emerald">
        <div className="precision-tinhlieu__kpiIcon">
          <FiCheckCircle size={18} />
        </div>
        <div className="precision-tinhlieu__kpiContent">
          <span className="precision-tinhlieu__kpiLabel">Tỷ Lệ Mở Liệu Sản Xuất</span>
          <span className="precision-tinhlieu__kpiValue">{stats.unlockRatio}</span>
          <span className="precision-tinhlieu__kpiSub">
            Đã mở: <b>{stats.yesCount}</b> YCSX (YES)
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionTinhLieuKpi);
