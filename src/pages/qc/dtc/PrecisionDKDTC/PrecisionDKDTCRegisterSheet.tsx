// PrecisionDKDTCRegisterSheet.tsx - Bottom Sheet đăng ký test ĐTC cho Mobile (Zero-Blur)
// Chứa nguyên vẹn form đăng ký (Phiếu Đăng Ký Test) để giải phóng không gian bảng dữ liệu trên mobile.

import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { TestListTable, CheckAddedSPECDATA } from "../../interfaces/qcInterface";
import PrecisionDKDTCSidebar from "./PrecisionDKDTCSidebar";

interface PrecisionDKDTCRegisterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  checkNVL: boolean;
  setCheckNVL: (val: boolean) => void;
  testtype: string;
  setTestType: (val: string) => void;
  inputno: string;
  setInputNo: (val: string) => void;
  lotncc: string;
  setLotNCC: (val: string) => void;
  request_empl: string;
  setRequestEmpl: (val: string) => void;
  empl_name: string;
  g_name: string;
  m_name: string;
  testList: TestListTable[];
  addedSpec: CheckAddedSPECDATA[];
  showdkbs: boolean;
  setShowDKBS: (val: boolean) => void;
  oldDTC_ID: number;
  setOldDTC_ID: (val: number) => void;
  remark: string;
  setRemark: (val: string) => void;
  onOpenScanner: (target: "inputno" | "lotncc") => void;
  onToggleTestItem: (testCode: number) => void;
  onSelectAllTests: (select: boolean) => void;
  onRegister: () => void;
  checkEMPL_NAME: (val: string) => void;
}

const PrecisionDKDTCRegisterSheet: React.FC<PrecisionDKDTCRegisterSheetProps> = ({
  isOpen,
  onClose,
  ...sidebarProps
}) => {
  const handleRegister = () => {
    // Đóng sheet trước để người dùng thấy ngay thông báo kết quả (Swal) và bảng nạp lại
    onClose();
    sidebarProps.onRegister();
  };

  if (!isOpen) return null;

  return (
    <div
      className="precision-dkdtc-drawer-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="precision-dkdtc-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Phiếu đăng ký test ĐTC"
      >
        <div className="drawer-header">
          <span className="drawer-title">PHIẾU ĐĂNG KÝ TEST ĐTC</span>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            title="Đóng phiếu đăng ký"
          >
            <IoCloseOutline size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {/* Tái sử dụng nguyên vẹn sidebar desktop (giữ 100% logic, state, validation) */}
          <PrecisionDKDTCSidebar
            {...sidebarProps}
            onRegister={handleRegister}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDKDTCRegisterSheet);
