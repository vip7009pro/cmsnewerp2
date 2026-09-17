import React from "react";
import "./PrecisionAchivementTb/PrecisionAchivementTb.scss";
import { useAchivementTbData } from "./PrecisionAchivementTb/useAchivementTbData";
import { PrecisionAchivementTbHeader } from "./PrecisionAchivementTb/PrecisionAchivementTbHeader";
import { PrecisionAchivementTbToolbar } from "./PrecisionAchivementTb/PrecisionAchivementTbToolbar";
import { PrecisionAchivementTbKpi } from "./PrecisionAchivementTb/PrecisionAchivementTbKpi";
import { PrecisionAchivementTbGrid } from "./PrecisionAchivementTb/PrecisionAchivementTbGrid";

const ACHIVEMENTTB: React.FC = () => {
  const {
    machine_list,
    fromdate,
    setFromDate,
    factory,
    setFactory,
    machine,
    setMachine,
    plandatatable,
    summarydata,
    isLoading,
    loadTiLeDat,
    exportExcel,
  } = useAchivementTbData();

  return (
    <div className="precision-achivementtb">
      {/* 1. HEADER BAR CÔNG NGHIỆP */}
      <PrecisionAchivementTbHeader
        factory={factory}
        machine={machine}
        fromdate={fromdate}
      />

      {/* 2. TOOLBAR BỘ LỌC DỮ LIỆU */}
      <PrecisionAchivementTbToolbar
        fromdate={fromdate}
        setFromDate={setFromDate}
        factory={factory}
        setFactory={setFactory}
        machine={machine}
        setMachine={setMachine}
        machine_list={machine_list}
        onSearch={loadTiLeDat}
        isLoading={isLoading}
      />

      {/* 3. DASHBOARD 6 MICRO-CARDS KPI REALTIME */}
      <PrecisionAchivementTbKpi
        summaryData={summarydata}
        planDataTable={plandatatable}
      />

      {/* 4. BẢNG AG-GRID HIGH-DENSITY */}
      <PrecisionAchivementTbGrid
        data={plandatatable}
        onExportEX1={(rows) => exportExcel(rows, "TI_LE_DAT_LOC")}
        onExportEX2={(rows) => exportExcel(rows, "TI_LE_DAT_ALL")}
      />
    </div>
  );
};

export default ACHIVEMENTTB;
