// PrecisionIncomingMobileSidebarSheet.tsx - Bottom Sheet (Zero-Blur) wrapping the DESKTOP sidebar
// => Giữ nguyên 100% logic/state của form lọc (Tra Data) và form đăng ký (New Input).
import React from "react";
import { FiX } from "react-icons/fi";
import { PrecisionIncomingSidebar } from "./PrecisionIncomingSidebar";
import { useIncomingData } from "./useIncomingData";

interface PrecisionIncomingMobileSidebarSheetProps {
  hook: ReturnType<typeof useIncomingData>;
  onClose: () => void;
  onSearch?: () => void;
}

export const PrecisionIncomingMobileSidebarSheet: React.FC<PrecisionIncomingMobileSidebarSheetProps> = ({
  hook,
  onClose,
  onSearch,
}) => {
  const isNewInput = hook.activeLeftTab === "newInput";

  return (
    <div className="precision-incoming-drawer-overlay" onClick={onClose}>
      <div className="precision-incoming-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">
            <span className={`drawer-mode-dot ${isNewInput ? "is-new" : "is-tra"}`} />
            <span>{isNewInput ? "PHIẾU ĐĂNG KÝ KIỂM TRA LÔ MỚI" : "BỘ LỌC & TRA CỨU INCOMING"}</span>
          </div>
          <button type="button" className="drawer-close" onClick={onClose} title="Đóng">
            <FiX size={18} />
          </button>
        </div>

        <div className="drawer-body">
          <PrecisionIncomingSidebar hook={hook} />
        </div>

        {/* Hành động dính đáy: tìm kiếm LUÔN mở bấm được; đăng ký chỉ ở tab New Input */}
        <div className="drawer-footer">
          {isNewInput ? (
            <>
              <button type="button" className="drawer-foot-btn drawer-foot-btn--amber" onClick={hook.addRow}>
                + ADD
              </button>
              <button type="button" className="drawer-foot-btn drawer-foot-btn--emerald" onClick={hook.insertIQC1Table}>
                LƯU SAVE
              </button>
            </>
          ) : (
            <>
              <button type="button" className="drawer-foot-btn drawer-foot-btn--ghost" onClick={onClose}>
                Đóng
              </button>
              <button
                type="button"
                className="drawer-foot-btn drawer-foot-btn--primary"
                onClick={onSearch ?? hook.handletraIQC1Data}
              >
                TRA DATA INCOMING
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrecisionIncomingMobileSidebarSheet;
