import React from "react";
import {
  IoListOutline,
  IoCheckmarkDoneCircleOutline,
  IoLayersOutline,
  IoCheckboxOutline,
} from "react-icons/io5";

interface PrecisionDKDTCKpiProps {
  kpis: {
    total: number;
    finished: number;
    massProd: number;
    selectedTestsCount: number;
  };
}

const PrecisionDKDTCKpi: React.FC<PrecisionDKDTCKpiProps> = ({ kpis }) => {
  const finishRate =
    kpis.total > 0 ? Math.round((kpis.finished / kpis.total) * 100) : 0;

  return (
    <div className="precision-dkdtc__kpis">
      {/* KPI 1: Tổng lượt đăng ký */}
      <div className="precision-dkdtc__kpiCard precision-dkdtc__kpiCard--blue">
        <div className="precision-dkdtc__kpiContent">
          <span className="precision-dkdtc__kpiLabel">TỔNG LƯỢT ĐĂNG KÝ</span>
          <span className="precision-dkdtc__kpiValue">{kpis.total.toLocaleString()}</span>
          <span className="precision-dkdtc__kpiSub">Bản ghi nạp gần nhất</span>
        </div>
        <div className="precision-dkdtc__kpiIcon precision-dkdtc__kpiIcon--blue">
          <IoListOutline />
        </div>
      </div>

      {/* KPI 2: Hoàn thành test */}
      <div className="precision-dkdtc__kpiCard precision-dkdtc__kpiCard--emerald">
        <div className="precision-dkdtc__kpiContent">
          <span className="precision-dkdtc__kpiLabel">HOÀN THÀNH TEST</span>
          <span className="precision-dkdtc__kpiValue">
            {kpis.finished.toLocaleString()}{" "}
            <small style={{ fontSize: "11px", fontWeight: 600, color: "#059669" }}>
              ({finishRate}%)
            </small>
          </span>
          <span className="precision-dkdtc__kpiSub">Mẫu đã trả kết quả</span>
        </div>
        <div className="precision-dkdtc__kpiIcon precision-dkdtc__kpiIcon--emerald">
          <IoCheckmarkDoneCircleOutline />
        </div>
      </div>

      {/* KPI 3: Mass Production */}
      <div className="precision-dkdtc__kpiCard precision-dkdtc__kpiCard--purple">
        <div className="precision-dkdtc__kpiContent">
          <span className="precision-dkdtc__kpiLabel">MASS PRODUCTION</span>
          <span className="precision-dkdtc__kpiValue">{kpis.massProd.toLocaleString()}</span>
          <span className="precision-dkdtc__kpiSub">Hàng loạt định kỳ</span>
        </div>
        <div className="precision-dkdtc__kpiIcon precision-dkdtc__kpiIcon--purple">
          <IoLayersOutline />
        </div>
      </div>

      {/* KPI 4: Hạng mục đang chọn */}
      <div className="precision-dkdtc__kpiCard precision-dkdtc__kpiCard--amber">
        <div className="precision-dkdtc__kpiContent">
          <span className="precision-dkdtc__kpiLabel">HẠNG MỤC ĐANG CHỌN</span>
          <span className="precision-dkdtc__kpiValue">
            {kpis.selectedTestsCount}{" "}
            <small style={{ fontSize: "11px", fontWeight: 600, color: "#d97706" }}>
              mục
            </small>
          </span>
          <span className="precision-dkdtc__kpiSub">Chuẩn bị đăng ký</span>
        </div>
        <div className="precision-dkdtc__kpiIcon precision-dkdtc__kpiIcon--amber">
          <IoCheckboxOutline />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDKDTCKpi);
