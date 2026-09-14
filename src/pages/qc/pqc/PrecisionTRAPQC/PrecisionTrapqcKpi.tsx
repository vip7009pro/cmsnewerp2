import React, { useMemo } from 'react';
import { FiDatabase, FiLayers, FiActivity, FiAlertTriangle } from 'react-icons/fi';
import { TrapqcMode } from './useTrapqcData';

interface PrecisionTrapqcKpiProps {
  data: Array<any>;
  activeMode: TrapqcMode;
}

const PrecisionTrapqcKpi: React.FC<PrecisionTrapqcKpiProps> = ({ data, activeMode }) => {
  const stats = useMemo(() => {
    const totalRecords = data.length;

    let totalInspect = 0;
    let totalDefect = 0;

    if (activeMode === 'SETTING' || activeMode === 'DEFECT') {
      data.forEach((item) => {
        totalInspect += Number(item.INSPECT_QTY || item.INSPECT_SAMPLE_QTY || 0);
        totalDefect += Number(item.DEFECT_QTY || 0);
      });
    } else if (activeMode === 'DAOFILM') {
      data.forEach((item) => {
        totalInspect += Number(item.SOLUONG || 0);
      });
    }

    const defectRate = totalInspect > 0 ? (totalDefect / totalInspect) * 100 : 0;

    return {
      totalRecords,
      totalInspect,
      totalDefect,
      defectRate,
    };
  }, [data, activeMode]);

  const modeLabel = useMemo(() => {
    switch (activeMode) {
      case 'SETTING':
        return 'PQC1 - SETTING';
      case 'DEFECT':
        return 'PQC3 - DEFECT';
      case 'DAOFILM':
        return 'DAO - FILM';
      case 'CNDB':
        return 'CHẤP NHẬN ĐẶC BIỆT';
      default:
        return activeMode;
    }
  }, [activeMode]);

  return (
    <section className="precision-trapqc-kpi-grid">
      {/* Card 1: Tổng bản ghi */}
      <div className="kpi-card kpi-card--blue">
        <div className="kpi-info">
          <span className="kpi-label">Tổng Bản Ghi (Records)</span>
          <div className="kpi-amount">
            {stats.totalRecords.toLocaleString('en-US')}
            <span className="unit">dòng</span>
          </div>
          <span className="kpi-meta">Dữ liệu tra cứu realtime</span>
        </div>
        <div className="kpi-icon-wrap">
          <FiDatabase />
        </div>
      </div>

      {/* Card 2: Chế độ tra cứu */}
      <div className="kpi-card kpi-card--emerald">
        <div className="kpi-info">
          <span className="kpi-label">Phân Hệ (Source)</span>
          <div className="kpi-amount" style={{ fontSize: '13px' }}>
            {modeLabel}
          </div>
          <span className="kpi-meta">Chế độ đang kích hoạt</span>
        </div>
        <div className="kpi-icon-wrap">
          <FiLayers />
        </div>
      </div>

      {/* Card 3: Sản lượng kiểm tra */}
      <div className="kpi-card kpi-card--amber">
        <div className="kpi-info">
          <span className="kpi-label">Sản Lượng KT (Inspect Qty)</span>
          <div className="kpi-amount">
            {stats.totalInspect.toLocaleString('en-US')}
            <span className="unit">EA</span>
          </div>
          <span className="kpi-meta">Tổng mẫu/sản phẩm kiểm tra</span>
        </div>
        <div className="kpi-icon-wrap">
          <FiActivity />
        </div>
      </div>

      {/* Card 4: Lỗi khuyết tật */}
      <div className="kpi-card kpi-card--purple">
        <div className="kpi-info">
          <span className="kpi-label">Lỗi Khuyết Tật (Defect)</span>
          <div className="kpi-amount">
            {stats.totalDefect.toLocaleString('en-US')}
            <span className="unit">({stats.defectRate.toFixed(2)}%)</span>
          </div>
          <span className="kpi-meta">Tỷ lệ NG trên tổng kiểm tra</span>
        </div>
        <div className="kpi-icon-wrap">
          <FiAlertTriangle />
        </div>
      </div>
    </section>
  );
};

export default React.memo(PrecisionTrapqcKpi);
