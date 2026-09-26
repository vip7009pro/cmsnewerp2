import React from "react";
import {
  FiFilter,
  FiX,
  FiRotateCcw,
  FiSearch,
  FiCalendar,
  FiFileText,
  FiBox,
  FiTag,
  FiClock,
} from "react-icons/fi";

interface PrecisionLichSuInputLieuMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fromDate: string;
  toDate: string;
  allTime: boolean;
  prodRequestNo: string;
  planId: string;
  codeCMS: string;
  codeKD: string;
  mName: string;
  mCode: string;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onAllTimeChange: (val: boolean) => void;
  onProdRequestNoChange: (val: string) => void;
  onPlanIdChange: (val: string) => void;
  onCodeCMSChange: (val: string) => void;
  onCodeKDChange: (val: string) => void;
  onMNameChange: (val: string) => void;
  onMCodeChange: (val: string) => void;
  onApply: () => void;
  onReset: () => void;
}

const PrecisionLichSuInputLieuMobileFilterDrawer: React.FC<
  PrecisionLichSuInputLieuMobileFilterDrawerProps
> = ({
  isOpen,
  onClose,
  fromDate,
  toDate,
  allTime,
  prodRequestNo,
  planId,
  codeCMS,
  codeKD,
  mName,
  mCode,
  onFromDateChange,
  onToDateChange,
  onAllTimeChange,
  onProdRequestNoChange,
  onPlanIdChange,
  onCodeCMSChange,
  onCodeKDChange,
  onMNameChange,
  onMCodeChange,
  onApply,
  onReset,
}) => {
  if (!isOpen) return null;

  const handleApplyClick = () => {
    onApply();
    onClose();
  };

  const handleResetClick = () => {
    onReset();
  };

  return (
    <div
      className="precision-inputlieu-mobile-drawer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="precision-inputlieu-mobile-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FiFilter size={18} color="#2563eb" />
            <span>BỘ LỌC LỊCH SỬ CẤP LIỆU</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Đóng"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {/* Nhóm 1: Thời Gian Tra Cứu */}
          <div className="filter-group">
            <span className="group-title">
              <FiCalendar size={13} color="#2563eb" />
              <span>Thời Gian Tra Cứu</span>
            </span>

            <div className="grid-2col">
              <div className="field-item">
                <label>Từ ngày:</label>
                <input
                  type="date"
                  className="mobile-drawer-input"
                  value={fromDate.slice(0, 10)}
                  disabled={allTime}
                  onChange={(e) => onFromDateChange(e.target.value)}
                />
              </div>

              <div className="field-item">
                <label>Tới ngày:</label>
                <input
                  type="date"
                  className="mobile-drawer-input"
                  value={toDate.slice(0, 10)}
                  disabled={allTime}
                  onChange={(e) => onToDateChange(e.target.value)}
                />
              </div>
            </div>

            {/* Checkbox All Time */}
            <label className="mobile-drawer-checkbox">
              <input
                type="checkbox"
                checked={allTime}
                onChange={(e) => onAllTimeChange(e.target.checked)}
              />
              <span className="checkbox-text">
                <FiClock size={12} color="#2563eb" />
                <span>All Time (Tra cứu toàn bộ thời gian)</span>
              </span>
            </label>
          </div>

          {/* Nhóm 2: Lệnh & Chỉ Thị Sản Xuất */}
          <div className="filter-group">
            <span className="group-title">
              <FiFileText size={13} color="#059669" />
              <span>Lệnh & Chỉ Thị Sản Xuất</span>
            </span>

            <div className="grid-2col">
              <div className="field-item">
                <label>Số YCSX:</label>
                <input
                  type="text"
                  className="mobile-drawer-input"
                  placeholder="VD: 1F80008..."
                  value={prodRequestNo}
                  onChange={(e) => onProdRequestNoChange(e.target.value)}
                />
              </div>

              <div className="field-item">
                <label>Số PLAN ID:</label>
                <input
                  type="text"
                  className="mobile-drawer-input"
                  placeholder="VD: A123456..."
                  value={planId}
                  onChange={(e) => onPlanIdChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Nhóm 3: Chi Tiết Sản Phẩm & Liệu */}
          <div className="filter-group">
            <span className="group-title">
              <FiBox size={13} color="#ea580c" />
              <span>Sản Phẩm & Liệu Sản Xuất</span>
            </span>

            <div className="grid-2col">
              <div className="field-item">
                <label>Code ERP (G_CODE):</label>
                <input
                  type="text"
                  className="mobile-drawer-input"
                  placeholder="VD: 7C123xxx"
                  value={codeCMS}
                  onChange={(e) => onCodeCMSChange(e.target.value)}
                />
              </div>

              <div className="field-item">
                <label>Code KD (G_NAME):</label>
                <input
                  type="text"
                  className="mobile-drawer-input"
                  placeholder="VD: GH63-xxxxxx"
                  value={codeKD}
                  onChange={(e) => onCodeKDChange(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2col">
              <div className="field-item">
                <label>Tên Liệu (M_NAME):</label>
                <input
                  type="text"
                  className="mobile-drawer-input"
                  placeholder="VD: SJ-203020HC..."
                  value={mName}
                  onChange={(e) => onMNameChange(e.target.value)}
                />
              </div>

              <div className="field-item">
                <label>Mã Liệu (M_CODE):</label>
                <input
                  type="text"
                  className="mobile-drawer-input"
                  placeholder="VD: A123456"
                  value={mCode}
                  onChange={(e) => onMCodeChange(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-drawer-reset"
            onClick={handleResetClick}
          >
            <FiRotateCcw size={14} />
            <span>Đặt lại</span>
          </button>

          <button
            type="button"
            className="btn-drawer-apply"
            onClick={handleApplyClick}
          >
            <FiSearch size={15} />
            <span>Áp dụng & Tra cứu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionLichSuInputLieuMobileFilterDrawer);
