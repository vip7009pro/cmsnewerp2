import React, { memo } from "react";
import {
  FiEye,
  FiSave,
  FiUploadCloud,
  FiPrinter,
  FiDownload,
  FiLayers,
} from "react-icons/fi";
import { MdOutlinePivotTableChart } from "react-icons/md";

interface Props {
  onToggleSidebar: () => void;
  onSaveExcel: () => void;
  onTogglePivot: () => void;
  onOpenUpGia: () => void;
  onOpenPrint: () => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
}

const PrecisionPriceToolbar: React.FC<Props> = ({
  onToggleSidebar,
  onSaveExcel,
  onTogglePivot,
  onOpenUpGia,
  onOpenPrint,
  onExportEX1,
  onExportEX2,
}) => {
  return (
    <div className="precision-quotation__toolbar">
      {/* Left Operation Actions */}
      <div className="precision-quotation__toolbar-left">
        <button
          className="precision-quotation__btn precision-quotation__btn--outline"
          onClick={onToggleSidebar}
          title="Ẩn/Hiện thanh bộ lọc bên trái"
        >
          <FiEye />
          <span>Show/Hide</span>
        </button>

        <button
          className="precision-quotation__btn precision-quotation__btn--emerald"
          onClick={onSaveExcel}
          title="Lưu dữ liệu bảng giá hiện tại ra file Excel"
        >
          <FiSave />
          <span>SAVE</span>
        </button>

        <button
          className="precision-quotation__btn precision-quotation__btn--purple"
          onClick={onTogglePivot}
          title="Mở bảng phân tích đa chiều Pivot Table"
        >
          <MdOutlinePivotTableChart />
          <span>Pivot</span>
        </button>

        <button
          className="precision-quotation__btn precision-quotation__btn--blue"
          onClick={onOpenUpGia}
          title="Mở giao diện tải lên giá sản phẩm (đơn lẻ / Excel)"
        >
          <FiUploadCloud />
          <span>Up Giá</span>
        </button>

        <button
          className="precision-quotation__btn precision-quotation__btn--outline"
          onClick={onOpenPrint}
          title="Mở mẫu in báo giá chuyên nghiệp"
        >
          <FiPrinter />
          <span>In báo giá</span>
        </button>
      </div>

      {/* Right Export Actions */}
      <div className="precision-quotation__toolbar-right">
        <button
          className="precision-quotation__btn precision-quotation__btn--ex-excel"
          onClick={onExportEX1}
          title="Xuất dữ liệu đang lọc (EX1)"
        >
          <FiDownload />
          <span>EX1</span>
        </button>

        <button
          className="precision-quotation__btn precision-quotation__btn--ex-excel"
          onClick={onExportEX2}
          title="Xuất toàn bộ dữ liệu bảng giá (EX2)"
        >
          <FiDownload />
          <span>EX2</span>
        </button>

        <button
          className="precision-quotation__btn precision-quotation__btn--ex-pivot"
          onClick={onTogglePivot}
          title="Xem phân tích Pivot Grid"
        >
          <FiLayers />
          <span>PIVOT</span>
        </button>
      </div>
    </div>
  );
};

export default memo(PrecisionPriceToolbar);
