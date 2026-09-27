import React from "react";
import {
  FiDownload,
  FiUpload,
  FiZap,
  FiX,
  FiPlus,
  FiSave,
  FiSend,
  FiCheckCircle,
  FiXCircle,
  FiCheckSquare,
  FiRefreshCw,
  FiLock,
  FiClock,
  FiFileText,
} from "react-icons/fi";
import { PrecisionFailingFormIn } from "./PrecisionFailingFormIn";
import { PrecisionFailingFormOut } from "./PrecisionFailingFormOut";

interface PrecisionFailingMobileActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  actionTab: "IN" | "OUT" | "ACTIONS";
  setActionTab: (t: "IN" | "OUT" | "ACTIONS") => void;
  // Form IN props
  testtype: string;
  setTestType: (v: string) => void;
  planId: string;
  setPlanId: (v: string) => void;
  g_name: string;
  m_lot_no: string;
  setM_LOT_NO: (v: string) => void;
  process_lot_no: string;
  setProcessLotNo: (v: string) => void;
  vendorLot: string;
  setVendorLot: (v: string) => void;
  m_name: string;
  defect_phenomenon: string;
  setDefectPhenomenon: (v: string) => void;
  request_empl: string;
  setrequest_empl: (v: string) => void;
  request_empl2: string;
  setrequest_empl2: (v: string) => void;
  empl_name: string;
  empl_name2: string;
  remark: string;
  setReMark: (v: string) => void;
  checkPlanID: (id: string) => void;
  checkPQC3_ID: (id: string) => void;
  checkLotNVL: (lot: string) => void;
  checkLotProcess: (lot: string) => void;
  checkEMPL_NAME: (sel: number, no: string) => void;
  onLotKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAddRow: () => void;
  onSaveData: () => void;
  onOutputFail: () => void;
  // Toolbar actions
  onNewFailing: () => void;
  onSetPass: (val: "Y" | "N") => void;
  onSetClose: (val: "C" | "P") => void;
  onConfirm: () => void;
  onUpdateNCR: () => void;
  onExportExcel: (type: "EX1" | "EX2") => void;
  selectedCount: number;
}

