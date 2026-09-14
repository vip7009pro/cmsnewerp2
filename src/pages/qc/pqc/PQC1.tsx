import React, { useMemo } from "react";
import "./PrecisionPQC1/PrecisionPQC1.scss";
import { usePQC1Data } from "./PrecisionPQC1/usePQC1Data";
import { getPQC1Columns } from "./PrecisionPQC1/PrecisionPQC1Columns";
import { PrecisionPQC1Header } from "./PrecisionPQC1/PrecisionPQC1Header";
import { PrecisionPQC1Kpi } from "./PrecisionPQC1/PrecisionPQC1Kpi";
import { PrecisionPQC1InputCard } from "./PrecisionPQC1/PrecisionPQC1InputCard";
import { PrecisionPQC1DirectiveCard } from "./PrecisionPQC1/PrecisionPQC1DirectiveCard";
import { PrecisionPQC1Toolbar } from "./PrecisionPQC1/PrecisionPQC1Toolbar";
import { PrecisionPQC1Table } from "./PrecisionPQC1/PrecisionPQC1Table";

const PQC1: React.FC = () => {
  const pqc1 = usePQC1Data();
  const columns = useMemo(() => getPQC1Columns(), []);

  return (
    <div className={`precision-pqc1 ${pqc1.isFullScreen ? "fullscreen" : ""}`}>
      {/* 1. Header chuẩn Stitch */}
      <PrecisionPQC1Header
        userData={pqc1.userData}
        isFullScreen={pqc1.isFullScreen}
        onToggleFullScreen={() => pqc1.setIsFullScreen((prev) => !prev)}
        onReload={pqc1.traPQC1Data}
      />

      {/* 2. Micro-cards KPI */}
      <PrecisionPQC1Kpi kpis={pqc1.kpis} />

      {/* 3. Vùng nhập liệu & Thông tin chỉ thị kỹ thuật */}
      <div className={`precision-pqc1-workarea ${!pqc1.showhideinput ? "collapsed" : ""}`}>
        <PrecisionPQC1InputCard
          userData={pqc1.userData}
          factory={pqc1.factory}
          setFactory={pqc1.setFactory}
          planId={pqc1.planId}
          setPlanId={pqc1.setPlanId}
          lineqc_empl={pqc1.lineqc_empl}
          setLineqc_empl={pqc1.setLineqc_empl}
          prod_leader_empl={pqc1.prod_leader_empl}
          setprod_leader_empl={pqc1.setprod_leader_empl}
          remark={pqc1.remark}
          setReMark={pqc1.setReMark}
          empl_name={pqc1.empl_name}
          empl_name2={pqc1.empl_name2}
          g_name={pqc1.g_name}
          refArray={pqc1.refArray}
          handleKeyDown={pqc1.handleKeyDown}
          checkPlanID={pqc1.checkPlanID}
          checkDataSX={pqc1.checkDataSX}
          checkEMPL_NAME={pqc1.checkEMPL_NAME}
          onSaveSetting={pqc1.inputDataPqc1}
          onUpdateSampleQty={pqc1.updateSampleQty}
        />

        {pqc1.showhideinput && (
          <PrecisionPQC1DirectiveCard
            process_lot_no={pqc1.process_lot_no}
            inputno={pqc1.inputno}
            m_name={pqc1.m_name}
            sx_data={pqc1.sx_data}
            ktdtc={pqc1.ktdtc}
            roll_qty={pqc1.roll_qty}
            in_cfm_qty={pqc1.in_cfm_qty}
            lieql_sx={pqc1.lieql_sx}
          />
        )}
      </div>

      {/* 4. Action Toolbar phía trên bảng */}
      <PrecisionPQC1Toolbar
        showhideinput={pqc1.showhideinput}
        onToggleShowHideInput={() => pqc1.setShowHideInput((prev) => !prev)}
        onTraData={pqc1.traPQC1Data}
        onUpdateSampleQty={pqc1.updateSampleQty}
        quickFilter={pqc1.quickFilter}
        onQuickFilterChange={pqc1.setQuickFilter}
        onExportExcel={pqc1.exportExcel}
        totalCount={pqc1.pqc1datatable.length}
      />

      {/* 5. AGTable High-Density tràn viền (zero footer) */}
      <PrecisionPQC1Table
        data={pqc1.pqc1datatable}
        columns={columns}
        quickFilterText={pqc1.quickFilter}
        onSelectionChange={(params: any) => {
          pqc1.selectedRowsDataA.current = params!.api.getSelectedRows();
        }}
      />
    </div>
  );
};

export default React.memo(PQC1);
