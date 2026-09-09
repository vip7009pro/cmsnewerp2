import React, { useMemo } from 'react';
import { DiemDanhNhomData } from '../../interfaces/nhansuInterface';

interface PrecisionDiemDanhKpiProps {
  tableData: DiemDanhNhomData[];
}

const PrecisionDiemDanhKpi: React.FC<PrecisionDiemDanhKpiProps> = ({
  tableData,
}) => {
  const {
    total,
    presentCount,
    presentPercent,
    absentCount,
    absentPercent,
    sickCount,
    personalCount,
    unmarkedCount,
  } = useMemo(() => {
    const tot = tableData.length;
    const present = tableData.filter((e) => e.ON_OFF === 1).length;
    const absent = tableData.filter((e) => e.ON_OFF === 0).length;
    const unmarked = tableData.filter((e) => e.ON_OFF === null).length;

    const pPct = tot > 0 ? ((present / tot) * 100).toFixed(1) : '0.0';
    const aPct = tot > 0 ? ((absent / tot) * 100).toFixed(1) : '0.0';

    const sick = tableData.filter(
      (e) =>
        e.ON_OFF === 0 &&
        (e.REASON_NAME?.toLowerCase().includes('ốm') ||
          e.REASON_NAME?.toLowerCase().includes('bhxh'))
    ).length;

    const personal = tableData.filter(
      (e) =>
        e.ON_OFF === 0 &&
        (e.REASON_NAME?.toLowerCase().includes('việc') ||
          e.REASON_NAME?.toLowerCase().includes('nửa phép') ||
          e.REASON_NAME?.toLowerCase().includes('phép'))
    ).length;

    return {
      total: tot,
      presentCount: present,
      presentPercent: pPct,
      absentCount: absent,
      absentPercent: aPct,
      sickCount: sick,
      personalCount: personal,
      unmarkedCount: unmarked,
    };
  }, [tableData]);

  return (
    <div className="precision-diemdanh__kpiGrid">
      {/* Card 1: Tổng biên chế tổ */}
      <div className="precision-diemdanh__kpiCard precision-diemdanh__kpiCard--blue">
        <div className="precision-diemdanh__kpiContent">
          <div className="kpi-top">
            <span className="kpi-title">TỔNG BIÊN CHẾ</span>
          </div>
          <div className="kpi-numbers">
            <span className="kpi-val">{total}</span>
            <span className="kpi-desc">nhân sự chính thức</span>
          </div>
          <p className="kpi-subtext">
            {unmarkedCount > 0
              ? `Còn ${unmarkedCount} nhân sự chưa điểm danh ca`
              : 'Đã hoàn tất điểm danh toàn bộ quân số'}
          </p>
        </div>
        <div className="precision-diemdanh__kpiIconBox kpi-iconbox">
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
            groups
          </span>
        </div>
      </div>

      {/* Card 2: Đi làm thực tế */}
      <div className="precision-diemdanh__kpiCard precision-diemdanh__kpiCard--green">
        <div className="precision-diemdanh__kpiContent">
          <div className="kpi-top">
            <span className="kpi-title">ĐI LÀM THỰC TẾ</span>
            <span className="kpi-badge kpi-badge--green">{presentPercent}%</span>
          </div>
          <div className="kpi-numbers">
            <span className="kpi-val">{presentCount}</span>
            <span className="kpi-desc">/ {total} có mặt tại xưởng</span>
          </div>
          <div className="kpi-progress">
            <div
              className="kpi-bar"
              style={{ width: `${Math.min(100, Number(presentPercent))}%` }}
            />
          </div>
        </div>
        <div className="precision-diemdanh__kpiIconBox kpi-iconbox">
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
            check_circle
          </span>
        </div>
      </div>

      {/* Card 3: Vắng mặt / Nghỉ phép */}
      <div className="precision-diemdanh__kpiCard precision-diemdanh__kpiCard--red">
        <div className="precision-diemdanh__kpiContent">
          <div className="kpi-top">
            <span className="kpi-title">VẮNG MẶT / NGHỈ PHÉP</span>
            <span className="kpi-badge kpi-badge--red">{absentPercent}%</span>
          </div>
          <div className="kpi-numbers">
            <span className="kpi-val">{absentCount}</span>
            <span className="kpi-desc">nhân sự vắng ca</span>
          </div>
          <div className="kpi-reasons">
            {sickCount > 0 && (
              <span className="reason-item" style={{ color: '#be123c' }}>
                • {sickCount} nghỉ ốm BHXH
              </span>
            )}
            {personalCount > 0 && (
              <span className="reason-item" style={{ color: '#b45309' }}>
                • {personalCount} việc riêng / phép
              </span>
            )}
            {sickCount === 0 && personalCount === 0 && (
              <span className="kpi-subtext">
                {absentCount > 0
                  ? `• ${absentCount} nghỉ việc / vắng mặt`
                  : '100% quân số đi làm đầy đủ'}
              </span>
            )}
          </div>
        </div>
        <div className="precision-diemdanh__kpiIconBox kpi-iconbox">
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
            person_off
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDiemDanhKpi);
