import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  LabelList,
} from "recharts";
import { PROD_PLAN_CAPA_DATA } from "../../interfaces/khsxInterface";

interface PrecisionLongTermCapaChartProps {
  data: PROD_PLAN_CAPA_DATA[];
  barColor?: string;
  chartHeight?: number;
}

const formatCompactNumber = (num: number) => {
  if (num === null || num === undefined) return "0";
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return Math.round(num).toString();
};

const CustomCapaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const leadTime = payload.find((p: any) => p.dataKey === "LEADTIME")?.value ?? 0;
    const eqCapa = payload.find((p: any) => p.dataKey === "EQ_CAPA")?.value ?? 0;
    const eqCapa12h = payload.find((p: any) => p.dataKey === "EQ_CAPA_12H")?.value ?? 0;
    const retainWf = payload.find((p: any) => p.dataKey === "RETAIN_WF_CAPA")?.value ?? 0;
    const retainWf12h = payload.find((p: any) => p.dataKey === "RETAIN_WF_CAPA_12H")?.value ?? 0;

    return (
      <div className="longterm-capa-tooltip">
        <div className="longterm-capa-tooltip__title">
          <span>Ngày: {label}</span>
        </div>
        <div className="longterm-capa-tooltip__row">
          <span className="label">
            <span className="dot" style={{ backgroundColor: "#2563eb" }} />
            Lead Time:
          </span>
          <span className="value">{Math.round(leadTime).toLocaleString("en-US")} h</span>
        </div>
        <div className="longterm-capa-tooltip__row">
          <span className="label">
            <span className="dot" style={{ backgroundColor: "#0284c7" }} />
            EQ Capa (24H):
          </span>
          <span className="value">{Math.round(eqCapa).toLocaleString("en-US")} h</span>
        </div>
        <div className="longterm-capa-tooltip__row">
          <span className="label">
            <span className="dot" style={{ backgroundColor: "#38bdf8" }} />
            EQ Capa (12H):
          </span>
          <span className="value">{Math.round(eqCapa12h).toLocaleString("en-US")} h</span>
        </div>
        <div className="longterm-capa-tooltip__row">
          <span className="label">
            <span className="dot" style={{ backgroundColor: "#9333ea" }} />
            Workforce (24H):
          </span>
          <span className="value">{Math.round(retainWf).toLocaleString("en-US")} h</span>
        </div>
        <div className="longterm-capa-tooltip__row">
          <span className="label">
            <span className="dot" style={{ backgroundColor: "#c084fc" }} />
            Workforce (12H):
          </span>
          <span className="value">{Math.round(retainWf12h).toLocaleString("en-US")} h</span>
        </div>
      </div>
    );
  }
  return null;
};

const PrecisionLongTermCapaChart: React.FC<PrecisionLongTermCapaChartProps> = ({
  data,
  barColor = "#4f46e5",
  chartHeight = 220,
}) => {
  return (
    <div style={{ width: "100%", height: chartHeight, minHeight: 180 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 12, left: -10, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="PROD_DATE"
            tick={{ fontSize: 10, fill: "#64748b", fontFamily: "JetBrains Mono, monospace" }}
            tickLine={false}
            axisLine={{ stroke: "#cbd5e1" }}
            height={20}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#64748b", fontFamily: "JetBrains Mono, monospace" }}
            tickLine={false}
            axisLine={{ stroke: "#cbd5e1" }}
            tickFormatter={formatCompactNumber}
            width={38}
          />
          <Tooltip content={<CustomCapaTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconSize={9}
            wrapperStyle={{ paddingBottom: 4, fontSize: "10px", fontWeight: 600 }}
          />

          {/* Cột Lead Time */}
          <Bar
            name="LeadTime"
            dataKey="LEADTIME"
            fill={barColor}
            radius={[3, 3, 0, 0]}
            maxBarSize={28}
          >
            <LabelList
              dataKey="LEADTIME"
              position="top"
              formatter={(val: any) => (val > 0 ? formatCompactNumber(val) : "")}
              style={{ fontSize: "8.5px", fill: "#475569", fontWeight: 700 }}
            />
          </Bar>

          {/* Đường EQ Capa */}
          <Line
            name="EQ Capa (24H)"
            type="monotone"
            dataKey="EQ_CAPA"
            stroke="#0284c7"
            strokeWidth={1.8}
            dot={{ r: 2, fill: "#0284c7" }}
            activeDot={{ r: 4 }}
          />
          <Line
            name="EQ Capa (12H)"
            type="monotone"
            dataKey="EQ_CAPA_12H"
            stroke="#38bdf8"
            strokeWidth={1.4}
            strokeDasharray="3 3"
            dot={false}
          />

          {/* Đường Nhân lực Workforce */}
          <Line
            name="Workforce (24H)"
            type="monotone"
            dataKey="RETAIN_WF_CAPA"
            stroke="#9333ea"
            strokeWidth={1.8}
            dot={{ r: 2, fill: "#9333ea" }}
            activeDot={{ r: 4 }}
          />
          <Line
            name="Workforce (12H)"
            type="monotone"
            dataKey="RETAIN_WF_CAPA_12H"
            stroke="#c084fc"
            strokeWidth={1.4}
            strokeDasharray="3 3"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(PrecisionLongTermCapaChart);
