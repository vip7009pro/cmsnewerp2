import React, { useMemo, useState } from "react";
import "./PrecisionCapaSx/PrecisionCapaSx.scss";
import { useCapaSxData } from "./PrecisionCapaSx/useCapaSxData";
import PrecisionCapaSxHeader from "./PrecisionCapaSx/PrecisionCapaSxHeader";
import PrecisionCapaSxToolbar from "./PrecisionCapaSx/PrecisionCapaSxToolbar";
import PrecisionCapaSxKpi from "./PrecisionCapaSx/PrecisionCapaSxKpi";
import PrecisionCapaSxWorkforceCharts from "./PrecisionCapaSx/PrecisionCapaSxWorkforceCharts";
import PrecisionCapaSxLeadTimeCharts from "./PrecisionCapaSx/PrecisionCapaSxLeadTimeCharts";
import PrecisionCapaSxDeliveryLeadTimeCharts from "./PrecisionCapaSx/PrecisionCapaSxDeliveryLeadTimeCharts";
import PrecisionCapaSxPlanCharts from "./PrecisionCapaSx/PrecisionCapaSxPlanCharts";
import useIsMobile from "../../../../components/Navbar/AccountInfo/useIsMobile";

const CAPASX: React.FC = () => {
  const isMobile = useIsMobile();
  const [showKpi, setShowKpi] = useState<boolean>(true);

  const {
    dailytime,
    activeTab,
    setActiveTab,
    selectedPlanDate,
    setSelectedPlanDate,
    selectedFactory,
    setSelectedFactory,
    selectedMachine,
    activePlanMachine,
    setActivePlanMachine,
    eq_status,
    datadiemdanh,
    machinecount,
    ycsxbalance,
    productionplancapadata,
    dlleadtime,
    FR_EMPL,
    SR_EMPL,
    DC_EMPL,
    ED_EMPL,
    initFunction,
    getProductionPlanLeadTimeCapaData,
    getDeliveryLeadTime,
  } = useCapaSxData();


  // --- Các tính toán tổng hợp cho KPI ---
  const totalReqWorkforce = useMemo(() => {
    const fr = (machinecount.find((m) => m.EQ_NAME === "FR")?.EQ_QTY || 0) * 2 * 2;
    const sr = (machinecount.find((m) => m.EQ_NAME === "SR")?.EQ_QTY || 0) * 2 * 2;
    const dc = (machinecount.find((m) => m.EQ_NAME === "DC")?.EQ_QTY || 0) * 2 * 1;
    const ed = (machinecount.find((m) => m.EQ_NAME === "ED")?.EQ_QTY || 0) * 2 * 1;
    return fr + sr + dc + ed;
  }, [machinecount]);

  const retainWorkforce = useMemo(() => {
    return datadiemdanh.filter((e) =>
      ["SX_DC1", "SX_SR1", "SX_ED1", "SX_FR1", "SX_ED3", "SX_FR3"].includes(e.WORK_POSITION_NAME)
    ).length;
  }, [datadiemdanh]);

  const realtimeWorkforce = useMemo(() => {
    return datadiemdanh.filter(
      (e) =>
        ["SX_DC1", "SX_SR1", "SX_ED1", "SX_FR1", "SX_ED3", "SX_FR3"].includes(e.WORK_POSITION_NAME) &&
        e.ON_OFF === 1
    ).length;
  }, [datadiemdanh]);

  const totalMachines = useMemo(() => {
    return machinecount.reduce((sum, m) => sum + (m.EQ_QTY || 0), 0);
  }, [machinecount]);

  const runningMachines = useMemo(() => {
    return eq_status.filter(
      (e) => e.EQ_STATUS === "MASS" || e.EQ_STATUS === "SETTING"
    ).length;
  }, [eq_status]);

  const maxDailyCapaMinutes = useMemo(() => {
    return machinecount.reduce((sum, m) => sum + (m.EQ_QTY || 0) * dailytime, 0);
  }, [machinecount, dailytime]);

  const totalYcsxBalanceMinutes = useMemo(() => {
    return ycsxbalance.reduce((sum, b) => sum + (b.YCSX_BALANCE || 0), 0);
  }, [ycsxbalance]);

  const avgLeadTimeDays = useMemo(() => {
    if (maxDailyCapaMinutes === 0) return 0;
    return totalYcsxBalanceMinutes / maxDailyCapaMinutes;
  }, [totalYcsxBalanceMinutes, maxDailyCapaMinutes]);

  const showWorkforce = activeTab === "all" || activeTab === "workforce";
  const showLeadTime = activeTab === "all" || activeTab === "leadtime";
  const showPlans = activeTab === "all" || activeTab === "plans";

  const handlePlanDateChange = (date: string) => {
    setSelectedPlanDate(date);
    getProductionPlanLeadTimeCapaData(date);
    getDeliveryLeadTime(selectedFactory, "ALL", date);
  };

  const handleFactoryChange = (factory: string) => {
    setSelectedFactory(factory);
    getDeliveryLeadTime(factory, "ALL", selectedPlanDate);
  };

  return (
    <div className={`precision-capa-sx ${isMobile ? "is-mobile" : ""}`}>
      {/* 1. Header Bar */}
      <PrecisionCapaSxHeader
        onReload={initFunction}
        totalMachines={totalMachines}
        totalWorkforce={retainWorkforce}
        isMobile={isMobile}
        showKpi={showKpi}
        onToggleKpi={() => setShowKpi((prev) => !prev)}
      />

      {/* 2. Toolbar & Tabs */}
      <PrecisionCapaSxToolbar
        planDate={selectedPlanDate}
        factory={selectedFactory}
        activeTab={activeTab}
        onPlanDateChange={handlePlanDateChange}
        onFactoryChange={handleFactoryChange}
        onTabChange={setActiveTab}
        isMobile={isMobile}
      />

      {/* 3. Scrollable Dashboard Body */}
      <div className="precision-capa-body">
        {/* 3.1 KPI Summary (Cho phép ẩn/hiện trên mobile) */}
        {(!isMobile || showKpi) && (
          <PrecisionCapaSxKpi
            totalReqWorkforce={totalReqWorkforce}
            retainWorkforce={retainWorkforce}
            realtimeWorkforce={realtimeWorkforce}
            totalMachines={totalMachines}
            runningMachines={runningMachines}
            maxDailyCapaMinutes={maxDailyCapaMinutes}
            totalYcsxBalanceMinutes={totalYcsxBalanceMinutes}
            avgLeadTimeDays={avgLeadTimeDays}
            isMobile={isMobile}
          />
        )}

        {/* 3.2 Phân hệ Nhân Lực & Thiết Bị */}
        {showWorkforce && (
          <PrecisionCapaSxWorkforceCharts
            datadiemdanh={datadiemdanh}
            eq_status={eq_status}
            machinecount={machinecount}
            FR_EMPL={FR_EMPL}
            SR_EMPL={SR_EMPL}
            DC_EMPL={DC_EMPL}
            ED_EMPL={ED_EMPL}
          />
        )}

        {/* 3.3 Phân hệ Cân Đối Năng Lực & Lead Time */}
        {showLeadTime && (
          <PrecisionCapaSxLeadTimeCharts
            ycsxbalance={ycsxbalance}
            machinecount={machinecount}
            FR_EMPL={FR_EMPL}
            SR_EMPL={SR_EMPL}
            DC_EMPL={DC_EMPL}
            ED_EMPL={ED_EMPL}
            dailytime={dailytime}
          />
        )}

        {/* 3.4 Phân hệ Năng Lực Theo Kế Hoạch Giao Hàng & Lead Time */}
        {(showPlans || activeTab === "leadtime") && (
          <PrecisionCapaSxDeliveryLeadTimeCharts
            dlleadtime={dlleadtime}
            activePlanMachine={activePlanMachine}
            onActivePlanMachineChange={setActivePlanMachine}
            selectedPlanDate={selectedPlanDate}
            selectedFactory={selectedFactory}
          />
        )}

        {/* 3.5 Phân hệ Kế Hoạch Năng Lực Dài Hạn 4 Dòng Máy */}
        {showPlans && (
          <PrecisionCapaSxPlanCharts
            productionplancapadata={productionplancapadata}
            activePlanMachine={activePlanMachine}
            onActivePlanMachineChange={setActivePlanMachine}
          />
        )}
      </div>
    </div>
  );
};

export default CAPASX;

