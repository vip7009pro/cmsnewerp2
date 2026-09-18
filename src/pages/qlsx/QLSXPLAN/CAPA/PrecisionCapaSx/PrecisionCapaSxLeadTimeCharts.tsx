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
  LabelList,
} from "recharts";
import { FiDownload, FiClock } from "react-icons/fi";
import { SaveExcel } from "../../../../../api/services/excelService";
import {
  MACHINE_COUNTING,
  YCSX_BALANCE_CAPA_DATA,
} from "../../interfaces/khsxInterface";

interface LeadTimeChartsProps {
  ycsxbalance: YCSX_BALANCE_CAPA_DATA[];
  machinecount: MACHINE_COUNTING[];
  FR_EMPL: { TNM1: number; TNM2: number; NM1: number; NM2: number };
  SR_EMPL: { TNM1: number; TNM2: number; NM1: number; NM2: number };
  DC_EMPL: { TNM1: number; TNM2: number; NM1: number; NM2: number };
  ED_EMPL: { TNM1: number; TNM2: number; NM1: number; NM2: number };
  dailytime: number;
}

const LeadTimeTooltip = ({ active, payload, label }: any) => {
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
          <p key={i} style={{ color: p.color, margin: "2px 0" }}>
            {p.name}:{" "}
            <strong>
              {p.value?.toLocaleString("en-US", { maximumFractionDigits: 1 })}{" "}
              ngày
            </strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PrecisionCapaSxLeadTimeCharts: React.FC<LeadTimeChartsProps> = ({
  ycsxbalance,
  machinecount,
  FR_EMPL,
  SR_EMPL,
  DC_EMPL,
  ED_EMPL,
  dailytime,
}) => {
  // Tính toán lead time tổng cho tất cả 4 cụm máy
  const leadTimeData = useMemo(() => {
    const getBalance = (eq: string) =>
      ycsxbalance.find((b) => b.EQ_NAME === eq)?.YCSX_BALANCE || 0;
    const getQty = (eq: string) =>
      machinecount.find((m) => m.EQ_NAME === eq)?.EQ_QTY || 1;

    const frBalance = getBalance("FR");
    const srBalance = getBalance("SR");
    const dcBalance = getBalance("DC");
    const edBalance = getBalance("ED");

    const frAvlCapa = Math.min(((FR_EMPL.TNM1 + FR_EMPL.TNM2) / 4) * dailytime, getQty("FR") * dailytime);
    const frRealCapa = Math.min(((FR_EMPL.NM1 + FR_EMPL.NM2) / 4) * dailytime, getQty("FR") * dailytime);

    const srAvlCapa = Math.min(((SR_EMPL.TNM1 + SR_EMPL.TNM2) / 4) * dailytime, getQty("SR") * dailytime);
    const srRealCapa = Math.min(((SR_EMPL.NM1 + SR_EMPL.NM2) / 4) * dailytime, getQty("SR") * dailytime);

    const dcAvlCapa = Math.min(((DC_EMPL.TNM1 + DC_EMPL.TNM2) / 2) * dailytime, getQty("DC") * dailytime);
    const dcRealCapa = Math.min(((DC_EMPL.NM1 + DC_EMPL.NM2) / 2) * dailytime, getQty("DC") * dailytime);

    const edAvlCapa = Math.min(((ED_EMPL.TNM1 + ED_EMPL.TNM2 / 2) / 2) * dailytime, getQty("ED") * dailytime);
    const edRealCapa = Math.min(((ED_EMPL.NM1 + ED_EMPL.NM2 / 2) / 2) * dailytime, getQty("ED") * dailytime);

    return [
      {
        name: "FR",
        "Retain Lead Time (ngày)": frAvlCapa > 0 ? frBalance / frAvlCapa : 0,
        "Realtime Lead Time (ngày)": frRealCapa > 0 ? frBalance / frRealCapa : 0,
        "Balance (phút)": frBalance,
      },
      {
        name: "SR",
        "Retain Lead Time (ngày)": srAvlCapa > 0 ? srBalance / srAvlCapa : 0,
        "Realtime Lead Time (ngày)": srRealCapa > 0 ? srBalance / srRealCapa : 0,
        "Balance (phút)": srBalance,
      },
      {
        name: "DC",
        "Retain Lead Time (ngày)": dcAvlCapa > 0 ? dcBalance / dcAvlCapa : 0,
        "Realtime Lead Time (ngày)": dcRealCapa > 0 ? dcBalance / dcRealCapa : 0,
        "Balance (phút)": dcBalance,
      },
      {
        name: "ED",
        "Retain Lead Time (ngày)": edAvlCapa > 0 ? edBalance / edAvlCapa : 0,
        "Realtime Lead Time (ngày)": edRealCapa > 0 ? edBalance / edRealCapa : 0,
        "Balance (phút)": edBalance,
      },
    ];
  }, [ycsxbalance, machinecount, FR_EMPL, SR_EMPL, DC_EMPL, ED_EMPL, dailytime]);

  // Dữ liệu bảng năng lực chi tiết
  const capacityMatrixData = useMemo(() => {
    const getQty = (eq: string) =>
      machinecount.find((m) => m.EQ_NAME === eq)?.EQ_QTY || 0;
    const getBalance = (eq: string) =>
      ycsxbalance.find((b) => b.EQ_NAME === eq)?.YCSX_BALANCE || 0;

    const EQ_MAP: Record<string, { empl: { TNM1: number; TNM2: number; NM1: number; NM2: number }; div: number }> = {
      FR: { empl: FR_EMPL, div: 4 },
      SR: { empl: SR_EMPL, div: 4 },
      DC: { empl: DC_EMPL, div: 2 },
      ED: { empl: ED_EMPL, div: 2 },
    };

    return ["FR", "SR", "DC", "ED"].map((eq) => {
      const { empl, div } = EQ_MAP[eq];
      const eqQty = getQty(eq);
      const balance = getBalance(eq);
      const avlCapa = Math.min(((empl.TNM1 + empl.TNM2) / div) * dailytime, eqQty * dailytime);
      const realCapa = Math.min(((empl.NM1 + empl.NM2) / div) * dailytime, eqQty * dailytime);
      const maxCapa = eqQty * dailytime;
      return {
        EQ: eq,
        EQ_QTY: eqQty,
        DAILY_TIME: dailytime,
        MAX_CAPA: maxCapa,
        AVL_WF: empl.TNM1 + empl.TNM2,
        REAL_WF: empl.NM1 + empl.NM2,
        AVL_CAPA: avlCapa,
        REAL_CAPA: realCapa,
        YCSX_BALANCE: balance,
        AVL_LEADTIME: avlCapa > 0 ? balance / avlCapa : 0,
        REL_LEADTIME: realCapa > 0 ? balance / realCapa : 0,
      };
    });
  }, [machinecount, ycsxbalance, FR_EMPL, SR_EMPL, DC_EMPL, ED_EMPL, dailytime]);

  const handleExportLeadTime = () => {
    SaveExcel(leadTimeData, "CapaSx_LeadTime");
  };

  const handleExportCapaMatrix = () => {
    SaveExcel(capacityMatrixData, "CapaSx_CapacityMatrix");
  };

  const tagClass = (eq: string) => {
    const map: Record<string, string> = { FR: "machine-tag--fr", SR: "machine-tag--sr", DC: "machine-tag--dc", ED: "machine-tag--ed" };
    return map[eq] || "";
  };

  return (
    <div className="precision-capa-section">
      <div className="precision-capa-section__header">
        <div className="section-badge-title">
          <span className="icon-circle">
            <FiClock />
          </span>
          <span>Cân Đối Năng Lực & Lead Time Sản Xuất</span>
        </div>
      </div>

      <div className="two-col-grid">
        {/* Biểu đồ Lead Time */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiClock size={13} color="#f59e0b" />
              <span className="executive-card__title">
                So Sánh Lead Time Thực Tế vs Khả Dụng (Ngày)
              </span>
            </div>
            <div className="executive-card__actions">
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={handleExportLeadTime}
                title="Xuất Excel lead time"
              >
                <FiDownload size={11} />
                <span>Excel</span>
              </button>
            </div>
          </div>
          <div className="executive-card__body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={leadTimeData}
                layout="vertical"
                margin={{ top: 10, right: 40, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  tickFormatter={(v) => `${v.toFixed(1)}d`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, fontWeight: 700, fill: "#0f172a" }}
                  width={32}
                />
                <Tooltip content={<LeadTimeTooltip />} />
                <Legend wrapperStyle={{ fontSize: "10.5px", paddingTop: "8px" }} />
                <Bar dataKey="Retain Lead Time (ngày)" fill="#0284c7" radius={[0, 3, 3, 0]}>
                  <LabelList
                    dataKey="Retain Lead Time (ngày)"
                    position="right"
                    formatter={(v: number) => `${v?.toFixed(1)}d`}
                    style={{ fontSize: "10px", fontWeight: 700, fill: "#0284c7" }}
                  />
                </Bar>
                <Bar dataKey="Realtime Lead Time (ngày)" fill="#dc2626" radius={[0, 3, 3, 0]}>
                  <LabelList
                    dataKey="Realtime Lead Time (ngày)"
                    position="right"
                    formatter={(v: number) => `${v?.toFixed(1)}d`}
                    style={{ fontSize: "10px", fontWeight: 700, fill: "#dc2626" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bảng Ma Trận Năng Lực Chi Tiết */}
        <div className="executive-card">
          <div className="executive-card__header">
            <div className="executive-card__title-wrap">
              <FiClock size={13} color="#0284c7" />
              <span className="executive-card__title">
                Bảng Ma Trận Cân Đối Năng Lực Chi Tiết
              </span>
            </div>
            <div className="executive-card__actions">
              <button
                type="button"
                className="executive-card__btn-excel"
                onClick={handleExportCapaMatrix}
                title="Xuất Excel bảng năng lực"
              >
                <FiDownload size={11} />
                <span>Excel</span>
              </button>
            </div>
          </div>
          <div className="executive-card__body" style={{ padding: "4px 0", overflowX: "auto" }}>
            <table className="capa-matrix-table">
              <thead>
                <tr>
                  <th>Cụm Máy</th>
                  <th>Số Máy</th>
                  <th>T.Gian/Ngày (phút)</th>
                  <th>WF Đăng Ký</th>
                  <th>WF Có Mặt</th>
                  <th>Năng Lực AVL (phút)</th>
                  <th>Năng Lực REL (phút)</th>
                  <th>YCSX Balance (phút)</th>
                  <th>AVL Lead Time (ngày)</th>
                  <th>REL Lead Time (ngày)</th>
                </tr>
              </thead>
              <tbody>
                {capacityMatrixData.map((row) => {
                  const avlLtAlert = row.AVL_LEADTIME > 5;
                  const relLtAlert = row.REL_LEADTIME > 5;
                  return (
                    <tr key={row.EQ}>
                      <td>
                        <span className={`machine-tag ${tagClass(row.EQ)}`}>{row.EQ}</span>
                      </td>
                      <td><span className="num-val">{row.EQ_QTY}</span></td>
                      <td><span className="num-val">{row.DAILY_TIME.toLocaleString("en-US")}</span></td>
                      <td><span className="num-val">{row.AVL_WF}</span></td>
                      <td><span className="num-val">{row.REAL_WF}</span></td>
                      <td><span className="num-val">{row.AVL_CAPA.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span></td>
                      <td><span className="num-val">{row.REAL_CAPA.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span></td>
                      <td><span className="num-val">{row.YCSX_BALANCE.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span></td>
                      <td>
                        <span className={avlLtAlert ? "leadtime-alert" : "leadtime-safe"}>
                          {row.AVL_LEADTIME.toFixed(1)} d
                        </span>
                      </td>
                      <td>
                        <span className={relLtAlert ? "leadtime-alert" : "leadtime-safe"}>
                          {row.REL_LEADTIME.toFixed(1)} d
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PrecisionCapaSxLeadTimeCharts };
export default React.memo(PrecisionCapaSxLeadTimeCharts);
