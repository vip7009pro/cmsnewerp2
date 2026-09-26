import React, { useMemo, useState, useCallback } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import "./PrecisionLongTermPlan/PrecisionLongTermPlan.scss";
import useIsMobile from "../../../../components/Navbar/AccountInfo/useIsMobile";
import { useLongTermPlanData } from "./PrecisionLongTermPlan/useLongTermPlanData";
import { getColumnsLongTermPlan } from "./PrecisionLongTermPlan/PrecisionLongTermPlanColumns";
import PrecisionLongTermPlanHeader from "./PrecisionLongTermPlan/PrecisionLongTermPlanHeader";
import PrecisionLongTermPlanToolbar from "./PrecisionLongTermPlan/PrecisionLongTermPlanToolbar";
import PrecisionLongTermCapaSection from "./PrecisionLongTermPlan/PrecisionLongTermCapaSection";
import PrecisionLongTermPlanMobileToolbar from "./PrecisionLongTermPlan/PrecisionLongTermPlanMobileToolbar";
import PrecisionLongTermPlanMobileFilterDrawer from "./PrecisionLongTermPlan/PrecisionLongTermPlanMobileFilterDrawer";
import { FiSearch, FiDownload, FiCheckSquare } from "react-icons/fi";

const LONGTERM_PLAN: React.FC = () => {
  const isMobile = useIsMobile();
  const [showMobileFilterDrawer, setShowMobileFilterDrawer] = useState<boolean>(false);
  const [showMobileCapa, setShowMobileCapa] = useState<boolean>(false);

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

  // Đếm số điều kiện lọc tùy chỉnh đang áp dụng (để hiển thị badge trên mobile)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (machine !== "ALL") count++;
    if (factory !== "NM1") count++;
    if (todate.slice(0, 10) !== fromdate.slice(0, 10)) count++;
    return count;
  }, [machine, factory, todate, fromdate]);

  // Đặt lại bộ lọc mobile về mặc định
  const handleResetMobileFilter = useCallback(() => {
    setFactory("NM1");
    setMachine("ALL");
    setToDate(fromdate);
  }, [fromdate, setFactory, setMachine, setToDate]);

  return (
    <div className={`precision-longterm-plan${isMobile ? " is-mobile" : ""}`}>
      {/* 1. Header Bar công nghiệp - Chỉ render trên Desktop */}
      {!isMobile && (
        <PrecisionLongTermPlanHeader
          fromDate={fromdate}
          totalPlans={longterm_plan.length}
          selectedMachine={machine}
          isLoading={isLoading}
          onReload={handleSearchAll}
        />
      )}

      {/* 2. Dải Lọc Điều Hành & Nhóm Nút Thao Tác - Desktop */}
      {!isMobile && (
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
      )}

      {/* 2B. Toolbar Thích Ứng Công Thái Học 2 Hàng - Mobile */}
      {isMobile && (
        <PrecisionLongTermPlanMobileToolbar
          quickSearchText={quickSearchText}
          onQuickSearchChange={setQuickSearchText}
          onClearSearch={() => setQuickSearchText("")}
          onSearch={handleSearchAll}
          isLoading={isLoading}
          onOpenFilterDrawer={() => setShowMobileFilterDrawer(true)}
          activeFilterCount={activeFilterCount}
          onMovePlan={handleConfirmMovePlan}
          onDeletePlan={handleConfirmDeletePlan}
          onExportExcel={handleExportPlanExcel}
          onClearSelection={handleClearSelection}
          totalPlans={longterm_plan.length}
          filteredPlans={filteredLongTermPlan.length}
          showCapa={showMobileCapa}
          onToggleCapa={() => setShowMobileCapa((prev) => !prev)}
        />
      )}

      {/* 3. Phân Hệ Biểu Đồ Năng Lực Sản Xuất (Hiển thị cố định trên Desktop, toggle mở rộng trên Mobile) */}
      {(!isMobile || showMobileCapa) && (
        <div className={isMobile ? "precision-longterm-mobile-capa-wrapper" : undefined}>
          <PrecisionLongTermCapaSection
            capaData={productionplancapadata}
            activeTab={activeCapaTab}
            isCollapsed={isCapaCollapsed}
            onTabChange={setActiveCapaTab}
            onToggleCollapse={() => setIsCapaCollapsed(!isCapaCollapsed)}
          />
        </div>
      )}

      {/* 4. Khung Bảng Kế Hoạch Dài Hạn AGTable */}
      <div className={`precision-longterm-grid-container${isMobile ? " is-mobile" : ""}`}>
        {/* Thanh Lọc Nhanh & Thao Tác Bảng - Chỉ hiển thị trên Desktop vì Mobile đã tích hợp trên Toolbar */}
        {!isMobile && (
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
        )}

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

      {/* 5. Mobile Filter Drawer (Zero Blur GPU-friendly Bottom Sheet) */}
      {isMobile && (
        <PrecisionLongTermPlanMobileFilterDrawer
          isOpen={showMobileFilterDrawer}
          onClose={() => setShowMobileFilterDrawer(false)}
          fromDate={fromdate}
          toDate={todate}
          factory={factory}
          machine={machine}
          machineList={machine_list}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onFactoryChange={setFactory}
          onMachineChange={setMachine}
          onApply={handleSearchAll}
          onReset={handleResetMobileFilter}
          onMovePlan={handleConfirmMovePlan}
        />
      )}
    </div>
  );
};

export default LONGTERM_PLAN;
