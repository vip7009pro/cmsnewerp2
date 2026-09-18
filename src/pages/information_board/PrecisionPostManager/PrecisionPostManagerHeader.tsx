import React from "react";
import { FiRadio, FiRefreshCw, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { getCompany } from "../../../api/Api";

interface HeaderProps {
  totalPosts: number;
  filteredCount: number;
  onRefresh: () => void;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

const PrecisionPostManagerHeader: React.FC<HeaderProps> = ({
  totalPosts,
  filteredCount,
  onRefresh,
  isFullScreen,
  onToggleFullScreen,
}) => {
  return (
    <div className="precision-postmanager__header">
      <div className="precision-postmanager__brand">
        <div className="precision-postmanager__badge">
          <FiRadio size={12} />
          <span>{getCompany()} • NEWSROOM</span>
        </div>
        <div className="precision-postmanager__breadcrumb">
          <span>Bảng Tin Nội Bộ</span>
          <span className="divider">/</span>
          <span className="active">Quản Lý Bài Viết & Đăng Tin</span>
        </div>
      </div>

      <div className="precision-postmanager__headerActions">
        <div className="precision-postmanager__telemetry">
          <span className="live-dot" />
          <span>Hệ Thống Bảng Tin:</span>
          <strong>{filteredCount}</strong> / {totalPosts} bài viết
        </div>

        <button
          type="button"
          className="precision-postmanager__btn"
          onClick={onRefresh}
          title="Tải lại toàn bộ dữ liệu bài viết"
        >
          <FiRefreshCw size={12} />
          <span>Làm Mới</span>
        </button>

        {onToggleFullScreen && (
          <button
            type="button"
            className="precision-postmanager__btn"
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

export default React.memo(PrecisionPostManagerHeader);
