// PrecisionKHOTPKpi.tsx - Dải 4 thẻ KPI summary realtime cho Kho Thành Phẩm

import React, { useMemo } from "react";
import {
  FiPackage,
  FiClipboard,
  FiLayers,
  FiAlertTriangle,
  FiArrowUpRight,
} from "react-icons/fi";

interface PrecisionKHOTPKpiProps {
  data: Array<any>;
  mode: string;
}

const PrecisionKHOTPKpi: React.FC<PrecisionKHOTPKpiProps> = ({ data, mode }) => {
  // Tính toán các chỉ số realtime từ bảng dữ liệu
  const metrics = useMemo(() => {
    let totalQty = 0;
    const uniqueCodes = new Set<string>();
    let pendingCount = 0;

    data.forEach((row) => {
      // Tính QTY tùy theo mode
      if (mode === "GR" || mode === "GI") {
        totalQty += Number(row.IO_Qty || 0);
        if (row.IO_Status === "Pending") pendingCount++;
      } else if (mode === "GI_PACK") {
        totalQty += Number(row.Out_Qty || 0);
      } else if (mode === "STOCKG_CODE") {
        totalQty += Number(row.GRAND_TOTAL_STOCK || 0);
        if (Number(row.PENDINGXK || 0) > 0) pendingCount++;
      } else if (mode === "STOCKG_NAME_KD") {
        totalQty += Number(row.GRAND_TOTAL_STOCK || 0);
      } else if (mode === "STOCKG_TACH") {
        totalQty += Number(row.GRAND_TOTAL_TP || 0);
      }

      // Đếm mã duy nhất
      if (row.G_CODE) uniqueCodes.add(row.G_CODE);
      else if (row.G_NAME_KD) uniqueCodes.add(row.G_NAME_KD);
    });

    return {
      totalQty,
      totalRows: data.length,
      totalCodes: uniqueCodes.size,
      pendingCount,
    };
  }, [data, mode]);

  return (
    <div className="precision-khotp__kpiBar" data-purpose="kpi-summary-bar">
      {/* KPI Card 1: TOTAL QTY (Hero Emerald) */}
      <div className="precision-khotp__kpiCard precision-khotp__kpiCard--hero">
        <div className="kpi-left">
          <div className="kpi-title">
            <span>TỔNG SỐ LƯỢNG (TOTAL QTY)</span>
            <span className="live-tag">LIVE</span>
          </div>
          <div className="kpi-value">
            {metrics.totalQty.toLocaleString("en-US")}
            <span className="unit">EA</span>
          </div>
          <div className="kpi-sub">
            <FiArrowUpRight style={{ display: "inline", verticalAlign: "middle" }} />
            <span> Tổng số lượng đang hiển thị</span>
          </div>
        </div>
        <FiPackage className="kpi-bg-icon" />
      </div>

      {/* KPI Card 2: Lô hàng / Giao dịch */}
      <div className="precision-khotp__kpiCard">
        <div className="kpi-left">
          <div className="kpi-title">TỔNG GIAO DỊCH / DÒNG</div>
          <div className="kpi-value">
            {metrics.totalRows.toLocaleString("en-US")}
            <span className="unit" style={{ color: "#64748b" }}>Dòng</span>
          </div>
          <div className="kpi-sub">
            Đã đồng bộ từ hệ thống quản lý kho
          </div>
        </div>
        <div className="kpi-iconBox kpi-iconBox--blue">
          <FiClipboard />
        </div>
      </div>

      {/* KPI Card 3: Số Mã Sản Phẩm Khả Dụng */}
      <div className="precision-khotp__kpiCard">
        <div className="kpi-left">
          <div className="kpi-title">SỐ MÃ SẢN PHẨM KHẢ DỤNG</div>
          <div className="kpi-value">
            {metrics.totalCodes.toLocaleString("en-US")}
            <span className="unit" style={{ color: "#64748b" }}>Code</span>
          </div>
          <div className="kpi-sub">
            Phân loại theo quy cách lưu kho
          </div>
        </div>
        <div className="kpi-iconBox kpi-iconBox--green">
          <FiLayers />
        </div>
      </div>

      {/* KPI Card 4: Cảnh báo Lưu kho / Pending */}
      <div className="precision-khotp__kpiCard">
        <div className="kpi-left">
          <div className="kpi-title">CẢNH BÁO LƯU KHO / PENDING</div>
          <div className="kpi-value" style={{ color: metrics.pendingCount > 0 ? "#d97706" : "#059669" }}>
            {metrics.pendingCount.toLocaleString("en-US")}
            <span className="unit" style={{ color: "#64748b" }}>Lô</span>
          </div>
          <div className="kpi-sub">
            {metrics.pendingCount > 0 ? "Ưu tiên xuất theo cơ chế FIFO" : "Toàn bộ lô kho đã chuẩn hóa"}
          </div>
        </div>
        <div className="kpi-iconBox kpi-iconBox--amber">
          <FiAlertTriangle />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKHOTPKpi);
