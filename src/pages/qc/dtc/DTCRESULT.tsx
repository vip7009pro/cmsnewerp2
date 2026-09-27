import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { RootState } from "../../../redux/store";
import { UserData } from "../../../api/GlobalInterface";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import { useDTCResultData } from "./PrecisionDTCRESULT/useDTCResultData";
import PrecisionDTCResultHeader from "./PrecisionDTCRESULT/PrecisionDTCResultHeader";
import PrecisionDTCResultControl from "./PrecisionDTCRESULT/PrecisionDTCResultControl";
import PrecisionDTCResultKpi from "./PrecisionDTCRESULT/PrecisionDTCResultKpi";
import PrecisionDTCResultTable from "./PrecisionDTCRESULT/PrecisionDTCResultTable";
import PrecisionDTCResultMobileHeader from "./PrecisionDTCRESULT/PrecisionDTCResultMobileHeader";
import PrecisionDTCResultMobileToolbar from "./PrecisionDTCRESULT/PrecisionDTCResultMobileToolbar";
import PrecisionDTCResultRecordSheet from "./PrecisionDTCRESULT/PrecisionDTCResultRecordSheet";
import "./PrecisionDTCRESULT/PrecisionDTCRESULT.scss";

// Re-export types & helpers for backward compatibility across the codebase
export * from "./PrecisionDTCRESULT/dtcResultUtils";

const DTCRESULT: React.FC = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );
  const isMobile = useIsMobile();

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  // Trạng thái chuyên biệt cho Mobile ERP
  const [showMobileKpi, setShowMobileKpi] = useState<boolean>(false);
  const [showRecordSheet, setShowRecordSheet] = useState<boolean>(false);
  const [showTableFilter, setShowTableFilter] = useState<boolean>(true);

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

  // Gom toàn bộ props của form nhập liệu để tái sử dụng ở cả Control (desktop) và RecordSheet (mobile)
  const controlProps = {
    switchIDLOT,
    setSwitchIDLOT,
    dtc_id,
    setDTC_ID,
    remark,
    setRemark,
    uphangloat,
    setUpHangLoat,
    M_Name,
    M_Code,
    WidthCD,
    Cust_Cd,
    VendorLot,
    testList,
    testname,
    testcode_tenthat,
    onSelectTest: handleSelectTest,
    onReadUploadFile: readUploadFile,
    onSaveResults: insertDTCResult,
    onSearch: handletraDTCData,
  };

  return (
    <div
      className={`precision-dtcresult ${isMobile ? "is-mobile" : ""} ${
        isFullscreen ? "precision-dtcresult--fullscreen" : ""
      }`}
    >
      {/* ========================================================================= */}
      {/* GIAO DIỆN DESKTOP (> 768px): GIỮ NGUYÊN 100% BỐ CỤC VÀ HÀNH VI BAN ĐẦU   */}
      {/* ========================================================================= */}
      {!isMobile && (
        <>
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
            <PrecisionDTCResultControl {...controlProps} />

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
        </>
      )}

      {/* ========================================================================= */}
      {/* GIAO DIỆN MOBILE (≤ 768px): TỐI ĐA KHÔNG GIAN BẢNG DỮ LIỆU              */}
      {/* ========================================================================= */}
      {isMobile && (
        <>
          {/* 1. Mobile Header tinh gọn: brand + đếm dòng + toggle KPI + mở Phiếu nhập */}
          <PrecisionDTCResultMobileHeader
            totalCount={allDataTable.length}
            filteredCount={inspectiondatatable.length}
            showKpi={showMobileKpi}
            onToggleKpi={() => setShowMobileKpi((prev) => !prev)}
            onOpenRecordSheet={() => setShowRecordSheet(true)}
            hasContext={Boolean(M_Name)}
            activeTestName={testcode_tenthat}
            onReload={handletraDTCData}
          />

          {/* 2. Micro-KPI compact (ẩn theo mặc định để nhường chỗ cho bảng) */}
          {showMobileKpi && <PrecisionDTCResultKpi kpis={kpis} compact />}

          {/* 3. Mobile Toolbar công thái học: search + tiện ích cuộn ngang */}
          <PrecisionDTCResultMobileToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onOpenRecordSheet={() => setShowRecordSheet(true)}
            onAddSample={handleAddSample}
            onExportEX1={handleExportEX1}
            onExportEX2={handleExportEX2}
            onOpenPivot={handleOpenPivot}
            showTableFilter={showTableFilter}
            onToggleTableFilter={() => setShowTableFilter((prev) => !prev)}
          />

          {/* 4. AGTable chiếm trọn không gian còn lại */}
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
            isMobile
            showFilter={showTableFilter}
          />

          {/* 5. Bottom Sheet Phiếu Nhập Kết Quả (chứa form đầy đủ, Zero-Blur) */}
          <PrecisionDTCResultRecordSheet
            isOpen={showRecordSheet}
            onClose={() => setShowRecordSheet(false)}
            {...controlProps}
          />
        </>
      )}
    </div>
  );
};

export default DTCRESULT;
