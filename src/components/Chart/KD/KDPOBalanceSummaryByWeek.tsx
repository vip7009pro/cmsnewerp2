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
import { PO_BALANCE_DETAIL } from "../../../pages/kinhdoanh/interfaces/kdInterface";

interface KDPOBalanceSummaryByWeekProps {
  data: Array<PO_BALANCE_DETAIL>;
  onClick: (e: any) => void;
}

const formatCompact = (num: number) => {
  if (!num) return "0";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toLocaleString("en-US");
};

const KDPOBalanceSummaryByWeek: React.FC<KDPOBalanceSummaryByWeekProps> = ({ data, onClick }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 340, color: "#94a3b8", fontSize: 12, gap: 6 }}>
        <span>Chưa có dữ liệu tồn đơn theo tuần</span>
        <span style={{ fontSize: 11, color: "#cbd5e1" }}>💡 Bạn có thể nhấp chọn một Năm ở biểu đồ "PO Balance Summary By Year" để tải dữ liệu</span>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0]?.payload;
      return (
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 6, padding: "8px 12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", fontSize: 11 }}>
          <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Tuần: {item?.PO_YW || label}</div>
          <div style={{ color: "#059669", display: "flex", justifyContent: "space-between", gap: 12 }}>
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
            dataKey="PO_YW"
            height={30}
            tick={{ fontSize: 10, fill: "#64748b" }}
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
            name="Tồn Đơn (EA - Nhấp để lọc)"
            fill="#10b981"
            radius={[3, 3, 0, 0]}
            maxBarSize={32}
          >
            <LabelList
              dataKey="PO_BALANCE"
              position="top"
              formatter={(val: any) => (val ? formatCompact(Number(val)) : "")}
              style={{ fontSize: 9, fill: "#047857", fontWeight: 700, fontFamily: "JetBrains Mono" }}
            />
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(KDPOBalanceSummaryByWeek);
