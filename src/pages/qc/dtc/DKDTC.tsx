import React, { useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { RootState } from "../../../redux/store";
import { UserData } from "../../../api/GlobalInterface";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import { useDKDTCData } from "./PrecisionDKDTC/useDKDTCData";
import PrecisionDKDTCHeader from "./PrecisionDKDTC/PrecisionDKDTCHeader";
import PrecisionDKDTCSidebar from "./PrecisionDKDTC/PrecisionDKDTCSidebar";
import PrecisionDKDTCKpi from "./PrecisionDKDTC/PrecisionDKDTCKpi";
import PrecisionDKDTCTable from "./PrecisionDKDTC/PrecisionDKDTCTable";
import PrecisionDKDTCScannerModal from "./PrecisionDKDTC/PrecisionDKDTCScannerModal";
import PrecisionDKDTCMobileHeader from "./PrecisionDKDTC/PrecisionDKDTCMobileHeader";
import PrecisionDKDTCMobileToolbar from "./PrecisionDKDTC/PrecisionDKDTCMobileToolbar";
import PrecisionDKDTCRegisterSheet from "./PrecisionDKDTC/PrecisionDKDTCRegisterSheet";
import "./PrecisionDKDTC/PrecisionDKDTC.scss";

const DKDTC: React.FC = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const isMobile = useIsMobile();

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Trạng thái chuyên biệt cho Mobile ERP
  const [showMobileKpi, setShowMobileKpi] = useState<boolean>(false);
  const [showRegisterSheet, setShowRegisterSheet] = useState<boolean>(false);
  const [showTableFilter, setShowTableFilter] = useState<boolean>(true);

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

  // Props dùng chung cho Sidebar (desktop) và Bottom Sheet đăng ký (mobile)
  const sidebarProps = {
    checkNVL,
    setCheckNVL,
    testtype,
    setTestType,
    inputno,
    setInputNo,
    lotncc,
    setLotNCC,
    request_empl,
    setRequestEmpl,
    empl_name,
    g_name,
    m_name,
    testList,
    addedSpec,
    showdkbs,
    setShowDKBS,
    oldDTC_ID,
    setOldDTC_ID,
    remark,
    setRemark,
    onOpenScanner: handleOpenScanner,
    onToggleTestItem: handleToggleTestItem,
    onSelectAllTests: handleSelectAllTests,
    onRegister: registerDTC,
    checkEMPL_NAME,
  };

  return (
    <div className={`precision-dkdtc ${isMobile ? "is-mobile" : ""} ${isFullscreen ? "precision-dkdtc--fullscreen" : ""}`}>
      {/* ========================================================================= */}
      {/* GIAO DIỆN DESKTOP (> 768px): GIỮ NGUYÊN 100% BỐ CỤC BAN ĐẦU             */}
      {/* ========================================================================= */}
      {!isMobile && (
        <>
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
            <PrecisionDKDTCSidebar {...sidebarProps} />

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
        </>
      )}

      {/* ========================================================================= */}
      {/* GIAO DIỆN MOBILE (≤ 768px): TỐI ĐA KHÔNG GIAN BẢNG DỮ LIỆU             */}
      {/* ========================================================================= */}
      {isMobile && (
        <>
          {/* 1. Mobile Header tinh gọn: brand + telemetry + toggle KPI */}
          <PrecisionDKDTCMobileHeader
            totalCount={allDataTable.length}
            filteredCount={inspectiondatatable.length}
            checkNVL={checkNVL}
            showKpi={showMobileKpi}
            onToggleKpi={() => setShowMobileKpi(!showMobileKpi)}
            onReload={handletraDTCData}
          />

          {/* 2. Micro-KPI compact (ẩn theo mặc định để nhường chỗ cho bảng) */}
          {showMobileKpi && <PrecisionDKDTCKpi kpis={kpis} compact />}

          {/* 3. Mobile Toolbar công thái học: search + tiện ích cuộn ngang */}
          <PrecisionDKDTCMobileToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onOpenRegister={() => setShowRegisterSheet(true)}
            onExportEX1={handleExportEX1}
            onExportEX2={handleExportEX2}
            onOpenPivot={handleOpenPivot}
            onReload={handletraDTCData}
            onReset={() => setSearchTerm("")}
            showTableFilter={showTableFilter}
            onToggleTableFilter={() => setShowTableFilter(!showTableFilter)}
            selectedTestsCount={kpis.selectedTestsCount}
          />

          {/* 4. AGTable chiếm trọn không gian còn lại */}
          <PrecisionDKDTCTable
            data={inspectiondatatable}
            totalCount={allDataTable.length}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onRefresh={handletraDTCData}
            onExportEX1={handleExportEX1}
            onExportEX2={handleExportEX2}
            onOpenPivot={handleOpenPivot}
            isMobile
            showFilter={showTableFilter}
          />

          {/* 5. Bottom Sheet Phiếu Đăng Ký Test (chứa form đầy đủ, Zero-Blur) */}
          <PrecisionDKDTCRegisterSheet
            isOpen={showRegisterSheet}
            onClose={() => setShowRegisterSheet(false)}
            {...sidebarProps}
          />
        </>
      )}

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
