import React, { useCallback, useMemo, useState } from "react";
import { createFilterOptions } from "@mui/material";
import { getCompany } from "../../../api/Api";
import AGTable from "../../../components/DataTable/AGTable";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import { SaveExcel } from "../../../api/services/excelService";

import "./PrecisionADDSPECDTC/PrecisionADDSPECDTC.scss";
import { PrecisionADDSPECDTCKpi } from "./PrecisionADDSPECDTC/PrecisionADDSPECDTCKpi";
import { PrecisionADDSPECDTCSidebar } from "./PrecisionADDSPECDTC/PrecisionADDSPECDTCSidebar";
import { buildADDSPECColumns } from "./PrecisionADDSPECDTC/PrecisionADDSPECDTCColumns";
import { useADDSPECData } from "./PrecisionADDSPECDTC/useADDSPECData";

// Mobile Subcomponents
import PrecisionADDSPECDTCMobileToolbar from "./PrecisionADDSPECDTC/PrecisionADDSPECDTCMobileToolbar";
import PrecisionADDSPECDTCMobileConfigDrawer from "./PrecisionADDSPECDTC/PrecisionADDSPECDTCMobileConfigDrawer";

const ADDSPECTDTC = () => {
  const isMobile = useIsMobile();

  const {
    codeList,
    selectedCode,
    setSelectedCode,
    materialList,
    selectedMaterial,
    setSelectedMaterial,
    testList,
    testname,
    setTestName,
    checkNVL,
    toggleCheckNVL,
    addedSpec,
    inspectiondatatable,
    quickFilterText,
    setQuickFilterText,
    selectedCount,
    setSelectedCount,
    selectedRowsData,
    handletraDTCData,
    handleInsertSpec,
    handleUpdateSpec,
    checkAddedSpec,
    copyXRFSpec,
    copyXRFSpecSDI,
    handleAddNewPoint,
    handleDeleteSelected,
  } = useADDSPECData();

  // Trạng thái mobile config drawer
  const [showMobileConfig, setShowMobileConfig] = useState(false);

  const filterOptions1 = useMemo(
    () =>
      createFilterOptions({
        matchFrom: "any",
        limit: 100,
      }),
    []
  );

  const filteredGridData = useMemo(() => {
    if (!quickFilterText.trim()) return inspectiondatatable;
    const kw = quickFilterText.toLowerCase();
    return inspectiondatatable.filter((item) =>
      Object.values(item).some((val) => String(val).toLowerCase().includes(kw))
    );
  }, [inspectiondatatable, quickFilterText]);

  const columns = useMemo(() => buildADDSPECColumns(), []);

  // Đếm số cấu hình đang kích hoạt (có code/material/test chọn)
  const activeConfigCount = useMemo(() => {
    let count = 0;
    if (selectedCode) count++;
    if (selectedMaterial) count++;
    if (testname !== "0") count++;
    if (checkNVL) count++;
    return count;
  }, [selectedCode, selectedMaterial, testname, checkNVL]);

  // Export handlers
  const handleExportEX1 = useCallback(() => {
    SaveExcel(filteredGridData, "SPEC_DTC_FILTERED");
  }, [filteredGridData]);

  const handleExportEX2 = useCallback(() => {
    SaveExcel(inspectiondatatable, "SPEC_DTC_ALL");
  }, [inspectiondatatable]);

  const handleExportPivot = useCallback(() => {
    SaveExcel(filteredGridData, "SPEC_DTC_PIVOT");
  }, [filteredGridData]);

  // Sidebar shared callbacks
  const handleChangeTestName = useCallback(
    (val: string) => {
      setTestName(val);
      handletraDTCData(val);
      checkAddedSpec(selectedMaterial?.M_CODE, selectedCode?.G_CODE);
    },
    [setTestName, handletraDTCData, checkAddedSpec, selectedMaterial, selectedCode]
  );

  const handleLoadSpec = useCallback(() => {
    handletraDTCData(testname);
    checkAddedSpec(selectedMaterial?.M_CODE, selectedCode?.G_CODE);
  }, [handletraDTCData, testname, checkAddedSpec, selectedMaterial, selectedCode]);

  return (
    <div className={`precision-addspecdtc ${isMobile ? "is-mobile" : ""}`}>
      {/* ========================================================================= */}
      {/* GIAO DIỆN DESKTOP (> 768px): GIỮ NGUYÊN 100% BỐ CỤC BAN ĐẦU             */}
      {/* ========================================================================= */}
      {!isMobile && (
        <>
          {/* 4 KPI Cards Realtime */}
          <PrecisionADDSPECDTCKpi
            inspectionData={inspectiondatatable}
            addedSpec={addedSpec}
            checkNVL={checkNVL}
            selectedCode={selectedCode}
            selectedMaterial={selectedMaterial}
          />

          {/* Split Workspace: Left Panel + Right Grid */}
          <div className="precision-addspecdtc__workspace">
            {/* Left Sidebar Configuration */}
            <PrecisionADDSPECDTCSidebar
              checkNVL={checkNVL}
              onToggleCheckNVL={toggleCheckNVL}
              codeList={codeList}
              selectedCode={selectedCode}
              onSelectCode={setSelectedCode}
              materialList={materialList}
              selectedMaterial={selectedMaterial}
              onSelectMaterial={setSelectedMaterial}
              filterOptions1={filterOptions1}
              testList={testList}
              testname={testname}
              onChangeTestName={handleChangeTestName}
              onLoadSpec={handleLoadSpec}
              onAddSpec={handleInsertSpec}
              onUpdateSpec={handleUpdateSpec}
              addedSpec={addedSpec}
              showCopyXRF={getCompany() === "CMS" && testname === "3"}
              onCopyXRFSS={() => copyXRFSpec(selectedMaterial?.M_CODE, selectedCode?.G_CODE)}
              onCopyXRFSDI={() => copyXRFSpecSDI(selectedMaterial?.M_CODE, selectedCode?.G_CODE)}
            />

            {/* Right Data Grid Container */}
            <section className="precision-addspecdtc__gridContainer">
              {/* Grid Toolbar */}
              <div className="precision-addspecdtc__gridToolbar">
                <div className="precision-addspecdtc__gridToolbarLeft">
                  <button
                    type="button"
                    className="precision-addspecdtc__toolBtn precision-addspecdtc__toolBtn--excel"
                    onClick={handleExportEX1}
                    title="Xuất dữ liệu đang hiển thị ra Excel"
                  >
                    <span>📊</span> EX1 (Lọc)
                  </button>

                  <button
                    type="button"
                    className="precision-addspecdtc__toolBtn"
                    onClick={handleExportEX2}
                    title="Xuất toàn bộ dữ liệu ra Excel"
                  >
                    <span>📋</span> EX2 (Toàn bộ)
                  </button>

                  <button
                    type="button"
                    className="precision-addspecdtc__toolBtn precision-addspecdtc__toolBtn--pivot"
                    onClick={handleExportPivot}
                    title="Xuất dữ liệu phân tích PIVOT"
                  >
                    <span>🔀</span> PIVOT
                  </button>

                  <div className="precision-addspecdtc__gridDivider"></div>

                  <button
                    type="button"
                    className="precision-addspecdtc__toolBtn precision-addspecdtc__toolBtn--addPoint"
                    onClick={handleAddNewPoint}
                    title="Thêm một điểm đo mới vào bảng"
                  >
                    <span>+</span> Thêm Điểm Đo
                  </button>

                  <button
                    type="button"
                    className="precision-addspecdtc__toolBtn precision-addspecdtc__toolBtn--delete"
                    onClick={handleDeleteSelected}
                    title="Xóa các dòng đang chọn trên bảng"
                  >
                    <span>✕</span> Xóa
                  </button>
                </div>

                <div className="precision-addspecdtc__gridToolbarRight">
                  <div className="precision-addspecdtc__searchBox">
                    <input
                      type="text"
                      placeholder="Lọc nhanh trên lưới..."
                      value={quickFilterText}
                      onChange={(e) => setQuickFilterText(e.target.value)}
                    />
                    <span>🔍</span>
                  </div>

                  <button
                    type="button"
                    className="precision-addspecdtc__toolBtn precision-addspecdtc__toolBtn--save"
                    onClick={handleInsertSpec}
                    title="Lưu tất cả điểm đo vào CSDL"
                  >
                    <span>💾</span> LƯU DỮ LIỆU
                  </button>
                </div>
              </div>

              {/* Grid Body */}
              <div className="precision-addspecdtc__gridBody">
                <AGTable
                  suppressRowClickSelection={false}
                  columns={columns}
                  data={filteredGridData}
                  onSelectionChange={(e: any) => {
                    const rows = e?.api ? e.api.getSelectedRows() : [];
                    selectedRowsData.current = rows;
                    setSelectedCount(rows.length);
                  }}
                />
              </div>

              {/* Grid Status Bar */}
              <div className="precision-addspecdtc__gridStatus">
                <div className="status-left">
                  <span>Total: <strong>{filteredGridData.length} rows</strong></span>
                  <span>|</span>
                  <span>Đã chọn: <strong style={{ color: "#2563eb" }}>{selectedCount} dòng</strong></span>
                  <span>|</span>
                  <span className="sync-tag">
                    <span className="dot"></span>
                    Dữ liệu đồng bộ với máy chủ
                  </span>
                </div>
                <div className="status-right">
                  <span>Khổ rộng bảng: 100%</span>
                  <span>•</span>
                  <span>Chế độ: Đọc/Ghi (RW)</span>
                </div>
              </div>
            </section>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* GIAO DIỆN MOBILE (≤ 768px): TỐI ƯU CÔNG THÁI HỌC VÀ TỐI ĐA KHÔNG GIAN  */}
      {/* ========================================================================= */}
      {isMobile && (
        <>
          {/* 1. Mobile Toolbar 3 Hàng Công Thái Học */}
          <PrecisionADDSPECDTCMobileToolbar
            quickFilterText={quickFilterText}
            onQuickFilterChange={setQuickFilterText}
            onOpenConfigDrawer={() => setShowMobileConfig(true)}
            activeConfigCount={activeConfigCount}
            onExportEX1={handleExportEX1}
            onExportEX2={handleExportEX2}
            onExportPivot={handleExportPivot}
            onAddPoint={handleAddNewPoint}
            onDeleteSelected={handleDeleteSelected}
            onSave={handleInsertSpec}
            selectedCount={selectedCount}
            checkNVL={checkNVL}
            onToggleCheckNVL={toggleCheckNVL}
          />

          {/* 2. AGTable Container Chiếm Trọn Không Gian Còn Lại */}
          <div className="precision-addspecdtc__mobileGridContainer">
            <AGTable
              suppressRowClickSelection={false}
              columns={columns}
              data={filteredGridData}
              onSelectionChange={(e: any) => {
                const rows = e?.api ? e.api.getSelectedRows() : [];
                selectedRowsData.current = rows;
                setSelectedCount(rows.length);
              }}
            />
          </div>

          {/* 3. Mobile Status Bar */}
          <div className="precision-addspecdtc__mobileStatusBar">
            <span>{filteredGridData.length} dòng</span>
            <span>•</span>
            <span style={{ color: "#2563eb", fontWeight: 700 }}>{selectedCount} chọn</span>
            <span>•</span>
            <span>{checkNVL ? "NVL" : "SP"}</span>
          </div>

          {/* 4. Bottom Sheet Config Drawer (Zero-Blur) */}
          {showMobileConfig && (
            <PrecisionADDSPECDTCMobileConfigDrawer
              isOpen={showMobileConfig}
              onClose={() => setShowMobileConfig(false)}
              checkNVL={checkNVL}
              onToggleCheckNVL={toggleCheckNVL}
              codeList={codeList}
              selectedCode={selectedCode}
              onSelectCode={setSelectedCode}
              materialList={materialList}
              selectedMaterial={selectedMaterial}
              onSelectMaterial={setSelectedMaterial}
              filterOptions1={filterOptions1}
              testList={testList}
              testname={testname}
              onChangeTestName={handleChangeTestName}
              onLoadSpec={handleLoadSpec}
              onAddSpec={handleInsertSpec}
              onUpdateSpec={handleUpdateSpec}
              addedSpec={addedSpec}
              onCopyXRFSS={() => copyXRFSpec(selectedMaterial?.M_CODE, selectedCode?.G_CODE)}
              onCopyXRFSDI={() => copyXRFSpecSDI(selectedMaterial?.M_CODE, selectedCode?.G_CODE)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ADDSPECTDTC;
