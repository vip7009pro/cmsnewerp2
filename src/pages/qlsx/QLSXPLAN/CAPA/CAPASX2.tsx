import React, { useState } from "react";
import "./PrecisionCapaSx/PrecisionCapaSx.scss";
import { useCapaSx2Data } from "./PrecisionCapaSx2/useCapaSx2Data";
import PrecisionCapaSx2Header from "./PrecisionCapaSx2/PrecisionCapaSx2Header";
import PrecisionCapaSx2Toolbar from "./PrecisionCapaSx2/PrecisionCapaSx2Toolbar";
import PrecisionCapaSx2Kpi from "./PrecisionCapaSx2/PrecisionCapaSx2Kpi";
import PrecisionCapaSx2WorkforceCharts from "./PrecisionCapaSx2/PrecisionCapaSx2WorkforceCharts";
import PrecisionCapaSx2LeadTimeCharts from "./PrecisionCapaSx2/PrecisionCapaSx2LeadTimeCharts";
import PrecisionCapaSx2PlanCharts from "./PrecisionCapaSx2/PrecisionCapaSx2PlanCharts";
import useIsMobile from "../../../../components/Navbar/AccountInfo/useIsMobile";

const CAPASX2: React.FC = () => {
  const isMobile = useIsMobile();
  const [showKpi, setShowKpi] = useState<boolean>(true);

  const {
    activeTab,
    setActiveTab,
    selectedPlanDate,
    setSelectedPlanDate,
    selectedFactory,
    setSelectedFactory,
    activePlanMachine,
    setActivePlanMachine,
    eq_status,
    eq_series,
    capadata,
    dlleadtime,
    isLoading,
    totalReqWorkforce,
    retainWorkforce,
    realtimeWorkforce,
    totalMachines,
    runningMachines,
    maxDailyCapaMinutes,
    totalYcsxBalanceMinutes,
    avgLeadTimeDays,
    retainLeadTimeDays,
    initFunction,
    getCapaData,
    getDailyDeliveryPlanCapa,
  } = useCapaSx2Data();

  // Handler khi thay đổi Ngày Kế Hoạch
  const handlePlanDateChange = (date: string) => {
    setSelectedPlanDate(date);
    getDailyDeliveryPlanCapa(
      date,
      activePlanMachine,
      selectedFactory,
      eq_series,
      capadata
    );
  };

  // Handler khi thay đổi Nhà Máy
  const handleFactoryChange = (factory: string) => {
    setSelectedFactory(factory);
    getDailyDeliveryPlanCapa(
      selectedPlanDate,
      activePlanMachine,
      factory,
      eq_series,
      capadata
    );
  };

  // Handler khi bấm Tải Lại
  const handleReload = () => {
    initFunction();
  };

  // Điều kiện hiển thị các phân hệ theo Tab
  const showWorkforce = activeTab === "all" || activeTab === "workforce";
  const showLeadTime =
    activeTab === "all" || activeTab === "leadtime" || activeTab === "matrix";
  const showPlans = activeTab === "all" || activeTab === "plans";

  return (
    <div className={`precision-capa-sx ${isMobile ? "is-mobile" : ""}`}>
      {/* 1. Header Bar chuẩn Stitch High-Density */}
      <PrecisionCapaSx2Header
        onReload={handleReload}
        totalMachines={totalMachines}
        totalWorkforce={retainWorkforce}
        isMobile={isMobile}
        showKpi={showKpi}
        onToggleKpi={() => setShowKpi((prev) => !prev)}
        isLoading={isLoading}
      />

      {/* 2. Toolbar & Segmented Tabs */}
      <PrecisionCapaSx2Toolbar
        planDate={selectedPlanDate}
        factory={selectedFactory}
        activeTab={activeTab}
        onPlanDateChange={handlePlanDateChange}
        onFactoryChange={handleFactoryChange}
        onTabChange={setActiveTab}
        isMobile={isMobile}
      />

      {/* 3. Vùng hiển thị Dashboard có thể cuộn */}
      <div className="precision-capa-body">
        {/* 3.1 Khối 6 KPI Cards (Ẩn/Hiện linh hoạt trên Mobile) */}
        {(!isMobile || showKpi) && (
          <PrecisionCapaSx2Kpi
            totalReqWorkforce={totalReqWorkforce}
            retainWorkforce={retainWorkforce}
            realtimeWorkforce={realtimeWorkforce}
            totalMachines={totalMachines}
            runningMachines={runningMachines}
            maxDailyCapaMinutes={maxDailyCapaMinutes}
            totalYcsxBalanceMinutes={totalYcsxBalanceMinutes}
            avgLeadTimeDays={avgLeadTimeDays}
            retainLeadTimeDays={retainLeadTimeDays}
            isMobile={isMobile}
          />
        )}

        {/* 3.2 Phân hệ 1: Nhân Lực & Thiết Bị (Biểu đồ + Trạng thái máy) */}
        {showWorkforce && (
          <PrecisionCapaSx2WorkforceCharts
            capadata={capadata}
            eq_status={eq_status}
          />
        )}

        {/* 3.3 Phân hệ 2: Cân Đối Năng Lực & Lead Time (Biểu đồ Lead Time + Bảng AGTable Ma Trận Chi Tiết) */}
        {showLeadTime && (
          <PrecisionCapaSx2LeadTimeCharts
            capadata={capadata}
            showOnlyMatrix={activeTab === "matrix"}
            showOnlyChart={activeTab === "leadtime"}
          />
        )}

        {/* 3.4 Phân hệ 3: Kế Hoạch Năng Lực Giao Hàng (Delivery Plan Capa Charts) */}
        {showPlans && (
          <PrecisionCapaSx2PlanCharts
            dlleadtime={dlleadtime}
            eq_series={eq_series}
            activePlanMachine={activePlanMachine}
            onActivePlanMachineChange={setActivePlanMachine}
            selectedPlanDate={selectedPlanDate}
            selectedFactory={selectedFactory}
          />
        )}
      </div>
    </div>
  );
};

export default CAPASX2;
