import React from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { PO_BALANCE_SUMMARY } from "../../../pages/kinhdoanh/interfaces/kdInterface";

interface KDPOBalanceSummaryByYearProps {
  data: Array<PO_BALANCE_SUMMARY>;
  onClick: (e: any) => void;
}

const formatCompact = (num: number) => {
  if (!num) return "0";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toLocaleString("en-US");
};

const KDPOBalanceSummaryByYear: React.FC<KDPOBalanceSummaryByYearProps> = ({ data, onClick }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 340, color: "#94a3b8", fontSize: 12, fontStyle: "italic" }}>
        Chưa có dữ liệu tồn đơn theo năm
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0]?.payload;
      return (
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 6, padding: "8px 12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", fontSize: 11 }}>
          <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Năm: {item?.PO_YEAR || label}</div>
          <div style={{ color: "#2563eb", display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span>Số lượng tồn:</span>
            <strong style={{ fontFamily: "JetBrains Mono" }}>{(item?.PO_BALANCE * 1)?.toLocaleString("en-US")} EA</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart
          data={data}
          onClick={onClick}
          margin={{ top: 28, right: 25, left: 15, bottom: 20 }}
          style={{ cursor: "pointer" }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="PO_YEAR"
            height={30}
            tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            width={55}
            tick={{ fontSize: 10, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
            tickFormatter={(val) => formatCompact(val) + " EA"}
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
            dataKey="PO_BALANCE"
            name="Tồn Đơn Theo Năm (EA - Nhấp để lọc tuần)"
            fill="#3b82f6"
            radius={[3, 3, 0, 0]}
            maxBarSize={36}
          >
            <LabelList
              dataKey="PO_BALANCE"
              position="top"
              formatter={(val: any) => (val ? formatCompact(Number(val)) : "")}
              style={{ fontSize: 9.5, fill: "#1d4ed8", fontWeight: 700, fontFamily: "JetBrains Mono" }}
            />
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(KDPOBalanceSummaryByYear);
