import React from "react";
import {
  IoListOutline,
  IoLayersOutline,
  IoCheckmarkDoneCircleOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";

interface PrecisionDTCResultKpiProps {
  kpis: {
    totalPoints: number;
    sampleCount: number;
    okCount: number;
    ngCount: number;
    okRate: number;
  };
}

const PrecisionDTCResultKpi: React.FC<PrecisionDTCResultKpiProps> = ({ kpis }) => {
  const evaluated = kpis.okCount + kpis.ngCount;

  return (
    <div className="precision-dtcresult__kpis">
      {/* Card 1: Tổng Điểm Đo */}
      <div className="precision-dtcresult__kpiCard precision-dtcresult__kpiCard--blue">
        <div className="precision-dtcresult__kpiContent">
          <span className="precision-dtcresult__kpiLabel">TỔNG ĐIỂM ĐO (POINTS)</span>
          <span className="precision-dtcresult__kpiValue">{kpis.totalPoints}</span>
          <span className="precision-dtcresult__kpiSub">Điểm đo trong hạng mục</span>
        </div>
        <div className="precision-dtcresult__kpiIcon precision-dtcresult__kpiIcon--blue">
          <IoListOutline />
        </div>
      </div>

      {/* Card 2: Số Mẫu Đo */}
      <div className="precision-dtcresult__kpiCard precision-dtcresult__kpiCard--purple">
        <div className="precision-dtcresult__kpiContent">
          <span className="precision-dtcresult__kpiLabel">SỐ MẪU ĐO (SAMPLES)</span>
          <span className="precision-dtcresult__kpiValue">{kpis.sampleCount}</span>
          <span className="precision-dtcresult__kpiSub">Đợt mẫu kiểm tra (n)</span>
        </div>
        <div className="precision-dtcresult__kpiIcon precision-dtcresult__kpiIcon--purple">
          <IoLayersOutline />
        </div>
      </div>

      {/* Card 3: Tỷ Lệ Đạt (OK Rate) */}
      <div className="precision-dtcresult__kpiCard precision-dtcresult__kpiCard--emerald">
        <div className="precision-dtcresult__kpiContent">
          <span className="precision-dtcresult__kpiLabel">TỶ LỆ ĐẠT (OK RATE)</span>
          <span className="precision-dtcresult__kpiValue">
            {kpis.okRate}%{" "}
            <small style={{ fontSize: "11px", fontWeight: 600, color: "#059669" }}>
              ({kpis.okCount}/{evaluated})
            </small>
          </span>
          <span className="precision-dtcresult__kpiSub">Điểm đo trong dung sai</span>
        </div>
        <div className="precision-dtcresult__kpiIcon precision-dtcresult__kpiIcon--emerald">
          <IoCheckmarkDoneCircleOutline />
        </div>
      </div>

      {/* Card 4: Điểm Lỗi (NG Count) */}
      <div className="precision-dtcresult__kpiCard precision-dtcresult__kpiCard--rose">
        <div className="precision-dtcresult__kpiContent">
          <span className="precision-dtcresult__kpiLabel">ĐIỂM LỖI (NG COUNT)</span>
          <span
            className="precision-dtcresult__kpiValue"
            style={{ color: kpis.ngCount > 0 ? "#e11d48" : "#0f172a" }}
          >
            {kpis.ngCount}
          </span>
          <span className="precision-dtcresult__kpiSub">Vượt dung sai giới hạn</span>
        </div>
        <div className="precision-dtcresult__kpiIcon precision-dtcresult__kpiIcon--rose">
          <IoAlertCircleOutline />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDTCResultKpi);
