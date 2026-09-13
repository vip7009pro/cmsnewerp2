import React, { useMemo } from "react";
import moment from "moment";
import { PROD_OVER_DATA } from "../../interfaces/kdInterface";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PrecisionOverChartProps {
  data: PROD_OVER_DATA[];
}

const PrecisionOverChart: React.FC<PrecisionOverChartProps> = ({ data }) => {
  const formatCompact = (n: number) => {
    const abs = Math.abs(n);
    if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
    if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    if (abs >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
    return `${n}`;
  };

  const isoWeekLabel = (ins: any) => {
    const m = moment(ins);
    if (!m.isValid()) return String(ins || "");
    const y = m.isoWeekYear();
    const w = String(m.isoWeek()).padStart(2, "0");
    return `${y}_${w}`;
  };

  const trendData = useMemo(() => {
    const map = new Map<
      string,
      {
        label: string;
        overQtyY: number;
        overQtyN: number;
        amountY: number;
        amountN: number;
      }
    >();

    for (const row of data) {
      const ins = (row as any)?.INS_DATE;
      if (!ins) continue;
      const label = isoWeekLabel(ins);

      const kdCfm = (row as any)?.KD_CFM;
      const isCancelled = kdCfm === "N";

      const overQty = Number((row as any)?.OVER_QTY ?? 0) || 0;
      const amount = Number((row as any)?.AMOUNT ?? 0) || 0;

      const existing = map.get(label) ?? {
        label,
        overQtyY: 0,
        overQtyN: 0,
        amountY: 0,
        amountN: 0,
      };

      if (isCancelled) {
        existing.overQtyN += overQty;
        existing.amountN += amount;
      } else {
        existing.overQtyY += overQty;
        existing.amountY += amount;
      }

      map.set(label, existing);
    }

    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [data]);

  return (
    <section className="precision-over-chart-section">
      <div className="precision-over-chart-section__header">
        <div className="precision-over-chart-section__title">
          <span>TRENDING OVER PRODUCTION</span>
          <span className="subtitle">(YYYY_WW / TUẦN SẢN XUẤT)</span>
        </div>

        <div className="precision-over-chart-section__legend">
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: "#10b981" }}></span>
            <span style={{ color: "#065f46" }}>Xuất QTY</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: "#ef4444" }}></span>
            <span style={{ color: "#9f1239" }}>Hủy QTY</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: "#2563eb" }}></span>
            <span style={{ color: "#1e40af" }}>Xuất AMOUNT</span>
          </div>
          <div className="legend-item">
            <span className="color-dot" style={{ backgroundColor: "#a855f7" }}></span>
            <span style={{ color: "#6b21a8" }}>Hủy AMOUNT</span>
          </div>
        </div>
      </div>

      <div className="precision-over-chart-section__canvas">
        <ResponsiveContainer width="100%" height={175}>
          <BarChart
            data={trendData}
            margin={{ top: 8, right: 20, left: -10, bottom: 0 }}
            barCategoryGap={6}
            barGap={2}
          >
            <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9.5, fill: "#64748b", fontFamily: "JetBrains Mono" }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={false}
            />
            <YAxis
              yAxisId="qty"
              orientation="left"
              tick={{ fontSize: 9.5, fill: "#059669", fontFamily: "JetBrains Mono" }}
              tickFormatter={(v) => formatCompact(Number(v) || 0) + " EA"}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={false}
            />
            <YAxis
              yAxisId="amt"
              orientation="right"
              tick={{ fontSize: 9.5, fill: "#2563eb", fontFamily: "JetBrains Mono" }}
              tickFormatter={(v) => "$" + formatCompact(Number(v) || 0)}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#cbd5e1",
                borderRadius: "6px",
                fontSize: "11px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: any, name: any) => {
                const n = Number(value) || 0;
                if (String(name).toLowerCase().includes("amount")) {
                  return [`$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, name];
                }
                return [`${n.toLocaleString("en-US")} EA`, name];
              }}
            />
            <Legend wrapperStyle={{ display: "none" }} />

            <Bar yAxisId="qty" dataKey="overQtyY" name="Xuất QTY" stackId="qty" fill="#10b981" radius={[2, 2, 0, 0]} maxBarSize={18} />
            <Bar yAxisId="qty" dataKey="overQtyN" name="Hủy QTY" stackId="qty" fill="#ef4444" radius={[2, 2, 0, 0]} maxBarSize={18} />

            <Bar yAxisId="amt" dataKey="amountY" name="Xuất AMOUNT" stackId="amt" fill="#2563eb" radius={[2, 2, 0, 0]} maxBarSize={18} />
            <Bar yAxisId="amt" dataKey="amountN" name="Hủy AMOUNT" stackId="amt" fill="#a855f7" radius={[2, 2, 0, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default React.memo(PrecisionOverChart);