export const PrecisionFailingMobileActionDrawer: React.FC<PrecisionFailingMobileActionDrawerProps> = (props) => {
  const {
    isOpen,
    onClose,
    actionTab,
    setActionTab,
    onAddRow,
    onSaveData,
    onOutputFail,
    onNewFailing,
    onSetPass,
    onSetClose,
    onConfirm,
    onUpdateNCR,
    onExportExcel,
    selectedCount,
  } = props;

  if (!isOpen) return null;

  return (
    <div className="precision-failing-action-drawer-backdrop" onClick={onClose}>
      <div
        className="precision-failing-action-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header with Tab Switcher */}
        <div className="action-drawer-header">
          <div className="drawer-tabs">
            <button
              type="button"
              className={`drawer-tab ${actionTab === "IN" ? "is-active" : ""}`}
              onClick={() => setActionTab("IN")}
            >
              <FiDownload size={13} />
              <span>Nhập (IN)</span>
            </button>

            <button
              type="button"
              className={`drawer-tab ${actionTab === "OUT" ? "is-active is-active--out" : ""}`}
              onClick={() => setActionTab("OUT")}
            >
              <FiUpload size={13} />
              <span>Xuất (OUT)</span>
            </button>

            <button
              type="button"
              className={`drawer-tab ${actionTab === "ACTIONS" ? "is-active is-active--actions" : ""}`}
              onClick={() => setActionTab("ACTIONS")}
            >
              <FiZap size={13} />
              <span>Thao Tác ({selectedCount})</span>
            </button>
          </div>

          <button
            type="button"
            className="btn-close-action-drawer"
            onClick={onClose}
            title="Đóng bảng thao tác"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="action-drawer-body">
          {/* TAB 1: FORM IN */}
          {actionTab === "IN" && (
            <div className="action-form-container">
              <PrecisionFailingFormIn {...props} />
              <div className="action-btn-row">
                <button
                  type="button"
                  className="btn-drawer-action btn-drawer-action--add"
                  onClick={onAddRow}
                >
                  <FiPlus size={14} />
                  <span>THÊM DÒNG (ADD)</span>
                </button>
                <button
                  type="button"
                  className="btn-drawer-action btn-drawer-action--save"
                  onClick={onSaveData}
                >
                  <FiSave size={14} />
                  <span>LƯU DỮ LIỆU (SAVE)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FORM OUT */}
          {actionTab === "OUT" && (
            <div className="action-form-container">
              <PrecisionFailingFormOut {...props} />
              <button
                type="button"
                className="btn-drawer-action btn-drawer-action--out w-full"
                onClick={onOutputFail}
              >
                <FiSend size={14} />
                <span>XUẤT KHO LIỆU FAILING</span>
              </button>
            </div>
          )}

          {/* TAB 3: THAO TÁC NHANH */}
          {actionTab === "ACTIONS" && (
            <div className="quick-actions-panel">
              <div className="selection-notice">
                {selectedCount > 0 ? (
                  <span>Đang chọn <strong>{selectedCount}</strong> dòng trên bảng để thao tác:</span>
                ) : (
                  <span className="text-amber-600">Chưa chọn dòng nào (Hãy chạm vào dòng trên bảng trước khi duyệt)</span>
                )}
              </div>

              <div className="actions-grid">
                <button
                  type="button"
                  className="action-tile action-tile--pass"
                  onClick={() => {
                    onSetPass("Y");
                    onClose();
                  }}
                >
                  <FiCheckCircle size={18} />
                  <div className="tile-text">
                    <span className="tile-title">SET PASS</span>
                    <span className="tile-desc">Phê duyệt ĐẠT cho lô lỗi</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="action-tile action-tile--fail"
                  onClick={() => {
                    onSetPass("N");
                    onClose();
                  }}
                >
                  <FiXCircle size={18} />
                  <div className="tile-text">
                    <span className="tile-title">SET FAIL</span>
                    <span className="tile-desc">Phê duyệt KHÔNG ĐẠT</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="action-tile action-tile--confirm"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                >
                  <FiCheckSquare size={18} />
                  <div className="tile-text">
                    <span className="tile-title">IQC CONFIRM</span>
                    <span className="tile-desc">IQC xác nhận tiếp nhận</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="action-tile action-tile--ncr"
                  onClick={() => {
                    onUpdateNCR();
                    onClose();
                  }}
                >
                  <FiRefreshCw size={18} />
                  <div className="tile-text">
                    <span className="tile-title">UPDATE NCR ID</span>
                    <span className="tile-desc">Cập nhật mã NCR xử lý</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="action-tile action-tile--closed"
                  onClick={() => {
                    onSetClose("C");
                    onClose();
                  }}
                >
                  <FiLock size={18} />
                  <div className="tile-text">
                    <span className="tile-title">SET CLOSED</span>
                    <span className="tile-desc">Đóng phiên xử lý lô</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="action-tile action-tile--pending"
                  onClick={() => {
                    onSetClose("P");
                    onClose();
                  }}
                >
                  <FiClock size={18} />
                  <div className="tile-text">
                    <span className="tile-title">SET PENDING</span>
                    <span className="tile-desc">Mở lại chờ xử lý</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="action-tile action-tile--new"
                  onClick={() => {
                    onNewFailing();
                    setActionTab("IN");
                  }}
                >
                  <FiPlus size={18} />
                  <div className="tile-text">
                    <span className="tile-title">NEW FAILING</span>
                    <span className="tile-desc">Tạo phiên nhập mới</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="action-tile action-tile--excel"
                  onClick={() => {
                    onExportExcel("EX1");
                    onClose();
                  }}
                >
                  <FiFileText size={18} />
                  <div className="tile-text">
                    <span className="tile-title">XUẤT EXCEL 1</span>
                    <span className="tile-desc">Xuất dữ liệu đang lọc/chọn</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="action-tile action-tile--excel"
                  onClick={() => {
                    onExportExcel("EX2");
                    onClose();
                  }}
                >
                  <FiFileText size={18} />
                  <div className="tile-text">
                    <span className="tile-title">XUẤT EXCEL 2</span>
                    <span className="tile-desc">Xuất toàn bộ bảng dữ liệu</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrecisionFailingMobileActionDrawer;
