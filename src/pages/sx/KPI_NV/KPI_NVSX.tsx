import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import moment from "moment";
import "./PrecisionKpiNvSx/PrecisionKpiNvSx.scss";
import { useKpiNvSxData } from "./PrecisionKpiNvSx/useKpiNvSxData";
import PrecisionKpiNvSxHeader from "./PrecisionKpiNvSx/PrecisionKpiNvSxHeader";
import PrecisionKpiNvSxToolbar from "./PrecisionKpiNvSx/PrecisionKpiNvSxToolbar";
import PrecisionKpiNvSxKpi from "./PrecisionKpiNvSx/PrecisionKpiNvSxKpi";
import PrecisionKpiNvSxCharts from "./PrecisionKpiNvSx/PrecisionKpiNvSxCharts";
import PrecisionKpiNvSxGrid from "./PrecisionKpiNvSx/PrecisionKpiNvSxGrid";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";
import PrecisionKpiNvSxMobileHeader from "./PrecisionKpiNvSx/PrecisionKpiNvSxMobileHeader";
import PrecisionKpiNvSxMobileKpi from "./PrecisionKpiNvSx/PrecisionKpiNvSxMobileKpi";
import PrecisionKpiNvSxMobileToolbar from "./PrecisionKpiNvSx/PrecisionKpiNvSxMobileToolbar";
import PrecisionKpiNvSxMobileFilterDrawer from "./PrecisionKpiNvSx/PrecisionKpiNvSxMobileFilterDrawer";

