// PrecisionKHOLIEUKpi.tsx - Dải 4 thẻ KPI summary realtime cho Kho Liệu

import React, { useMemo } from "react";
import { FiPackage, FiTrendingUp, FiTruck, FiAlertTriangle } from "react-icons/fi";

interface PrecisionKHOLIEUKpiProps {
  data: Array<any>;
  mode: "NHAP" | "XUAT" | "TON";
}

const PrecisionKHOLIEUKpi: React.FC<PrecisionKHOLIEUKpiProps> = ({ data, mode }) => {
  const metrics = useMemo(() => {
    let totalRolls = 0;
    let totalQty = 0;
    const lotNccSet = new Set<string>();
    let alertCount = 0;

    const now = new Date().getTime();
    const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;

    data.forEach((row) => {
      if (mode === "XUAT") {
        totalRolls += Number(row.ROLL_QTY || 0);
        totalQty += Number(row.TOTAL_OUT_QTY || row.OUT_CFM_QTY || 0);
        if (row.LOTNCC) lotNccSet.add(row.LOTNCC);
      } else if (mode === "NHAP") {
        totalRolls += Number(row.ROLL_QTY || 0);
        totalQty += Number(row.TOTAL_IN_QTY || row.IN_CFM_QTY || 0);
        if (row.LOTNCC) lotNccSet.add(row.LOTNCC);

        if (row.USE_YN === "X") {
          alertCount++;
        } else if (row.EXP_DATE) {
          const expTime = new Date(row.EXP_DATE).getTime();
          if (!isNaN(expTime) && expTime - now < fifteenDaysMs) {
            alertCount++;
          }
        }
      } else if (mode === "TON") {
        totalRolls += Number(row.TOTAL_OK || 0);
        totalQty += Number((row.TON_NM1 || 0) + (row.TON_NM2 || 0));
        if (row.M_CODE) lotNccSet.add(row.M_CODE);
        if (Number(row.TOTAL_HOLDING || 0) > 0 || Number(row.HOLDING_NM1 || 0) > 0 || Number(row.HOLDING_NM2 || 0) > 0) {
          alertCount++;
        }
      }
    });

    return {
      totalRolls,
      totalQty,
      lotNccCount: lotNccSet.size,
      alertCount,
      totalRows: data.length,
    };
  }, [data, mode]);

  return (
    <div className="precision-kholieu__kpiBar" data-purpose="kpi-summary-bar">
      {/* KPI 1: TỔNG TỒN CUỘN LIỆU */}
      <div className="precision-kholieu__kpiCard">
        <div className="kpi-content">
          <div className="kpi-label">
            {mode === "XUAT" ? "TỔNG CUỘN XUẤT" : mode === "NHAP" ? "TỔNG CUỘN NHẬP" : "TỔNG CUỘN / MÃ OK"}
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">
              {metrics.totalRolls > 0 ? metrics.totalRolls.toLocaleString("en-US") : metrics.totalRows.toLocaleString("en-US")}
            </span>
            <span className="kpi-unit">{mode === "TON" ? "mã" : "cuộn"}</span>
          </div>
          <div className="kpi-subtext">
            <span className="dot-online">●</span> Đang nạp {metrics.totalRows.toLocaleString("en-US")} dòng dữ liệu
          </div>
        </div>
        <div className="kpi-icon-box kpi-icon-box--blue">
          <FiPackage />
        </div>
      </div>

      {/* KPI 2: TỔNG SẢN LƯỢNG QUY ĐỔI / OUTPUT QTY */}
      <div className="precision-kholieu__kpiCard">
        <div className="kpi-content">
          <div className="kpi-label">
            {mode === "XUAT" ? "TỔNG SỐ LƯỢNG XUẤT" : mode === "NHAP" ? "TỔNG SỐ LƯỢNG NHẬP" : "TỔNG SẢN LƯỢNG TỒN"}
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{metrics.totalQty.toLocaleString("en-US")}</span>
            <span className="kpi-unit">EA / Mét</span>
          </div>
          <div className="kpi-subtext">Quy đổi sản xuất khả dụng</div>
        </div>
        <div className="kpi-icon-box kpi-icon-box--emerald">
          <FiTrendingUp />
        </div>
      </div>

      {/* KPI 3: TỔNG LÔ NHÀ CUNG CẤP */}
      <div className="precision-kholieu__kpiCard">
        <div className="kpi-content">
          <div className="kpi-label">
            {mode === "TON" ? "TỔNG MÃ LIỆU" : "TỔNG LÔ NHÀ CUNG CẤP"}
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{metrics.lotNccCount.toLocaleString("en-US")}</span>
            <span className="kpi-unit">{mode === "TON" ? "mã" : "Lô NCC"}</span>
          </div>
          <div className="kpi-subtext">Nhà cung cấp phân bổ độc lập</div>
        </div>
        <div className="kpi-icon-box kpi-icon-box--indigo">
          <FiTruck />
        </div>
      </div>

      {/* KPI 4: CẢNH BÁO HẠN DÙNG (FIFO) / HOLDING */}
      <div className={`precision-kholieu__kpiCard ${metrics.alertCount > 0 ? "precision-kholieu__kpiCard--warning" : ""}`}>
        <div className="kpi-content">
          <div className="kpi-label">
            {mode === "TON" ? "CẢNH BÁO HOLDING" : "CẢNH BÁO FIFO / KHÓA"}
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: metrics.alertCount > 0 ? "#e11d48" : "#0f172a" }}>
              {metrics.alertCount.toLocaleString("en-US")}
            </span>
            <span className="kpi-unit">{mode === "TON" ? "mục" : "cuộn"}</span>
          </div>
          <div className="kpi-subtext">
            {metrics.alertCount > 0 ? "Cận hạn hoặc Đang holding" : "Trạng thái vật liệu ổn định"}
          </div>
        </div>
        <div className="kpi-icon-box kpi-icon-box--rose">
          <FiAlertTriangle />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKHOLIEUKpi);
