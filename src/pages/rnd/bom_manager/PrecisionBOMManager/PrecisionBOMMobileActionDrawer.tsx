import React from "react";
import {
  AiFillDelete,
  AiFillFileAdd,
  AiOutlineCloudUpload,
  AiOutlineFileAdd,
  AiOutlinePushpin,
  AiOutlineClose,
} from "react-icons/ai";
import { BiReset } from "react-icons/bi";
import { FaDraftingCompass, FaFilePdf, FaPrint } from "react-icons/fa";
import { MdEditNote, MdOutlineUpdate, MdUpgrade, MdTableChart, MdFileDownload, MdAnalytics } from "react-icons/md";
import { CODE_FULL_INFO } from "../../interfaces/rndInterface";

interface PrecisionBOMMobileActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  codeFullInfo: CODE_FULL_INFO;
  enableEdit: boolean;
  pinBOM: boolean;
  onNew: () => void;
  onAdd: () => void;
  onAddVer: () => void;
  onOpenBulkUpload: () => void;
  onUpdate: () => void;
  onClear: () => void;
  onResetBanVe: () => void;
  onToggleEdit: () => void;
  onTogglePin: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  onToggleDesignBom: () => void;
  onToggleTemLot: () => void;
}

const PrecisionBOMMobileActionDrawer: React.FC<PrecisionBOMMobileActionDrawerProps> = ({
  isOpen,
  onClose,
  codeFullInfo,
  enableEdit,
  pinBOM,
  onNew,
  onAdd,
  onAddVer,
  onOpenBulkUpload,
  onUpdate,
  onClear,
  onResetBanVe,
  onToggleEdit,
  onTogglePin,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  onToggleDesignBom,
  onToggleTemLot,
}) => {
  if (!isOpen) return null;

  const handleAction = (callback: () => void) => {
    callback();
    onClose();
  };

  return (
    <div className="bom-mobile-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bom-mobile-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <span className="drawer-icon">⚡</span>
            <span>BẢNG ĐIỀU KHIỂN & TÁC VỤ BOM</span>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Đóng menu">
            <AiOutlineClose size={18} />
          </button>
        </div>

        {/* Selected Code Overview */}
        {codeFullInfo?.G_CODE && (
          <div className="drawer-code-chip">
            <span className="code-label">MÃ ĐANG CHỌN:</span>
            <span className="code-val">{codeFullInfo.G_CODE}</span>
            <span className="rev-val">Rev.{codeFullInfo.REV_NO || "A"}</span>
          </div>
        )}

        {/* Drawer Content */}
        <div className="drawer-body">
          {/* Group 1: Tác Vụ Mã Sản Phẩm */}
          <div className="drawer-section">
            <div className="section-title">1. TÁC VỤ MÃ SẢN PHẨM</div>
            <div className="action-grid">
              <button
                type="button"
                className="drawer-action-btn drawer-action-btn--new"
                onClick={() => handleAction(onNew)}
              >
                <AiOutlineFileAdd size={16} />
                <span>Tạo Mới (NEW)</span>
              </button>

              <button
                type="button"
                className="drawer-action-btn drawer-action-btn--add"
                onClick={() => handleAction(onAdd)}
              >
                <AiFillFileAdd size={16} />
                <span>Lưu Mã Mới (ADD)</span>
              </button>

              <button
                type="button"
                className="drawer-action-btn drawer-action-btn--addver"
                onClick={() => handleAction(onAddVer)}
              >
                <MdUpgrade size={16} />
                <span>Thêm Rev (ADD VER)</span>
              </button>

              <button
                type="button"
                className="drawer-action-btn drawer-action-btn--update"
                onClick={() => handleAction(onUpdate)}
              >
                <MdOutlineUpdate size={16} />
                <span>Cập Nhật (UPDATE)</span>
              </button>

              <button
                type="button"
                className="drawer-action-btn drawer-action-btn--bulk"
                onClick={() => handleAction(onOpenBulkUpload)}
              >
                <AiOutlineCloudUpload size={16} />
                <span>Upload Excel Hàng Loạt</span>
              </button>

              <button
                type="button"
                className="drawer-action-btn drawer-action-btn--clear"
                onClick={() => handleAction(onClear)}
              >
                <AiFillDelete size={16} />
                <span>Xóa Trắng Form (Clear)</span>
              </button>

              <button
                type="button"
                className="drawer-action-btn drawer-action-btn--reset"
                onClick={() => handleAction(onResetBanVe)}
              >
                <BiReset size={16} />
                <span>Reset Bản Vẽ</span>
              </button>
            </div>
          </div>

          {/* Group 2: Chế Độ & Bản Vẽ */}
          <div className="drawer-section">
            <div className="section-title">2. CÔNG CỤ & BẢN VẼ</div>
            <div className="action-grid">
              <button
                type="button"
                className={`drawer-action-btn ${enableEdit ? "drawer-action-btn--active" : ""}`}
                onClick={() => handleAction(onToggleEdit)}
              >
                <MdEditNote size={16} />
                <span>{enableEdit ? "Tắt Sửa Lưới" : "Bật Sửa Lưới"}</span>
              </button>

              <button
                type="button"
                className={`drawer-action-btn ${pinBOM ? "drawer-action-btn--active" : ""}`}
                onClick={() => handleAction(onTogglePin)}
              >
                <AiOutlinePushpin size={16} />
                <span>{pinBOM ? "Bỏ Ghim BOM" : "Ghim BOM"}</span>
              </button>

              <button
                type="button"
                className="drawer-action-btn drawer-action-btn--design"
                onClick={() => handleAction(onToggleDesignBom)}
              >
                <FaDraftingCompass size={15} />
                <span>Design BOM</span>
              </button>

              <button
                type="button"
                className="drawer-action-btn drawer-action-btn--tem"
                onClick={() => handleAction(onToggleTemLot)}
              >
                <FaPrint size={15} />
                <span>In Tem LOT</span>
              </button>

              {codeFullInfo?.G_CODE ? (
                <a
                  className="drawer-action-btn drawer-action-btn--pdf"
                  href={`/banve/${codeFullInfo.G_CODE}.pdf?v=${Date.now()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                >
                  <FaFilePdf size={15} />
                  <span>Xem Bản Vẽ PDF</span>
                </a>
              ) : (
                <div className="drawer-action-btn drawer-action-btn--disabled">
                  <FaFilePdf size={15} />
                  <span>Chưa có bản vẽ</span>
                </div>
              )}
            </div>
          </div>

          {/* Group 3: Xuất Dữ Liệu & Phân Tích */}
          <div className="drawer-section">
            <div className="section-title">3. XUẤT EXCEL & PHÂN TÍCH</div>
            <div className="action-grid">
              <button
                type="button"
                className="drawer-action-btn drawer-action-btn--export"
                onClick={() => handleAction(onExportEX1)}
              >
                <MdTableChart size={16} />
                <span>Xuất Lưới EX1</span>
              </button>

              <button
                type="button"
                className="drawer-action-btn drawer-action-btn--export"
                onClick={() => handleAction(onExportEX2)}
              >
                <MdFileDownload size={16} />
                <span>Xuất Gốc EX2</span>
              </button>

              <button
                type="button"
                className="drawer-action-btn drawer-action-btn--pivot"
                onClick={() => handleAction(onOpenPivot)}
              >
                <MdAnalytics size={16} />
                <span>Pivot Xoay Đa Chiều</span>
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <button type="button" className="drawer-btn-dismiss" onClick={onClose}>
            Đóng Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionBOMMobileActionDrawer);
