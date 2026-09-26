import React, { useMemo, useState } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import "./PrecisionLichSuInputLieu/PrecisionLichSuInputLieu.scss";
import useIsMobile from "../../../../components/Navbar/AccountInfo/useIsMobile";
import { useLichSuInputLieuData } from "./PrecisionLichSuInputLieu/useLichSuInputLieuData";
import { columnsLichSuInputLieu } from "./PrecisionLichSuInputLieu/PrecisionLichSuInputLieuColumns";
import PrecisionLichSuInputLieuHeader from "./PrecisionLichSuInputLieu/PrecisionLichSuInputLieuHeader";
import PrecisionLichSuInputLieuKpi from "./PrecisionLichSuInputLieu/PrecisionLichSuInputLieuKpi";
import PrecisionLichSuInputLieuToolbar from "./PrecisionLichSuInputLieu/PrecisionLichSuInputLieuToolbar";
import PrecisionLichSuInputLieuMobileToolbar from "./PrecisionLichSuInputLieu/PrecisionLichSuInputLieuMobileToolbar";
import PrecisionLichSuInputLieuMobileFilterDrawer from "./PrecisionLichSuInputLieu/PrecisionLichSuInputLieuMobileFilterDrawer";
import { FiSearch, FiDownload } from "react-icons/fi";

