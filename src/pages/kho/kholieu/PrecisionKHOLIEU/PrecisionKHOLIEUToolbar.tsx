// PrecisionKHOLIEUToolbar.tsx - Action Toolbar phía trên bảng dữ liệu cho Kho Liệu

import React from "react";
import { MdInput, MdOutput } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { BiBarChartAlt2, BiQrScan, BiFilterAlt } from "react-icons/bi";

interface PrecisionKHOLIEUToolbarProps {
  onOpenNhapLieu: () => void;
  onOpenXuatLieu: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  onPrintQR?: () => void;
  filteredCount: number;
  totalCount: number;
  showFilter: boolean;
  onToggleFilter: () => void;
}

const PrecisionKHOLIEUToolbar: React.FC<PrecisionKHOLIEUToolbarProps> = ({
  onOpenNhapLieu,
  onOpenXuatLieu,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  onPrintQR,
  filteredCount,
  totalCount,
  showFilter,
  onToggleFilter,
}) => {
  return (
    <div className="precision-kholieu__gridToolbar" data-purpose="grid-toolbar">
      {/* Left Action Buttons */}
      <div className="precision-kholieu__toolbarLeft">
        {/* Nhập Liệu */}
        <button
          type="button"
          className="precision-kholieu__btnAction precision-kholieu__btnAction--nhap"
          onClick={onOpenNhapLieu}
          title="Mở giao diện Nhập Liệu vào kho"
        >
          <MdInput size={15} />
          <span>Nhập Liệu</span>
        </button>

        {/* Xuất Liệu */}
        <button
          type="button"
          className="precision-kholieu__btnAction precision-kholieu__btnAction--xuat"
          onClick={onOpenXuatLieu}
          title="Mở giao diện Xuất Liệu ra sản xuất"
        >
          <MdOutput size={15} />
          <span>Xuất Liệu</span>
        </button>

        {/* EX1 */}
        <button
          type="button"
          className="precision-kholieu__btnAction precision-kholieu__btnAction--ex1"
          onClick={onExportEX1}
          title="Xuất các dòng đang hiển thị ra Excel"
        >
          <RiFileExcel2Line size={14} />
          <span>EX1 (Grid)</span>
        </button>

        {/* EX2 */}
        <button
          type="button"
          className="precision-kholieu__btnAction precision-kholieu__btnAction--ex2"
          onClick={onExportEX2}
          title="Xuất toàn bộ dữ liệu ra Excel"
        >
          <RiFileExcel2Line size={14} />
          <span>EX2 (Raw)</span>
        </button>

        {/* PIVOT */}
        <button
          type="button"
          className="precision-kholieu__btnAction precision-kholieu__btnAction--pivot"
          onClick={onOpenPivot}
          title="Mở bảng phân tích Pivot xoay đa chiều"
        >
          <BiBarChartAlt2 size={15} />
          <span>PIVOT</span>
        </button>

        {/* In QR Cuộn */}
        {onPrintQR && (
          <button
            type="button"
            className="precision-kholieu__btnAction precision-kholieu__btnAction--qr"
            onClick={onPrintQR}
            title="In tem mã QR cuộn liệu"
          >
            <BiQrScan size={14} />
            <span>In QR Cuộn</span>
          </button>
        )}
      </div>

      {/* Right Grid Utilities */}
      <div className="precision-kholieu__toolbarRight">
        <span className="counter-badge">
          Đã lọc: <strong>{filteredCount.toLocaleString("en-US")}</strong> / {totalCount.toLocaleString("en-US")} dòng
        </span>

        <button
          type="button"
          className={`btn-icon-toggle ${showFilter ? "active" : ""}`}
          onClick={onToggleFilter}
          title={showFilter ? "Ẩn hàng lọc nhanh trên cột" : "Hiện hàng lọc nhanh trên cột"}
        >
          <BiFilterAlt size={16} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionKHOLIEUToolbar);
