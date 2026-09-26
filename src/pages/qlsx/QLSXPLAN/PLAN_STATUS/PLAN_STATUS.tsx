import React, { useCallback, useMemo, useState } from "react";
import moment from "moment";
import AGTable from "../../../../components/DataTable/AGTable";
import useIsMobile from "../../../../components/Navbar/AccountInfo/useIsMobile";
import { usePlanStatusData } from "./PrecisionPlanStatus/usePlanStatusData";
import { PrecisionPlanStatusHeader } from "./PrecisionPlanStatus/PrecisionPlanStatusHeader";
import { PrecisionPlanStatusKpi } from "./PrecisionPlanStatus/PrecisionPlanStatusKpi";
import { PrecisionPlanStatusToolbar } from "./PrecisionPlanStatus/PrecisionPlanStatusToolbar";
import { PrecisionPlanStatusMobileToolbar } from "./PrecisionPlanStatus/PrecisionPlanStatusMobileToolbar";
import { PrecisionPlanStatusMobileFilterDrawer } from "./PrecisionPlanStatus/PrecisionPlanStatusMobileFilterDrawer";
import { PrecisionPlanStatusMobileKpi } from "./PrecisionPlanStatus/PrecisionPlanStatusMobileKpi";
import { PrecisionPlanStatusCardItem } from "./PrecisionPlanStatus/PrecisionPlanStatusCardItem";
import { column_plan_status } from "./PrecisionPlanStatus/PrecisionPlanStatusColumns";
import "./PrecisionPlanStatus/PrecisionPlanStatus.scss";

