import React, { useState } from "react";
import "./PrecisionDangKy.scss";
import PrecisionDangKyHeader from "./PrecisionDangKyHeader";
import PrecisionDangKyKpi from "./PrecisionDangKyKpi";
import PrecisionDangKyForms, { PortalTabType } from "./PrecisionDangKyForms";
import PrecisionDangKyHistory from "./PrecisionDangKyHistory";

export const PrecisionDangKy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PortalTabType>("leave");
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const handleRegistrationSuccess = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  return (
    <div className="precision-dangky">
      {/* HEADER BANNER & USER BADGE */}
      <PrecisionDangKyHeader />

      {/* 3 KPI MICRO-CARDS (QUỸ PHÉP, OT, CHẤM CÔNG) */}
      <PrecisionDangKyKpi
        annualLeaveRemaining={10}
        annualLeaveTotal={12}
        monthlyOtHours={28.0}
        monthlyOtMax={40.0}
        pendingAttConfirmCount={1}
      />

      {/* WORKSPACE BỐ CỤC 2 CỘT (FORM PANEL TRÁI + AG-GRID HISTORY PHẢI) */}
      <div className="precision-dangky__workspace">
        <PrecisionDangKyForms
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onRegistrationSuccess={handleRegistrationSuccess}
        />

        <PrecisionDangKyHistory reloadTrigger={reloadTrigger} />
      </div>
    </div>
  );
};

export default PrecisionDangKy;
