import React, { useState } from "react";
import "./PrecisionPlan/PrecisionPlan.scss";
import PrecisionPlanHeader from "./PrecisionPlan/PrecisionPlanHeader";
import PrecisionPlanAddModal from "./PrecisionPlan/PrecisionPlanAddModal";
import PlanManagerManageTab from "./PlanManagerManageTab";
import PlanManagerStatusTab from "./PlanManagerStatusTab";
import { getCompany } from "../../../api/Api";

const PlanManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openAddModal, setOpenAddModal] = useState(false);
  const showStatusTab = getCompany() === "CMS";

  return (
    <div className="precision-plan">
      {/* Header: Sub-Tabs + KPI Badges + Nút Thêm Plan */}
      <PrecisionPlanHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showStatusTab={showStatusTab}
        onOpenAddModal={() => setOpenAddModal(true)}
        okCount={0}
        ngCount={0}
      />

      {/* Active Tab Content */}
      <div className="precision-plan__content">
        {activeTab === 0 && <PlanManagerManageTab />}
        {activeTab === 1 && showStatusTab && <PlanManagerStatusTab />}
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
