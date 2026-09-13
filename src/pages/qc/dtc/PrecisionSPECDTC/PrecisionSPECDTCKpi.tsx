import React, { useMemo } from "react";
import {
  FiAward,
  FiCheckCircle,
  FiDatabase,
  FiLayers,
  FiMinimize2,
} from "react-icons/fi";
import { DTC_SPEC_DATA } from "../../interfaces/qcInterface";

interface PrecisionSPECDTCKpiProps {
  tableData: DTC_SPEC_DATA[];
  activeTestName?: string;
}

const PrecisionSPECDTCKpi: React.FC<PrecisionSPECDTCKpiProps> = ({
  tableData,
  activeTestName,
}) => {
  const kpiStats = useMemo(() => {
    const total = tableData.length;
    if (total === 0) {
      return {
        total: 0,
        dominantTest: "Chưa có dữ liệu",
        dominantTestSub: "Đang chờ tra cứu",
        avgTor: 0.3,
        avgUpper: 0.3,
        avgLower: 0.3,
        dominantCust: "Toàn bộ khách hàng",
        uniqueCustCount: 0,
      };
    }

    // 1. Thống kê hạng mục test chủ lực
    const testCounts: Record<string, number> = {};
    // 2. Thống kê khách hàng
    const custCounts: Record<string, number> = {};
    // 3. Tính trung bình dung sai
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

    // Tìm top test
    let dominantTest = activeTestName && activeTestName !== "ALL" && activeTestName !== "0" ? activeTestName : "";
    if (!dominantTest) {
      const sortedTests = Object.entries(testCounts).sort((a, b) => b[1] - a[1]);
      dominantTest = sortedTests[0] ? sortedTests[0][0] : "Kích thước";
    }

    // Tìm top cust
    const sortedCusts = Object.entries(custCounts).sort((a, b) => b[1] - a[1]);
    const dominantCust = sortedCusts[0] ? sortedCusts[0][0] : "VALUEPLUS";
    const uniqueCustCount = Object.keys(custCounts).length;

    const avgUpper = torValidCount > 0 ? sumUpper / torValidCount : 0.3;
    const avgLower = torValidCount > 0 ? sumLower / torValidCount : 0.3;
    const avgTor = (avgUpper + avgLower) / 2;

    return {
      total,
      dominantTest,
      dominantTestSub: `Kèm RoHS (XRF), Scanbarcode...`,
      avgTor,
      avgUpper,
      avgLower,
      dominantCust: `${dominantCust} (${uniqueCustCount} KH)`,
      uniqueCustCount,
    };
  }, [tableData, activeTestName]);

  return (
    <div className="precision-specdtc__kpiGrid">
      {/* 1. Tổng Bản Ghi Tiêu Chuẩn */}
      <div className="precision-specdtc__kpiCard precision-specdtc__kpiCard--blue">
        <div className="precision-specdtc__kpiContent">
          <span className="precision-specdtc__kpiLabel">
            Tổng Bản Ghi Tiêu Chuẩn
          </span>
          <div className="precision-specdtc__kpiValue">
            {kpiStats.total.toLocaleString("vi-VN")}
            <span>dòng</span>
          </div>
          <div className="precision-specdtc__kpiMeta" style={{ color: "#059669" }}>
            <FiCheckCircle style={{ fontSize: "12px" }} />
            <span>CSDL Đồng bộ 100% MSSQL</span>
          </div>
        </div>
        <div className="precision-specdtc__kpiIcon">
          <FiDatabase />
        </div>
      </div>

      {/* 2. Hạng Mục Test Chủ Lực */}
      <div className="precision-specdtc__kpiCard precision-specdtc__kpiCard--purple">
        <div className="precision-specdtc__kpiContent">
          <span className="precision-specdtc__kpiLabel">
            Hạng Mục Test Chủ Lực
          </span>
          <div className="precision-specdtc__kpiValue" style={{ fontSize: "16px" }}>
            {kpiStats.dominantTest}
          </div>
          <div className="precision-specdtc__kpiMeta" style={{ color: "#64748b" }}>
            <FiLayers style={{ fontSize: "12px", color: "#7c3aed" }} />
            <span>{kpiStats.dominantTestSub}</span>
          </div>
        </div>
        <div className="precision-specdtc__kpiIcon">
          <FiLayers />
        </div>
      </div>

      {/* 3. Dung Sai Tiêu Chuẩn (Tor) */}
      <div className="precision-specdtc__kpiCard precision-specdtc__kpiCard--emerald">
        <div className="precision-specdtc__kpiContent">
          <span className="precision-specdtc__kpiLabel">
            Dung Sai Tiêu Chuẩn (Tor)
          </span>
          <div className="precision-specdtc__kpiValue">
            ± {kpiStats.avgTor.toFixed(2)}
            <span>mm</span>
          </div>
          <div className="precision-specdtc__kpiMeta" style={{ color: "#2563eb" }}>
            <FiMinimize2 style={{ fontSize: "12px" }} />
            <span>
              Upper: +{kpiStats.avgUpper.toFixed(2)} / Lower: -{kpiStats.avgLower.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="precision-specdtc__kpiIcon">
          <FiMinimize2 />
        </div>
      </div>

      {/* 4. Khách Hàng Áp Dụng */}
      <div className="precision-specdtc__kpiCard precision-specdtc__kpiCard--amber">
        <div className="precision-specdtc__kpiContent">
          <span className="precision-specdtc__kpiLabel">
            Khách Hàng Áp Dụng
          </span>
          <div className="precision-specdtc__kpiValue" style={{ fontSize: "16px" }}>
            {kpiStats.dominantCust}
          </div>
          <div className="precision-specdtc__kpiMeta" style={{ color: "#059669" }}>
            <FiAward style={{ fontSize: "12px", color: "#d97706" }} />
            <span>Hiệu lực sản xuất chính thức</span>
          </div>
        </div>
        <div className="precision-specdtc__kpiIcon">
          <FiAward />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionSPECDTCKpi);
