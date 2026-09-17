import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { usePlanStatusData } from "./PrecisionPlanStatus/usePlanStatusData";
import { PrecisionPlanStatusHeader } from "./PrecisionPlanStatus/PrecisionPlanStatusHeader";
import { PrecisionPlanStatusKpi } from "./PrecisionPlanStatus/PrecisionPlanStatusKpi";
import { PrecisionPlanStatusToolbar } from "./PrecisionPlanStatus/PrecisionPlanStatusToolbar";
import { PrecisionPlanStatusCardItem } from "./PrecisionPlanStatus/PrecisionPlanStatusCardItem";
import { column_plan_status } from "./PrecisionPlanStatus/PrecisionPlanStatusColumns";
import "./PrecisionPlanStatus/PrecisionPlanStatus.scss";

const PLAN_STATUS: React.FC = () => {
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
    <div className="precision-plan-status">
      {/* 1. Header công nghiệp chuẩn Google Stitch */}
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

      {/* 2. KPI Dashboard 6 thẻ realtime */}
      <PrecisionPlanStatusKpi data={datasxtable} />

      {/* 3. Top Toolbar compact 2 hàng & ô Quick Search */}
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

      {/* 4. Khối nội dung chính (Chuyển đổi Luồng Thẻ hoặc Bảng Lưới) */}
      <div className="precision-plan-status-content">
        {viewMode === "cards" && (
          <div className="cards-view-scroll">
            {readyRender && filteredData.length > 0 ? (
              filteredData.map((element, index) => (
                <PrecisionPlanStatusCardItem key={element.PLAN_ID || index} DATA={element} />
              ))
            ) : (
              <div className="empty-state">
                <span>{isLoading ? "Đang tải dữ liệu trạng thái chỉ thị..." : "Không có dữ liệu phù hợp"}</span>
              </div>
            )}
          </div>
        )}

        {viewMode === "table" && gridTable}
      </div>
    </div>
  );
};

export default PLAN_STATUS;
