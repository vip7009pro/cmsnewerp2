import React, { useMemo } from "react";
import "./PrecisionCapaSx/PrecisionCapaSx.scss";
import { useCapaSxData } from "./PrecisionCapaSx/useCapaSxData";
import PrecisionCapaSxHeader from "./PrecisionCapaSx/PrecisionCapaSxHeader";
import PrecisionCapaSxToolbar from "./PrecisionCapaSx/PrecisionCapaSxToolbar";
import PrecisionCapaSxKpi from "./PrecisionCapaSx/PrecisionCapaSxKpi";
import PrecisionCapaSxWorkforceCharts from "./PrecisionCapaSx/PrecisionCapaSxWorkforceCharts";
import PrecisionCapaSxLeadTimeCharts from "./PrecisionCapaSx/PrecisionCapaSxLeadTimeCharts";
import PrecisionCapaSxPlanCharts from "./PrecisionCapaSx/PrecisionCapaSxPlanCharts";
import { EQ_STT, MACHINE_COUNTING, YCSX_BALANCE_CAPA_DATA } from "../interfaces/khsxInterface";

const CAPASX: React.FC = () => {
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
    getDeliveryLeadTime(selectedFactory, selectedMachine, date);
  };

  const handleFactoryChange = (factory: string) => {
    setSelectedFactory(factory);
    getDeliveryLeadTime(factory, selectedMachine, selectedPlanDate);
  };

  return (
    <div className="precision-capa-sx">
      {/* 1. Header Bar */}
      <PrecisionCapaSxHeader
        onReload={initFunction}
        totalMachines={totalMachines}
        totalWorkforce={retainWorkforce}
      />

      {/* 2. Toolbar & Tabs */}
      <PrecisionCapaSxToolbar
        planDate={selectedPlanDate}
        factory={selectedFactory}
        activeTab={activeTab}
        onPlanDateChange={handlePlanDateChange}
        onFactoryChange={handleFactoryChange}
        onTabChange={setActiveTab}
      />

      {/* 3. Scrollable Dashboard Body */}
      <div className="precision-capa-body">
        {/* 3.1 KPI Summary */}
        <PrecisionCapaSxKpi
          totalReqWorkforce={totalReqWorkforce}
          retainWorkforce={retainWorkforce}
          realtimeWorkforce={realtimeWorkforce}
          totalMachines={totalMachines}
          runningMachines={runningMachines}
          maxDailyCapaMinutes={maxDailyCapaMinutes}
          totalYcsxBalanceMinutes={totalYcsxBalanceMinutes}
          avgLeadTimeDays={avgLeadTimeDays}
        />

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

        {/* 3.4 Phân hệ Kế Hoạch Năng Lực 4 Dòng Máy */}
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
