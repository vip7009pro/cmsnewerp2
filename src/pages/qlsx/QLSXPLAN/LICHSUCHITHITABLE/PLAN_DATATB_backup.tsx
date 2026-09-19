import React, { useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "./PrecisionPlanDataTb/PrecisionPlanDataTb.scss";
import { usePlanDataTbOldData } from "./PrecisionPlanDataTb/usePlanDataTbOldData";
import { getPlanDataTableColumns } from "./PrecisionPlanDataTb/PrecisionPlanDataTbColumns";
import { PrecisionPlanDataTbHeader } from "./PrecisionPlanDataTb/PrecisionPlanDataTbHeader";
import { PrecisionPlanDataTbToolbar } from "./PrecisionPlanDataTb/PrecisionPlanDataTbToolbar";
import { PrecisionPlanDataTbDangKyLieuModal } from "./PrecisionPlanDataTb/PrecisionPlanDataTbDangKyLieuModal";
import { PrecisionPlanDataTbPrintModals } from "./PrecisionPlanDataTb/PrecisionPlanDataTbPrintModals";

const PLAN_DATATB_OLD = () => {
  const [selectedRowCount, setSelectedRowCount] = React.useState(0);
  const {
    userData,
    myComponentRef,
    gridRef,
    gridMaterialRef,
    ycsxprintref,
    clickedRow,
    qlsxplandatafilter,
    qlsxchithidatafilter,
    showQuickPlan,
    setShowQuickPlan,
    showkhoao,
    setShowKhoAo,
    maxLieu,
    setMaxLieu,
    chithidatatable,
    setChiThiDataTable,
    selectedPlan,
    showhideM,
    setShowHideM,
    machine_list,
    showChiThi,
    setShowChiThi,
    showChiThi2,
    setShowChiThi2,
    showBV,
    setShowBV,
    isLoading,
    actionLoading,
    actionProgress,
    actionLoadingLabel,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    factory,
    setFactory,
    machine,
    setMachine,
    plandatatable,
    summarydata,
    ycsxlistrender,
    chithilistrender,
    chithilistrender2,
    setYCSXListRender,
    setChiThiListRender,
    setChiThiListRender2,
    handlePrint,
    clearSelectedMaterialRows,
    onSelectionChanged,
    selectMaterialRow,
    loadQLSXPlan,
    handleConfirmMovePlan,
    handleConfirmDeletePlan,
    handleConfirmUpdatePlan,
    handleConfirmDeleteLieu,
    handleConfirmRESETLIEU,
    handleConfirmDKXL,
    handle_xuatdao_sample,
    handle_xuatlieu_sample,
    handleSelectRowPlan,
    handleOpenDangKyLieu,
    handlePrintChiThi,
    handlePrintChiThiCombo,
    handlePrintBanVe,
  } = usePlanDataTbOldData();

  const defaultColDef = useMemo(
    () => ({
      initialWidth: 100,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      editable: false,
      floatingFilter: true,
      filter: true,
      headerCheckboxSelectionFilteredOnly: true,
    }),
    []
  );

  const getRowStyle = useCallback((params: any) => {
    const eqNum = Number(params.data?.PLAN_EQ?.substring(2, 4));
    if (!isNaN(eqNum) && eqNum % 2 === 0) {
      return { backgroundColor: "#ffffff", fontSize: "0.68rem" };
    }
    return { backgroundColor: "#f8fafc", fontSize: "0.68rem" };
  }, []);

  const columns = useMemo(
    () => getPlanDataTableColumns((planData) => handleOpenDangKyLieu(planData)),
    [handleOpenDangKyLieu]
  );

  return (
    <div className={`precision-plandatatb${actionLoading ? " is-action-loading" : ""}`}>
      {actionLoading && (
        <div className="precision-plandatatb__action-overlay" role="status" aria-live="polite">
          <span className="precision-plandatatb__action-spinner" />
          <div className="precision-plandatatb__action-copy">
            <strong>{actionProgress}%</strong>
            <span>{actionLoadingLabel}</span>
            <div className="precision-plandatatb__progress-track">
              <div className="precision-plandatatb__progress-value" style={{ width: `${actionProgress}%` }} />
            </div>
          </div>
        </div>
      )}
      {/* 1. Header & KPI Telemetry */}
      <PrecisionPlanDataTbHeader
        plandatatable={plandatatable}
        summarydata={summarydata}
        fromdate={fromdate}
      />

      {/* 2. Filter & Action Toolbar */}
      <PrecisionPlanDataTbToolbar
        fromdate={fromdate}
        setFromDate={setFromDate}
        todate={todate}
        setToDate={setToDate}
        factory={factory}
        setFactory={setFactory}
        machine={machine}
        setMachine={setMachine}
        machine_list={machine_list}
        plandatatable={plandatatable}
        isLoading={isLoading}
        actionLoading={actionLoading}
        actionProgress={actionProgress}
        onTraPlan={() => loadQLSXPlan(fromdate)}
        onToggleQuickPlan={() => setShowQuickPlan(!showQuickPlan)}
        onMovePlan={handleConfirmMovePlan}
        onDeletePlan={handleConfirmDeletePlan}
        onUpdatePlan={handleConfirmUpdatePlan}
        onPrintChiThi={handlePrintChiThi}
        onPrintChiThiCombo={handlePrintChiThiCombo}
        onPrintBanVe={handlePrintBanVe}
      />

      {/* 3. Main Data Grid */}
      <div className="precision-plandatatb__grid-container">
        <div className="ag-theme-quartz" style={{ height: "100%", width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={plandatatable}
            columnDefs={columns as any}
            rowHeight={25}
            defaultColDef={defaultColDef}
            columnHoverHighlight={true}
            getRowStyle={getRowStyle}
            getRowId={(params: any) => params.data.PLAN_ID}
            rowSelection="multiple"
            rowMultiSelectWithClick={true}
            suppressRowClickSelection={true}
            enterNavigatesVertically={true}
            enterNavigatesVerticallyAfterEdit={true}
            stopEditingWhenCellsLoseFocus={true}
            rowBuffer={10}
            debounceVerticalScrollbar={false}
            enableCellTextSelection={true}
            floatingFiltersHeight={23}
            onSelectionChanged={(params: any) => {
              onSelectionChanged();
              setSelectedRowCount(params?.api?.getSelectedRows?.().length ?? 0);
            }}
            onRowClicked={(params: any) => handleSelectRowPlan(params.data)}
            onRowDoubleClicked={(params: any) => handleOpenDangKyLieu(params.data)}
          />
        </div>
        <div className="precision-plandatatb__grid-footer" role="status" aria-live="polite">
          <span>Tổng dòng: <strong>{plandatatable.length}</strong></span>
          <span>Đã chọn: <strong>{selectedRowCount}</strong></span>
        </div>
      </div>

      {/* 4. Modal Đăng Ký Liệu */}
      <PrecisionPlanDataTbDangKyLieuModal
        showhideM={showhideM}
        onClose={() => {
          setShowHideM(false);
          clearSelectedMaterialRows();
          loadQLSXPlan(fromdate);
        }}
        selectedPlan={selectedPlan}
        chithidatatable={chithidatatable}
        setChiThiDataTable={setChiThiDataTable}
        gridMaterialRef={gridMaterialRef}
        qlsxchithidatafilter={qlsxchithidatafilter}
        clickedRow={clickedRow}
        userData={userData}
        selectMaterialRow={selectMaterialRow}
        handleConfirmDKXL={handleConfirmDKXL}
        handleConfirmDeleteLieu={handleConfirmDeleteLieu}
        handleConfirmRESETLIEU={handleConfirmRESETLIEU}
        handle_xuatdao_sample={handle_xuatdao_sample}
        handle_xuatlieu_sample={handle_xuatlieu_sample}
        showkhoao={showkhoao}
        setShowKhoAo={setShowKhoAo}
      />

      {/* 5. Bộ Modal In Ấn (Chỉ Thị, Combo, Bản Vẽ, Kho Ảo, Quick Plan) */}
      <PrecisionPlanDataTbPrintModals
        showChiThi={showChiThi}
        setShowChiThi={setShowChiThi}
        showChiThi2={showChiThi2}
        setShowChiThi2={setShowChiThi2}
        showBV={showBV}
        setShowBV={setShowBV}
        showkhoao={showkhoao}
        setShowKhoAo={setShowKhoAo}
        showQuickPlan={showQuickPlan}
        setShowQuickPlan={setShowQuickPlan}
        selectedPlan={selectedPlan}
        qlsxplandatafilter={qlsxplandatafilter}
        maxLieu={maxLieu}
        setMaxLieu={setMaxLieu}
        ycsxprintref={ycsxprintref}
        myComponentRef={myComponentRef}
        handlePrint={handlePrint}
        chithilistrender={chithilistrender}
        chithilistrender2={chithilistrender2}
        ycsxlistrender={ycsxlistrender}
        setChiThiListRender={setChiThiListRender}
        setChiThiListRender2={setChiThiListRender2}
        setYCSXListRender={setYCSXListRender}
      />
    </div>
  );
};

export default PLAN_DATATB_OLD;
