import { IconButton } from "@mui/material";
import React from "react";
import { MdRefresh } from "react-icons/md";
import AGTable from "../../../components/DataTable/AGTable";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import { DaoFilmReportBackData } from "../utils/daoFilmReportUtils";
import "./DAOFILM_REPORT.scss";
import PrecisionDaoFilmReportDesktopTop from "./PrecisionDaoFilmReport/PrecisionDaoFilmReportDesktopTop";
import PrecisionDaoFilmReportMobileChartsModal from "./PrecisionDaoFilmReport/PrecisionDaoFilmReportMobileChartsModal";
import PrecisionDaoFilmReportMobileFilterDrawer from "./PrecisionDaoFilmReport/PrecisionDaoFilmReportMobileFilterDrawer";
import PrecisionDaoFilmReportMobileHeader from "./PrecisionDaoFilmReport/PrecisionDaoFilmReportMobileHeader";
import PrecisionDaoFilmReportMobileKpi from "./PrecisionDaoFilmReport/PrecisionDaoFilmReportMobileKpi";
import PrecisionDaoFilmReportMobileToolbar from "./PrecisionDaoFilmReport/PrecisionDaoFilmReportMobileToolbar";
import { useDaoFilmReportColumns } from "./PrecisionDaoFilmReport/PrecisionDaoFilmReportColumns";
import { useDaoFilmReportData } from "./PrecisionDaoFilmReport/useDaoFilmReportData";
import "./PrecisionDaoFilmReport/PrecisionDaoFilmReport.scss";

