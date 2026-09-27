// PrecisionSPECDTCMobileKpi.tsx - Dải thẻ Micro-KPI cuộn ngang cho mobile module SPECDTC

import React, { useMemo } from "react";
import {
  FiDatabase,
  FiLayers,
  FiMinimize2,
  FiAward,
} from "react-icons/fi";
import { DTC_SPEC_DATA } from "../../interfaces/qcInterface";

interface PrecisionSPECDTCMobileKpiProps {
  tableData: DTC_SPEC_DATA[];
  activeTestName?: string;
}

const PrecisionSPECDTCMobileKpi: React.FC<PrecisionSPECDTCMobileKpiProps> = ({
  tableData,
  activeTestName,
}) => {
  const stats = useMemo(() => {
    const total = tableData.length;
    if (total === 0) {
      return {
        total: 0,
        dominantTest: "Chưa có",
        avgTor: 0.3,
        dominantCust: "Toàn bộ KH",
        uniqueCustCount: 0,
      };
    }

    const testCounts: Record<string, number> = {};
    const custCounts: Record<string, number> = {};
    let sumUpper = 0;
    let sumLower = 0;
    let torValidCount = 0;

    tableData.forEach((row) => {
      const tName = row.TEST_NAME || "Khác";
      testCounts[tName] = (testCounts[tName] || 0) + 1;

      const cName = row.CUST_NAME_KD || "N/A";
      custCounts[cName] = (custCounts[cName] || 0) + 1;

      const upper = Number(row.UPPER_TOR);
      const lower = Number(row.LOWER_TOR);
      if (!isNaN(upper) && !isNaN(lower)) {
        sumUpper += Math.abs(upper);
        sumLower += Math.abs(lower);
        torValidCount++;
      }
    });

    let dominantTest =
      activeTestName && activeTestName !== "ALL" && activeTestName !== "0"
        ? activeTestName
        : "";
    if (!dominantTest) {
      const sortedTests = Object.entries(testCounts).sort((a, b) => b[1] - a[1]);
      dominantTest = sortedTests[0] ? sortedTests[0][0] : "Kích thước";
    }

    const sortedCusts = Object.entries(custCounts).sort((a, b) => b[1] - a[1]);
    const dominantCust = sortedCusts[0] ? sortedCusts[0][0] : "VALUEPLUS";
    const uniqueCustCount = Object.keys(custCounts).length;

    const avgUpper = torValidCount > 0 ? sumUpper / torValidCount : 0.3;
    const avgLower = torValidCount > 0 ? sumLower / torValidCount : 0.3;
    const avgTor = (avgUpper + avgLower) / 2;

    return {
      total,
      dominantTest,
      avgTor,
      dominantCust,
      uniqueCustCount,
    };
  }, [tableData, activeTestName]);

  return (
    <div className="precision-specdtc__mobileKpiScroll" data-purpose="mobile-kpi-summary">
      {/* 1. Tổng bản ghi */}
      <div className="mobile-kpi-pill mobile-kpi-pill--blue">
        <div className="pill-icon">
          <FiDatabase size={13} />
        </div>
        <div className="pill-body">
          <span className="pill-label">TỔNG SPEC</span>
          <span className="pill-value font-mono">
            {stats.total.toLocaleString("vi-VN")}
            <small> dòng</small>
          </span>
        </div>
      </div>

      {/* 2. Hạng mục test chủ lực */}
      <div className="mobile-kpi-pill mobile-kpi-pill--purple">
        <div className="pill-icon">
          <FiLayers size={13} />
        </div>
        <div className="pill-body">
          <span className="pill-label">TEST CHỦ LỰC</span>
          <span className="pill-value pill-value--truncate" title={stats.dominantTest}>
            {stats.dominantTest}
          </span>
        </div>
      </div>

      {/* 3. Dung sai trung bình */}
      <div className="mobile-kpi-pill mobile-kpi-pill--emerald">
        <div className="pill-icon">
          <FiMinimize2 size={13} />
        </div>
        <div className="pill-body">
          <span className="pill-label">DUNG SAI TB</span>
          <span className="pill-value font-mono">
            ±{stats.avgTor.toFixed(2)}
            <small> mm</small>
          </span>
        </div>
      </div>

      {/* 4. Khách hàng áp dụng */}
      <div className="mobile-kpi-pill mobile-kpi-pill--amber">
        <div className="pill-icon">
          <FiAward size={13} />
        </div>
        <div className="pill-body">
          <span className="pill-label">TOP KHÁCH HÀNG</span>
          <span className="pill-value pill-value--truncate" title={`${stats.dominantCust} (${stats.uniqueCustCount} KH)`}>
            {stats.dominantCust}
            <small> ({stats.uniqueCustCount} KH)</small>
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionSPECDTCMobileKpi);
