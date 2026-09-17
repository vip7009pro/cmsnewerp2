import React from "react";
import {
  AiOutlineCalendar,
  AiOutlineUnorderedList,
  AiOutlineAppstore,
} from "react-icons/ai";

interface PrecisionQuickPlanHeaderProps {
  selectedCode: string;
  showhideycsxtable: number;
  setShowHideYCSXTable: (mode: number) => void;
  ycsxCount: number;
  planCount: number;
  totalPlanQty: number;
}

export const PrecisionQuickPlanHeader: React.FC<PrecisionQuickPlanHeaderProps> = ({
  selectedCode,
  showhideycsxtable,
  setShowHideYCSXTable,
  ycsxCount,
  planCount,
  totalPlanQty,
}) => {
  return (
    <div className="precision-quickplan__header">
      {/* Cột trái: Brand Title & Selected Code */}
      <div className="header-left">
        <span className="brand-title">QUICK PLANNER</span>
        <div className="selected-code-badge" title="Mã hàng sản xuất đang chọn">
          <span>{selectedCode || "CODE: CHƯA CHỌN"}</span>
        </div>
      </div>

      {/* Cột phải: Segmented Switcher & Stats Badge */}
      <div className="header-right">
        <div className="view-mode-tabs">
          <button
            type="button"
            className={showhideycsxtable === 1 ? "active" : ""}
            onClick={() => setShowHideYCSXTable(1)}
            title="Chỉ hiển thị Plan & Định Mức"
          >
            <AiOutlineCalendar size={13} />
            <span>Plan & ĐM</span>
          </button>
          <button
            type="button"
            className={showhideycsxtable === 2 ? "active" : ""}
            onClick={() => setShowHideYCSXTable(2)}
            title="Chỉ hiển thị Bảng Tra Cứu YCSX"
          >
            <AiOutlineUnorderedList size={13} />
            <span>Chỉ YCSX</span>
          </button>
          <button
            type="button"
            className={showhideycsxtable === 3 ? "active" : ""}
            onClick={() => setShowHideYCSXTable(3)}
            title="Hiển thị song song YCSX và Plan Nháp"
          >
            <AiOutlineAppstore size={13} />
            <span>Song song (Split)</span>
          </button>
        </div>

        <div className="stats-badge" title="Thống kê dữ liệu">
          YCSX: {ycsxCount} | Plan: {planCount} | SL: {totalPlanQty.toLocaleString("en-US")}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionQuickPlanHeader);
