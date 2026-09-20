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
  FiClock,
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
  onUnLockMaterial: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onTogglePivot: () => void;
  /** Mobile: thu nút về dạng icon vuông gọn để tối đa số nút trên 1 hàng scroll ngang */
  isMobile?: boolean;
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
  onUnLockMaterial,
  onExportEX1,
  onExportEX2,
  onTogglePivot,
  isMobile = false,
}) => {
  /* Mobile: toolbar đã scroll ngang được ⇒ giữ NHÃN NGẮN cạnh icon cho dễ nhận biết
     (thay vì ép về icon vuông 30px như trước). */
  const labelCls = isMobile ? "precision-ycsx__toolBtn--keepLabel" : "";
  /* 4 nút lock/unlock chỉ có icon: trên mobile mở nhãn ra, desktop giữ icon vuông như cũ */
  const iconOnlyCls = isMobile ? "" : "precision-ycsx__toolBtn--iconOnly";
  const label = (short: string, full: string) => (isMobile ? short : full);

  return (
    <div className={`precision-ycsx__gridToolbar ${isMobile ? "precision-ycsx__gridToolbar--compact" : ""}`}>
      {/* Left Command Actions */}
      <div className="precision-ycsx__gridToolbarLeft">
        <button
          type="button"
          className={`precision-ycsx__toolBtn precision-ycsx__toolBtn--filterToggle ${labelCls}`}
          onClick={onToggleFilter}
          title={isFilterHidden ? "Hiện bộ lọc" : "Ẩn bộ lọc"}
        >
          <FiSidebar />
          <span>{label("Lọc", isFilterHidden ? "Hiện Lọc" : "Ẩn Lọc")}</span>
        </button>

        <button
          type="button"
          className={`precision-ycsx__toolBtn precision-ycsx__toolBtn--primary ${labelCls}`}
          onClick={onOpenAddModal}
          title="Mở bảng tạo YCSX mới (thủ công & Excel)"
        >
          <FiPlusCircle />
          <span>{label("+ YCSX", "+ THÊM YCSX MỚI")}</span>
        </button>

        <button
          type="button"
          className={`precision-ycsx__toolBtn ${labelCls}`}
          onClick={onOpenEditModal}
          title="Chỉnh sửa YCSX đã chọn"
        >
          <FiEdit3 />
          <span>{label("Sửa", "Sửa YCSX")}</span>
        </button>

        <button
          type="button"
          className={`precision-ycsx__toolBtn precision-ycsx__toolBtn--rose ${labelCls}`}
          onClick={onDeleteYcsx}
          title="Xóa YCSX đã chọn"
        >
          <FiTrash2 />
          <span>{label("Xóa", "Xóa YCSX")}</span>
        </button>

        <div className="precision-ycsx__toolSep" />

        <button
          type="button"
          className={`precision-ycsx__toolBtn precision-ycsx__toolBtn--amber ${labelCls}`}
          onClick={onSetClosed}
          title="Đóng lệnh YCSX (Set Closed)"
        >
          <FiLock />
          <span>{label("Đóng lệnh", "SET CLOSED")}</span>
        </button>

        <button
          type="button"
          className={`precision-ycsx__toolBtn precision-ycsx__toolBtn--rose ${labelCls}`}
          onClick={onSetPending}
          title="Đặt lệnh về trạng thái Chờ duyệt (Set Pending)"
        >
          {/* Phải có icon: nếu không sẽ thành nút trống khi nhãn bị ẩn */}
          <FiClock />
          <span>{label("Chờ duyệt", "SET PENDING")}</span>
        </button>

        <button
          type="button"
          className={`precision-ycsx__toolBtn ${labelCls}`}
          onClick={onPrintYcsx}
          title="In biểu mẫu Yêu Cầu Sản Xuất"
        >
          <FiPrinter />
          <span>In YCSX</span>
        </button>

        <button
          type="button"
          className={`precision-ycsx__toolBtn ${labelCls}`}
          onClick={onCheckBanVe}
          title="Xem và In Bản Vẽ Kỹ Thuật Sản Xuất"
        >
          <FiPrinter />
          <span>{label("Bản vẽ", "In Bản Vẽ")}</span>
        </button>

        <button
          type="button"
          className={`precision-ycsx__toolBtn precision-ycsx__toolBtn--emerald ${labelCls}`}
          onClick={onApproveYcsx}
          title="Phê duyệt các YCSX đã chọn"
        >
          <FiCheckSquare />
          <span>{label("Duyệt", "Phê Duyệt")}</span>
        </button>

        <div className="precision-ycsx__toolSep" />

        {/* Lock/Unlock quick buttons — desktop icon-only, mobile có nhãn ngắn để phân biệt */}
        <button
          type="button"
          className={`precision-ycsx__toolBtn ${iconOnlyCls} precision-ycsx__toolBtn--rose ${labelCls}`}
          onClick={onLockYcsx}
          title="Khóa YCSX"
        >
          <FiLock />
          {isMobile && <span>Khóa</span>}
        </button>

        <button
          type="button"
          className={`precision-ycsx__toolBtn ${iconOnlyCls} precision-ycsx__toolBtn--emerald ${labelCls}`}
          onClick={onUnlockYcsx}
          title="Mở khóa YCSX"
        >
          <FiUnlock />
          {isMobile && <span>Mở</span>}
        </button>

        <button
          type="button"
          className={`precision-ycsx__toolBtn ${iconOnlyCls} precision-ycsx__toolBtn--amber ${labelCls}`}
          onClick={onLockMaterial}
          title="Khóa Liệu"
        >
          <FiLock />
          {isMobile && <span>Khóa VL</span>}
        </button>

        <button
          type="button"
          className={`precision-ycsx__toolBtn ${iconOnlyCls} precision-ycsx__toolBtn--emerald ${labelCls}`}
          onClick={onUnLockMaterial}
          title="Mở Khóa Liệu"
        >
          <FiUnlock />
          {isMobile && <span>Mở VL</span>}
        </button>
      </div>

      {/* Right Excel & Pivot Tools */}
      <div className="precision-ycsx__gridToolbarRight">
        <button
          type="button"
          className={`precision-ycsx__toolBtn precision-ycsx__toolBtn--emerald ${labelCls}`}
          onClick={onExportEX1}
          title="Xuất dữ liệu hiển thị sau khi lọc ra Excel"
        >
          <FiDownload />
          <span>EX1</span>
        </button>

        <button
          type="button"
          className={`precision-ycsx__toolBtn precision-ycsx__toolBtn--emerald ${labelCls}`}
          onClick={onExportEX2}
          title="Xuất toàn bộ dữ liệu thô ra Excel"
        >
          <FiDownload />
          <span>EX2</span>
        </button>

        <button
          type="button"
          className={`precision-ycsx__toolBtn precision-ycsx__toolBtn--purple ${labelCls}`}
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
