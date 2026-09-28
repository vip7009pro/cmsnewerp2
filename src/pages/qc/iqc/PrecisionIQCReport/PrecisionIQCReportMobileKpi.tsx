// PrecisionIQCReportMobileKpi.tsx - Dải KPI siêu nén cho mobile (thay 4 card KPI desktop)
// Trên điện thoại: 4 dòng thay vì 4 card lớn => tiết kiệm ~230px chiều cao cho biểu đồ.
import React, { useState } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { IQC_TREND_DATA } from '../../interfaces/qcInterface';

interface PrecisionIQCReportMobileKpiProps {
  dailyppm: IQC_TREND_DATA[];
  weeklyppm: IQC_TREND_DATA[];
  monthlyppm: IQC_TREND_DATA[];
  yearlyppm: IQC_TREND_DATA[];
}

const PrecisionIQCReportMobileKpi: React.FC<PrecisionIQCReportMobileKpiProps> = ({
  dailyppm,
  weeklyppm,
  monthlyppm,
  yearlyppm,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const rows = [
    { tone: 'blue', label: 'Hôm Nay', src: dailyppm },
    { tone: 'emerald', label: 'Tuần Này', src: weeklyppm },
    { tone: 'amber', label: 'Tháng Này', src: monthlyppm },
    { tone: 'rose', label: 'Năm Nay', src: yearlyppm },
  ].map((item) => {
    const cur = item.src?.[item.src.length - 1];
    return {
      tone: item.tone,
      label: item.label,
      rate: cur?.NG_RATE ?? 0,
      mat: cur?.OK_CNT ?? 0,
      proc: cur?.PD_CNT ?? 0,
    };
  });

  return (
    <section className={`precision-iqc-mobile-kpi ${collapsed ? 'is-collapsed' : ''}`}>
      <table className="mobile-kpi-table">
        <thead>
          <tr>
            <th colSpan={2}>
              <button
                type="button"
                className="kpi-head__toggle"
                onClick={() => setCollapsed((c) => !c)}
                aria-expanded={!collapsed}
                title={collapsed ? 'Mở rộng chỉ số KPI' : 'Thu gọn chỉ số KPI'}
              >
                {collapsed ? <FiChevronRight size={14} /> : <FiChevronDown size={14} />}
                <span>Chỉ số NG Rate (PPM)</span>
                <span className="kpi-head__badge">4</span>
              </button>
            </th>
          </tr>
        </thead>
        {!collapsed && (
          <tbody>
            {rows.map((r) => (
              <tr key={r.tone} className={`kpi-row kpi-row--${r.tone}`}>
                <td className="kpi-cell-label">{r.label}</td>
                <td className="kpi-cell-value">
                  <span className="kpi-rate">
                    {r.rate.toLocaleString('en-US', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 1,
                    })}
                    <span className="kpi-unit">PPM</span>
                  </span>
                  <span className="kpi-meta">
                    Liệu {r.mat.toLocaleString('en-US')} • C.Đoạn {r.proc.toLocaleString('en-US')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </section>
  );
};

export default React.memo(PrecisionIQCReportMobileKpi);