const KPI_NVSX: React.FC = () => {
  const isMobile = useIsMobile();

  // Mobile specific UI states
  const [showMobileKpi, setShowMobileKpi] = useState<boolean>(false);
  const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);

  // Giữ GridApi để EX1 xuất đúng các dòng đang hiển thị (search/filter/sort).
  const gridApiRef = useRef<any>(null);
  const handleGridApiReady = useCallback((api: any) => {
    gridApiRef.current = api;
  }, []);

  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    option,
    setOption,
    allTime,
    setAllTime,
    activeTab,
    setActiveTab,
    searchKeyword,
    setSearchKeyword,
    isLoading,
    rawKpiData,
    filteredData,
    columns,
    summaryKpi,
    periodTrendChartData,
    topEmplMetChartData,
    rateDistChartData,
    topEmplQtyChartData,
    loadKpiData,
    handleExportEX1,
    handleExportEX2,
    handleQuickDate,
  } = useKpiNvSxData();

  // Tải dữ liệu ban đầu
  useEffect(() => {
    loadKpiData();
  }, [loadKpiData]);

  // Đếm số điều kiện lọc đang khác mặc định
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (allTime) count++;
    if (option !== "Daily") count++;
    return count;
  }, [allTime, option]);

  // Đặt lại bộ lọc về mặc định
  const handleResetFilter = useCallback(() => {
    setAllTime(false);
    setFromDate(moment().subtract(8, "days").format("YYYY-MM-DD"));
    setToDate(moment().format("YYYY-MM-DD"));
    setOption("Daily");
  }, [setAllTime, setFromDate, setToDate, setOption]);

  const showKpiAndCharts = activeTab === "all" || activeTab === "charts";
  const showGrid = activeTab === "all" || activeTab === "grid";

  return (
    <div className={`precision-kpinvsx ${isMobile ? "is-mobile" : ""}`}>
      {/* 1. Header Bar: Phân biệt Desktop vs Mobile */}
      {!isMobile ? (
        <PrecisionKpiNvSxHeader
          totalRecords={filteredData.length}
          uniqueEmpl={summaryKpi.uniqueEmplCount}
          option={option}
          isLoading={isLoading}
          onReload={loadKpiData}
        />
      ) : (
        <PrecisionKpiNvSxMobileHeader
          totalRecords={rawKpiData.length}
          filteredCount={filteredData.length}
          uniqueEmpl={summaryKpi.uniqueEmplCount}
          option={option}
          isLoading={isLoading}
          showKpi={showMobileKpi}
          onToggleKpi={() => setShowMobileKpi((prev) => !prev)}
          onOpenFilterDrawer={() => setShowMobileFilter(true)}
          onReload={loadKpiData}
          activeFilterCount={activeFilterCount}
        />
      )}

      {/* 2. Dải Micro-KPI cuộn ngang (Mobile Only khi bật) */}
      {isMobile && showMobileKpi && (
        <PrecisionKpiNvSxMobileKpi
          summary={summaryKpi}
          onClose={() => setShowMobileKpi(false)}
        />
      )}

      {/* 3. Action Toolbar: Phân biệt Desktop vs Mobile */}
      {!isMobile ? (
        <PrecisionKpiNvSxToolbar
          fromDate={fromDate}
          toDate={toDate}
          option={option}
          allTime={allTime}
          activeTab={activeTab}
          isLoading={isLoading}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onOptionChange={setOption}
          onAllTimeToggle={() => setAllTime((prev) => !prev)}
          onTabChange={setActiveTab}
          onQuickDate={handleQuickDate}
          onLoadData={loadKpiData}
        />
      ) : (
        <PrecisionKpiNvSxMobileToolbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          option={option}
          allTime={allTime}
          onAllTimeToggle={() => setAllTime((prev) => !prev)}
          onExportEX1={() => handleExportEX1(gridApiRef.current)}
          onExportEX2={handleExportEX2}
          onOpenFilterDrawer={() => setShowMobileFilter(true)}
          onLoadData={loadKpiData}
          activeFilterCount={activeFilterCount}
          filteredCount={filteredData.length}
          totalCount={rawKpiData.length}
          isLoading={isLoading}
        />
      )}

      {/* 4. Nội dung cuộn linh hoạt Full-Height */}
      <div className="precision-kpinvsx__contentBody">
        {/* Phân hệ Desktop: Render cả KPI Cards lớn & Charts */}
        {!isMobile && showKpiAndCharts && (
          <>
            {/* Dashboard 6 Micro-Cards KPI */}
            <PrecisionKpiNvSxKpi summary={summaryKpi} />

            {/* Hệ thống 4 biểu đồ Recharts phong cách KinhDoanhReport */}
            <PrecisionKpiNvSxCharts
              periodTrendData={periodTrendChartData}
              topEmplMetData={topEmplMetChartData}
              rateDistData={rateDistChartData}
              topEmplQtyData={topEmplQtyChartData}
              option={option}
            />
          </>
        )}

        {/* Phân hệ Mobile: Chỉ render Charts khi activeTab là charts hoặc all */}
        {isMobile && showKpiAndCharts && (
          <PrecisionKpiNvSxCharts
            periodTrendData={periodTrendChartData}
            topEmplMetData={topEmplMetChartData}
            rateDistData={rateDistChartData}
            topEmplQtyData={topEmplQtyChartData}
            option={option}
          />
        )}

        {/* Phân hệ Bảng Dữ Liệu AG Grid */}
        {showGrid && (
          <PrecisionKpiNvSxGrid
            columns={columns}
            data={filteredData}
            totalCount={rawKpiData.length}
            searchKeyword={searchKeyword}
            onSearchChange={setSearchKeyword}
            onExportEX1={() => handleExportEX1(gridApiRef.current)}
            onExportEX2={handleExportEX2}
            isMobile={isMobile}
            onGridApiReady={handleGridApiReady}
          />
        )}
      </div>

      {/* 5. Mobile Bottom Sheet Filter Drawer */}
      {isMobile && (
        <PrecisionKpiNvSxMobileFilterDrawer
          isOpen={showMobileFilter}
          onClose={() => setShowMobileFilter(false)}
          fromDate={fromDate}
          toDate={toDate}
          option={option}
          allTime={allTime}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onOptionChange={setOption}
          onAllTimeToggle={() => setAllTime((prev) => !prev)}
          onQuickDate={handleQuickDate}
          onApply={loadKpiData}
          onReset={handleResetFilter}
        />
      )}
    </div>
  );
};

export default React.memo(KPI_NVSX);
