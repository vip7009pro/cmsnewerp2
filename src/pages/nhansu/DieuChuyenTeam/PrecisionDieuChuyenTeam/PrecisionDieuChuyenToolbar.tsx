import React from 'react';
import moment from 'moment';

interface PrecisionDieuChuyenToolbarProps {
  workShiftCode: number;
  onShiftChange: (code: number) => void;
  selectedFactory: string;
  onFactoryChange: (factory: string) => void;
  factoryList: string[];
  onRefresh: () => void;
  loading?: boolean;
}

const PrecisionDieuChuyenToolbar: React.FC<PrecisionDieuChuyenToolbarProps> = ({
  workShiftCode,
  onShiftChange,
  selectedFactory,
  onFactoryChange,
  factoryList,
  onRefresh,
  loading = false,
}) => {
  const currentDateDisplay = moment().format('DD/MM/YYYY');

  return (
    <div className="precision-dieuchuyen__toolbar">
      {/* Bộ Lọc Nhà Máy & Ca Làm Việc */}
      <div className="precision-dieuchuyen__filterGroup">
        {/* Nhà máy */}
        <div className="precision-dieuchuyen__filterPill">
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#2563eb' }}>
            apartment
          </span>
          <span className="label">Nhà máy / Phân xưởng:</span>
          <select
            value={selectedFactory}
            onChange={(e) => onFactoryChange(e.target.value)}
            aria-label="Chọn nhà máy"
          >
            <option value="ALL">Tất cả nhà máy</option>
            {factoryList.map((fac) => (
              <option key={fac} value={fac}>
                {fac}
              </option>
            ))}
          </select>
        </div>

        {/* Team / Tổ gốc */}
        <div className="precision-dieuchuyen__filterPill">
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#f59e0b' }}>
            schedule
          </span>
          <span className="label">Team / Tổ gốc:</span>
          <select
            value={workShiftCode}
            onChange={(e) => onShiftChange(Number(e.target.value))}
            aria-label="Chọn ca làm việc"
          >
            <option value={5}>Tất cả</option>
            <option value={0}>TEAM 1 + Hành chính</option>
            <option value={1}>TEAM 2 + Hành chính</option>
            <option value={2}>TEAM 1</option>
            <option value={3}>TEAM 2</option>
            <option value={4}>Hành chính</option>
          </select>
        </div>

        {/* Ngày áp dụng */}
        <div className="precision-dieuchuyen__filterPill">
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#6366f1' }}>
            calendar_today
          </span>
          <span className="label">Ngày áp dụng:</span>
          <strong style={{ color: '#0f172a', fontWeight: 600 }}>
            {currentDateDisplay}
          </strong>
        </div>
      </div>

      {/* Nút Làm Mới */}
      <div className="precision-dieuchuyen__actionGroup">
        <button
          type="button"
          className="precision-dieuchuyen__btnSquare"
          onClick={onRefresh}
          disabled={loading}
          title="Tải lại dữ liệu realtime từ hệ thống"
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 16,
              animation: loading ? 'spin 1s linear infinite' : undefined,
            }}
          >
            refresh
          </span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDieuChuyenToolbar);
