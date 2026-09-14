import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { RootState } from "../../../redux/store";
import { UserData } from "../../../api/GlobalInterface";
import { useDTCResultData } from "./PrecisionDTCRESULT/useDTCResultData";
import PrecisionDTCResultHeader from "./PrecisionDTCRESULT/PrecisionDTCResultHeader";
import PrecisionDTCResultControl from "./PrecisionDTCRESULT/PrecisionDTCResultControl";
import PrecisionDTCResultKpi from "./PrecisionDTCRESULT/PrecisionDTCResultKpi";
import PrecisionDTCResultTable from "./PrecisionDTCRESULT/PrecisionDTCResultTable";
import "./PrecisionDTCRESULT/PrecisionDTCRESULT.scss";

// Re-export types & helpers for backward compatibility across the codebase
export * from "./PrecisionDTCRESULT/dtcResultUtils";

const DTCRESULT: React.FC = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const {
    switchIDLOT,
    setSwitchIDLOT,
    dtc_id,
    setDTC_ID,
    remark,
    setRemark,
    uphangloat,
    setUpHangLoat,
    testList,
    testname,
    testcode_tenthat,
    inspectiondatatable,
    allDataTable,
    searchTerm,
    setSearchTerm,
    M_Name,
    M_Code,
    WidthCD,
    Cust_Cd,
    VendorLot,
    kpis,
    handleSelectTest,
    handleCellValueChanged,
    handleAddSample,
    readUploadFile,
    insertDTCResult,
    handleExportEX1,
    handleExportEX2,
    handletraDTCData,
  } = useDTCResultData();

  const handleOpenPivot = useCallback(() => {
    Swal.fire({
      title: "Tính năng PIVOT",
      text: "Tính năng phân tích xoay Pivot đang được hoàn thiện",
      icon: "info",
      confirmButtonText: "Đóng",
    });
  }, []);

  return (
    <div
      className={`precision-dtcresult ${
        isFullscreen ? "precision-dtcresult--fullscreen" : ""
      }`}
    >
      {/* Top Banner / Breadcrumb & Telemetry Header */}
      <PrecisionDTCResultHeader
        userData={userData}
        onRefresh={handletraDTCData}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
      />

      {/* Main Workspace Layout */}
      <div className="precision-dtcresult__workspace">
        {/* Top Control Card (ID/LOT Switch, Input, Context Pill, Remark, XRF Upload, Save Button, Category Pills) */}
        <PrecisionDTCResultControl
          switchIDLOT={switchIDLOT}
          setSwitchIDLOT={setSwitchIDLOT}
          dtc_id={dtc_id}
          setDTC_ID={setDTC_ID}
          remark={remark}
          setRemark={setRemark}
          uphangloat={uphangloat}
          setUpHangLoat={setUpHangLoat}
          M_Name={M_Name}
          M_Code={M_Code}
          WidthCD={WidthCD}
          Cust_Cd={Cust_Cd}
          VendorLot={VendorLot}
          testList={testList}
          testname={testname}
          testcode_tenthat={testcode_tenthat}
          onSelectTest={handleSelectTest}
          onReadUploadFile={readUploadFile}
          onSaveResults={insertDTCResult}
          onSearch={handletraDTCData}
        />

        {/* Realtime Micro-KPI Ribbon */}
        <PrecisionDTCResultKpi kpis={kpis} />

        {/* High-Density Measurement Data Table */}
        <PrecisionDTCResultTable
          data={inspectiondatatable}
          totalCount={allDataTable.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRefresh={handletraDTCData}
          onExportEX1={handleExportEX1}
          onExportEX2={handleExportEX2}
          onOpenPivot={handleOpenPivot}
          onAddSample={handleAddSample}
          onCellValueChanged={handleCellValueChanged}
        />
      </div>
    </div>
  );
};

export default DTCRESULT;
