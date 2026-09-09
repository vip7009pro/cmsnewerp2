import React from "react";
import {
  FiSearch,
  FiEdit2,
  FiRefreshCw,
  FiDownload,
  FiFileText,
  FiBarChart2,
} from "react-icons/fi";

interface Props {
  fromDate: string;
  setFromDate: (date: string) => void;
  toDate: string;
  setToDate: (date: string) => void;
  truNghiViec: boolean;
  setTruNghiViec: (val: boolean) => void;
  truNghiSinh: boolean;
  setTruNghiSinh: (val: boolean) => void;
  onLoadData: () => void;
  onFixTime: () => void;
  onFixAutoTime: () => void;
  onSetCa: (calv: number) => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
  onOpenPivot: () => void;
  isLoading?: boolean;
}

export const PrecisionChamCongToolbar: React.FC<Props> = ({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  truNghiViec,
  setTruNghiViec,
  truNghiSinh,
  setTruNghiSinh,
  onLoadData,
  onFixTime,
  onFixAutoTime,
  onSetCa,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  isLoading,
}) => {
  return (
    <div className="precision-chamcong__toolbarTop">
      {/* Bộ lọc bên trái */}
      <div className="precision-chamcong__filtersLeft">
        <div className="precision-chamcong__dateGroup">
          <label>Từ ngày:</label>
          <input
            type="date"
            value={fromDate ? fromDate.slice(0, 10) : ""}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="precision-chamcong__dateGroup">
          <label>Tới ngày:</label>
          <input
            type="date"
            value={toDate ? toDate.slice(0, 10) : ""}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="precision-chamcong__divider"></div>

        <label className="precision-chamcong__checkboxLabel">
          <input
            type="checkbox"
            checked={truNghiViec}
            onChange={(e) => setTruNghiViec(e.target.checked)}
          />
          <span>Trừ nghỉ việc</span>
        </label>

        <label className="precision-chamcong__checkboxLabel">
          <input
            type="checkbox"
            checked={truNghiSinh}
            onChange={(e) => setTruNghiSinh(e.target.checked)}
          />
          <span>Trừ nghỉ sinh</span>
        </label>
      </div>

      {/* Cụm nút hành động bên phải */}
      <div className="precision-chamcong__actionsRight">
        {/* Nút Tra chấm công */}
        <button
          type="button"
          className="precision-chamcong__btn precision-chamcong__btn--query"
          onClick={onLoadData}
          disabled={isLoading}
          title="Tra cứu dữ liệu quẹt thẻ"
        >
          <FiSearch size={13} />
          <span>TRA CHẤM CÔNG</span>
        </button>

        {/* Nút Update Fix Time */}
        <button
          type="button"
          className="precision-chamcong__btn precision-chamcong__btn--fixUpdate"
          onClick={onFixTime}
          disabled={isLoading}
          title="Cập nhật giờ đã chỉnh sửa"
        >
          <FiEdit2 size={12} />
          <span>UPDATE FIX TIME</span>
        </button>

        {/* Nút Fix Auto Time */}
        <button
          type="button"
          className="precision-chamcong__btn precision-chamcong__btn--fixAuto"
          onClick={onFixAutoTime}
          disabled={isLoading}
          title="Tự động sửa lỗi quẹt thẻ hàng loạt"
        >
          <FiRefreshCw size={12} />
          <span>FIX AUTO TIME</span>
        </button>

        <div className="precision-chamcong__divider"></div>

        {/* Cụm nút Set Ca */}
        <button
          type="button"
          className="precision-chamcong__btn precision-chamcong__btn--setHc"
          onClick={() => onSetCa(0)}
          disabled={isLoading}
          title="Phân ca Hành chính cho các dòng đã chọn"
        >
          SET CA HC
        </button>

        <button
          type="button"
          className="precision-chamcong__btn precision-chamcong__btn--setDay"
          onClick={() => onSetCa(1)}
          disabled={isLoading}
          title="Phân ca Ngày (Ca 1) cho các dòng đã chọn"
        >
          SET CA NGÀY
        </button>

        <button
          type="button"
          className="precision-chamcong__btn precision-chamcong__btn--setNight"
          onClick={() => onSetCa(2)}
          disabled={isLoading}
          title="Phân ca Đêm (Ca 2) cho các dòng đã chọn"
        >
          SET CA ĐÊM
        </button>

        <div className="precision-chamcong__divider"></div>

        {/* Nút EX1, EX2, PIVOT */}
        <button
          type="button"
          className="precision-chamcong__btn precision-chamcong__btn--excel"
          onClick={onExportEX1}
          title="Xuất Excel dữ liệu hiện tại"
        >
          <FiFileText size={12} />
          <span>EX1</span>
        </button>

        <button
          type="button"
          className="precision-chamcong__btn precision-chamcong__btn--excel"
          onClick={onExportEX2}
          title="Xuất Excel toàn bộ dữ liệu"
        >
          <FiDownload size={12} />
          <span>EX2</span>
        </button>

        <button
          type="button"
          className="precision-chamcong__btn precision-chamcong__btn--pivot"
          onClick={onOpenPivot}
          title="Mở bảng xoay đa chiều Pivot"
        >
          <FiBarChart2 size={12} />
          <span>PIVOT</span>
        </button>
      </div>
    </div>
  );
};

export default PrecisionChamCongToolbar;
