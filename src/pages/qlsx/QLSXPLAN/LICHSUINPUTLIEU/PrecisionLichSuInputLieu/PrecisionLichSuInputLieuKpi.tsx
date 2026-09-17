import React, { useMemo } from "react";
import { FiLayers, FiBox, FiCheckCircle, FiClock, FiCpu } from "react-icons/fi";
import { LICHSUINPUTLIEU_DATA } from "../../interfaces/khsxInterface";

interface PrecisionLichSuInputLieuKpiProps {
  data: LICHSUINPUTLIEU_DATA[];
}

const PrecisionLichSuInputLieuKpi: React.FC<PrecisionLichSuInputLieuKpiProps> = ({ data }) => {
  const metrics = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalRecords: 0,
        totalInput: 0,
        totalUsed: 0,
        totalRemain: 0,
        usedRate: 0,
        remainRate: 0,
        uniqueMaterials: 0,
        uniqueMachines: 0,
      };
    }

    let totalInput = 0;
    let totalUsed = 0;
    let totalRemain = 0;
    const materialSet = new Set<string>();
    const machineSet = new Set<string>();

    data.forEach((item) => {
      totalInput += Number(item.INPUT_QTY) || 0;
      totalUsed += Number(item.USED_QTY) || 0;
      totalRemain += Number(item.REMAIN_QTY) || 0;

      if (item.M_CODE) materialSet.add(item.M_CODE);
      if (item.EQUIPMENT_CD) machineSet.add(item.EQUIPMENT_CD);
    });

    const usedRate = totalInput > 0 ? (totalUsed / totalInput) * 100 : 0;
    const remainRate = totalInput > 0 ? (totalRemain / totalInput) * 100 : 0;

    return {
      totalRecords: data.length,
      totalInput,
      totalUsed,
      totalRemain,
      usedRate,
      remainRate,
      uniqueMaterials: materialSet.size,
      uniqueMachines: machineSet.size,
    };
  }, [data]);

  return (
    <div className="precision-inputlieu-kpi-grid">
      {/* 1. Tổng Lượt Quét Input */}
      <div className="kpi-card kpi-card--blue">
        <div className="kpi-info">
          <span className="kpi-label">Tổng Lượt Input</span>
          <span className="kpi-amount">{metrics.totalRecords.toLocaleString("en-US")}</span>
          <div className="kpi-meta">
            <span>Số lần cấp liệu máy</span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiLayers />
        </div>
      </div>

      {/* 2. Tổng Khối Lượng Input */}
      <div className="kpi-card kpi-card--indigo">
        <div className="kpi-info">
          <span className="kpi-label">Tổng Lượng Input</span>
          <span className="kpi-amount">{Math.round(metrics.totalInput).toLocaleString("en-US")}</span>
          <div className="kpi-meta">
            <span>Tổng cấp sản xuất</span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiBox />
        </div>
      </div>

      {/* 3. Tổng Đã Dùng & Tỷ Lệ Sử Dụng */}
      <div className="kpi-card kpi-card--emerald">
        <div className="kpi-info">
          <span className="kpi-label">Tổng Đã Dùng</span>
          <span className="kpi-amount">{Math.round(metrics.totalUsed).toLocaleString("en-US")}</span>
          <div className="kpi-meta">
            <span>Đạt:</span>
            <span className="rate-badge rate-badge--green">
              {metrics.usedRate.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiCheckCircle />
        </div>
      </div>

      {/* 4. Tổng Tồn Dư Còn Lại */}
      <div className="kpi-card kpi-card--amber">
        <div className="kpi-info">
          <span className="kpi-label">Tồn Dư Dở Dang</span>
          <span className="kpi-amount">{Math.round(metrics.totalRemain).toLocaleString("en-US")}</span>
          <div className="kpi-meta">
            <span>Tồn:</span>
            <span className="rate-badge rate-badge--orange">
              {metrics.remainRate.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiClock />
        </div>
      </div>

      {/* 5. Đa Dạng Vật Tư & Máy Móc */}
      <div className="kpi-card kpi-card--purple">
        <div className="kpi-info">
          <span className="kpi-label">Vật Tư & Thiết Bị</span>
          <span className="kpi-amount">{metrics.uniqueMaterials}</span>
          <div className="kpi-meta">
            <span className="highlight">{metrics.uniqueMaterials}</span> Mã Liệu /{" "}
            <span className="highlight">{metrics.uniqueMachines}</span> Máy
          </div>
        </div>
        <div className="kpi-icon-wrap">
          <FiCpu />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionLichSuInputLieuKpi);
