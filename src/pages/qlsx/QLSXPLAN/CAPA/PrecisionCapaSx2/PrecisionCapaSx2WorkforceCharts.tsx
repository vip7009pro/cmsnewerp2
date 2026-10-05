import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiDownload, FiUsers, FiCpu } from "react-icons/fi";
import { SaveExcel } from "../../../../../api/services/excelService";
import { EQ_STT, SX_CAPA_DATA } from "../../interfaces/khsxInterface";

interface WorkforceChartsProps {
  capadata: SX_CAPA_DATA[];
  eq_status: EQ_STT[];
}

const CustomWorkforceTooltip = ({ active, payload, label }: any) => {
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
          Dòng Máy: {label}
        </p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, margin: "2px 0" }}>
            {p.name}: <strong>{p.value?.toLocaleString("en-US")} người</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const PrecisionCapaSx2WorkforceCharts: React.FC<WorkforceChartsProps> = ({
  capadata,
  eq_status,
}) => {
  // Dữ liệu biểu đồ nhân lực từ các dòng máy (bỏ dòng TOTAL)
  const workforceChartData = useMemo(() => {
    return capadata
      .filter((e) => e.EQ_SERIES !== "TOTAL")
      .map((row) => ({
        name: row.EQ_SERIES,
        "Cần Đủ Capa": row.EQ_OP || 0,
        "Đăng Ký (Retain)": row.RETAIN_WF || 0,
        "Có Mặt (Realtime)": row.ATT_WF || 0,
      }));
  }, [capadata]);

  // Dữ liệu tổng hợp trạng thái máy theo từng dòng
  const machineBreakdown = useMemo(() => {
    const list = capadata.filter((e) => e.EQ_SERIES !== "TOTAL");
    return list.map((item) => {
      const eqPrefix = item.EQ_SERIES;
      const totalQty = item.EQ_QTY || 0;
      const runningCount = eq_status.filter(
        (eq) =>
          eq?.EQ_NAME?.toUpperCase().startsWith(eqPrefix.toUpperCase()) &&
          (eq.EQ_STATUS === "MASS" || eq.EQ_STATUS === "SETTING")
      ).length;
      const settingCount = eq_status.filter(
        (eq) =>
          eq?.EQ_NAME?.toUpperCase().startsWith(eqPrefix.toUpperCase()) &&
          eq.EQ_STATUS === "SETTING"
      ).length;
      return {
        series: eqPrefix,
        totalQty,
        runningCount,
        settingCount,
        rate: totalQty > 0 ? (runningCount / totalQty) * 100 : 0,
      };
    });
  }, [capadata, eq_status]);

  const handleExportWorkforce = () => {
    SaveExcel(workforceChartData, "CAPASX2_Workforce_By_Equipment");
  };

  return (
    <div className="precision-capa-section">
      <div className="precision-capa-section__header">
        <div className="section-badge-title">
          <span className="icon-circle">
            <FiUsers />
          </span>
          <span>Phân Hệ 1: Nhân Lực & Thiết Bị Sản Xuất (Workforce & Equipment)</span>
        </div>
      </div>

      <div className="two-col-grid">
        {/* Card 1: Biểu đồ Nhân lực theo thiết bị */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiUsers size={13} color="#0284c7" />
              <span className="executive-card__title">
                Biểu Đồ Nhân Lực Theo Dòng Máy (Workforce Status)
              </span>
            </div>
            <div className="executive-card__actions">
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={handleExportWorkforce}
                title="Xuất Excel dữ liệu nhân lực"
              >
                <FiDownload size={11} />
                <span>Excel</span>
              </button>
            </div>
          </div>
          <div className="executive-card__body" style={{ minHeight: 280 }}>
            {workforceChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={workforceChartData}
                  margin={{ top: 12, right: 16, bottom: 20, left: -10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    fontWeight={600}
                  />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomWorkforceTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                  <Bar
                    dataKey="Cần Đủ Capa"
                    fill="#8b5cf6"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={30}
                  />
                  <Bar
                    dataKey="Đăng Ký (Retain)"
                    fill="#0284c7"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={30}
                  />
                  <Bar
                    dataKey="Có Mặt (Realtime)"
                    fill="#10b981"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "12px", padding: "40px" }}>
                Không có dữ liệu nhân lực máy
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Tổng hợp Trạng Thái Thiết Bị Theo Dòng */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCpu size={13} color="#10b981" />
              <span className="executive-card__title">
                Trạng Thái Vận Hành Từng Dòng Thiết Bị (Equipment Status)
              </span>
            </div>
          </div>
          <div className="executive-card__body" style={{ minHeight: 280, justifyContent: "flex-start" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: "10px",
                padding: "8px 0",
              }}
            >
              {machineBreakdown.map((item) => (
                <div
                  key={item.series}
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    padding: "10px 12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: "13px",
                        color: "#0f172a",
                      }}
                    >
                      Dòng {item.series}
                    </span>
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor:
                          item.runningCount > 0 ? "#10b981" : "#94a3b8",
                        boxShadow:
                          item.runningCount > 0
                            ? "0 0 0 2px rgba(16, 185, 129, 0.2)"
                            : "none",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "#0284c7",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {item.totalQty}{" "}
                    <small style={{ fontSize: "11px", color: "#64748b", fontWeight: "normal" }}>
                      máy
                    </small>
                  </div>
                  <div
                    style={{
                      fontSize: "10.5px",
                      color: "#64748b",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Đang chạy:</span>
                    <strong style={{ color: "#10b981" }}>
                      {item.runningCount} máy
                    </strong>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      backgroundColor: "#e2e8f0",
                      height: "4px",
                      borderRadius: "2px",
                      overflow: "hidden",
                      marginTop: "2px",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(item.rate, 100)}%`,
                        backgroundColor: "#10b981",
                        height: "100%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCapaSx2WorkforceCharts);
