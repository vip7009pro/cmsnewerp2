import React, { useCallback } from "react";
import moment from "moment";
import {
  FiX,
  FiRotateCcw,
  FiCheck,
  FiCalendar,
  FiTag,
  FiSliders,
} from "react-icons/fi";

interface PrecisionMainDefectsMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fromDate: string;
  toDate: string;
  allTime: boolean;
  codeKD: string;
  codeCMS: string;
  prodModel: string;
  processNumber: string;
  processOptions: number[];
  useYn: string;
  imageYn: string;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onAllTimeChange: (val: boolean) => void;
  onCodeKDChange: (val: string) => void;
  onCodeCMSChange: (val: string) => void;
  onProdModelChange: (val: string) => void;
  onProcessNumberChange: (val: string) => void;
  onUseYnChange: (val: string) => void;
  onImageYnChange: (val: string) => void;
  onApply: () => void;
  onReset: () => void;
}

const PrecisionMainDefectsMobileFilterDrawer: React.FC<PrecisionMainDefectsMobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  fromDate,
  toDate,
  allTime,
  codeKD,
  codeCMS,
  prodModel,
  processNumber,
  processOptions,
  useYn,
  imageYn,
  onFromDateChange,
  onToDateChange,
  onAllTimeChange,
  onCodeKDChange,
  onCodeCMSChange,
  onProdModelChange,
  onProcessNumberChange,
  onUseYnChange,
  onImageYnChange,
  onApply,
  onReset,
}) => {
  const handleQuickDays = useCallback(
    (days: number) => {
      onAllTimeChange(false);
      onFromDateChange(moment().subtract(days, "days").format("YYYY-MM-DD"));
      onToDateChange(moment().format("YYYY-MM-DD"));
    },
    [onAllTimeChange, onFromDateChange, onToDateChange]
  );

  if (!isOpen) return null;

  return (
    <div className="precision-maindefects__filterDrawerBackdrop" onClick={onClose}>
      <div
        className="precision-maindefects__filterDrawerPanel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thanh kéo handle indicator */}
        <div className="drawer-drag-handle" />

        {/* Header Drawer */}
        <div className="drawer-header">
          <div className="title-area">
            <span className="drawer-title">BỘ LỌC NÂNG CAO TIÊU CHUẨN LỖI</span>
            <span className="drawer-subtitle">Tùy biến điều kiện trích xuất và phân tích</span>
          </div>
          <button
            type="button"
            className="btn-drawer-close"
            onClick={onClose}
            title="Đóng bộ lọc"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Nội dung lọc cuộn mượt mà */}
        <div className="drawer-body">
          {/* Nhóm 1: Khoảng thời gian */}
          <div className="filter-section">
            <div className="section-label">
              <FiCalendar size={13} />
              <span>Khoảng Thời Gian Thiết Lập</span>
            </div>

            <div className="time-quick-row">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={allTime}
                  onChange={(e) => onAllTimeChange(e.target.checked)}
                />
                <span>Không giới hạn (All Time)</span>
              </label>

              <div className="quick-buttons">
                <button
                  type="button"
                  className="quick-btn"
                  onClick={() => handleQuickDays(0)}
                >
                  1D
                </button>
                <button
                  type="button"
                  className="quick-btn"
                  onClick={() => handleQuickDays(7)}
                >
                  7D
                </button>
                <button
                  type="button"
                  className="quick-btn"
                  onClick={() => handleQuickDays(30)}
                >
                  30D
                </button>
                <button
                  type="button"
                  className="quick-btn"
                  onClick={() => handleQuickDays(90)}
                >
                  90D
                </button>
              </div>
            </div>

            <div className="date-inputs-grid">
              <div className="input-group">
                <span className="field-title">Từ Ngày</span>
                <input
                  type="date"
                  className="date-field"
                  disabled={allTime}
                  value={fromDate}
                  onChange={(e) => onFromDateChange(e.target.value)}
                />
              </div>
              <div className="input-group">
                <span className="field-title">Đến Ngày</span>
                <input
                  type="date"
                  className="date-field"
                  disabled={allTime}
                  value={toDate}
                  onChange={(e) => onToDateChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Nhóm 2: Mã Hàng & Model Sản Phẩm */}
          <div className="filter-section">
            <div className="section-label">
              <FiTag size={13} />
              <span>Mã Hàng & Model Sản Phẩm</span>
            </div>

            <div className="text-inputs-grid">
              <div className="input-group">
                <span className="field-title">Mã KD (Code KD / Tên Lỗi)</span>
                <input
                  type="text"
                  className="text-field"
                  placeholder="Ví dụ: GH63-..."
                  value={codeKD}
                  onChange={(e) => onCodeKDChange(e.target.value)}
                />
              </div>

              <div className="input-group">
                <span className="field-title">Mã ERP (G_CODE)</span>
                <input
                  type="text"
                  className="text-field"
                  placeholder="Ví dụ: 7C123..."
                  value={codeCMS}
                  onChange={(e) => onCodeCMSChange(e.target.value)}
                />
              </div>

              <div className="input-group">
                <span className="field-title">Model Sản Phẩm</span>
                <input
                  type="text"
                  className="text-field"
                  placeholder="Ví dụ: B6, Q6..."
                  value={prodModel}
                  onChange={(e) => onProdModelChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Nhóm 3: Công Đoạn, Áp Dụng & Hình Ảnh */}
          <div className="filter-section">
            <div className="section-label">
              <FiSliders size={13} />
              <span>Công Đoạn & Trạng Thái Áp Dụng</span>
            </div>

            <div className="selects-grid">
              <div className="input-group">
                <span className="field-title">Công Đoạn Sản Xuất</span>
                <select
                  className="select-field"
                  value={processNumber}
                  onChange={(e) => onProcessNumberChange(e.target.value)}
                >
                  <option value="All">Tất Cả Công Đoạn</option>
                  {processOptions.map((p) => (
                    <option key={p} value={String(p)}>
                      Công Đoạn {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <span className="field-title">Trạng Thái Hiệu Lực (USE_YN)</span>
                <select
                  className="select-field"
                  value={useYn}
                  onChange={(e) => onUseYnChange(e.target.value)}
                >
                  <option value="All">Tất Cả Trạng Thái</option>
                  <option value="Y">Đang Áp Dụng (Y)</option>
                  <option value="N">Tạm Dừng (N)</option>
                </select>
              </div>

              <div className="input-group">
                <span className="field-title">Thư Viện Hình Ảnh</span>
                <select
                  className="select-field"
                  value={imageYn}
                  onChange={(e) => onImageYnChange(e.target.value)}
                >
                  <option value="All">Tất Cả Tiêu Chuẩn</option>
                  <option value="YES">Chỉ Lấy Có Hình Ảnh</option>
                  <option value="NO">Chỉ Lấy Chưa Có Ảnh</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-reset"
            onClick={onReset}
          >
            <FiRotateCcw size={13} />
            <span>Mặc Định</span>
          </button>

          <button
            type="button"
            className="btn-apply"
            onClick={() => {
              onApply();
              onClose();
            }}
          >
            <FiCheck size={14} />
            <span>Áp Dụng Lọc</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionMainDefectsMobileFilterDrawer);
