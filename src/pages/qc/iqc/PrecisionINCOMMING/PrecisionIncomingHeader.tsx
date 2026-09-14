// PrecisionIncomingHeader.tsx - Sub-header with breadcrumb, telemetry, user info & fullscreen toggle
import { FiMaximize2, FiMinimize2, FiRefreshCw } from "react-icons/fi";
import { UserData } from "../../../../api/GlobalInterface";

interface PrecisionIncomingHeaderProps {
  userData: UserData | undefined;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onRefresh: () => void;
}

export const PrecisionIncomingHeader: React.FC<PrecisionIncomingHeaderProps> = ({
  userData,
  isFullscreen,
  onToggleFullscreen,
  onRefresh,
}) => {
  return (
    <div className="precision-incoming__header">
      <div className="precision-incoming__header-left">
        <span className="precision-incoming__badge precision-incoming__badge--primary">IQC ENGINE</span>
        <div className="precision-incoming__breadcrumb">
          <span>04. QC • IQC</span>
          <span className="divider">/</span>
          <span className="current">KIỂM TRA NGUYÊN VẬT LIỆU ĐẦU VÀO (INCOMING CONTROL)</span>
        </div>
        <span className="precision-incoming__badge precision-incoming__badge--telemetry">
          <span className="pulse-dot" />
          <span>NET_SERVER: 3007</span>
        </span>
      </div>

      <div className="precision-incoming__header-right">
        {userData && (
          <div className="precision-incoming__user-badge">
            <div className="avatar">{(userData.FIRST_NAME || "U").charAt(0).toUpperCase()}</div>
            <span>
              <strong>{userData.EMPL_NO}</strong> - {userData.MIDLAST_NAME} {userData.FIRST_NAME}
            </span>
          </div>
        )}

        <button
          className="precision-incoming__icon-btn"
          title="Tải lại dữ liệu (Refresh)"
          onClick={onRefresh}
        >
          <FiRefreshCw size={13} />
        </button>

        <button
          className="precision-incoming__icon-btn"
          title={isFullscreen ? "Thu nhỏ (Exit Fullscreen)" : "Toàn màn hình (Fullscreen)"}
          onClick={onToggleFullscreen}
        >
          {isFullscreen ? <FiMinimize2 size={13} /> : <FiMaximize2 size={13} />}
        </button>
      </div>
    </div>
  );
};
