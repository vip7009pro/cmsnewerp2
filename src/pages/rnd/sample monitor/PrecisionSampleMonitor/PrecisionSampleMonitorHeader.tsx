import React from "react";
import { MdRefresh, MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { Tooltip, IconButton } from "@mui/material";

interface PrecisionSampleMonitorHeaderProps {
  totalCount: number;
  userDept: string;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  onRefresh: () => void;
}

export const PrecisionSampleMonitorHeader: React.FC<PrecisionSampleMonitorHeaderProps> = ({
  totalCount,
  userDept,
  isFullscreen,
  toggleFullscreen,
  onRefresh,
}) => {
  return (
    <header className="precision-sample-monitor__header">
      <div className="precision-sample-monitor__headerLeft">
        <div className="precision-sample-monitor__breadcrumb">
          <span className="precision-sample-monitor__sectionTag">02. R&D • QUẢN LÝ TIẾN ĐỘ MẪU</span>
          <span className="precision-sample-monitor__separator">/</span>
          <span className="precision-sample-monitor__pageTitle">SAMPLE PROGRESS MONITOR</span>
          <span className="precision-sample-monitor__appBadge">CMS R&D</span>
          <span className="precision-sample-monitor__deptBadge">
            BỘ PHẬN: {userDept ? userDept.toUpperCase() : "CHUNG"}
          </span>
        </div>
      </div>

      <div className="precision-sample-monitor__headerRight">
        <div className="precision-sample-monitor__telemetry">
          <span className="precision-sample-monitor__pulseDot" />
          <span>LIVE • SAMPLE ENGINE</span>
          <span className="precision-sample-monitor__countBadge">{totalCount} Mẫu</span>
        </div>

        <div className="precision-sample-monitor__headerActions">
          <Tooltip title="Làm mới dữ liệu từ hệ thống">
            <IconButton size="small" onClick={onRefresh} className="precision-sample-monitor__iconBtn">
              <MdRefresh size={18} />
            </IconButton>
          </Tooltip>

          <Tooltip title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình Studio"}>
            <IconButton size="small" onClick={toggleFullscreen} className="precision-sample-monitor__iconBtn">
              {isFullscreen ? <MdFullscreenExit size={20} /> : <MdFullscreen size={20} />}
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};
