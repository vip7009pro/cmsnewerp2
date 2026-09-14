import React from "react";
import {
  FiPlus,
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiCheckSquare,
  FiRefreshCw,
  FiLock,
  FiClock,
  FiFileText,
  FiSend,
} from "react-icons/fi";

interface PrecisionFailingToolbarProps {
  onNewFailing: () => void;
  onSearch: () => void;
  onSetPass: (val: "Y" | "N") => void;
  onSetClose: (val: "C" | "P") => void;
  onConfirm: () => void;
  onUpdateNCR: () => void;
  onOutputFail: () => void;
  quickFilterText: string;
  setQuickFilterText: (v: string) => void;
  onExportExcel: (type: "EX1" | "EX2") => void;
  planId?: string;
}

export const PrecisionFailingToolbar: React.FC<PrecisionFailingToolbarProps> = ({
  onNewFailing,
  onSearch,
  onSetPass,
  onSetClose,
  onConfirm,
  onUpdateNCR,
  onOutputFail,
  quickFilterText,
  setQuickFilterText,
  onExportExcel,
  planId,
}) => {
  return (
    <div className="precision-failing-toolbar">
      {/* Left Action Buttons */}
      <div className="precision-failing-toolbar__left">
        <button
          type="button"
          className="btn-toolbar btn-toolbar--new"
          onClick={onNewFailing}
          title="Tạo phiên nhập lỗi mới"
        >
          <FiPlus size={12} />
          <span>New Failing</span>
        </button>

        <button
          type="button"
          className="btn-toolbar btn-toolbar--search"
          onClick={onSearch}
          title="Tra cứu dữ liệu Failing"
        >
          <FiSearch size={12} color="#2563eb" />
          <span>Tra Data</span>
        </button>

        <button
          type="button"
          className="btn-toolbar btn-toolbar--pass"
          onClick={() => onSetPass("Y")}
          title="Phê duyệt PASS cho dòng đã chọn"
        >
          <FiCheckCircle size={12} />
          <span>SET PASS</span>
        </button>

        <button
          type="button"
          className="btn-toolbar btn-toolbar--fail"
          onClick={() => onSetPass("N")}
          title="Phê duyệt FAIL cho dòng đã chọn"
        >
          <FiXCircle size={12} />
          <span>SET FAIL</span>
        </button>

        <button
          type="button"
          className="btn-toolbar btn-toolbar--confirm"
          onClick={onConfirm}
          title="IQC xác nhận tiếp nhận"
        >
          <FiCheckSquare size={12} />
          <span>IQC CONFIRM</span>
        </button>

        <button
          type="button"
          className="btn-toolbar btn-toolbar--ncr"
          onClick={onUpdateNCR}
          title="Cập nhật mã NCR ID cho dòng đã chọn"
        >
          <FiRefreshCw size={12} />
          <span>UPDATE NCR_ID</span>
        </button>

        <button
          type="button"
          className="btn-toolbar btn-toolbar--closed"
          onClick={() => onSetClose("C")}
          title="Đóng trạng thái xử lý (CLOSED)"
        >
          <FiLock size={12} />
          <span>SET CLOSED</span>
        </button>

        <button
          type="button"
          className="btn-toolbar btn-toolbar--pending"
          onClick={() => onSetClose("P")}
          title="Chuyển trạng thái xử lý sang PENDING"
        >
          <FiClock size={12} />
          <span>SET PENDING</span>
        </button>
      </div>

      {/* Right Tools: Quick Search, Excel & Output */}
      <div className="precision-failing-toolbar__right">
        <div className="quick-search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Lọc nhanh trên lưới..."
            value={quickFilterText}
            onChange={(e) => setQuickFilterText(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="btn-excel"
          onClick={() => onExportExcel("EX1")}
          title="Xuất dữ liệu dòng đã chọn hoặc lọc"
        >
          <FiFileText size={11} />
          <span>EX1</span>
        </button>

        <button
          type="button"
          className="btn-excel"
          onClick={() => onExportExcel("EX2")}
          title="Xuất toàn bộ bảng dữ liệu"
        >
          <FiFileText size={11} />
          <span>EX2</span>
        </button>

        {/* Fast Output Pill */}
        <div className="fast-output-pill" title="Xuất kho liệu failing sang chỉ thị sản xuất mới">
          <span>OUTPUT:</span>
          <button type="button" className="btn-fast-out" onClick={onOutputFail}>
            <FiSend size={10} style={{ display: "inline", marginRight: 2 }} />
            XUẤT
          </button>
        </div>
      </div>
    </div>
  );
};