const PLAN_STATUS: React.FC = () => {
  const isMobile = useIsMobile();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showKpiSummary, setShowKpiSummary] = useState(false);

  const {
    fromdate,
    setFromDate,
    todate,
    setToDate,
    codeKD,
    setCodeKD,
    codeCMS,
    setCodeCMS,
    machine,
    setMachine,
    factory,
    setFactory,
    prodrequestno,
    setProdRequestNo,
    plan_id,
    setPlanID,
    alltime,
    setAllTime,
    machine_list,
    datasxtable,
    filteredData,
    isLoading,
    readyRender,
    viewMode,
    setViewMode,
    quickSearch,
    setQuickSearch,
    autoRefreshInterval,
    toggleAutoRefresh,
    handle_loadplanStatus,
    handleExportExcel,
  } = usePlanStatusData();

  // Đặt lại bộ lọc về mặc định
  const handleResetFilter = useCallback(() => {
    const today = moment().format("YYYY-MM-DD");
    setFromDate(today);
    setToDate(today);
    setCodeKD("");
    setCodeCMS("");
    setMachine("ALL");
    setFactory("ALL");
    setProdRequestNo("");
    setPlanID("");
    setAllTime(false);
    setQuickSearch("");
  }, [
    setFromDate,
    setToDate,
    setCodeKD,
    setCodeCMS,
    setMachine,
    setFactory,
    setProdRequestNo,
    setPlanID,
    setAllTime,
    setQuickSearch,
  ]);

  // Đếm số lượng điều kiện lọc đang active
  const activeFilterCount = useMemo(() => {
    let count = 0;
    const today = moment().format("YYYY-MM-DD");
    if (fromdate.slice(0, 10) !== today || todate.slice(0, 10) !== today) count++;
    if (alltime) count++;
    if (codeKD.trim() !== "") count++;
    if (codeCMS.trim() !== "") count++;
    if (prodrequestno.trim() !== "") count++;
    if (plan_id.trim() !== "") count++;
    if (factory !== "ALL") count++;
    if (machine !== "ALL") count++;
    return count;
  }, [
    fromdate,
    todate,
    alltime,
    codeKD,
    codeCMS,
    prodrequestno,
    plan_id,
    factory,
    machine,
  ]);

  // AGTable Grid View
  const gridTable = useMemo(
    () => (
      <div className="table-view-container">
        <AGTable
          columns={column_plan_status}
          data={filteredData}
          showFilter={true}
        />
      </div>
    ),
    [filteredData]
  );

  return (
    <div className={`precision-plan-status ${isMobile ? "is-mobile" : ""}`}>
      {/* 1. DESKTOP ONLY: Header công nghiệp chuẩn Google Stitch */}
      {!isMobile && (
        <PrecisionPlanStatusHeader
          totalCount={filteredData.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          autoRefreshInterval={autoRefreshInterval}
          onToggleAutoRefresh={toggleAutoRefresh}
          onRefresh={() => handle_loadplanStatus(false)}
          onExportExcel={handleExportExcel}
          loading={isLoading}
        />
      )}

      {/* 2. DESKTOP ONLY: KPI Dashboard 6 thẻ realtime */}
      {!isMobile && <PrecisionPlanStatusKpi data={datasxtable} />}

      {/* 3. DESKTOP ONLY: Top Toolbar compact 2 hàng */}
      {!isMobile && (
        <PrecisionPlanStatusToolbar
          fromdate={fromdate}
          setFromDate={setFromDate}
          todate={todate}
          setToDate={setToDate}
          codeKD={codeKD}
          setCodeKD={setCodeKD}
          codeCMS={codeCMS}
          setCodeCMS={setCodeCMS}
          prodrequestno={prodrequestno}
          setProdRequestNo={setProdRequestNo}
          plan_id={plan_id}
          setPlanID={setPlanID}
          factory={factory}
          setFactory={setFactory}
          machine={machine}
          setMachine={setMachine}
          alltime={alltime}
          setAllTime={setAllTime}
          machineList={machine_list}
          quickSearch={quickSearch}
          setQuickSearch={setQuickSearch}
          onSearch={() => handle_loadplanStatus(false)}
          loading={isLoading}
        />
      )}

      {/* 4. MOBILE ONLY: Mobile Toolbar 2 hàng công thái học */}
      {isMobile && (
        <PrecisionPlanStatusMobileToolbar
          quickSearch={quickSearch}
          onQuickSearchChange={setQuickSearch}
          onClearSearch={() => setQuickSearch("")}
          onSearch={() => handle_loadplanStatus(false)}
          loading={isLoading}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenFilterDrawer={() => setIsMobileFilterOpen(true)}
          activeFilterCount={activeFilterCount}
          totalRecords={datasxtable.length}
          filteredRecords={filteredData.length}
          alltime={alltime}
          onAllTimeChange={setAllTime}
          autoRefreshInterval={autoRefreshInterval}
          onToggleAutoRefresh={toggleAutoRefresh}
          onRefresh={() => handle_loadplanStatus(false)}
          onExportExcel={handleExportExcel}
          onReset={handleResetFilter}
          showKpiSummary={showKpiSummary}
          onToggleKpiSummary={() => setShowKpiSummary((prev) => !prev)}
        />
      )}

      {/* 5. MOBILE ONLY: Mini KPI Bar (Collapsible khi bật) */}
      {isMobile && showKpiSummary && (
        <PrecisionPlanStatusMobileKpi
          data={datasxtable}
          onClose={() => setShowKpiSummary(false)}
        />
      )}

      {/* 6. KHỐI NỘI DUNG CHÍNH (Chuyển đổi Luồng Thẻ hoặc Bảng Lưới) */}
      <div className="precision-plan-status-content">
        {viewMode === "cards" && (
          <div className="cards-view-scroll">
            {readyRender && filteredData.length > 0 ? (
              filteredData.map((element, index) => (
                <PrecisionPlanStatusCardItem
                  key={element.PLAN_ID || index}
                  DATA={element}
                />
              ))
            ) : (
              <div className="empty-state">
                <span>
                  {isLoading
                    ? "Đang tải dữ liệu trạng thái chỉ thị..."
                    : "Không có dữ liệu phù hợp"}
                </span>
              </div>
            )}
          </div>
        )}

        {viewMode === "table" && gridTable}
      </div>

      {/* 7. MOBILE ONLY: Bottom Sheet Filter Drawer */}
      {isMobile && (
        <PrecisionPlanStatusMobileFilterDrawer
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          fromdate={fromdate}
          setFromDate={setFromDate}
          todate={todate}
          setToDate={setToDate}
          alltime={alltime}
          setAllTime={setAllTime}
          plan_id={plan_id}
          setPlanID={setPlanID}
          prodrequestno={prodrequestno}
          setProdRequestNo={setProdRequestNo}
          codeCMS={codeCMS}
          setCodeCMS={setCodeCMS}
          codeKD={codeKD}
          setCodeKD={setCodeKD}
          factory={factory}
          setFactory={setFactory}
          machine={machine}
          setMachine={setMachine}
          machineList={machine_list}
          onApply={() => handle_loadplanStatus(false)}
          onReset={handleResetFilter}
        />
      )}
    </div>
  );
};

export default PLAN_STATUS;
