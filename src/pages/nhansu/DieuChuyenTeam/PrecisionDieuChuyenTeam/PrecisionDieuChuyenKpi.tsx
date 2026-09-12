import React, { useMemo } from 'react';
import { DiemDanhNhomData } from '../../interfaces/nhansuInterface';

interface PrecisionDieuChuyenKpiProps {
  tableData: DiemDanhNhomData[];
}

const PrecisionDieuChuyenKpi: React.FC<PrecisionDieuChuyenKpiProps> = ({ tableData }) => {
  const stats = useMemo(() => {
    const total = tableData.length;
    // Đếm số người có phân ca (CALV !== null) hoặc điều chuyển
    const assignedShift = tableData.filter((row) => row.CALV !== null && row.CALV !== undefined).length;
    const assignedPosition = tableData.filter((row) => Boolean(row.WORK_POSITION_NAME)).length;
    // Người giữ nguyên tổ
    const staying = tableData.filter((row) => row.CALV === null || row.CALV === undefined).length;

    const transferredRate = total > 0 ? ((assignedShift / total) * 100).toFixed(1) : '0';
    const stayingRate = total > 0 ? ((staying / total) * 100).toFixed(1) : '0';
    const positionRate = total > 0 ? ((assignedPosition / total) * 100).toFixed(1) : '0';

    return {
      total,
      assignedShift,
      transferredRate,
      staying,
      stayingRate,
      assignedPosition,
      positionRate,
    };
  }, [tableData]);

  return (
    <div className="precision-dieuchuyen__kpiGrid">
      {/* Card 1: Tổng Quân Số Tổ Gốc */}
      <div className="precision-dieuchuyen__kpiCard precision-dieuchuyen__kpiCard--blue">
        <div className="precision-dieuchuyen__kpiContent">
          <div className="kpi-top">
            <span className="kpi-title">TỔNG QUÂN SỐ TỔ GỐC</span>
            <span className="kpi-badge kpi-badge--emerald">100% Căn cứ</span>
          </div>
          <div className="kpi-numbers">
            <span className="kpi-val">{stats.total < 10 ? `0${stats.total}` : stats.total}</span>
            <span className="kpi-desc">Nhân sự hiện diện</span>
          </div>
          <div className="kpi-subtext">Danh sách quân số ca làm việc thực tế</div>
        </div>
        <div className="precision-dieuchuyen__kpiIconBox">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            groups
          </span>
        </div>
      </div>

      {/* Card 2: Đang Chi Viện / Chuyển Ca */}
      <div className="precision-dieuchuyen__kpiCard precision-dieuchuyen__kpiCard--amber">
        <div className="precision-dieuchuyen__kpiContent">
          <div className="kpi-top">
            <span className="kpi-title">ĐANG CHI VIỆN / ĐIỀU ĐỘNG</span>
            <span className="kpi-badge kpi-badge--amber">{stats.transferredRate}% lực lượng</span>
          </div>
          <div className="kpi-numbers">
            <span className="kpi-val">
              {stats.assignedShift < 10 ? `0${stats.assignedShift}` : stats.assignedShift}
            </span>
            <span className="kpi-desc">Đã gán ca chi viện</span>
          </div>
          <div className="kpi-subtext">Phân bổ ca làm việc liên xưởng / chuyền</div>
        </div>
        <div className="precision-dieuchuyen__kpiIconBox">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            swap_horiz
          </span>
        </div>
      </div>

      {/* Card 3: Quân Số Giữ Nguyên Tại Tổ */}
      <div className="precision-dieuchuyen__kpiCard precision-dieuchuyen__kpiCard--emerald">
        <div className="precision-dieuchuyen__kpiContent">
          <div className="kpi-top">
            <span className="kpi-title">QUÂN SỐ BÁM LINE TỔ GỐC</span>
            <span className="kpi-badge kpi-badge--emerald">{stats.stayingRate}%</span>
          </div>
          <div className="kpi-numbers">
            <span className="kpi-val">
              {stats.staying < 10 ? `0${stats.staying}` : stats.staying}
            </span>
            <span className="kpi-desc">Nhân sự bám chuyền</span>
          </div>
          <div className="kpi-subtext">Đảm bảo định mức vận hành tối thiểu</div>
        </div>
        <div className="precision-dieuchuyen__kpiIconBox">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            verified_user
          </span>
        </div>
      </div>

      {/* Card 4: Tiến Độ Phân Công Vị Trí */}
      <div className="precision-dieuchuyen__kpiCard precision-dieuchuyen__kpiCard--indigo">
        <div className="precision-dieuchuyen__kpiContent">
          <div className="kpi-top">
            <span className="kpi-title">TIẾN ĐỘ PHÂN CÔNG VỊ TRÍ</span>
            <span className="kpi-badge kpi-badge--emerald">{stats.positionRate}%</span>
          </div>
          <div className="kpi-numbers">
            <span className="kpi-val">
              {stats.assignedPosition < 10 ? `0${stats.assignedPosition}` : stats.assignedPosition}
              <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}> / {stats.total}</span>
            </span>
            <span className="kpi-desc">Đã có vị trí</span>
          </div>
          <div className="kpi-subtext">Vị trí công việc & định mức sản phẩm</div>
        </div>
        <div className="precision-dieuchuyen__kpiIconBox">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            assignment_turned_in
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDieuChuyenKpi);
