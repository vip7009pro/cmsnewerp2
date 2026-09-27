// PrecisionKQDTCMobileKpi.tsx - Dải Micro-KPI cuộn ngang cho Mobile Quản Lý ĐTC

import React, { useMemo } from "react";
import { FiCheckSquare, FiAlertTriangle, FiTrendingUp, FiTarget } from "react-icons/fi";
import { CPK_DATA, DTC_DATA, XBAR_DATA } from "../interfaces/qcInterface";

interface PrecisionKQDTCMobileKpiProps {
  tableData: DTC_DATA[];
  xbarData: XBAR_DATA[];
  cpkData: CPK_DATA[];
  selectedData: any;
}

const PrecisionKQDTCMobileKpi: React.FC<PrecisionKQDTCMobileKpiProps> = ({
  tableData,
  xbarData,
  cpkData,
  selectedData,
}) => {
  const stats = useMemo(() => {
    const totalSamples = tableData.length;
    let okCount = 0;
    let ngCount = 0;

    for (let i = 0; i < totalSamples; i++) {
      if (tableData[i].DANHGIA === "OK") okCount++;
      else if (tableData[i].DANHGIA === "NG") ngCount++;
    }

    const passRate = totalSamples > 0 ? ((okCount / totalSamples) * 100).toFixed(1) : "100.0";

    // Cpk Stats
    let avgCpk = 0;
    if (cpkData.length > 0) {
      let sum = 0;
      let cnt = 0;
      for (let i = 0; i < cpkData.length; i++) {
        const val = Number(cpkData[i].CPK) || Number(cpkData[i].CPK1) || 0;
        if (val > 0) {
          sum += val;
          cnt++;
        }
      }
      avgCpk = cnt > 0 ? sum / cnt : 1.33;
    } else {
      avgCpk = 1.33;
    }

    return {
      totalSamples,
      okCount,
      ngCount,
      passRate,
      avgCpk: avgCpk.toFixed(2),
      isCpkOk: avgCpk >= 1.33,
    };
  }, [tableData, cpkData]);

  return (
    <div className="precision-kqdtc__mobileKpi" data-purpose="mobile-kpi-bar">
      <div className="mobile-kpi-scroll">
        {/* Card 1: Tổng Mẫu & Tỷ Lệ Đạt */}
        <div className="mobile-kpi-pill mobile-kpi-pill--blue">
          <div className="kpi-icon">
            <FiCheckSquare size={13} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Tổng Mẫu Kiểm Tra</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{stats.totalSamples.toLocaleString("en-US")}</span>
              <span className="kpi-sub" style={{ color: "#059669", fontWeight: 700 }}>
                ({stats.passRate}% OK)
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Mẫu NG / Fail */}
        <div
          className={`mobile-kpi-pill ${
            stats.ngCount > 0 ? "mobile-kpi-pill--rose" : "mobile-kpi-pill--emerald"
          }`}
        >
          <div className="kpi-icon">
            <FiAlertTriangle size={13} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Mẫu NG / Lỗi</span>
            <div className="kpi-value-row">
              <span
                className="kpi-value"
                style={{ color: stats.ngCount > 0 ? "#e11d48" : "#059669" }}
              >
                {stats.ngCount.toLocaleString("en-US")}
              </span>
              <span className="kpi-sub">
                {stats.ngCount > 0 ? "cần xử lý" : "đạt 100%"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Cpk Trung Bình */}
        <div className="mobile-kpi-pill mobile-kpi-pill--purple">
          <div className="kpi-icon">
            <FiTrendingUp size={13} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Chỉ Số SPC Cpk</span>
            <div className="kpi-value-row">
              <span
                className="kpi-value"
                style={{ color: stats.isCpkOk ? "#059669" : "#d97706" }}
              >
                {stats.avgCpk}
              </span>
              <span className="kpi-sub">
                {stats.isCpkOk ? "≥ 1.33 Đạt" : "< 1.33 Chú ý"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Mẫu Đang Chọn / Test Point */}
        <div className="mobile-kpi-pill mobile-kpi-pill--slate">
          <div className="kpi-icon">
            <FiTarget size={13} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Mục Test Chọn</span>
            <div className="kpi-value-row">
              <span className="kpi-value kpi-value--truncate">
                {selectedData?.TEST_NAME || "Chạm 2 lần dòng"}
              </span>
              <span className="kpi-sub">{selectedData?.POINT_CODE || "SPC"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKQDTCMobileKpi);
