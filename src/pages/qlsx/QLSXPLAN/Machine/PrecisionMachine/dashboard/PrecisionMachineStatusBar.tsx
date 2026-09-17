import React, { useEffect, useState } from "react";
import moment from "moment";
import { getUserData } from "../../../../../../api/Api";
import { MachineKpiData } from "../machineTypes";

interface StatusBarProps {
  factory: string;
  kpiData: MachineKpiData;
}

export const PrecisionMachineStatusBar: React.FC<StatusBarProps> = React.memo(
  ({ factory, kpiData }) => {
    const [currentTime, setCurrentTime] = useState(moment().format("HH:mm:ss"));
    const userData = getUserData();
    const plannerName = userData
      ? `${userData.MIDLAST_NAME} ${userData.FIRST_NAME}`
      : "NGUYỄN VĂN HÙNG3";

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(moment().format("HH:mm:ss"));
      }, 1000);
      return () => clearInterval(timer);
    }, []);

    return (
      <footer className="precision-machine__statusBar">
        <div className="status-left">
          <span className="dot"></span>
          <span>
            {factory} Xưởng Dập: <strong>{kpiData.activeMachines} máy đang chạy</strong>
          </span>
          {kpiData.waitingMaterialCount > 0 && (
            <>
              <span className="text-slate-300">|</span>
              <span className="warn-text">
                ⚠️ {kpiData.waitingMaterialCount} máy chờ cấp liệu ({kpiData.waitingMachineNames.join(", ")})
              </span>
            </>
          )}
          <span className="text-slate-300">|</span>
          <span>
            Hiệu suất Line {factory}: <strong className="perf-val">94.2%</strong>
          </span>
        </div>

        <div className="status-right">
          <span>
            Cập nhật: <strong>{currentTime} (Realtime Socket)</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            Người lập kế hoạch: <strong>{plannerName}</strong>
          </span>
        </div>
      </footer>
    );
  }
);
