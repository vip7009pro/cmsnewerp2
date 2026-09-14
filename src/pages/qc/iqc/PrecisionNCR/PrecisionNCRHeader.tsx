import React from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineReload } from "react-icons/ai";
import { UserData } from "../../../../api/GlobalInterface";

interface PrecisionNCRHeaderProps {
  userData: UserData | undefined;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  onRefresh: () => void;
}

export const PrecisionNCRHeader: React.FC<PrecisionNCRHeaderProps> = ({
  userData,
  isFullscreen,
  toggleFullscreen,
  onRefresh,
}) => {
  const fullName = userData
    ? `${userData.MIDLAST_NAME || ""} ${userData.FIRST_NAME || ""}`.trim()
    : "IQC Engineer";
  const userInitial = userData?.FIRST_NAME?.charAt(0) || "Q";

  return (
    <header className="precision-ncr-header">
      <div className="precision-ncr-header__left">
        <span className="precision-ncr-header__badge">NCR ENGINE</span>
        <div className="precision-ncr-header__breadcrumb">
          <span>04. QC • IQC / </span>
          <span className="active">QUẢN LÝ BIÊN BẢN BẤT THƯỜNG (NCR MANAGEMENT)</span>
        </div>
        <div className="precision-ncr-header__telemetry">
          <span className="pulse-dot" />
          <span>NET_SERVER: 3007 (Online)</span>
        </div>
      </div>

      <div className="precision-ncr-header__right">
        <div className="precision-ncr-header__user">
          <div className="avatar-circle">{userInitial}</div>
          <span>
            {fullName || "IQC Engineer"} ({userData?.EMPL_NO || "CMS"})
          </span>
        </div>

        <button
          className="precision-ncr-header__btn-action"
          onClick={onRefresh}
          title="Tải lại dữ liệu"
        >
          <AiOutlineReload size={13} />
        </button>

        <button
          className="precision-ncr-header__btn-action"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
        >
          {isFullscreen ? <AiOutlineFullscreenExit size={14} /> : <AiOutlineFullscreen size={14} />}
        </button>
      </div>
    </header>
  );
};
