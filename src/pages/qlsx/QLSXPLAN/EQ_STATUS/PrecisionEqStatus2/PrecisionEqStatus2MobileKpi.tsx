import React, { useMemo } from "react";
import { EQ_STT } from "../../interfaces/khsxInterface";

interface PrecisionEqStatus2MobileKpiProps {
  data: EQ_STT[];
  seriesList: string[];
  selectedSeries: string;
  onSelectSeries: (series: string) => void;
}

export const PrecisionEqStatus2MobileKpi: React.FC<PrecisionEqStatus2MobileKpiProps> = React.memo(({
  data,
  seriesList,
  selectedSeries,
  onSelectSeries,
}) => {
  // Lọc dữ liệu theo series được chọn nếu có
  const targetData = useMemo(() => {
    if (selectedSeries === "ALL") return data;
    return data.filter((m) => m.EQ_NAME?.substring(0, 2) === selectedSeries);
  }, [data, selectedSeries]);

  const metrics = useMemo(() => {
    const total = targetData.length;
    const running = targetData.filter((m) => m.EQ_STATUS === "MASS").length;
    const setting = targetData.filter((m) => m.EQ_STATUS === "SETTING").length;
    const stop = targetData.filter((m) => m.EQ_STATUS === "STOP").length;
    const ng = targetData.filter((m) => m.EQ_ACTIVE === "NG").length;
    const activeOk = targetData.filter((m) => m.EQ_ACTIVE === "OK").length;
    const opRate = total > 0 ? (((running + setting) / total) * 100).toFixed(0) : "0";

    return { total, running, setting, stop, ng, activeOk, opRate };
  }, [targetData]);

  return (
    <div className="eqs2_mobile_kpi">
      {/* Hàng chọn Series nhanh cho KPI */}
      <div className="eqs2_mobile_kpi__series_chips">
        <button
          type="button"
          className={`kpi_series_chip ${selectedSeries === "ALL" ? "is-active" : ""}`}
          onClick={() => onSelectSeries("ALL")}
        >
          Tất cả ({data.length})
        </button>
        {seriesList.map((ser) => {
          const count = data.filter((m) => m.EQ_NAME?.substring(0, 2) === ser).length;
          if (count === 0) return null;
          return (
            <button
              key={ser}
              type="button"
              className={`kpi_series_chip ${selectedSeries === ser ? "is-active" : ""}`}
              onClick={() => onSelectSeries(ser)}
            >
              {ser} ({count})
            </button>
          );
        })}
      </div>

      {/* Dải Micro KPI Cards cuộn ngang */}
      <div className="eqs2_mobile_kpi__scroll">
        <div className="kpi_card kpi_card--primary">
          <div className="kpi_card__label">Tổng Máy</div>
          <div className="kpi_card__value">{metrics.total}</div>
        </div>

        <div className="kpi_card kpi_card--rate">
          <div className="kpi_card__label">Vận Hành</div>
          <div className="kpi_card__value">{metrics.opRate}%</div>
        </div>

        <div className="kpi_card kpi_card--success">
          <div className="kpi_card__label">Đang Chạy</div>
          <div className="kpi_card__value">{metrics.running}</div>
        </div>

        <div className="kpi_card kpi_card--warning">
          <div className="kpi_card__label">Setting</div>
          <div className="kpi_card__value">{metrics.setting}</div>
        </div>

        <div className="kpi_card kpi_card--danger">
          <div className="kpi_card__label">Tạm Dừng</div>
          <div className="kpi_card__value">{metrics.stop}</div>
        </div>

        {metrics.ng > 0 && (
          <div className="kpi_card kpi_card--ng">
            <div className="kpi_card__label">Máy Lỗi (NG)</div>
            <div className="kpi_card__value">{metrics.ng}</div>
          </div>
        )}
      </div>
    </div>
  );
});

export default PrecisionEqStatus2MobileKpi;