const DAOFILM_REPORT = () => {
  const isMobile = useIsMobile();
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    useAllTime,
    setUseAllTime,
    tableData,
    filteredTableData,
    detailTableData,
    filteredDetailTableData,
    selectedKnife,
    setSelectedKnife,
    widgetData,
    usagePieData,
    exportPieData,
    totalUsagePie,
    totalExportPie,
    loading,
    searchKeyword,
    setSearchKeyword,
    activeMobileTab,
    setActiveMobileTab,
    showKpi,
    setShowKpi,
    showChartsModal,
    setShowChartsModal,
    showFilterDrawer,
    setShowFilterDrawer,
    activeFilterCount,
    loadData,
    loadDetailDataByRow,
    resetFilters,
  } = useDaoFilmReportData();

  const { colDefs, detailColDefs } = useDaoFilmReportColumns(isMobile);

  const handleBackDataRowClickDesktop = (params: any) => {
    const clickedRow = params?.data as DaoFilmReportBackData | undefined;
    if (!clickedRow) {
      setSelectedKnife(null);
      return;
    }
    loadDetailDataByRow(clickedRow, false);
  };

  const handleBackDataRowClickMobile = (params: any) => {
    const clickedRow = params?.data as DaoFilmReportBackData | undefined;
    if (!clickedRow) {
      setSelectedKnife(null);
      return;
    }
    loadDetailDataByRow(clickedRow, true);
  };

  const handleApplyMobileFilters = (
    newFromDate: string,
    newToDate: string,
    newUseAllTime: boolean,
  ) => {
    setFromDate(newFromDate);
    setToDate(newToDate);
    setUseAllTime(newUseAllTime);
    setTimeout(() => {
      loadData();
    }, 0);
  };

  // ==========================================
  // 1. MOBILE INTERFACE (<= 768px)
  // ==========================================
  if (isMobile) {
    return (
      <div className="precision-dao-film-report is-mobile">
        {/* Mobile Header Tinh Gọn */}
        <PrecisionDaoFilmReportMobileHeader
          totalRecords={tableData.length}
          filteredRecords={filteredTableData.length}
          widgetData={widgetData}
          loading={loading}
          showKpi={showKpi}
          onToggleKpi={() => setShowKpi(!showKpi)}
          showChartsModal={showChartsModal}
          onToggleChartsModal={() => setShowChartsModal(!showChartsModal)}
          onReload={loadData}
        />

        {/* Micro-KPI Bar Cuộn Ngang (Có thể đóng nhanh để mở rộng diện tích) */}
        {showKpi && (
          <PrecisionDaoFilmReportMobileKpi
            widgetData={widgetData}
            selectedKnife={selectedKnife}
            onClose={() => setShowKpi(false)}
          />
        )}

        {/* Mobile Toolbar 3 Hàng Công Thái Học */}
        <PrecisionDaoFilmReportMobileToolbar
          activeTab={activeMobileTab}
          onChangeTab={setActiveMobileTab}
          totalBackRecords={tableData.length}
          totalDetailRecords={detailTableData.length}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          activeFilterCount={activeFilterCount}
          onOpenFilterDrawer={() => setShowFilterDrawer(true)}
          useAllTime={useAllTime}
          onToggleUseAllTime={() => setUseAllTime(!useAllTime)}
          selectedKnife={selectedKnife}
          filteredCount={
            activeMobileTab === "BACK_DATA"
              ? filteredTableData.length
              : filteredDetailTableData.length
          }
          totalCount={
            activeMobileTab === "BACK_DATA" ? tableData.length : detailTableData.length
          }
        />

        {/* Container Bảng Dữ Liệu Tối Đa Hóa Diện Tích Màn Hình */}
        <div className="precision-dfr-grid-container">
          {activeMobileTab === "BACK_DATA" ? (
            <AGTable
              showFilter={false}
              columns={colDefs}
              data={filteredTableData}
              suppressRowClickSelection={false}
              onRowClick={handleBackDataRowClickMobile}
              onSelectionChange={() => {}}
              onCellEditingStopped={() => {}}
            />
          ) : (
            <>
              <div className="precision-dfr-detail-banner">
                <div className="banner-left">
                  <span>
                    Dao: <strong>{selectedKnife?.MA_DAO || "Chưa chọn dao"}</strong>
                    {selectedKnife?.MA_DAO_KT ? ` (${selectedKnife.MA_DAO_KT})` : ""}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-back-overview"
                  onClick={() => setActiveMobileTab("BACK_DATA")}
                >
                  ⬅ Báo Cáo Tổng Hợp
                </button>
              </div>
              <AGTable
                showFilter={false}
                columns={detailColDefs}
                data={filteredDetailTableData}
                onSelectionChange={() => {}}
                onCellEditingStopped={() => {}}
              />
            </>
          )}
        </div>

        {/* Bottom Sheet Filter Drawer (Zero-Blur GPU-Friendly) */}
        {showFilterDrawer && (
          <PrecisionDaoFilmReportMobileFilterDrawer
            isOpen={showFilterDrawer}
            onClose={() => setShowFilterDrawer(false)}
            fromDate={fromDate}
            toDate={toDate}
            useAllTime={useAllTime}
            onApply={handleApplyMobileFilters}
            onReset={resetFilters}
          />
        )}

        {/* Biểu Đồ Modal (Zero-Blur GPU-Friendly) */}
        {showChartsModal && (
          <PrecisionDaoFilmReportMobileChartsModal
            isOpen={showChartsModal}
            onClose={() => setShowChartsModal(false)}
            usagePieData={usagePieData}
            exportPieData={exportPieData}
            totalUsagePie={totalUsagePie}
            totalExportPie={totalExportPie}
          />
        )}
      </div>
    );
  }

  // ==========================================
  // 2. DESKTOP INTERFACE (> 768px): GIỮ NGUYÊN 100%
  // ==========================================
  return (
    <div className="daoFilmReport">
      {/* Top Panel: 3 Widget Cards + 2 Pie Charts */}
      <PrecisionDaoFilmReportDesktopTop
        widgetData={widgetData}
        usagePieData={usagePieData}
        exportPieData={exportPieData}
        totalUsagePie={totalUsagePie}
        totalExportPie={totalExportPie}
      />

      {/* Bottom Panel: BackData Table + Detail Table */}
      <div className="daoFilmReportBottom">
        <div className="daoFilmBackTablePanel">
          <AGTable
            showFilter={true}
            toolbar={
              <div className="daoFilmReportToolbar">
                <div className="daoFilmToolbarTitle">DAO FILM REPORT</div>

                <label>
                  <span>Tu ngay</span>
                  <input
                    type="date"
                    value={fromDate}
                    disabled={useAllTime}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </label>

                <label>
                  <span>Toi ngay</span>
                  <input
                    type="date"
                    value={toDate}
                    disabled={useAllTime}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </label>

                <label className="defaultMonthCheckbox">
                  <span>All time (2020-01-01 - now)</span>
                  <input
                    type="checkbox"
                    checked={useAllTime}
                    onChange={(e) => setUseAllTime(e.target.checked)}
                  />
                </label>

                <IconButton className="buttonIcon" onClick={() => loadData()}>
                  <MdRefresh color="#0ea5e9" size={18} />
                  Load Data
                </IconButton>
              </div>
            }
            columns={colDefs}
            data={tableData}
            suppressRowClickSelection={false}
            onRowClick={handleBackDataRowClickDesktop}
            onSelectionChange={() => {}}
            onCellEditingStopped={() => {}}
          />
        </div>

        <div className="daoFilmDetailTablePanel">
          <AGTable
            showFilter={true}
            toolbar={
              <div className="daoFilmDetailToolbar">
                <div className="daoFilmToolbarTitle">DAO FILM DETAIL</div>
                <div className="daoFilmSelectedKnife">
                  {selectedKnife
                    ? `${selectedKnife.MA_DAO} | ${selectedKnife.MA_DAO_KT}`
                    : "Click 1 dong o bang backdata de xem chi tiet"}
                </div>
              </div>
            }
            columns={detailColDefs}
            data={detailTableData}
            onSelectionChange={() => {}}
            onCellEditingStopped={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default DAOFILM_REPORT;
