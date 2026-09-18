import React from "react";
import { FiRefreshCw, FiRadio, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { getCompany } from "../../../api/Api";

interface HeaderProps {
  totalPosts: number;
  totalDepts: number;
  onRefresh: () => void;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

const PrecisionAddInfoHeader: React.FC<HeaderProps> = ({
  totalPosts,
  totalDepts,
  onRefresh,
  isFullScreen,
  onToggleFullScreen,
}) => {
  return (
    <div className="precision-addinfo__header">
      <div className="precision-addinfo__brand">
        <div className="precision-addinfo__badge">
          <FiRadio size={12} />
          <span>{getCompany()} • NEWSROOM</span>
        </div>
        <div className="precision-addinfo__breadcrumb">
          <span>Truyền Thông Doanh Nghiệp</span>
          <span className="divider">/</span>
          <span className="active">Cổng Đăng Tin Bảng Tin Nội Bộ</span>
        </div>
      </div>

      <div className="precision-addinfo__headerActions">
        <div className="precision-addinfo__telemetry">
          <span className="live-dot" />
          <span>Realtime Feed:</span>
          <strong>{totalPosts}</strong> bài đăng
          <span className="divider">•</span>
          <strong>{totalDepts}</strong> phòng ban
        </div>

        <button
          type="button"
          className="precision-addinfo__btn"
          onClick={onRefresh}
          title="Tải lại toàn bộ dữ liệu bài đăng và phòng ban"
        >
          <FiRefreshCw size={12} />
          <span>Làm Mới</span>
        </button>

        {onToggleFullScreen && (
          <button
            type="button"
            className="precision-addinfo__btn"
            onClick={onToggleFullScreen}
            title={isFullScreen ? "Thu nhỏ màn hình" : "Mở rộng toàn màn hình"}
          >
            {isFullScreen ? <FiMinimize2 size={12} /> : <FiMaximize2 size={12} />}
            <span>{isFullScreen ? "Thu Nhỏ" : "Toàn Màn Hình"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(PrecisionAddInfoHeader);
