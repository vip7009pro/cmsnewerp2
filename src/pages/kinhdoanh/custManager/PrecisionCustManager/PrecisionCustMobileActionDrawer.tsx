import React from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiDownload,
  FiEdit3,
  FiFileText,
  FiPieChart,
  FiPlus,
  FiRefreshCw,
  FiUser,
  FiX,
  FiZap,
} from "react-icons/fi";
import { CUST_INFO } from "../../interfaces/kdInterface";

interface PrecisionCustMobileActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCustomer: CUST_INFO;
  onAddNew: () => void;
  onEditSelected: () => void;
  onRefresh: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
}

const PrecisionCustMobileActionDrawer: React.FC<PrecisionCustMobileActionDrawerProps> = ({
  isOpen,
  onClose,
  selectedCustomer,
  onAddNew,
  onEditSelected,
  onRefresh,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
}) => {
  if (!isOpen) return null;

  const handleAction = (callback: () => void) => {
    callback();
    onClose();
  };

  const hasSelected = Boolean(selectedCustomer?.CUST_CD);
  const isKH = (selectedCustomer?.CUST_TYPE || "").trim().toUpperCase() === "KH";

  return (
    <div
      className="cust-mobile-drawer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="cust-mobile-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <span className="drawer-icon">
              <FiZap size={16} />
            </span>
            <span>TÁC VỤ ĐỐI TÁC ERP (MOBILE)</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Đóng menu tác vụ"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Selected Customer Banner */}
        <div className={`drawer-cust-chip ${hasSelected ? "has-data" : "no-data"}`}>
          {hasSelected ? (
            <>
              <div className="chip-left">
                <span className="type-badge">
                  {isKH ? "🏢 KHÁCH HÀNG" : "🏭 NHÀ CUNG CẤP"}
                </span>
                <span className="cust-code">{selectedCustomer.CUST_CD}</span>
                <span className="cust-name">
                  {selectedCustomer.CUST_NAME_KD || selectedCustomer.CUST_NAME}
                </span>
              </div>
              <div className="chip-right">
                <span
                  className={`status-pill ${
                    selectedCustomer.USE_YN === "Y" ? "status-use" : "status-off"
                  }`}
                >
                  {selectedCustomer.USE_YN === "Y" ? "ĐANG GD" : "TẠM NGƯNG"}
                </span>
              </div>
            </>
          ) : (
            <div className="empty-hint">
              <FiAlertCircle size={15} />
              <span>Chưa click chọn dòng nào trên bảng để sửa</span>
            </div>
          )}
        </div>

        {/* Drawer Body Actions */}
        <div className="drawer-body">
          {/* Nhóm 1: Quản Trị Hồ Sơ */}
          <div className="drawer-section">
            <div className="section-title">
              <FiUser size={13} />
              <span>1. QUẢN TRỊ HỒ SƠ ĐỐI TÁC</span>
            </div>
            <div className="action-grid">
              <button
                type="button"
                className="drawer-action-btn drawer-action-btn--primary"
                onClick={() => handleAction(onAddNew)}
              >
                <div className="btn-icon">
                  <FiPlus size={18} />
                </div>
                <div className="btn-text">
                  <span className="main-label">Thêm Mới Đối Tác</span>
                  <span className="sub-label">Tạo mã KH / NCC tự động</span>
                </div>
              </button>

              <button
                type="button"
                className={`drawer-action-btn drawer-action-btn--edit ${
                  !hasSelected ? "disabled" : ""
                }`}
                onClick={() => {
                  if (hasSelected) handleAction(onEditSelected);
                }}
                disabled={!hasSelected}
              >
                <div className="btn-icon">
                  <FiEdit3 size={18} />
                </div>
                <div className="btn-text">
                  <span className="main-label">Sửa Hồ Sơ Đang Chọn</span>
                  <span className="sub-label">
                    {hasSelected
                      ? `Cập nhật thông tin [${selectedCustomer.CUST_CD}]`
                      : "Click chọn 1 dòng trên bảng trước"}
                  </span>
                </div>
              </button>

              <button
                type="button"
                className="drawer-action-btn drawer-action-btn--refresh"
                onClick={() => handleAction(onRefresh)}
              >
                <div className="btn-icon">
                  <FiRefreshCw size={18} />
                </div>
                <div className="btn-text">
                  <span className="main-label">Tải Lại Dữ Liệu</span>
                  <span className="sub-label">Đồng bộ lại từ máy chủ ERP</span>
                </div>
              </button>
            </div>
          </div>

          {/* Nhóm 2: Báo Cáo & Phân Tích */}
          <div className="drawer-section">
            <div className="section-title">
              <FiFileText size={13} />
              <span>2. XUẤT BÁO CÁO & PHÂN TÍCH</span>
            </div>
            <div className="action-grid">
              <button
                type="button"
                className="drawer-action-btn drawer-action-btn--excel"
                onClick={() => handleAction(onExportEX1)}
              >
                <div className="btn-icon">
                  <FiFileText size={18} />
                </div>
                <div className="btn-text">
                  <span className="main-label">Xuất Excel (Đang Lọc)</span>
                  <span className="sub-label">Tải danh sách theo kết quả lọc</span>
                </div>
              </button>

              <button
                type="button"
                className="drawer-action-btn drawer-action-btn--excel"
                onClick={() => handleAction(onExportEX2)}
              >
                <div className="btn-icon">
                  <FiDownload size={18} />
                </div>
                <div className="btn-text">
                  <span className="main-label">Xuất Excel (Toàn Bộ)</span>
                  <span className="sub-label">Tải toàn bộ cơ sở dữ liệu đối tác</span>
                </div>
              </button>

              <button
                type="button"
                className="drawer-action-btn drawer-action-btn--pivot"
                onClick={() => handleAction(onOpenPivot)}
              >
                <div className="btn-icon">
                  <FiPieChart size={18} />
                </div>
                <div className="btn-text">
                  <span className="main-label">Phân Tích Báo Cáo Pivot</span>
                  <span className="sub-label">Biểu đồ & bảng ma trận đa chiều</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <button
            type="button"
            className="drawer-close-action"
            onClick={onClose}
          >
            Đóng bảng tác vụ
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCustMobileActionDrawer);
