import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import "./PrecisionLongTermPlan/PrecisionLongTermPlan.scss";
import { useLongTermPlanData } from "./PrecisionLongTermPlan/useLongTermPlanData";
import { getColumnsLongTermPlan } from "./PrecisionLongTermPlan/PrecisionLongTermPlanColumns";
import PrecisionLongTermPlanHeader from "./PrecisionLongTermPlan/PrecisionLongTermPlanHeader";
import PrecisionLongTermPlanToolbar from "./PrecisionLongTermPlan/PrecisionLongTermPlanToolbar";
import PrecisionLongTermCapaSection from "./PrecisionLongTermPlan/PrecisionLongTermCapaSection";
import { FiSearch, FiDownload, FiCheckSquare } from "react-icons/fi";

const LONGTERM_PLAN: React.FC = () => {
  const {
    machine_list,
    productionplancapadata,
    longterm_plan,
    filteredLongTermPlan,
    fromdate,
    todate,
    factory,
    machine,
    quickSearchText,
    activeCapaTab,
    isCapaCollapsed,
    isLoading,
    setFromDate,
    setToDate,
    setFactory,
    setMachine,
    setQuickSearchText,
    setActiveCapaTab,
    setIsCapaCollapsed,
    handleSearchAll,
    handleConfirmMovePlan,
    handleConfirmDeletePlan,
    handleCellEditingStopped,
    handleRowClick,
    handleSelectionChange,
    handleClearSelection,
    handleExportPlanExcel,
  } = useLongTermPlanData();

  // Định nghĩa 25 cột bảng kế hoạch dài hạn (16 ngày liên tiếp)
  const columnsLongTermPlan = useMemo(
    () => getColumnsLongTermPlan({ fromDate: fromdate }),
    [fromdate]
  );

  return (
    <div className="precision-longterm-plan">
      {/* 1. Header Bar công nghiệp */}
      <PrecisionLongTermPlanHeader
        fromDate={fromdate}
        totalPlans={longterm_plan.length}
        selectedMachine={machine}
        isLoading={isLoading}
        onReload={handleSearchAll}
      />

      {/* 2. Dải Lọc Điều Hành & Nhóm Nút Thao Tác */}
      <PrecisionLongTermPlanToolbar
        fromDate={fromdate}
        toDate={todate}
        factory={factory}
        machine={machine}
        machineList={machine_list}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onFactoryChange={setFactory}
        onMachineChange={setMachine}
        onSearch={handleSearchAll}
        onMovePlan={handleConfirmMovePlan}
        onDeletePlan={handleConfirmDeletePlan}
        onExportExcel={handleExportPlanExcel}
      />

      {/* 3. Phân Hệ Biểu Đồ Năng Lực Sản Xuất (Chuẩn KinhDoanhReport Executive Cards) */}
      <PrecisionLongTermCapaSection
        capaData={productionplancapadata}
        activeTab={activeCapaTab}
        isCollapsed={isCapaCollapsed}
        onTabChange={setActiveCapaTab}
        onToggleCollapse={() => setIsCapaCollapsed(!isCapaCollapsed)}
      />

      {/* 4. Khung Bảng Kế Hoạch Dài Hạn AGTable */}
      <div className="precision-longterm-grid-container">
        {/* Thanh Lọc Nhanh & Thao Tác Bảng */}
        <div className="precision-longterm-grid-toolbar">
          <div className="precision-longterm-grid-toolbar__left">
            <div className="precision-longterm-grid-toolbar__search">
              <FiSearch size={11} color="#64748b" />
              <input
                type="text"
                placeholder="Tìm mã G_CODE, G_NAME, máy..."
                value={quickSearchText}
                onChange={(e) => setQuickSearchText(e.target.value)}
              />
            </div>
            <div className="precision-longterm-grid-toolbar__stats">
              <span>Đang hiển thị: </span>
              <strong>{filteredLongTermPlan.length}</strong> /{" "}
              <span>{longterm_plan.length} lệnh</span>
            </div>
          </div>

          <div className="precision-longterm-grid-toolbar__actions">
            <button
              type="button"
              className="btn-grid-action btn-grid-action--clear"
              onClick={handleClearSelection}
              title="Bỏ chọn tất cả dòng trên bảng"
            >
              <FiCheckSquare size={11} />
              <span>Bỏ chọn</span>
            </button>

            <button
              type="button"
              className="btn-grid-action btn-grid-action--excel"
              onClick={handleExportPlanExcel}
              title="Xuất Excel bảng kế hoạch đang hiển thị"
            >
              <FiDownload size={11} />
              <span>Xuất Excel</span>
            </button>
          </div>
        </div>

        {/* Thân Bảng AGTable */}
        <div className="precision-longterm-grid-body">
          <AGTable
            toolbar={null}
            suppressRowClickSelection={false}
            columns={columnsLongTermPlan}
            data={filteredLongTermPlan}
            onCellEditingStopped={handleCellEditingStopped}
            onRowClick={handleRowClick}
            onSelectionChange={handleSelectionChange}
          />
        </div>
      </div>
    </div>
  );
};

export default LONGTERM_PLAN;
