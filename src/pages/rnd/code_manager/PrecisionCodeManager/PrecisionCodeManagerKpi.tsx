// PrecisionCodeManagerKpi.tsx - 4 Realtime KPI Summary Widgets based on actual Product Master data

import React, { useMemo } from "react";
import { MdLayers, MdCategory, MdArchitecture, MdAllInbox } from "react-icons/md";
import { CODE_FULL_INFO } from "../../interfaces/rndInterface";

interface PrecisionCodeManagerKpiProps {
  data: CODE_FULL_INFO[];
}

const PrecisionCodeManagerKpi: React.FC<PrecisionCodeManagerKpiProps> = ({ data }) => {
  // 1. Thống kê Tổng mã sản phẩm & Active Rate
  const totalStats = useMemo(() => {
    const total = data.length;
    const active = data.filter((r) => r.USE_YN === "Y").length;
    const inactive = total - active;
    const activeRate = total > 0 ? ((active / total) * 100).toFixed(1) : "0.0";
    return { total, active, inactive, activeRate };
  }, [data]);

  // 2. Thống kê Phân loại sản phẩm (PROD_TYPE Breakdown)
  const prodTypeStats = useMemo(() => {
    const total = data.length;
    const map: Record<string, number> = {};

    data.forEach((r) => {
      const type = r.PROD_TYPE?.trim() || "KHÁC";
      map[type] = (map[type] || 0) + 1;
    });

    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const top1 = sorted[0] || ["N/A", 0];
    const top2 = sorted[1] || null;
    const top3 = sorted[2] || null;
    const topRate = total > 0 ? ((top1[1] / total) * 100).toFixed(1) : "0.0";

    return {
      top1Name: top1[0],
      top1Count: top1[1],
      topRate,
      top2Text: top2 ? `${top2[0]}: ${top2[1]}` : "",
      top3Text: top3 ? `${top3[0]}: ${top3[1]}` : "",
      totalTypes: Object.keys(map).length,
    };
  }, [data]);

  // 3. Thống kê Dòng máy (PROD_MODEL) & Bản vẽ kỹ thuật (PDBV)
  const modelStats = useMemo(() => {
    const total = data.length;
    const modelMap: Record<string, number> = {};
    let approvedDrawings = 0;

    data.forEach((r) => {
      const model = r.PROD_MODEL?.trim();
      if (model) {
        modelMap[model] = (modelMap[model] || 0) + 1;
      }
      if (r.PDBV === "Y") {
        approvedDrawings++;
      }
    });

    const uniqueModels = Object.keys(modelMap).length;
    const sortedModels = Object.entries(modelMap).sort((a, b) => b[1] - a[1]);
    const topModel = sortedModels[0] || ["N/A", 0];
    const drawingRate = total > 0 ? ((approvedDrawings / total) * 100).toFixed(1) : "0.0";

    return {
      uniqueModels,
      topModelName: topModel[0],
      topModelCount: topModel[1],
      approvedDrawings,
      drawingRate,
    };
  }, [data]);

  // 4. Thống kê Quy cách đóng gói (PACKING_TYPE) & Hao hụt
  const packingStats = useMemo(() => {
    let rollCount = 0;
    let trayCount = 0;
    let otherCount = 0;
    let sumLossKT = 0;
    let countLossKT = 0;

    data.forEach((r) => {
      const pack = (r.PACKING_TYPE || "").toUpperCase();
      if (pack.includes("ROLL") || pack.includes("CUON")) {
        rollCount++;
      } else if (pack.includes("TRAY") || pack.includes("KHAY")) {
        trayCount++;
      } else {
        otherCount++;
      }

      if (r.BEP != null && !isNaN(Number(r.BEP)) && Number(r.BEP) > 0) {
        sumLossKT += Number(r.BEP);
        countLossKT++;
      }
    });

    const avgBEP = countLossKT > 0 ? (sumLossKT / countLossKT).toFixed(0) : "0";

    return {
      rollCount,
      trayCount,
      otherCount,
      avgBEP,
    };
  }, [data]);

  return (
    <div className="precision-code-manager__kpiBar">
      {/* Card 1: Tổng Mã Sản Phẩm */}
      <div className="precision-code-manager__kpiCard precision-code-manager__kpiCard--blue">
        <div className="card-top">
          <div className="card-texts">
            <span className="card-label">TỔNG MÃ SẢN PHẨM (TOTAL PRODUCTS)</span>
            <div className="card-value-row">
              <span className="card-value">{totalStats.total.toLocaleString("en-US")}</span>
              <span className="card-badge">{totalStats.activeRate}% Active</span>
            </div>
          </div>
          <div className="card-icon-box">
            <MdLayers />
          </div>
        </div>

        <div className="card-progress">
          <div
            className="card-progress-bar"
            style={{ width: `${Math.min(Number(totalStats.activeRate), 100)}%` }}
          />
        </div>

        <div className="card-bottom">
          <span>Kích hoạt: <strong style={{ color: "#059669" }}>{totalStats.active}</strong></span>
          <span>Tạm ngưng: <strong style={{ color: "#dc2626" }}>{totalStats.inactive}</strong></span>
        </div>
      </div>

      {/* Card 2: Phân Loại Sản Phẩm */}
      <div className="precision-code-manager__kpiCard precision-code-manager__kpiCard--emerald">
        <div className="card-top">
          <div className="card-texts">
            <span className="card-label">PHÂN LOẠI SẢN PHẨM ({prodTypeStats.totalTypes} NHÓM)</span>
            <div className="card-value-row">
              <span className="card-value">{prodTypeStats.top1Name}</span>
              <span className="card-badge">{prodTypeStats.top1Count} mã ({prodTypeStats.topRate}%)</span>
            </div>
          </div>
          <div className="card-icon-box">
            <MdCategory />
          </div>
        </div>

        <div className="card-progress">
          <div
            className="card-progress-bar"
            style={{ width: `${Math.min(Number(prodTypeStats.topRate), 100)}%` }}
          />
        </div>

        <div className="card-bottom">
          <span>{prodTypeStats.top2Text || "Đa dạng mẫu mã"}</span>
          <span>{prodTypeStats.top3Text}</span>
        </div>
      </div>

      {/* Card 3: Dòng Máy & Bản Vẽ Kỹ Thuật */}
      <div className="precision-code-manager__kpiCard precision-code-manager__kpiCard--indigo">
        <div className="card-top">
          <div className="card-texts">
            <span className="card-label">DÒNG MÁY / MODEL (TOP PROD_MODELS)</span>
            <div className="card-value-row">
              <span className="card-value">{modelStats.uniqueModels}</span>
              <span className="card-badge">Top: {modelStats.topModelName}</span>
            </div>
          </div>
          <div className="card-icon-box">
            <MdArchitecture />
          </div>
        </div>

        <div className="card-progress">
          <div
            className="card-progress-bar"
            style={{ width: `${Math.min(Number(modelStats.drawingRate), 100)}%` }}
          />
        </div>

        <div className="card-bottom">
          <span>Bản vẽ duyệt: <strong>{modelStats.approvedDrawings}</strong></span>
          <span style={{ color: "#4f46e5", fontWeight: 700 }}>{modelStats.drawingRate}% Duyệt</span>
        </div>
      </div>

      {/* Card 4: Quy Cách Đóng Gói */}
      <div className="precision-code-manager__kpiCard precision-code-manager__kpiCard--amber">
        <div className="card-top">
          <div className="card-texts">
            <span className="card-label">QUY CÁCH ĐÓNG GÓI (PACKING SPECS)</span>
            <div className="card-value-row">
              <span className="card-value">{packingStats.rollCount} Cuộn</span>
              <span className="card-badge">{packingStats.trayCount} Khay</span>
            </div>
          </div>
          <div className="card-icon-box">
            <MdAllInbox />
          </div>
        </div>

        <div className="card-progress">
          <div
            className="card-progress-bar"
            style={{
              width: `${
                totalStats.total > 0
                  ? Math.min(((packingStats.rollCount / totalStats.total) * 100), 100)
                  : 0
              }%`,
            }}
          />
        </div>

        <div className="card-bottom">
          <span>Dạng khác: <strong>{packingStats.otherCount}</strong></span>
          <span>BEP TB: <strong style={{ color: "#b45309" }}>{packingStats.avgBEP}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCodeManagerKpi);
