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
  /** Biến thể siêu nén cho mobile: 4 ô × 2 dòng, nhường chỗ cho bảng dữ liệu */
  compact?: boolean;
}

const PrecisionDTCResultKpi: React.FC<PrecisionDTCResultKpiProps> = ({ kpis, compact }) => {
  const evaluated = kpis.okCount + kpis.ngCount;

  // Nhánh MOBILE: giữ nguyên 4 chỉ số nhưng chỉ 2 dòng/ô để tiết kiệm chiều cao
  if (compact) {
    const items = [
      { label: "ĐIỂM ĐO", value: kpis.totalPoints.toLocaleString(), tone: "blue" },
      { label: "MẪU ĐO", value: kpis.sampleCount.toLocaleString(), tone: "purple" },
      {
        label: "TỶ LỆ ĐẠT",
        value: `${kpis.okRate}% (${kpis.okCount}/${evaluated})`,
        tone: "emerald",
      },
      { label: "ĐIỂM LỖI", value: kpis.ngCount.toLocaleString(), tone: "rose" },
    ];

    return (
      <div className="precision-dtcresult__kpis precision-dtcresult__kpis--compact">
        {items.map((item) => (
          <div
            key={item.label}
            className={`precision-dtcresult__kpiChip precision-dtcresult__kpiChip--${item.tone}`}
          >
            <span className="chip-label">{item.label}</span>
            <span className="chip-value" title={item.value}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

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
