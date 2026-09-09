import React, { useMemo } from 'react';
import { DiemDanhNhomData } from '../../interfaces/nhansuInterface';


interface PrecisionDieuChuyenPivotModalProps {
  open: boolean;
  onClose: () => void;
  tableData: DiemDanhNhomData[];
}

const PrecisionDieuChuyenPivotModal: React.FC<PrecisionDieuChuyenPivotModalProps> = ({
  open,
  onClose,
  tableData,
}) => {
  // Thống kê theo Team
  const teamStats = useMemo(() => {
    const map = new Map<string, { total: number; nm1: number; nm2: number; caHC: number; caNgay: number; caDem: number }>();

    tableData.forEach((row) => {
      const team = row.WORK_SHIF_NAME || 'Chưa phân Team';
      if (!map.has(team)) {
        map.set(team, { total: 0, nm1: 0, nm2: 0, caHC: 0, caNgay: 0, caDem: 0 });
      }
      const item = map.get(team)!;
      item.total += 1;
      if (row.FACTORY_NAME === 'Nhà máy 1') item.nm1 += 1;
      else if (row.FACTORY_NAME === 'Nhà máy 2') item.nm2 += 1;

      if (row.CALV === 0) item.caHC += 1;
      else if (row.CALV === 1) item.caNgay += 1;
      else if (row.CALV === 2) item.caDem += 1;
    });

    return Array.from(map.entries()).map(([team, data]) => ({
      team,
      ...data,
    }));
  }, [tableData]);

  // Thống kê theo Nhà máy
  const factoryStats = useMemo(() => {
    const map = new Map<string, number>();
    tableData.forEach((row) => {
      const fac = row.FACTORY_NAME || 'Chưa gán xưởng';
      map.set(fac, (map.get(fac) || 0) + 1);
    });
    return Array.from(map.entries()).map(([factory, count]) => ({
      factory,
      count,
      rate: tableData.length > 0 ? ((count / tableData.length) * 100).toFixed(1) : '0',
    }));
  }, [tableData]);

  if (!open) return null;

  return (
    <div className="precision-dieuchuyen-modal" onClick={onClose}>
      <div
        className="precision-dieuchuyen-modal__card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="precision-dieuchuyen-modal__header">
          <div className="title-group">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20, color: '#7c3aed' }}
            >
              pivot_table_chart
            </span>
            <h3>Bảng Phân Tích Điều Động & Phân Bổ Ca Đa Chiều</h3>
            <span className="chip-badge">PIVOT REALTIME</span>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            title="Đóng bảng phân tích"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="precision-dieuchuyen-modal__body">
          {/* Bảng 1: Thống kê theo Team / Ca kíp */}
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '12.5px', fontWeight: 700, color: '#1e40af' }}>
              1. Ma trận điều phối nhân sự theo Team & Ca làm việc
            </h4>
            <table className="precision-dieuchuyen-modal__table">
              <thead>
                <tr>
                  <th>Tổ / Team</th>
                  <th style={{ textAlign: 'center' }}>Tổng quân số</th>
                  <th style={{ textAlign: 'center' }}>Nhà máy 1</th>
                  <th style={{ textAlign: 'center' }}>Nhà máy 2</th>
                  <th style={{ textAlign: 'center' }}>Ca HC</th>
                  <th style={{ textAlign: 'center' }}>Ca Ngày</th>
                  <th style={{ textAlign: 'center' }}>Ca Đêm</th>
                </tr>
              </thead>
              <tbody>
                {teamStats.map((row) => (
                  <tr key={row.team}>
                    <td style={{ fontWeight: 600 }}>{row.team}</td>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: '#0f172a' }}>
                      {row.total}
                    </td>
                    <td style={{ textAlign: 'center', color: '#15803d' }}>{row.nm1}</td>
                    <td style={{ textAlign: 'center', color: '#c2410c' }}>{row.nm2}</td>
                    <td style={{ textAlign: 'center' }}>{row.caHC}</td>
                    <td style={{ textAlign: 'center', color: '#1d4ed8' }}>{row.caNgay}</td>
                    <td style={{ textAlign: 'center', color: '#6d28d9' }}>{row.caDem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bảng 2: Thống kê tỷ lệ phân bổ theo Nhà máy */}
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '12.5px', fontWeight: 700, color: '#065f46' }}>
              2. Tỷ lệ phân bổ lực lượng theo Nhà máy / Phân xưởng
            </h4>
            <table className="precision-dieuchuyen-modal__table">
              <thead>
                <tr>
                  <th>Nhà máy</th>
                  <th style={{ textAlign: 'center' }}>Số lượng nhân sự</th>
                  <th style={{ textAlign: 'center' }}>Tỷ trọng (%)</th>
                </tr>
              </thead>
              <tbody>
                {factoryStats.map((row) => (
                  <tr key={row.factory}>
                    <td style={{ fontWeight: 600 }}>{row.factory}</td>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{row.count}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '1px 7px',
                          borderRadius: '9999px',
                          background: '#ecfdf5',
                          color: '#065f46',
                          fontWeight: 700,
                          border: '1px solid #a7f3d0',
                        }}
                      >
                        {row.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="precision-dieuchuyen-modal__footer">
          <button
            type="button"
            className="precision-dieuchuyen__btnWhite"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDieuChuyenPivotModal);
