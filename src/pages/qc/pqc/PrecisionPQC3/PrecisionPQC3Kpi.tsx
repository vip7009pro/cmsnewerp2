import React from "react";
import { FiAlertCircle, FiCheckCircle, FiTrendingUp } from "react-icons/fi";
import { BiErrorAlt } from "react-icons/bi";
import { PQC3KpiStats } from "./usePQC3Data";

interface PrecisionPQC3KpiProps {
  kpis: PQC3KpiStats;
}

export const PrecisionPQC3Kpi: React.FC<PrecisionPQC3KpiProps> = ({ kpis }) => {
  return (
    <div className="precision-pqc3-kpi">
      {/* 1. Tổng sự cố lỗi */}
      <div className="precision-pqc3-kpi__card card-rose">
        <div className="kpi-content">
          <span className="kpi-label">Tổng Sự Cố Lỗi PQC3</span>
          <span className="kpi-value">{kpis.totalDefects.toLocaleString()}</span>
          <span className="kpi-subtext">Lần phát sinh sự cố</span>
        </div>
        <div className="kpi-icon">
          <BiErrorAlt size={16} />
        </div>
      </div>

      {/* 2. Tổng sản phẩm khuyết tật */}
      <div className="precision-pqc3-kpi__card card-amber">
        <div className="kpi-content">
          <span className="kpi-label">Tổng Sản Phẩm Lỗi (NG)</span>
          <span className="kpi-value">{kpis.totalDefectQty.toLocaleString()} EA</span>
          <span className="kpi-subtext">Số lượng phế phẩm phát sinh</span>
        </div>
        <div className="kpi-icon">
          <FiAlertCircle size={15} />
        </div>
      </div>

      {/* 3. Tổng lượng mẫu kiểm tra */}
      <div className="precision-pqc3-kpi__card card-blue">
        <div className="kpi-content">
          <span className="kpi-label">Tổng Lượng Mẫu KT</span>
          <span className="kpi-value">{kpis.totalInspectQty.toLocaleString()} EA</span>
          <span className="kpi-subtext">Mẫu ngoại quan PQC</span>
        </div>
        <div className="kpi-icon">
          <FiCheckCircle size={15} />
        </div>
      </div>

      {/* 4. Tỷ lệ khuyết tật bình quân */}
      <div className="precision-pqc3-kpi__card card-indigo">
        <div className="kpi-content">
          <span className="kpi-label">Tỷ Lệ Lỗi TB (PPM/%)</span>
          <span className="kpi-value">{kpis.defectRate}</span>
          <span className="kpi-subtext">{kpis.totalPqc1Lots} lô Setting PQC1 khả dụng</span>
        </div>
        <div className="kpi-icon">
          <FiTrendingUp size={15} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPQC3Kpi);
