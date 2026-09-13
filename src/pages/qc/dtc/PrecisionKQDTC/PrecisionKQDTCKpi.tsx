import React, { useMemo } from "react";
import { FiCheckSquare, FiTrendingUp, FiTarget, FiSliders } from "react-icons/fi";
import { CPK_DATA, DTC_DATA, XBAR_DATA } from "../../interfaces/qcInterface";

interface PrecisionKQDTCKpiProps {
  tableData: DTC_DATA[];
  xbarData: XBAR_DATA[];
  cpkData: CPK_DATA[];
}

const PrecisionKQDTCKpi: React.FC<PrecisionKQDTCKpiProps> = ({
  tableData,
  xbarData,
  cpkData,
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

    // Xbar & R Stats
    const sampleXbar = xbarData.length > 0 ? xbarData[0] : null;
    const xCl = sampleXbar ? Number(sampleXbar.X_CL) || 0 : 0;
    const xUcl = sampleXbar ? Number(sampleXbar.X_UCL) || 0 : 0;
    const xLcl = sampleXbar ? Number(sampleXbar.X_LCL) || 0 : 0;

    const rCl = sampleXbar ? Number(sampleXbar.R_CL) || 0 : 0;
    const rUcl = sampleXbar ? Number(sampleXbar.R_LCL) || 0 : 0; // Trong logic gốc R_LCL = avgR * 2.114

    return {
      totalSamples,
      okCount,
      ngCount,
      passRate,
      avgCpk: avgCpk.toFixed(2),
      isCpkOk: avgCpk >= 1.33,
      xCl: xCl > 1000 ? `${(xCl / 1000).toFixed(2)}k` : xCl.toFixed(2),
      xUcl: xUcl > 1000 ? `${(xUcl / 1000).toFixed(2)}k` : xUcl.toFixed(2),
      xLcl: xLcl > 1000 ? `${(xLcl / 1000).toFixed(2)}k` : xLcl.toFixed(2),
      rCl: rCl.toFixed(1),
      rUcl: rUcl.toFixed(1),
      hasCharts: xbarData.length > 0,
    };
  }, [tableData, xbarData, cpkData]);

  return (
    <div className="precision-kqdtc__kpiGrid">
      {/* 1. Tổng Số Mẫu Kiểm Tra */}
      <div className="precision-kqdtc__kpiCard precision-kqdtc__kpiCard--blue">
        <div className="precision-kqdtc__kpiIcon">
          <FiCheckSquare size={17} />
        </div>
        <div className="precision-kqdtc__kpiContent">
          <span className="precision-kqdtc__kpiLabel">Tổng Mẫu Kiểm Tra</span>
          <span className="precision-kqdtc__kpiValue">
            {stats.totalSamples.toLocaleString()}{" "}
            <span style={{ fontSize: 11, color: stats.ngCount > 0 ? "#e11d48" : "#059669", fontWeight: 700 }}>
              ({stats.passRate}% ĐẠT)
            </span>
          </span>
          <span className="precision-kqdtc__kpiSub">
            {stats.ngCount > 0 ? (
              <span style={{ color: "#e11d48" }}><b>{stats.ngCount}</b> mẫu NG/Fail</span>
            ) : (
              <span><b>0</b> mẫu NG • Đạt tiêu chuẩn xuất hàng</span>
            )}
          </span>
        </div>
      </div>

      {/* 2. Chỉ Số Cpk Trung Bình */}
      <div className="precision-kqdtc__kpiCard precision-kqdtc__kpiCard--emerald">
        <div className="precision-kqdtc__kpiIcon">
          <FiTrendingUp size={17} />
        </div>
        <div className="precision-kqdtc__kpiContent">
          <span className="precision-kqdtc__kpiLabel">Năng Lực Quy Trình Cpk</span>
          <span className="precision-kqdtc__kpiValue" style={{ color: stats.isCpkOk ? "#059669" : "#d97706" }}>
            {stats.avgCpk}{" "}
            <span style={{ fontSize: 11, fontWeight: 600 }}>
              {stats.isCpkOk ? "(≥ 1.33)" : "(< 1.33)"}
            </span>
          </span>
          <span className="precision-kqdtc__kpiSub">
            {stats.isCpkOk ? "Đạt chuẩn 6-Sigma • Quy trình ổn định" : "Cần giám sát & hiệu chuẩn thông số"}
          </span>
        </div>
      </div>

      {/* 3. Đường Tâm Kiểm Soát X_CL (Average X̄) */}
      <div className="precision-kqdtc__kpiCard precision-kqdtc__kpiCard--indigo">
        <div className="precision-kqdtc__kpiIcon">
          <FiTarget size={17} />
        </div>
        <div className="precision-kqdtc__kpiContent">
          <span className="precision-kqdtc__kpiLabel">Đường Tâm X_CL (Average X̄)</span>
          <span className="precision-kqdtc__kpiValue" style={{ color: "#4f46e5" }}>
            {stats.hasCharts ? stats.xCl : "--"}{" "}
            {stats.hasCharts && (
              <span style={{ fontSize: 10, color: "#64748b", fontWeight: 500 }}>
                (UCL: {stats.xUcl} / LCL: {stats.xLcl})
              </span>
            )}
          </span>
          <span className="precision-kqdtc__kpiSub">
            {stats.hasCharts ? "Điểm đo nằm trong vùng kiểm soát" : "Nhấp đúp dòng trên bảng để nạp biểu đồ"}
          </span>
        </div>
      </div>

      {/* 4. Phạm Vi Phân Tán R_CL */}
      <div className="precision-kqdtc__kpiCard precision-kqdtc__kpiCard--amber">
        <div className="precision-kqdtc__kpiIcon">
          <FiSliders size={17} />
        </div>
        <div className="precision-kqdtc__kpiContent">
          <span className="precision-kqdtc__kpiLabel">Phạm Vi Biến Thiên R_CL</span>
          <span className="precision-kqdtc__kpiValue" style={{ color: "#d97706" }}>
            {stats.hasCharts ? stats.rCl : "--"}{" "}
            {stats.hasCharts && (
              <span style={{ fontSize: 10, color: "#64748b", fontWeight: 500 }}>
                / R_UCL: {stats.rUcl}
              </span>
            )}
          </span>
          <span className="precision-kqdtc__kpiSub">
            {stats.hasCharts ? "Biên độ phân tán trong dung sai cho phép" : "Nhóm mẫu phụ chuẩn n=5"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKQDTCKpi);
