import React, { useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { RootState } from "../../../redux/store";
import { UserData } from "../../../api/GlobalInterface";
import { useDKDTCData } from "./PrecisionDKDTC/useDKDTCData";
import PrecisionDKDTCHeader from "./PrecisionDKDTC/PrecisionDKDTCHeader";
import PrecisionDKDTCSidebar from "./PrecisionDKDTC/PrecisionDKDTCSidebar";
import PrecisionDKDTCKpi from "./PrecisionDKDTC/PrecisionDKDTCKpi";
import PrecisionDKDTCTable from "./PrecisionDKDTC/PrecisionDKDTCTable";
import PrecisionDKDTCScannerModal from "./PrecisionDKDTC/PrecisionDKDTCScannerModal";
import "./PrecisionDKDTC/PrecisionDKDTC.scss";

const DKDTC: React.FC = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const {
    testtype,
    setTestType,
    inputno,
    setInputNo,
    checkNVL,
    setCheckNVL,
    request_empl,
    setRequestEmpl,
    remark,
    setRemark,
    testList,
    inspectiondatatable,
    allDataTable,
    empl_name,
    showdkbs,
    setShowDKBS,
    oldDTC_ID,
    setOldDTC_ID,
    g_name,
    m_name,
    lotncc,
    setLotNCC,
    searchTerm,
    setSearchTerm,
    scannerOpen,
    setScannerOpen,
    scannerTarget,
    setScannerTarget,
    kpis,
    addedSpec,
    handleToggleTestItem,
    handleSelectAllTests,
    handletraDTCData,
    registerDTC,
    handleExportEX1,
    handleExportEX2,
    handleScanSuccess,
    checkEMPL_NAME,
  } = useDKDTCData();

  const handleOpenScanner = (target: "inputno" | "lotncc") => {
    setScannerTarget(target);
    setScannerOpen(true);
  };

  const handleOpenPivot = () => {
    Swal.fire({
      title: "Tính năng PIVOT",
      text: "Tính năng phân tích xoay Pivot đang được hoàn thiện",
      icon: "info",
      confirmButtonText: "Đóng",
    });
  };

  return (
    <div className={`precision-dkdtc ${isFullscreen ? "precision-dkdtc--fullscreen" : ""}`}>
      {/* Top Banner / Breadcrumb & Telemetry Header */}
      <PrecisionDKDTCHeader
        userData={userData}
        onRefresh={handletraDTCData}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
      />

      {/* Main Split 2-Panel Workspace: Left Sidebar + Right Content */}
      <div className="precision-dkdtc__workspace">
        {/* Left Panel: Registration Sidebar */}
        <PrecisionDKDTCSidebar
          checkNVL={checkNVL}
          setCheckNVL={setCheckNVL}
          testtype={testtype}
          setTestType={setTestType}
          inputno={inputno}
          setInputNo={setInputNo}
          lotncc={lotncc}
          setLotNCC={setLotNCC}
          request_empl={request_empl}
          setRequestEmpl={setRequestEmpl}
          empl_name={empl_name}
          g_name={g_name}
          m_name={m_name}
          testList={testList}
          addedSpec={addedSpec}
          showdkbs={showdkbs}
          setShowDKBS={setShowDKBS}
          oldDTC_ID={oldDTC_ID}
          setOldDTC_ID={setOldDTC_ID}
          remark={remark}
          setRemark={setRemark}
          onOpenScanner={handleOpenScanner}
          onToggleTestItem={handleToggleTestItem}
          onSelectAllTests={handleSelectAllTests}
          onRegister={registerDTC}
          checkEMPL_NAME={checkEMPL_NAME}
        />

        {/* Right Panel: Micro-KPI Cards + High-Density AG-Grid Table */}
        <div className="precision-dkdtc__content">
          {/* Micro-KPI Cards Realtime */}
          <PrecisionDKDTCKpi kpis={kpis} />

          {/* AGTable with SaaS Toolbar & Status Bar */}
          <PrecisionDKDTCTable
            data={inspectiondatatable}
            totalCount={allDataTable.length}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onRefresh={handletraDTCData}
            onExportEX1={handleExportEX1}
            onExportEX2={handleExportEX2}
            onOpenPivot={handleOpenPivot}
          />
        </div>
      </div>

      {/* Barcode / QR Camera Scanner Modal */}
      <PrecisionDKDTCScannerModal
        open={scannerOpen}
        title={
          scannerTarget === "lotncc"
            ? "QUÉT MÃ LOT NCC"
            : checkNVL
            ? "QUÉT MÃ LOT NVL ERP"
            : "QUÉT MÃ YCSX / LABEL_ID"
        }
        onClose={() => setScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};

export default DKDTC;
