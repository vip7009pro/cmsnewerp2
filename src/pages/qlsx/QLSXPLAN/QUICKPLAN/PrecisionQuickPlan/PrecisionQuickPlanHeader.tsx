import React from "react";
import {
  AiOutlineCalendar,
  AiOutlineUnorderedList,
  AiOutlineAppstore,
  AiOutlineSliders,
} from "react-icons/ai";

interface PrecisionQuickPlanHeaderProps {
  selectedCode: string;
  showhideycsxtable: number;
  setShowHideYCSXTable: (mode: number) => void;
  ycsxCount: number;
  planCount: number;
  totalPlanQty: number;
  isMobile?: boolean;
  showDinhMucMobile?: boolean;
  onToggleDinhMucMobile?: () => void;
}

export const PrecisionQuickPlanHeader: React.FC<PrecisionQuickPlanHeaderProps> = ({
  selectedCode,
  showhideycsxtable,
  setShowHideYCSXTable,
  ycsxCount,
  planCount,
  totalPlanQty,
  isMobile = false,
  showDinhMucMobile = false,
  onToggleDinhMucMobile,
}) => {
  if (isMobile) {
    return (
      <div className="precision-quickplan__header is-mobile">
        {/* Hàng 1: Brand + Selected Code & Stats */}
        <div className="header-mobile-top">
          <div className="brand-badge-group">
            <span className="brand-title">QUICK PLAN</span>
            <div className="selected-code-badge" title="Mã hàng sản xuất đang chọn">
              <span>{selectedCode ? selectedCode : "CHƯA CHỌN"}</span>
            </div>
          </div>
          <div className="stats-badge" title="Thống kê dữ liệu">
            Y:{ycsxCount} | P:{planCount} | {totalPlanQty.toLocaleString("en-US")}
          </div>
        </div>

        {/* Hàng 2: Segmented Switcher & Toggle Định Mức */}
        <div className="header-mobile-bottom">
          <div className="view-mode-tabs">
            <button
              type="button"
              className={showhideycsxtable === 1 ? "active" : ""}
              onClick={() => setShowHideYCSXTable(1)}
              title="Chuyển sang Bảng Kế Hoạch"
            >
              <AiOutlineCalendar size={13} />
              <span>Kế Hoạch</span>
            </button>
            <button
              type="button"
              className={showhideycsxtable === 2 ? "active" : ""}
              onClick={() => setShowHideYCSXTable(2)}
              title="Chuyển sang Tra Cứu YCSX"
            >
              <AiOutlineUnorderedList size={13} />
              <span>Tra Cứu YCSX</span>
            </button>
          </div>

          {showhideycsxtable === 1 && onToggleDinhMucMobile && (
            <button
              type="button"
              className={`btn-toggle-dm-mobile ${showDinhMucMobile ? "active" : ""}`}
              onClick={onToggleDinhMucMobile}
              title="Bật/Tắt hiển thị 4 dòng Định Mức để có thêm chỗ xem bảng"
            >
              <AiOutlineSliders size={13} />
              <span>{showDinhMucMobile ? "Ẩn Đ.Mức" : "Hiện Đ.Mức"}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // DESKTOP: Giữ nguyên 100% giao diện
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
