import React, { memo } from "react";
import {
  FiSidebar,
  FiPlusCircle,
  FiEdit3,
  FiTrash2,
  FiLock,
  FiUnlock,
  FiPrinter,
  FiCheckSquare,
  FiDownload,
} from "react-icons/fi";
import { MdOutlinePivotTableChart } from "react-icons/md";
import { AiOutlineFileSearch } from "react-icons/ai";

interface Props {
  onToggleFilter: () => void;
  isFilterHidden: boolean;
  onOpenAddModal: () => void;
  onOpenEditModal: () => void;
  onDeleteYcsx: () => void;
  onSetClosed: () => void;
  onSetPending: () => void;
  onPrintYcsx: () => void;
  onCheckBanVe: () => void;
  onApproveYcsx: () => void;
  onLockYcsx: () => void;
  onUnlockYcsx: () => void;
  onLockMaterial: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onTogglePivot: () => void;
}

const PrecisionYCSXToolbar: React.FC<Props> = ({
  onToggleFilter,
  isFilterHidden,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteYcsx,
  onSetClosed,
  onSetPending,
  onPrintYcsx,
  onCheckBanVe,
  onApproveYcsx,
  onLockYcsx,
  onUnlockYcsx,
  onLockMaterial,
  onExportEX1,
  onExportEX2,
  onTogglePivot,
}) => {
  return (
    <div className="precision-ycsx__gridToolbar">
      {/* Left Command Actions */}
      <div className="precision-ycsx__gridToolbarLeft">
        <button
          type="button"
          className="precision-ycsx__toolBtn"
          onClick={onToggleFilter}
          title={isFilterHidden ? "Hiện thanh lọc bên trái" : "Ẩn thanh lọc bên trái"}
        >
          <FiSidebar />
          <span>{isFilterHidden ? "Hiện Lọc" : "Ẩn Lọc"}</span>
        </button>

        <button
          type="button"
          className="precision-ycsx__toolBtn precision-ycsx__toolBtn--primary"
          onClick={onOpenAddModal}
          title="Mở bảng tạo YCSX mới (thủ công & Excel)"
        >
          <FiPlusCircle />
          <span>+ THÊM YCSX MỚI</span>
        </button>

        <button
          type="button"
          className="precision-ycsx__toolBtn"
          onClick={onOpenEditModal}
          title="Chỉnh sửa YCSX đã chọn"
        >
          <FiEdit3 />
          <span>Sửa YCSX</span>
        </button>

        <button
          type="button"
          className="precision-ycsx__toolBtn precision-ycsx__toolBtn--rose"
          onClick={onDeleteYcsx}
          title="Xóa YCSX đã chọn"
        >
          <FiTrash2 />
          <span>Xóa YCSX</span>
        </button>

        <div className="precision-ycsx__toolSep" />

        <button
          type="button"
          className="precision-ycsx__toolBtn precision-ycsx__toolBtn--amber"
          onClick={onSetClosed}
          title="Đóng lệnh YCSX (Set Closed)"
        >
          <FiLock />
          <span>SET CLOSED</span>
        </button>

        <button
          type="button"
          className="precision-ycsx__toolBtn precision-ycsx__toolBtn--rose"
          onClick={onSetPending}
          title="Đặt lệnh về trạng thái Chờ duyệt (Set Pending)"
        >
          <span>SET PENDING</span>
        </button>

        <button
          type="button"
          className="precision-ycsx__toolBtn"
          onClick={onPrintYcsx}
          title="In biểu mẫu Yêu Cầu Sản Xuất"
        >
          <FiPrinter />
          <span>In YCSX</span>
        </button>

        <button
          type="button"
          className="precision-ycsx__toolBtn"
          onClick={onCheckBanVe}
          title="Xem và In Bản Vẽ Kỹ Thuật Sản Xuất"
        >
          <FiPrinter />
          <span>In Bản Vẽ</span>
        </button>

        <button
          type="button"
          className="precision-ycsx__toolBtn precision-ycsx__toolBtn--emerald"
          onClick={onApproveYcsx}
          title="Phê duyệt các YCSX đã chọn"
        >
          <FiCheckSquare />
          <span>Phê Duyệt</span>
        </button>

        <div className="precision-ycsx__toolSep" />

        {/* Lock/Unlock quick buttons */}
        <button
          type="button"
          className="precision-ycsx__toolBtn precision-ycsx__toolBtn--iconOnly precision-ycsx__toolBtn--rose"
          onClick={onLockYcsx}
          title="Khóa YCSX"
        >
          <FiLock />
        </button>

        <button
          type="button"
          className="precision-ycsx__toolBtn precision-ycsx__toolBtn--iconOnly precision-ycsx__toolBtn--emerald"
          onClick={onUnlockYcsx}
          title="Mở khóa YCSX"
        >
          <FiUnlock />
        </button>

        <button
          type="button"
          className="precision-ycsx__toolBtn precision-ycsx__toolBtn--iconOnly precision-ycsx__toolBtn--amber"
          onClick={onLockMaterial}
          title="Khóa / Mở Khóa Liệu"
        >
          <FiLock />
        </button>
      </div>

      {/* Right Excel & Pivot Tools */}
      <div className="precision-ycsx__gridToolbarRight">
        <button
          type="button"
          className="precision-ycsx__toolBtn precision-ycsx__toolBtn--emerald"
          onClick={onExportEX1}
          title="Xuất dữ liệu hiển thị sau khi lọc ra Excel"
        >
          <FiDownload />
          <span>EX1</span>
        </button>

        <button
          type="button"
          className="precision-ycsx__toolBtn precision-ycsx__toolBtn--emerald"
          onClick={onExportEX2}
          title="Xuất toàn bộ dữ liệu thô ra Excel"
        >
          <FiDownload />
          <span>EX2</span>
        </button>

        <button
          type="button"
          className="precision-ycsx__toolBtn precision-ycsx__toolBtn--purple"
          onClick={onTogglePivot}
          title="Mở bảng phân tích xoay đa chiều DevExtreme Pivot"
        >
          <MdOutlinePivotTableChart size={14} />
          <span>PIVOT</span>
        </button>
      </div>
    </div>
  );
};

export default memo(PrecisionYCSXToolbar);
