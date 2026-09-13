import React, { useEffect, useState } from "react";
import moment from "moment";
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
import { generalQuery } from "../../../api/Api";
import { SamSungFCSTData } from "../../../pages/kinhdoanh/interfaces/kdInterface";

const formatCompact = (num: number) => {
  if (!num) return "0";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toLocaleString("en-US");
};

const ChartFCSTSamSung: React.FC = () => {
  const [runningPOData, setSamSungFCSTData] = useState<Array<SamSungFCSTData>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [infoWeeks, setInfoWeeks] = useState<{ w1: number; w2: number; y1: number; y2: number }>({
    w1: 0,
    w2: 0,
    y1: 0,
    y2: 0,
  });

  const handleGetDailyClosing = async () => {
    setLoading(true);
    let fcstweek2: number = moment().add(1, "days").isoWeek();
    let fcstyear2: number = moment().year();
    let fcstyear1: number = moment().year();

    try {
      // Truy vấn tuần FCST gần nhất
      let weekRes = await generalQuery("checklastfcstweekno", {
        FCSTWEEKNO: fcstyear2,
      });

      if (weekRes?.data?.data?.[0]?.FCSTWEEKNO) {
        fcstweek2 = weekRes.data.data[0].FCSTWEEKNO;
      } else {
        // Fallback năm trước nếu năm hiện tại chưa có dữ liệu
        const fallbackRes = await generalQuery("checklastfcstweekno", {
          FCSTWEEKNO: fcstyear2 - 1,
        });
        if (fallbackRes?.data?.data?.[0]?.FCSTWEEKNO) {
          fcstyear2 = fcstyear2 - 1;
          fcstyear1 = fcstyear2;
          fcstweek2 = fallbackRes.data.data[0].FCSTWEEKNO;
        }
      }

      let fcstweek1 = fcstweek2 - 1;
      if (fcstweek2 <= 1) {
        fcstweek1 = 52;
        fcstyear1 = fcstyear2 - 1;
      }

      setInfoWeeks({ w1: fcstweek1, w2: fcstweek2, y1: fcstyear1, y2: fcstyear2 });

      const res = await generalQuery("baocaofcstss", {
        FCSTYEAR1: fcstyear1,
        FCSTYEAR2: fcstyear2,
        FCSTWEEKNUM1: fcstweek1,
        FCSTWEEKNUM2: fcstweek2,
      });

      if (res?.data?.tk_status !== "NG" && res?.data?.data) {
        const loadeddata: SamSungFCSTData[] = res.data.data.map(
          (element: SamSungFCSTData, index: number) => {
            return {
              ...element,
              WEEKNO:
                fcstweek2 + index > 52
                  ? "W" +
                    (fcstweek2 + index - 52 - 1 === 0 ? 52 : 1) +
                    "_W" +
                    (fcstweek2 + index - 52)
                  : "W" +
                    (fcstweek2 + index - 1) +
                    "_W" +
                    (fcstweek2 + index),
            };
          }
        );
        setSamSungFCSTData(loadeddata.slice(0, 15));
      }
    } catch (err) {
      console.error("Lỗi nạp báo cáo FCST Samsung:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetDailyClosing();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const w1Total =
        (payload.find((p: any) => p.dataKey === "SEVT1")?.value || 0) +
        (payload.find((p: any) => p.dataKey === "SEV1")?.value || 0) +
        (payload.find((p: any) => p.dataKey === "SAMSUNG_ASIA1")?.value || 0);

      const w2Total =
        (payload.find((p: any) => p.dataKey === "SEVT2")?.value || 0) +
        (payload.find((p: any) => p.dataKey === "SEV2")?.value || 0) +
        (payload.find((p: any) => p.dataKey === "SAMSUNG_ASIA2")?.value || 0);

      return (
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 6, padding: "8px 12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", fontSize: 11 }}>
          <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Tuần: {label}</div>
          <div style={{ color: "#64748b", display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span>Tuần W{infoWeeks.w1}:</span>
            <strong style={{ fontFamily: "JetBrains Mono", color: "#2563eb" }}>{w1Total.toLocaleString("en-US")} EA</strong>
          </div>
          <div style={{ color: "#64748b", display: "flex", justifyContent: "space-between", gap: 12, marginTop: 2 }}>
            <span>Tuần W{infoWeeks.w2}:</span>
            <strong style={{ fontFamily: "JetBrains Mono", color: "#059669" }}>{w2Total.toLocaleString("en-US")} EA</strong>
          </div>
          {w1Total > 0 && (
            <div style={{ marginTop: 4, fontSize: 10, color: w2Total >= w1Total ? "#059669" : "#dc2626", fontWeight: 700 }}>
              Biến động: {(((w2Total - w1Total) / w1Total) * 100).toFixed(1)}%
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderTotalLabelW1 = (props: any) => {
    const { x, y, width, index } = props;
    const item = runningPOData[index];
    const total = item?.TT_SS1 ?? ((item?.SEVT1 || 0) + (item?.SEV1 || 0) + (item?.SAMSUNG_ASIA1 || 0));
    if (!total || total === 0) return null;
    return (
      <text
        x={x + width / 2}
        y={y - 4}
        fill="#15803d"
        textAnchor="middle"
        fontSize={8.5}
        fontWeight={700}
        fontFamily="JetBrains Mono, monospace"
      >
        {formatCompact(total)}
      </text>
    );
  };

  const renderTotalLabelW2 = (props: any) => {
    const { x, y, width, index } = props;
    const item = runningPOData[index];
    const total = item?.TT_SS2 ?? ((item?.SEVT2 || 0) + (item?.SEV2 || 0) + (item?.SAMSUNG_ASIA2 || 0));
    if (!total || total === 0) return null;
    return (
      <text
        x={x + width / 2}
        y={y - 4}
        fill="#1d4ed8"
        textAnchor="middle"
        fontSize={8.5}
        fontWeight={700}
        fontFamily="JetBrains Mono, monospace"
      >
        {formatCompact(total)}
      </text>
    );
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 340, color: "#94a3b8", fontSize: 12 }}>
        Đang tải dữ liệu so sánh dự báo Samsung...
      </div>
    );
  }

  if (runningPOData.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 340, color: "#94a3b8", fontSize: 12, gap: 6 }}>
        <span>Chưa có dữ liệu dự báo Samsung FCST</span>
        {infoWeeks.w2 > 0 && (
          <span style={{ fontSize: 11, color: "#cbd5e1" }}>
            Kỳ so sánh: Tuần W{infoWeeks.w1}/{infoWeeks.y1} vs Tuần W{infoWeeks.w2}/{infoWeeks.y2}
          </span>
        )}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart
          data={runningPOData}
          margin={{ top: 28, right: 25, left: 15, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="WEEKNO"
            height={30}
            tick={{ fontSize: 10, fill: "#64748b" }}
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
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ paddingBottom: 8, fontSize: 10.5 }}
          />
          {/* Cột Tuần 1 (Stack ss1) */}
          <Bar yAxisId="left-axis" dataKey="SEVT1" name={`SEVT (W${infoWeeks.w1})`} fill="#86efac" stackId="ss1" />
          <Bar yAxisId="left-axis" dataKey="SEV1" name={`SEV (W${infoWeeks.w1})`} fill="#f472b6" stackId="ss1" />
          <Bar yAxisId="left-axis" dataKey="SAMSUNG_ASIA1" name={`ASIA (W${infoWeeks.w1})`} fill="#93c5fd" stackId="ss1">
            <LabelList content={renderTotalLabelW1} />
          </Bar>

          {/* Cột Tuần 2 (Stack ss2) */}
          <Bar yAxisId="left-axis" dataKey="SEVT2" name={`SEVT (W${infoWeeks.w2})`} fill="#16a34a" stackId="ss2" />
          <Bar yAxisId="left-axis" dataKey="SEV2" name={`SEV (W${infoWeeks.w2})`} fill="#db2777" stackId="ss2" />
          <Bar yAxisId="left-axis" dataKey="SAMSUNG_ASIA2" name={`ASIA (W${infoWeeks.w2})`} fill="#2563eb" stackId="ss2">
            <LabelList content={renderTotalLabelW2} />
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(ChartFCSTSamSung);
