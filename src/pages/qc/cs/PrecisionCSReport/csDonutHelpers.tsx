import React from "react";
import { Sector } from "recharts";

export const ENTERPRISE_PALETTE = [
  "#2563eb", "#059669", "#d97706", "#7c3aed", "#e11d48", "#0891b2",
  "#ea580c", "#4f46e5", "#16a34a", "#9333ea", "#0284c7", "#ca8a04",
  "#be123c", "#0d9488", "#475569", "#6366f1", "#10b981", "#f59e0b",
  "#8b5cf6", "#ec4899", "#14b8a6", "#3b82f6", "#84cc16", "#f97316",
  "#6b7280", "#a855f7", "#22c55e", "#eab308",
];

export const formatCompact = (num: number) => {
  if (!num) return "0";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toLocaleString("en-US");
};

export const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 7}
        outerRadius={outerRadius + 9}
        fill={fill}
      />
    </g>
  );
};

export const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, percent, index, name, value } = props;
  if (percent < 0.035) return null;

  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);
  const sx = cx + (outerRadius + 2) * cos;
  const sy = cy + (outerRadius + 2) * sin;
  const mx = cx + (outerRadius + 11) * cos;
  const my = cy + (outerRadius + 11) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 10;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";
  const color = ENTERPRISE_PALETTE[index % ENTERPRISE_PALETTE.length];
  const displayName = name && name.length > 11 ? `${name.slice(0, 10)}…` : name;

  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={color} fill="none" strokeWidth={1.2} />
      <circle cx={ex} cy={ey} r={2} fill={color} />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 3}
        y={ey}
        textAnchor={textAnchor}
        fill="#1e293b"
        dominantBaseline="central"
        fontSize={10}
        fontWeight={700}
      >
        {`${displayName}: ${formatCompact(value)}`}
      </text>
    </g>
  );
};
