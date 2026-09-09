import React from "react";
import { MdAssignmentTurnedIn, MdSync, MdQueryStats, MdVisibility } from "react-icons/md";

interface PrecisionPoHeaderProps {
  onRefresh: () => void;
  onQuickReport: () => void;
  onOpenReference: () => void;
}

const PrecisionPoHeader: React.FC<PrecisionPoHeaderProps> = ({
  onRefresh,
  onQuickReport,
  onOpenReference,
}) => {
  return (
    <div className="po-header-bar">
      <div className="header-left">
        <div className="header-icon-box">
          <MdAssignmentTurnedIn />
        </div>
        <div className="header-title-group">
          <div className="title-row">
            <span className="main-title">KD1 • Quản Lý Đơn Hàng (PO Manager)</span>
            <span className="live-sync-badge">
              <span className="pulse-dot"></span>
              LIVE ERP SYNC
            </span>
            <span className="key-clients-label">
              Khách hàng trọng điểm: SEVT, Mobis, Dongkwang, Samkwang
            </span>
          </div>
          <span className="sub-desc">
            Theo dõi chi tiết tiến độ sản xuất, giao nhận và công nợ đơn hàng thời gian thực.
          </span>
        </div>
      </div>

      <div className="header-right">
        <button
          type="button"
          className="btn-header"
          onClick={onRefresh}
          title="Tải lại dữ liệu"
        >
          <MdSync size={16} />
          <span>Tải lại</span>
        </button>

        <button
          type="button"
          className="btn-header"
          onClick={onQuickReport}
          title="Lập báo cáo PO nhanh"
        >
          <MdQueryStats size={16} color="#004ac6" />
          <span>Báo cáo nhanh</span>
        </button>

        <button
          type="button"
          className="btn-header btn-primary"
          onClick={onOpenReference}
          title="Xem ảnh màn hình thiết kế gốc"
        >
          <MdVisibility size={16} />
          <span>Xem màn hình gốc</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPoHeader);
