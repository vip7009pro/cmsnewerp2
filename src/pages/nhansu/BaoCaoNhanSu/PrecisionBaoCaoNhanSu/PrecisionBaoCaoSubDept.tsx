import React, { useMemo, useState } from "react";
import { DiemDanhNhomDataSummary } from "../../interfaces/nhansuInterface";
import AGTable from "../../../../components/DataTable/AGTable";
import { getColumnsSubDept } from "./PrecisionBaoCaoColumns";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { AiOutlineApartment, AiOutlinePieChart } from "react-icons/ai";

interface PrecisionBaoCaoSubDeptProps {
  data: Array<DiemDanhNhomDataSummary>;
  isLoading?: boolean;
}

const SUB_COLORS = [
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#8b5cf6",
  "#14b8a6",
  "#84cc16",
];

export const PrecisionBaoCaoSubDept: React.FC<PrecisionBaoCaoSubDeptProps> = ({
  data,
  isLoading,
}) => {
  const [keyword, setKeyword] = useState("");

  const columns = useMemo(() => getColumnsSubDept(), []);

  // Lọc dữ liệu theo từ khóa
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!keyword.trim()) return data;
    const lower = keyword.toLowerCase();
    return data.filter(
      (item) =>
        item.MAINDEPTNAME?.toLowerCase().includes(lower) ||
        item.SUBDEPTNAME?.toLowerCase().includes(lower)
    );
  }, [data, keyword]);

  // Chuẩn bị dữ liệu cho Pie Chart (loại bỏ GRAND_TOTAL)
  const pieData = useMemo(() => {
    if (!data) return [];
    return data
      .filter((item) => item.MAINDEPTNAME !== "GRAND_TOTAL" && item.TOTAL_ALL > 0)
      .map((item) => ({
        name: `${item.MAINDEPTNAME}_${item.SUBDEPTNAME}`,
        shortName: item.SUBDEPTNAME,
        value: item.TOTAL_ALL,
        onCount: item.TOTAL_ON,
      }));
  }, [data]);

  const totalHeadcount = useMemo(() => {
    return pieData.reduce((acc, cur) => acc + cur.value, 0);
  }, [pieData]);

  return (
    <div className="precision-baocao__dualGrid">
      {/* Cột 7: Bảng AGTable Nhân lực theo BP phụ */}
      <section className="precision-baocao__card">
        <div className="precision-baocao__cardHeader">
          <div className="precision-baocao__cardTitle">
            <AiOutlineApartment color="#2563eb" size={17} />
            <span>Nhân lực điểm danh trong ngày theo bộ phận phụ</span>
          </div>
          <span className="precision-baocao__cardMeta">
            {data.filter((d) => d.MAINDEPTNAME !== "GRAND_TOTAL").length} bộ phận chi tiết
          </span>
        </div>

        <div className="precision-baocao__gridContainer">
          <div className="precision-baocao__gridToolbar">
            <div className="precision-baocao__searchBox">
              <input
                type="text"
                placeholder="Lọc BP chính / BP phụ..."
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

      {/* Cột 5: Biểu đồ Pie Phân bổ chi tiết BP phụ */}
      <section className="precision-baocao__card">
        <div className="precision-baocao__cardHeader">
          <div className="precision-baocao__cardTitle">
            <AiOutlinePieChart color="#2563eb" size={17} />
            <span>Phân bổ chi tiết BP phụ</span>
          </div>
          <span className="precision-baocao__cardMeta">Phần trăm quy mô</span>
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
                  outerRadius={85}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SUB_COLORS[index % SUB_COLORS.length]}
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
                            Quân số: <strong>{val}</strong> người ({pct}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
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
                    backgroundColor: SUB_COLORS[idx % SUB_COLORS.length],
                    flexShrink: 0,
                  }}
                />
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.shortName}: <strong>{item.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrecisionBaoCaoSubDept;
