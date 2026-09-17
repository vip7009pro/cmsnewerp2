import React from "react";
import "./PrecisionPlanResult/PrecisionPlanResult.scss";
import { usePlanResultData } from "./PrecisionPlanResult/usePlanResultData";
import { PrecisionPlanResultHeader } from "./PrecisionPlanResult/PrecisionPlanResultHeader";
import { PrecisionPlanResultToolbar } from "./PrecisionPlanResult/PrecisionPlanResultToolbar";
import { PrecisionPlanResultKpiSection } from "./PrecisionPlanResult/PrecisionPlanResultKpiSection";
import { PrecisionPlanResultChartsSection } from "./PrecisionPlanResult/PrecisionPlanResultChartsSection";
import { PrecisionPlanResultAchivementTable } from "./PrecisionPlanResult/PrecisionPlanResultAchivementTable";
import { PrecisionPlanResultTimeTable } from "./PrecisionPlanResult/PrecisionPlanResultTimeTable";

const PLANRESULT: React.FC = () => {
  const {
    machine_list,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    machine,
    setMachine,
    factory,
    setFactory,
    activeTab,
    setActiveTab,
    isLoading,
    dayrange,
    daily_sx_data,
    weekly_sx_data,
    monthly_sx_data,
    sxachivementdata,
    sxlosstrendingdata,
    operation_time,
    availableTime,
    t_time_total,
    handleSearch,
    handleQuickSelect,
    exportExcel,
  } = usePlanResultData();

  return (
    <div className="precision-planresult">
      {/* 1. HEADER BAR DOANH NGHIỆP */}
      <PrecisionPlanResultHeader
        machineCount={machine_list.filter((m) => m.EQ_NAME !== "ALL").length}
        factory={factory}
        fromdate={fromdate}
        todate={todate}
      />

      {/* 2. BỘ LỌC DỮ LIỆU & SEGMENTED TABS SWITCHER */}
      <PrecisionPlanResultToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        fromdate={fromdate}
        setFromDate={setFromDate}
        todate={todate}
        setToDate={setToDate}
        factory={factory}
        setFactory={setFactory}
        machine={machine}
        setMachine={setMachine}
        machine_list={machine_list}
        onQuickSelect={handleQuickSelect}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      {/* 3. KHỐI DASHBOARD KPI & GAUGES */}
      {(activeTab === "all" || activeTab === "kpi") && (
        <PrecisionPlanResultKpiSection
          sxachivementdata={sxachivementdata}
          operation_time={operation_time}
          machine_list={machine_list}
          availableTime={availableTime}
          dayrange={dayrange}
          t_time_total={t_time_total}
        />
      )}

      {/* 4. KHỐI BIỂU ĐỒ EXECUTIVE DASHBOARD */}
      {(activeTab === "all" || activeTab === "charts") && (
        <PrecisionPlanResultChartsSection
          daily_sx_data={daily_sx_data}
          sxlosstrendingdata={sxlosstrendingdata}
          weekly_sx_data={weekly_sx_data}
          monthly_sx_data={monthly_sx_data}
          fromdate={fromdate}
          todate={todate}
          machine={machine}
          factory={factory}
          onExportDailyResult={() => exportExcel(daily_sx_data, "DAILY_SX_DATA")}
          onExportDailyLoss={() =>
            exportExcel(sxlosstrendingdata, "SX_LOSS_TREND_DATA")
          }
          onExportWeekly={() => exportExcel(weekly_sx_data, "WEEKLY_SX_DATA")}
          onExportMonthly={() => exportExcel(monthly_sx_data, "MONTHLY_SX_DATA")}
        />
      )}

      {/* 5. BẢNG TIẾN ĐỘ & HAO HỤT MÁY */}
      {(activeTab === "all" || activeTab === "achivement") && (
        <PrecisionPlanResultAchivementTable
          data={sxachivementdata}
          onExportExcel={(rows) => exportExcel(rows, "SX_ACHIVEMENT_DATA")}
        />
      )}

      {/* 6. BẢNG THỜI GIAN HOẠT ĐỘNG & HIỆU SUẤT MÁY */}
      {(activeTab === "all" || activeTab === "time") && (
        <PrecisionPlanResultTimeTable
          data={operation_time}
          onExportExcel={(rows) => exportExcel(rows, "OPERATION_TIME_DATA")}
        />
      )}
    </div>
  );
};

export default PLANRESULT;
