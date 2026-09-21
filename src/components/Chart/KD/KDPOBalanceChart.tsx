import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { nFormatter } from "../../../api/services/utilService";
import { RunningPOData } from "../../../pages/kinhdoanh/interfaces/kdInterface";

interface ChartPOBalanceProps {
  data: Array<RunningPOData>;
}

const formatCompact = (num: number) => {
  if (!num) return "0";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toLocaleString("en-US");
};

const ChartPOBalance: React.FC<ChartPOBalanceProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 340, color: "#94a3b8", fontSize: 12, fontStyle: "italic" }}>
        Chưa có dữ liệu xu hướng tồn đơn PO
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const barItem = payload.find((p: any) => p.dataKey === "RUNNING_BALANCE_AMOUNT");
      const lineItem = payload.find((p: any) => p.dataKey === "RUNNING_PO_BALANCE");
      return (
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 6, padding: "8px 12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", fontSize: 11 }}>
          <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Tuần: {label}</div>
          {lineItem && (
            <div style={{ color: "#059669", display: "flex", justifyContent: "space-between", gap: 12 }}>
              <span>Số lượng tồn:</span>
              <strong style={{ fontFamily: "JetBrains Mono" }}>{(lineItem.value * 1)?.toLocaleString("en-US")} EA</strong>
            </div>
          )}
          {barItem && (
            <div style={{ color: "#7c3aed", display: "flex", justifyContent: "space-between", gap: 12, marginTop: 2 }}>
              <span>Giá trị tồn:</span>
              <strong style={{ fontFamily: "JetBrains Mono" }}>${(barItem.value * 1)?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</strong>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: 360 }}>
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart
          data={data}
          margin={{ top: 34, right: 35, left: 15, bottom: 20 }}
          barCategoryGap="18%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="YEAR_WEEK"
            height={30}
            tick={{ fontSize: 10.5, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            yAxisId="left-axis"
            width={55}
            tick={{ fontSize: 10, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
            tickFormatter={(val) => formatCompact(val) + " EA"}
          />
          <YAxis
            yAxisId="right-axis"
            orientation="right"
            width={60}
            tick={{ fontSize: 10, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
            tickFormatter={(val) => "$" + nFormatter(val, 1)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ paddingBottom: 8, fontSize: 11 }}
          />
          <Bar
            yAxisId="right-axis"
            dataKey="RUNNING_BALANCE_AMOUNT"
            name="Giá Trị Tồn ($)"
            fill="#c084fc"
            radius={[4, 4, 0, 0]}
            maxBarSize={90}
          >
            <LabelList
              dataKey="RUNNING_BALANCE_AMOUNT"
              position="top"
              formatter={(val: any) => (val ? "$" + nFormatter(Number(val), 1) : "")}
              style={{ fontSize: 11.5, fill: "#7c3aed", fontWeight: 700, fontFamily: "JetBrains Mono" }}
            />
          </Bar>
          <Line
            yAxisId="left-axis"
            type="monotone"
            dataKey="RUNNING_PO_BALANCE"
            name="Số Lượng Tồn (EA)"
            stroke="#1ece93"
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: "#059669" }}
            activeDot={{ r: 5.5 }}
          >
            <LabelList
              dataKey="RUNNING_PO_BALANCE"
              position="top"
              offset={10}
              formatter={(val: any) => (val ? formatCompact(Number(val)) : "")}
              style={{ fontSize: 11.5, fill: "#047857", fontWeight: 700, fontFamily: "JetBrains Mono" }}
            />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(ChartPOBalance);
