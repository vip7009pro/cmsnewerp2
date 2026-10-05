import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { FiDownload, FiClock, FiActivity } from "react-icons/fi";
import { SaveExcel } from "../../../../../api/services/excelService";
import AGTable from "../../../../../components/DataTable/AGTable";
import { SX_CAPA_DATA } from "../../interfaces/khsxInterface";

interface LeadTimeChartsProps {
  capadata: SX_CAPA_DATA[];
  showOnlyMatrix?: boolean;
  showOnlyChart?: boolean;
}

const CustomLeadTimeTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "6px",
          padding: "8px 12px",
          fontSize: "11px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.06)",
        }}
      >
        <p style={{ fontWeight: 800, marginBottom: 4, color: "#0f172a" }}>
          Dòng Máy: {label}
        </p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, margin: "2px 0" }}>
            {p.name}:{" "}
            <strong>
              {Number(p.value).toLocaleString("en-US", {
                maximumFractionDigits: 1,
              })}{" "}
              ngày
            </strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const PrecisionCapaSx2LeadTimeCharts: React.FC<LeadTimeChartsProps> = ({
  capadata,
  showOnlyMatrix = false,
  showOnlyChart = false,
}) => {
  // 1. Dữ liệu biểu đồ Lead Time
  const leadTimeChartData = useMemo(() => {
    return capadata
      .filter((e) => e.EQ_SERIES !== "TOTAL")
      .map((row) => ({
        name: row.EQ_SERIES,
        "Lead Time Thực Tế (ATT WF)": row.ATT_WF_LEADTIME_DAYS || 0,
        "Lead Time Đăng Ký (RETAIN WF)": row.RETAIN_WF_LEADTIME_DAYS || 0,
        "YCSX Balance": row.YCSX_BALANCE || 0,
      }));
  }, [capadata]);

  // 2. Định nghĩa các cột AGTable bảo toàn 100% logic từ CAPASX2.backup.tsx
  const capacolumns = useMemo(
    () => [
      {
        field: "EQ_SERIES",
        headerName: "EQ SERIES",
        width: 100,
        cellRenderer: (params: any) => {
          const isTotal = params.data.EQ_SERIES === "TOTAL";
          return (
            <span
              style={{
                fontWeight: isTotal ? 800 : 700,
                color: isTotal ? "#dc2626" : "#0f172a",
              }}
            >
              {params.value}
            </span>
          );
        },
      },
      { field: "EQ_QTY", headerName: "EQ QTY", width: 80 },
      { field: "EQ_OP", headerName: "EQ OP", width: 80 },
      { field: "AVG_EQ_OP", headerName: "AVG OP", width: 85 },
      {
        field: "MAN_FULL_CAPA",
        headerName: "MAN FULL CAPA",
        width: 125,
        cellRenderer: (params: any) => (
          <span style={{ color: "#2563eb", fontWeight: 600 }}>
            {params.data.MAN_FULL_CAPA?.toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "RETAIN_WF_CAPA",
        headerName: "RETAIN WF CAPA",
        width: 130,
        cellRenderer: (params: any) => (
          <span style={{ color: "#16a34a", fontWeight: 600 }}>
            {params.data.RETAIN_WF_CAPA?.toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "ATT_WF_CAPA",
        headerName: "ATT WF CAPA",
        width: 120,
        cellRenderer: (params: any) => (
          <span style={{ color: "#dc2626", fontWeight: 600 }}>
            {params.data.ATT_WF_CAPA?.toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "RETAIN_WF_TO_EQ_CAPA",
        headerName: "RETAIN WF TO EQ",
        width: 140,
        cellRenderer: (params: any) => (
          <span style={{ color: "#475569" }}>
            {params.data.RETAIN_WF_TO_EQ_CAPA?.toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "ATT_WF_TO_EQ_CAPA",
        headerName: "ATT WF TO EQ",
        width: 135,
        cellRenderer: (params: any) => (
          <span style={{ color: "#475569" }}>
            {params.data.ATT_WF_TO_EQ_CAPA?.toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "RETAIN_WF_MIN_CAPA",
        headerName: "RETAIN MIN CAPA",
        width: 135,
        cellRenderer: (params: any) => (
          <span style={{ color: "#475569" }}>
            {params.data.RETAIN_WF_MIN_CAPA?.toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "ATT_WF_MIN_CAPA",
        headerName: "ATT MIN CAPA",
        width: 130,
        cellRenderer: (params: any) => (
          <span style={{ color: "#475569" }}>
            {params.data.ATT_WF_MIN_CAPA?.toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "YCSX_BALANCE",
        headerName: "YCSX BALANCE",
        width: 125,
        cellRenderer: (params: any) => (
          <span style={{ color: "#2563eb", fontWeight: 700 }}>
            {params.data.YCSX_BALANCE?.toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "RETAIN_WF_LEADTIME_DAYS",
        headerName: "RETAIN LEADTIME",
        width: 145,
        cellRenderer: (params: any) => (
          <span
            style={{
              color: "#16a34a",
              fontWeight: 800,
              backgroundColor: "#f0fdf4",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            {Number(params.data.RETAIN_WF_LEADTIME_DAYS).toLocaleString("en-US", {
              maximumFractionDigits: 1,
            })}{" "}
            ngày
          </span>
        ),
      },
      {
        field: "ATT_WF_LEADTIME_DAYS",
        headerName: "REAL LEADTIME",
        width: 140,
        cellRenderer: (params: any) => (
          <span
            style={{
              color: "#dc2626",
              fontWeight: 800,
              backgroundColor: "#fef2f2",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            {Number(params.data.ATT_WF_LEADTIME_DAYS).toLocaleString("en-US", {
              maximumFractionDigits: 1,
            })}{" "}
            ngày
          </span>
        ),
      },
    ],
    []
  );

  const handleExportLeadtime = () => {
    SaveExcel(leadTimeChartData, "CAPASX2_LeadTime_By_Equipment");
  };

  const handleExportMatrix = () => {
    SaveExcel(capadata, "CAPASX2_Full_Capacity_Matrix");
  };

  return (
    <div className="precision-capa-section">
      <div className="precision-capa-section__header">
        <div className="section-badge-title">
          <span className="icon-circle">
            <FiClock />
          </span>
          <span>Phân Hệ 2: Cân Đối Năng Lực & Lead Time Sản Xuất</span>
        </div>
      </div>

      {/* 1. Biểu đồ Production Lead Time */}
      {!showOnlyMatrix && (
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiClock size={13} color="#dc2626" />
              <span className="executive-card__title">
                Biểu Đồ Production Lead Time Từng Dòng Thiết Bị (PO Balance Standard)
              </span>
            </div>
            <div className="executive-card__actions">
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={handleExportLeadtime}
                title="Xuất Excel biểu đồ lead time"
              >
                <FiDownload size={11} />
                <span>Excel LeadTime</span>
              </button>
            </div>
          </div>
          <div className="executive-card__body" style={{ minHeight: 280 }}>
            {leadTimeChartData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height={Math.max(260, leadTimeChartData.length * 52 + 50)}
              >
                <BarChart
                  data={leadTimeChartData}
                  layout="vertical"
                  margin={{ top: 12, right: 40, bottom: 10, left: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `${Number(v).toFixed(1)}d`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#0f172a"
                    fontSize={12}
                    fontWeight={700}
                    tickLine={false}
                    width={42}
                  />
                  <Tooltip content={<CustomLeadTimeTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                  <Bar
                    dataKey="Lead Time Thực Tế (ATT WF)"
                    fill="#ef4444"
                    radius={[0, 3, 3, 0]}
                    maxBarSize={18}
                  >
                    <LabelList
                      dataKey="Lead Time Thực Tế (ATT WF)"
                      position="right"
                      formatter={(v: any) => `${Number(v || 0).toFixed(1)}d`}
                      style={{ fontSize: "10.5px", fontWeight: 700, fill: "#ef4444" }}
                    />
                  </Bar>
                  <Bar
                    dataKey="Lead Time Đăng Ký (RETAIN WF)"
                    fill="#10b981"
                    radius={[0, 3, 3, 0]}
                    maxBarSize={18}
                  >
                    <LabelList
                      dataKey="Lead Time Đăng Ký (RETAIN WF)"
                      position="right"
                      formatter={(v: any) => `${Number(v || 0).toFixed(1)}d`}
                      style={{ fontSize: "10.5px", fontWeight: 700, fill: "#10b981" }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "12px", padding: "40px" }}>
                Không có dữ liệu Lead Time
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Bảng Ma Trận Cân Đối Năng Lực Chi Tiết (AGTable) */}
      {!showOnlyChart && (
        <div className="executive-card" style={{ marginTop: "4px" }}>
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiActivity size={13} color="#0284c7" />
              <span className="executive-card__title">
                Bảng Ma Trận Cân Đối Năng Lực Sản Xuất Chi Tiết (Full Capa Matrix Table)
              </span>
            </div>
            <div className="executive-card__actions">
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={handleExportMatrix}
                title="Xuất Excel toàn bộ bảng ma trận năng lực"
              >
                <FiDownload size={11} />
                <span>Excel Ma Trận</span>
              </button>
            </div>
          </div>
          <div
            className="executive-card__body"
            style={{ padding: "4px", minHeight: "360px", overflowX: "auto" }}
          >
            <div style={{ height: "420px", width: "100%" }}>
              <AGTable
                showFilter={true}
                toolbar={<div />}
                columns={capacolumns}
                data={capadata}
                onCellEditingStopped={() => {}}
                onRowClick={() => {}}
                onSelectionChange={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PrecisionCapaSx2LeadTimeCharts);
