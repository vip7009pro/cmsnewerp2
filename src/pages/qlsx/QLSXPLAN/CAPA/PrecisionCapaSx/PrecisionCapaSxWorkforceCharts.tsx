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
  Cell,
} from "recharts";
import { FiDownload, FiUsers, FiCpu } from "react-icons/fi";
import { SaveExcel } from "../../../../../api/services/excelService";
import {
  DATA_DIEM_DANH,
  EQ_STT,
  MACHINE_COUNTING,
} from "../../interfaces/khsxInterface";

interface WorkforceChartsProps {
  datadiemdanh: DATA_DIEM_DANH[];
  eq_status: EQ_STT[];
  machinecount: MACHINE_COUNTING[];
  FR_EMPL: { TNM1: number; TNM2: number; NM1: number; NM2: number };
  SR_EMPL: { TNM1: number; TNM2: number; NM1: number; NM2: number };
  DC_EMPL: { TNM1: number; TNM2: number; NM1: number; NM2: number };
  ED_EMPL: { TNM1: number; TNM2: number; NM1: number; NM2: number };
}

const CHART_COLORS = {
  required: "#8b5cf6",
  retain: "#0284c7",
  realtime: "#10b981",
  running: "#10b981",
  idle: "#e2e8f0",
  setting: "#f59e0b",
};

const CustomTooltip = ({ active, payload, label }: any) => {
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
          {label}
        </p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, margin: "1px 0" }}>
            {p.name}: <strong>{p.value?.toLocaleString("en-US")} người</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MachineTooltip = ({ active, payload, label }: any) => {
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
          Máy {label}
        </p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, margin: "1px 0" }}>
            {p.name}: <strong>{p.value?.toLocaleString("en-US")} máy</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PrecisionCapaSxWorkforceCharts: React.FC<WorkforceChartsProps> = ({
  datadiemdanh,
  eq_status,
  machinecount,
  FR_EMPL,
  SR_EMPL,
  DC_EMPL,
  ED_EMPL,
}) => {
  // Dữ liệu biểu đồ nhân lực theo từng cụm máy
  const workforceData = useMemo(() => [
    {
      name: "FR (Dập)",
      "Cần Đủ Capa": (machinecount.find((m) => m.EQ_NAME === "FR")?.EQ_QTY || 0) * 2 * 2,
      "Đăng Ký (Retain)": FR_EMPL.TNM1 + FR_EMPL.TNM2,
      "Có Mặt (Realtime)": FR_EMPL.NM1 + FR_EMPL.NM2,
    },
    {
      name: "SR (Ghép)",
      "Cần Đủ Capa": (machinecount.find((m) => m.EQ_NAME === "SR")?.EQ_QTY || 0) * 2 * 2,
      "Đăng Ký (Retain)": SR_EMPL.TNM1 + SR_EMPL.TNM2,
      "Có Mặt (Realtime)": SR_EMPL.NM1 + SR_EMPL.NM2,
    },
    {
      name: "DC (Cắt)",
      "Cần Đủ Capa": (machinecount.find((m) => m.EQ_NAME === "DC")?.EQ_QTY || 0) * 2 * 1,
      "Đăng Ký (Retain)": DC_EMPL.TNM1 + DC_EMPL.TNM2,
      "Có Mặt (Realtime)": DC_EMPL.NM1 + DC_EMPL.NM2,
    },
    {
      name: "ED (Bế)",
      "Cần Đủ Capa": (machinecount.find((m) => m.EQ_NAME === "ED")?.EQ_QTY || 0) * 2 * 1,
      "Đăng Ký (Retain)": ED_EMPL.TNM1 + ED_EMPL.TNM2,
      "Có Mặt (Realtime)": ED_EMPL.NM1 + ED_EMPL.NM2,
    },
  ], [machinecount, FR_EMPL, SR_EMPL, DC_EMPL, ED_EMPL]);

  // Dữ liệu biểu đồ trạng thái máy
  const machineStatusData = useMemo(() => {
    const eqNames = ["FR", "SR", "DC", "ED"];
    return eqNames.map((eqPrefix) => {
      const total = machinecount.find((m) => m.EQ_NAME === eqPrefix)?.EQ_QTY || 0;
      const running = eq_status.filter(
        (e) =>
          e?.EQ_NAME?.substring(0, 2) === eqPrefix &&
          (e.EQ_STATUS === "MASS" || e.EQ_STATUS === "SETTING")
      ).length;
      const setting = eq_status.filter(
        (e) =>
          e?.EQ_NAME?.substring(0, 2) === eqPrefix &&
          e.EQ_STATUS === "SETTING"
      ).length;
      const idle = total - running;
      return {
        name: eqPrefix,
        "Đang Chạy (MASS)": running - setting,
        "Cài Đặt (SETTING)": setting,
        "Dừng / Chờ": idle > 0 ? idle : 0,
        total,
      };
    });
  }, [machinecount, eq_status]);

  const handleExportWorkforce = () => {
    SaveExcel(workforceData, "CapaSx_WorkforceStatus");
  };

  const handleExportMachineStatus = () => {
    SaveExcel(machineStatusData, "CapaSx_MachineStatus");
  };

  return (
    <div className="precision-capa-section">
      <div className="precision-capa-section__header">
        <div className="section-badge-title">
          <span className="icon-circle">
            <FiUsers />
          </span>
          <span>Phân Tích Nhân Lực & Trạng Thái Thiết Bị</span>
        </div>
      </div>

      <div className="two-col-grid">
        {/* Biểu đồ nhân lực */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiUsers size={13} color="#0284c7" />
              <span className="executive-card__title">
                Nhân Lực Theo Cụm Máy (Cần / Đăng Ký / Có Mặt)
              </span>
            </div>
            <div className="executive-card__actions">
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={handleExportWorkforce}
                title="Xuất Excel nhân lực"
              >
                <FiDownload size={11} />
                <span>Excel</span>
              </button>
            </div>
          </div>
          <div className="executive-card__body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={workforceData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#475569" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "10.5px", paddingTop: "8px" }}
                />
                <Bar dataKey="Cần Đủ Capa" fill={CHART_COLORS.required} radius={[2, 2, 0, 0]} />
                <Bar dataKey="Đăng Ký (Retain)" fill={CHART_COLORS.retain} radius={[2, 2, 0, 0]} />
                <Bar dataKey="Có Mặt (Realtime)" fill={CHART_COLORS.realtime} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ trạng thái máy */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiCpu size={13} color="#9333ea" />
              <span className="executive-card__title">
                Trạng Thái Máy Theo Dòng (Đang Chạy / Cài Đặt / Dừng)
              </span>
            </div>
            <div className="executive-card__actions">
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={handleExportMachineStatus}
                title="Xuất Excel trạng thái máy"
              >
                <FiDownload size={11} />
                <span>Excel</span>
              </button>
            </div>
          </div>
          <div className="executive-card__body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={machineStatusData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#475569" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} allowDecimals={false} />
                <Tooltip content={<MachineTooltip />} />
                <Legend wrapperStyle={{ fontSize: "10.5px", paddingTop: "8px" }} />
                <Bar dataKey="Đang Chạy (MASS)" fill="#10b981" radius={[2, 2, 0, 0]} stackId="status" />
                <Bar dataKey="Cài Đặt (SETTING)" fill="#f59e0b" radius={[0, 0, 0, 0]} stackId="status" />
                <Bar dataKey="Dừng / Chờ" fill="#e2e8f0" radius={[2, 2, 0, 0]} stackId="status" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PrecisionCapaSxWorkforceCharts };
export default React.memo(PrecisionCapaSxWorkforceCharts);
