// PrecisionKHOLIEUMobileKpi.tsx - Dải Micro-KPI cuộn ngang cho Mobile Kho Liệu

import React, { useMemo } from "react";
import { FiPackage, FiTrendingUp, FiTruck, FiAlertTriangle } from "react-icons/fi";

interface PrecisionKHOLIEUMobileKpiProps {
  data: Array<any>;
  mode: "NHAP" | "XUAT" | "TON";
}

const PrecisionKHOLIEUMobileKpi: React.FC<PrecisionKHOLIEUMobileKpiProps> = ({ data, mode }) => {
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
        if (
          Number(row.TOTAL_HOLDING || 0) > 0 ||
          Number(row.HOLDING_NM1 || 0) > 0 ||
          Number(row.HOLDING_NM2 || 0) > 0
        ) {
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
    <div className="precision-kholieu__mobileKpi" data-purpose="mobile-kpi-bar">
      <div className="mobile-kpi-scroll">
        {/* Card 1: Tổng Cuộn / Mã */}
        <div className="mobile-kpi-pill mobile-kpi-pill--blue">
          <div className="kpi-icon">
            <FiPackage size={13} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">
              {mode === "XUAT" ? "Cuộn Xuất" : mode === "NHAP" ? "Cuộn Nhập" : "Tổng Mã OK"}
            </span>
            <div className="kpi-value-row">
              <span className="kpi-value">
                {metrics.totalRolls > 0
                  ? metrics.totalRolls.toLocaleString("en-US")
                  : metrics.totalRows.toLocaleString("en-US")}
              </span>
              <span className="kpi-sub">({metrics.totalRows.toLocaleString("en-US")} dòng)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Tổng Sản Lượng Quy Đổi */}
        <div className="mobile-kpi-pill mobile-kpi-pill--emerald">
          <div className="kpi-icon">
            <FiTrendingUp size={13} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">
              {mode === "XUAT" ? "SL Xuất" : mode === "NHAP" ? "SL Nhập" : "SL Tồn Kho"}
            </span>
            <div className="kpi-value-row">
              <span className="kpi-value">{metrics.totalQty.toLocaleString("en-US")}</span>
              <span className="kpi-sub">EA/Mét</span>
            </div>
          </div>
        </div>

        {/* Card 3: Lô NCC / Mã Liệu */}
        <div className="mobile-kpi-pill mobile-kpi-pill--purple">
          <div className="kpi-icon">
            <FiTruck size={13} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">
              {mode === "TON" ? "Mã Liệu" : "Lô Vendor NCC"}
            </span>
            <div className="kpi-value-row">
              <span className="kpi-value">{metrics.lotNccCount.toLocaleString("en-US")}</span>
              <span className="kpi-sub">{mode === "TON" ? "mã" : "lô"}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Cảnh Báo FIFO / Khóa / Holding */}
        <div
          className={`mobile-kpi-pill ${
            metrics.alertCount > 0 ? "mobile-kpi-pill--rose" : "mobile-kpi-pill--slate"
          }`}
        >
          <div className="kpi-icon">
            <FiAlertTriangle size={13} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">
              {mode === "TON" ? "Holding" : "Cảnh Báo HSD"}
            </span>
            <div className="kpi-value-row">
              <span
                className="kpi-value"
                style={{ color: metrics.alertCount > 0 ? "#e11d48" : "#0f172a" }}
              >
                {metrics.alertCount.toLocaleString("en-US")}
              </span>
              <span className="kpi-sub">{metrics.alertCount > 0 ? "cảnh báo" : "bình thường"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKHOLIEUMobileKpi);
