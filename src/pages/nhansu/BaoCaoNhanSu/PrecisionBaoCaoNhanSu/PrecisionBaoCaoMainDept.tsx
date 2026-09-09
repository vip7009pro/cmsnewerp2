import React, { useMemo, useState } from "react";
import { DIEMDANHMAINDEPT } from "../../interfaces/nhansuInterface";
import AGTable from "../../../../components/DataTable/AGTable";
import { getColumnsMainDept } from "./PrecisionBaoCaoColumns";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { AiOutlineTeam, AiOutlinePieChart } from "react-icons/ai";

interface PrecisionBaoCaoMainDeptProps {
  data: Array<DIEMDANHMAINDEPT>;
  isLoading?: boolean;
}

const PIE_COLORS = [
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
  "#6366f1",
  "#f43f5e",
  "#84cc16",
  "#a855f7",
];

export const PrecisionBaoCaoMainDept: React.FC<PrecisionBaoCaoMainDeptProps> = ({
  data,
  isLoading,
}) => {
  const [keyword, setKeyword] = useState("");

  const columns = useMemo(() => getColumnsMainDept(), []);

  // Lọc dữ liệu theo keyword
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!keyword.trim()) return data;
    const lower = keyword.toLowerCase();
    return data.filter((item) =>
      item.MAINDEPTNAME?.toLowerCase().includes(lower)
    );
  }, [data, keyword]);

  // Chuẩn bị dữ liệu cho Donut Chart (loại bỏ dòng TOTAL)
  const pieData = useMemo(() => {
    if (!data) return [];
    return data
      .filter((item) => item.MAINDEPTNAME !== "TOTAL" && item.COUNT_TOTAL > 0)
      .map((item) => ({
        name: item.MAINDEPTNAME,
        value: item.COUNT_TOTAL,
        onCount: item.COUT_ON,
      }));
  }, [data]);

  const totalHeadcount = useMemo(() => {
    return pieData.reduce((acc, cur) => acc + cur.value, 0);
  }, [pieData]);

  return (
    <div className="precision-baocao__dualGrid">
      {/* Cột 7: Bảng AGTable Nhân lực theo BP chính */}
      <section className="precision-baocao__card">
        <div className="precision-baocao__cardHeader">
          <div className="precision-baocao__cardTitle">
            <AiOutlineTeam color="#2563eb" size={17} />
            <span>Nhân lực điểm danh trong ngày theo bộ phận chính</span>
          </div>
          <span className="precision-baocao__cardMeta">
            {data.filter((d) => d.MAINDEPTNAME !== "TOTAL").length} bộ phận
          </span>
        </div>

        <div className="precision-baocao__gridContainer">
          <div className="precision-baocao__gridToolbar">
            <div className="precision-baocao__searchBox">
              <input
                type="text"
                placeholder="Lọc bộ phận..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="precision-baocao__gridMeta">
              Hiển thị: <strong>{filteredData.length}</strong> dòng
            </div>
          </div>

          <div className="precision-baocao__gridBody" style={{ height: "300px" }}>
            <AGTable
              columns={columns}
              data={filteredData}
              rowHeight={30}
              headerHeight={28}
            />
          </div>
        </div>
      </section>

      {/* Cột 5: Biểu đồ Donut Tỷ trọng cơ cấu nhân sự */}
      <section className="precision-baocao__card">
        <div className="precision-baocao__cardHeader">
          <div className="precision-baocao__cardTitle">
            <AiOutlinePieChart color="#2563eb" size={17} />
            <span>Cơ cấu nhân sự theo BP chính</span>
          </div>
          <span className="precision-baocao__cardMeta">Tỷ trọng quy mô</span>
        </div>

        <div
          className="precision-baocao__cardBody"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
          }}
        >
          <div style={{ width: "100%", height: "220px", position: "relative" }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0];
                      const val = Number(item.value);
                      const pct = totalHeadcount > 0 ? ((val / totalHeadcount) * 100).toFixed(1) : "0";
                      return (
                        <div
                          style={{
                            background: "#ffffff",
                            padding: "6px 10px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            fontSize: "11px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                          }}
                        >
                          <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>
                            {item.name}
                          </p>
                          <p style={{ margin: "2px 0 0 0", color: "#2563eb" }}>
                            Tổng: <strong>{val}</strong> người ({pct}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                pointerEvents: "none",
              }}
            >
              <span style={{ fontSize: "18px", fontWeight: 900, color: "#0f172a", display: "block" }}>
                {totalHeadcount}
              </span>
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                Nhân sự
              </span>
            </div>
          </div>

          {/* Mini Legends */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "4px 8px",
              width: "100%",
              marginTop: "6px",
              fontSize: "10.5px",
              color: "#475569",
            }}
          >
            {pieData.slice(0, 9).map((item, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "2px",
                    backgroundColor: PIE_COLORS[idx % PIE_COLORS.length],
                    flexShrink: 0,
                  }}
                />
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.name}: <strong>{item.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrecisionBaoCaoMainDept;
