// PrecisionIncomingGridToolbar.tsx - SaaS Action Toolbar above Main Grid
import React from "react";
import { AiFillFileAdd, AiOutlineSearch, AiOutlineDownload } from "react-icons/ai";
import { MdDone, MdClose, MdUpdate, MdDocumentScanner } from "react-icons/md";

interface PrecisionIncomingGridToolbarProps {
  onSwitchToNewInput: () => void;
  onSwitchToTraData: () => void;
  onSetPass: () => void;
  onSetFail: () => void;
  onUpdateSelected: () => void;
  onToggleBNK: () => void;
  ncrIdInput: string;
  setNcrIdInput: (val: string) => void;
  onUpdateNcrId: () => void;
  onExportExcel: (type: "EX1" | "EX2") => void;
}

export const PrecisionIncomingGridToolbar: React.FC<PrecisionIncomingGridToolbarProps> = ({
  onSwitchToNewInput,
  onSwitchToTraData,
  onSetPass,
  onSetFail,
  onUpdateSelected,
  onToggleBNK,
  ncrIdInput,
  setNcrIdInput,
  onUpdateNcrId,
  onExportExcel,
}) => {
  return (
    <div className="precision-incoming__toolbar">
      <div className="precision-incoming__toolbar-left">
        <button
          className="precision-incoming__btn precision-incoming__btn--emerald precision-incoming__btn--dense"
          title="Chuyển sang chế độ nhập mới"
          onClick={onSwitchToNewInput}
        >
          <AiFillFileAdd size={12} />
          <span>New INPUT</span>
        </button>

        <button
          className="precision-incoming__btn precision-incoming__btn--outline precision-incoming__btn--dense"
          title="Mở bảng tra cứu dữ liệu"
          onClick={onSwitchToTraData}
        >
          <AiOutlineSearch size={12} />
          <span>Tra Data</span>
        </button>

        <div className="precision-incoming__toolbar-divider" />

        <button
          className="precision-incoming__btn precision-incoming__btn--outline precision-incoming__btn--dense"
          style={{ color: "#059669", borderColor: "#a7f3d0", background: "#ecfdf5" }}
          title="Phê duyệt ĐẠT hàng loạt lô đã chọn"
          onClick={onSetPass}
        >
          <MdDone size={13} />
          <span>SET PASS</span>
        </button>

        <button
          className="precision-incoming__btn precision-incoming__btn--outline precision-incoming__btn--dense"
          style={{ color: "#e11d48", borderColor: "#fecdd3", background: "#fff1f2" }}
          title="Đánh dấu KHÔNG ĐẠT hàng loạt lô đã chọn"
          onClick={onSetFail}
        >
          <MdClose size={13} />
          <span>SET FAIL</span>
        </button>

        <button
          className="precision-incoming__btn precision-incoming__btn--outline precision-incoming__btn--dense"
          title="Cập nhật kết quả các dòng đã chọn"
          onClick={onUpdateSelected}
        >
          <MdUpdate size={13} />
          <span>Update</span>
        </button>

        <button
          className="precision-incoming__btn precision-incoming__btn--outline precision-incoming__btn--dense"
          style={{ color: "#7c3aed", borderColor: "#ddd6fe", background: "#f5f3ff" }}
          title="Xem / In biên bản kiểm tra A4 (Show BNK)"
          onClick={onToggleBNK}
        >
          <MdDocumentScanner size={13} />
          <span>Show BNK</span>
        </button>

        {/* Inline NCR ID updater */}
        <div className="precision-incoming__ncr-input-group">
          <input
            type="text"
            placeholder="Nhập NCR_ID..."
            value={ncrIdInput}
            onChange={(e) => setNcrIdInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onUpdateNcrId()}
          />
          <button onClick={onUpdateNcrId} title="Cập nhật NCR_ID cho dòng đang chọn">
            <MdUpdate size={12} />
            <span>Update NCR_ID</span>
          </button>
        </div>
      </div>

      <div className="precision-incoming__toolbar-right">
        <button
          className="precision-incoming__btn precision-incoming__btn--outline precision-incoming__btn--dense"
          style={{ color: "#047857" }}
          title="Xuất dữ liệu đang lọc ra Excel"
          onClick={() => onExportExcel("EX1")}
        >
          <AiOutlineDownload size={12} />
          <span>EX1 (Lọc)</span>
        </button>

        <button
          className="precision-incoming__btn precision-incoming__btn--outline precision-incoming__btn--dense"
          style={{ color: "#047857" }}
          title="Xuất toàn bộ dữ liệu ra Excel"
          onClick={() => onExportExcel("EX2")}
        >
          <AiOutlineDownload size={12} />
          <span>EX2 (Toàn bộ)</span>
        </button>
      </div>
    </div>
  );
};
