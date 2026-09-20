import React from 'react';
import moment from 'moment';

interface PrecisionDiemDanhToolbarProps {
  workShiftCode: number;
  onShiftChange: (code: number) => void;
  selectedFactory: string;
  onFactoryChange: (factory: string) => void;
  factoryList: string[];
  onMarkAllPresent: () => void;
  onRefresh: () => void;
  loading?: boolean;
  /** Số nhân sự đang hiển thị sau khi lọc (dùng cho badge nút EX1) */
  filteredCount?: number;
  /** Tổng số nhân sự của ca (dùng cho badge nút EX2) */
  totalCount?: number;
  onExportEX1?: () => void;
  onExportEX2?: () => void;
  onOpenPivot?: () => void;
}

const PrecisionDiemDanhToolbar: React.FC<PrecisionDiemDanhToolbarProps> = ({
  workShiftCode,
  onShiftChange,
  selectedFactory,
  onFactoryChange,
  factoryList,
  onMarkAllPresent,
  onRefresh,
  loading = false,
  filteredCount = 0,
  totalCount = 0,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
}) => {
  const currentDateDisplay = moment().format('DD/MM/YYYY');

  return (
    <div className="precision-diemdanh__toolbar">
      {/* Bộ Lọc Nhà Máy, Ca & Ngày */}
      <div className="precision-diemdanh__filterGroup">
        {/* Nhà máy */}
        {/* <div className="precision-diemdanh__filterPill">
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
        </div> */}

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
            <span className="date-prefix">Hôm nay, </span>
            {currentDateDisplay}
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
          aria-label="Điểm danh nhanh tất cả"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            done_all
          </span>
          <span className="btn-label">Điểm danh nhanh tất cả</span>
        </button>

        {onExportEX1 && (
          <button
            type="button"
            className="precision-diemdanh__gridBtn precision-diemdanh__gridBtn--excel"
            onClick={onExportEX1}
            title={`Xuất ${filteredCount} nhân sự đang hiển thị/lọc ra Excel`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
              description
            </span>
            <span>EX1</span>
            <span className="badge">Đang lọc</span>
          </button>
        )}

        {onExportEX2 && (
          <button
            type="button"
            className="precision-diemdanh__gridBtn precision-diemdanh__gridBtn--excel"
            onClick={onExportEX2}
            title={`Xuất toàn bộ ${totalCount} nhân sự ra Excel`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
              file_download
            </span>
            <span>EX2</span>
            <span className="badge">Tất cả</span>
          </button>
        )}

        {onOpenPivot && (
          <button
            type="button"
            className="precision-diemdanh__gridBtn precision-diemdanh__gridBtn--pivot"
            onClick={onOpenPivot}
            title="Xem bảng phân tích tổng hợp Pivot theo tổ, ca và chức danh"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
              pivot_table_chart
            </span>
            <span>PIVOT</span>
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
