import React from "react";
import { FiFilter, FiRefreshCw, FiCheck, FiX } from "react-icons/fi";
import { CustomerListData } from "../../../kinhdoanh/interfaces/kdInterface";
import { VendorAutocomplete } from "./VendorAutocomplete";

interface PrecisionFailingMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customerList: CustomerListData[];
  cust_cd: string;
  setCust_Cd: (v: string) => void;
  cmsvcheck: boolean;
  setCMSVCheck: React.Dispatch<React.SetStateAction<boolean>>;
  onlyPending: boolean;
  setOnlyPending: React.Dispatch<React.SetStateAction<boolean>>;
  ncrId: number;
  setNCRID: (v: number) => void;
  onApply: () => void;
  onReset: () => void;
}

export const PrecisionFailingMobileFilterDrawer: React.FC<PrecisionFailingMobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  customerList,
  cust_cd,
  setCust_Cd,
  cmsvcheck,
  setCMSVCheck,
  onlyPending,
  setOnlyPending,
  ncrId,
  setNCRID,
  onApply,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="precision-failing-filter-drawer-backdrop" onClick={onClose}>
      <div
        className="precision-failing-filter-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="filter-drawer-header">
          <div className="drawer-title">
            <FiFilter className="title-icon" />
            <span>BỘ LỌC TRA CỨU FAILING</span>
          </div>
          <button
            type="button"
            className="btn-close-drawer"
            onClick={onClose}
            title="Đóng bộ lọc"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="filter-drawer-body">
          {/* Nhóm 1: Nhà cung cấp */}
          <div className="filter-group">
            <label className="filter-label">Nhà Cung Cấp</label>
            <VendorAutocomplete
              customerList={customerList}
              cust_cd={cust_cd}
              setCust_Cd={setCust_Cd}
              disabled={cmsvcheck}
              isMobile
            />
          </div>

          {/* Toggle CMSV */}
          <div className="filter-checkbox-card">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={cmsvcheck}
                onChange={(e) => {
                  const checked = e.target.checked;
                  if (checked) setCust_Cd("6969");
                  setCMSVCheck(checked);
                }}
              />
              <span className="checkbox-label">
                <strong>CMSV Mặc Định</strong> (Mã nhà máy 6969)
              </span>
            </label>
          </div>

          {/* Toggle Lô PENDING */}
          <div className="filter-checkbox-card">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={onlyPending}
                onChange={(e) => setOnlyPending(e.target.checked)}
              />
              <span className="checkbox-label">
                <strong>Chỉ Lọc Lô PENDING</strong> (Ẩn các lô đã hoàn tất)
              </span>
            </label>
          </div>

          {/* Nhóm 2: NCR ID */}
          <div className="filter-group">
            <label className="filter-label">NCR ID</label>
            <input
              type="number"
              className="filter-input font-mono font-bold text-rose-600"
              placeholder="0 (Tất cả NCR)"
              value={ncrId}
              onChange={(e) => setNCRID(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="filter-drawer-footer">
          <button
            type="button"
            className="btn-drawer-reset"
            onClick={onReset}
          >
            <FiRefreshCw size={13} />
            <span>Đặt Lại</span>
          </button>

          <button
            type="button"
            className="btn-drawer-apply"
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

export default PrecisionFailingMobileFilterDrawer;
