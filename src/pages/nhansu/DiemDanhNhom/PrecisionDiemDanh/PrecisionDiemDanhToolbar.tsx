import React from 'react';
import moment from 'moment';

interface PrecisionDiemDanhToolbarProps {
  workShiftCode: number;
  onShiftChange: (code: number) => void;
  selectedFactory: string;
  onFactoryChange: (factory: string) => void;
  factoryList: string[];
  onMarkAllPresent: () => void;
  onExportExcel?: () => void;
  onOpenPivot?: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

const PrecisionDiemDanhToolbar: React.FC<PrecisionDiemDanhToolbarProps> = ({
  workShiftCode,
  onShiftChange,
  selectedFactory,
  onFactoryChange,
  factoryList,
  onMarkAllPresent,
  onExportExcel,
  onOpenPivot,
  onRefresh,
  loading = false,
}) => {
  const currentDateDisplay = moment().format('DD/MM/YYYY');

  return (
    <div className="precision-diemdanh__toolbar">
      {/* Bộ Lọc Nhà Máy, Ca & Ngày */}
      <div className="precision-diemdanh__filterGroup">
        {/* Nhà máy */}
        <div className="precision-diemdanh__filterPill">
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#2563eb' }}>
            apartment
          </span>
          <span className="label">Nhà máy:</span>
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

        {/* Ca làm việc */}
        <div className="precision-diemdanh__filterPill">
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#f59e0b' }}>
            schedule
          </span>
          <span className="label">Ca làm việc:</span>
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

        {/* Ngày điểm danh */}
        <div className="precision-diemdanh__filterPill">
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#6366f1' }}>
            calendar_today
          </span>
          <span className="label">Ngày:</span>
          <strong style={{ color: '#0f172a', fontWeight: 600 }}>
            Hôm nay, {currentDateDisplay}
          </strong>
        </div>
      </div>

      {/* Cụm Nút Hành Động Nhanh */}
      <div className="precision-diemdanh__actionGroup">
        <button
          type="button"
          className="precision-diemdanh__btnSuccess"
          onClick={onMarkAllPresent}
          title="Điểm danh nhanh tất cả nhân sự chưa điểm danh thành Đi Làm"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            done_all
          </span>
          <span>Điểm danh nhanh tất cả</span>
        </button>

        {onExportExcel && (
          <button
            type="button"
            className="precision-diemdanh__btnWhite"
            onClick={onExportExcel}
            title="Xuất bảng điểm danh ra file Excel (.xlsx)"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#059669' }}>
              table_view
            </span>
            <span>Xuất Excel</span>
          </button>
        )}

        {onOpenPivot && (
          <button
            type="button"
            className="precision-diemdanh__btnWhite"
            onClick={onOpenPivot}
            title="Xem bảng phân tích tổng hợp Pivot theo tổ, ca và chức danh"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#2563eb' }}>
              pivot_table_chart
            </span>
            <span>Pivot phân tích</span>
          </button>
        )}

        <button
          type="button"
          className="precision-diemdanh__btnSquare"
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

export default React.memo(PrecisionDiemDanhToolbar);
