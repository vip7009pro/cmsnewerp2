import React, { useCallback, useState } from "react";
import "./PrecisionPlan/PrecisionPlan.scss";
import PrecisionPlanHeader from "./PrecisionPlan/PrecisionPlanHeader";
import PrecisionPlanAddModal from "./PrecisionPlan/PrecisionPlanAddModal";
import PlanManagerManageTab from "./PlanManagerManageTab";
import PlanManagerStatusTab from "./PlanManagerStatusTab";
import { getCompany } from "../../../api/Api";

const PlanManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [okCount, setOkCount] = useState(0);
  const [ngCount, setNgCount] = useState(0);
  const showStatusTab = getCompany() === "CMS";

  // Nhận số dòng OK/NG thật từ tab Plan Status
  const handleCountsChange = useCallback((ok: number, ng: number) => {
    setOkCount(ok);
    setNgCount(ng);
  }, []);

  const handleTabChange = useCallback((tab: number) => {
    setActiveTab(tab);
    if (tab !== 1) {
      setOkCount(0);
      setNgCount(0);
    }
  }, []);

  return (
    <div className="precision-plan">
      {/* Header: Sub-Tabs + KPI Badges + Nút Thêm Plan */}
      <PrecisionPlanHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        showStatusTab={showStatusTab}
        onOpenAddModal={() => setOpenAddModal(true)}
        okCount={okCount}
        ngCount={ngCount}
      />

      {/* Active Tab Content */}
      <div className="precision-plan__content">
        {activeTab === 0 && <PlanManagerManageTab />}
        {activeTab === 1 && showStatusTab && (
          <PlanManagerStatusTab onCountsChange={handleCountsChange} />
        )}
      </div>


      {/* Modal Thêm Plan */}
      <PrecisionPlanAddModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
      />
    </div>
  );
};

export default PlanManager;
