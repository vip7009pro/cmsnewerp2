import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { DiemDanhHistoryData } from "../../interfaces/nhansuInterface";
import { AiOutlineRise } from "react-icons/ai";

interface PrecisionBaoCaoTrendChartProps {
  data: Array<DiemDanhHistoryData>;
  fromDate: string;
  toDate: string;
}

export const PrecisionBaoCaoTrendChart: React.FC<PrecisionBaoCaoTrendChartProps> = ({
  data,
  fromDate,
  toDate,
}) => {
  // Format dữ liệu cho ComposedChart: tính toán ON_RATE và chuẩn hóa số liệu
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item, index) => {
      const on = Number(item.TOTAL_ON) || 0;
      const off = Number(item.TOTAL_OFF) || 0;
      const tot =
        Number((item as any).TOTAL_ALL) ||
        Number(item.TOTAL) ||
        (on + off);

      let rate = Number(item.ON_RATE);
      // Nếu rate chưa được tính hoặc = 0 mà có dữ liệu on/off thì tự tính
      if (isNaN(rate) || rate === 0) {
        rate = tot > 0 ? Number(((on / tot) * 100).toFixed(1)) : 0;
      } else if (rate > 0 && rate <= 1) {
        // Backend trả về tỷ lệ thập phân (0.85 -> 85)
        rate = Number((rate * 100).toFixed(1));
      } else {
        rate = Number(rate.toFixed(1));
      }

      const shortDate = item.APPLY_DATE ? item.APPLY_DATE.slice(5, 10) : "";
      const isLast = index === data.length - 1;

      return {
        ...item,
        shortDate,
        ON_RATE: rate,
        TOTAL_ON: on,
        TOTAL_OFF: off,
        TOTAL: tot,
        isLast,
      };
    });
  }, [data]);

  return (
    <section className="precision-baocao__trendSection">
      <div className="precision-baocao__sectionHeader">
        <div className="precision-baocao__sectionTitle">
          <AiOutlineRise color="#2563eb" size={18} />
          <span>
            Biểu đồ trending tình hình đi làm ({fromDate.slice(0, 10)} ~ {toDate.slice(0, 10)})
          </span>
        </div>

        <div className="precision-baocao__trendLegends">
          <div className="precision-baocao__legendItem">
            <span
              className="precision-baocao__legendDot"
              style={{ background: "#05b388", borderRadius: "2px", width: 10, height: 10 }}
            />
            <span>TOTAL_ON (Đi làm)</span>
          </div>
          <div className="precision-baocao__legendItem">
            <span
              className="precision-baocao__legendDot"
              style={{ background: "#f43f5e", borderRadius: "2px", width: 10, height: 10 }}
            />
            <span>TOTAL_OFF (Nghỉ làm)</span>
          </div>
          <div className="precision-baocao__legendItem">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                marginRight: 4,
                color: "#059669",
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 2.5,
                  background: "#059669",
                }}
              />
              <span
                style={{
                  display: "inline-block",
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  border: "2px solid #059669",
                  background: "#ffffff",
                  marginLeft: -4,
                }}
              />
            </span>
            <span>ON_RATE (Tỷ lệ %)</span>
          </div>
        </div>
      </div>

      <div className="precision-baocao__chartContainer">
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart
            data={chartData}
            margin={{ top: 15, right: 25, bottom: 5, left: -10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="shortDate"
              tick={({ x, y, payload }) => {
                const isLastItem =
                  chartData.length > 0 &&
                  chartData[chartData.length - 1]?.shortDate === payload.value;
                return (
                  <text
                    x={x}
                    y={y + 12}
                    textAnchor="middle"
                    fill={isLastItem ? "#2563eb" : "#64748b"}
                    fontWeight={isLastItem ? 700 : 500}
                    fontSize={11}
                  >
                    {payload.value}
                  </text>
                );
              }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              unit="%"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pData = payload[0]?.payload;
                  return (
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
                        fontSize: "11.5px",
                        minWidth: 160,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#0f172a",
                          borderBottom: "1px solid #f1f5f9",
                          paddingBottom: 4,
                          marginBottom: 6,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Ngày: {pData?.APPLY_DATE || label}</span>
                        <span style={{ color: "#64748b" }}>Tổng: {pData?.TOTAL}</span>
                      </div>
                      <div style={{ color: "#059669", margin: "3px 0", fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                        <span>● Đi làm (ON):</span>
                        <b>{pData?.TOTAL_ON} người</b>
                      </div>
                      <div style={{ color: "#e11d48", margin: "3px 0", fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                        <span>● Nghỉ làm (OFF):</span>
                        <b>{pData?.TOTAL_OFF} người</b>
                      </div>
                      <div
                        style={{
                          color: "#059669",
                          marginTop: 6,
                          paddingTop: 4,
                          borderTop: "1px dashed #e2e8f0",
                          fontWeight: 700,
                          fontSize: "12px",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Tỷ lệ đi làm:</span>
                        <span>{pData?.ON_RATE}%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Cột chồng: TOTAL_ON ở dưới */}
            <Bar
              yAxisId="left"
              dataKey="TOTAL_ON"
              stackId="attendance"
              fill="#05b388"
              radius={[0, 0, 0, 0]}
              maxBarSize={32}
            />
            {/* Cột chồng: TOTAL_OFF ở trên, bo góc trên cùng */}
            <Bar
              yAxisId="left"
              dataKey="TOTAL_OFF"
              stackId="attendance"
              fill="#f43f5e"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            {/* Đường biểu diễn tỷ lệ % đi làm */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="ON_RATE"
              stroke="#059669"
              strokeWidth={2.8}
              dot={{
                r: 4,
                fill: "#ffffff",
                stroke: "#059669",
                strokeWidth: 2.5,
              }}
              activeDot={{
                r: 6,
                fill: "#059669",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default PrecisionBaoCaoTrendChart;
