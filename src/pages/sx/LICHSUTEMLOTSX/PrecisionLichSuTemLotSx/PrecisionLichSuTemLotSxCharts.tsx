import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { TEMLOTSX_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { FaChartLine, FaChartBar, FaCompressAlt, FaExpandAlt } from "react-icons/fa";

interface PrecisionLichSuTemLotSxChartsProps {
  data: TEMLOTSX_DATA[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const PrecisionLichSuTemLotSxCharts: React.FC<PrecisionLichSuTemLotSxChartsProps> = ({
  data,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  // 1. Phân tích dữ liệu theo Ngày
  const dailyChartData = useMemo(() => {
    const map = new Map<string, { date: string; lots: number; qty: number; meters: number }>();

    data.forEach((item) => {
      const dateKey = (item.INS_DATE || "").slice(0, 10);
      if (!dateKey) return;

      const curr = map.get(dateKey) || { date: dateKey, lots: 0, qty: 0, meters: 0 };
      curr.lots += 1;
      curr.qty += Number(item.TEMP_QTY) || 0;
      curr.meters += Number(item.TEMP_MET) || 0;
      map.set(dateKey, curr);
    });

    return Array.from(map.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-15); // Lấy 15 ngày gần nhất
  }, [data]);

  // 2. Phân tích dữ liệu theo Thiết Bị / Máy (Top 8 máy)
  const machineChartData = useMemo(() => {
    const map = new Map<string, { machine: string; lots: number; qty: number }>();

    data.forEach((item) => {
      const machineKey = item.EQUIPMENT_CD || "Khác";
      const curr = map.get(machineKey) || { machine: machineKey, lots: 0, qty: 0 };
      curr.lots += 1;
      curr.qty += Number(item.TEMP_QTY) || 0;
      map.set(machineKey, curr);
    });

    return Array.from(map.values())
      .sort((a, b) => b.lots - a.lots)
      .slice(0, 8);
  }, [data]);

  if (isCollapsed) {
    return (
      <div
        style={{
          padding: "4px 10px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={onToggleCollapse}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, color: "#475569" }}>
          <FaChartLine style={{ color: "#8b5cf6" }} />
          <span>BIỂU ĐỒ XU HƯỚNG SẢN XUẤT & THIẾT BỊ (ĐANG THU GỌN)</span>
        </div>
        <button
          type="button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            border: "none",
            background: "transparent",
            fontSize: "11px",
            color: "#6d28d9",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <FaExpandAlt size={10} /> Mở rộng
        </button>
      </div>
    );
  }

  return (
    <div className="precision-lichsutemlotsx__chartsSection">
      {/* Biểu đồ 1: Xu hướng theo ngày (Lots & EA) */}
      <div className="precision-lichsutemlotsx__chartCard">
        <div className="precision-lichsutemlotsx__chartHeader">
          <span className="precision-lichsutemlotsx__chartTitle">
            <FaChartLine style={{ color: "#8b5cf6" }} />
            <span>XU HƯỚNG IN TEM & SẢN LƯỢNG THEO NGÀY</span>
          </span>
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Thu gọn biểu đồ"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#94a3b8",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <FaCompressAlt size={11} />
            </button>
          )}
        </div>
        <div className="precision-lichsutemlotsx__chartBody">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dailyChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 9.5, fill: "#64748b" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 9.5, fill: "#8b5cf6" }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9.5, fill: "#2563eb" }} />
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  borderColor: "#cbd5e1",
                  borderRadius: "6px",
                  fontSize: "11px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "10px", paddingTop: 2 }} />
              <Bar yAxisId="left" dataKey="lots" name="Số Lot (Lượt)" fill="#8b5cf6" radius={[3, 3, 0, 0]} barSize={16} />
              <Line yAxisId="right" type="monotone" dataKey="qty" name="Tổng EA (Chiếc)" stroke="#2563eb" strokeWidth={2} dot={{ r: 2 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Biểu đồ 2: Top thiết bị in tem */}
      <div className="precision-lichsutemlotsx__chartCard">
        <div className="precision-lichsutemlotsx__chartHeader">
          <span className="precision-lichsutemlotsx__chartTitle">
            <FaChartBar style={{ color: "#10b981" }} />
            <span>TOP THIẾT BỊ / MÁY DẬP IN NHIỀU NHẤT</span>
          </span>
        </div>
        <div className="precision-lichsutemlotsx__chartBody">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={machineChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="machine" tick={{ fontSize: 9.5, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 9.5, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  borderColor: "#cbd5e1",
                  borderRadius: "6px",
                  fontSize: "11px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "10px", paddingTop: 2 }} />
              <Bar dataKey="lots" name="Số Tem (Lots)" fill="#10b981" radius={[3, 3, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PrecisionLichSuTemLotSxCharts;
