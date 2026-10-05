import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiDownload, FiLayers } from "react-icons/fi";
import { SaveExcel } from "../../../../../api/services/excelService";
import { DELIVERY_PLAN_CAPA } from "../../interfaces/khsxInterface";

interface PlanChartsProps {
  dlleadtime: DELIVERY_PLAN_CAPA[];
  eq_series: string[];
  activePlanMachine: string;
  onActivePlanMachineChange: (machine: string) => void;
  selectedPlanDate: string;
  selectedFactory: string;
}

const MACHINE_COLORS: Record<string, { bg: string; text: string }> = {
  FR: { bg: "#eff6ff", text: "#1d4ed8" },
  SR: { bg: "#ecfdf5", text: "#047857" },
  DC: { bg: "#faf5ff", text: "#7e22ce" },
  ED: { bg: "#fff1f2", text: "#be123c" },
  ALL: { bg: "#0284c7", text: "#ffffff" },
};

const CustomPlanTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "6px",
          padding: "8px 12px",
          fontSize: "11px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.06)",
        }}
      >
        <p style={{ fontWeight: 800, marginBottom: 4, color: "#0f172a" }}>
          Ngày Giao: {label}
        </p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, margin: "2px 0" }}>
            {p.name}:{" "}
            <strong>
              {Number(p.value).toLocaleString("en-US", {
                maximumFractionDigits: 1,
              })}
            </strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const PrecisionCapaSx2PlanCharts: React.FC<PlanChartsProps> = ({
  dlleadtime,
  eq_series,
  activePlanMachine,
  onActivePlanMachineChange,
  selectedPlanDate,
  selectedFactory,
}) => {
  const machineList = eq_series.length > 0 ? eq_series : ["FR", "SR", "DC", "ED"];
  const allTabs = ["ALL", ...machineList];

  const handleExportPlan = (eq: string) => {
    const data =
      eq === "ALL"
        ? dlleadtime
        : dlleadtime.filter((d) => d.EQ === eq);
    SaveExcel(data, `CAPASX2_DeliveryPlan_Capa_${eq}`);
  };

  const renderSingleChart = (eq: string, isFullWidth: boolean = false) => {
    const data = dlleadtime.filter((d) => d.EQ === eq);
    const badgeColor = MACHINE_COLORS[eq]?.text || "#0284c7";

    return (
      <div className="executive-card" key={eq}>
        <div className="executive-card__header">
          <div className="executive-card__title-wrap">
            <FiLayers size={13} color={badgeColor} />
            <span className="executive-card__title">
              Năng Lực Giao Hàng (Delivery Plan Capa) — Dòng Máy{" "}
              <strong style={{ color: badgeColor }}>{eq}</strong>
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
        <div
          className="executive-card__body"
          style={{ minHeight: isFullWidth ? 340 : 260 }}
        >
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height={isFullWidth ? 320 : 240}>
              <ComposedChart
                data={data}
                margin={{ top: 12, right: 16, bottom: 20, left: -10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="PL_DATE"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomPlanTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                <Bar
                  dataKey="LEADTIME"
                  name="Leadtime"
                  fill="#10b981"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={28}
                />
                <Line
                  type="monotone"
                  dataKey="AVL_CAPA"
                  name="12H (Khả Dụng)"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="REAL_CAPA"
                  name="8H (Thực Tế)"
                  stroke="#0284c7"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "#94a3b8",
                fontSize: "12px",
                padding: "40px",
              }}
            >
              Chưa có dữ liệu kế hoạch giao hàng cho dòng máy {eq} ({selectedPlanDate} - {selectedFactory})
            </div>
          )}
        </div>
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
          <span>
            Phân Hệ 3: Năng Lực Sản Xuất Theo Kế Hoạch Giao Hàng (Production Capa By Delivery Plan)
          </span>
        </div>
      </div>

      {/* Sub-tabs chọn máy */}
      <div className="machine-segment-tabs">
        {allTabs.map((mach) => (
          <button
            key={mach}
            type="button"
            className={`mach-tab-btn ${
              activePlanMachine === mach ? "mach-tab-btn--active" : ""
            }`}
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
            {mach === "ALL" ? "Tất Cả Thiết Bị" : `Dòng Máy ${mach}`}
          </button>
        ))}

        <button
          type="button"
          className="executive-card__btn-excel"
          onClick={() => handleExportPlan("ALL")}
          style={{ marginLeft: "auto" }}
          title="Xuất Excel toàn bộ dữ liệu delivery plan"
        >
          <FiDownload size={11} />
          <span>Xuất Tất Cả</span>
        </button>
      </div>

      {/* Danh sách biểu đồ */}
      {activePlanMachine === "ALL" ? (
        <div className="two-col-grid">
          {machineList.map((eq) => renderSingleChart(eq, false))}
        </div>
      ) : (
        renderSingleChart(activePlanMachine, true)
      )}
    </div>
  );
};

export default React.memo(PrecisionCapaSx2PlanCharts);
