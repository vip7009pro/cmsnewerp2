import React, { useState } from "react";
import { FiDownload, FiLayers } from "react-icons/fi";
import { SaveExcel } from "../../../../../api/services/excelService";
import ProductionPlanCapaChart from "../../../../../components/Chart/KHSX/ProductionPlanCapa";
import { PROD_PLAN_CAPA_DATA } from "../../interfaces/khsxInterface";

interface PrecisionCapaSxPlanChartsProps {
  productionplancapadata: PROD_PLAN_CAPA_DATA[];
  activePlanMachine: string;
  onActivePlanMachineChange: (machine: string) => void;
}

const MACHINE_LIST = ["ALL", "FR", "SR", "DC", "ED"];
const MACHINE_COLORS: Record<string, { bg: string; text: string }> = {
  FR: { bg: "#eff6ff", text: "#1d4ed8" },
  SR: { bg: "#ecfdf5", text: "#047857" },
  DC: { bg: "#faf5ff", text: "#7e22ce" },
  ED: { bg: "#fff1f2", text: "#be123c" },
  ALL: { bg: "#0284c7", text: "#ffffff" },
};

const PrecisionCapaSxPlanCharts: React.FC<PrecisionCapaSxPlanChartsProps> = ({
  productionplancapadata,
  activePlanMachine,
  onActivePlanMachineChange,
}) => {
  const handleExportPlan = (eq: string) => {
    const data =
      eq === "ALL"
        ? productionplancapadata
        : productionplancapadata.filter((d) => d.EQ_SERIES === eq);
    SaveExcel(data, `CapaSx_PlanCapa_${eq}`);
  };

  const renderCharts = () => {
    const eqList = activePlanMachine === "ALL" ? ["FR", "SR", "DC", "ED"] : [activePlanMachine];
    if (eqList.length === 1) {
      const eq = eqList[0];
      const data = productionplancapadata.filter((d) => d.EQ_SERIES === eq);
      return (
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiLayers size={13} color={MACHINE_COLORS[eq]?.text || "#0284c7"} />
              <span className="executive-card__title">
                Kế Hoạch Năng Lực Theo Tháng — Dòng Máy{" "}
                <strong style={{ color: MACHINE_COLORS[eq]?.text }}>{eq}</strong>
              </span>
            </div>
            <div className="executive-card__actions">
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={() => handleExportPlan(eq)}
                title={`Xuất Excel kế hoạch capa máy ${eq}`}
              >
                <FiDownload size={11} />
                <span>Excel {eq}</span>
              </button>
            </div>
          </div>
          <div className="executive-card__body" style={{ minHeight: 360 }}>
            <ProductionPlanCapaChart
              dldata={data}
              materialColor="#3DC23D"
              processColor="#3DC23D"
            />
          </div>
        </div>
      );
    }

    // All: 2-col grid
    return (
      <div className="two-col-grid">
        {eqList.map((eq) => {
          const data = productionplancapadata.filter((d) => d.EQ_SERIES === eq);
          return (
            <div className="executive-card" key={eq}>
              <div className="executive-card__header">
                <div className="executive-card__title-wrap">
                  <FiLayers size={13} color={MACHINE_COLORS[eq]?.text || "#0284c7"} />
                  <span className="executive-card__title">
                    Kế Hoạch Năng Lực —{" "}
                    <strong style={{ color: MACHINE_COLORS[eq]?.text }}>{eq}</strong>
                  </span>
                </div>
                <div className="executive-card__actions">
                  <button
                    type="button"
                    className="executive-card__btn-excel"
                    onClick={() => handleExportPlan(eq)}
                    title={`Xuất Excel capa máy ${eq}`}
                  >
                    <FiDownload size={11} />
                    <span>Excel</span>
                  </button>
                </div>
              </div>
              <div className="executive-card__body" style={{ minHeight: 280 }}>
                <ProductionPlanCapaChart
                  dldata={data}
                  materialColor="#3DC23D"
                  processColor="#3DC23D"
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="precision-capa-section">
      <div className="precision-capa-section__header">
        <div className="section-badge-title">
          <span className="icon-circle">
            <FiLayers />
          </span>
          <span>Kế Hoạch Năng Lực Dài Hạn Theo Dòng Máy (FR / SR / DC / ED)</span>
        </div>
      </div>

      {/* Sub-tabs chọn nhanh máy */}
      <div className="machine-segment-tabs">
        {MACHINE_LIST.map((mach) => (
          <button
            key={mach}
            type="button"
            className={`mach-tab-btn ${activePlanMachine === mach ? "mach-tab-btn--active" : ""}`}
            onClick={() => onActivePlanMachineChange(mach)}
            style={
              activePlanMachine !== mach
                ? {}
                : mach !== "ALL"
                ? {
                    backgroundColor: MACHINE_COLORS[mach]?.bg,
                    color: MACHINE_COLORS[mach]?.text,
                    borderColor: MACHINE_COLORS[mach]?.text,
                  }
                : {}
            }
          >
            {mach === "ALL" ? "Tất Cả 4 Máy" : `Máy ${mach}`}
          </button>
        ))}
        <button
          type="button"
          className="executive-card__btn-excel"
          style={{ marginLeft: "auto" }}
          onClick={() => handleExportPlan(activePlanMachine)}
          title="Xuất Excel kế hoạch đang xem"
        >
          <FiDownload size={11} />
          <span>Xuất Excel</span>
        </button>
      </div>

      {renderCharts()}
    </div>
  );
};

export { PrecisionCapaSxPlanCharts };
export default React.memo(PrecisionCapaSxPlanCharts);