const LICHSUINPUTLIEU: React.FC = () => {
  const isMobile = useIsMobile();
  const [showMobileFilterDrawer, setShowMobileFilterDrawer] = useState<boolean>(false);

  const {
    fromDate,
    toDate,
    allTime,
    prodRequestNo,
    planId,
    codeCMS,
    codeKD,
    mName,
    mCode,
    inspectiondatatable,
    filteredDataTable,
    quickSearchText,
    isLoading,
    setFromDate,
    setToDate,
    setAllTime,
    setProdRequestNo,
    setPlanId,
    setCodeCMS,
    setCodeKD,
    setMName,
    setMCode,
    setQuickSearchText,
    handleLoadLichSu,
    handleReset,
    handleExportExcel,
  } = useLichSuInputLieuData();

  const columns = useMemo(() => columnsLichSuInputLieu, []);

  // Đếm số điều kiện lọc tùy chỉnh đang áp dụng (để hiển thị badge trên mobile)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (allTime) count++;
    if (prodRequestNo.trim() !== "") count++;
    if (planId.trim() !== "") count++;
    if (codeCMS.trim() !== "") count++;
    if (codeKD.trim() !== "") count++;
    if (mName.trim() !== "") count++;
    if (mCode.trim() !== "") count++;
    return count;
  }, [allTime, prodRequestNo, planId, codeCMS, codeKD, mName, mCode]);

  return (
    <div className={`precision-inputlieu${isMobile ? " is-mobile" : ""}`}>
      {/* 1. Header Bar Công Nghiệp - Chỉ render trên Desktop */}
      {!isMobile && (
        <PrecisionLichSuInputLieuHeader
          totalRecords={inspectiondatatable.length}
          isLoading={isLoading}
          onReload={handleLoadLichSu}
        />
      )}

      {/* 2. Khối 5 Micro-Cards KPI Thống Kê Realtime - Chỉ render trên Desktop */}
      {!isMobile && <PrecisionLichSuInputLieuKpi data={inspectiondatatable} />}

      {/* 3. Dải Lọc Điều Hành Top Toolbar - Desktop */}
      {!isMobile && (
        <PrecisionLichSuInputLieuToolbar
          fromDate={fromDate}
          toDate={toDate}
          allTime={allTime}
          prodRequestNo={prodRequestNo}
          planId={planId}
          codeCMS={codeCMS}
          codeKD={codeKD}
          mName={mName}
          mCode={mCode}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onAllTimeChange={setAllTime}
          onProdRequestNoChange={setProdRequestNo}
          onPlanIdChange={setPlanId}
          onCodeCMSChange={setCodeCMS}
          onCodeKDChange={setCodeKD}
          onMNameChange={setMName}
          onMCodeChange={setMCode}
          onSearch={handleLoadLichSu}
          onReset={handleReset}
          onExportExcel={() => handleExportExcel()}
        />
      )}

      {/* 3B. Toolbar Thích Ứng Công Thái Học 2 Hàng - Mobile */}
      {isMobile && (
        <PrecisionLichSuInputLieuMobileToolbar
          quickSearchText={quickSearchText}
          onQuickSearchChange={setQuickSearchText}
          onClearSearch={() => setQuickSearchText("")}
          onSearch={handleLoadLichSu}
          isLoading={isLoading}
          onOpenFilterDrawer={() => setShowMobileFilterDrawer(true)}
          activeFilterCount={activeFilterCount}
          allTime={allTime}
          onAllTimeChange={setAllTime}
          onExportExcel={() => handleExportExcel(filteredDataTable)}
          onReset={handleReset}
          totalRecords={inspectiondatatable.length}
          filteredRecords={filteredDataTable.length}
        />
      )}

      {/* 4. Khung Bảng Lịch Sử Input Liệu AGTable */}
      <div className={`precision-inputlieu-grid-container${isMobile ? " is-mobile" : ""}`}>
        {/* Thanh Lọc Nhanh & Thao Tác Bảng - Chỉ hiển thị trên Desktop vì Mobile đã tích hợp trên Toolbar */}
        {!isMobile && (
          <div className="precision-inputlieu-grid-toolbar">
            <div className="precision-inputlieu-grid-toolbar__left">
              <div className="precision-inputlieu-grid-toolbar__search">
                <FiSearch size={11} color="#64748b" />
                <input
                  type="text"
                  placeholder="Tìm mã YCSX, PLAN, liệu, lot, máy, nhân viên..."
                  value={quickSearchText}
                  onChange={(e) => setQuickSearchText(e.target.value)}
                />
              </div>
              <div className="precision-inputlieu-grid-toolbar__stats">
                <span>Đang hiển thị: </span>
                <strong>{filteredDataTable.length}</strong> /{" "}
                <span>{inspectiondatatable.length} bản ghi</span>
              </div>
            </div>

            <div className="precision-inputlieu-grid-toolbar__actions">
              <button
                type="button"
                className="btn-grid-action btn-grid-action--excel"
                onClick={() => handleExportExcel(filteredDataTable)}
                title="Xuất Excel dữ liệu đang lọc trên bảng"
              >
                <FiDownload size={11} />
                <span>Xuất Bảng Này</span>
              </button>
            </div>
          </div>
        )}

        {/* Thân Bảng AGTable */}
        <div className="precision-inputlieu-grid-body">
          <AGTable
            toolbar={null}
            suppressRowClickSelection={false}
            columns={columns}
            data={filteredDataTable}
            onCellEditingStopped={() => {}}
            onRowClick={() => {}}
            onSelectionChange={() => {}}
          />
        </div>
      </div>

      {/* 5. Mobile Filter Drawer (Zero Blur GPU-friendly Bottom Sheet) */}
      {isMobile && (
        <PrecisionLichSuInputLieuMobileFilterDrawer
          isOpen={showMobileFilterDrawer}
          onClose={() => setShowMobileFilterDrawer(false)}
          fromDate={fromDate}
          toDate={toDate}
          allTime={allTime}
          prodRequestNo={prodRequestNo}
          planId={planId}
          codeCMS={codeCMS}
          codeKD={codeKD}
          mName={mName}
          mCode={mCode}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onAllTimeChange={setAllTime}
          onProdRequestNoChange={setProdRequestNo}
          onPlanIdChange={setPlanId}
          onCodeCMSChange={setCodeCMS}
          onCodeKDChange={setCodeKD}
          onMNameChange={setMName}
          onMCodeChange={setMCode}
          onApply={handleLoadLichSu}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default LICHSUINPUTLIEU;
