import React from "react";
import { getUserData } from "../../../../../../api/Api";

interface HeaderProps {
  onRefresh: () => void;
}

export const PrecisionMachineHeader: React.FC<HeaderProps> = React.memo(({ onRefresh }) => {
  const userData = getUserData();
  const userName = userData ? `${userData.MIDLAST_NAME} ${userData.FIRST_NAME}` : "NGUYỄN VĂN HÙNG3";
  const userEmpl = userData?.EMPL_NO || "CMS1179";

  return (
    <header className="precision-machine__header">
      <div className="precision-machine__headerLeft">
        <div className="precision-machine__brand">
          <span className="cms">C.M.S</span>
          <span className="vina">VINA</span>
        </div>
        <span className="precision-machine__versionBadge">v2700</span>

        <div className="precision-machine__telemetryPill">
          <span className="pulse-dot"></span>
          <span>NET_SERVER: Online (12ms)</span>
        </div>
      </div>

      <div className="precision-machine__headerRight">
        <div className="precision-machine__userChip">
          <div className="avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span>{userName}</span>
            <span className="text-[10px] text-slate-500 font-mono">Leader • {userEmpl}</span>
          </div>
        </div>
      </div>
    </header>
  );
});
